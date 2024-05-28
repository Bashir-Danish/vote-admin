import VueModal from "@kouts/vue-modal";
import "@kouts/vue-modal/dist/vue-modal.css";
import axios from "axios";
import { createPinia } from "pinia";
import { createApp } from "vue";
import VueAxios from "vue-axios";
import VueFeather from "vue-feather";
import FileSelector from "vue-file-selector";
import "vue-file-selector/dist/main.css";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createVfm } from 'vue-final-modal';
import 'vue-final-modal/style.css';
import Switch from "@/components/Switch.vue";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
app.use(createVfm())

app.component(VueFeather.name, VueFeather);
app.component("Modal", VueModal);
app.component("MSwitch", Switch);
app.use(createPinia());
app.use(router);
app.use(FileSelector);
app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  maxToasts: 1,
  newestOnTop: true,
  timeout: 2500,
});

app.mount("#app");
