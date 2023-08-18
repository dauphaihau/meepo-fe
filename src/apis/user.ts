import { apiHelper } from "@/lib/axios";

export const userAPI = {
  // the user hasn't followed you yet
  followingByUsers(username) {
    return apiHelper.get(`/users?type=2&include=user&username=${username}`)
  },
  followersByUsers(username) {
    return apiHelper.get(`/users?type=3&include=user&username=${username}`)
  },
  unfollowedUsersList() {
    return apiHelper.get(`/users?type=1`)
  },
  searchUsers(value) {
    return apiHelper.get(`/users?q=${value}`)
  },
  follow(values) {
    console.log('dauphaihau debug: values', values)
    return apiHelper.post('/followers', values)
  },
  getProfile(username) {
    return apiHelper.get(`/users/${username}`)
  },
  updateProfile(id, payload) {
    return apiHelper.put(`/users/${id}`, payload)
  }
}
