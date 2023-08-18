import { IUser } from './user';

export enum WHO_CAN_COMMENT {
  EVERYONE,
  FOLLOWED
}

export enum PIN_STATUS {
  UNPIN,
  PIN,
}

export interface IPost {
  id: number,
  content: string,
  likes_count: number,
  sub_posts_count: number,
  pin_status: PIN_STATUS,
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
  author_avatar?: string
  author_name?: string
  author_username?: string
  is_current_user_can_comment?: boolean
  who_can_comment_int?: number
}
