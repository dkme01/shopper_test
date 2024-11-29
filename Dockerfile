FROM node:18-alpine AS base
WORKDIR /app

FROM base AS backend-builder
COPY backend/package*.json ./backend/
WORKDIR /app/backend
# RUN npm ci
COPY backend/ .
RUN npm run build

FROM base AS frontend-builder
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package*.json ./backend/

COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/node_modules ./frontend/node_modules
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/

COPY docker-compose.yml .
# COPY .env .

ENV GOOGLE_API_KEY=AIzaSyAL--Gpx_zjJKCzzyJAWUg8hVEXuxU9XPs

EXPOSE 80 8080

CMD ["docker-compose", "up"]
