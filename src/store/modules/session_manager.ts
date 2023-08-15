import { apiHelper } from "@/lib/axios";
import { ActionEnums, MutationEnums } from "@/store/types";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import {
  IAxiosResponse,
  ISessionAction,
  ISessionState,
  SessionGetterTypes, SessionMutationTypes
} from "@/store/modules/session_manager_types";
import { logger } from "@/core/helper";

const state: ISessionState = {
  auth_token: '',
  user: {
    id: null,
    username: null,
    email: null,
    name: null,
  },
};

const getters: GetterTree<ISessionState, ISessionState> & SessionGetterTypes = {
  getAuthToken(state) {
    return state.auth_token;
  },
  getUser(state) {
    return state.user;
  },
  isLoggedIn(state) {
    const loggedOut = state.auth_token === ''
    return !loggedOut;
  },
};

const actions: ActionTree<ISessionState, ISessionState> & ISessionAction = {
  async [ActionEnums.REGISTER]({ commit }, payload) {
    try {
      const res: IAxiosResponse = await apiHelper.post(`/users`, payload)
      console.log('dauphaihau debug: res', res)

      // if (res.status !== 200) {
      //   logger.info(res.data.message, 'src/store/modules/session_manager.ts')
      //   return
      // }

      if (res.status === 409) {
        logger.error(res.data, 'src/store/modules/session_manager.ts')
        return res.data.message
      }

      if (!res.headers.authorization) {
        logger.error('authorization is null', 'src/store/modules/session_manager.ts')
        return
      }

      apiHelper.defaults.headers.common["Authorization"] = res.headers.authorization;
      localStorage.setItem("auth_token", res.headers.authorization);
      commit(MutationEnums.SET_USER_INFO, res.data.user);
    } catch (error) {
      logger.error(error, 'src/store/modules/session_manager.ts')
    }
  },
  async [ActionEnums.LOGIN]({ commit }, payload) {
    try {
      const res: IAxiosResponse = await apiHelper.post(`/users/sign_in`, payload)

      if (res.status !== 200) {
        logger.info(res.data.message, 'src/store/modules/session_manager.ts')
      }

      if (res.status === 401) {
        return res.data
      }

      if (!res.headers.authorization) {
        logger.info('authorization is null', 'src/store/modules/session_manager.ts')
        return
      }

      apiHelper.defaults.headers.common["Authorization"] = res.headers.authorization;
      localStorage.setItem("auth_token", res.headers.authorization);
      commit(MutationEnums.SET_USER_INFO, res.data.user);
    } catch (error) {
      logger.error(error, 'src/store/modules/session_manager.ts')
    }
  },
  async [ActionEnums.LOGOUT]({ commit }) {
    try {
      const res = await apiHelper.delete(`/users/sign_out`)
      if (res.status === 200) {
        commit(MutationEnums.RESET_USER_INFO)
      }
    } catch (error) {
      logger.error(error, 'src/store/modules/session_manager.ts')
    }
  },
  async [ActionEnums.LOGIN_WITH_TOKEN]({ commit }) {
    try {
      const res = await apiHelper.get(`/member-data`)

      if (res.status === 401) {
        commit(MutationEnums.RESET_USER_INFO)
      }

      if (res.status === 200) {
        commit(MutationEnums.SET_USER_INFO, res.data.user);
      }
    } catch (error) {
      // console.log('dauphaihau debug: error', error)
    }
  },
};

const mutations: MutationTree<ISessionState> & SessionMutationTypes = {
  [MutationEnums.SET_USER_INFO](state, dataUser) {
    state.user = dataUser;
    state.auth_token = localStorage.getItem('auth_token')
  },
  [MutationEnums.RESET_USER_INFO](state) {
    state.user = {
      id: null,
      username: null,
      email: null,
      name: null,
    };
    state.auth_token = '';
    state.openLoginDialog = false
    localStorage.removeItem("auth_token");
    apiHelper.defaults.headers.common["Authorization"] = '';
  },
};

export default { state, getters, actions, mutations, };
