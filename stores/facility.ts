import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

export const useFacilityStore = defineStore('facility', {
    state: () => ({
        facilityAll: [],
        facility: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllFacilityWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/facilities`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.facilityAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data facility')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Facility')
            }
        },
        async getAllFacility() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/facilities?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.facilityAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data facility')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Facility')
            }
        },
        async getFacilityById(facilityId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/facilities/${ facilityId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.facility = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data facility')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Facility')
            }
        },
        async exportFacility() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/facilities/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data facility')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Facility')
            }
        },
        async createFacility(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/facilities`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                })
                this.status_code = response.meta.code
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new facility')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Facility')
            }
        },
        async updateFacility(updateData: any, facilityId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/facilities/${facilityId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to update facility')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Facility')
            }
        },
        async deleteFacility(facilityId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/facilities/${facilityId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllFacility()
            } else {
                Cookies.set('alert-message', 'Failed to delete facility')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Facility')
            }
        },
    },
})
