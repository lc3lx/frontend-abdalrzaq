import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaYoutube, FaUpload, FaVideo, FaPlay, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useSocialAccounts } from "../hooks/useSocialAccounts";
import YouTubeUpload from "../components/YouTube/YouTubeUpload";
import { PageHeader, Card, Button, Badge, EmptyState, Skeleton } from "../components/ui/kit";

export default function YouTubeUploadPage() {
  const { connectedAccounts } = useSocialAccounts();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const youtubeAccount = connectedAccounts.find((a) => a.platform === "YouTube");

  const cfg = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    withCredentials: true,
  });

  useEffect(() => {
    if (youtubeAccount) fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeAccount]);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(API_BASE_URL + "/api/posts?platform=YouTube", cfg());
      setVideos(data);
    } catch (e) {
      console.error("Error fetching videos:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoDelete = async (platformPostId) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/youtube/delete/${platformPostId}`, cfg());
      fetchVideos();
      setSelectedVideo(null);
    } catch (e) {
      console.error("Error deleting video:", e);
    }
  };

  const privacyBadge = (p) =>
    p === "public" ? <Badge variant="success"><FaEye /> Public</Badge>
      : p === "private" ? <Badge variant="danger"><FaEyeSlash /> Private</Badge>
      : <Badge variant="warning"><FaEye /> Unlisted</Badge>;

  if (!youtubeAccount) {
    return (
      <div>
        <PageHeader title="YouTube Upload" />
        <EmptyState
          icon={FaYoutube}
          title="YouTube not connected"
          description="Connect your YouTube account from Integrations to upload and manage videos."
          action={<Button onClick={() => navigate("/integrations")}>Go to Integrations</Button>}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="YouTube Upload"
        subtitle={`Connected as ${youtubeAccount.displayName || "YouTube"}`}
        actions={<Button onClick={() => setShowUploadModal(true)}><FaUpload /> Upload video</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}><Skeleton style={{ width: "60%" }} /><Skeleton style={{ width: "90%", marginTop: 8 }} /></Card>
            ))
          ) : videos.length === 0 ? (
            <EmptyState icon={FaVideo} title="No videos" description="Upload your first video to get started." action={<Button onClick={() => setShowUploadModal(true)}><FaUpload /> Upload video</Button>} />
          ) : (
            videos.map((video) => (
              <motion.button
                key={video._id}
                onClick={() => setSelectedVideo(video)}
                className="ss-card ss-card-pad w-full text-left block"
                style={{ borderColor: selectedVideo?._id === video._id ? "var(--ss-accent)" : "var(--ss-border)" }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start gap-3">
                  {video.imageUrl && <img src={video.imageUrl} alt="" className="w-24 h-16 rounded-lg object-cover flex-none" />}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{video.content}</h3>
                    <p className="text-sm line-clamp-2" style={{ color: "var(--ss-text-muted)" }}>{video.description}</p>
                    <div className="mt-2">{privacyBadge(video.privacyStatus)}</div>
                  </div>
                  {video.videoUrl && (
                    <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "#ff0000" }}>
                      <FaPlay />
                    </a>
                  )}
                </div>
              </motion.button>
            ))
          )}
        </div>

        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            {selectedVideo ? (
              <motion.div key={selectedVideo._id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <Card>
                  {selectedVideo.imageUrl && <img src={selectedVideo.imageUrl} alt="" className="w-full h-40 rounded-xl object-cover mb-3" />}
                  <h3 className="font-bold">{selectedVideo.content}</h3>
                  <p className="text-sm mt-1" style={{ color: "var(--ss-text-muted)" }}>{selectedVideo.description}</p>
                  <div className="mt-3">{privacyBadge(selectedVideo.privacyStatus)}</div>
                  <div className="flex gap-2 mt-4">
                    {selectedVideo.videoUrl && (
                      <a href={selectedVideo.videoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button className="w-full"><FaPlay /> Watch</Button>
                      </a>
                    )}
                    <Button variant="ghost" className="!text-red-500" onClick={() => handleVideoDelete(selectedVideo.platformPostId)}><FaTrash /></Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <EmptyState icon={FaVideo} title="Select a video" description="Choose a video to see its details." />
            )}
          </AnimatePresence>
        </div>
      </div>

      {showUploadModal && (
        <YouTubeUpload onClose={() => setShowUploadModal(false)} onSuccess={() => { setShowUploadModal(false); fetchVideos(); }} />
      )}
    </div>
  );
}
