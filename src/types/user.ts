export interface IUser {
  id: number,
  email: string,
  username: string,
  name: string,
  bio?: string,
  avatar_url?: string,
  website?: string,
  location?: string,
  posts_count: number,
  dob: string,
  created_at: string
  // created_at: Date
  updated_at: Date
  followers_count?: number
  followed_count?: number
  is_current_user_following?: boolean
  author_followers_count?: number
  author_followed_count?: number
  author_avatar_url?: string
  rooms_private_count?: number
}
