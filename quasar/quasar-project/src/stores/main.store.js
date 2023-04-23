import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state: () => {
    return {
      user: {
        id: `user${Date.now()}`,
        name: "Гость",
      },
    };
  },
  getters: {},
  actions: {
    setUserName(value) {
      this.user.name = value;
    },
  },
});
