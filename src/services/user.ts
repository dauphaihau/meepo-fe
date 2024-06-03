import { apiHelper } from '@/lib/axios';
import { USER_FILTER_BY } from '@config/const';
import { IUser } from '@/types/user';
import { useQuery } from '@tanstack/vue-query';

export const userService = {
  followingByUser(username: IUser['username']) {
    return apiHelper.get<{ by_user: IUser, users: IUser[] }>(
      `/users?by=${USER_FILTER_BY.FOLLOWING_BY_USERNAME}&include=user&username=${username}`
    );
  },
  followersByUser(username: IUser['username']) {
    return apiHelper.get<{ by_user: IUser, users: IUser[] }>(
      `/users?by=${USER_FILTER_BY.FOLLOWERS_BY_USERNAME}&include=user&username=${username}`
    );
  },
  unfollowedUsersList() {
    return apiHelper.get<{ users: IUser[] }>(`/users?by=${USER_FILTER_BY.UNFOLLOW_CURRENT_USER}`);
  },
  getUsers() {
    return apiHelper.get<{ users: IUser[] }>(`/users?by=${USER_FILTER_BY.DEFAULT}`);
  },
  // searchUsers(value: string) {
  //   return apiHelper.get(`/users?q=${value}`);
  // },
  follow(userId: IUser['id']) {
    return apiHelper.post(`/users/${userId}/follow`);
  },
  unfollow(userId: IUser['id']) {
    return apiHelper.post(`/users/${userId}/unfollow`);
  },
  getProfile(username: IUser['username']) {
    return apiHelper.get<{ user: IUser }>(`/users/${username}`);
  },
  async getProfileTemp(username: IUser['username']) {
    const res = await apiHelper.get<{ user: IUser }>(`/users/${username}`);
    return res.data;
  },
  updateProfile(id, payload) {
    return apiHelper.put<{ user: IUser }>(`/users/${id}`, payload);
  },
};

export function useGetProfileUser(username: IUser['username']) {
  return useQuery({
    queryKey: ['get-profile-user', username],
    queryFn: () => userService.getProfileTemp(username),
  });
}
