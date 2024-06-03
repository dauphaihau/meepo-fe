import { apiHelper } from '@/lib/axios';
import axios from 'axios';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/vue-query';
import { IParamsSearchAll, IResponseGetSearchAll } from '@/types/common.ts';

export const commonService = {
  async searchAll(params: IParamsSearchAll) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] === 0 || params[key]) {
        searchParams.append(key, params[key]);
      }
    });
    const queriesString = searchParams ? `?${searchParams}` : '';
    const res = await apiHelper.get<IResponseGetSearchAll>(`/search${queriesString}`);
    return res.data;
  },
  async uploadImage(fileImage: File) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const folderName = process.env.CLOUDINARY_FOLDER_NAME;

    const formData = new FormData();
    formData.append('file', fileImage);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folderName);

    return await axios.post<{url: string }>(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
  },
};

export function useGetSearchAll(params: IParamsSearchAll) {
  return useQuery({
    queryKey: ['search-all', params],
    queryFn: () => commonService.searchAll(params),
  });
}

export function useSearchUser() {
  return useMutation({
    mutationKey: ['search-all'],
    mutationFn: (params: IParamsSearchAll) => commonService.searchAll(params),
  });
}

export function useGetSearchAllTest(params: IParamsSearchAll) {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['search-all', params],
    queryFn: ({ pageParam = 1 }) => commonService.searchAll({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
    // getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
    //   return lastPage.posts.length > 0 ? allPages.length + 1 : undefined;
    //   return allPages[0].
      return allPages.length + 1;
      // return lastPage.users.length > 0 ? allPages.length + 1 : undefined;
    },
    enabled: Boolean(params),
  });
}

export function useUploadImage() {
  return useMutation({
    mutationKey: ['upload-image'],
    mutationFn: (file: File) => commonService.uploadImage(file),
  });
}
