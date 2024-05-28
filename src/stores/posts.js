import { useMyFetch } from "@/utils/myFetch";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePostsStore = defineStore("posts", () => {
  const posts = ref([]);
  const postItem = ref(null);
  const isLoading = ref(false);
  const currentPage = ref(1);
  const hasNextPage = ref(true);
  const currentLang = ref(0);

  const changeLang = (lang) => {
    if (!lang) {
      if (currentLang.value > 1) currentLang.value = 0;
      else currentLang.value = currentLang.value + 1;
    } else {
      currentLang.value = lang;
    }
  };

  const getLang = computed(() => {
    return ['فارسی', 'پشتو', 'انگلیسی'][currentLang.value];
  });

  const loadPosts = async (next) => {
    try {
      if (isLoading.value || !hasNextPage.value) return;
      if (next == true && hasNextPage.value) currentPage.value++;
      isLoading.value = true;
      if (currentPage.value == 1) posts.value = [];
      const { data } = await useMyFetch(`post?page=${currentPage.value}`).get().json();
      hasNextPage.value = !(data.value.posts.length < 15);
      posts.value = [...posts.value, ...data.value.posts]
      isLoading.value = false;
    } catch (error) {
      console.log(error);
      isLoading.value = false;
    }
  };

  const refresh = () => {
    hasNextPage.value = true;
    currentPage.value = 0
    loadPosts(true);
  }

  const addPost = async (mainStore) => {
    try {
      const { data } = await useMyFetch("post/admin/add")
        .post(postItem.value)
        .json();
      // convert category,district,office and province to object
      data.value.post.category = mainStore.categories.find(
        (category) => category._id === data.value.post.category
      );
      data.value.post.district = mainStore.districts.find(
        (district) => district._id === data.value.post.district
      );
      data.value.post.office = mainStore.offices.find(
        (office) => office._id === data.value.post.office
      );
      data.value.post.province = mainStore.provinces.find(
        (province) => province._id === data.value.post.province
      );
      posts.value = [data.value.post, ...posts.value];
    } catch (error) {
      console.log(error);
    }
  };

  const loadPostForEdit = async (id) => {
    try {
      const { data } = await useMyFetch(`post/${id}`).get().json();
      postItem.value = data.value.posts[0];
      currentLang.value = 0;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePost = async () => {
    try {
      postItem.value.category = postItem.value.category?._id;
      postItem.value.district = postItem.value.district?._id;
      postItem.value.office = postItem.value.office?._id;
      postItem.value.province = postItem.value.province?._id;
      const { _id, ...rest } = postItem.value;
      const { data } = await useMyFetch(`post/${_id}`).put(rest).json();
      const index = posts.value.findIndex((post) => post._id == _id);
      posts.value[index] = data.value.post;
    } catch (error) {
      console.log(error);
    }
  };

  // delete post
  const deletePost = async () => {
    try {
      await useMyFetch(`post/${postItem.value._id}`).delete().json();
      posts.value = posts.value.filter(
        (post) => post._id !== postItem.value._id
      );
    } catch (error) {
      console.log(error);
    }
  };

  const approvePost = async () => {
    try {
      console.log(`${postItem.value.showUser}`);
      await useMyFetch(`post/${postItem.value._id}`).put({
        isApprove: true,
        showUser: `${postItem.value.showUser}` == 'true',
        notification: true,
      }).json();
      const index = posts.value.findIndex((post) => post._id === postItem.value._id);
      posts.value[index].isApprove = true;
      posts.value[index].showUser = postItem.showUser ?? false;
    } catch (error) {
      console.log(error);
    }
  }

  const createDraft = () => {
    currentLang.value = 0;
    postItem.value = {
      title: ["", "", ""],
      text: ["", "", ""],
      file: [],
      office: null,
      category: null,
      province: null,
      district: null,
      isApprove: true,
      showUser: false,
    };
  };

  return {
    posts,
    isLoading,
    postItem,
    loadPosts,
    addPost,
    createDraft,
    loadPostForEdit,
    updatePost,
    deletePost,
    approvePost,
    refresh,
    currentLang,
    changeLang,
    getLang,
  };
});
