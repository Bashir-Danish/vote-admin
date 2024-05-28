<template>
  <div class="users-con">
    <div class="top-bar">
      <div>
        <h2>مدیریت مناطق</h2>
        <span>آخرین آپدیت به تاریخ
          {{ time }}
        </span>
      </div>
      <button class="main-btn" @click="mainStore.loadData()">
        <span>آپدیت صفحه</span>
        <vue-feather type="refresh-ccw"></vue-feather>
      </button>
    </div>
    <div class="content">
      <div class="section">
        <div class="title">
          <h2>ولایات</h2>
        </div>
        <div class="list">
          <div class="item" v-for="p in mainStore.provinces">
            <h3>{{ getLangy(p.name) }}</h3>
            <div style="display: flex;align-items: center;">
              <vue-feather type="edit" size="18" @click="ePro(p)"></vue-feather>
              <span style="width: 10px"></span>
              <vue-feather type="trash-2" @click="mainStore.deleteProvince(p._id)"></vue-feather>
            </div>
          </div>
        </div>
        <button class="add" @click="provinceModal = true">
          <vue-feather type="plus"></vue-feather>
          <span>افزودن ولایت</span>
        </button>
      </div>
      <div class="section">
        <div class="title">
          <h2>ولسوالی ها</h2>
          <Multiselect v-model="selectedProvince" :options="mainStore.provinces" :close-on-select="true"
            :clear-on-select="false" placeholder="انتخاب ولایت" label="name" track-by="_id" class="province-select" />
        </div>
        <div class="list">
          <div class="item" v-for="d in filteredDistricts">
            <h3>
              {{ getLangy(d.name) }} -
              <span>{{ getLangy(d.province?.name) }}</span>
            </h3>

            <div style="display: flex;align-items: center;">
              <vue-feather type="edit" size="18" @click="eDis(d)"></vue-feather>
              <span style="width: 10px"></span>
              <vue-feather type="trash-2" @click="mainStore.deleteDistrict(d._id)"></vue-feather>
            </div>
          </div>
        </div>
        <button class="add" @click="(selectedProvince != null) ? districtModal = true : null">
          <vue-feather type="plus"></vue-feather>
          <span>افزودن ولسوالی</span>
        </button>
      </div>
      <div class="section">
        <div class="title">
          <h2>اداره ها</h2>
          <Multiselect v-model="selectedDistrict" :options="filteredDistricts" :close-on-select="true"
            :clear-on-select="false" placeholder="انتخاب ولسوالی" label="name" track-by="_id" class="province-select" />
        </div>
        <div class="list">
          <div class="item" v-for="o in filteredOffices">
            <h3>
              {{ getLangy(o.name) }} -
              <span>{{ getLangy(o.district?.name) }}</span> -
              <span>{{ getLangy(o.province?.name) }}</span>
            </h3>

            <div style="display: flex;align-items: center;">
              <vue-feather type="edit" size="18" @click="eOff(o)"></vue-feather>
              <span style="width: 10px"></span>
              <vue-feather type="trash-2" @click="mainStore.deleteOffice(o._id)"></vue-feather>
            </div>
          </div>
        </div>
        <button class="add" @click="(selectedDistrict != null) ? officeModal = true : null">
          <vue-feather type="plus"></vue-feather>
          <span>افزودن اداره</span>
        </button>
      </div>
    </div>
  </div>
  <Modal v-model="provinceModal" title="افزودن ولایت">
    <div class="modal-con">
      <div class="sub-item">
        <input type="text" v-model="provinceName" placeholder="زبان: دری" />
      </div>
      <div class="sub-item">
        <input type="text" v-model="provinceNamePs" placeholder="زبان: پشتو" />
      </div>
      <div class="sub-item">
        <input type="text" v-model="provinceNameEn" placeholder="زبان: انگلیسی" />
      </div>
    </div>

    <button class="main-btn save-btn" @click="addProvince()">
      <span>ذخیره ولایت</span>
      <vue-feather type="plus"></vue-feather>
    </button>
  </Modal>
  <Modal v-model="districtModal" title="افزودن ولسوالی">
    <div class="modal-con">
      <div class="sub-item">
        <input type="text" v-model="departmentName" placeholder="زبان: دری" />
      </div>
      <div class="sub-item">
        <input type="text" v-model="departmentNamePs" placeholder="زبان: پشتو" />
      </div>
      <div class="sub-item">
        <input type="text" v-model="departmentNameEn" placeholder="زبان: انگلیسی" />
      </div>

      <Multiselect v-model="selectedProvince" :options="mainStore.provinces" :close-on-select="true"
        :clear-on-select="false" placeholder="انتخاب ولایت" label="name" track-by="_id" class="province-select" />
    </div>
    <button class="main-btn save-btn" @click="addDistrict()">
      <span>ذخیره ولسوالی</span>
      <vue-feather type="plus"></vue-feather>
    </button>
  </Modal>
  <Modal v-model="officeModal" title="افزودن اداره">
    <div class="modal-con">
      <div class="sub-item">
        <input type="text" v-model="officeName" placeholder="زبان: دری" />
      </div>
      <div class="sub-item">
        <input type="text" v-model="officeNamePs" placeholder="زبان: پشتو" />
      </div>
      <div class="sub-item">
        <input type="text" v-model="officeNameEn" placeholder="زبان: انگلیسی" />
      </div>
      <Multiselect v-model="selectedProvince" :options="mainStore.provinces" :close-on-select="true"
        :clear-on-select="false" placeholder="انتخاب ولایت" label="name" track-by="_id" class="province-select" />
      <Multiselect v-model="selectedDistrict" :options="mainStore.districts" :close-on-select="true"
        :clear-on-select="false" placeholder="انتخاب ولسوالی" label="name" track-by="_id" class="province-select" />
    </div>
    <button class="main-btn save-btn" @click="addOffice()">
      <span>ذخیره اداره</span>
      <vue-feather type="plus"></vue-feather>
    </button>
  </Modal>
