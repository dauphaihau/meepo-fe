import { apiHelper } from "@/lib/axios";
import axios from "axios";

export const postAPI = {
  list(payload) {
    const { currentPath, username, page_count, user_id, status } = payload
    const url = new URL("https://example.com/posts");
    let params = new URLSearchParams(url.search);
    Object.keys(payload).forEach((key) => {
      params.set(key, payload[key])
    })
    const path = `/posts?${params}`;
    return apiHelper.get(path)
  },
  detail(id) {
    return apiHelper.get(`/posts/${id}`)
  },
  create(values) {
    const hashtags = values.content.split(' ').filter(v => v.startsWith('#'))
    if (hashtags.length) {
      values.hashtags = hashtags
    }
    return apiHelper.post('/posts', values)
    // return apiHelper.post('/posts', values, {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   }
    // })
  },
  update(id, payload) {
    return apiHelper.put(`/posts/${id}`, payload)
  },
  delete(id) {
    return apiHelper.delete(`posts/${id}`)
  },
  async uploadImage(fileImage) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
    const folderName = process.env.CLOUDINARY_FOLDER_NAME

    const formData = new FormData()
    formData.append("file", fileImage)
    formData.append("upload_preset", uploadPreset)
    formData.append("folder", folderName)

    try {
      return await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      )
    } catch (error) {
      console.error(error)
    }
  }
}
