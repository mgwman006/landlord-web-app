// Mapped from backend Lease entity
export type RentPeriod = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | string;

export type LeaseStatus =
  | "ACTIVE"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "DRAFT"
  | string;

export interface TenantDTO {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
}

export interface PaymentDTO {
  id: number;
  amount: number;
  date: string;
  method?: string;
}

export interface LeaseDTO {
  tenantName: string | undefined;
  amountDue: number;
  id: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
  rentAmount: number;
  rentPeriod?: RentPeriod;
  requiredDeposit: number;
  paidDeposit?: number;
  currency: string;
  status: LeaseStatus;
  unitId?: number;
  tenantId?: number;
  tenant?: TenantDTO;
  payments?: PaymentDTO[];
  rentalProfileId?: number;
}

export interface CreateLeaseDTO {
  rentalProfileId: number;
  unitId: number;
  tenantId?: number;
  tenantName?: string;
  rentAmount: number;
  rentPeriod?: RentPeriod;
  requiredDeposit?: number;
  paidDeposit?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
}
