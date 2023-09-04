import { apiHelper } from "@/lib/axios";
import { IHashtag, IPost } from "@/types/post";

export const postAPI = {
  list(payload, whereSrcRequest?: string) {
    const queriesString = new URLSearchParams(payload);
    const path = `/posts?${queriesString}`;
    return apiHelper.get<{posts: IPost[]}>(path)
    // return apiHelper.get<{posts: IPost[]}>(path, {whereSrcRequest})
  },
  detail(id) {
    return apiHelper.get<{post: IPost & {parent_post?: IPost}}>(`/posts/${id}`)
  },
  create(values) {
    const hashtags = values.content && values.content.match(/#\w+/g)
    if (hashtags && hashtags.length) {
      values.hashtags = hashtags.map(v => v.replace('#', ''))
    }

    return apiHelper.post('/posts', values)
  },
  update(id, payload) {
    return apiHelper.put(`/posts/${id}`, payload)
  },
  delete(id) {
    return apiHelper.delete(`posts/${id}`)
  },
  listHashtags() {
    return apiHelper.get<{hashtags: IHashtag[]}>(`hashtags`)
  },
  like(postId) {
    return apiHelper.post<{likes_count: number, message: string}>(`/likes`, { post_id: postId })
  },
}
