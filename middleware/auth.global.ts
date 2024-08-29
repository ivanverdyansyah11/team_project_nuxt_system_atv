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

    if (!authStore.isLoggedIn && (to.path.startsWith('/dashboard') || to.path.startsWith('/homepage/profile') || to.path.startsWith('/homepage/booking'))) {
        return navigateTo('/homepage');
    } else if (authStore.isLoggedIn && (to.path === '/auth/login' || to.path === '/auth/register')) {
        return navigateTo('/homepage');
    } else if (authStore.isLoggedIn && authUser.value.user.role != 'customer' && to.path.startsWith('/homepage/profile')) {
        return navigateTo('/homepage');
    } else if (authStore.isLoggedIn && authUser.value.user.role == 'instructor' && to.path.startsWith('/homepage/booking')) {
        return navigateTo('/homepage');
    } else if (authStore.isLoggedIn && authUser.value.user.role == 'customer' && to.path.startsWith('/dashboard')) {
        return navigateTo('/homepage');
    } else if (authStore.isLoggedIn && authUser.value.user.role == 'instructor' && (to.path.startsWith('/dashboard/instructor') || to.path.startsWith('/dashboard/staff') || to.path.startsWith('/dashboard/customer') || to.path.startsWith('/dashboard/facility') || to.path.startsWith('/dashboard/route') || to.path.startsWith('/dashboard/luggage') || to.path.startsWith('/dashboard/blog') || to.path.startsWith('/dashboard/booking') || to.path == '/dashboard/entertainment-package/create' || to.path.startsWith('/dashboard/entertainment-package/edit') || to.path == '/dashboard/entertainment-service/create' || to.path.startsWith('/dashboard/entertainment-service/edit'))) {
        return navigateTo('/dashboard');
    } else if (authStore.isLoggedIn && authUser.value.user.role == 'staff' && (to.path.startsWith('/dashboard/instructor') || to.path.startsWith('/dashboard/staff') || to.path.startsWith('/dashboard/customer') || to.path.startsWith('/dashboard/facility') || to.path.startsWith('/dashboard/route') || to.path.startsWith('/dashboard/luggage') || to.path == '/dashboard/entertainment-package/create' || to.path.startsWith('/dashboard/entertainment-package/edit') || to.path == '/dashboard/entertainment-service/create' || to.path.startsWith('/dashboard/entertainment-service/edit'))) {
        return navigateTo('/dashboard');
    }
});