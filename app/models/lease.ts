// Mapped from backend Lease entity
export enum PaymentPeriod
{
  DAILY,
  WEEKLY,
  MONTHLY,
  SIX_MONTHS,
  YEARLY
}

export enum RentPeriod {
  DAILY,
  WEEKLY,
  MONTHLY,
  SIX_MONTHS,
  YEARLY
}

export enum LeaseStatus {
  ACTIVE,
  ENDED,
  TERMINATED,
  PENDING
}

export interface TenantDetailsDTO {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
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

