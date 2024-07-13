import { defineNuxtRouteMiddleware } from 'nuxt/app';
import { useAuthStore } from '~/stores/auth';
import { navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    const authToken = useCookie('auth-token');
    const authUser = useCookie('auth-user');

    if (authToken.value) {
        authStore.token = authToken.value;
    }

    if (authUser.value) {
        authStore.user = authUser.value;
    }

    if (!authStore.isLoggedIn && (to.path === '/dashboard')) {
        return navigateTo('/dashboard/auth/login');
    } else if (authStore.isLoggedIn && (to.path === '/dashboard/auth/login' || to.path === '/dashboard/auth/register')) {
        return navigateTo('/dashboard');
    }
});
