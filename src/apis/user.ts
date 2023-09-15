// @ts-nocheck
import { apiHelper } from "@/lib/axios";
import { FILTER_USER_BY } from "@/config/const";
import { IUser } from "@/types/user";

export const userAPI = {
  followingByUser(username) {
    return apiHelper.get<{by_user: IUser, users: IUser[]}>(
      `/users?by=${FILTER_USER_BY.FOLLOWING_BY_USERNAME}&include=user&username=${username}`
    )
  },
  followersByUser(username) {
    return apiHelper.get<{by_user: IUser, users: IUser[]}>(
      `/users?by=${FILTER_USER_BY.FOLLOWERS_BY_USERNAME}&include=user&username=${username}`
    )
  },
  unfollowedUsersList() {
    return apiHelper.get<{users: IUser[]}>(`/users?by=${FILTER_USER_BY.UNFOLLOW_CURRENT_USER}`)
  },
  getUsers() {
    return apiHelper.get<{users: IUser[]}>(`/users?by=${FILTER_USER_BY.DEFAULT}`)
  },
  searchUsers(value) {
    return apiHelper.get(`/users?q=${value}`)
  },
  follow(userId) {
    return apiHelper.post(`/users/${userId}/follow`)
  },
  unfollow(userId) {
    return apiHelper.post(`/users/${userId}/unfollow`)
  },
  getProfile(username) {
    return apiHelper.get<{user: IUser}>(`/users/${username}`)
  },
  updateProfile(id, payload) {
    return apiHelper.put<{user: IUser}>(`/users/${id}`, payload)
  },
  login(payload) {
    return apiHelper.post<{user: IUser, message: string}>(`/users/sign_in`, payload)
  },
  register(payload) {
    return apiHelper.post<{user: IUser, message: string}>(`/users`, payload)
  },
  forgetPassword(query) {
    return apiHelper.post<{message: string}>(`/users/password/reset`, { query })
  },
  verifyCodeFromEmail(token) {
    return apiHelper.patch<{message: string}>(`/users/password/reset`, { token })
  },
  resetPassword(payload) {
    return apiHelper.put<{user: IUser, message: string}>(`/users/password/reset`, payload)
  },
  logout() {
    return apiHelper.delete(`/users/sign_out`)
  },
  me(whereSrcRequest?: string) {
    return apiHelper.get<{user: IUser}>(`/me`)
  },
}
