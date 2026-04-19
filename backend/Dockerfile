# Stage 1: Builder
# We use this stage to download and compile dependencies.
FROM python:3.10-slim AS builder
WORKDIR /build
COPY requirements.txt .
# Install dependencies into a specific folder
RUN pip install --user -r requirements.txt

# Stage 2: Production Runner
# We use a fresh image and ONLY copy the installed packages, leaving behind unnecessary cache.
FROM python:3.10-slim AS runner
WORKDIR /app
# Copy the installed dependencies from the 'builder' stage
COPY --from=builder /root/.local /root/.local
# Copy the actual application code
COPY app.py .

# Update PATH so Python can find the installed packages
ENV PATH=/root/.local/bin:$PATH

EXPOSE 5000
CMD ["python", "app.py"]