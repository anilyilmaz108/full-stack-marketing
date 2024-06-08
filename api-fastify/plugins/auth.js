const fastify = require('fastify');
const fp = require('fastify-plugin');

// Auth 
module.exports = fp(async (fastify, opts) => {
    fastify.register(require('@fastify/jwt'), {
        secret: fastify.config().secret
    });

      // User
  fastify.decorate('authCommon', async (req, reply) => {
    const decoded = await fastify.jwt.decode(req.headers.authorization.replace('Bearer ', ''));
    const role = await decoded.role;
    if (role !== 'user') {
      reply.send({ error: 'No Access (A)' });
    } else {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  });


});