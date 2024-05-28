<template>
  <div class="monographs-con">
    <div class="top-bar">
      <div>
        <h2>لیست گذارش ها </h2>
        <span>آخرین آپدیت به تاریخ
          {{ time }}
        </span>
      </div>
      <div class="buttons">
        <button class="main-btn" @click="pStore.refresh()">
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
      <div class="table-container" ref="tableRef">
        <table>
          <thead>
            <tr>
              <th width="3%">#</th>
              <th class="start-align" width="25%">عنوان</th>
              <th width="10%">ولایت</th>
              <th width="14%">ولسوالی</th>
              <th width="16%">اداره</th>
              <th width="10%">کاربر</th>
              <th width="10%">وضعیت</th>
              <th width="12%">تاریخ ثبت</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post, index in pStore.posts" @click="onClick(post._id)">
              <th>{{ index + 1 }}</th>
              <td class="start-align">
                {{ getLangy(post?.title) }}
              </td>
              <td>{{ getLangy(post.province?.name) }}</td>
              <td>{{ getLangy(post.district?.name) }}</td>
              <td>{{ getLangy(post.office?.name) }}</td>
              <td>{{ getLangy(post.user?.name) }}</td>
              <td>{{ post.isApprove ? 'منتشر' : 'منتشر نشده' }}</td>
              <td>{{ new Intl.DateTimeFormat('fa-u-ca-persian', { dateStyle: 'short' }).format(new Date(post.createdAt))
              }}</td>
            </tr>
            <TabelShimmer :count="8" v-if="pStore.isLoading" sHeight="30px" />
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <Modal v-model="postModal" title="افزودن گزارش" modalClass="max-width">
    <PostDialog @closeModal="closed" :store="pStore"/>
  </Modal>
</template>

<script setup>
import TabelShimmer from "@/components/SmallComponent/TabelShimmer.vue";
import { useUserPostsStore } from "@/stores/userPosts";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import PostDialog from "../../components/dialogs/PostDialog.vue";
import { getLangy } from "../../utils/lang_util";
const pStore = useUserPostsStore();
const postModal = ref(false);

pStore.loadPosts();

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

const onClick = async (id) => {
  await pStore.loadPostForEdit(id);
  postModal.value = true;
};
// calculate top of the ref table in viewport
const tableTop = ref(0);
const tableRef = ref(null);
const tableHeight = computed(() => {
  return `calc(100vh - ${tableTop.value}px - 50px)`;
});
onMounted(() => {
  tableTop.value = tableRef.value.getBoundingClientRect().top;
  tableRef.value.addEventListener("scroll", handleScroll)
});
onBeforeUnmount(() => {
  tableRef.value.removeEventListener("scroll", handleScroll)
})
const handleScroll = (e) => {
  let element = tableRef.value
  if (25 + element.scrollTop + element.clientHeight >= element.scrollHeight) {
    pStore.loadPosts(true);
  }
}
const closed = () => {
  postModal.value = false;
};

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
      height: v-bind(tableHeight);
      overflow-y: auto;

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

.m-modal-con {
  >* {
    margin-bottom: 12px;
  }

  input,
  textarea {
    height: 40px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    padding: 0 10px;
    font-size: 14px;
    color: #7d86a9;
    outline: none;
    font-family: inherit;
    width: 100%;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
    max-height: 300px;
  }
}

.vm {
  .user-naming {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 1rem;
      color: #7d86a9;
    }
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    div {
      display: flex;
      gap: 8px;
    }
  }
}
</style>
