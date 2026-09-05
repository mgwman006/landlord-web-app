import { TenantDetailsDTO, TenantInvitationDetailsDTO } from "./user";

// Mapped from backend Lease entity
export enum PaymentPeriod
{
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  SIX_MONTHS = "SIX_MONTHS",
  YEARLY = "YEARLY"
}

export enum RentPeriod {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  SIX_MONTHS = "SIX_MONTHS",
  YEARLY = "YEARLY"
}

export enum LeaseStatus {
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
  TERMINATED = "TERMINATED",
  PENDING = "PENDING"
}


 
export interface PaymentDTO {
  id: number;
  amount: number;
  date: string;
  method?: string;
}

export interface LeaseDetailsDTO {
  referenceNumber: string;
  id: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
  rentAmount: number;
  currency: string;
  rentPeriod?: RentPeriod;
  paymentPeriod?: PaymentPeriod;
  paymentAmount?: number;
  amountPaid?: number;
  balance?: number;
  status: LeaseStatus;
  tenant?: TenantDetailsDTO;
  tenantInvitations?: TenantInvitationDetailsDTO[];
}

export interface LeaseCreateDTO {
  rentalProfileId: number;
  unitId: number;
  tenantId?: number;
  tenantFirstName?: string;
  tenantLastName?: string;
  tenantPhoneNumber?: string;
  startDate?: string;
  endDate?: string;
  rentAmount: number;
  currency: string;
  rentPeriod?: RentPeriod;
  paymentPeriod?: PaymentPeriod;
}

