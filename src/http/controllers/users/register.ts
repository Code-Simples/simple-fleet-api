import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { registerUseCase } from '@/use-cases/register'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    username: z.string(),
    password: z.string().min(6),
  })

  const { name, username, password } = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({ name, username, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
