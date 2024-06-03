import { FILTER_SEARCH_ALL } from '@config/const.ts';
import { IUser } from '@/types/user.ts';
import { IPostTemp } from '@/types/post.ts';

export interface IParamsSearchAll {
  limit?: number
  page?: number
  f?: FILTER_SEARCH_ALL
  q?: string
}

export interface IResponseGetSearchAll {
  users: IUser[]
  total_users: number
  total_posts: number
  posts: IPostTemp[]
  posts_trending: IPostTemp[]
}
