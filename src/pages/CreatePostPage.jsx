import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaMagic,
  FaRobot,
  FaRocket,
  FaTrash,
  FaCloudUploadAlt,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { useSocialAccounts } from "../hooks/useSocialAccounts";
import { usePosting } from "../hooks/usePosting";
import useImageUpload from "../hooks/useImageUpload";
import SubscriptionCheck from "../components/SubscriptionCheck";
import FlowBuilder from "../components/AutoReply/FlowBuilder";
import { PageHeader, Card, Button, Badge, Field } from "../components/ui/kit";

const PLATFORMS = [
  { name: "Twitter", icon: FaTwitter, serviceType: "twitter" },
  { name: "Facebook", icon: FaFacebook, serviceType: "facebook" },
  { name: "Instagram", icon: FaInstagram, serviceType: "instagram" },
  { name: "LinkedIn", icon: FaLinkedin, serviceType: "linkedin" },
  { name: "TikTok", icon: FaTiktok, serviceType: "tiktok" },
  { name: "YouTube", icon: FaYoutube, serviceType: "youtube" },
  { name: "WhatsApp", icon: FaWhatsapp, serviceType: "whatsapp" },
];

const MAX_MEDIA = 20;

export default function CreatePostPage() {
  const { connectedAccounts } = useSocialAccounts();
  const { isPosting, postingProgress, postToPlatforms } = usePosting();
  const { uploadMedia } = useImageUpload();

  const [postContent, setPostContent] = useState("");
  // media = [{ url, type: 'image'|'video', name, size, mime, previewUrl }]
  const [media, setMedia] = useState([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [whatsappTo, setWhatsappTo] = useState("");
  const [attachReplyFlow, setAttachReplyFlow] = useState(false);
  const [postReplyFlow, setPostReplyFlow] = useState(null);
  const [showFlowBuilder, setShowFlowBuilder] = useState(false);
  const [flowBuilderDraft, setFlowBuilderDraft] = useState(null);
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState(null);

  const imagesCount = media.filter((m) => m.type === "image").length;
  const videosCount = media.filter((m) => m.type === "video").length;

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-selecting the same file
    if (!files.length) return;
    setFormError("");

    const room = MAX_MEDIA - media.length;
    if (room <= 0) {
      setFormError(`You can attach up to ${MAX_MEDIA} files.`);
      return;
    }
    const toUpload = files.slice(0, room);
    if (files.length > room) {
      setFormError(`Only the first ${room} file(s) were added (max ${MAX_MEDIA}).`);
    }

    setUploadingCount((c) => c + toUpload.length);
    // Upload sequentially so progress stays sane and order is preserved.
    for (const file of toUpload) {
      try {
        const res = await uploadMedia(file);
        setMedia((prev) => [
          ...prev,
          {
            url: res.mediaUrl,
            type: res.type || (file.type.startsWith("video/") ? "video" : "image"),
            name: file.name,
            size: file.size,
            mime: file.type,
            previewUrl: URL.createObjectURL(file),
          },
        ]);
      } catch (err) {
        setFormError(`"${file.name}": ${err.message}`);
      } finally {
        setUploadingCount((c) => Math.max(0, c - 1));
      }
    }
  };

  const removeMedia = (index) =>
    setMedia((prev) => prev.filter((_, i) => i !== index));

  const togglePlatform = (name) =>
    setSelectedPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );

  const handleSelectAll = () => {
    const connected = connectedAccounts.map((a) => a.platform);
    setSelectedPlatforms(selectedPlatforms.length === connected.length ? [] : connected);
  };

  const getDefaultPostReplyFlow = () => ({
    name: postContent ? `Replies for ${postContent.slice(0, 42)}` : "Post reply flow",
    description: "Auto replies for comments on this post.",
    platform: selectedPlatforms.length === 1 ? selectedPlatforms[0] : "All",
    triggerKeywords: [],
    triggerConditions: { type: "keyword", value: "" },
    flowSteps: [
      {
        stepNumber: 1,
        stepType: "immediate_reply",
        delay: 0,
        condition: "always",
        conditionValue: "",
        replyContent: "",
        replyImage: "",
        nextStep: null,
        isEndStep: true,
      },
    ],
    settings: {
      maxRepliesPerUser: 3,
      cooldownPeriod: 24,
      workingHours: { enabled: false, startTime: "09:00", endTime: "17:00", timezone: "UTC" },
      catalog: {
        enabled: true,
        prompt: "إذا بتحب تشوف الكتالوج اكتب كتالوج أو منتجات.",
        triggerKeywords: ["كتالوج", "كاتلوج", "منتجات", "catalog", "products"],
        maxProducts: 8,
      },
    },
  });

  const openPostReplyFlowBuilder = () => {
    setFlowBuilderDraft(postReplyFlow || getDefaultPostReplyFlow());
    setShowFlowBuilder(true);
  };

  const handleSavePostReplyFlow = (flow) => {
    setPostReplyFlow({ ...flow, platform: selectedPlatforms.length === 1 ? selectedPlatforms[0] : "All" });
    setAttachReplyFlow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setResult(null);

    if (!postContent) return setFormError("Please write your post content.");
    if (selectedPlatforms.length === 0) return setFormError("Please select at least one platform.");
    if (uploadingCount > 0) return setFormError("Please wait for uploads to finish.");
    if (selectedPlatforms.includes("WhatsApp") && !whatsappTo.trim())
      return setFormError("Please enter the WhatsApp recipient phone number.");
    if (attachReplyFlow && !postReplyFlow)
      return setFormError("Please build the reply flow or turn it off before posting.");

    const images = media.filter((m) => m.type === "image").map((m) => m.url);
    const videos = media.filter((m) => m.type === "video").map((m) => m.url);
    const mediaMeta = media.map((m) => ({ kind: m.type, size: m.size, mime: m.mime }));

    try {
      const postData = {
        content: postContent,
        platforms: selectedPlatforms,
        images,
        videos,
        // Legacy single fields for backward compatibility.
        imageUrl: images[0] || null,
        videoUrl: videos[0] || null,
        mediaMeta,
        whatsappTo: whatsappTo.trim() || undefined,
        autoReplyFlow:
          attachReplyFlow && postReplyFlow
            ? { ...postReplyFlow, platform: selectedPlatforms.length === 1 ? selectedPlatforms[0] : "All" }
            : undefined,
      };
      const res = await postToPlatforms(postData);
      setResult(res);
      if (res.errors.length === 0) {
        setPostContent("");
        setMedia([]);
        setWhatsappTo("");
        setSelectedPlatforms([]);
        setAttachReplyFlow(false);
        setPostReplyFlow(null);
      }
    } catch (error) {
      setFormError(error.response?.data?.error || error.message || "Something went wrong.");
    }
  };

  const isConnected = (name) => connectedAccounts.some((a) => a.platform === name);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Create Post" subtitle="Publish across your connected platforms at once" />

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 space-y-2">
            {result.success?.length > 0 && (
              <div className="ss-card ss-card-pad flex items-start gap-3" style={{ borderColor: "var(--ss-success)" }}>
                <FaCheckCircle style={{ color: "var(--ss-success)" }} className="mt-0.5" />
                <div>
                  <p className="font-semibold">Posted to {result.success.length} platform(s)</p>
                  <p className="text-sm" style={{ color: "var(--ss-text-muted)" }}>{result.success.join(", ")}</p>
                </div>
              </div>
            )}
            {result.errors?.length > 0 && (
              <div className="ss-card ss-card-pad flex items-start gap-3" style={{ borderColor: "var(--ss-danger)" }}>
                <FaExclamationTriangle style={{ color: "var(--ss-danger)" }} className="mt-0.5" />
                <div>
                  <p className="font-semibold">Failed on {result.errors.length} platform(s)</p>
                  <p className="text-sm" style={{ color: "var(--ss-text-muted)" }}>{result.errors.join(" · ")}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Field label="Post content" required>
            <textarea
              className="ss-textarea"
              rows={5}
              placeholder="Write your post…"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </Field>

          <Field label={`Media — images & videos (up to ${MAX_MEDIA})`}>
            <label
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors"
              style={{ borderColor: "var(--ss-border)", background: "var(--ss-surface-2)" }}
            >
              <FaCloudUploadAlt className="mb-2 text-3xl" style={{ color: "var(--ss-text-faint)" }} />
              <span className="font-semibold text-sm">Click to upload images or videos</span>
              <span className="text-xs mt-0.5" style={{ color: "var(--ss-text-muted)" }}>
                You can select multiple files · PNG, JPG, MP4, MOV up to 50MB each
              </span>
              <input type="file" accept="image/*,video/*" multiple onChange={handleFileUpload} className="hidden" />
            </label>

            {(media.length > 0 || uploadingCount > 0) && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: "var(--ss-text-muted)" }}>
                  <Badge variant="accent">{imagesCount} image{imagesCount === 1 ? "" : "s"}</Badge>
                  <Badge variant="accent">{videosCount} video{videosCount === 1 ? "" : "s"}</Badge>
                  {uploadingCount > 0 && <span>Uploading {uploadingCount}…</span>}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  <AnimatePresence>
                    {media.map((m, i) => (
                      <motion.div
                        key={m.url + i}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative aspect-square overflow-hidden rounded-lg border"
                        style={{ borderColor: "var(--ss-border)" }}
                      >
                        {m.type === "video" ? (
                          <video src={m.previewUrl} className="h-full w-full object-cover" muted />
                        ) : (
                          <img src={m.previewUrl} alt={m.name} className="h-full w-full object-cover" />
                        )}
                        <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {m.type === "video" ? "VIDEO" : `#${i + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMedia(i)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-red-500"
                          aria-label="Remove media"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </motion.div>
                    ))}
                    {uploadingCount > 0 &&
                      Array.from({ length: uploadingCount }).map((_, i) => (
                        <div key={`u${i}`} className="ss-skeleton aspect-square rounded-lg" />
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </Field>
        </Card>

        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="ss-label !mb-0">Select platforms</label>
            <Button type="button" variant="ghost" onClick={handleSelectAll}>
              {selectedPlatforms.length === connectedAccounts.length && connectedAccounts.length > 0
                ? "Unselect all"
                : "Select all connected"}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORMS.map(({ name, icon: Icon, serviceType }) => {
              const connected = isConnected(name);
              const selected = selectedPlatforms.includes(name);
              return (
                <SubscriptionCheck key={name} serviceType={serviceType}>
                  <button
                    type="button"
                    disabled={!connected || isPosting}
                    onClick={() => togglePlatform(name)}
                    className="flex items-center gap-2 rounded-xl border-2 p-3 transition-all text-left"
                    style={{
                      borderColor: selected ? "var(--ss-accent)" : "var(--ss-border)",
                      background: selected ? "var(--ss-accent-soft)" : "var(--ss-surface)",
                      opacity: connected ? 1 : 0.5,
                      cursor: connected ? "pointer" : "not-allowed",
                    }}
                  >
                    <Icon className="text-xl flex-none" />
                    <span className="font-semibold text-sm truncate">{name}</span>
                  </button>
                </SubscriptionCheck>
              );
            })}
          </div>

          {selectedPlatforms.includes("WhatsApp") && (
            <div className="mt-4">
              <Field label="WhatsApp recipient" required>
                <input
                  className="ss-input"
                  type="tel"
                  value={whatsappTo}
                  onChange={(e) => setWhatsappTo(e.target.value)}
                  placeholder="e.g. 9639xxxxxxxx"
                />
              </Field>
            </div>
          )}
        </Card>

        <Card className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl" style={{ background: "var(--ss-accent-soft)", color: "var(--ss-accent)" }}>
                <FaRobot />
              </span>
              <div>
                <h3 className="font-bold">Reply flow for this post</h3>
                <p className="text-sm mt-0.5" style={{ color: "var(--ss-text-muted)" }}>
                  Auto-replies to comments &amp; related messages for this post only.
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attachReplyFlow}
                onChange={(e) => {
                  setAttachReplyFlow(e.target.checked);
                  if (e.target.checked && !postReplyFlow) openPostReplyFlowBuilder();
                }}
                className="h-4 w-4"
              />
              <span className="text-sm font-semibold">Enable</span>
            </label>
          </div>

          {attachReplyFlow && (
            <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--ss-border)", background: "var(--ss-surface-2)" }}>
              {postReplyFlow ? (
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold">{postReplyFlow.name}</span>
                      <Badge variant="accent">{postReplyFlow.flowSteps?.length || 0} steps</Badge>
                    </div>
                    <p className="mt-1 text-sm" style={{ color: "var(--ss-text-muted)" }}>
                      {postReplyFlow.triggerKeywords?.length
                        ? `Keywords: ${postReplyFlow.triggerKeywords.join(", ")}`
                        : "Runs on every comment & related message for this post."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" onClick={openPostReplyFlowBuilder}><FaEdit /> Edit</Button>
                    <Button type="button" variant="ghost" className="!text-red-500" onClick={() => { setPostReplyFlow(null); setAttachReplyFlow(false); }}><FaTrash /> Remove</Button>
                  </div>
                </div>
              ) : (
                <Button type="button" onClick={openPostReplyFlowBuilder}><FaMagic /> Build reply flow</Button>
              )}
            </div>
          )}
        </Card>

        {formError && <div className="ss-error mb-3">{formError}</div>}

        <div className="flex justify-center">
          <Button type="submit" className="!px-10 !py-3 !text-base" loading={isPosting} disabled={!postContent || selectedPlatforms.length === 0 || uploadingCount > 0}>
            <FaRocket />
            {isPosting
              ? postingProgress || "Posting…"
              : `Post to ${selectedPlatforms.length} platform${selectedPlatforms.length === 1 ? "" : "s"}`}
          </Button>
        </div>
      </form>

      <FlowBuilder
        isOpen={showFlowBuilder}
        onClose={() => setShowFlowBuilder(false)}
        onSave={handleSavePostReplyFlow}
        editingFlow={flowBuilderDraft}
        draftMode
        title="Post Reply Flow"
        saveLabel={postReplyFlow ? "Update Attached Flow" : "Attach Flow"}
      />
    </div>
  );
}
