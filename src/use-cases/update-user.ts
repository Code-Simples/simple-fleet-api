import { prisma } from '@/lib/prisma'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { User } from '@prisma/client'
import bcrypt from 'bcryptjs'

interface updateUserUseCaseRequest {
  id: string
  oldPassword?: string
  newPassword?: string
  name?: string
}

export async function updateUserUseCase({
  id,
  oldPassword,
  newPassword,
  name,
}: updateUserUseCaseRequest): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw new ResourceNotFoundError()
  }

  if (oldPassword && newPassword) {
    const isMatch = await bcrypt.compare(oldPassword, user.password)

    if (!isMatch) {
      throw new InvalidCredentialsError()
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    return prisma.user.update({
      where: { id },
      data: {
        name,
        password: hashedNewPassword,
      },
    })
  }

  return prisma.user.update({
    where: { id },
    data: {
      name,
    },
  })
}
