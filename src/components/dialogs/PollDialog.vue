<template>
    <div class="modal-con m-modal-con">
        <div class="sub-item">
            <input type="text" placeholder="عنوان نظر سنجی" v-model="pStore.pollItem.title[pStore.currentLang]" />
        </div>
        <div class="sub-item expireAfter" :class="{ 'isEdit': props.isEdit }">
            <input :type="props.isEdit ? 'text' : 'number'" :disabled="props.isEdit"
                v-model="pStore.pollItem.expireAfter" />
        </div>

        <h4> گزینه ها</h4>
        <div class="sub-item option" v-for="(e, index) in pStore.pollItem.options">
            <input type="text" :disabled="pStore.pollItem._id" :placeholder="'گزینه ' + (index + 1)"
                v-model="pStore.pollItem.options[index][pStore.currentLang]" />
            <vue-feather v-if="!pStore.pollItem._id" @click="delOption(index)" class="del" type="trash-2" size="14">
            </vue-feather>
        </div>
    </div>

    <div class="actions">
        <button v-if="!pStore.pollItem._id" class="main-btn save-btn" @click="addPoll()">
            <span>ذخیره</span>
            <vue-feather type="plus"></vue-feather>
        </button>
        <span v-else></span>
        <div style="display: flex; gap: 10px">
            <button v-if="pStore.pollItem._id" class="main-btn save-btn" @click="deletePoll()">
                <span>حذف </span>
                <vue-feather type="trash-2"></vue-feather>
            </button>
            <button v-else class="main-btn save-btn add" @click="pStore.pollItem.options.push(['', '', ''])">
                <span>گزینه جدید</span>
            </button>
            <button class="main-btn save-btn" @click="pStore.changeLang()">
                <span>زبان فعلی: {{ pStore.getLang }}</span>
                <vue-feather type="globe"></vue-feather>
            </button>
        </div>
    </div>
</template>
<script setup>
import { usePollsStore } from "@/stores/polls";

const props = defineProps('isEdit');
const emit = defineEmits(['onClose']);

const pStore = usePollsStore();

const addPoll = async () => {
    await pStore.addPoll();
    emit('onClose')
};

const delOption = (index) => {
    pStore.pollItem.options.splice(index, 1);
};

const deletePoll = async () => {
    await pStore.deletePoll();
    emit('onClose')
};
</script>
<style lang="scss" scoped>
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

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
        appearance: textfield;
    }

    .expireAfter>input {
        position: relative;
        padding-left: 12px;
        padding-right: 95px;
    }

    .expireAfter::before {
        content: "منقضی بعد از";
        position: absolute;
        right: 8px;
        top: 45%;
        transform: translateY(-50%);
        z-index: 100;
    }

    .expireAfter::after {
        content: "روز";
        position: absolute;
        left: 10px;
        top: 45%;
        transform: translateY(-50%);
    }

    .expireAfter.isEdit::after {
        content: "";
        position: absolute;
    }

    textarea {
        resize: vertical;
        min-height: 100px;
        max-height: 300px;
    }

    >div {
        position: relative;
    }

    div.option>.del {
        content: "x";
        position: absolute;
        right: -20px;
        top: 30%;
        color: red;
        cursor: pointer;
    }
}

.vm {

    .actions {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 8px;

        .add span {
            margin: 0px;
        }
    }

}
</style>