import { apiHelper } from "@/lib/axios";
import { IHashtag, IPost } from "@/types/post";

export const postAPI = {
  list(payload, whereSrcRequest?: string) {
    const url = new URL("https://example.com/posts");
    let params = new URLSearchParams(url.search);
    Object.keys(payload).forEach((key) => {
      params.set(key, payload[key])
    })
    const path = `/posts?${params}`;
    return apiHelper.get<{posts: IPost[]}>(path)
    // return apiHelper.get<{posts: IPost[]}>(path, {whereSrcRequest})
  },
  detail(id) {
    return apiHelper.get<{post: IPost}>(`/posts/${id}`)
  },
  create(values) {
    const hashtags = values.content.split(' ').filter(v => v.startsWith('#'))
    if (hashtags.length) {
      values.hashtags = hashtags
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
    return apiHelper.post<{likes_count: number, message: string}>(`/posts/likes`, { post_id: postId })
  },
}
