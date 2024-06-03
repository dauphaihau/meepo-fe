import { IUser } from '@/types/user.ts';
import { apiHelper } from '@lib/axios.ts';

export const authService = {
  login(payload) {
    return apiHelper.post<{ user: IUser, message: string }>('/users/sign_in', payload);
  },
  register(payload) {
    return apiHelper.post<{ user: IUser, message: string }>('/users', payload);
  },
  forgetPassword(query) {
    return apiHelper.post<{ message: string }>('/users/password/reset', { query });
  },
  verifyCodeFromEmail(token) {
    return apiHelper.patch<{ message: string }>('/users/password/reset', { token });
  },
  resetPassword(payload) {
    return apiHelper.put<{ user: IUser, message: string }>('/users/password/reset', payload);
  },
  logout() {
    return apiHelper.delete('/users/sign_out');
  },
  me() {
    return apiHelper.get<{ user: IUser }>('/me');
  },
};
