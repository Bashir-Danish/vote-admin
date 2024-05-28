import { useMyFetch } from "@/utils/myFetch";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const users = ref([]);

  const loadUsers = async () => {
    try {
      const { data } = await useMyFetch("users").get().json();
      users.value = [...data.value.users];
    } catch (error) {
      console.log(error);
    }
  };

  const addUser = async (user) => {
    try {
      const { data } = await useMyFetch("register").post(user).json();
      users.value = [...users.value, data.value.user];
    } catch (error) {
      console.log(error);
    }
  };

  return { users, loadUsers, addUser };
});
