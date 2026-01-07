import axios from 'axios';
import { Household, Resident, FeeCampaign, Payment, Gender, ResidentStatus, FeeType } from '@/types';

const API_URL = 'http://localhost:3000/api'; // Đảm bảo PORT backend đúng

// Tạo instance axios với config mặc định
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    // --- HOUSEHOLD ---
    getHouseholds: async (): Promise<Household[]> => {
        try {
            const res = await axiosInstance.get('/households/get-all-households');
            // Map dữ liệu từ BE (PascalCase) sang FE type (camelCase)
            return (res.data || []).map((item: any) => ({
                id: item.HouseholdID || item.id || `HH${Date.now()}`,
                householdNumber: item.HouseholdNumber || item.householdNumber || '',
                headName: item.HouseholdHead || item.headName || '',
                address: (item.Street && item.Ward && item.District)
                    ? `${item.Street}, ${item.Ward}, ${item.District}`
                    : item.address || '',
                street: item.Street || item.street || '',
                ward: item.Ward || item.ward || 'La Khê',
                district: item.District || item.district || 'Hà Đông',
                members: Array.isArray(item.Members) ? item.Members : [],
                history: item.history || []
            }));
        } catch (error) {
            console.error('Lỗi lấy danh sách hộ khẩu:', error);
            throw error;
        }
    },

    createHousehold: async (data: {
        householdNumber: string;
        headName: string;
        street: string;
        ward: string;
        district: string;
    }) => {
        try {
            return await axiosInstance.post('/households/create-household', {
                HouseholdNumber: data.householdNumber,
                HouseholdHead: data.headName,
                Street: data.street,
                Ward: data.ward,
                District: data.district,
                Members: 0
            });
        } catch (error) {
            console.error('Lỗi tạo hộ khẩu:', error);
            throw error;
        }
    },

    updateHousehold: async (id: string, data: any) => {
        try {
            return await axiosInstance.put(`/households/update-household/${id}`, data);
        } catch (error) {
            console.error('Lỗi cập nhật hộ khẩu:', error);
            throw error;
        }
    },

    deleteHousehold: async (id: string) => {
        try {
            return await axiosInstance.delete(`/households/delete-household/${id}`);
        } catch (error) {
            console.error('Lỗi xóa hộ khẩu:', error);
            throw error;
        }
    },

    // --- RESIDENT ---
    getResidents: async (): Promise<Resident[]> => {
        try {
            const res = await axiosInstance.get('/residents/get-all-residents');
            return (res.data || []).map((item: any) => ({
                id: item.ResidentID || item.id || `R${Date.now()}`,
                fullName: item.FullName || item.fullName || '',
                dob: item.DOB || item.dob || '',
                gender: (item.Sex === 'Nam' || item.gender === 'Nam') ? Gender.MALE : Gender.FEMALE,
                birthPlace: item.BirthPlace || item.birthPlace || '',
                origin: item.Origin || item.origin || '',
                ethnicity: item.Ethnicity || item.ethnicity || 'Kinh',
                job: item.Job || item.job || '',
                idCardNumber: item.IdentityCard || item.idCardNumber || '',
                registrationDate: item.RegistrationDate || item.registrationDate || new Date().toISOString().split('T')[0],
                relationToHead: item.Relationship || item.relationToHead || 'Chủ hộ',
                status: ResidentStatus.ACTIVE,
                householdId: item.HouseholdID || item.householdId || ''
            }));
        } catch (error) {
            console.error('Lỗi lấy danh sách cư dân:', error);
            throw error;
        }
    },

    createResident: async (data: {
        householdId: string;
        fullName: string;
        dob: string;
        gender: Gender;
        birthPlace?: string;
        origin?: string;
        ethnicity?: string;
        job?: string;
        idCardNumber?: string;
        relationToHead: string;
    }) => {
        try {
            return await axiosInstance.post('/residents/create-resident', {
                HouseholdID: data.householdId,
                FullName: data.fullName,
                DOB: data.dob,
                Sex: data.gender === Gender.MALE ? 'Nam' : 'Nữ',
                BirthPlace: data.birthPlace || '',
                Origin: data.origin || '',
                Ethnicity: data.ethnicity || 'Kinh',
                Job: data.job || '',
                IdentityCard: data.idCardNumber || '',
                Relationship: data.relationToHead
            });
        } catch (error) {
            console.error('Lỗi tạo cư dân:', error);
            throw error;
        }
    },

    updateResident: async (id: string, data: any) => {
        try {
            return await axiosInstance.put(`/residents/update-resident/${id}`, data);
        } catch (error) {
            console.error('Lỗi cập nhật cư dân:', error);
            throw error;
        }
    },

    deleteResident: async (id: string) => {
        try {
            return await axiosInstance.delete(`/residents/delete-resident/${id}`);
        } catch (error) {
            console.error('Lỗi xóa cư dân:', error);
            throw error;
        }
    },

    // --- FEE CAMPAIGN ---
    getFeeCampaigns: async (): Promise<FeeCampaign[]> => {
        try {
            const res = await axiosInstance.get('/fee-collection/get-all-collection');
            return (res.data || []).map((item: any) => ({
                id: item.CollectionID || item.id || `FC${Date.now()}`,
                name: item.CollectionName || item.name || '',
                type: item.Type === 'Bắt buộc' ? FeeType.MANDATORY : FeeType.VOLUNTARY,
                amount: item.Amount || item.amount || 0,
                amountPerMonthPerPerson: item.AmountPerMonth || item.amountPerMonthPerPerson || 0,
                startDate: item.StartDate || item.startDate || new Date().toISOString().split('T')[0],
                endDate: item.EndDate || item.endDate || new Date().toISOString().split('T')[0],
                description: item.Description || item.description || '',
                status: item.Status || 'Hoạt động'
            }));
        } catch (error) {
            console.error('Lỗi lấy danh sách đợt thu:', error);
            throw error;
        }
    },

    createFeeCampaign: async (data: {
        name: string;
        type: FeeType;
        amount?: number;
        amountPerMonthPerPerson?: number;
        startDate: string;
        endDate: string;
        description?: string;
    }) => {
        try {
            return await axiosInstance.post('/fee-collection/create-collection', {
                CollectionName: data.name,
                Type: data.type === FeeType.MANDATORY ? 'Bắt buộc' : 'Tự nguyện',
                Amount: data.amount || 0,
                AmountPerMonth: data.amountPerMonthPerPerson || 0,
                StartDate: data.startDate,
                EndDate: data.endDate,
                Description: data.description || ''
            });
        } catch (error) {
            console.error('Lỗi tạo đợt thu:', error);
            throw error;
        }
    },

    // --- PAYMENT ---
    getPayments: async (): Promise<Payment[]> => {
        try {
            const res = await axiosInstance.get('/payment/get-all-payment');
            return (res.data || []).map((item: any) => ({
                id: item.PaymentID || item.id || `P${Date.now()}`,
                householdId: item.HouseholdID || item.householdId || '',
                campaignId: item.CollectionID || item.campaignId || '',
                amount: item.Amount || item.amount || 0,
                paymentDate: item.PaymentDate || item.paymentDate || new Date().toISOString().split('T')[0],
                collectorName: item.CollectorName || item.collectorName || 'Nguyễn Văn Cường',
                status: item.Status || 'Hoàn thành'
            }));
        } catch (error) {
            console.error('Lỗi lấy danh sách thanh toán:', error);
            throw error;
        }
    },

    createPayment: async (data: {
        householdId: string;
        campaignId: string;
        amount: number;
        paymentDate: string;
        collectorName: string;
    }) => {
        try {
            return await axiosInstance.post('/payment/create-payment', {
                HouseholdID: data.householdId,
                CollectionID: data.campaignId,
                Amount: data.amount,
                PaymentDate: data.paymentDate,
                CollectorName: data.collectorName
            });
        } catch (error) {
            console.error('Lỗi tạo thanh toán:', error);
            throw error;
        }
    }
};
