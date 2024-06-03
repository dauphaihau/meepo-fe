import {
  ActionEnums, IRootState, MutationEnums, MutationTypes
} from '@/types/store/root';
import { ActionContext } from 'vuex';
import { IUser } from '@/types/user';

// export interface IAxiosResponse<T = any> {
//   data: T;
//   status: number;
//   statusText: string;
//   headers: {
//     authorization: string
//   };
//   config: AxiosRequestConfig;
//   request?: any;
// }

export interface IAuthState {
  auth_token: string
  user?: Partial<IUser>
  loadingAuth: boolean
}

export type AuthGetterTypes = {
  getUser(state: IAuthState): IAuthState['user'];
  isLoggedIn(state: IAuthState): boolean;
  getAuthToken(state: IAuthState): string;
  getLoadingAuth(state: IAuthState): boolean;
};

// Mutation types
export type AuthMutationTypes<S = IRootState> = {
  [MutationEnums.SET_USER_INFO]?(state: S, payload: IAuthState['user']): void;
  [MutationEnums.RESET_USER_INFO]?(state: S): void;
  [MutationEnums.SET_LOADING_AUTH]?(state: S, payload: boolean): void;
} & Partial<MutationTypes>;

type AugmentedActionContext = {
  commit<K extends keyof AuthMutationTypes>(
    key: K,
    payload?: Parameters<AuthMutationTypes[K]>[1]
  ): ReturnType<AuthMutationTypes[K]>;
} & Omit<ActionContext<IAuthState, IRootState>, 'commit'>;

// actions interface
export interface IAuthAction {
  [ActionEnums.REGISTER]({ commit }: AugmentedActionContext, payload: object);
  [ActionEnums.LOGIN]({ commit }: AugmentedActionContext, payload: object);
  [ActionEnums.LOGIN_WITH_TOKEN]({ commit }: AugmentedActionContext): void;
  [ActionEnums.LOGOUT]({ commit }: AugmentedActionContext): void;
}
