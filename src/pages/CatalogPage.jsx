import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaImages,
  FaPlus,
  FaSave,
  FaShoppingBag,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import useImageUpload from "../hooks/useImageUpload";

const emptyProduct = {
  name: "",
  price: "",
  images: [],
  isActive: true,
};

const CatalogPage = () => {
  const { uploadImages, isUploading, uploadProgress } = useImageUpload();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const getTokenConfig = () => ({
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
      const response = await axios.get(
        API_ENDPOINTS.catalogProducts,
        getTokenConfig()
      );
      setProducts(response.data);
    } catch (fetchError) {
      console.error("Catalog fetch error:", fetchError);
      setError("Failed to load catalog products.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      const result = await uploadImages(files);
      const uploadedUrls = result.images.map((image) => image.imageUrl);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls].slice(0, 6),
      }));
    } catch (uploadError) {
      alert(uploadError.message);
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.price.trim()) {
      alert("Product name and price are required.");
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
        const response = await axios.put(
          API_ENDPOINTS.catalogProduct(editingId),
          payload,
          getTokenConfig()
        );
        setProducts((prev) =>
          prev.map((product) =>
            product._id === editingId ? response.data : product
          )
        );
      } else {
        const response = await axios.post(
          API_ENDPOINTS.catalogProducts,
          payload,
          getTokenConfig()
        );
        setProducts((prev) => [response.data, ...prev]);
      }

      setFormData(emptyProduct);
      setEditingId(null);
    } catch (saveError) {
      console.error("Catalog save error:", saveError);
      alert(saveError.response?.data?.error || "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
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
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product from the catalog?")) return;

    try {
      await axios.delete(API_ENDPOINTS.catalogProduct(productId), getTokenConfig());
      setProducts((prev) => prev.filter((product) => product._id !== productId));
      if (editingId === productId) handleCancelEdit();
    } catch (deleteError) {
      console.error("Catalog delete error:", deleteError);
      alert(deleteError.response?.data?.error || "Failed to delete product.");
    }
  };

  const handleToggle = async (product) => {
    try {
      const response = await axios.patch(
        API_ENDPOINTS.toggleCatalogProduct(product._id),
        { isActive: !product.isActive },
        getTokenConfig()
      );
      setProducts((prev) =>
        prev.map((item) => (item._id === product._id ? response.data : item))
      );
    } catch (toggleError) {
      console.error("Catalog toggle error:", toggleError);
      alert(toggleError.response?.data?.error || "Failed to update product.");
    }
  };

  const removeImage = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image !== imageUrl),
    }));
  };

  return (
    <div className="space-y-8">
      <div className="premium-panel rounded-2xl p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400/15 text-teal-200">
                <FaShoppingBag className="text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">Catalog</h1>
                <p className="text-white/65">
                  Add products that auto-reply flows can show to customers.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white">
            <span className="text-sm text-white/60">Active products</span>
            <div className="text-2xl font-black">
              {products.filter((product) => product.isActive).length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[420px,1fr]">
        <form onSubmit={handleSubmit} className="premium-panel rounded-2xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {editingId ? "Edit Product" : "New Product"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/75">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="premium-input p-4"
                placeholder="Classic hoodie"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/75">
                Price
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                className="premium-input p-4"
                placeholder="$29 أو 250,000 ل.س"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/75">
                Images
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/[0.04] p-6 text-center hover:border-teal-300/60">
                <FaImages className="mb-3 text-3xl text-white/60" />
                <span className="font-bold text-white">Upload product images</span>
                <span className="mt-1 text-xs text-white/50">
                  Up to 6 images per product
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {isUploading && (
                <div className="mt-3">
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-teal-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-white/55">
                    Uploading {uploadProgress}%
                  </p>
                </div>
              )}

              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {formData.images.map((image) => (
                    <div key={image} className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      <img
                        src={resolveMediaUrl(image)}
                        alt={formData.name || "Product"}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-red-500"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="h-5 w-5 rounded border-white/30 bg-transparent text-teal-300 focus:ring-teal-300"
              />
              <span className="text-sm font-bold text-white">
                Show this product in auto-reply catalog
              </span>
            </label>

            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="premium-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingId ? <FaSave /> : <FaPlus />}
              {isSaving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>

        <div className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-red-100">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="premium-panel rounded-2xl p-10 text-center text-white/70">
              Loading catalog...
            </div>
          ) : products.length === 0 ? (
            <div className="premium-panel rounded-2xl p-10 text-center">
              <FaShoppingBag className="mx-auto mb-4 text-5xl text-white/35" />
              <h3 className="text-2xl font-bold text-white">No products yet</h3>
              <p className="mt-2 text-white/60">
                Add your first product so flows can send your catalog.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className={`overflow-hidden rounded-2xl border bg-white/[0.06] shadow-2xl backdrop-blur-xl ${
                    product.isActive
                      ? "border-white/10"
                      : "border-white/5 opacity-60"
                  }`}
                >
                  <div className="aspect-[4/3] bg-white/5">
                    {product.images?.[0] ? (
                      <img
                        src={resolveMediaUrl(product.images[0])}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/30">
                        <FaImages className="text-5xl" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-teal-200">{product.price}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                        {product.images?.length || 0} photos
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/20"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(product)}
                        className="rounded-lg bg-teal-400/15 px-3 py-2 text-sm font-bold text-teal-100 hover:bg-teal-400/25"
                      >
                        {product.isActive ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="flex items-center gap-2 rounded-lg bg-red-500/15 px-3 py-2 text-sm font-bold text-red-100 hover:bg-red-500/25"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
