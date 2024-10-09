export class PatientAlreadyExistsError extends Error {
  constructor() {
    super('Paciente já cadastrado para esse documento.')
  }
}
