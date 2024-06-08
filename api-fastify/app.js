const fastify = require('fastify')({
  logger: true
});

const db = require("./db/db");
const AutoLoad = require('@fastify/autoload');
const path = require('path');
const config = require('./config');
// Caching
const IORedis = require('ioredis');
const redis = new IORedis({ host: '127.0.0.1' });
const abcache = require('abstract-cache')({
    useAwait: true,
    driver: {
      name: 'abstract-cache-redis', // must be installed via `npm i`
      options: {client: redis}
    }
  })

module.exports = async (fastify, opts) => {
    // Config
    fastify.decorate('config', () => config);

    // Caching
    await fastify.register(require('@fastify/redis'), { client: redis });
    await fastify.register(require('@fastify/caching'), { cache: abcache });

    // Winston ile Loglama
    const MyLogger = require('./logs/logger');
    const logger = new MyLogger();

    // Swagger
    await fastify.register(require('@fastify/swagger'), fastify.config().swaggerOptions);
    await fastify.swagger;

    // Cors
    fastify.register(require('@fastify/cors'), {
        origin: [
            "http://localhost:4200",
            "http://localhost:3000",
            "http://localhost:8000",
            "http://localhost:8001",
            "http://localhost:3307",
        ]
    });

  // Axios
  fastify.register(require("fastify-axios"));
  
    // Plugins
    await fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts)
    });

    // Routes
    await fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: Object.assign({}, opts)   
     });

     // PostgreSQL DB -> Şimdilik herhangi bir koşul sağlanmasın.
     await db.connect();

}



