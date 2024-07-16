import Fastify from 'fastify'
import fastifyMongo from '@fastify/mongodb'
import fastifyCors from '@fastify/cors'

const fastify = Fastify({ logger: false })

// Configurar CORS
fastify.register(fastifyCors, {
  origin: '*', // Permitir todas as origens. Para segurança, especifique as origens permitidas.
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
})

// Conectar ao MongoDB
fastify.register(fastifyMongo, {
  forceClose: true,
  url: process.env.DATABASE_URL,
})

// Rotas
fastify.get('/', async (request, reply) => {
  reply.send('simple-fleet-api')
})

fastify.get('/historics', async (request, reply) => {
  const collection = fastify.mongo.db.collection('Historic')
  const result = await collection.find().toArray()
  reply.send(result)
})

// Iniciar o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3333 })
    console.log(
      `Server listening on http://localhost:${fastify.server.address().port}`,
    )
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
