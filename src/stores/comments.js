import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useMyFetch } from "@/utils/myFetch";

export const useCommentsStore = defineStore('comments', () => {
  const comments = ref([]);
  const isLoading = ref(false);
  const commentItem = ref(null);

  // get all comments
  const loadComments = async () => {
    try {
      isLoading.value = true;
      comments.value = [];
      const { data } = await useMyFetch("comment").get().json();
      comments.value = [...data.value.comments];
      isLoading.value = false;
    } catch (error) {
      console.log(error);
    }
  };

  // delete comment
  const deleteComment = async (id) => {
    try {
      await useMyFetch("comment/" + id).delete();
      loadComments();
    } catch (error) {
      console.log(error);
    }
  };

  const setCommentItem = (item) => {
    commentItem.value = item;
  };

  const approveComment = async (id, approve) => {
    try {
      await useMyFetch("comment/" + id).patch({ approved: approve });
      loadComments();
    } catch (error) {
      console.log(error);
    }
  };

  return { comments, isLoading, loadComments, deleteComment, commentItem, setCommentItem, approveComment };
})
