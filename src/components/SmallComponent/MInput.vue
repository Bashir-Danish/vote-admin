<template>
  <div class="custom-input">
    <input
      :type="type"
      :required="required"
      @input="onInput($event.target.value)"
      class="custom-input__input"
      :value="modelValue"
      :placeholder="$attrs.placeholder"
      ref="inputElement"
      :style="{ textAlign: textAlign }"
    />
    <div class="custom-input__error-msg" v-if="errorMessage && hasError">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const inputElement = ref(null);
const emit = defineEmits(["update:modelValue"]);
const { type, required, modelValue, hasError, errorMessage, textAlign } =
  defineProps({
    type: {
      default: "text",
      type: String,
    },
    required: {
      default: false,
      type: Boolean,
    },
    textAlign: {
      default: "right",
      type: String,
    },
    modelValue: {
      type: [String, Number],
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
    },
  });

function onInput(value) {
  emit("update:modelValue", value);
}
</script>

<style lang="scss" scoped>
input {
  width: 100%;
  margin-bottom: 12px;
  height: 50px;
  font-size: 16px;
  border-radius: 2em;
  padding-right: 15px;
  border: solid 1px rgb(198, 184, 184);
  box-sizing: border-box;
  transition: box-shadow 0.2s ease-in-out;
  font-family: inherit;
}

input:focus {
  outline: none;
}

input:hover {
  box-shadow: -1px 2px 3px rgb(221, 221, 221);
}
</style>
