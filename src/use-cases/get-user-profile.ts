import { prisma } from '@/lib/prisma'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { User } from '@prisma/client'

interface getUserProfileUseCaseRequest {
  userId: string
}

interface getUserProfileUseCaseResponse {
  user: User
}

export async function getUserProfileUseCase({
  userId,
}: getUserProfileUseCaseRequest): Promise<getUserProfileUseCaseResponse> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new ResourceNotFoundError()
  }

  return {
    user,
  }
}
