import {
  ActionTree,
  createStore, GetterTree,
  MutationTree,
  Module,
  Store as VuexStore,
} from "vuex";

import sessionManager from "./modules/session_manager";
import { IAction, GetterTypes, IRootState, MutationTypes, MutationEnums, StoreTypes } from "@/store/types";
import { ISessionState } from "@/store/modules/session_manager_types";

const state: Pick<IRootState, 'openRegisterDialog' | 'openLoginDialog'> = {
  openLoginDialog: false,
  openRegisterDialog: false,
};

// define mutations
const mutations: MutationTree<IRootState> & MutationTypes = {
  [MutationEnums.SET_LOGIN_DIALOG](state: IRootState, payload: boolean) {
    state.openLoginDialog = payload;
  },
  [MutationEnums.SET_REGISTER_DIALOG](state: IRootState, payload: boolean) {
    state.openRegisterDialog = payload;
  },
};

// getters
const getters: GetterTree<IRootState, IRootState> & GetterTypes = {
  getOpenLoginDialog: state => state.openLoginDialog,
  getOpenRegisterDialog: state => state.openRegisterDialog,
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
    // sessionManager
  },
});

// export const key: InjectionKey<VuexStore<IState>> = Symbol()

export function useStore() {
  return store as StoreTypes;
  // return store(key) as StoreTypes;
}
