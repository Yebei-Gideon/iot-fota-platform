import * as Joi from 'joi'

export const envSchema = Joi.object({
  GATEWAY_PORT: Joi.string()
    .description('The port on which the gateway server will listen for incoming requests.')
    .default('3030'),

  API_NAME: Joi.string()
    .description('The human-readable name of the platform API.')
    .default('IoT FOTA Platform API'),

  API_DESCRIPTION: Joi.string()
    .description('A brief description detailing the core function of the API.')
    .default('API for the IoT FOTA Platform'),

  API_VERSION: Joi.string()
    .description('Semantic version designation for application tracking.')
    .default('1.0.0'),

  GLOBAL_PREFIX: Joi.string()
    .description('The global base route path prefix for all endpoints.')
    .default('api'),

  PORT: Joi.number()
    .description('Default application port used if microservice specific ports are absent.')
    .default(3030),

  SERVER: Joi.string()
    .description('The fully qualified server target address URL.')
    .default('http://localhost:3030'),
})
