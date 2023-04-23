<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row justify-center">
      <div style="width: 100vw; padding: 20px">
        <q-chat-message v-if="messages.length" :label="getCurrDate()" />
        <q-chat-message
          v-for="el in messages"
          :name="checkMyName(el)"
          :key="el.id"
          :text="[el.message]"
          :sent="checkMyMessage(el)"
          :stamp="getTime()"
        />
      </div>
    </div>

    <q-input
      outlined
      v-model="inputMessage"
      @keyup.enter.prevent="sendMessage"
      label="Cообщение..."
      suffix-icon="clear"
      class="bottom-message-input"
      square
    >
      <template v-slot:append>
        <q-icon name="send" class="cursor-pointer" @click="sendMessage" />
      </template>
    </q-input>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { io } from "socket.io-client";
const socket = io("http://127.0.0.1:3005");

export default defineComponent({
  name: "IndexPage",

  data() {
    return {
      messages: [],
      inputMessage: "",
      user: {
        id: `user${Date.now()}`,
        name: "My name",
      },
      prevDate: "",
      currDate: "",
    };
  },

  methods: {
    sendMessage() {
      socket.emit("message", {
        data: {
          id: Date.now(),
          message: this.inputMessage,
          user: {
            id: `${this.user.id}`,
            name: this.user.name,
          },
        },
      });
      this.inputMessage = "";
    },

    checkMyMessage(el) {
      return el.user.id === this.user.id;
    },

    checkMyName(el) {
      return el.user.id === this.user.id ? "Я" : el.user.name;
    },

    getCurrDate() {
      this.prevDate = this.currDate;

      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const formattedMonth = month <= 9 ? `0${month}` : month;
      const year = String(date.getFullYear()).slice(2);

      this.currDate = `${day}.${formattedMonth}.${year}`;
      return this.currDate;
    },

    getTime() {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours}:${minutes}`;
    },
  },

  mounted() {
    socket.on("connection", (socket) => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("message", ({ data }) => {
      this.messages.push(data);
    });
  },
});
</script>

<style>
.bottom-message-input {
  position: absolute;
  bottom: 0;
  width: 100vw;
  border-radius: 0;
}
</style>
