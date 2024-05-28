<template>
  <nav>
    <div class="logo">
      <h1>موسسه حمایت از جامعه مدنی افغانستان</h1>
    </div>

    <button class="main-btn" @click="mainStore.setLang()">
      <span>{{ mainStore.getLang }}</span>
      <vue-feather type="globe"></vue-feather>
    </button>
  </nav>
</template>

<script setup>
import { useMainStore } from '@/stores/main';
import { onMounted } from 'vue';

const mainStore = useMainStore()

onMounted(() => {
  mainStore.setLang(localStorage.getItem('lang') ?? 0)
})

</script>

<style scoped lang="scss">
nav {
  width: 100%;
  height: 70px;
  background: var(--vt-c-main);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  color: white;
  margin: 0px !important;

  .logo>h1 {
    font-family: var(--vt-f-heading);
    font-weight: 900;
  }

  .status {
    display: flex;
    cursor: pointer;

    >div {
      margin-left: 16px;
      line-height: 1.4;
      display: flex;
      flex-direction: column;
    }
  }
}

.main-btn:hover {
  transform: translateY(0);
}
</style>
