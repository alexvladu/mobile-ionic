import axiosInstance from "../interceptors/authInterceptor";

export const uploadAvatarFile = async (imageData: string) => {
  try {
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('avatar', blob, 'avatar.jpg');
    
    const result = await axiosInstance.post('/users/avatar', formData, {
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

export const getAvatarURL = async () => {
  try {
    const apiUrl = import.meta.env.VITE_DATA_SERVICE_URL;
    const result = await axiosInstance.get('/users/avatar');
    return `${apiUrl}/public/${result.data.photoURL}`;
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload avatar');
  }
};