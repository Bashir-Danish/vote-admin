import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useStudentStore = defineStore("student", () => {
  const monograph = ref(null);
  const currentPage = ref(0);

  const feedbacks = computed(() => {
    return monograph.value?.feedbacks;
  });

  const student = computed(() => {
    if (monograph.value) {
      return monograph.value.student;
    }
    return "";
  });

  const getMonograph = computed(() => {
    return monograph.value;
  });

  function changePage(page) {
    this.currentPage = page;
  }

  function loadMonograph() {
    this.monograph = {
      student: {
        id: null,
        name: null,
        lastName: null,
        email: null,
        year: null,
      },
      details: {
        title: null,
        topic: null,
        subTitles: [],
        abstract: null,
        language: null,
      },
      file: null,
      user: {
        name: "احمد",
        lastName: "احمدی",
        email: "user@email.com",
        role: "user",
      },
      feedbacks: [
        "سلام",
        "خوبی؟",
        "منم خوبم",
        "لطفا زودتر کارهای لازم را برای مونوگراف خود انجام دهید!",
        "سلام",
        "خوبی؟",
        "منم خوبم",
        "لطفا زودتر کارهای لازم را برای مونوگراف خود انجام دهید!",
        "سلام",
        "خوبی؟",
        "منم خوبم",
        "لطفا زودتر کارهای لازم را برای مونوگراف خود انجام دهید!",
        "سلام",
        "خوبی؟",
        "منم خوبم",
        "لطفا زودتر کارهای لازم را برای مونوگراف خود انجام دهید!",
        "سلام",
        "خوبی؟",
        "منم خوبم",
        "لطفا زودتر کارهای لازم را برای مونوگراف خود انجام دهید!",
      ],
    };
  }

  return {
    monograph,
    currentPage,
    changePage,
    loadMonograph,
    getMonograph,
    feedbacks,
    student,
  };
});
