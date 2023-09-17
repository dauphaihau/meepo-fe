<template>
  <div class="h-[500px] relative ">

    <!--    Header - Info user-->
    <div
        class="absolute top-0 left-0 z-10 bg-white/80  w-full flex gap-4 items-center  cursor-pointer h-[56px] px-4"
        @click="emit('onUpdateView', {showFull: !showFull})"
    >
      <ArrowLeftIcon
          v-if="showFull"
          class="h-9 w-9 cursor-pointer hover:bg-zinc-300 animate rounded-full p-2"
          aria-hidden="true"
          @click="emit('onUpdateView', {showViewChatPrivate: false})"
      />

      <div>
        <div class="font-bold text-lg leading-5">{{ getCurrentUserToMessage?.name }}</div>
        <p class="text-sm text-zinc-500">@{{ getCurrentUserToMessage?.username }}</p>
      </div>
    </div>

    <!--    Body - Messages-->
    <div
        ref="elMessages"
        class="min-h-[436px] max-h-80 overflow-scroll scrollable-div px-4"
        id="messagesId"
    >
      <div class="h-[56px]"/>
      <!--        class="min-h-[380px] max-h-80 overflow-scroll scrollable-div px-4"-->
      <div v-if="isLoading" class="flex-center min-h-[35vh]">
        <Loading variant="secondary" classes="h-6 w-6"/>
      </div>
      <div v-else>
        <div v-for="(message, index) of messages">
          <!--        id="messages" class="min-h-[380px] max-h-80 overflow-hidden">-->
          <div
              class="whitespace-pre-wrap max-w-[20rem]"
              :class="message.user_id === getUser.id ? 'me' : 'you' "
          >{{ message.text }}
          </div>
          <div
              v-if="message.user_id !== messages[index + 1]?.user_id"
              class="text-zinc-500 text-sm mt-1"
              :class="message.user_id === getUser.id ? 'text-right' : 'text-left' "
          >{{ parseMessageCreatedAt(message).time }}
          </div>
        </div>
      </div>
    </div>

    <!--    Footer - Input-->
    <div class="flex gap-2 bottom-10 mt-3 w-full px-1.5">
      <div class="flex-center">
        <PlusCircleIcon
            v-tooltip="'Not available'"
            class="h-7 w-7 cursor-pointer text-[#606060]"
            aria-hidden="true"
        />
      </div>
      <div class="pl-2 flex flex-row  items-center w-full bg-[#f1f2f5] rounded-3xl h-[38px]">
        <input
            v-on:keyup.enter.stop="sendMessage"
            v-model="messageValue"
            class="w-full border bg-[#f1f2f5] ring-0 border-none rounded-2xl border-transparent
                  outline-none h-[36px] text-sm flex items-center  px-2"
            placeholder="start a new message"
        />
      </div>
      <div
          class="flex-center hover:bg-[#f2f2f2] rounded-full px-1.5"
          v-if="messageValue"
      >
        <PaperAirplaneIcon
            class="h-6 w-6 cursor-pointer text-[#606060]"
            aria-hidden="true"
            @click="sendMessage"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ArrowLeftIcon } from '@heroicons/vue/20/solid'
import { PaperAirplaneIcon } from '@heroicons/vue/20/solid'
import { PlusCircleIcon } from '@heroicons/vue/20/solid'

import Input from "@/core/components/forms/Input.vue";
import { chatAPI } from "@/apis/chat";
import { mapGetters } from "@/lib/map-state";
import Loading from "@/core/components/Loading.vue";
import { logger } from "@/core/helper";
import { parseMessageCreatedAt } from "@/lib/dayjs-parse";

const { showFull } = defineProps<{showFull?: boolean}>()

const { getUser, getCurrentUserToMessage } = mapGetters()
const messages = ref([])
const roomId = ref()
const isLoading = ref(null)
const messageValue = ref('')
const guid = ref('')
const elMessages = ref(null)

// const messagesContainer = document.getElementById("messagesId");
// const messagesContainer = document.getElementById("messages");

const emit = defineEmits<{
  (e: 'onUpdateView', value: {showFull?: boolean, showViewChatPrivate?: boolean})
}>()

const ws = new WebSocket(process.env.BASE_URL_WEBSOCKET);

ws.onopen = () => {
  logger.info('Connected to websocket server - MessagesChannel', 'src/components/layout/Chat.vue')
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
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.type === "ping") return;
  if (data.type === "welcome") return;
  if (data.type === "confirm_subscription") return;

  setMessagesThenScrollDown([...messages.value, { ...data.message }]);
};

onMounted(() => {
  fetchPrivateRoomByUser()
})

// watch(getCurrentUserToMessage, () => {
//   fetchPrivateRoomByUser()
// }, { deep: true, immediate: true })

async function fetchPrivateRoomByUser() {
  if (!getCurrentUserToMessage.value) {
    logger.warn('execute fetchPrivateRoomByUser - getCurrentUserToMessage is null')
    emit('onUpdateView', { showViewChatPrivate: false })
    return
  }
  isLoading.value = true
  const { data } = await chatAPI.getPrivateRoomByUser(getCurrentUserToMessage.value.username);
  isLoading.value = false
  if (data.room) {
    setMessagesThenScrollDown(data.room.messages);
    roomId.value = data.room.id
  }
}

type Payload = {
  text: string
  room_id?: number
  username?: string
}

async function sendMessage() {
  const payload: Payload = { text: messageValue.value }
  if (roomId.value) {
    payload.room_id = roomId.value
  } else {
    payload.username = getCurrentUserToMessage.value.username
  }

  const { data } = await chatAPI.sendMessage(payload)
  if (data.message) {
    roomId.value = data.message.room_id
  }
  messageValue.value = ''
}

const setMessagesThenScrollDown = (data) => {
  messages.value = data
  scrollToBottom()
};

const scrollToBottom = () => {
  if (!elMessages.value) return;
  elMessages.value.scrollTop = elMessages.value.scrollHeight
}

</script>


<style scoped>

.me {
  @apply w-fit ml-auto break-all mt-2 mb-1 px-[12px] py-[6px] bg-[#606060] rounded-2xl text-white text-right;
}

.you {
  @apply w-max break-all mt-2  float-none bg-[#e9ecef] rounded-2xl px-[12px] py-[6px] text-left;
}

</style>
