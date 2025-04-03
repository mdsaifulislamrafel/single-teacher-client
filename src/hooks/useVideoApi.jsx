// src/api/videoApi.js

import useAxiosPublic from "./useAxiosPublic";


const useVideoApi = () => {
  const axiosPublic = useAxiosPublic();

  const getAllVideos = async () => {
    const response = await axiosPublic.get('/videos');
    return response.data;
  };

  const deleteVideo = async (videoId) => {
    await axiosPublic.delete(`/videos/${videoId}`);
  };

  const getPlaybackInfo = async (videoId) => {
    const response = await axiosPublic.get(`/videos/${videoId}/playback`);
    return response.data;
  };

  return { getAllVideos, deleteVideo, getPlaybackInfo };
};

export default useVideoApi;