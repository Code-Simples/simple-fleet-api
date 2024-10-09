export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Nome de usuário indisponível.')
  }
}
