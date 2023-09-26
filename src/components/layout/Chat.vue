<template>
  <div class="h-[500px] relative">

    <!--    Header - Info user-->
    <div
        class="absolute top-0 left-0 z-10 bg-white/80  w-full flex gap-4 items-center cursor-pointer h-[56px] px-4"
        @click="emit('onUpdateView', {showFull: !showFull})"
    >
      <ArrowLeftIcon
          v-if="showFull && !noLastMessages"
          class="h-9 w-9 cursor-pointer hover:bg-zinc-300/50 animate rounded-full p-2"
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
        class="min-h-[436px] max-h-80 overflow-scroll scrollable-div px-4"
        id="messagesId"
    >
      <div class="h-[56px]"/>
      <div v-if="isLoading" class="flex-center min-h-[35vh]">
        <Loading variant="secondary" classes="h-6 w-6"/>
      </div>
      <div v-else>
        <div v-for="(message, index) of messages">
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

      <div ref="refBottom" class="h-12 mt-5"/>
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
            ref="refInput"
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
import { onMounted, onUnmounted, ref, watch } from "vue";
import { ArrowLeftIcon } from '@heroicons/vue/20/solid'
import { PaperAirplaneIcon } from '@heroicons/vue/20/solid'
import { PlusCircleIcon } from '@heroicons/vue/20/solid'

import Input from "@/core/components/forms/Input.vue";
import { chatAPI } from "@/apis/chat";
import { mapGetters } from "@/lib/map-state";
import Loading from "@/core/components/Loading.vue";
import { logger, parseJSON } from "@/core/helper";
import { parseMessageCreatedAt } from "@/lib/dayjs-parse";
import { MutationEnums } from "@/types/store/root";
import { useStore } from "@/store";
import { useWebSocket } from "@vueuse/core";
import { IMessage } from "@/types/message";

const {
  showFull,
  noLastMessages: noLastMessagesFromProp
} = defineProps<{showFull?: boolean, noLastMessages: boolean}>();

const { getUser, getCurrentUserToMessage } = mapGetters()
const store = useStore()

const messages = ref([])
const roomId = ref()
const isLoading = ref(null)
const noLastMessages = ref(noLastMessagesFromProp)
const messageValue = ref('')
const guid = ref('')
const refBottom = ref(null)
const refInput = ref(null)

const emit = defineEmits<{
  (e: 'onUpdateView', value: {showFull?: boolean, showViewChatPrivate?: boolean})
}>()

const { data, send } = useWebSocket(process.env.BASE_URL_WEBSOCKET, {
  autoReconnect: true,
  onConnected: () => {
    logger.info('Connected to websocket server - MessagesChannel', 'src/components/layout/Chat.vue')
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
    logger.error('Something error with websocket server - MessagesChannel', 'src/components/layout/Chat.vue')
  },
  onMessage: () => {
    const parsed = parseJSON<{type: string, message: any}>(data.value)
    if (parsed.type === "ping") return;
    if (parsed.type === "welcome") return;
    if (parsed.type === "confirm_subscription") return;
    const message = parsed.message
    logger.debug('Websocket server response message - MessagesChannel', message, 'src/components/layout/Chat.vue')
    setMessagesThenScrollToBottom([...messages.value, { ...message }]);
  }
})

onMounted(async () => {
  await fetchPrivateRoomByUser()
  refBottom.value?.scrollIntoView();
  refInput.value?.focus()
})

onUnmounted(() => {
  store.commit(MutationEnums.MESSAGE_TO_USER, null)

})

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
    setMessagesThenScrollToBottom(data.room.messages);
    roomId.value = data.room.id
  }
}

type Payload = {
  text: string
  room_id?: number
  username?: string
}

async function sendMessage() {
  if (!messageValue.value) {
    return
  }

  const payload: Payload = { text: messageValue.value }
  if (roomId.value) {
    payload.room_id = roomId.value
  } else {
    payload.username = getCurrentUserToMessage.value.username
  }

  const { data, status } = await chatAPI.sendMessage(payload)
  if (status === 201) {
    if (data.message) {
      roomId.value = data.message.room_id
    }
    if (noLastMessages.value) {
      noLastMessages.value = false
    }
    messageValue.value = ''
  }
}

const setMessagesThenScrollToBottom = (data) => {
  messages.value = data
  refBottom.value?.scrollIntoView({
    behavior: 'smooth',
  })
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
