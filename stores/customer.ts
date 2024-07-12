import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

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
        async getAllCustomer() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/customers?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.customerAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getCustomerById(customerId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/customers/${ customerId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.customer = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
