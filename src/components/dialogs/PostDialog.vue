<template>
    <div class="modal-con">
        <div class="m-modal-con first">
            <div class="sub-item"  :dir="(pStore.currentLang == 2) ? 'ltr' : 'rtl'">
                <input type="text" placeholder="عنوان" v-model="pStore.postItem.title[pStore.currentLang]" />
            </div>
            <Multiselect v-model="pStore.postItem.province" :options="mainStore.provinces" :close-on-select="true"
                :clear-on-select="false" placeholder="انتخاب ولایت" label="name" track-by="_id" class="select-item" />
            <Multiselect v-model="pStore.postItem.district" :options="availableDistrict" :close-on-select="true"
                :clear-on-select="false" placeholder="انتخاب ولسوالی" label="name" track-by="_id" class="select-item" />
            <Multiselect v-model="pStore.postItem.office" :options="availableOffice" :close-on-select="true"
                :clear-on-select="false" placeholder="انتخاب اداره" label="name" track-by="_id" class="select-item" />
            <Multiselect v-model="pStore.postItem.category" :options="mainStore.categories" :close-on-select="true"
                :clear-on-select="false" placeholder="انتخاب دسته بندی" label="name" track-by="_id" class="select-item" />

            <Uploader @uploaded="uploaded" />

            <uploaded-files :files="pStore.postItem.file" @remove="removeFile" />

            <div class="user-naming">
                <span>نمایش نام فرستنده</span>
                <MSwitch v-model="pStore.postItem.showUser" />
            </div>
        </div>
        <div class="m-modal-con second">
            <div class="sub-item" :dir="(pStore.currentLang == 2) ? 'ltr' : 'rtl'">
                <textarea v-model="pStore.postItem.text[pStore.currentLang]"></textarea>
            </div>
        </div>
    </div>

    <div class="actions">
        <div>
            <button class="main-btn save-btn" @click="savePost()">
                <span>ذخیره </span>
                <vue-feather type="plus"></vue-feather>
            </button>
            <button v-if="pStore.postItem._id" class="main-btn save-btn" @click="deletePost()">
                <span>حذف </span>
                <vue-feather type="trash-2"></vue-feather>
            </button>
        </div>
        <div>
            <button v-if="pStore.postItem._id && pStore.postItem.isApprove == false" class="main-btn save-btn"
                @click="approve()">
                <span>قبول کردن</span>
                <vue-feather type="anchor"></vue-feather>
            </button>
            <button class="main-btn save-btn" @click="pStore.changeLang()">
                <span>زبان فعلی: {{ pStore.getLang }}</span>
                <vue-feather type="globe"></vue-feather>
            </button>
        </div>
    </div>
</template>
<script setup>
import Multiselect from "@/components/Multiselect.vue";
import ConfirmDialog from '@/components/SmallComponent/ConfirmDialog.vue';
import UploadedFiles from '@/components/SmallComponent/UploadedFiles.vue';
import Uploader from '@/components/Uploader.vue';
import { useMainStore } from "@/stores/main";
import { computed } from "vue";
import { useModal } from 'vue-final-modal';

const emit = defineEmits(['closeModal']);

const props = defineProps(['store']);
const mainStore = useMainStore();
const pStore = props.store;
const uploaded = (file) => {
    pStore.postItem.file.push(file)
}
const savePost = async () => {
    if (pStore.postItem._id) {
        await pStore.updatePost(mainStore);
        emit('closeModal');
    } else {
        await pStore.addPost(mainStore);
        emit('closeModal');
    }
};
const availableDistrict = computed(() => {
    const list = mainStore.districts.filter((d) => d.province._id == pStore.postItem.province?._id) ?? [];
    if (!list.filter((d) => d._id == pStore.postItem.district?._id).length && pStore.postItem.district?._id != null) {
        pStore.postItem.district = null;
    }
    return list;
})
const availableOffice = computed(() => {
    const list = mainStore.offices.filter((d) => d.district._id == pStore.postItem.district?._id) ?? [];
    if (!list.filter((d) => d._id == pStore.postItem.office?._id).length && pStore.postItem.office?._id != null) {
        pStore.postItem.office = null;
    }
    return list;
})

const deletePost = async () => {
    dOpen();
};
const approve = async () => {
    await pStore.approvePost();
    emit('closeModal');
};
const removeFile = (index) => {
    pStore.postItem.file.splice(index, 1)
};

const { open: dOpen, close: dClose } = useModal({
    component: ConfirmDialog,
    attrs: {
        title: 'حذف گذارش',
        onConfirm() {
            pStore.deletePost().then(() => {
                dClose();
                emit('closeModal');
            })
        },
        onCancel() {
            dClose();
        },
    },
    slots: {
        default: '<p>آیا میخواهید این گذارش را حذف کنید؟</p>',
    },
})
</script>
<style lang="scss" scoped>
.modal-con {
    display: flex !important;
    flex-direction: row !important;
    width: 100%;

    >.first {
        width: 40%;
        padding: 0 10px;
    }

    >.second {
        width: 60%;
        padding: 0 10px;

        textarea {
            min-height: 600px;
            max-height: 650px;
            padding: 8px;
        }
    }
}

.m-modal-con {
    >* {
        margin-bottom: 12px;
    }

    input,
    textarea {
        height: 40px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        padding: 0 10px;
        font-size: 14px;
        color: #7d86a9;
        outline: none;
        font-family: inherit;
        width: 100%;
    }

    textarea {
        resize: vertical;
        min-height: 100px;
        max-height: 300px;
    }
}

.vm {
    .user-naming {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        span {
            font-size: 1rem;
            color: #7d86a9;
        }
    }


    .actions {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        div {
            display: flex;
            gap: 8px;
        }
    }
}
</style>