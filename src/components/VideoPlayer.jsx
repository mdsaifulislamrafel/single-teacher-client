import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [nextVideo, setNextVideo] = useState(null);

  useEffect(() => {
    // TODO: Fetch video details from API
    setVideo({
      id: videoId,
      title: 'ভিডিও ১',
      url: 'https://example.com/video.mp4',
      description: 'ভিডিও বর্ণনা এখানে থাকবে।',
    });
    setNextVideo({
      id: parseInt(videoId) + 1,
      title: 'পরবর্তী ভিডিও',
    });
  }, [videoId]);

  const handleVideoComplete = () => {
    // TODO: Mark video as completed in API
    if (nextVideo) {
      navigate(`/video/${nextVideo.id}`);
    }
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black aspect-video rounded-lg mb-6">
        {/* Replace with actual video player component */}
        <div className="w-full h-full flex items-center justify-center text-white">
          Video Player Here
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
        <p className="text-gray-600 mb-6">{video.description}</p>
        <div className="flex justify-between items-center">
          <button
            onClick={handleVideoComplete}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            ভিডিও সম্পন্ন করুন
          </button>
          {nextVideo && (
            <button
              onClick={() => navigate(`/video/${nextVideo.id}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              পরবর্তী ভিডিও &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;