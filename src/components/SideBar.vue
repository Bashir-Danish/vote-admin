<template>
  <aside class="sidebar">
    <div v-for="item in items" :key="item.name" class="side-item" :class="{ active: isActive === item.link }"
      @click.self="navigate(item.link)">
      {{ item.title }}
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const items = [
  { name: "dashboard", link: "/", title: "مرور کلی" },
  { name: "posts", link: "/posts", title: "گزارش ها" },
  { name: "userPosts", link: "/userPosts", title: "گزارش های کاربران" },
  { name: "polls", link: "/polls", title: "نظرسنجی ها" },
  { name: "comments", link: "/comments", title: "کامنت ها" },
  { name: "management", link: "/management", title: "مدیریت" },
  { name: "settings", link: "/settings", title: "تنظیمات" },
];

const isActive = computed(() => "/" + route.fullPath.split("/")[1]);
const routeName = computed(() => route.fullPath.split("/").pop());
console.log(routeName.value);

const navigate = (link) => router.push(link);
</script>

<style lang="scss">
.sidebar {
  height: calc(100vh - 70px);
  width: max(300px, 20vw);
  background: white;
  padding: 46px 0;

  .side-item {
    padding: 16px 32px;
    cursor: pointer;
    margin-bottom: 4px;
    font-weight: 700;
    color: #7d86a9;
    font-size: 17px;
    transition: all 0.25s ease;

    &.active {
      color: black;

      &:before {
        content: "";
        position: absolute;
        right: 1px;
        top: 0;
        z-index: 100;
        width: 4px;
        height: 60px;
        background: var(--vt-c-main);
        border-radius: 20px;
      }
    }

    &:hover {
      color: #575f77;
    }
  }
}
</style>
