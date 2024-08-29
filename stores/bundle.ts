import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

export const useBundleStore = defineStore('bundle', {
    state: () => ({
        bundleAll: [],
        bundle: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllBundleWithoutPagination() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages?&search=${this.keyword}&is_not_expired=true`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bundleAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data entertainment package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Package')
            }
        },
        async getAllBundle() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bundleAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data entertainment package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Package')
            }
        },
        async getAllBundleWithExpired() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}&is_not_expired=true`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bundleAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data entertainment package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Package')
            }
        },
        async getBundleById(bundleId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages/${ bundleId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bundle = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data entertainment package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Package')
            }
        },
        async exportBundle() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data entertainment package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Package')
            }
        },
        async createBundle(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                })
                this.status_code = response.meta.code
                this.totalPages = response.meta.total
                this.bundle = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new entertainment package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Package')
            }
        },
        async saveImageBundle(formData: FormData, bundleId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages/upload/${bundleId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: formData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to save image entertainment package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Package')
            }
        },
        async updateBundle(updateData: any, bundleId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages/${bundleId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to update entertainment package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Package')
            }
        },
        async deleteBundle(bundleId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/entertainment/packages/${bundleId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllBundleWithExpired()
            } else {
                Cookies.set('alert-message', 'Failed to delete entertainment package')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Package')
            }
        },
    },
})
