<template>
  <q-page class="flex justify-center items-end">
    <div class="q-pa-md row justify-center">
      <div style="width: 100vw; padding: 20px 20px 100px">
        <q-chat-message v-if="messages.length" :label="getCurrDate" />
        <q-chat-message
          v-for="el in messages"
          :name="checkMyName(el)"
          :avatar="el.user.avatar"
          :key="el.id"
          :text="[el.message.text]"
          :sent="checkMyMessage(el)"
          :stamp="getTime"
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
import { mapState } from "pinia";

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
      avatarList: [
        "https://gamerwall.pro/uploads/posts/2022-09/1662304672_2-gamerwall-pro-p-samie-smeshnie-zhivotnie-v-mire-krasivo-2.jpg",
        "https://kaifolog.ru/uploads/posts/2015-05/1431921595_019.jpg",
        "https://i.ytimg.com/vi/f9VbU_pCh8w/hqdefault.jpg",
        "https://avatars.mds.yandex.net/i?id=04807a1890a084e7a4d36098f0fb86b560b8eeee-9153855-images-thumbs&n=13",
        "https://klike.net/uploads/posts/2018-11/1542697667_1.jpg",
        "https://interesnyefakty.org/wp-content/uploads/Obezyana-nosach-Samye-smeshnye-zhivotnye.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhcGKj_eszrMMht5b2d8lUOUo6gLPowlZTzA&usqp=CAU",
        "https://static5.tgstat.ru/channels/_0/39/390cb340f17810c0ffc4e041d39dd874.jpg",
        "https://icdn.lenta.ru/images/2021/12/30/21/20211230210521904/square_320_3374364bd9f57ec9b0aa3137f0416051.jpg",
        "https://img-fotki.yandex.ru/get/195771/32719266.36/0_11fc97_f8916859_orig.jpg",
        "https://phonoteka.org/uploads/posts/2022-01/thumbs/1643602014_3-phonoteka-org-p-prikolnie-zhivotnie-fon-3.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOw_y7oLyd49vy-_-VgUoRgOeWBbhKpPIZjA&usqp=CAU",
      ],
    };
  },

  methods: {
    avatarRandomChoice() {
      const randomInt = this.getRandomInt(0, this.avatarList.length - 1);
      return this.avatarList[randomInt];
    },

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

    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
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

    ...mapState(mainStore, ["user"]),

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
    store.setAvatarName(this.avatarRandomChoice());

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

.q-message-avatar {
  object-fit: cover;
}
</style>
