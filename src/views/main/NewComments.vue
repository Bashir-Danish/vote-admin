<template>
  <div class="monographs-con">
    <div class="top-bar">
      <div>
        <h2>لیست کامنت ها</h2>
        <span>آخرین آپدیت به تاریخ
          {{ time }}
        </span>
      </div>
      <div class="buttons">
        <button class="main-btn" @click="cStore.loadComments()">
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
              <th class="start-align" width="50%">متن</th>
              <th width="20%">کاربر</th>
              <th width="30%"></th>
            </tr>
          </thead>
          <tbody>
            <TabelShimmer :count="3" v-if="cStore.isLoading" sHeight="30px" />
            <tr v-for="comment in cStore.comments">
              <td class="start-align">
                {{ comment.text ?? "تعیین نشده" }}
              </td>
              <td>
                {{ comment.user?.name ?? "تعیین نشده" }}
              </td>
              <td class="td-buttons">
                <button class="blue-btn" @click="onApprove(comment)">انتشار</button>
                <button class="blue-btn" @click="onDel(comment)">حذف</button>
                <button class="blue-btn" @click="onShow(comment)">نمایش</button>
                <button class="blue-btn" @click="onPost(comment.post)">نمایش گذارش</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <Modal v-model="commentModal" title="نمایش کامنت">
    <div class="modal-con m-modal-con">
      <p>{{ cStore.commentItem?.text }}</p>
    </div>
  </Modal>
  <Modal v-model="postModal" title="افزودن گزارش">
    <div class="modal-con m-modal-con">
      <div class="sub-item">
        <input type="text" placeholder="عنوان" v-model="pStore.postItem.title" disabled />
      </div>
      <uploaded-files :files="pStore.postItem.file" unremovable="true" />

      <div class="sub-item">
        <textarea v-model="pStore.postItem.text" disabled style="height: 500px"></textarea>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import TabelShimmer from "@/components/SmallComponent/TabelShimmer.vue";
import UploadedFiles from '@/components/SmallComponent/UploadedFiles.vue'
import { useCommentsStore } from "@/stores/comments";
import { usePostsStore } from "@/stores/posts";
import { ref } from "vue";
import ConfirmDialog from '@/components/SmallComponent/ConfirmDialog.vue'
import { useModal } from 'vue-final-modal'
const cStore = useCommentsStore();
cStore.loadComments();
const pStore = usePostsStore();

const m = new Date(Date.now() + -1 * new Date().getTimezoneOffset() * 60000);
const commentModal = ref(false);
const postModal = ref(false);
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
const { open: dOpen, close: dClose } = useModal({
  component: ConfirmDialog,
  attrs: {
    title: 'حذف کامنت',
    onConfirm() {
      cStore.deleteComment(cStore.commentItem._id);
      dClose();
      cStore.setCommentItem(null);
    },
    onCancel() {
      dClose();
      cStore.setCommentItem(null);
    },
  },
  slots: {
    default: '<p>آیا میخواهید این کامنت را حذف کنید؟</p>',
  },
})
const { open: aOpen, close: aClose } = useModal({
  component: ConfirmDialog,
  attrs: {
    title: 'انتشار کامنت',
    confirmText: 'بایگانی',
    cancelText: 'انتشار',
    onConfirm() {
      cStore.approveComment(cStore.commentItem._id, false);
      aClose();
      cStore.setCommentItem(null);
    },
    onCancel() {
      cStore.approveComment(cStore.commentItem._id, true);
      aClose();
      cStore.setCommentItem(null);
    },
  },
  slots: {
    default: '<p>آیا میخواهید این کامنت را منتشر کنید؟</p>',
  },
})
const onDel = async (item) => {
  cStore.setCommentItem(item);
  dOpen()
};
const onApprove = async (item) => {
  cStore.setCommentItem(item);
  aOpen()
};
const onShow = async (item) => {
  cStore.setCommentItem(item);
  commentModal.value = true;
};
const onPost = async (id) => {
  await pStore.loadPostForEdit(id);
  postModal.value = true;
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .td-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
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
