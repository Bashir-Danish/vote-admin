<template>
  <div class="uploader">
    <FileSelector accept-extensions=".jpg,.png,.jpeg" :multiple="false" :max-file-size="10 * 1024 * 1024"
      @changed="handleFilesChanged" class="uploader__file-selector">
      <div v-if="file != null && !isLoading" class="preview">
        <vue-feather type="file-text" size="3.5rem" stroke="#1676FF" />
        <div>
          <p class="preview__title">فایل انتخاب شده</p>
          <p class="preview__name">{{ file.name }}</p>
          <p class="preview__size">KB {{ fileSize }}</p>
        </div>
      </div>

      <div v-else-if="isLoading" class="loader" @drag.prevent="">
        <span>
          <radar-spinner :animation-duration="2000" :size="50" color="#1676FF" />
        </span>
        <span class="loader__text">در حال آپلود</span>
      </div>

      <div v-else class="holder">
        <vue-feather type="upload-cloud" size="1.8rem" stroke="#1676FF" />
        <p>برای آپلود کلیک کنید ویا فایل را بکشید</p>
      </div>
    </FileSelector>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { RadarSpinner } from "epic-spinners";
import { inject, ref } from "vue";
import { useToast } from "vue-toastification";
const emit = defineEmits(["uploaded"]);
const uploadedEmit = (filePath) => emit("uploaded", filePath);
const isLoading = ref(false);
const axios = inject("axios");
const file = ref(null);
const fileSize = computed(() => {
  if (file.value == null) return 0;
  return ~~(file.value.size / 1024);
});

const handleFilesChanged = async (files) => {
  let formData = new FormData();
  formData.append("file", files[0]);
  isLoading.value = true;
  axios.post("https://api.soacs.app/upload", formData, {
  // axios.post("http://localhost:5000/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => {
    file.value = files[0];
    uploadedEmit(res.data.path);
    isLoading.value = false;
  }).catch((err) => {
    console.log(err);
    useToast().error("خطا در آپلود فایل");
    isLoading.value = false;
  });
};
</script>

<style lang="scss">
.uploader__file-selector {
  width: 100%;
  height: 100px;
  background-color: white;
  border: 1px solid #e0e0e0;
  cursor: pointer !important;
  border-radius: 5px;

  >div {
    width: 100%;
    height: 100%;
  }

  .holder,
  .loader {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px !important;
    font-family: var(--vt-f-main), sans-serif;
    font-weight: 700;
    gap: 10px;

    span {
      font-size: 14px !important;
      font-family: var(--vt-f-main), sans-serif;
      font-weight: 700 !important;
    }
  }

  .preview {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 20px;

    >div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      overflow: hidden;
      white-space: nowrap;
      max-width: 200px;

      .preview__name {
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
