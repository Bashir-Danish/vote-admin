<template>
  <div class="monographs-con">
    <div class="top-bar">
      <div>
        <h2>لیست نظرسنجی ها</h2>
        <span>آخرین آپدیت به تاریخ
          {{ time }}
        </span>
      </div>
      <div class="buttons">
        <button class="main-btn" @click="createDraft()">
          <span>نظرسنجی جدید</span>
          <vue-feather type="plus"></vue-feather>
        </button>
        <button class="main-btn" @click="pStore.loadPolls()">
          <span>آپدیت صفحه</span>
          <vue-feather type="refresh-ccw"></vue-feather>
        </button>
      </div>
    </div>
    <div class="tablepart">
      <div class="filter">
        <div class="filter-items">
          <input class="search" type="text" placeholder="جستجو" />
        </div>
        <button class="main-btn filter-btn">فیلتر</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="start-align" width="30%">عنوان</th>
              <th width="14%">مجموعه رای ها</th>
              <th width="14%">گزینه اول</th>
              <th width="14%">گزینه دوم</th>
              <th width="14%">گزینه سوم</th>
              <th width="14%">گزینه چهارم</th>
            </tr>
          </thead>
          <tbody>
            <TabelShimmer :count="6" v-if="pStore.isLoading" :sHeight="'30px'" />
            <tr v-for="poll in pStore.polls" @click="editPoll(poll)">
              <td class="start-align">
                {{ getLangy(poll?.title) }}
              </td>
              <th>{{ poll?.totalVote }}</th>
              <td>{{ getOptionTxt(poll?.options[0]) }}</td>
              <td>{{ getOptionTxt(poll?.options[1]) }}</td>
              <td>{{ getOptionTxt(poll?.options[2]) }}</td>
              <td>{{ getOptionTxt(poll?.options[3]) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <Modal v-model="pollModal" title="افزودن نظرسنجی">
    <PollDialog :isEdit="isEdit" @onClose="pollModal = false" />
  </Modal>
</template>

<script setup>
import TabelShimmer from "@/components/SmallComponent/TabelShimmer.vue";
import { useMainStore } from "@/stores/main";
import { usePollsStore } from "@/stores/polls";
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import PollDialog from "../../components/dialogs/PollDialog.vue";
import { getLangy } from "../../utils/lang_util";
const mainStore = useMainStore();
const pStore = usePollsStore();
const pollModal = ref(false);
const isEdit = ref(false);
pStore.loadPolls();

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
const createDraft = () => {
  pStore.pollItem = null;
  pStore.pollItem = {
    title: ['', '', ''],
    expireAfter: computedValue?.value?.value ?? 10,
    options: [['', '', '']],
  };
  isEdit.value = false;
  pollModal.value = true;
};

const getOptionTxt = (option) => {
  if (!option) return '';
  return getLangy(option?.name) + " - " + option?.vote + [' رای', ' رای', ' vote'][mainStore.selectedLanguage];
};
const editPoll = (poll) => {
  isEdit.value = true;
  pStore.pollItem = {
    _id: poll._id,
    title: poll.title,
    expireAfter: new Date(poll.expireAfter).toLocaleString(),
    options: [],
  };
  poll.options.forEach((e) => {
    pStore.pollItem.options.push([
      [e.name[0] + ' - ' + e.vote],
      [e.name[1] + ' - ' + e.vote],
      [e.name[2] + ' - ' + e.vote],
    ]);
  });
  pollModal.value = true;
};

const computedValue = computed(() => {
  return mainStore.settings.find((e) => e.key == "pollHours");
});
</script>

<style lang="scss" scoped>
.monographs-con {
  .top-bar {
    width: 100%;
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

    .buttons {
      display: flex;
      flex-direction: row;

      >button {
        margin-left: 10px;
      }
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

        .select {
          width: 250px;
        }

        .search {
          width: 250px;
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
      min-height: 61vh;

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
</style>
