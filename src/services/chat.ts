import { apiHelper } from '@lib/axios';
import { IMessage } from '@/types/message';

export const chatService = {
  getMessages() {
    return apiHelper.get<{messages: IMessage[]}>('/messages');
  },
  getPrivateRoomByUser(participant_username) {
    return apiHelper.get(`/rooms/${participant_username}`);
  },
  sendMessage(values) {
    return apiHelper.post<{message: IMessage}>('/messages', values);
  },
};
