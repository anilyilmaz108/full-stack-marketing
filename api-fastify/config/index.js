module.exports = {
  // JWT
  secret: "added22packagesandaudited137packagesin5s",
  
  // Pool
   pool: {
    user: 'postgres',
    host: 'localhost',
    database: 'liveapidb',
    password: '176369',
    port: 5432,
  },
  
  
  // Cache
  ttlDefault: 1000 * 1,
  ttl1s: 1000,
  ttl5s: 1000 * 5,
  ttl10s: 1000 * 10,
  ttl30s: 1000 * 30,
  ttl1m: 1000 * 60,
  ttl5m: 1000 * 60 * 5,
  ttl10m: 1000 * 60 * 10,
  ttl1h: 1000 * 60 * 60,

  // SWAGGER
  swaggerOptions: {
    routePrefix: '/swagger',
    exposeRoute: true,
    openapi: {
      openapi: "3.0.3",
      security: [
        {
          bearerAuth: [],
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
          },
        },
      },
    },
    swagger: {
      info: {
        title: 'API7',
        description: 'Rest APIs ',
        version: '1.0.0',
      },
      securityDefinitions: {
        Authorization: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        }
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  },
};
