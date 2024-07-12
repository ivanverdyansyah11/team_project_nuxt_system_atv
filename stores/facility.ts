import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';
import Cookies from "js-cookie";

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
                const response = await $fetch(`${ apiUrl }/facilities`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.facilityAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllFacility() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/facilities?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.facilityAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getFacilityById(facilityId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/facilities/${ facilityId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.facility = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createFacility(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/facilities`, {
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
        async updateFacility(updateData: any, facilityId: string) {
            try {
                console.log(facilityId)
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/facilities/${facilityId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteFacility(facilityId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/facilities/${facilityId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllFacility();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
