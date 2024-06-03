export interface IMessage {
  id: number,
  room_id: number,
  text: string
  participant_name?: string,
  participant_username?: string,
  participant_avatar_url?: string,
  created_at: string
  time?: string
}
