// export type LocationChangetype =
//   | 'Created location'
//   | 'Changed mainLocation'
//   | 'Changed subLocation'
//   | 'Changed createdAt'
//   | 'Changed several Values';

export enum LocationChange {
  CreatedLocation,
  // ChangedMainLocation,
  // ChangedSubLocation,
  // ChangedCreatedAt,
  // ChangedSeveralValues,
  UpdatedLocation,
  DeletedLocation,
}
