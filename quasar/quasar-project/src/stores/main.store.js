import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state: () => {
    return {
      usersOnline: 0,
      user: {
        id: "",
        name: "Гость",
        avatar: "",
      },
    };
  },
  getters: {},
  actions: {
    setUserId(value) {
      this.user.id = value;
    },
    setUserName(value) {
      this.user.name = value;
    },
    setAvatarName(value) {
      this.user.avatar = value;
    },
    setUsersOnline(value) {
      this.usersOnline = value;
    },
  },
});
