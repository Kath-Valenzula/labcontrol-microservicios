param(
    [string]$EnvFile = ".env",
    [string]$ComposeFile = "docker-compose.cloud.yml",
    [string]$Correo = "maria@institucion.cl",
    [string]$Password = "Admin123",
    [switch]$KeepUp,
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

function Get-IdValue {
    param(
        [Parameter(Mandatory = $true)]$Obj,
        [Parameter(Mandatory = $true)][string[]]$Names
    )
    foreach ($name in $Names) {
        if ($Obj.PSObject.Properties.Name -contains $name) {
            return $Obj.$name
        }
    }
    return $null
}

function Wait-Url {
    param([string]$Url, [int]$Retries = 20, [int]$DelaySeconds = 5)
    for ($i = 0; $i -lt $Retries; $i++) {
        try {
            $resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) {
                return $true
            }
        } catch {
            Start-Sleep -Seconds $DelaySeconds
        }
    }
    return $false
}

function Wait-Tcp {
    param([string]$HostName, [int]$Port, [int]$Retries = 30, [int]$DelaySeconds = 5)
    for ($i = 0; $i -lt $Retries; $i++) {
        try {
            $client = New-Object System.Net.Sockets.TcpClient
            $iar = $client.BeginConnect($HostName, $Port, $null, $null)
            $connected = $iar.AsyncWaitHandle.WaitOne(2000, $false) -and $client.Connected
            $client.Close()
            if ($connected) {
                return $true
            }
        } catch {
            # ignore
        }
        Start-Sleep -Seconds $DelaySeconds
    }
    return $false
}

function Compose {
    param([string[]]$ComposeArgs)
    docker compose -f $ComposeFile --env-file $EnvFile @ComposeArgs
}

if (-not (Test-Path $EnvFile)) {
    throw "No existe $EnvFile. Copia .env.example y completa los valores."
}

$upArgs = @("up", "-d")
if (-not $SkipBuild) {
    $upArgs += "--build"
}
Compose -ComposeArgs $upArgs

