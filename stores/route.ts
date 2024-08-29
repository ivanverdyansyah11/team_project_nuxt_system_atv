import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

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
                const response = await $fetch(`${apiUrl}/routes`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.routeAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data route')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Route')
            }
        },
        async getAllRoute() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/routes?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.routeAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data route')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Route')
            }
        },
        async getRouteById(routeId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/routes/${ routeId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.route = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data route')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Route')
            }
        },
        async exportRoute() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/routes/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data route')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Route')
            }
        },
        async createRoute(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/routes`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                })
                this.status_code = response.meta.code
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new route')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Route')
            }
        },
        async updateRoute(updateData: any, routeId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/routes/${routeId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to update route')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Route')
            }
        },
        async deleteRoute(routeId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/routes/${routeId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllRoute()
            } else {
                Cookies.set('alert-message', 'Failed to delete route')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Route')
            }
        },
    },
})
