#!/bin/bash

# ==============================================================================
# 1. INITIALIZATION & TEMPORARY PERMISSION LIFTOFF
# ==============================================================================
# Load environment variables if .env exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  MQTT_CONTAINER_NAME="fota_mqtt_broker"
fi

echo "Temporarily reclaiming file ownership for generation..."
if [ -d "./config" ] || [ -d "./certs" ] || [ -d "./data" ] || [ -d "./log" ]; then
  sudo chown -R $(id -u):$(id -g) ./config ./certs ./data ./log 2>/dev/null || true
fi

# Ensure all structural directories exist locally
mkdir -p config certs/ca certs/server data log
touch config/mosquitto.conf config/passwords

# ==============================================================================
# 2. SSL/TLS CERTIFICATE GENERATION
# ==============================================================================
echo "Generating SSL Certificates..."

# Certificate Authority (CA)
openssl genrsa -out certs/ca/ca.key 2048
openssl req -x509 -new -nodes -key certs/ca/ca.key -sha256 -days 3650 -out certs/ca/ca.crt -subj "/CN=My-CA"

# Server Certificate Request & Signing
openssl genrsa -out certs/server/server.key 2048
openssl req -new -out certs/server/server.csr -key certs/server/server.key -subj "/CN=localhost"
openssl x509 -req -in certs/server/server.csr \
  -CA certs/ca/ca.crt -CAkey certs/ca/ca.key -CAcreateserial \
  -out certs/server/server.crt -days 365 -sha256

# Clean up CSR serial helper file
rm -f certs/ca/ca.srl certs/server/server.csr

# ==============================================================================
# 3. SECURITY & HANDOFF PERMISSIONS TO CONTAINER (Moved Up)
# ==============================================================================
echo "Applying secure file permissions..."

# Assign local ownership to Mosquitto internal daemon user (UID 1883)
sudo chown -R 1883:1883 ./config ./log ./data ./certs

# Apply tight 700 to directories and 600 to all files to eliminate warnings
sudo find ./config ./log ./data ./certs -type d -exec chmod 700 {} \;
sudo find ./config ./log ./data ./certs -type f -exec chmod 600 {} \;

# Re-expose public keys AND directory traverse access so host testing tools can access them
sudo chmod 755 ./certs ./certs/ca ./certs/server
sudo chmod 644 ./certs/ca/ca.crt ./certs/server/server.crt

# grant read permissions to all users while keeping Mosquitto as the owner:
sudo chmod 644 ./config/mosquitto.conf

# ==============================================================================
# 4. DOCKER & USER PROVISIONING
# ==============================================================================
echo "Provisioning MQTT users..."

# Force the container-side file properties to root-owned 0600 first,
# then run mosquitto_passwd explicitly as root
# Add/Update the user directly inside the active broker container
docker exec -u 1883 "$MQTT_CONTAINER_NAME" \
  mosquitto_passwd -b /mosquitto/config/passwords fota_user fota_password

# Force reload Mosquitto to parse updated config/passwords without restarting container
docker kill -s HUP "$MQTT_CONTAINER_NAME"

# ==============================================================================
# 5. SETUP COMPLETE
# ==============================================================================
echo "Setup complete! All permissions locked down safely."

# ==============================================================================
# 6. TEST
# ==============================================================================

# --- SUBSCRIBE TEST ---
# mosquitto_sub -h localhost -p 8883 --cafile ./certs/ca/ca.crt -u fota_user -P fota_password -t "test/topic" -v

# --- PUBLISH TEST ---
# mosquitto_pub -h localhost -p 8883 --cafile ./certs/ca/ca.crt -u fota_user -P fota_password -t "test/topic" -m "Hello, Secure MQTT!"
