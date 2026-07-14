interface Service {
  name: string
  queue: string
}

export const APPLICATION_NAME: string = 'microservice-template'

export const TEMPLATE_SERVICE_RABBITMQ: Service = {
  name: 'rabbitmq_template_service',
  queue: 'rabbitmq_template_queue',
}

export const ORDER_SERVICE_RABBITMQ: Service = {
  name: 'rabbitmq_order_service',
  queue: 'rabbitmq_order_queue',
}
