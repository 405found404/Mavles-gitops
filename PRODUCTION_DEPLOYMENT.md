# Mavles Production Deployment Guide

## Development Setup
```bash
# In frontend directory
npm install
npm run dev
# Runs at http://localhost:5173
```

## Production Build & Deployment

### Step 1: Build Frontend Docker Image
```bash
cd frontend

# Build with your Google Client ID embedded
docker build \
  --build-arg VITE_GOOGLE_CLIENT_ID=45231532521-k1s9ogi5jkhv498io6obtl3lfu3harpi.apps.googleusercontent.com \
  -t mavles31/fullstackfrontend:v6 .

# Push to Docker Hub
docker push mavles31/fullstackfrontend:v6
```

### Step 2: Build Backend Docker Image
```bash
cd backend

# Build backend image
docker build -t mavles31/fullstackbackend:v2 .

# Push to Docker Hub
docker push mavles31/fullstackbackend:v2
```

### Step 3: Deploy to Kubernetes
```bash
# Apply the production.yaml
kubectl apply -f production.yaml

# Check status
kubectl get deployments
kubectl get pods
kubectl get svc
```

### Step 4: Access Your Application
```bash
# Get the external IP
kubectl get svc frontend

# Open in browser (replace with actual IP)
http://<EXTERNAL-IP>
```

## Important Notes

### Frontend (.env)
- **Development**: Uses `.env` files for Vite hot reload
- **Production**: Environment variables are baked into the Docker image at build time
  - Values are embedded in the JavaScript bundle
  - Cannot be changed at runtime without rebuilding

### Backend (.env)  
- **Development**: Uses `.env` file
- **Production**: Kubernetes injects environment variables from production.yaml
  - Can be changed without rebuilding by updating production.yaml and redeploying

### Environment Variables

**Frontend (BAKED IN AT BUILD TIME):**
- `VITE_GOOGLE_CLIENT_ID` - Embedded in JS bundle

**Backend (INJECTED AT RUNTIME):**
- `DB_HOST=db`
- `DB_USER=mavles_app_user`
- `DB_PASSWORD=MvlsSecureAppPass2024_K9xL2Qm8nP@7vR`
- `DB_NAME=mavles_production_db`
- `GOOGLE_CLIENT_ID=45231532521-k1s9ogi5jkhv498io6obtl3lfu3harpi.apps.googleusercontent.com`

## Troubleshooting

**If Google Sign-In fails:**
1. Verify Google Client ID in Docker build
2. Check Google Cloud Console - Authorized redirect URIs must include your domain
3. Browser console should show: `✓ Google Client ID loaded successfully`

**If backend can't connect to database:**
1. Check credentials in production.yaml
2. Verify MySQL container is running: `kubectl get pods`
3. View logs: `kubectl logs <backend-pod-name>`

**If frontend shows undefined:**
1. Verify build arguments were passed during Docker build
2. Rebuild with correct CLIENT_ID: `docker build --build-arg VITE_GOOGLE_CLIENT_ID=... -t ...`
3. Clear browser cache after redeployment
