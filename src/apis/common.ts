import { apiHelper } from "@/lib/axios";
import axios from "axios";

export const commonAPI = {
  searchAll(value) {
    if (value) {
      return apiHelper.get(`/search?q=${value}`);
    }
    return apiHelper.get(`/search`);
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
      return await axios.post<{url: string}>(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      )
    } catch (error) {
      console.error(error)
    }
  },
}
