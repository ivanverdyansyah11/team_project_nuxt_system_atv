import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';

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
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/instructors`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.instructorAll = response?.data ? response?.data : []
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getAllInstructor() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/instructors?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.instructorAll = response?.data ? response?.data : []
                this.totalPages = response?.meta?.total
            } catch (error) {
                console.log(error?.message)
            }
        },
        async getInstructorById(instructorId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${ apiUrl }/instructors/${ instructorId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.instructor = response?.data ? response?.data : {}
            } catch (error) {
                console.log(error?.message)
            }
        },
        async createInstructor(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/instructors`, {
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
        async updateInstructor(updateData: any, instructorId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/instructors/${instructorId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error?.message)
            }
        },
        async deleteInstructor(instructorId: number) {
            try {
                const token = useCookie('auth-token')
                const response = await fetch(`${apiUrl}/instructors/${instructorId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.status_code = response.status;
                this.page = 1
                this.totalPages = response?.meta?.total
                await this.getAllInstructor();
            } catch (error) {
                console.log(error?.message)
            }
        },
    },
});
