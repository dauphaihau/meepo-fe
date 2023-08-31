import { AxiosRequestConfig } from "axios";
import { ActionEnums, IRootState, MutationEnums, MutationTypes } from "@/types/store/root";
import { ActionContext } from "vuex";
import { IUser } from "@/types/user";

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
  user?: Partial<IUser>
}

export type SessionGetterTypes = {
  getUser(state: ISessionState): ISessionState['user'];
  isLoggedIn(state: ISessionState): boolean;
  getAuthToken(state: ISessionState): string;
};

// Mutation types
export type SessionMutationTypes<S = IRootState> = {
  [MutationEnums.SET_USER_INFO]?(state: S, payload: ISessionState['user']): void;
  [MutationEnums.RESET_USER_INFO]?(state: S): void;
} & Partial<MutationTypes>;

type AugmentedActionContext = {
  commit<K extends keyof SessionMutationTypes>(
    key: K,
    payload?: Parameters<SessionMutationTypes[K]>[1]
  ): ReturnType<SessionMutationTypes[K]>;
} & Omit<ActionContext<ISessionState, IRootState>, "commit">;

// actions interface
export interface ISessionAction {
  [ActionEnums.REGISTER]({ commit }: AugmentedActionContext, payload: object);
  [ActionEnums.LOGIN]({ commit }: AugmentedActionContext, payload: object);
  [ActionEnums.LOGIN_WITH_TOKEN]({ commit }: AugmentedActionContext): void;
  [ActionEnums.LOGOUT]({ commit }: AugmentedActionContext): void;
}

