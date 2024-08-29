import {ref} from "vue"

export const alertMessage = ref()
export const alertType = ref()
export const alertPage = ref()

export function getAlert() {
    alertMessage.value = useCookie('alert-message').value
    alertType.value = useCookie('alert-type').value
    alertPage.value = useCookie('alert-page').value
}