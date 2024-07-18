import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';
import Cookies from "js-cookie";

export const useStaffStore = defineStore('staff', {
    state: () => ({
        staffAll: [],
        staff: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllStaff() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/staffs?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.staffAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getStaffById(staffId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/staffs/${ staffId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.staff = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createStaff(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/staffs`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                });
                this.status_code = response?.data ? 200 : null;
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async updateStaff(updateData: any, staffId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/staffs/${staffId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteStaff(staffId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/staffs/${staffId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllStaff();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
