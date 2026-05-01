# Stage 1: Build React with environment variables
FROM node:18-alpine AS builder
WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_GOOGLE_CLIENT_ID=45231532521-k1s9ogi5jkhv498io6obtl3lfu3harpi.apps.googleusercontent.com

# Set environment variables for the build
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

COPY package*.json ./
RUN npm install
COPY . .

# Vite will embed these env vars into the built files
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Copy built files from builder
COPY --from=builder /app/dist .

# Copy Nginx configuration
COPY src/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
