import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';
import { IAuthAction, IAuthState, AuthGetterTypes } from '@/types/store/auth.ts';
import { IUser } from '@/types/user';

interface IDataToast {
  message: string,
  onClickBtn?: () => void,
  labelBtn?: string
  line?: number
}

// root state types
export interface IRootState extends Partial<IAuthState> {
  openLoginDialog: boolean,
  openForgotPasswordDialog: boolean,
  openRegisterDialog: boolean,
  showChatbox: boolean,
  dataToast: null | IDataToast,
  keyMutatePosts: number,
  stateRouter: unknown,
  currentUserToMessage: IUser,
}

// Getter types
export type GetterTypes = {
  getOpenLoginDialog(state: IRootState): boolean;
  getOpenRegisterDialog(state: IRootState): boolean;
  getOpenForgotPasswordDialog(state: IRootState): boolean;
  getShowChatbox(state: IRootState): boolean;
  getKeyMutatePosts(state: IRootState): number;
  getStateRouter(state: IRootState): unknown;
  getCurrentUserToMessage(state: IRootState): unknown;
  getDataToast(state: IRootState): unknown;
} & Partial<AuthGetterTypes>;

// mutations and action enums
export enum MutationEnums {
  SHOW_TOAST = 'SHOW_TOAST',
  SET_LOGIN_DIALOG = 'SET_LOGIN_DIALOG',
  SET_REGISTER_DIALOG = 'SET_REGISTER_DIALOG',
  SET_FORGOT_PASSWORD_DIALOG = 'SET_FORGOT_PASSWORD_DIALOG',
  SET_USER_INFO = 'SET_USER_INFO',
  RESET_USER_INFO = 'RESET_USER_INFO',
  MUTATE_POSTS = 'MUTATE_POSTS',
  SET_STATE_ROUTER = 'SET_STATE_ROUTER',
  MESSAGE_TO_USER = 'MESSAGE_TO_USER',
  SET_LOADING_AUTH = 'SET_LOADING_AUTH',
}

export enum ActionEnums {
  LOGIN = 'LOGIN',
  LOGIN_WITH_TOKEN = 'LOGIN_WITH_TOKEN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
}

// Mutation types
export type MutationTypes<S = IRootState> = {
  [MutationEnums.SET_LOGIN_DIALOG](state: S, payload: boolean): void;
  [MutationEnums.SET_REGISTER_DIALOG](state: S, payload: boolean): void;
  [MutationEnums.MUTATE_POSTS](state: S): void;
  [MutationEnums.SET_STATE_ROUTER](state: S, payload: unknown): void;
  [MutationEnums.MESSAGE_TO_USER](state: S, payload: IUser): void;
  [MutationEnums.SET_FORGOT_PASSWORD_DIALOG](state: S, payload: boolean): void;
  [MutationEnums.SHOW_TOAST](state: S, payload: IDataToast): void;
};

// actions interface
export interface IAction extends Partial<IAuthAction> {
}

// setup store types
export type StoreTypes = Omit<VuexStore<IRootState>, 'Store' | 'getters' | 'dispatch'> & {
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
