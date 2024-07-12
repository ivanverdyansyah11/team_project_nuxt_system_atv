import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

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
                const response = await $fetch(`${ apiUrl }/entertainment/categories`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.categoryAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllCategory() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/entertainment/categories?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.categoryAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getCategoryById(categoryId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/entertainment/categories/${ categoryId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.category = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createCategory(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/categories`, {
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
        async updateCategory(updateData: any, categoryId: string) {
            try {
                console.log(categoryId)
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/categories/${categoryId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteCategory(categoryId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/entertainment/categories/${categoryId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllCategory();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
