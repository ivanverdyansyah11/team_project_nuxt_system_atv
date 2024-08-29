import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

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
                const response = await $fetch(`${apiUrl}/mandatory/luggages`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.luggageAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data mandatory luggage')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Luggage')
            }
        },
        async getAllLuggage() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/mandatory/luggages?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.luggageAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data mandatory luggage')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Luggage')
            }
        },
        async getLuggageById(luggageId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/mandatory/luggages/${ luggageId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.luggage = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data mandatory luggage')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Luggage')
            }
        },
        async exportLuggage() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/mandatory/luggages/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data mandatory luggage')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Luggage')
            }
        },
        async createLuggage(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/mandatory/luggages`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                })
                this.status_code = response.meta.code
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new mandatory luggage')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Luggage')
            }
        },
        async updateLuggage(updateData: any, luggageId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/mandatory/luggages/${luggageId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to update mandatory luggage')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Luggage')
            }
        },
        async deleteLuggage(luggageId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/mandatory/luggages/${luggageId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllLuggage()
            } else {
                Cookies.set('alert-message', 'Failed to delete mandatory luggage')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Luggage')
            }
        },
    },
})
