import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { apiHelper } from '@lib/axios';
import { ActionEnums, IRootState, MutationEnums } from '@/types/store/root';
import {
  IAuthAction,
  IAuthState,
  AuthGetterTypes, AuthMutationTypes
} from '@/types/store/auth.ts';
import { logger } from '@/core/helper';
import { authService } from '@services/auth.ts';

const state: IAuthState = {
  auth_token: '',
  user: {
    id: null,
    username: null,
    email: null,
    name: null,
    avatar_url: null,
  },
  loadingAuth: false,
};

const getters: GetterTree<IAuthState, IRootState> & AuthGetterTypes = {
  getAuthToken: state => state.auth_token,
  getUser: state => state.user,
  isLoggedIn(state) {
    const loggedOut = state.auth_token === '';
    return !loggedOut;
  },
  getLoadingAuth: state => state.loadingAuth,
};

const actions: ActionTree<IAuthState, IRootState> & IAuthAction = {
  async [ActionEnums.REGISTER]({ commit }, payload) {
    try {
      const { data, status, headers } = await authService.register(payload);

      if (status === 409) {
        logger.error(data, 'src/store/modules/session.ts');
        return data.message;
      }

      if (!headers.authorization) {
        logger.error('authorization is null', 'src/store/modules/session.ts');
        return;
      }

      apiHelper.defaults.headers.common['Authorization'] = headers.authorization;
      localStorage.setItem('auth_token', headers.authorization);
      commit(MutationEnums.SET_USER_INFO, data.user);
      commit(MutationEnums.SET_REGISTER_DIALOG, false);
    }
    catch (error) {
      logger.error(error, 'src/store/modules/session.ts');
    }
  },
  async [ActionEnums.LOGIN]({ commit }, payload) {
    try {
      const { status, data, headers } = await authService.login(payload);

      if (status !== 200) {
        logger.info(data.message, 'src/store/modules/session.ts');
      }

      if (status === 401) {
        return data;
      }

      if (!headers.authorization) {
        logger.info('authorization is null', 'src/store/modules/session.ts');
        return;
      }

      apiHelper.defaults.headers.common['Authorization'] = headers.authorization;
      localStorage.setItem('auth_token', headers.authorization);
      commit(MutationEnums.SET_USER_INFO, data.user);
    }
    catch (error) {
      logger.error(error, 'src/store/modules/session.ts');
    }
  },
  async [ActionEnums.LOGOUT]({ commit }) {
    try {
      const { status } = await authService.logout();
      if (status === 200) {
        commit(MutationEnums.RESET_USER_INFO);
      }
    }
    catch (error) {
      logger.error(error, 'src/store/modules/session.ts');
    }
  },
  async [ActionEnums.LOGIN_WITH_TOKEN]({ commit }) {
    try {
      commit(MutationEnums.SET_LOADING_AUTH, true);
      const { data, status } = await authService.me();
      commit(MutationEnums.SET_LOADING_AUTH, false);

      if (status === 401) {
        commit(MutationEnums.RESET_USER_INFO);
      }
      if (status === 200) {
        commit(MutationEnums.SET_USER_INFO, data.user);
      }
    }
    catch (error) {
      logger.error(error, 'src/store/modules/session.ts');
    }
  },
};

const mutations: MutationTree<Partial<IAuthState>> & AuthMutationTypes = {
  [MutationEnums.SET_USER_INFO](state, dataUser) {
    state.user = dataUser;
    state.auth_token = localStorage.getItem('auth_token');
  },
  [MutationEnums.RESET_USER_INFO](state) {
    state.user = {
      id: null,
      username: null,
      email: null,
      name: null,
      avatar_url: null,
    };
    state.auth_token = '';
    state.openLoginDialog = false;
    state.showChatbox = false;
    localStorage.removeItem('auth_token');
    apiHelper.defaults.headers.common['Authorization'] = '';
  },
  [MutationEnums.SET_LOADING_AUTH](state: IRootState, payload: boolean) {
    state.loadingAuth = payload;
  },
};

export default {
  state, getters, actions, mutations,
};
