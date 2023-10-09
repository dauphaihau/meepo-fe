import {
  ActionTree,
  createStore, GetterTree,
  MutationTree,
  Module,
} from "vuex";

import sessionManager from "./modules/session";
import { IAction, GetterTypes, IRootState, MutationTypes, MutationEnums, StoreTypes } from "@/types/store/root";
import { ISessionState } from "@/types/store/session";

const state: IRootState = {
  openLoginDialog: false,
  openRegisterDialog: false,
  openForgotPasswordDialog: false,
  showChatbox: false,
  dataToast: null,
  keyMutatePosts: 0,
  stateRouter: null,
  currentUserToMessage: null,
};

// mutations
const mutations: MutationTree<IRootState> & MutationTypes = {
  [MutationEnums.SHOW_TOAST](state: IRootState, payload) {
    state.dataToast = payload;
  },
  [MutationEnums.SET_LOGIN_DIALOG](state: IRootState, payload) {
    state.openLoginDialog = payload;
  },
  [MutationEnums.SET_REGISTER_DIALOG](state: IRootState, payload) {
    state.openRegisterDialog = payload;
  },
  [MutationEnums.SET_FORGOT_PASSWORD_DIALOG](state: IRootState, payload) {
    state.openForgotPasswordDialog = payload;
  },
  [MutationEnums.MUTATE_POSTS](state: IRootState) {
    state.keyMutatePosts++
  },
  [MutationEnums.SET_STATE_ROUTER](state: IRootState, payload) {
    state.stateRouter = payload;
  },
  [MutationEnums.MESSAGE_TO_USER](state: IRootState, newState) {
    state.showChatbox = true
    // state.showChatbox = !state.showChatbox
    state.currentUserToMessage = newState
  }
};

// getters
const getters: GetterTree<IRootState, IRootState> & GetterTypes = {
  getOpenLoginDialog: state => state.openLoginDialog,
  getOpenRegisterDialog: state => state.openRegisterDialog,
  getOpenForgotPasswordDialog: state => state.openForgotPasswordDialog,
  getKeyMutatePosts: state => state.keyMutatePosts,
  getShowChatbox: state => state.showChatbox,
  getStateRouter: state => state.stateRouter,
  getCurrentUserToMessage: state => state.currentUserToMessage,
  getDataToast: state => state.dataToast,
};

// actions
const actions: ActionTree<IRootState, IRootState> & IAction = {};

const session: Module<ISessionState, IRootState> = sessionManager

export const store = createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {
    session
  },
});

export function useStore() {
  return store as StoreTypes;
}
