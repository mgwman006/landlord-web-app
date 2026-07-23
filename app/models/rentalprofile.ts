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
    adminUserId:number;
    name:string;
    businessEmail:string | null;
    type: RentalProfileType;
    rentReceivingAccounts?: CreateRentReceivingAccountDTO;
  }

  export enum RentalProfileType
  {
    Individual = "INDIVIDUAL",
    Company = "COMPANY"
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