import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

export const useBookingServiceStore = defineStore('bookingService', {
    state: () => ({
        bookingServiceAll: [],
        bookingService: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllBookingServiceWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const user = useCookie('auth-user')
                const path = ref(`${ apiUrl }/bookings?search=${this.keyword}`)
                if (user.value.user.role == 'customer') {
                    path.value = `${apiUrl}/bookings?customer_id=${user.value.id}&search=${this.keyword}`
                } else if(user.value.user.role == 'instructor') {
                    path.value = `${apiUrl}/bookings?instructor_id=${user.value.id}&search=${this.keyword}`
                }
                const response = await $fetch( path.value, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bookingServiceAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data booking service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Service')
            }
        },
        async getAllBookingService() {
            try {
                const token = useCookie('auth-token')
                const user = useCookie('auth-user')
                const path = ref(`${apiUrl}/bookings?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`)
                if(user.value.user.role == 'instructor') {
                    path.value = `${apiUrl}/bookings?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}&instructor_id=${user.value.id}`
                }
                const response = await $fetch(path.value, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bookingServiceAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data booking service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Service')
            }
        },
        async getBookingServiceById(bookingServiceId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/bookings/${ bookingServiceId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bookingService = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data booking service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Service')
            }
        },
        async exportBookingService() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/bookings/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data booking service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Service')
            }
        },
        async createBookingService(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/bookings`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                })
                this.status_code = response.meta.code
                this.totalPages = response.meta.total
                return response.data.id
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new booking service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Service')
            }
        },
        async deleteBookingService(bookingServiceId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/bookings/${bookingServiceId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllBookingService()
            } else {
                Cookies.set('alert-message', 'Failed to delete booking service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Service')
            }
        },
    },
})
