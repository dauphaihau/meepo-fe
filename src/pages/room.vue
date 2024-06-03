<template>
  <div>
    <!--    Header-->
    <HeaderMainContent>
      <template #tabs>
        <div class="absolute top-0 left-0 z-10 bg-white/80  w-full flex gap-4 items-center cursor-pointer h-[56px] px-4">
          <ArrowLeftIcon
            class="h-9 w-9 cursor-pointer hover:bg-zinc-300/50 animate rounded-full p-2"
            aria-hidden="true"
            @click="back"
          />


          <div class="flex items-center gap-2">
            <div>
              <img
                v-if="room?.participant_avatar_url"
                alt="avatar"
                :src="room?.participant_avatar_url"
                class="rounded-full h-8 w-8 bg-black "
              >
              <img
                v-else
                alt="avatar"
                src="../assets/default-avatar.png"
                class="rounded-full h-8 w-8 bg-black "
              >
            </div>
            <div>
              <div class="font-bold text-[17px] leading-5">
                {{ truncateText(room?.participant_name, 18, '...') }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </HeaderMainContent>

    <!-- Messages-->
    <div
      id="messagesId"
      class="px-3"
    >
      <div class="h-[56px]" />
      <div
        v-if="isLoading"
        class="flex-center min-h-[35vh]"
      >
        <Loading
          variant="secondary"
          classes="h-6 w-6"
        />
      </div>
      <div v-else>
        <div v-for="(message, index) of messages">
          <div
            class="whitespace-pre-wrap max-w-[20rem]"
            :class="[( message.user_id === getUser.id ? 'me' : 'you' ),

                     message.user_id !== messages[index + 1]?.user_id && message.user_id !== messages[index - 1]?.user_id ? '' :

                     message.user_id === getUser.id ? {
                       '!rounded-tr-md': message.user_id !== messages[index + 1]?.user_id ,
                       '!rounded-br-md': message.user_id !== messages[index - 1]?.user_id ,
                       '!rounded-tr-md !rounded-br-md': message.user_id === messages[index + 1]?.user_id && message.user_id === messages[index - 1]?.user_id ,
                     } : {
                       '!rounded-bl-md': message.user_id !== messages[index - 1]?.user_id,
                       '!rounded-tl-md': message.user_id !== messages[index + 1]?.user_id,
                       '!rounded-tl-md !rounded-bl-md': message.user_id === messages[index + 1]?.user_id && message.user_id === messages[index - 1]?.user_id,
                     }
            ]"
          >
            {{ message.text }}
          </div>

          <div
            v-if="
              message.user_id !== messages[index + 1]?.user_id ||
                isLastMessage(
                  message?.created_at,
                  messages[index + 1]?.created_at,
                )
            "
            class="text-zinc-500 text-sm mt-1 mb-5"
            :class="message.user_id === getUser.id ? 'text-right' : 'text-left' "
          >
            {{ parseMessageCreatedAt(message).time }}
          </div>
        </div>
      </div>

      <div
        ref="refBottom"
        class="h-16 mt-5"
      />
    </div>

    <!--    Footer - Input-->
    <div class="fixed bottom-0 z-10 bg-white w-full h-16">
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
            v-model="messageValue"
            autofocus
            class="w-full border bg-[#f1f2f5] ring-0 border-none rounded-2xl border-transparent
                      outline-none h-[36px] text-sm flex items-center  px-2"
            placeholder="start a new message"
            @keyup.enter.stop="sendMessage"
          >
        </div>
        <div
          v-if="messageValue"
          class="flex-center hover:bg-[#f2f2f2] rounded-full px-1.5"
        >
          <PaperAirplaneIcon
            class="h-6 w-6 cursor-pointer text-[#606060]"
            aria-hidden="true"
            @click="sendMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { useWebSocket } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import { PlusCircleIcon, PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/vue/20/solid';

