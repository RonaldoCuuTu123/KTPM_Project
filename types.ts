
export enum Gender {
  MALE = 'Nam',
  FEMALE = 'Nữ'
}

export enum ResidentStatus {
  ACTIVE = 'Thường trú',
  TEMPORARY_ABSENT = 'Tạm vắng',
  TEMPORARY_RESIDENT = 'Tạm trú',
  DECEASED = 'Đã qua đời',
  MOVED = 'Đã chuyển đi'
}

export enum Role {
  ADMIN = 'ADMIN', // Tổ trưởng/Tổ phó
  ACCOUNTANT = 'ACCOUNTANT', // Kế toán
  STAFF = 'STAFF' // Cán bộ nghiệp vụ
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  password?: string;
}

export interface Resident {
  id: string;
  fullName: string;
  alias?: string;
  dob: string;
  gender: Gender;
  birthPlace: string;
  origin: string;
  ethnicity: string;
  job?: string;
  workPlace?: string;
  idCardNumber?: string;
  idCardDate?: string;
  idCardPlace?: string;
  registrationDate: string;
  previousAddress?: string;
  relationToHead: string;
  status: ResidentStatus;
  notes?: string;
  moveDate?: string;
  moveDestination?: string;
  householdId: string;
}

export interface Household {
  id: string;
  householdNumber: string;
  headName: string;
  address: string;
  street: string;
  ward: string;
  district: string;
  members: Resident[];
  history: HouseholdHistory[];
}

export interface HouseholdHistory {
  id: string;
  date: string;
  content: string;
}

export enum FeeType {
  MANDATORY = 'Bắt buộc',
  VOLUNTARY = 'Đóng góp'
}

export interface FeeCampaign {
  id: string;
  name: string;
  type: FeeType;
  amountPerMonthPerPerson?: number;
  startDate: string;
  description: string;
}

export interface Payment {
  id: string;
  householdId: string;
  campaignId: string;
  amount: number;
  paymentDate: string;
  collectorName: string;
}

export type AppView = 'DASHBOARD' | 'HOUSEHOLDS' | 'RESIDENTS' | 'FEES' | 'STATS';
