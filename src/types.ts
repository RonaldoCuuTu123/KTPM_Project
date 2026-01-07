
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

export enum AgeGroup {
  PRESCHOOL = 'Mầm non',
  KINDERGARTEN = 'Mẫu giáo',
  ELEMENTARY = 'Cấp 1',
  MIDDLE_SCHOOL = 'Cấp 2',
  HIGH_SCHOOL = 'Cấp 3',
  WORKING_AGE = 'Độ tuổi lao động',
  RETIRED = 'Nghỉ hưu'
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
  id: string; // Unique ID (Mã số định danh)
  householdNumber: string; // Số hộ khẩu
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
  amountPerMonthPerPerson?: number; // For mandatory fees
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
