import { apiHelper } from '@/lib/axios';
import {
  ICreatePost, IHashtag, IParamsGetPosts, IPostTemp, IResponseGetDetailPost, IUpdatePost
} from '@/types/post';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/vue-query';

export const postService = {
  async list(params: IParamsGetPosts) {
    const queriesString = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] === 0 || params[key]) {
        queriesString.append(key, params[key]);
      }
    });
    const res = await apiHelper.get<{posts: IPostTemp[]}>(`/posts?${queriesString}`);
    return res.data;
  },
  async detail(id: IPostTemp['id']) {
    const res = await apiHelper.get<IResponseGetDetailPost>(`/posts/${id}`);
    return res.data;
  },
  async create(values: ICreatePost) {
    const hashtags = values.content && values.content.match(/#\w+/g);
    if (hashtags && hashtags.length) {
      values.hashtags = hashtags.map(v => v.replace('#', ''));
    }
    return await apiHelper.post<{post: IPostTemp}>('/posts', values);
  },
  async update({ id, ...payload }: IUpdatePost) {
    return apiHelper.put<{post: IPostTemp}>(`/posts/${id}`, payload);
  },
  delete(id: IPostTemp['id']) {
    return apiHelper.delete(`posts/${id}`);
  },
  async listHashtags() {
    const res = await apiHelper.get<{hashtags: IHashtag[]}>('hashtags');
    return res.data;
  },
  likePost(postId: IPostTemp['id']) {
    return apiHelper.post<{likes_count: number, message: string}>('/likes', { post_id: postId });
  },
};

export function useGetPosts(params: IParamsGetPosts) {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['get-posts', params],
    queryFn: ({ pageParam = 1 }) => postService.list({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.posts.length > 0 ? allPages.length + 1 : undefined;
    },
    enabled: Boolean(params),
  });
}

export function useGetDetailPost(postId: IPostTemp['id']) {
  return useQuery({
    queryKey: ['detail-post', postId],
    queryFn: () => postService.detail(postId),
    enabled: Number.isInteger(postId),
  });
}

export function useCreatePost() {
  return useMutation({
    mutationKey: ['create-post'],
    mutationFn: (post: ICreatePost) => postService.create(post),
  });
}

export function useLikePost(id: IPostTemp['id']) {
  return useMutation({
    mutationKey: ['like-post'],
    mutationFn: () => postService.likePost(id),
  });
}

export function useUpdatePost() {
  return useMutation({
    mutationKey: ['update-post'],
    mutationFn: (post: IUpdatePost) => postService.update(post),
  });
}

export function useDeletePost(postId: IPostTemp['id']) {
  return useMutation({
    mutationKey: ['delete-post'],
    mutationFn: () => postService.delete(postId),
  });
}

export function useGetHashtags() {
  return useQuery({
    queryKey: ['get-hashtags'],
    queryFn: () => postService.listHashtags(),
  });
}
