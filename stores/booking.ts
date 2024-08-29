import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

export const useBookingStore = defineStore('booking', {
    state: () => ({
        bookingAll: [],
        booking: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllBookingWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const user = useCookie('auth-user')
                const path = ref(`${ apiUrl }/bookings`)
                if (user.value.user.role == 'customer') {
                    path.value = `${apiUrl}/bookings?customer_id=${user.value.id}`
                } else if(user.value.user.role == 'instructor') {
                    path.value = `${apiUrl}/bookings?instructor_id=${user.value.id}`
                }
                const response = await $fetch( path.value, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bookingAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data booking')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking')
            }
        },
        async getAllBooking() {
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
                this.bookingAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data booking')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking')
            }
        },
        async getBookingById(bookingId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/bookings/${ bookingId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.booking = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data booking')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking')
            }
        },
        async exportBooking() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/bookings/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data booking')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking')
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
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new booking service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking')
            }
        },
        async createBookingPackage(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/booking/packages`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                })
                this.status_code = response.meta.code
                this.totalPages = response.meta.total
            } catch (error) {
                console.log(error.message)
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new booking package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking')
            }
        },
        async deleteBooking(bookingId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllBooking()
            } else {
                Cookies.set('alert-message', 'Failed to delete booking')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking')
            }
        },
    },
})
