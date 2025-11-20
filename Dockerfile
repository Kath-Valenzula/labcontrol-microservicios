# Dockerfile multistage para LabControl8 (Angular 17)
# Build: docker build -t labcontrol8:latest .
# Run: docker run -p 4200:80 labcontrol8:latest

### Etapa de build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

### Etapa de runtime
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copiar build
COPY --from=build /app/dist/labcontrol8/browser/ .

# Copiar configuración nginx SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
