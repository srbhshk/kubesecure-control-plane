# Build stage
FROM golang:1.25.6-alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /kubesecure-agent cmd/agent/main.go

# Final stage
FROM alpine:3.20

WORKDIR /

# Copy the binary from the builder stage
COPY --from=builder /kubesecure-agent /kubesecure-agent

# Run as non-root user for security
RUN adduser -D kubesecure
USER kubesecure

ENTRYPOINT ["/kubesecure-agent"]
