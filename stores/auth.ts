import { defineStore } from 'pinia'
import { apiUrl } from '~/helpers/Variable'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        user: null,
        status_code: null,
    }),
    getters: {
        isLoggedIn: (state) => state.token ? true : false,
    },
    actions: {
        async login(credentials: any) {
            try {
                const response = await $fetch(`${apiUrl}/auth/login`, {
                    method: 'POST',
                    body: credentials
                })
                this.token = response.data.token
                this.user = response.data
                Cookies.set('auth-token', this.token)
                Cookies.set('auth-user', JSON.stringify(this.user))
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response?.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Email or password not found')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Login')
            }
        },
        async register(registerData: any) {
            try {
                const response = await $fetch(`${apiUrl}/auth/register`, {
                    method: 'POST',
                    body: registerData,
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response?.status || error.statusCode || error.code || 'Unknown error'
                if (this.status_code === 400) {
                    Cookies.set('alert-message', 'Account is already exist')
                } else {
                    Cookies.set('alert-message', 'Failed to register account')
                }
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Register')
            }
        },
        async checkProfile() {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/auth/user/me`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                })
                this.user = response.data
                Cookies.set('auth-user', JSON.stringify(this.user))
            } catch (error) {
                this.status_code = error.response?.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to check profile')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Profile')
            }
        },
        async updateProfile(updateData: any) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/auth/update`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: updateData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response?.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to update profile')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Profile')
            }
        },
        async saveImageProfile(formData: FormData) {
            try {
                const token = useCookie('auth-token')
                const response = await $fetch(`${apiUrl}/auth/upload-avatar`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: formData
                })
                this.status_code = response.meta.code
            } catch (error) {
                this.status_code = error.response?.status || error.statusCode || error.code || 'Unknown error'
                Cookies.set('alert-message', 'Failed to save image profile')
                Cookies.set('alert-type', 'false')
                Cookies.set('alert-page', 'Profile')
            }
        },
        async logout() {
            this.token = ''
            this.user = null
            Cookies.remove('auth-token')
            Cookies.remove('auth-user')
        },
    },
})
