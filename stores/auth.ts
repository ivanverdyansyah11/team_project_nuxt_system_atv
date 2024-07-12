// stores/auth.ts
import { defineStore } from 'pinia';
import { apiUrl } from '~/helpers/Variable';
import axios from 'axios';
import Cookies from 'js-cookie';

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
                });
                this.token = response?.data.token;
                this.user = response?.data;
                Cookies.set('auth-token', this.token);
                Cookies.set('auth-user', JSON.stringify(this.user));
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error.message)
            }
        },
        async logout() {
            this.token = '';
            this.user = null;
            Cookies.remove('auth-token');
            Cookies.remove('auth-user');
        },
        async register(registerData: any) {
            try {
                const response = await $fetch(`${apiUrl}/auth/register`, {
                    method: 'POST',
                    body: registerData,
                });
                this.status_code = response?.data ? 200 : null;
            } catch (error) {
                console.log(error.message)
            }
        },
    },
});
