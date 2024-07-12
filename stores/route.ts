import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

export const useRouteStore = defineStore('route', {
    state: () => ({
        routeAll: [],
        route: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllRouteWithoutPaginate() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/routes`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.routeAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllRoute() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/routes?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.routeAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getRouteById(routeId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/routes/${ routeId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.route = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createRoute(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/routes`, {
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
        async updateRoute(updateData: any, routeId: string) {
            try {
                console.log(routeId)
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/routes/${routeId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteRoute(routeId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/routes/${routeId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllRoute();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
