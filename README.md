# Markitdown - Aplicación Web

Una aplicación web full-stack con frontend moderno en React y backend en Python, containerizada con Docker.

## 📋 Descripción del Proyecto

**Markitdown** es una aplicación que combina:

- **Frontend**: React con Vite, Tailwind CSS
- **Backend**: Python con FastAPI
- **Orquestación**: Docker Compose para ejecutar ambos servicios

## 📂 Estructura del Proyecto

```
.
├── backend/                 # API backend en Python
│   ├── Dockerfile          # Configuración Docker para el backend
│   ├── main.py             # Aplicación FastAPI principal
│   ├── requirements.txt     # Dependencias Python
│   └── __pycache__/        # Cache de Python
│
├── frontend/               # Aplicación React
│   ├── Dockerfile          # Configuración Docker para el frontend
│   ├── src/                # Código fuente React
│   │   ├── App.jsx         # Componente principal
│   │   ├── main.jsx        # Punto de entrada
│   │   └── index.css       # Estilos
│   ├── index.html          # HTML principal
│   ├── nginx.conf          # Configuración Nginx
│   ├── package.json        # Dependencias Node.js
│   ├── pnpm-lock.yaml      # Lock file de pnpm
│   ├── vite.config.js      # Configuración Vite
│   ├── tailwind.config.js  # Configuración Tailwind CSS
│   └── postcss.config.js   # Configuración PostCSS
│
└── docker-compose.yml      # Orquestación de servicios
```

## 🚀 Cómo Desplegar

### Requisitos Previos

- Docker (v20.10+)
- Docker Compose (v1.29+)

### Opción 1: Con Docker Compose (Recomendado)

1. **Clona o descarga el repositorio:**
   ```bash
   git clone https://github.com/dannylank/markitdown.git
   cd markitdown
   ```

2. **Inicia los servicios:**
   ```bash
   docker-compose up -d
   ```

3. **Accede a la aplicación:**
   - Frontend: http://localhost:8080
   - Backend: http://localhost:5000

4. **Para detener los servicios:**
   ```bash
   docker-compose down
   ```

### Opción 2: Desarrollo Local (sin Docker)

#### Backend

1. **Crea un entorno virtual:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. **Instala dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Inicia el servidor:**
   ```bash
   python main.py
   ```
   El backend estará disponible en http://localhost:8000

#### Frontend

1. **Instala dependencias:**
   ```bash
   cd frontend
   npm install
   # o con pnpm:
   pnpm install
   ```

2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   # o con pnpm:
   pnpm dev
   ```
   El frontend estará disponible en http://localhost:5173

## 🛠️ Comandos Útiles

### Docker Compose

```bash
# Ver logs
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Reconstruir imágenes
docker-compose build

# Ejecutar comandos dentro del contenedor
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview
```

### Backend

```bash
# Ver documentación interactiva
# http://localhost:8000/docs (Swagger UI)
# http://localhost:8000/redoc (ReDoc)
```

## 📦 Dependencias Principales

### Backend
- **FastAPI**: Framework web asincrónico
- Dependencias en `backend/requirements.txt`

### Frontend
- **React**: Librería UI
- **Vite**: Build tool moderno
- **Tailwind CSS**: Framework CSS utility-first

## 🔧 Configuración

### Variables de Entorno

Para configurar variables de entorno, crea un archivo `.env` en la raíz:

```env
# Backend
BACKEND_PORT=8000

# Frontend
VITE_API_URL=http://localhost:8000
```

### Puerto Personalizado

En `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "5000:8000"  # Primer número = puerto externo en VPS
  
  frontend:
    ports:
      - "8080:80"    # Primer número = puerto externo en VPS
```

**Nota**: El primer puerto es el que expones en la VPS, el segundo es el puerto interno del contenedor.

## 🚢 Despliegue en Producción

### Con Docker

1. **Build de imágenes:**
   ```bash
   docker-compose build
   ```

2. **Push a registro (opcional):**
   ```bash
   docker tag markitdown-frontend:latest your-registry/markitdown-frontend:latest
   docker push your-registry/markitdown-frontend:latest
   ```

3. **Deploy con Docker Compose en VPS:**
   ```bash
   # Clona el repositorio en tu VPS
   git clone https://github.com/dannylank/markitdown.git
   cd markitdown
   
   # Inicia los servicios
   docker-compose up -d
   ```

### En Plataformas en la Nube

- **Vercel**: Deploy automático del frontend desde GitHub
- **Render/Railway**: Deploy del backend Python
- **AWS ECS/Kubernetes**: Orquestación de contenedores

## 📝 Desarrollo

### Crear un rama para cambios:
```bash
git checkout -b feature/mi-feature
git add .
git commit -m "Descripción del cambio"
git push origin feature/mi-feature
```

## 🐛 Troubleshooting

### Puerto ya en uso
```bash
# En VPS (Linux): Encontrar proceso en puerto
lsof -i :5000    # Backend
lsof -i :8080    # Frontend
kill -9 <PID>

# Windows: Con PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Problemas con Docker
```bash
# Limpiar todo
docker-compose down -v

# Reconstruir desde cero
docker-compose build --no-cache
docker-compose up
```

### Problemas de permisos
```bash
# En Linux, agregar usuario a grupo docker
sudo usermod -aG docker $USER
```

## 📞 Contacto y Soporte

Para reportar issues o preguntas, abre un issue en el repositorio de GitHub.

## 📄 Licencia

Este proyecto está disponible bajo licencia MIT.

---

**Repositorio**: https://github.com/dannylank/markitdown

