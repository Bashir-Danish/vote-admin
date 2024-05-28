import { useModal } from 'vue-final-modal'
import ConfirmDialog from '@/components/SmallComponent/ConfirmDialog.vue'
export const useAlertModal = () => {
    const delModal = (confirm, cancel) => {
        const { open, close } = useModal({
            component: ConfirmDialog,
            attrs: {
                title: 'Hello World!',
                onConfirm() {
                    confirm();
                    close();
                },
                onCancel() {
                    cancel();
                    close();
                },
            },
            slots: {
                default: '<p>UseModal: The content of the modal</p>',
            },
        })
        open();
    }

    return {
        delModal,
    }
}