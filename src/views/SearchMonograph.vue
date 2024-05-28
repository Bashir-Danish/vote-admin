<template>
  <main>
    <div class="content">
      <h1>جستجوی مونوگراف</h1>
      <h3>
        لطفا آیدی مونوگراف خودرا وارد کنید. درصورت موجود بودن به صفحه نمایش
        مونوگراف و درصورت وجود نداشتن به صفحه ثبت مونوگراف منتقل میشوید.
      </h3>

      <m-input
        class="id-input"
        ref="input"
        type="text"
        textAlign="center"
        placeholder="آیدی مونوگراف"
      />
      <button class="button" @click="search">
        <span>جستجو</span>
      </button>
    </div>
    <div class="loading" :class="{ active: loading }">
      <fingerprint-spinner
        :animation-duration="1000"
        :size="100"
        color="#1676FF"
      />
    </div>
  </main>
</template>

<script setup>
import MInput from "@/components/SmallComponent/MInput.vue";
import { FingerprintSpinner } from "epic-spinners";

import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);

const search = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    router.push("/student");
  }, 3000);
};
</script>

<style scoped lang="scss">
main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;

  * {
    font-family: inherit;
  }

  .loading {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: white;
    opacity: 0;
    z-index: -1;
    transition: all 0.3s ease-in-out;
    overflow: hidden;

    &.active {
      opacity: 1;
      z-index: 100;
    }
  }

  .content {
    width: 550px;
    text-align: center;
    border-radius: 1.5em;
    box-shadow: 0 0 5px rgb(216, 216, 216);
    padding: 36px;
    transition: box-shadow 0.2s ease-in-out;

    &:hover {
      box-shadow: 0 0 6px 3px rgb(224, 224, 224);
    }

    > h1 {
      font-weight: 800;
      margin-bottom: 8px;
    }

    > h3 {
      font-size: 0.9rem;
      line-height: 1.3;
      margin-bottom: 36px;
    }

    > .id-input {
      margin-bottom: 36px;
    }

    > .button {
      width: 50%;
      height: 50px;
      font-size: 16px;
      border-radius: 2em;
      border: solid 1px rgb(198, 184, 184);
      color: black;
      font-weight: bold;
      background: var(--vt-c-secondary);
      filter: blur(0.5px);
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      div {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      &:hover {
        filter: unset;
        transform: translateY(-2px);
      }

      &:active {
        filter: unset;
        transform: translateY(0);
      }
    }
  }
}
</style>
