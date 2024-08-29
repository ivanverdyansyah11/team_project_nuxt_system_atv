import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

export const useInstructorStore = defineStore('instructor', {
    state: () => ({
        instructorAll: [],
        instructor: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        status_code: null,
    }),
    actions: {
        async getAllInstructorWithoutPaginate() {
            try {
                const response = await $fetch(`${ apiUrl }/instructors?&search=${this.keyword}`, {
                    method: 'GET',
                })
                this.instructorAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data instructor')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Instructor')
            }
        },
        async getAllInstructor() {
            try {
                const response = await $fetch(`${ apiUrl }/instructors?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                })
                this.instructorAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data instructor')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Instructor')
            }
        },
        async getInstructorById(instructorId: string) {
            try {
                const response = await $fetch(`${ apiUrl }/instructors/${ instructorId }`, {
                    method: 'GET',
                })
                this.instructor = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data instructor')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Instructor')
            }
        },
        async exportInstructor() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/instructors/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data instructor')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Instructor')
            }
        },
        async createInstructor(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/instructors`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                })
                this.status_code = response.meta.code
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new instructor')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Instructor')
            }
        },
        async updateInstructor(updateData: any, instructorId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/instructors/${instructorId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to update instructor')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Instructor')
            }
        },
        async deleteInstructor(instructorId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/instructors/${instructorId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllInstructor()
            } else {
                Cookies.set('alert-message', 'Failed to delete instructor')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Instructor')
            }
        },
    },
})
