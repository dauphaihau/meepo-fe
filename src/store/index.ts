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
  getKeyMutatePosts: 0,
};

// define mutations
const mutations: MutationTree<IRootState> & MutationTypes = {
  [MutationEnums.SET_LOGIN_DIALOG](state: IRootState, payload: boolean) {
    state.openLoginDialog = payload;
  },
  [MutationEnums.MUTATE_POSTS](state: IRootState) {
    state.getKeyMutatePosts++
  },
  [MutationEnums.SET_REGISTER_DIALOG](state: IRootState, payload: boolean) {
    state.openRegisterDialog = payload;
  },
};

// getters
const getters: GetterTree<IRootState, IRootState> & GetterTypes = {
  getOpenLoginDialog: state => state.openLoginDialog,
  getOpenRegisterDialog: state => state.openRegisterDialog,
  getKeyMutatePosts: state => state.getKeyMutatePosts,
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
