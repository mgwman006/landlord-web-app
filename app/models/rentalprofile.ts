import { MembershipDetailsDTO } from "./user";


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


  export interface CreateRentalProfileDTO
  {
    phoneNumber:string;
    userId:number;
    name:string;
    email:string | null;
    type: RentalProfileType;
    organizationId?:number;
  }

  export enum RentalProfileType
  {
    Individual = "INDIVIDUAL",
    Business = "BUSINESS"
  }


export interface CreateRentReceivingAccountDTO
{
  paymentMethod:PaymentMethod;
  accountNumber?:string;
  bankName?:string;
  mobileMoneyProvider?:MobileMoneyProvider;
  mobileMoneyNumber?:string;
  isDefault:boolean;
}

export enum PaymentMethod
{
  CASH,
  BANK_TRANSFER,
  MOBILE_MONEY
}

export enum MobileMoneyProvider
{
  MIX_BY_YAS,
  MPESA,
  AIRTEL_MONEY,
  HALOPESA
}