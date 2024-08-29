import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        customerAll: [],
        customer: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllCustomerWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/customers`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.customerAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data customer')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Customer')
            }
        },
        async getAllCustomer() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/customers?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.customerAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data customer')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Customer')
            }
        },
        async getCustomerById(customerId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/customers/${ customerId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.customer = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data customer')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Customer')
            }
        },
        async exportCustomer() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/customers/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data customer')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Customer')
            }
        },
    },
})
