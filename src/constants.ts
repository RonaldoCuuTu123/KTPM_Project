
import { Household, Resident, Gender, ResidentStatus, FeeCampaign, FeeType } from './types';

export const INITIAL_HOUSEHOLDS: Household[] = [
  {
    id: 'HH001',
    householdNumber: 'HK-2024-001',
    headName: 'Nguyễn Văn An',
    address: 'Số 12A',
    street: 'Phố Lê Trọng Tấn',
    ward: 'La Khê',
    district: 'Hà Đông',
    history: [
      { id: 'H1', date: '2024-01-10', content: 'Đăng ký thường trú mới' }
    ],
    members: [
      {
        id: 'R001',
        fullName: 'Nguyễn Văn An',
        dob: '1975-05-15',
        gender: Gender.MALE,
        birthPlace: 'Hà Nội',
        origin: 'Nam Định',
        ethnicity: 'Kinh',
        job: 'Kỹ sư',
        workPlace: 'Công ty ABC',
        idCardNumber: '001075123456',
        registrationDate: '2024-01-10',
        relationToHead: 'Chủ hộ',
        status: ResidentStatus.ACTIVE,
        householdId: 'HH001'
      },
      {
        id: 'R002',
        fullName: 'Trần Thị Bình',
        dob: '1978-08-20',
        gender: Gender.FEMALE,
        birthPlace: 'Thái Bình',
        origin: 'Thái Bình',
        ethnicity: 'Kinh',
        job: 'Giáo viên',
        workPlace: 'Trường Tiểu học La Khê',
        idCardNumber: '001078654321',
        registrationDate: '2024-01-10',
        relationToHead: 'Vợ',
        status: ResidentStatus.ACTIVE,
        householdId: 'HH001'
      }
    ]
  },
  {
    id: 'HH002',
    householdNumber: 'HK-2024-002',
    headName: 'Phạm Minh Đức',
    address: 'Số 45',
    street: 'Phố Phan Đình Giót',
    ward: 'La Khê',
    district: 'Hà Đông',
    history: [],
    members: [
      {
        id: 'R003',
        fullName: 'Phạm Minh Đức',
        dob: '1985-12-01',
        gender: Gender.MALE,
        birthPlace: 'Hải Phòng',
        origin: 'Hải Phòng',
        ethnicity: 'Kinh',
        job: 'Kinh doanh',
        idCardNumber: '001085001122',
        registrationDate: '2024-02-15',
        relationToHead: 'Chủ hộ',
        status: ResidentStatus.ACTIVE,
        householdId: 'HH002'
      }
    ]
  }
];

export const INITIAL_FEES: FeeCampaign[] = [
  {
    id: 'F001',
    name: 'Phí vệ sinh năm 2024',
    type: FeeType.MANDATORY,
    amountPerMonthPerPerson: 6000,
    startDate: '2024-01-01',
    description: 'Phí vệ sinh môi trường thu hàng năm (6.000 VNĐ/tháng/người)'
  },
  {
    id: 'F002',
    name: 'Ủng hộ Quỹ Vì người nghèo',
    type: FeeType.VOLUNTARY,
    startDate: '2024-05-15',
    description: 'Vận động ủng hộ người nghèo trên địa bàn'
  }
];
