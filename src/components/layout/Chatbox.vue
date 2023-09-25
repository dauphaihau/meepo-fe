<template>
  <div
      class="fixed bottom-0 right-3 z-40
      flex flex-col
      max-w-[400px] bg-white rounded-t-2xl  w-full
      border border-zinc-50
      overflow-hidden
      transition-all duration-500 transform max-h-0
      chatbox-shadow
      "
      :class="{
        'min-h-[54px]': getUser.rooms_private_count < 0,
        'max-h-[500px]': showFull,
        'max-h-[54px]': !showFull,
      }"
  >
    <div v-if="!showViewChatPrivate">

      <!--      Header-->
      <div
          class="absolute top-0 left-0 z-10 bg-white/80 w-full flex items-center justify-between px-4 cursor-pointer h-[56px]"
          @click="toggleShowFull"
      >
        <h3 class="text-xl font-bold">Messages</h3>
        <ChevronDoubleUpIcon
            class="icon"
            aria-hidden="true"
            v-if="!showFull"
        />
        <ChevronDoubleDownIcon
            v-else
            class="icon"
            aria-hidden="true"
        />
      </div>

      <!--      Body - Rooms-->
      <div id="rooms" class="overflow-scroll transition duration-300 h-[500px] pb-[50px]">
        <div ref="refTop" class="h-[56px]"/>
        <div v-if="isLoading" class="flex-center min-h-[35vh]">
          <Loading variant="secondary" classes="h-6 w-6"/>
        </div>
        <div v-else>
          <div v-for="message of lastMessages">
            <div
                class="flex gap-2 items-center  px-4 h-[73px] hover:bg-zinc-50 cursor-pointer "
                @click="clickRoom(message)"
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

              <div
                  class="flex flex-col justify-center"
              >
                <div class="flex gap-2 text-[15px]">
                  <p class="font-semibold max-w-[9rem] truncate">{{ message.participant_name }}</p>
                  <p class="text-zinc-500 max-w-[8rem] truncate">@{{ message.participant_username }}</p>
                  <span class="text-zinc-500">·</span>
                  <p class="text-zinc-500 max-w-[5rem] truncate">{{ message.time }}</p>
                </div>
                <div class="text-zinc-500 h-5 truncate max-w-[20rem]">{{ message.text }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Chat
        v-else
        :key="keyChat"
        :noLastMessages="lastMessages.length === 0"
        @onUpdateView="onUpdateView"
        :showFull="showFull"
    />
  </div>
</template>

<script setup lang="ts">
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/vue/20/solid'
import { onMounted, ref, watch } from "vue";

import Loading from "@/core/components/Loading.vue";
import Chat from "./Chat.vue";
import { mapGetters } from "@/lib/map-state";
import { chatAPI } from "@/apis/chat";
import { MutationEnums } from "@/types/store/root";
import { parseCreatedAts } from "@/lib/dayjs-parse";
import { logger } from "@/core/helper";
import { useStore } from "@/store";
import { IMessage } from "@/types/message";

const store = useStore()
const { getCurrentUserToMessage, getUser } = mapGetters()

const lastMessages = ref<IMessage[] | []>([])
const showViewChatPrivate = ref(false)
const showFull = ref(false)
const isLoading = ref(false)
const refTop = ref<null | HTMLDivElement>(null)
const keyChat = ref(0)
const guid = ref('')

onMounted(() => {
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

const clickRoom = (room) => {
  showViewChatPrivate.value = true
  store.commit(MutationEnums.MESSAGE_TO_USER, {
    room_id: room.room_id,
    name: room.participant_name,
    username: room.participant_username,
  })
}

const onUpdateView = (newData) => {
  if (newData.hasOwnProperty('showViewChatPrivate')) {
    showViewChatPrivate.value = newData.showViewChatPrivate
    fetchPrivateRooms()
  }

  if (newData.hasOwnProperty('showFull')) {
    showFull.value = newData.showFull
  }
}

const ws = new WebSocket(process.env.BASE_URL_WEBSOCKET);

ws.onopen = () => {
  logger.info('Connected to websocket server - MessagesChannel', 'src/components/layout/Chatbox.vue')
  guid.value = Math.random().toString(36).substring(2, 15)

  ws.send(
      JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({
          id: guid,
          channel: "MessagesChannel",
        }),
      })
  );
}

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.type === "ping") return;
  if (data.type === "welcome") return;
  if (data.type === "confirm_subscription") return;

  if (!data.message?.username) {
    logger.error('undefine username', 'src/components/layout/Chatbox.vue')
    return;
  }

  const idx = lastMessages.value.findIndex((item: IMessage) => item.participant_username === data.message.username)
  if (idx !== -1) {
    lastMessages.value[idx].text = data.message.text
  }

  resetScroll();
};

watch(getCurrentUserToMessage, () => {
  if (getCurrentUserToMessage.value) {
    showViewChatPrivate.value = true
    showFull.value = true
    keyChat.value++
  }
}, { immediate: true })

const resetScroll = () => {
  if (!messagesContainer) return;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

const toggleShowFull = () => {
  showFull.value = !showFull.value
  refTop.value?.scrollIntoView();
}

</script>


<style scoped>
.chatbox-shadow {
  box-shadow: rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px;
}

.icon {
  @apply h-9 w-9 cursor-pointer  hover:bg-zinc-300/50 rounded-full p-2 animate
}
</style>
