import { AxiosRequestConfig } from "axios";
import { ActionEnums, IRootState, MutationEnums } from "@/store/types";
import { ActionContext } from "vuex";

export interface IAxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: {
    authorization: string
  };
  config: AxiosRequestConfig;
  request?: any;
}

export interface ISessionState {
  auth_token: string,
  user: {
    id: number | null,
    username: string | null,
    email: string | null,
    name: string | null,
  },
}

export type SessionGetterTypes = {
  getUser(state: ISessionState): object;
  isLoggedIn(state: ISessionState): boolean;
  getAuthToken(state: ISessionState): string;
};


// Mutation types
export type SessionMutationTypes<S = ISessionAction> = {
  [MutationEnums.SET_USER_INFO]?(state: S, payload: object): void;
  [MutationEnums.RESET_USER_INFO]?(state: S): void;
};


type AugmentedActionContext = {
  commit<K extends keyof SessionMutationTypes>(
    key: K,
    payload: Parameters<SessionMutationTypes[K]>[1]
  ): ReturnType<SessionMutationTypes[K]>;
} & Omit<ActionContext<ISessionState, ISessionState>, "commit">;


// actions interface
export interface ISessionAction {
  [ActionEnums.REGISTER]({ commit }: AugmentedActionContext, payload: object): string | void;
  [ActionEnums.LOGIN]({ commit }: AugmentedActionContext, payload: object): void;
  [ActionEnums.LOGIN_WITH_TOKEN]({ commit }: AugmentedActionContext): void;
  [ActionEnums.LOGOUT]({ commit }: AugmentedActionContext): void;
}

