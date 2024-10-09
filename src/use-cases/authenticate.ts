import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { User } from '@prisma/client'

interface AuthenticateUseCaseRequest {
  username: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export async function authenticateUseCase({
  username,
  password,
}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    throw new InvalidCredentialsError()
  }

  const doesPasswordMatches = await compare(password, user.password)

  if (!doesPasswordMatches) {
    throw new InvalidCredentialsError()
  }

  return {
    user,
  }
}
