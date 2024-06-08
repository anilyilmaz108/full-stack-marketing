'use strict';
/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */

module.exports = async (fastify, opts) => {
  fastify.get('/', async(req, reply) => {
    reply.send({ Hello: 'Api-Fastify' });
  });
};
