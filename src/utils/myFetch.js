import { createFetch } from "@vueuse/core";

export const useMyFetch = createFetch({
  baseUrl: "https://api.soacs.app/api/v2/",
  // baseUrl: "http://localhost:5000/api/v2/",
  options: {
    async beforeFetch({ options }) {
      // const myToken = getMyToken();
      // if (myToken) options.headers.Authorization = `${myToken}`;
      return { options };
    },
  },
  fetchOptions: {
    mode: "cors",
  },
});

function getMyToken() {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user).token;
  }
  return null;
}
