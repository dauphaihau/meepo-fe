
export interface IRoom {
  id: number,
  participant_name: string,
  participant_username: string,
  created_at: string
  last_message?: string
  time?: string
}
