import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

export const useServiceStore = defineStore('service', {
    state: () => ({
        serviceAll: [],
        service: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
        test: null,
    }),
    actions: {
        async getAllServiceWithoutPagination() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/services?&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.serviceAll = response.data
            } catch (error) {
                Cookies.set('alert-message', 'Failed to load data entertainment service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Service')
            }
        },
        async getAllService() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/services?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.serviceAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                Cookies.set('alert-message', 'Failed to load data entertainment service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Service')
            }
        },
        async getServiceById(serviceId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/services/${ serviceId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.service = response.data
            } catch (error) {
                Cookies.set('alert-message', 'Failed to load data entertainment service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Service')
            }
        },
        async exportService() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/services/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data entertainment service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Service')
            }
        },
        async createService(createData: any) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/entertainment/services`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                },
                body: JSON.stringify(createData)
            })
            this.status_code = response.status
            if (this.status_code === 201) {
                this.service = response.data
                await this.getAllService()
            } else {
                Cookies.set('alert-message', 'Failed to create new entertainment service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Service')
            }
        },
        async saveImageService(formData: FormData, serviceId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/services/upload/${serviceId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: formData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to save image entertainment service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Service')
            }
        },
        async updateService(updateData: any, serviceId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/services/${serviceId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                })
                this.status_code = response.meta.code
                this.service = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to update entertainment service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Service')
            }
        },
        async deleteService(serviceId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/entertainment/services/${serviceId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllService()
            } else {
                Cookies.set('alert-message', 'Failed to delete entertainment service')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Service')
            }
        },
    },
})
