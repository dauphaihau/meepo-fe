import { CommitOptions, DispatchOptions, Store as VuexStore, } from "vuex";
import { ISessionAction, ISessionState, SessionGetterTypes } from "@/types/store/session";
import { IUser } from "@/types/user";

// root state types
export interface IRootState extends Partial<ISessionState>{
  openLoginDialog: boolean,
  openForgotPasswordDialog: boolean,
  openRegisterDialog: boolean,
  showChatbox: boolean,
  keyMutatePosts: number,
  stateRouter: any,
  currentUserToMessage: IUser,
}

// Getter types
export type GetterTypes = {
  getOpenLoginDialog(state: IRootState): boolean;
  getOpenRegisterDialog(state: IRootState): boolean;
  getOpenForgotPasswordDialog(state: IRootState): boolean;
  getShowChatbox(state: IRootState): boolean;
  getKeyMutatePosts(state: IRootState): number;
  getStateRouter(state: IRootState): any;
  getCurrentUserToMessage(state: IRootState): any;
} & Partial<SessionGetterTypes>;

// mutations and action enums
export enum MutationEnums {
  SET_LOGIN_DIALOG = "SET_LOGIN_DIALOG",
  SET_REGISTER_DIALOG = "SET_REGISTER_DIALOG",
  SET_FORGOT_PASSWORD_DIALOG = "SET_FORGOT_PASSWORD_DIALOG",
  SET_USER_INFO = "SET_USER_INFO",
  RESET_USER_INFO = 'RESET_USER_INFO',
  MUTATE_POSTS = 'MUTATE_POSTS',
  SET_STATE_ROUTER = 'SET_STATE_ROUTER',
  MESSAGE_TO_USER = 'MESSAGE_TO_USER',
  SET_LOADING_AUTH = 'SET_LOADING_AUTH',
}

export enum ActionEnums {
  LOGIN = "LOGIN",
  LOGIN_WITH_TOKEN = "LOGIN_WITH_TOKEN",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",
}

// Mutation types
export type MutationTypes<S = IRootState> = {
  [MutationEnums.SET_LOGIN_DIALOG](state: S, payload: boolean): void;
  [MutationEnums.SET_REGISTER_DIALOG](state: S, payload: boolean): void;
  [MutationEnums.MUTATE_POSTS](state: S): void;
  [MutationEnums.SET_STATE_ROUTER](state: S, payload: any): void;
  [MutationEnums.MESSAGE_TO_USER](state: S, payload: any): void;
  [MutationEnums.SET_FORGOT_PASSWORD_DIALOG](state: S, payload: boolean): void;
};

// actions interface
export interface IAction extends Partial<ISessionAction> {}

// setup store types
export type StoreTypes = Omit<VuexStore<IRootState>, "Store" | "getters" | "dispatch"> & {
  commit<K extends keyof MutationTypes, P extends Parameters<MutationTypes[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<MutationTypes[K]>;
} & {
  getters: {
    [K in keyof GetterTypes]: ReturnType<GetterTypes[K]>;
  };
} & {
  dispatch<K extends keyof IAction>(
    key: K,
    payload?: Parameters<IAction[K]>[1],
    options?: DispatchOptions
  ): ReturnType<IAction[K]>;
};
