<template>
  <div class="dashboard-con">
    <div class="top-bar">
      <div>
        <h2>مرور کلی</h2>
        <span>آخرین آپدیت به تاریخ
          {{ time }}
        </span>
      </div>
      <button class="main-btn" @click="getData()">
        <span>آپدیت صفحه</span>
        <vue-feather type="refresh-ccw"></vue-feather>
      </button>
    </div>
    <div class="posts-analyze">
      <div class="card">
        <h2>{{ d.posts }}</h2>
        <h3>همه پست ها</h3>
      </div>
      <div class="card">
        <h2>{{ d.polls }}</h2>
        <h3>همه نظر سنجی ها</h3>
      </div>
      <div class="card">
        <h2>{{ d.users }}</h2>
        <h3>همه کاربران</h3>
      </div>
      <div class="card">
        <h2>{{ d.comments }}</h2>
        <h3>همه کامنت ها</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMyFetch } from "@/utils/myFetch";
import { computed, ref } from 'vue';

var m = new Date(Date.now() + -1 * new Date().getTimezoneOffset() * 60000);
const d = ref({
  posts: '_',
  polls: '_',
  users: '_',
  comments: '_'
});
const time = computed(() => {
  return m.getUTCDate() +
    "-" +
    (m.getUTCMonth() + 1) +
    "-" +
    m.getUTCFullYear() +
    "  " +
    ("0" + m.getUTCHours()).slice(-2) +
    ":" +
    ("0" + m.getUTCMinutes()).slice(-2);
})
const getData = async () => {
  const { data } = await useMyFetch("setting/dashboard").get().json()
  data.value = data.value.data || {}
  console.log(data.value)
  d.value.posts = data.value.posts ?? '_'
  d.value.polls = data.value.polls ?? '_'
  d.value.users = data.value.users ?? '_'
  d.value.comments = data.value.comments ?? '_'
  m = new Date(Date.now() + -1 * new Date().getTimezoneOffset() * 60000);
}
getData();
</script>

<style scoped lang="scss">
.dashboard-con {
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    >div {
      display: flex;
      flex-direction: column;

      >h2 {
        font-weight: 900;
        margin-bottom: 4px;
        font-size: 35px;
      }

      >span {
        color: #7d86a9;
        font-size: 14px;
      }
    }
  }

  .posts-analyze {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-column-gap: 28px;
    grid-row-gap: 28px;
    margin-top: 40px;

    .card {
      padding: 24px 36px;
      background: white;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      box-shadow: rgba(17, 17, 26, 0.1) 0 0 16px;

      >h2 {
        font-family: var(--vt-f-heading), sans-serif;
        font-weight: 700;
        font-size: 35px;
      }

      >h3 {
        font-size: 18px;
      }
    }
  }
}
</style>
