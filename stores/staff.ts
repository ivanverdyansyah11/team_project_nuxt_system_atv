import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

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
                const response = await $fetch(`${apiUrl}/staffs?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.staffAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data staff')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Staff')
            }
        },
        async getStaffById(staffId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/staffs/${ staffId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.staff = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data staff')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Staff')
            }
        },
        async exportStaff() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/staffs/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data staff')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Staff')
            }
        },
        async createStaff(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/staffs`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                })
                this.status_code = response.meta.code
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new staff')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Staff')
            }
        },
        async updateStaff(updateData: any, staffId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/staffs/${staffId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to update staff')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Staff')
            }
        },
        async deleteStaff(staffId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/staffs/${staffId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if(this.status_code === 200) {
                this.page = 1
                await this.getAllStaff()
            } else {
                Cookies.set('alert-message', 'Failed to delete staff')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Staff')
            }
        },
    },
})
