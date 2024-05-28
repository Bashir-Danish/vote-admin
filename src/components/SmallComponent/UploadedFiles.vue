<template>
    <div class="files-con">
        <a target="_blank" v-for="f, index in files" :href="f">فایل {{ index + 1 }} <span>&nbsp;&nbsp;({{
                format(f)
        }})</span> <span v-if="!unremovable" class="del-btn" @click.prevent="del(index)">
                <vue-feather type="trash-2"></vue-feather>
            </span> </a>
    </div>
</template>
<script setup>
const { files } = defineProps(['files', 'unremovable'])
const emit = defineEmits(['remove'])

// return format of url
const format = (file) => {
    return file.split('.').pop().split('?')[0].toUpperCase()
}
const del = (index) => {
    emit('remove', index)
}
</script>
<style lang="scss" scoped>
.files-con {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    grid-gap: 10px;
    margin-top: 10px;
    margin-bottom: 10px;

    >a {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        color: #7d86a9;
        font-size: 14px;
        text-decoration: none;
        transition: all .3s ease;

        &:hover {
            background-color: #e0e0e0;
        }
    }

    .del-btn {
        position: absolute;
        left: 4px;
        height: 100%;
        display: flex;
        align-items: center;
        top: 0px;
    }
}
</style>