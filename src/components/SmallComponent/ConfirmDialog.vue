<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
defineProps<{
    title?: string,
    confirmText?: string,
    cancelText?: string,
}>()
const emit = defineEmits<{
    (e: 'confirm'): void,
    (e: 'cancel'): void
}>()
</script>
<template>
    <VueFinalModal class="confirm-modal" content-class="confirm-modal-content" overlay-transition="vfm-fade"
        content-transition="vfm-fade">
        <h1>{{ title }}</h1>
        <div class="content">
            <slot />
        </div>
        <div class="confirm-buttons">
            <button @click="emit('confirm')" class="red">
                {{ confirmText ?? 'تایید' }}
            </button>
            <button @click="emit('cancel')">
                {{ cancelText ?? 'انصراف' }}
            </button>
        </div>
    </VueFinalModal>
</template>
<style>
.confirm-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000 !important;
}

.confirm-modal h1 {
    font-weight: 700;
}

.confirm-modal-content {
    display: flex;
    flex-direction: column;
    padding: 1rem 1.4rem;
    background: #fff;
    border-radius: 0.5rem;
    width: 340px;
}

.confirm-modal-content .content {
    margin-top: 12px;
    margin-bottom: 12px;
}

.confirm-modal-content>*+* {
    margin: 0.5rem 0;
}

.confirm-modal-content h1 {
    font-size: 1.375rem;
}

.dark .confirm-modal-content {
    background: #000;
}

.confirm-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;
}

.confirm-buttons>button {
    background-color: var(--vt-c-main);
    color: white;
    border: none;
    padding: 6px 16px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    border-radius: 16px;
    cursor: pointer;
    transition: all .2s ease;
}

.confirm-buttons>button.red {
    background-color: var(--vt-c-red);
}

.confirm-buttons>button:hover {
    transform: scale(1.05);
}
</style>