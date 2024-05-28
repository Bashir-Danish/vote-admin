<script setup>
import SideBar from "@/components/SideBar.vue";
import TopBar from "@/components/TopBar.vue";
import { useAuthStore } from "@/stores/auth";
import { useMainStore } from "@/stores/main";
import { useUsersStore } from "@/stores/users";
const authStore = useAuthStore();
const mainStore = useMainStore();
const usersStore = useUsersStore();
mainStore.loadData();
// usersStore.loadUsers();
</script>

<template>
  <div class="container">
    <top-bar />
    <main>
      <side-bar />
      <div class="content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 0px;
  box-sizing: border-box;

  >main {
    display: flex;
    flex-direction: row;

    .content {
      width: 100%;
      padding: 2% 4%;
    }
  }
}
</style>
