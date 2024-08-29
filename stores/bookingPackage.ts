import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

export const useBookingPackageStore = defineStore('bookingPackage', {
    state: () => ({
        bookingPackageAll: [],
        bookingPackage: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllBookingPackageWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const user = useCookie('auth-user')
                const path = ref(`${ apiUrl }/booking/packages?search=${this.keyword}`)
                if (user.value.user.role == 'customer') {
                    path.value = `${apiUrl}/booking/packages?customer_id=${user.value.id}&search=${this.keyword}`
                } else if(user.value.user.role == 'instructor') {
                    path.value = `${apiUrl}/booking/packages?instructor_id=${user.value.id}&search=${this.keyword}`
                }
                const response = await $fetch( path.value, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bookingPackageAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data booking package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Package')
            }
        },
        async getAllBookingPackage() {
            try {
                const token = useCookie('auth-token')
                const user = useCookie('auth-user')
                const path = ref(`${apiUrl}/booking/packages?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`)
                if(user.value.user.role == 'instructor') {
                    path.value = `${apiUrl}/booking/packages?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}&instructor_id=${user.value.id}`
                }
                const response = await $fetch(path.value, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bookingPackageAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data booking package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Package')
            }
        },
        async getBookingPackageById(bookingPackageId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/booking/packages/${ bookingPackageId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bookingPackage = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data booking package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Package')
            }
        },
        async exportBookingPackage() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/booking/packages/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data booking package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Package')
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
                return response.data.id
            } catch (error) {
                console.log(error.message)
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new booking package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Package')
            }
        },
        async deleteBookingPackage(bookingPackageId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/booking/packages/${bookingPackageId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllBookingPackage()
            } else {
                Cookies.set('alert-message', 'Failed to delete booking package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Booking Package')
            }
        },
    },
})
