import { useState } from "react";
import { FaTimes, FaPaperclip, FaImage } from "react-icons/fa";
import useImageUpload from "../../hooks/useImageUpload";

const ReplyModal = ({ isOpen, onClose, onReply, message, isLoading }) => {
  const {
    uploadMedia,
    isUploading: isImageUploading,
    uploadProgress: imageUploadProgress,
  } = useImageUpload();
  const [replyContent, setReplyContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        setImageUrl(previewUrl);
        setImageFile(file);

        // Upload to server
        const result = await uploadMedia(file);
        setImageUrl(result.mediaUrl); // Replace preview with server URL
      } catch (error) {
        console.error("Upload error:", error);
        alert(`خطأ في رفع الصورة: ${error.message}`);
        setImageUrl(null);
        setImageFile(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    onReply(replyContent, imageUrl);
    setReplyContent("");
    setImageUrl(null);
    setImageFile(null);
  };

  const handleClose = () => {
    setReplyContent("");
    setImageUrl(null);
    setImageFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Reply to Message
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          {/* Original Message */}
          {message && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm text-gray-600">
                  Replying to:
                </span>
                <span className="text-sm text-gray-800">
                  {message.senderName}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">
                {message.content}
              </p>
            </div>
          )}

          {/* Reply Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Type your reply here..."
                required
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="reply-image-upload"
                />
                <label
                  htmlFor="reply-image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FaImage className="text-gray-400 text-2xl mb-2" />
                  <p className="text-sm text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, MP4 up to 50MB
                  </p>
                </label>
              </div>
              {imageUrl && (
                <div className="mt-3">
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Reply attachment"
                      className="max-w-xs rounded-lg shadow-md"
                    />
                    {isImageUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-sm mb-2">جاري الرفع...</div>
                          <div className="w-24 bg-gray-300 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${imageUploadProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1">
                            {imageUploadProgress}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(null);
                      setImageFile(null);
                    }}
                    className="mt-2 text-red-600 text-sm hover:text-red-800"
                    disabled={isImageUploading}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                disabled={!replyContent.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperclip />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
