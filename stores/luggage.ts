import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

export const useLuggageStore = defineStore('luggage', {
    state: () => ({
        luggageAll: [],
        luggage: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllLuggageWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/mandatory/luggages`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.luggageAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllLuggage() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/mandatory/luggages?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.luggageAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getLuggageById(luggageId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/mandatory/luggages/${ luggageId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.luggage = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createLuggage(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/mandatory/luggages`, {
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
        async updateLuggage(updateData: any, luggageId: string) {
            try {
                console.log(luggageId)
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/mandatory/luggages/${luggageId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteLuggage(luggageId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/mandatory/luggages/${luggageId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllLuggage();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
