import Fastify from 'fastify'
import fastifyMongo from '@fastify/mongodb'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'

import WebSocket from 'ws'

import { usersRoutes } from '@/http/controllers/users/routes'

import { env } from '@/env'

const fastify = Fastify({ logger: false })

fastify.register(fastifyCors, {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true,
  maxAge: 86400,
})

fastify.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: { expiresIn: '15m' },
})

fastify.register(fastifyMongo, {
  forceClose: true,
  url: process.env.DATABASE_URL,
})

fastify.register(fastifyCookie)

// Rotas HTTP
fastify.register(usersRoutes)

const start = async () => {
  const clients = new Set()


  try {
    await fastify.listen({ port: 3333 })

    const wss = new WebSocket.Server({ server: fastify.server })

    wss.on('connection', async (ws) => {
      console.log('WebSocket client connected')
      clients.add(ws) // Adiciona o cliente à lista

      const collection = fastify.mongo.client
        .db('simple-fleet')
        .collection('Historic')

      const data = await collection.find().toArray()
      ws.send(JSON.stringify({ data }))

      const changeStream = collection.watch()

      changeStream.on('change', async (change) => {
        console.log('Change detected:', change)

        const updatedData = await collection.find().toArray()

        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ data: updatedData }))
          }
        })
      })

      ws.on('close', () => {
        console.log('WebSocket client disconnected')
        clients.delete(ws)

        if (clients.size === 0) {
          changeStream.close()
        }
      })
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
