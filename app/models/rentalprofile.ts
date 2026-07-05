import { MembershipDetailsDTO } from "./user";

export enum RentalProfileType
{
  INDIVIDUAL,
  BUSINESS
}

export interface CreateRentalProfileDTO
{
    adminUserId: number;
    type: RentalProfileType;
    name: string;
    businessEmail: string;
}


export interface RentalProfileDetailsDTO
{
  id: number;
  name: string;
  businessEmail: string;
  type: RentalProfileType;
  memberships: MembershipDetailsDTO[];
  units: RentalUnitDetailsDTO[];
}

export interface RentalUnitDetailsDTO
{
  id: number;
  name: string;
  address: string;
  unitType: string;
  rentalProfileId: number;
}