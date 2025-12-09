# -------- Build stage --------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --silent

# Copy source and build
COPY . .
RUN npm run build

# -------- Production stage using nginx --------
FROM nginx:stable-alpine

# Remove default nginx conf and use our own for SPA routing
RUN mkdir -p /usr/share/nginx/html

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
