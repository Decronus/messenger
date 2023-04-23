<template>
  <q-page class="flex justify-center items-end">
    <div class="q-pa-md row justify-center">
      <div style="width: 100vw; padding: 20px 20px 100px">
        <q-chat-message v-if="messages.length" :label="getCurrDate()" />
        <q-chat-message
          v-for="el in messages"
          :name="checkMyName(el)"
          :key="el.id"
          :text="[el.message.text]"
          :sent="checkMyMessage(el)"
          :stamp="getTime()"
          :bg-color="getMessageColor(el)"
          :text-color="getMessageColor(el) ? 'white' : null"
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

    <q-dialog v-model="nameModal" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Ваше имя</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="userName"
            autofocus
            @keyup.enter="enterChat"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Войти" @click="enterChat" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { io } from "socket.io-client";
import { mainStore } from "../stores/main.store";

const socket = io("http://127.0.0.1:3005");
const store = mainStore();

export default defineComponent({
  name: "IndexPage",

  data() {
    return {
      messages: [],
      inputMessage: "",
      nameModal: true,
      prevDate: "",
      currDate: "",
    };
  },

  methods: {
    checkMyMessage(el) {
      return el.user.id === store.user.id;
    },

    checkMyName(el) {
      return el.user.id === store.user.id ? "Я" : el.user.name;
    },

    enterChat() {
      socket.emit("message", {
        data: {
          id: Date.now(),
          message: {
            text: `${store.user.name} подключился`,
            status: "enterChat",
          },
          user: store.user,
        },
      });
      this.nameModal = false;
    },

    leaveChat() {
      socket.emit("message", {
        data: {
          id: Date.now(),
          message: {
            text: `${store.user.name} отключился`,
            status: "enterChat",
          },
          user: store.user,
        },
      });
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

    getMessageColor(el) {
      return el.message.status === "message" ? null : "positive";
    },

    sendMessage() {
      if (!this.inputMessage) return;

      socket.emit("message", {
        data: {
          id: Date.now(),
          message: {
            text: this.inputMessage,
            status: "message",
          },
          user: store.user,
        },
      });
      this.inputMessage = "";
    },
  },

  computed: {
    userName: {
      get() {
        return store.user.name;
      },
      set(value) {
        store.setUserName(value);
      },
    },
  },

  mounted() {
    socket.on("connect", () => {
      store.user.id = socket.id;
    });

    socket.on("disconnect", () => {
      console.log("leave");
      this.leaveChat();
    });

    socket.on("message", ({ data }) => {
      this.messages.push(data);
    });
  },

  beforeUnmount() {
    socket.disconnect();
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