import HeaderMainContent from '@components/layout/HeaderMainContent.vue';
import Input from '@core/components/forms/Input.vue';
import { chatService } from '@services/chat.ts';
import { mapGetters } from '@lib/map-state.ts';
import Loading from '@core/components/Loading.vue';
import { logger, parseJSON, truncateText } from '@core/helper.ts';
import { parseMessageCreatedAt, isLastMessage } from '@lib/dayjs-parse.ts';
import { useStore } from '@/store';
import { IMessage } from '@/types/message.ts';
import { useMediaQuery } from '@vueuse/core';

// const { noLastMessages: noLastMessagesFromProp } = defineProps<{showFull?: boolean, noLastMessages: boolean}>();

const { getUser, isLoggedIn } = mapGetters();

const store = useStore();
const router = useRouter();
const route = useRoute();

const messages = ref([]);
const roomId = ref();
const isLoading = ref(null);
// const noLastMessages = ref(noLastMessagesFromProp)
const messageValue = ref('');
const guid = ref('');
const refBottom = ref(null);
const refInput = ref(null);
const room = ref<null | IMessage>(parseJSON(localStorage.getItem('room')));

const { data, send } = useWebSocket(process.env.BASE_URL_WEBSOCKET, {
  autoReconnect: true,
  onConnected: () => {
    logger.info('Connected to websocket server - MessagesChannel', 'src/components/layout/Room.vue');
    guid.value = Math.random().toString(36).substring(2, 15);
    send(
      JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({
          id: guid,
          channel: 'MessagesChannel',
        }),
      })
    );
  },
  onError: (e) => {
    logger.error('Something error with websocket server - MessagesChannel', 'src/components/layout/Room.vue');
  },
  onMessage: () => {
    const parsed = parseJSON<{type: string, message: any}>(data.value);
    if (parsed.type === 'ping') return;
    if (parsed.type === 'welcome') return;
    if (parsed.type === 'confirm_subscription') return;
    const message = parsed.message;
    logger.debug('Websocket server response message - MessagesChannel', message, 'src/components/layout/Room.vue');
    setMessagesThenScrollToBottom([...messages.value, { ...message }]);
  },
});
const isTabletScreen = useMediaQuery('(min-width: 768px)');

onBeforeMount(() => {
  if (isTabletScreen.value) {
    router.push({ name: 'home' });
  }
});

onMounted(async () => {
  if (!isLoggedIn.value) {
    await router.push({ name: 'explore' });
    return;
  }
  await fetchPrivateRoom();
  refBottom.value?.scrollIntoView();
  refInput.value?.focus();
});

async function fetchPrivateRoom() {
  if (!room.value || !room.value.participant_username) {
    logger.error('execute fetchPrivateRoom - room is null', 'src/components/pages/room.vue');
    await router.push({ name: 'messages' });
    return;
  }
  isLoading.value = true;
  const { data } = await chatService.getPrivateRoomByUser(room.value.participant_username);
  isLoading.value = false;
  if (data.room) {
    setMessagesThenScrollToBottom(data.room.messages);
    roomId.value = data.room.id;
  }
}

type Payload = {
  text: string
  room_id?: number
  username?: string
}

async function sendMessage() {
  if (!messageValue.value) {
    return;
  }

  const payload: Payload = { text: messageValue.value };
  if (roomId.value) {
    payload.room_id = roomId.value;
  }
  else {
    // payload.username = getCurrentUserToMessage.value.username
    payload.username = room.value.participant_username;
  }

  const { data, status } = await chatService.sendMessage(payload);
  if (status === 201) {
    if (data.message) {
      roomId.value = data.message.room_id;
    }
    // if (noLastMessages.value) {
    //   noLastMessages.value = false
    // }
    messageValue.value = '';
  }
}

const setMessagesThenScrollToBottom = (data) => {
  messages.value = data;
  refBottom.value?.scrollIntoView({
    behavior: 'smooth',
  });
};

const back = () => {
  router.push('/messages');
  localStorage.removeItem('room');
};

</script>


<style scoped>

.theme {
  @apply rounded-[18px] px-[12px] py-[6px] mb-1 break-all
}

.me {
  @apply theme w-fit ml-auto bg-[#606060] text-white;
}

.you {
  @apply theme w-max float-none bg-[#e9ecef];
}

</style>
