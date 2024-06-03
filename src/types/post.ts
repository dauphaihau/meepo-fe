import { IUser } from './user';
import { POST_FILTER_BY } from '@/config/const.ts';
import { z } from 'zod';
import { postSchema } from '@/validations/post.ts';
import { POST_PIN_STATUS } from '@config/post.ts';

type IPost = z.infer<typeof postSchema>

export interface IPostTemp {
  id: number,
  content: string,
  likes_count: number,
  sub_posts_count: number,
  pin_status: POST_PIN_STATUS,
  user_id: number,
  parent_id: number,
  image_url: string,
  // who_can_comment: `${WHO_CAN_COMMENT}` extends `${infer T extends number}` ? T : never
  // who_can_comment: typeof WHO_CAN_COMMENT,
  // who_can_comment: WHO_CAN_COMMENT.EVERYONE | WHO_CAN_COMMENT.FOLLOWED,
  // who_can_comment: keyof typeof WHO_CAN_COMMENT,
  // who_can_comment: typeof WHO_CAN_COMMENT,
  // who_can_comment: typeof IUser['email'],
  // who_can_comment: 0 | 1
  who_can_comment: number
  created_at: Date
  updated_at: Date
  is_current_user_like?: boolean
  author_avatar_url?: string
  author_name?: string
  author_username?: string
  is_current_user_can_comment?: boolean
  who_can_comment_int?: number
  pin_status_int?: number
  edited_posts_count: number
  edited_parent_id?: number
  author?: IUser
}

interface IBaseParamsGetPostList {
  by: POST_FILTER_BY
  limit: number
}

export type IParamsGetPosts = IBaseParamsGetPostList & {
  username?: IPostTemp['author_username']
  page: number
} & Partial<Pick<IPostTemp, 'parent_id' | 'pin_status' | 'user_id' | 'edited_parent_id'>>

export type ICreatePost =
  Pick<IPostTemp, 'parent_id' | 'content'> &
  Partial<Pick<IPostTemp, 'pin_status' | 'image_url' | 'who_can_comment'>> & {
  hashtags?: string[]
}

export type IUpdatePost =
  Pick<IPostTemp, 'id' > &
  Partial<Pick<IPostTemp, 'content' |'parent_id' | 'pin_status' | 'image_url' | 'who_can_comment'>> & {
  hashtags?: string[]
}

export type IResponseGetDetailPost = {
  post: IPostTemp & { parent_post?: IPostTemp }
}


export interface IHashtag {
  name: string,
  count?: number,
}
