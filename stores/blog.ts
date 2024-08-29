import {defineStore} from 'pinia'
import {apiUrl} from '~/helpers/Variable'
import Cookies from "js-cookie"

export const useBlogStore = defineStore('blog', {
    state: () => ({
        blogAll: [],
        blog: {},
        keyword: ref(''),
        page: 1,
        pageSize: 6,
        totalPages: 0,
        exceptId: null,
        status_code: null,
    }),
    actions: {
        async getAllBlogWithoutPagination() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/blogs?search=${this.keyword}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.blogAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data blog')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Blog')
            }
        },
        async getAllBlog() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/blogs?current_page=${this.page}&page_size=${this.pageSize}&search=${this.keyword}&except_id=${this.exceptId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.blogAll = response.data
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data blog')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Blog')
            }
        },
        async getBlogExceptId(blogId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/blogs?except_id=${blogId}&page_size=2`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.blogAll = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data blog')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Blog')
            }
        },
        async getBlogById(blogId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/blogs/${ blogId }`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.blog = response.data
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to load data blog')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Blog')
            }
        },
        async exportBlog() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/blogs/export/excel`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                return response
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to export data blog')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Blog')
            }
        },
        async createBlog(createData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/blogs`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: createData
                })
                this.status_code = response.meta.code
                this.totalPages = response.meta.total
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to create new blog')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Blog')
            }
        },
        async saveImageBlog(formData: FormData, blogId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/blogs/upload/${blogId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: formData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to save image blog')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Blog')
            }
        },
        async updateBlog(updateData: any, blogId: string) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/blogs/${blogId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to update blog')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Blog')
            }
        },
        async deleteBlog(blogId: number) {
            const token = useCookie('auth-token')
            const response = await fetch(`${apiUrl}/blogs/${blogId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` },
            })
            this.status_code = response.status
            if (this.status_code === 200) {
                this.page = 1
                await this.getAllBlog()
            } else {
                Cookies.set('alert-message', 'Failed to delete blog')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Blog')
            }
        },
    },
})
