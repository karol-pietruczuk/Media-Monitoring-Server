// export type UserChangetype =
//   | 'Created user'
//   | 'Changed email'
//   | 'Changed passwordHash'
//   | 'Changed firstName'
//   | 'Changed lastName'
//   | 'Changed role'
//   | 'Changed isActive'
//   | 'Changed createdAt'
//   | 'Changed updatedAt'
//   | 'Changed several Values';

export enum UserChange {
  CreatedUser,
  UpdatedUser,
  DeactivatedUser,
  DeletedUser,
  // | 'Changed email'
  // | 'Changed passwordHash'
  // | 'Changed firstName'
  // | 'Changed lastName'
  // | 'Changed role'
  // | 'Changed isActive'
  // | 'Changed createdAt'
  // | 'Changed updatedAt'
  // | 'Changed several Values'
}
