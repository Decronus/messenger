import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state: () => {
    return {
      user: {
        id: `user${Date.now()}`,
        name: "Гость",
        avatar: "",
      },
    };
  },
  getters: {},
  actions: {
    setUserName(value) {
      this.user.name = value;
    },
    setAvatarName(value) {
      this.user.avatar = value;
    },
  },
});
