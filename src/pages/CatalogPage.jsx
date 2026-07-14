import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaImages, FaPlus, FaSave, FaBoxOpen, FaTimes, FaTrash } from "react-icons/fa";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import useImageUpload from "../hooks/useImageUpload";
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Field,
  EmptyState,
  SkeletonCard,
} from "../components/ui/kit";

const emptyProduct = { name: "", price: "", images: [], isActive: true };

export default function CatalogPage() {
  const { uploadImages, isUploading, uploadProgress } = useImageUpload();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const cfg = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    withCredentials: true,
  });

  const resolveMediaUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const { data } = await axios.get(API_ENDPOINTS.catalogProducts, cfg());
      setProducts(data);
    } catch (e) {
      setError("Failed to load catalog products.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    try {
      const result = await uploadImages(files);
      const urls = result.images.map((i) => i.imageUrl);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls].slice(0, 6) }));
    } catch (e) {
      setFormError(e.message || "Image upload failed.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!formData.name.trim() || !formData.price.trim()) {
      setFormError("Product name and price are required.");
      return;
    }
    try {
      setIsSaving(true);
      const payload = {
        name: formData.name.trim(),
        price: formData.price.trim(),
        images: formData.images,
        isActive: formData.isActive,
      };
      if (editingId) {
        const { data } = await axios.put(API_ENDPOINTS.catalogProduct(editingId), payload, cfg());
        setProducts((prev) => prev.map((p) => (p._id === editingId ? data : p)));
      } else {
        const { data } = await axios.post(API_ENDPOINTS.catalogProducts, payload, cfg());
        setProducts((prev) => [data, ...prev]);
      }
      setFormData(emptyProduct);
      setEditingId(null);
    } catch (e) {
      setFormError(e.response?.data?.error || "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormError("");
    setFormData({
      name: product.name,
      price: product.price,
      images: product.images || [],
      isActive: product.isActive !== false,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyProduct);
    setFormError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product from the catalog?")) return;
    try {
      await axios.delete(API_ENDPOINTS.catalogProduct(id), cfg());
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to delete product.");
    }
  };

  const handleToggle = async (product) => {
    try {
      const { data } = await axios.patch(
        API_ENDPOINTS.toggleCatalogProduct(product._id),
        { isActive: !product.isActive },
        cfg()
      );
      setProducts((prev) => prev.map((p) => (p._id === product._id ? data : p)));
    } catch (e) {
      setError(e.response?.data?.error || "Failed to update product.");
    }
  };

  const removeImage = (url) =>
    setFormData((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }));

  const activeCount = products.filter((p) => p.isActive).length;

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Products that auto-reply flows can show to customers"
        actions={<Badge variant="accent">{activeCount} active</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? "Edit product" : "New product"}</h2>
              {editingId && (
                <Button type="button" variant="ghost" className="!px-2.5" onClick={handleCancelEdit}>
                  <FaTimes />
                </Button>
              )}
            </div>

            <Field label="Product name" required>
              <input
                className="ss-input"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Classic hoodie"
              />
            </Field>

            <Field label="Price" required>
              <input
                className="ss-input"
                value={formData.price}
                onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                placeholder="$29"
              />
            </Field>

            <Field label="Images (up to 6)">
              <label
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors"
                style={{ borderColor: "var(--ss-border)", background: "var(--ss-surface-2)" }}
              >
                <FaImages className="mb-2 text-2xl" style={{ color: "var(--ss-text-faint)" }} />
                <span className="font-semibold text-sm">Upload product images</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {isUploading && (
                <div className="mt-3">
                  <div className="h-2 rounded-full" style={{ background: "var(--ss-surface-2)" }}>
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ background: "var(--ss-accent)" }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "var(--ss-text-muted)" }}>Uploading {uploadProgress}%</p>
                </div>
              )}

              {formData.images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {formData.images.map((img) => (
                    <div key={img} className="relative aspect-square overflow-hidden rounded-lg border" style={{ borderColor: "var(--ss-border)" }}>
                      <img src={resolveMediaUrl(img)} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-red-500"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>

            <label className="flex items-center gap-3 rounded-xl border p-3 mb-4" style={{ borderColor: "var(--ss-border)" }}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">Show in auto-reply catalog</span>
            </label>

            {formError && <div className="ss-error mb-3">{formError}</div>}

            <Button type="submit" className="w-full" loading={isSaving} disabled={isUploading}>
              {editingId ? <FaSave /> : <FaPlus />}
              {editingId ? "Update product" : "Add product"}
            </Button>
          </Card>
        </form>

        {/* List */}
        <div>
          {error && (
            <div className="ss-card ss-card-pad mb-4" style={{ borderColor: "var(--ss-danger)" }}>
              <span style={{ color: "var(--ss-danger)" }}>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={FaBoxOpen}
              title="No products yet"
              description="Add your first product so automation flows can share your catalog."
            />
          ) : (
            <motion.div
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            >
              <AnimatePresence>
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="ss-card overflow-hidden"
                    style={{ opacity: product.isActive ? 1 : 0.6 }}
                  >
                    <div className="aspect-[4/3]" style={{ background: "var(--ss-surface-2)" }}>
                      {product.images?.[0] ? (
                        <img src={resolveMediaUrl(product.images[0])} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center" style={{ color: "var(--ss-text-faint)" }}>
                          <FaImages className="text-4xl" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0">
                          <h3 className="font-bold truncate">{product.name}</h3>
                          <p className="text-sm font-semibold" style={{ color: "var(--ss-accent)" }}>{product.price}</p>
                        </div>
                        <Badge>{product.images?.length || 0} photos</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" onClick={() => handleEdit(product)}><FaEdit /> Edit</Button>
                        <Button variant="ghost" onClick={() => handleToggle(product)}>{product.isActive ? "Hide" : "Show"}</Button>
                        <Button variant="ghost" onClick={() => handleDelete(product._id)} className="!text-red-500"><FaTrash /></Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
