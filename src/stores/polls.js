import { useMyFetch } from "@/utils/myFetch";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePollsStore = defineStore("polls", () => {
  const polls = ref([]);
  const pollItem = ref(null);
  const isLoading = ref(false);
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

  const loadPolls = async () => {
    try {
      isLoading.value = true;
      polls.value = [];
      const { data } = await useMyFetch("poll/all").get().json();
      polls.value = [...data.value.polls];
      isLoading.value = false;
    } catch (error) {
      console.log(error);
    }
  };

  const addPoll = async () => {
    try {
      const { data } = await useMyFetch("poll/add").post(pollItem.value).json();
      polls.value = [...polls.value, data.value.poll];
    } catch (error) {
      console.log(error);
    }
  };

  // delete post
  const deletePoll = async () => {
    try {
      await useMyFetch(`poll/${pollItem.value._id}`).delete().json();
      polls.value = polls.value.filter(
        (poll) => poll._id !== pollItem.value._id
      );
    } catch (error) {
      console.log(error);
    }
  };
  return {
    polls,
    isLoading,
    pollItem,
    loadPolls,
    addPoll,
    deletePoll,
    currentLang,
    changeLang,
    getLang,
  };
});
