import { defineStore } from 'pinia';

export type DialogTypes = 'register'
  | 'login'
  | 'forgot-password'
  | 'update-profile'
  | 'update-post'
  | 'create-post'
  | 'reply-post';

export interface IState {
  showDialog: DialogTypes | null
  data: unknown
}

export const useDialogStore = defineStore('dialog', {
  state: (): IState => ({
    showDialog: null,
    data: null,
  }),
  getters: {},
  actions: {
    close() {
      this.showDialog = null;
      this.data = null;
    },
  },
});
