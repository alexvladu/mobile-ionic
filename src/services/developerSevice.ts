import axiosInstance from "../interceptors/authInterceptor";

export const uploadDeveloperPhoto = async (imageData: string, id:number) => {
  try {
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('avatar', blob, 'avatar.jpg');
    
    const result = await axiosInstance.post(`/developers/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return result.data;
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload avatar');
  }
};