</template>

<script setup>
import Multiselect from "@/components/Multiselect.vue";
import { useMainStore } from "@/stores/main";
import { computed } from "@vue/reactivity";
import { ref, watch } from "vue";
import { getLangy } from "../../utils/lang_util";
const mainStore = useMainStore();
const selectedDistrict = ref(null);
const selectedProvince = ref(null);

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
const provinceModal = ref(false);
const districtModal = ref(false);
const officeModal = ref(false);
const provinceName = ref(""), provinceNamePs = ref(""), provinceNameEn = ref(""), provinceId = ref(null);
const departmentName = ref(""), departmentNamePs = ref(""), departmentNameEn = ref(""), departmentId = ref(null);
const officeName = ref(""), officeNamePs = ref(""), officeNameEn = ref(""), officeId = ref(null);

const filteredDistricts = computed(() => {
  if (selectedProvince.value) {
    return mainStore.districts.filter((d) => d.province._id === selectedProvince.value._id);
  }
  return [];
});

const filteredOffices = computed(() => {
  if (selectedDistrict.value) {
    return mainStore.offices.filter(
      (o) => o.district._id === selectedDistrict.value._id
    );
  }
  return [];
});

const addProvince = () => {
  if (provinceId.value) { editProvince(); return; }
  mainStore.addProvince(provinceName.value, provinceNamePs.value, provinceNameEn.value);
  provinceModal.value = false;
};
const editProvince = () => {
  mainStore.editProvince(provinceId.value, provinceName.value, provinceNamePs.value,
    provinceNameEn.value);
  provinceModal.value = false;
};
const addDistrict = () => {
  if (departmentId.value) { editDistrict(); return; }
  mainStore.addDistrict(departmentName.value, departmentNamePs.value,
    departmentNameEn.value, selectedProvince.value._id);
  districtModal.value = false;
};
const editDistrict = () => {
  mainStore.editDistrict(departmentId.value, departmentName.value, departmentNamePs.value,
    departmentNameEn.value, selectedProvince.value._id);
  districtModal.value = false;
};
const addOffice = () => {
  if (officeId.value) { editOffice(); return; }
  mainStore.addOffice(officeName.value, officeNamePs.value, officeNameEn.value,
    selectedProvince.value._id, selectedDistrict.value._id);
  officeModal.value = false;
};
const editOffice = () => {
  mainStore.editOffice(officeId.value, officeName.value, officeNamePs.value, officeNameEn.value,
    selectedProvince.value._id, selectedDistrict.value._id);
  officeModal.value = false;
};
watch(officeModal, (value) => {
  if (value != true) {
    officeName.value = "", officeNamePs.value = "", officeNameEn.value = "";
    officeId.value = null;
  }
})
watch(districtModal, (value) => {
  if (value != true) {
    departmentName.value = "", departmentNamePs.value = "", departmentNameEn.value = "";
    departmentId.value = null;
  }
})
watch(provinceModal, (value) => {
  if (value != true) {
    provinceName.value = "", provinceNamePs.value = "", provinceNameEn.value = "";
    provinceId.value = null;
  }
})
const ePro = (p) => {
  provinceName.value = p.name[0];
  provinceNamePs.value = p.name[1];
  provinceNameEn.value = p.name[2];
  provinceId.value = p._id;
  provinceModal.value = true;
};
const eDis = (d) => {
  departmentName.value = d.name[0];
  departmentNamePs.value = d.name[1];
  departmentNameEn.value = d.name[2];
  departmentId.value = d._id;
  districtModal.value = true;
};
const eOff = (o) => {
  officeName.value = o.name[0];
  officeNamePs.value = o.name[1];
  officeNameEn.value = o.name[2];
  officeId.value = o._id;
  officeModal.value = true;
};
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
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    margin-top: 2%;
    gap: 2% 1%;
    width: 100%;

    >div {
      display: flex;
      flex-direction: column;
      align-items: space-between;
      justify-content: flex-start;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
      height: 70vh;
      overflow-y: auto;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }

    .section {
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        h2 {
          font-size: 20px;
          font-weight: 900;
        }

        .province-select {
          width: 60%;
        }
      }

      .list {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 10px;
        overflow: auto;
        padding: 4px;

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

.save-btn {
  margin-top: 16px;
}
</style>
