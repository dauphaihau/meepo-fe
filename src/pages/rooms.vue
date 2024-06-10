<script setup lang="ts">
import {
  computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref, watch
} from 'vue';
import { useRouter } from 'vue-router';
import { PlusCircleIcon, PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/vue/20/solid';

import HeaderMainContent from '@components/layout/HeaderMainContent.vue';
import { useGetMessages, useSendMessage } from '@services/chat.ts';
import Loading from '@core/components/Loading.vue';
import { truncateText } from '@core/helpers/common.ts';
import { parseMessageCreatedAt, isLastMessage } from '@lib/dayjs-parse.ts';
import { ISendMessage } from '@/types/chat.ts';
import { useMediaQuery } from '@vueuse/core';
import { PAGE_PATHS } from '@config/const.ts';
import { useChatStore } from '@stores/chat.ts';
import useRealtimeMessage from '@composables/useRealtimeMessage.ts';
import { StatusCodes } from 'http-status-codes';
import { useAuthStore } from '@stores/auth.ts';

const authStore = useAuthStore();
const chatStore = useChatStore();
const isTabletScreen = useMediaQuery('(min-width: 768px)');
const router = useRouter();

const newMessages = ref([]);
const messageValue = ref('');
const refBottom = ref<HTMLDivElement | null>(null);
const refInput = ref<HTMLInputElement | null>(null);

const roomId = ref(chatStore.currentUserToMessage?.room_id);

const limit = 20;

const params = computed(() => {
  if (roomId.value) {
    return {
      room_id: roomId.value,
      limit,
      page: 1,
    };
  }
  return null;
});

const {
  mutateAsync: sendMessage,
} = useSendMessage();

const {
  data: dataGetMessages,
  fetchNextPage,
  isFetchingNextPage,
  refetch: refetchGetMessages,
  isLoading,
} = useGetMessages(params.value);

const maxMessagesPage = computed(() => Math.floor(dataGetMessages.value?.pages[0].total_messages / limit));

const messages = computed(() => {
  if (dataGetMessages.value?.pages && dataGetMessages.value.pages.length > 0) {
    let messagesTemp = dataGetMessages.value.pages.reduce((acc, next) => {
      if (dataGetMessages.value.pages.length > 1) {
        return [...next.messages, ...acc];
      }
      else {
        return [...acc, ...next.messages];
      }
    }, []);
    if (newMessages.value.length > 0) {
      messagesTemp = [...messagesTemp, ...newMessages.value];
    }
    return messagesTemp;
  }
  return [];
});

useRealtimeMessage((messageRecord) => {
  newMessages.value.push(messageRecord);
  scrollToBottomWindow();
});

onBeforeMount(() => {
  if (isTabletScreen.value) {
    router.push(PAGE_PATHS.HOME);
  }
});

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    await router.push(PAGE_PATHS.EXPLORE);
    return;
  }
  window.addEventListener('scroll', onScroll);
  scrollToBottomWindow();
  refInput.value?.focus();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});

watch(() => dataGetMessages.value, () => {
  if (dataGetMessages.value?.pageParams?.length === 1) {
    nextTick(() => {
      scrollToBottomWindow();
    });
  }
});

function onScroll() {
  const isReachTop = document.documentElement.scrollTop === 0;
  if (
    isReachTop &&
      !isFetchingNextPage.value &&
      dataGetMessages.value?.pageParams?.length <= maxMessagesPage.value
  ) {
    fetchNextPage();
    nextTick(() => {
      document.documentElement.scrollTop += 300;
    });
  }
}

function scrollToBottomWindow() {
  window.scrollTo(0, document.body.scrollHeight);
}

async function handleSendMessage() {
  if (!messageValue.value) {
    return;
  }
  const payload: ISendMessage = { text: messageValue.value };
  if (roomId.value) {
    payload.room_id = roomId.value;
  }
  else {
    payload.username = chatStore.currentUserToMessage.username;
  }
  const { data, status } = await sendMessage(payload);

  if (status === StatusCodes.CREATED) {
    messageValue.value = '';
    if (!roomId.value && data.message?.room_id) {
      roomId.value = data.message.room_id;
      await refetchGetMessages();
    }
  }
}

const backMessagesPage = () => {
  router.push(PAGE_PATHS.MESSAGES);
  chatStore.currentUserToMessage = null;
};
const redirectProfile = () => {
  router.push(`${PAGE_PATHS.USER}/${chatStore.currentUserToMessage.username}`);
};

</script>

<template>
  <div>
    <!--    Header-->
    <HeaderMainContent>
      <template #tabs>
        <div class="absolute top-0 left-0 z-10 bg-white/80  w-full flex gap-4 items-center cursor-pointer h-[56px] px-4">
          <ArrowLeftIcon
            class="h-9 w-9 cursor-pointer hover:bg-zinc-300/50 animate rounded-full p-2"
            aria-hidden="true"
            @click="backMessagesPage"
          />

          <div
            class="flex items-center gap-2"
            @click="redirectProfile"
          >
            <div>
              <img
                v-if="chatStore.currentUserToMessage?.avatar_url"
                alt="avatar"
                :src="chatStore.currentUserToMessage?.avatar_url"
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
                {{ truncateText(chatStore.currentUserToMessage?.name, 18, '...') }}
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
        <div
          v-for="(message, index) of messages"
          :key="message.id"
        >
          <div
            class="whitespace-pre-wrap max-w-[20rem]"
            :class="[( message.user_id === authStore.user?.id ? 'me' : 'you' ),

                     message.user_id !== messages[index + 1]?.user_id && message.user_id !== messages[index - 1]?.user_id ? '' :

                     message.user_id === authStore.user?.id ? {
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
            :class="message.user_id === authStore.user?.id ? 'text-right' : 'text-left' "
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
            @keyup.enter.stop="handleSendMessage"
          >
        </div>
        <div
          v-if="messageValue"
          class="flex-center hover:bg-[#f2f2f2] rounded-full px-1.5"
        >
          <PaperAirplaneIcon
            class="h-6 w-6 cursor-pointer text-[#606060]"
            aria-hidden="true"
            @click="handleSendMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

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
