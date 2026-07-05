export interface PropertyCreateDTO
{
  description: string;
  creatorId: number;
  name: string;
  landSize: number | null;
  landSizeUnit: string | null;
  latitude: number;
  longitude: number;
  address: AddressDTO;
  type: PropertyCategory;
  developmentStatus: DevelopmentStatus;
  status: PropertyStatus;
}

export interface AddressDTO{
  street: string;
  area: string;
  city: string;
  region: string;
  country: string;
}

export enum DevelopmentStatus 
{
  PLANNING,
  UNDER_CONSTRUCTION,
  COMPLETED,
  OPERATIONAL
}

export enum PropertyStatus
{
  ACTIVE,
  INACTIVE
}

export enum PropertyCategory
{
  OFFICE,
  INDUSTRIAL,
  LAND,
  STAND_ALONE_HOUSE,
  APARTMENTS_BUILDING,
  COMPOUND
}