try {
    $frontendReady = Wait-Url -Url "http://localhost:4200"
    if (-not $frontendReady) {
        throw "Frontend no responde en http://localhost:4200"
    }

    $usuariosReady = Wait-Tcp -HostName "localhost" -Port 8080
    if (-not $usuariosReady) {
        throw "Usuarios no responde en el puerto 8080"
    }
    $labsReady = Wait-Tcp -HostName "localhost" -Port 8081
    if (-not $labsReady) {
        throw "Laboratorios no responde en el puerto 8081"
    }
    $reservasReady = Wait-Tcp -HostName "localhost" -Port 8083
    if (-not $reservasReady) {
        throw "Reservas no responde en el puerto 8083"
    }
    $resultadosReady = Wait-Tcp -HostName "localhost" -Port 8084
    if (-not $resultadosReady) {
        throw "Resultados no responde en el puerto 8084"
    }

    $base = "http://localhost:4200/api"
    $auth = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$Correo`:$Password"))
    $headers = @{ Authorization = "Basic $auth" }

    $loginBody = @{ correo = $Correo; password = $Password } | ConvertTo-Json -Compress
    $proxyOk = $false
    $proxyError = $null
    for ($i = 0; $i -lt 20; $i++) {
        try {
            Invoke-RestMethod -Method Get -Uri "$base/usuarios" -Headers $headers -TimeoutSec 5 | Out-Null
            $proxyOk = $true
            break
        } catch {
            $proxyError = $_
            Start-Sleep -Seconds 4
        }
    }
    if (-not $proxyOk) {
        throw "Proxy /api/usuarios no disponible. Ultimo error: $proxyError"
    }

    $loginOk = $false
    $loginError = $null
    for ($i = 0; $i -lt 20; $i++) {
        try {
            Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType "application/json" -Body $loginBody -TimeoutSec 5 | Out-Null
            $loginOk = $true
            break
        } catch {
            $loginError = $_
            Start-Sleep -Seconds 4
        }
    }
    if (-not $loginOk) {
        throw "Login no disponible via /api/auth/login. Ultimo error: $loginError"
    }

    $stamp = (Get-Date -Format "yyyyMMddHHmmss")
    $correo = "demo.$stamp@labcontrol.cl"
    $userBody = @{ nombre = "Demo"; apellido = "E2E"; correo = $correo; password = "Admin123!"; telefono = "999888777" } | ConvertTo-Json -Compress
    $user = Invoke-RestMethod -Method Post -Uri "$base/usuarios" -Headers $headers -ContentType "application/json" -Body $userBody
    $userId = Get-IdValue -Obj $user -Names @("id", "idUsuario")
    if (-not $userId) { throw "No se pudo obtener id de usuario" }

    Invoke-RestMethod -Method Get -Uri "$base/usuarios/$userId" -Headers $headers | Out-Null
    $userUpdateBody = @{ nombre = "Demo"; apellido = "E2E"; correo = $correo; telefono = "888777666" } | ConvertTo-Json -Compress
    Invoke-RestMethod -Method Put -Uri "$base/usuarios/$userId" -Headers $headers -ContentType "application/json" -Body $userUpdateBody | Out-Null

    $labBody = @{ nombre = "Lab E2E $stamp"; ubicacion = "Edificio A"; capacidad = 12; encargadoId = $userId } | ConvertTo-Json -Compress
    $lab = Invoke-RestMethod -Method Post -Uri "$base/laboratorios" -Headers $headers -ContentType "application/json" -Body $labBody
    $labId = Get-IdValue -Obj $lab -Names @("id", "idLab")
    if (-not $labId) { throw "No se pudo obtener id de laboratorio" }

    Invoke-RestMethod -Method Get -Uri "$base/laboratorios/$labId" -Headers $headers | Out-Null
    $labUpdateBody = @{ nombre = "Lab E2E $stamp"; ubicacion = "Edificio B"; capacidad = 14; encargadoId = $userId } | ConvertTo-Json -Compress
    Invoke-RestMethod -Method Put -Uri "$base/laboratorios/$labId" -Headers $headers -ContentType "application/json" -Body $labUpdateBody | Out-Null

    $fecha = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
    $reservaBody = @{ fecha = $fecha; horaInicio = "09:00"; horaFin = "10:00"; idLab = $labId; idUsuario = $userId } | ConvertTo-Json -Compress
    $reserva = Invoke-RestMethod -Method Post -Uri "$base/reservas" -Headers $headers -ContentType "application/json" -Body $reservaBody
    $reservaId = Get-IdValue -Obj $reserva -Names @("id", "idReserva")
    if (-not $reservaId) { throw "No se pudo obtener id de reserva" }

    Invoke-RestMethod -Method Get -Uri "$base/reservas/$reservaId" -Headers $headers | Out-Null
    $reservaUpdateBody = @{ fecha = $fecha; horaInicio = "10:30"; horaFin = "11:30"; idLab = $labId; idUsuario = $userId } | ConvertTo-Json -Compress
    Invoke-RestMethod -Method Put -Uri "$base/reservas/$reservaId" -Headers $headers -ContentType "application/json" -Body $reservaUpdateBody | Out-Null

    $resultadoBody = @{ pacienteId = $userId; laboratorioId = $labId; tipoExamen = "Hemograma"; fecha = $fecha; resultado = "Normal"; observaciones = "E2E" } | ConvertTo-Json -Compress
    $resultado = Invoke-RestMethod -Method Post -Uri "$base/resultados" -Headers $headers -ContentType "application/json" -Body $resultadoBody
    $resultadoId = Get-IdValue -Obj $resultado -Names @("id", "idResultado")
    if (-not $resultadoId) { throw "No se pudo obtener id de resultado" }

    Invoke-RestMethod -Method Get -Uri "$base/resultados/$resultadoId" -Headers $headers | Out-Null
    $resultadoUpdateBody = @{ pacienteId = $userId; laboratorioId = $labId; tipoExamen = "Hemograma"; fecha = $fecha; resultado = "Normal (actualizado)"; observaciones = "E2E update" } | ConvertTo-Json -Compress
    Invoke-RestMethod -Method Put -Uri "$base/resultados/$resultadoId" -Headers $headers -ContentType "application/json" -Body $resultadoUpdateBody | Out-Null

    Invoke-RestMethod -Method Delete -Uri "$base/resultados/$resultadoId" -Headers $headers | Out-Null
    Invoke-RestMethod -Method Delete -Uri "$base/reservas/$reservaId" -Headers $headers | Out-Null
    Invoke-RestMethod -Method Delete -Uri "$base/laboratorios/$labId" -Headers $headers | Out-Null
    Invoke-RestMethod -Method Delete -Uri "$base/usuarios/$userId" -Headers $headers | Out-Null

    Write-Host "E2E OK: login + CRUD usuarios/labs/reservas/resultados via /api."
} finally {
    if (-not $KeepUp) {
        Compose -ComposeArgs @("down")
    }
}
