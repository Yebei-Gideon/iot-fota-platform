/**
 * Generic core fields shared by all microservice definitions
 */
export interface BaseService {
  service: string // Canonical injection token (e.g. 'AUTH_SERVICE')
  name: string // Human-readable descriptor for logging
}

/**
 * Protocol-specific infrastructure settings
 */
export interface ServiceConfig {
  queue: string // RabbitMQ queue name
  port?: number // TCP connection port
  topic?: string // MQTT subscription root topic
}

/**
 * Combined contract guaranteeing base identifiers and protocol options
 */
export interface Service extends BaseService, ServiceConfig { }

/**
 * Concrete infrastructure map for the IoT FOTA Platform microservices
 */
export const SERVICES = {
  GATEWAY: {
    service: 'GATEWAY_SERVICE',
    name: 'API Gateway',
    queue: 'fota_gateway_queue',
    port: 3030,
  },
  AUTH: {
    service: 'AUTH_SERVICE',
    name: 'Authentication Microservice',
    queue: 'fota_auth_queue',
    port: 3031,
  },
  DEVICES: {
    service: 'DEVICES_SERVICE',
    name: 'Device Management Microservice',
    queue: 'fota_devices_queue',
    port: 3032,
    topic: 'fota/devices/+',
  },
  TELEMETRY: {
    service: 'TELEMETRY_SERVICE',
    name: 'Telemetry Processing Service',
    queue: 'fota_telemetry_queue',
    port: 3033,
    topic: 'fota/telemetry/#',
  },
} as const satisfies Record<string, Service>

// Helper Type Extraction
export type ServiceType = typeof SERVICES[keyof typeof SERVICES]
