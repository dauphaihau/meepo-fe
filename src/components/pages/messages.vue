<template>
  <div>
    <!--    Header-->
    <HeaderMainContent title="Messages"/>
    <div class="h-[53px]"/>

    <!--  Last messages / Rooms )-->
    <div>
      <div
          v-if="isLoading"
          class="flex-center min-h-[35vh]"
      >
        <Loading variant="secondary" classes="h-6 w-6"/>
      </div>
      <div v-else class="pb-16">
        <div v-for="message of lastMessages">
          <div
              class="flex gap-2 items-center  px-4 h-[73px] hover:bg-zinc-50 cursor-pointer "
              @click="clickMessage(message)"
          >
            <img
                v-if="message.participant_avatar_url"
                alt="avatar"
                v-bind:src="message.participant_avatar_url"
                class="rounded-full h-10 w-10 bg-black "
            />
            <img
                v-else
                alt="avatar"
                src="@/assets/default-avatar.png"
                class="rounded-full h-10 w-10 bg-black "
            />

            <div class="flex flex-col justify-center">
              <div class="flex gap-2 text-[15px] max-w-[80vw]">
                <p class="font-semibold max-w-[40%] truncate">{{ message.participant_name }}</p>
                <p class="text-zinc-500 max-w-[40%] truncate">@{{ message.participant_username }}</p>
                <span class="text-zinc-500">·</span>
                <p class="text-zinc-500 max-w-[30%] truncate">{{ message.time }}</p>
              </div>
              <div class="text-zinc-500 h-5 truncate max-w-[80vw]">{{ message.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import { useMediaQuery, useWebSocket } from "@vueuse/core";

import Loading from "@/core/components/Loading.vue";
import { chatAPI } from "@/apis/chat";
import { parseCreatedAts } from "@/lib/dayjs-parse";
import { logger, parseJSON } from "@/core/helper";
import { useStore } from "@/store";
import { IMessage } from "@/types/message";

import HeaderMainContent from "@components/layout/HeaderMainContent.vue";
import router from "@/router";
import { mapGetters } from "@/lib/map-state";

const store = useStore()
const isTabletScreen = useMediaQuery('(min-width: 768px)')
const { isLoggedIn } = mapGetters()

const lastMessages = ref<IMessage[] | []>([])
const isLoading = ref(false)
const guid = ref('')

onBeforeMount(() => {
  if (isTabletScreen.value) {
    router.push({ name: 'home' })
  }
})

onMounted(() => {
  if (!isLoggedIn.value) {
    router.push({ name: 'explore' })
    return
  }
  fetchPrivateRooms()
})

async function fetchPrivateRooms() {
  isLoading.value = true
  const { data } = await chatAPI.getMessages();
  isLoading.value = false

  if (data) {
    lastMessages.value = parseCreatedAts(data.messages)
  }
}

const messagesContainer = document.getElementById("rooms");

const clickMessage = (room) => {
  localStorage.setItem('room', JSON.stringify(room))
  router.push('/room')
}

const { data, send } = useWebSocket(process.env.BASE_URL_WEBSOCKET, {
  autoReconnect: true,
  onConnected: () => {
    logger.info('Connected to websocket server - MessagesChannel', 'src/components/layout/Chatbox.vue')
    guid.value = Math.random().toString(36).substring(2, 15)

    send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            id: guid,
            channel: "MessagesChannel",
          }),
        })
    );
  },
  onError: (e) => {
    logger.error('Something error with websocket server - MessagesChannel', 'src/components/layout/Chatbox.vue')
  },
  onMessage: () => {
    const parsed = parseJSON<{type: string, message: any}>(data.value)
    if (!parsed) {
      logger.error('parse data is null', 'src/components/layout/Chatbox.vue')
      return
    }
    if (parsed.type === "ping") return;
    if (parsed.type === "welcome") return;
    if (parsed.type === "confirm_subscription") return;
    const message = parsed.message
    logger.debug('Websocket server response message - MessagesChannel', message, 'src/components/layout/Chatbox.vue')

    if (!message?.username) {
      logger.error('undefine username', 'src/components/layout/Chatbox.vue')
      return;
    }

    const idx = lastMessages.value.findIndex((item: IMessage) => item.participant_username === message.username)
    if (idx !== -1) {
      lastMessages.value[idx].text = message.text
    }

    resetScroll();
  }
})

const resetScroll = () => {
  if (!messagesContainer) return;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

</script>

<style scoped></style>
