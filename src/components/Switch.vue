<template>
    <div class="checkbox-wrapper-22">
        <label class="switch" for="checkbox">
            <input type="checkbox" id="checkbox" v-model="value" />
            <div class="slider round"></div>
        </label>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
  
<style scoped>
.checkbox-wrapper-22 .switch {
    display: inline-block;
    height: 28px;
    position: relative;
    width: 48px;
}

.checkbox-wrapper-22 .switch input {
    display: none;
}

.checkbox-wrapper-22 .slider {
    background-color: #ccc;
    bottom: 0;
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: .4s;
}

.checkbox-wrapper-22 .slider:before {
    background-color: #fff;
    bottom: 4px;
    content: "";
    height: 20px;
    left: 4px;
    position: absolute;
    transition: .4s;
    width: 20px;
}

.checkbox-wrapper-22 input:checked+.slider {
    background-color: #66bb6a;
}

.checkbox-wrapper-22 input:checked+.slider:before {
    transform: translateX(20px);
}

.checkbox-wrapper-22 .slider.round {
    border-radius: 34px;
}

.checkbox-wrapper-22 .slider.round:before {
    border-radius: 50%;
}
</style>
  