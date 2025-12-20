param(
  [string]$BackendDir = 'C:\DSY2205_Backend',
  [string]$FrontendDir = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

function Assert-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "No se encontró '$Name' en PATH. Instálalo o abre una terminal donde esté disponible."
  }
}

function Invoke-InDir([string]$Dir, [scriptblock]$Action) {
  if (-not (Test-Path $Dir)) {
    throw "No existe la carpeta: $Dir"
  }
  Push-Location $Dir
  try {
    & $Action
  } finally {
    Pop-Location
  }
}

if (-not $env:SONAR_TOKEN) {
  throw @'
SONAR_TOKEN no está seteado en este terminal (PowerShell).

Setéalo UNA vez en esta misma terminal y vuelve a ejecutar el script:

  $env:SONAR_TOKEN = "<tu_token_de_sonarcloud>"

Nota: no uses `-Dsonar.*` en los comandos Maven; cada microservicio ya trae su configuración en el pom.xml.
'@
}

Assert-Command 'mvn'
Assert-Command 'npm'
Assert-Command 'npx'

$mvnSonarArgs = @(
  'clean',
  'test',
  'sonar:sonar',
  ("-Dsonar.token=$($env:SONAR_TOKEN)")
)

Write-Host '=== SonarCloud: Frontend ==='
Invoke-InDir $FrontendDir {
  npm test -- --watch=false --code-coverage --browsers=ChromeHeadless
  npx sonar-scanner
}

Write-Host '=== SonarCloud: Backend microservicio-usuarios ==='
Invoke-InDir (Join-Path $BackendDir 'microservicio-usuarios') {
  & mvn @mvnSonarArgs
}

Write-Host '=== SonarCloud: Backend microservicio_laboratorios ==='
Invoke-InDir (Join-Path $BackendDir 'microservicio_laboratorios') {
  & mvn @mvnSonarArgs
}

Write-Host '=== SonarCloud: Backend microservicio-reservas ==='
Invoke-InDir (Join-Path $BackendDir 'microservicio-reservas') {
  & mvn @mvnSonarArgs
}

Write-Host '=== SonarCloud: Backend microservicio-resultados ==='
Invoke-InDir (Join-Path $BackendDir 'microservicio-resultados') {
  & mvn @mvnSonarArgs
}

Write-Host 'Listo. Revisa los dashboards en SonarCloud (puede demorar 1-2 min en procesar).'
