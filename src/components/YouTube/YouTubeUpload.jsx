import { useState } from "react";
import {
  FaYoutube,
  FaUpload,
  FaVideo,
  FaFileVideo,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";

const YouTubeUpload = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    privacyStatus: "private",
  });
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        alert("حجم الفيديو يجب أن يكون أقل من 100 ميجابايت");
        return;
      }

      // Check file type
      const allowedTypes = [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/webm",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("نوع الملف غير مدعوم. يرجى اختيار ملف فيديو صالح");
        return;
      }

      setVideoFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);

      // Auto-fill title if empty
      if (!formData.title) {
        setFormData((prev) => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpload = async () => {
    if (!videoFile || !formData.title) {
      alert("يرجى اختيار فيديو وإدخال العنوان");
      return;
    }

    try {
      setIsLoading(true);
      setStep(2);

      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("video", videoFile);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("privacyStatus", formData.privacyStatus);

      const response = await axios.post(
        "http://localhost:5000/api/youtube/upload",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      if (response.data.success) {
        setUploadedVideo(response.data);
        setStep(3);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        `خطأ في رفع الفيديو: ${error.response?.data?.error || "خطأ غير معروف"}`
      );
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaYoutube className="text-red-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                رفع فيديو على YouTube
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FaFileVideo className="text-6xl text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    اضغط لاختيار فيديو
                  </p>
                  <p className="text-sm text-gray-500">
                    MP4, AVI, MOV, WMV, FLV, WebM (حد أقصى 100 ميجابايت)
                  </p>
                </label>
              </div>

              {/* Video Preview */}
              {videoPreview && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    معاينة الفيديو:
                  </h3>
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    {videoFile.name} ({formatFileSize(videoFile.size)})
                  </p>
                </div>
              )}

              {/* Video Details Form */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">تفاصيل الفيديو:</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان الفيديو *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="أدخل عنوان الفيديو"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.title.length}/100 حرف
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الفيديو
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="أدخل وصف الفيديو"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    maxLength={5000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/5000 حرف
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العلامات (Tags)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="علامة1, علامة2, علامة3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    افصل بين العلامات بفاصلة
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    حالة الخصوصية
                  </label>
                  <select
                    name="privacyStatus"
                    value={formData.privacyStatus}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="private">خاص</option>
                    <option value="unlisted">غير مدرج</option>
                    <option value="public">عام</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!videoFile || !formData.title || isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <FaUpload className="mr-2" />
                      رفع الفيديو
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <FaSpinner className="text-6xl text-red-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  جاري رفع الفيديو...
                </h3>
                <p className="text-gray-600 mb-4">
                  يرجى الانتظار، قد يستغرق هذا بعض الوقت حسب حجم الفيديو
                </p>

                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-red-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{uploadProgress}%</p>
              </div>
            </div>
          )}

          {step === 3 && uploadedVideo && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 text-lg mr-2" />
                  <h4 className="font-semibold text-green-800">
                    تم رفع الفيديو بنجاح!
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold text-gray-800 mb-3">
                  تفاصيل الفيديو:
                </h5>
                <div className="space-y-2">
                  <p>
                    <strong>العنوان:</strong> {uploadedVideo.title}
                  </p>
                  <p>
                    <strong>معرف الفيديو:</strong> {uploadedVideo.videoId}
                  </p>
                  <p>
                    <strong>الرابط:</strong>
                    <a
                      href={uploadedVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline ml-2"
                    >
                      {uploadedVideo.videoUrl}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  رفع فيديو آخر
                </button>
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  تم الانتهاء
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeUpload;
