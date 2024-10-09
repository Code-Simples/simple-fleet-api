import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'

interface RegisterUseCaseRequest {
  name: string
  username: string
  password: string
}

export async function registerUseCase({
  name,
  username,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userWithSameUsername) {
    throw new UserAlreadyExistsError()
  }

  await prisma.user.create({
    data: {
      name,
      username,
      password: password_hash,
    },
  })
}
