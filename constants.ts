
import { Household, Resident, Gender, ResidentStatus, FeeCampaign, FeeType, User, Role, Payment } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'U1', username: 'admin', fullName: 'Nguyễn Văn Cường', role: Role.ADMIN, password: '123' },
  { id: 'U2', username: 'ketoan', fullName: 'Lê Thị Mai', role: Role.ACCOUNTANT, password: '123' },
  { id: 'U3', username: 'canbo', fullName: 'Trần Văn Hùng', role: Role.STAFF, password: '123' },
];

export const INITIAL_HOUSEHOLDS: Household[] = [
  {
    id: 'HH001',
    householdNumber: 'HK-2024-001',
    headName: 'Nguyễn Văn An',
    address: 'Số 12A',
    street: 'Lê Trọng Tấn',
    ward: 'La Khê',
    district: 'Hà Đông',
    history: [{ id: 'H1', date: '2024-01-10', content: 'Đăng ký thường trú mới' }],
    members: [
      { id: 'R1', fullName: 'Nguyễn Văn An', dob: '1975-05-15', gender: Gender.MALE, birthPlace: 'Hà Nội', origin: 'Nam Định', ethnicity: 'Kinh', job: 'Kỹ sư', idCardNumber: '001075001234', registrationDate: '2024-01-10', relationToHead: 'Chủ hộ', status: ResidentStatus.ACTIVE, householdId: 'HH001' },
      { id: 'R2', fullName: 'Trần Thị Bình', dob: '1978-08-20', gender: Gender.FEMALE, birthPlace: 'Thái Bình', origin: 'Thái Bình', ethnicity: 'Kinh', job: 'Giáo viên', idCardNumber: '001078005678', registrationDate: '2024-01-10', relationToHead: 'Vợ', status: ResidentStatus.ACTIVE, householdId: 'HH001' },
      { id: 'R3', fullName: 'Nguyễn Minh Quân', dob: '2005-10-12', gender: Gender.MALE, birthPlace: 'Hà Nội', origin: 'Nam Định', ethnicity: 'Kinh', job: 'Sinh viên', idCardNumber: '001205009876', registrationDate: '2024-01-10', relationToHead: 'Con', status: ResidentStatus.ACTIVE, householdId: 'HH001' }
    ]
  },
  {
    id: 'HH002',
    householdNumber: 'HK-2024-002',
    headName: 'Phạm Minh Đức',
    address: 'Số 45',
    street: 'Phan Đình Giót',
    ward: 'La Khê',
    district: 'Hà Đông',
    history: [],
    members: [
      { id: 'R4', fullName: 'Phạm Minh Đức', dob: '1985-12-01', gender: Gender.MALE, birthPlace: 'Hải Phòng', origin: 'Hải Phòng', ethnicity: 'Kinh', job: 'Kinh doanh', idCardNumber: '001085001122', registrationDate: '2024-02-15', relationToHead: 'Chủ hộ', status: ResidentStatus.ACTIVE, householdId: 'HH002' },
      { id: 'R5', fullName: 'Lê Thu Trang', dob: '1988-04-25', gender: Gender.FEMALE, birthPlace: 'Hà Nội', origin: 'Hà Nội', ethnicity: 'Kinh', job: 'Kế toán', idCardNumber: '001088003344', registrationDate: '2024-02-15', relationToHead: 'Vợ', status: ResidentStatus.ACTIVE, householdId: 'HH002' },
      { id: 'R6', fullName: 'Phạm Bảo Nam', dob: '2019-06-30', gender: Gender.MALE, birthPlace: 'Hà Nội', origin: 'Hải Phòng', ethnicity: 'Kinh', registrationDate: '2024-02-15', relationToHead: 'Con', status: ResidentStatus.ACTIVE, householdId: 'HH002' }
    ]
  },
  {
    id: 'HH003',
    householdNumber: 'HK-2024-003',
    headName: 'Hoàng Văn Thái',
    address: 'Số 10/2',
    street: 'Ngô Quyền',
    ward: 'La Khê',
    district: 'Hà Đông',
    history: [],
    members: [
      { id: 'R7', fullName: 'Hoàng Văn Thái', dob: '1950-01-01', gender: Gender.MALE, birthPlace: 'Nghệ An', origin: 'Nghệ An', ethnicity: 'Kinh', job: 'Hưu trí', idCardNumber: '001050001111', registrationDate: '2024-01-05', relationToHead: 'Chủ hộ', status: ResidentStatus.ACTIVE, householdId: 'HH003' },
      { id: 'R8', fullName: 'Ngô Thị Hòa', dob: '1955-05-10', gender: Gender.FEMALE, birthPlace: 'Nghệ An', origin: 'Nghệ An', ethnicity: 'Kinh', job: 'Hưu trí', idCardNumber: '001055002222', registrationDate: '2024-01-05', relationToHead: 'Vợ', status: ResidentStatus.ACTIVE, householdId: 'HH003' }
    ]
  },
  {
    id: 'HH004',
    householdNumber: 'HK-2024-004',
    headName: 'Vũ Thị Xuân',
    address: 'Số 77',
    street: 'Lê Trọng Tấn',
    ward: 'La Khê',
    district: 'Hà Đông',
    history: [],
    members: [
      { id: 'R9', fullName: 'Vũ Thị Xuân', dob: '1992-09-09', gender: Gender.FEMALE, birthPlace: 'Hà Nội', origin: 'Hà Nội', ethnicity: 'Kinh', job: 'Tự do', idCardNumber: '001092008888', registrationDate: '2024-03-20', relationToHead: 'Chủ hộ', status: ResidentStatus.ACTIVE, householdId: 'HH004' },
      { id: 'R10', fullName: 'Đỗ Anh Tuấn', dob: '1990-11-11', gender: Gender.MALE, birthPlace: 'Hà Tây', origin: 'Hà Tây', ethnicity: 'Kinh', job: 'IT', idCardNumber: '001090009999', registrationDate: '2024-03-20', relationToHead: 'Chồng', status: ResidentStatus.TEMPORARY_ABSENT, notes: 'Đi công tác nước ngoài', householdId: 'HH004' }
    ]
  },
  {
    id: 'HH005',
    householdNumber: 'HK-2024-005',
    headName: 'Trần Quốc Toản',
    address: 'Số 15',
    street: 'Phan Đình Giót',
    ward: 'La Khê',
    district: 'Hà Đông',
    history: [],
    members: [
      { id: 'R11', fullName: 'Trần Quốc Toản', dob: '1980-03-03', gender: Gender.MALE, birthPlace: 'Nam Định', origin: 'Nam Định', ethnicity: 'Kinh', job: 'Kinh doanh', idCardNumber: '001080005555', registrationDate: '2024-04-01', relationToHead: 'Chủ hộ', status: ResidentStatus.ACTIVE, householdId: 'HH005' }
    ]
  }
];

export const INITIAL_FEES: FeeCampaign[] = [
  { id: 'F1', name: 'Phí vệ sinh 2024', type: FeeType.MANDATORY, amountPerMonthPerPerson: 6000, startDate: '2024-01-01', description: 'Thu hàng năm cho công tác vệ sinh' },
  { id: 'F2', name: 'Quỹ Vì người nghèo', type: FeeType.VOLUNTARY, startDate: '2024-05-19', description: 'Ủng hộ người nghèo' },
  { id: 'F3', name: 'Tết thiếu nhi 1/6', type: FeeType.VOLUNTARY, startDate: '2024-05-25', description: 'Tổ chức trung thu cho các cháu' }
];

export const INITIAL_PAYMENTS: Payment[] = [
  { id: 'P1', householdId: 'HH001', campaignId: 'F1', amount: 216000, paymentDate: '2024-02-10', collectorName: 'Lê Thị Mai' },
  { id: 'P2', householdId: 'HH002', campaignId: 'F1', amount: 216000, paymentDate: '2024-03-05', collectorName: 'Lê Thị Mai' },
  { id: 'P3', householdId: 'HH001', campaignId: 'F2', amount: 500000, paymentDate: '2024-05-20', collectorName: 'Lê Thị Mai' }
];
