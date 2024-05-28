<template>
  <div class="users-con">
    <div class="top-bar">
      <div>
        <h2>تنظیمات</h2>
        <span>آخرین آپدیت به تاریخ
          {{ time }}
        </span>
      </div>
      <button class="main-btn" @click="mainStore.loadData()">
        <span>آپدیت صفحه</span>
        <vue-feather type="refresh-ccw"></vue-feather>
      </button>
    </div>
    <div class="content small">
      <div class="section">
        <h2>دسته بندی پیشفرض</h2>
        <div class="list select">
          <Multiselect v-model="mainStore.defaultCat" :options="mainStore.categories" :close-on-select="true"
            :clear-on-select="false" placeholder="انتخاب دسته بندی" label="name" track-by="_id" />
          <button class="add" @click="setDefaults({ key: 'defaultCat', value: mainStore.defaultCat?._id })">ذخیره</button>
        </div>
      </div>
      <div class="section">
        <h2>ولایت پیشفرض</h2>
        <div class="list select">
          <Multiselect v-model="mainStore.defaultProvince" :options="mainStore.provinces" :close-on-select="true"
            :clear-on-select="false" placeholder="انتخاب ولایت" label="name" track-by="_id" />
          <button class="add"
            @click="setDefaults({ key: 'defaultProvince', value: mainStore.defaultProvince?._id })">ذخیره</button>
        </div>
      </div>
      <div class="section">
        <h2>ولسوالی پیشفرض</h2>
        <div class="list select">
          <Multiselect v-model="mainStore.defaultDistrict" :options="filteredDistricts" :close-on-select="true"
            :clear-on-select="false" placeholder="انتخاب ولسوالی" label="name" track-by="_id" />
          <button class="add"
            @click="setDefaults({ key: 'defaultDistrict', value: mainStore.defaultDistrict?._id })">ذخیره</button>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="section">
        <h2>دسته بندی ها</h2>
        <div class="list">
          <div class="item" v-for="c in mainStore.categories">
            <h3>
              {{ getLangy(c.name) }}
            </h3>
            <div style="display: flex;align-items: center;">
              <vue-feather type="edit" size="18" @click="editCat(c._id)"></vue-feather>
              <span style="width: 10px"></span>
              <vue-feather type="trash-2" @click="mainStore.deleteCategory(c._id)"></vue-feather>
            </div>
          </div>
        </div>
        <button class="add" @click="catModal = true">
          <vue-feather type="plus"></vue-feather>
          <span>افزودن دسته بندی</span>
        </button>
      </div>
      <div class="section">
        <h2>تنظیمات اپلیکیشن</h2>
        <div class="list">
          <div class="item pointer" v-for="c in mainStore.settings" @click="settingClick(c)">
            <h3>
              {{ mainStore.settingsTitle[c.key] }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal v-model="catModal" title="افزودن دسته بندی">
    <div class="modal-con">
      <div class="sub-item">
        <input type="text" v-model="catName" placeholder="زبان: دری" />
      </div>
      <div class="sub-item">
        <input type="text" v-model="catNamePs" placeholder="زبان: پشتو" />
      </div>
      <div class="sub-item">
        <input type="text" v-model="catNameEn" placeholder="زبان: انگلیسی" />
      </div>
    </div>
    <button class="main-btn save-btn" @click="addCategory()">
      <span>ذخیره دسته</span>
      <vue-feather type="plus"></vue-feather>
    </button>
  </Modal>

  <Modal v-model="settingsModal" :title="settingTitle">
    <div class="modal-con">
      <div class="sub-item" dir="ltr">
        <input type="text" v-model="mainStore.selectedSetting.value" />
      </div>
    </div>
    <button class="main-btn save-btn" @click="saveSetting()">
      <span>ذخیره</span>
      <vue-feather type="plus"></vue-feather>
    </button>
  </Modal>
</template>

<script setup>
import Multiselect from "@/components/Multiselect.vue";
import { useMainStore } from "@/stores/main";
import { computed, ref, watch } from "vue";
import { getLangy } from "../../utils/lang_util";
const mainStore = useMainStore();

const m = new Date(Date.now() + -1 * new Date().getTimezoneOffset() * 60000);
const time =
  m.getUTCDate() +
  "-" +
  (m.getUTCMonth() + 1) +
  "-" +
  m.getUTCFullYear() +
  "  " +
  ("0" + m.getUTCHours()).slice(-2) +
  ":" +
  ("0" + m.getUTCMinutes()).slice(-2);

const catModal = ref(false);
const settingsModal = ref(false);

const catId = ref(null)
const catName = ref("");
const catNamePs = ref("");
const catNameEn = ref("");
const settingTitle = ref("");

const addCategory = () => {
  if (catId.value != null) {
    editCategory();
  } else {
    mainStore.addCategory(catName.value, catNamePs.value, catNameEn.value);
    catName.value = "";
    catNamePs.value = "";
    catNameEn.value = "";
    catModal.value = false;
  }
};
const editCategory = () => {
  mainStore.editCategory(catName.value, catNamePs.value, catNameEn.value, catId.value);
  catModal.value = false;
};
const settingClick = (setting) => {
  mainStore.selectedSetting = setting;
  settingTitle.value = mainStore.settingsTitle[setting.key];
  settingsModal.value = true;
};
const saveSetting = () => {
  mainStore.saveSetting(() => {
    settingsModal.value = false;
  });
}

const filteredDistricts = computed(() => {
  if (mainStore.defaultProvince) {
    return mainStore.districts.filter((d) => d.province._id === mainStore.defaultProvince._id);
  }
  return [];
});
const setDefaults = (payload) => {
  if (payload.value) {
    mainStore.setDefaults(payload);
  }
}
const editCat = (id) => {
  catId.value = id;
  catModal.value = true;
  const cat = mainStore.categories.find(c => c._id == id);
  catName.value = cat.name[0];
  catNamePs.value = cat.name[1];
  catNameEn.value = cat.name[2];
}
watch(catModal, (value) => {
  if (value != true) {
    catName.value = '';
    catNamePs.value = '';
    catNameEn.value = '';
    catId.value = null;
  }
})
</script>

<style lang="scss" scoped>
.users-con {
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

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 2%;
    gap: 2% 1%;
    width: 100%;

    &.small {
      grid-template-columns: 1fr 1fr 1fr;
      height: auto;
    }

    >div {
      display: flex;
      flex-direction: column;
      align-items: space-between;
      justify-content: flex-start;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
      max-height: 40vh;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }

    .section {
      h2 {
        font-size: 20px;
        font-weight: 900;
        margin-bottom: 6px;
      }

      .list {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 10px;
        overflow: auto;
        padding: 4px;

        &.select {
          height: 100%;
          overflow: visible !important;
        }

        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.7);

          h3 {
            font-size: 16px;
            font-weight: 900;
          }
        }
      }
    }
  }

  .add {
    width: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    padding: 10px;
    border: none;
    font-family: var(--vt-f-main), sans-serif;
    color: white;
    background-color: var(--vt-c-main);
    border-radius: 10px;

    span {
      font-size: 16px;
      font-weight: 700;
    }
  }
}

.modal-con {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .sub-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  input {
    height: 40px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    padding: 0 10px;
    font-size: 14px;
    color: #7d86a9;
    outline: none;
    font-family: inherit;
  }
}

.pointer {
  cursor: pointer;
}

.save-btn {
  margin-top: 16px;
}
</style>
