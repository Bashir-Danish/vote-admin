<template>
  <main>
    <div class="container">
      <div class="title">مونوگراف<span>.</span></div>
      <div class="box">
        <div class="details">ورود به داشبورد</div>
        <div class="inputs">
          <m-input type="text" placeholder="نام کاربری" v-model="username" />
          <m-input type="password" placeholder="پسورد" v-model="password" />
        </div>
        <button class="button" @click="click()">ورود</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import MInput from "@/components/SmallComponent/MInput.vue";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");
const authStore = useAuthStore();
const click = () => {
  authStore.login(username.value, password.value, () => {
    router.push("/");
  });
};
</script>

<style scoped lang="scss">
main {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  * {
    font-family: inherit;
  }
}

.container {
  width: 550px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4vh;
}

.title {
  font-size: 35px;
  font-family: var(--vt-f-heading), sans-serif;
  color: var(--vt-c-main);
  font-weight: bold;
  margin-bottom: 59px;
}

.title > span {
  color: var(--vt-c-secondary);
}

.box {
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: right;
  border-radius: 1.5em;
  box-shadow: 0 0 5px rgb(216, 216, 216);
  padding: 50px 75px;
  transition: box-shadow 0.2s ease-in-out;
}

.box:hover {
  box-shadow: 0 0 6px 3px rgb(224, 224, 224);
}

.details {
  font-size: 28px;
}

.inputs {
  margin-top: 45px;
}
.check {
  margin-top: 35px;
  font-size: 15px;
  font-weight: lighter;
  display: flex;
  align-items: center;
}

.check input {
  width: 20px;
  height: 20px;
  margin-left: 8px;
}

.button {
  height: 50px;
  font-size: 16px;
  margin-top: 40px;
  border-radius: 2em;
  border: solid 1px rgb(198, 184, 184);
  color: black;
  font-weight: bold;
  background: var(--vt-c-secondary);
  filter: blur(0.5px);
  transition: filter 0.2s ease-in-out;
  cursor: pointer;
}

.button:hover {
  filter: unset;
}
</style>
