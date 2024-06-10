<script setup lang="ts">
import Room from './Room.vue';
import LastMessageList from '@components/chatbox/LastMessageList.vue';
import { useChatStore } from '@stores/chat.ts';
import { useAuthStore } from '@stores/auth.ts';

const authStore = useAuthStore();
const chatStore = useChatStore();

</script>

<template>
  <div
    class="hidden md:flex flex-col
     fixed bottom-0 right-3 z-[4]
     max-w-[400px] bg-white rounded-t-2xl w-full
     border border-zinc-50
     overflow-hidden
     transition-all duration-500 transform max-h-0
     chatbox-shadow
    "
    :class="{
      'min-h-[54px]': authStore.user?.last_message_count < 0,
      'max-h-[500px]': chatStore.showFullChatbox,
      'max-h-[54px]': !chatStore.showFullChatbox,
    }"
  >
    <LastMessageList v-if="!chatStore.showViewChatPrivate" />
    <Room v-else />
  </div>
</template>

<style scoped>
.chatbox-shadow {
  box-shadow: rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px;
}
</style>
