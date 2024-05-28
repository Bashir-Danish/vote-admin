<template>
  <div class="users-con">
    <div class="top-bar">
      <div>
        <h2>مدیریت مسوولان</h2>
        <span
          >آخرین آپدیت به تاریخ
          {{ time }}
        </span>
      </div>
      <div class="actions">
        <button class="main-btn" @click="userModal = true">
          <span>اضافه کردن</span>
          <vue-feather type="plus"></vue-feather>
        </button>
        <button class="main-btn">
          <span>آپدیت صفحه</span>
          <vue-feather type="refresh-ccw"></vue-feather>
        </button>
      </div>
    </div>
    <div class="tablepart">
      <div class="filter">
        <div class="filter-items">
          <input class="search" type="text" placeholder="جستجو" />
          <Multiselect
            v-model="faculty"
            :options="mainStore.faculties"
            :close-on-select="true"
            :clear-on-select="false"
            placeholder="انتخاب پوهنحی"
            label="name"
            track-by="id"
            class="faculty-select"
          />

          <Multiselect
            v-model="job"
            :options="jobs"
            :close-on-select="true"
            :clear-on-select="false"
            placeholder="انتخاب وظیفه"
            label="name"
            track-by="id"
            class="faculty-select"
          />
        </div>
        <button class="main-btn filter-btn">فیلتر</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="start-align" width="15%">نام</th>
              <th width="12%">تخلص</th>
              <th width="19%">ایمیل</th>
              <th width="15%">وظیفه</th>
              <th width="13%">دیپارتمنت</th>
              <th width="13%">پوهنحی</th>
              <th width="12%">پوهنتون</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersStore.users">
              <td class="start-align">{{ user.name }}</td>
              <th>{{ user.lastName }}</th>
              <td>{{ user.email }}</td>
              <td>{{ getRole(user.role) }}</td>
              <td>
                {{ user.department ? getDepartment(user.department) : "عمومی" }}
              </td>
              <td>{{ user.faculty ? getFaculty(user.faculty) : "عمومی" }}</td>
              <td>
                {{
                  user.university ? getUniversity(user.university) : "عمومی "
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Modal v-model="userModal" title="افزودن مسوول جدید">
    <div class="modal-con">
      <div class="sub-item">
        <input type="text" placeholder="نام" v-model="name" />
      </div>
      <div class="sub-item">
        <input type="text" placeholder="تخلص" v-model="lastName" />
      </div>
      <div class="sub-item">
        <input type="text" v-model="email" placeholder="ایمیل" />
      </div>
      <div class="sub-item">
        <input type="text" v-model="password" placeholder="پسورد" />
      </div>
      <Multiselect
        v-model="role"
        :options="jobs"
        :close-on-select="true"
        :clear-on-select="false"
        placeholder="انتخاب وظیفه"
        label="name"
        track-by="value"
        class="select-item"
      />

      <Multiselect
        v-model="departmentId"
        :options="mainStore.departments"
        :close-on-select="true"
        :clear-on-select="false"
        placeholder="انتخاب دیپارتمنت"
        label="name"
        track-by="_id"
        class="select-item"
      />

      <Multiselect
        v-model="facultyId"
        :options="mainStore.faculties"
        :close-on-select="true"
        :clear-on-select="false"
        placeholder="انتخاب پوهنحی"
        label="name"
        track-by="_id"
        class="select-item"
      />
    </div>

    <button class="main-btn save-btn" @click="addNewUser()">
      <span>ذخیره مسوول</span>
      <vue-feather type="plus"></vue-feather>
    </button>
  </Modal>
</template>

<script setup>
import Multiselect from "@/components/Multiselect.vue";
import { useMainStore } from "@/stores/main";
import { useUsersStore } from "@/stores/users";
import { ref } from "vue";

const faculty = ref(null);
const department = ref(null);
const job = ref(null);

const mainStore = useMainStore();
const usersStore = useUsersStore();
const userModal = ref(false);
usersStore.loadUsers();
const name = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const role = ref(null);
const departmentId = ref("");
const facultyId = ref("");

const getUniversity = (id) => {
  const university = mainStore.universities.find((uni) => uni._id === id);
  return university?.name ?? "عمومی";
};

const getFaculty = (id) => {
  const faculty = mainStore.faculties.find((fac) => fac._id === id);
  return faculty?.name ?? "عمومی";
};

const getDepartment = (id) => {
  const department = mainStore.departments.find((dep) => dep._id === id);
  return department?.name ?? "عمومی";
};

const jobs = ref([
  { name: "استاد", value: "teacher" },
  { name: "مدیر دیپارتمنت", value: "dManager" },
  { name: "مدیر پوهنحی", value: "fManager" },
  { name: "کتابخانه دار", value: "lManager" },
  { name: "مدیر پوهنتون", value: "uManager" },
]);

const getRole = (role) => {
  switch (role) {
    case "teacher":
      return "استاد";
    case "dManager":
      return "مدیر دیپارتمنت";
    case "fManager":
      return "مدیر پوهنحی";
    case "lManager":
      return "کتابخانه دار";
    case "uManager":
      return "مدیر پوهنتون";
    default:
      return "عمومی";
  }
};

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

const addNewUser = async () => {
  await usersStore.addUser({
    name: name.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    role: role.value.value,
    department: departmentId.value,
    faculty: facultyId.value,
    university: mainStore.universities[0]._id,
  });
  userModal.value = false;
  name.value = "";
  lastName.value = "";
  email.value = "";
  password.value = "";
  role.value = null;
  departmentId.value = null;
  facultyId.value = null;
};
</script>

<style lang="scss" scoped>
.users-con {
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
      display: flex;
      flex-direction: column;

      > h2 {
        font-weight: 900;
        margin-bottom: 4px;
        font-size: 35px;
      }

      > span {
        color: #7d86a9;
        font-size: 14px;
      }
    }
    .actions {
      flex-direction: row;
      gap: 10px;
    }
  }

  .tablepart {
    margin-top: 2%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: space-between;

    .filter {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .filter-btn {
        padding-right: 24px !important;
        padding-left: 24px !important;
      }
      .filter-items {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        .faculty-select {
          width: 200px;
        }

        .search {
          width: 200px;
          min-height: 40px;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          padding: 0 10px;
          font-size: 14px;
          color: #7d86a9;
          outline: none;
          font-family: inherit;
        }
      }
    }

    .table-container {
      background-color: white;
      margin-top: 10px;
      min-height: 67vh;
      table {
        /* position: relative; */
        width: 100%;
        text-align: right;
        border-collapse: collapse;
        background-color: white;
      }

      thead {
        background-color: var(--panel-color);

        th {
          background-color: var(--vt-c-main);
          color: white;
          font-size: 14px;
          font-weight: 600;

          &:first-of-type {
            border-top-right-radius: 16px;
          }

          &:last-of-type {
            border-top-left-radius: 16px;
          }
        }
      }
      .start-align {
        text-align: start;
      }
      th,
      td {
        border-bottom: solid 1px rgb(213, 199, 199);
        height: 40px;
        padding-right: 2%;
        text-align: center;
      }
    }
  }
}

.modal-con {
  .select-item {
    margin-bottom: 10px;
  }
}
</style>
