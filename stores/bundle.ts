import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

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
                const response = await $fetch(`${ apiUrl }/entertainment/packages`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bundleAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllBundle() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/entertainment/packages?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bundleAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getBundleById(bundleId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/entertainment/packages/${ bundleId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.bundle = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createBundle(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages`, {
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
        async saveImageBundle(formData: FormData, bundleId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages/upload/${bundleId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: formData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async updateBundle(updateData: any, bundleId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/packages/${bundleId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteBundle(bundleId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/entertainment/packages/${bundleId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllBundle();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
