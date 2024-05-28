import { useFetch } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "vue-toastification";

export const useAuthStore = defineStore("auth", () => {
  const loading = ref(false);
  const user = ref(null);

  const login = async (email, password, callBack) => {
    loading.value = true;
    const toast = useToast();
    // const { error, data } = await useFetch("http://localhost:5000/api/v2/login")
    const { error, data } = await useFetch("http://api.soacs.app/api/v2/login")
      .post({
        email,
        password,
      })
      .json();
    if (error.value) {
      toast.error(data.value.message);
    } else {
      user.value = data.value;
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.value.user, token: data.value.token })
      );
      toast.success("Login successful");
      callBack();
    }
    loading.value = false;
  };

  // update user
  const updateUser = async (callBack) => {
    loading.value = true;
    const toast = useToast();
    const { error, data } = await useFetch(
      // `http://localhost:5000/api/v2/users/${user.value._id}`
      `https://api.soacs.app/api/v1/users/${user.value._id}`
      )
      .put({
        name: user.value.name,
        address: user.value.address,
        phone: user.value.phone,
      })
      .json();
    if (error.value) {
      toast.error(data.value.message);
    } else {
      user.value = data.value;
      localStorage.setItem("user", JSON.stringify(data.value));
      toast.success("Update successful!");
    }
    callBack();
    loading.value = false;
  };

  const loadUser = () => {
    const u = localStorage.getItem("user");
    if (u) {
      user.value = JSON.parse(u);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    user.value = null;
  };

  return { loading, login, user, loadUser, logout, updateUser };
});
