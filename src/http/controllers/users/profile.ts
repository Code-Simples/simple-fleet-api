import { FastifyRequest, FastifyReply } from 'fastify'

import { getUserProfileUseCase } from '@/use-cases/get-user-profile'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()

  const { user } = await getUserProfileUseCase({
    userId: request.user.sub,
  })

  Reflect.deleteProperty(user, 'password') // Remove a senha do usuário

  return reply.status(200).send({
    user,
  })
}
