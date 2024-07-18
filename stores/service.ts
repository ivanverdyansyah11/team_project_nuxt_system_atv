import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

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
                const response = await $fetch(`${ apiUrl }/entertainment/services`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.serviceAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllService() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/entertainment/services?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.serviceAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getServiceById(serviceId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/entertainment/services/${ serviceId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.service = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createService(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/entertainment/services`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token.value}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(createData)
                });
                this.status_code = response?.status;
                this.totalPages = response?.meta?.total;
            } catch (error) {
                console.log(error?.message);
            }
        },
        async saveImageService(formData: FormData, serviceId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/services/upload/${serviceId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: formData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async updateService(updateData: any, serviceId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/entertainment/services/${serviceId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteService(serviceId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/entertainment/services/${serviceId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllService();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
