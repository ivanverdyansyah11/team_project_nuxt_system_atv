import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categoryAll: [],
        category: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllCategoryWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/categories`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.categoryAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data entertainment category')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Category')
            }
        },
        async getAllCategory() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/categories?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.categoryAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data entertainment category')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Category')
            }
        },
        async getCategoryById(categoryId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/categories/${ categoryId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.category = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data entertainment category')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Category')
            }
        },
        async exportCategory() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/categories/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data entertainment category')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Category')
            }
        },
        async createCategory(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/categories`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                })
                this.status_code = response.meta.code
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new entertainment category')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Category')
            }
        },
        async updateCategory(updateData: any, categoryId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/categories/${categoryId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to update entertainment category')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Category')
            }
        },
        async deleteCategory(categoryId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/entertainment/categories/${categoryId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllCategory()
            } else {
                Cookies.set('alert-message', 'Failed to delete entertainment category')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Category')
            }
        },
    },
})
