import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaUsers,
  FaRocket,
  FaClock,
} from "react-icons/fa";
import axios from "axios";

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://www.sushiluha.com/api/packages/admin/all",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setPackages(response.data.packages);
    } catch (err) {
      console.error("Error fetching packages:", err);
      if (err.response?.status === 403) {
        navigate("/dashboard");
      } else {
        setError("فشل في تحميل الباقات");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (packageId, isActive) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://www.sushiluha.com/api/packages/admin/${packageId}`,
        { isActive: !isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchPackages();
    } catch (err) {
      console.error("Error toggling package:", err);
      setError("فشل في تحديث حالة الباقة");
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (
      !window.confirm(
        "هل أنت متأكد من حذف هذه الباقة؟ لا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://www.sushiluha.com/api/packages/admin/${packageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchPackages();
    } catch (err) {
      console.error("Error deleting package:", err);
      setError("فشل في حذف الباقة");
    }
  };

  const handleCreatePackage = async (packageData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://www.sushiluha.com/api/packages/admin/create",
        packageData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setShowCreateModal(false);
      fetchPackages();
    } catch (err) {
      console.error("Error creating package:", err);
      setError("فشل في إنشاء الباقة");
    }
  };

  const handleUpdatePackage = async (packageId, packageData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://www.sushiluha.com/api/packages/admin/${packageId}`,
        packageData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setShowEditModal(false);
      fetchPackages();
    } catch (err) {
      console.error("Error updating package:", err);
      setError("فشل في تحديث الباقة");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-right">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="group flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-300"
              >
                <FaArrowLeft className="group-hover:scale-110 transition-transform" />
                العودة للوحة التحكم
              </button>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                إدارة الباقات
              </h1>
              <p className="text-gray-600 text-lg">
                إنشاء وتعديل باقات الخدمات المتاحة للمستخدمين
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <button
                onClick={() => setShowCreateModal(true)}
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="text-lg group-hover:scale-110 transition-transform" />
                <span className="font-semibold">إضافة باقة جديدة</span>
              </button>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={`group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                pkg.isPopular ? "ring-4 ring-purple-300 ring-opacity-50" : ""
              }`}
            >
              {/* Package Header */}
              <div
                className={`relative p-8 text-center ${
                  pkg.isActive
                    ? pkg.isPopular
                      ? "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white"
                      : "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white"
                    : "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FaStar className="text-sm" />
                    الأكثر شعبية
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{pkg.nameAr}</h3>
                <p className="text-sm opacity-90 mb-4">{pkg.descriptionAr}</p>
                <div className="text-4xl font-bold mb-2">${pkg.price}</div>
                <p className="text-sm opacity-90">لمدة {pkg.duration} يوم</p>
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                      pkg.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {pkg.isActive ? (
                      <FaCheck className="text-sm" />
                    ) : (
                      <FaTimes className="text-sm" />
                    )}
                    {pkg.isActive ? "نشط" : "غير نشط"}
                  </span>
                </div>
              </div>

              {/* Package Info */}
              <div className="p-6">
                {/* Services Count */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <FaRocket className="text-blue-600 mx-auto mb-2 text-xl" />
                    <p className="text-sm text-gray-600 font-medium">الخدمات</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {pkg.services.length}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <FaUsers className="text-green-600 mx-auto mb-2 text-xl" />
                    <p className="text-sm text-gray-600 font-medium">حسابات</p>
                    <p className="text-2xl font-bold text-green-600">
                      {pkg.maxAccounts}
                    </p>
                  </div>
                </div>

                {/* Services List */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 text-lg">
                    الخدمات:
                  </h4>
                  <div className="space-y-2">
                    {pkg.services.slice(0, 3).map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {service.nameAr}
                      </div>
                    ))}
                    {pkg.services.length > 3 && (
                      <div className="text-sm text-gray-500 font-medium">
                        +{pkg.services.length - 3} خدمات أخرى
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setShowEditModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg hover:shadow-xl"
                >
                  <FaEdit className="text-sm" />
                  تعديل
                </button>
                <button
                  onClick={() => handleToggleActive(pkg._id, pkg.isActive)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg hover:shadow-xl"
                  title={pkg.isActive ? "إلغاء تفعيل" : "تفعيل"}
                >
                  {pkg.isActive ? (
                    <FaEyeSlash className="text-sm" />
                  ) : (
                    <FaEye className="text-sm" />
                  )}
                </button>
                <button
                  onClick={() => handleDeletePackage(pkg._id)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg hover:shadow-xl"
                  title="حذف"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Package Modal */}
        {showCreateModal && (
          <PackageModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreatePackage}
          />
        )}

        {/* Edit Package Modal */}
        {showEditModal && selectedPackage && (
          <PackageModal
            package={selectedPackage}
            onClose={() => setShowEditModal(false)}
            onSave={(data) => handleUpdatePackage(selectedPackage._id, data)}
            isEdit={true}
          />
        )}
      </div>
    </div>
  );
};

// Package Modal Component
const PackageModal = ({ package: pkg, onClose, onSave, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: pkg?.name || "",
    nameAr: pkg?.nameAr || "",
    description: pkg?.description || "",
    descriptionAr: pkg?.descriptionAr || "",
    price: pkg?.price || 0,
    duration: pkg?.duration || 30,
    isActive: pkg?.isActive ?? true,
    isPopular: pkg?.isPopular ?? false,
    sortOrder: pkg?.sortOrder || 0,
    maxAccounts: pkg?.maxAccounts || 1,
    maxPostsPerDay: pkg?.maxPostsPerDay || 10,
    maxAutoReplies: pkg?.maxAutoReplies || 100,
    priority: pkg?.priority || "medium",
    services: pkg?.services || [],
    features: pkg?.features || [],
  });

  const availableServices = [
    { type: "facebook", name: "Facebook", nameAr: "فيسبوك" },
    { type: "instagram", name: "Instagram", nameAr: "إنستغرام" },
    { type: "twitter", name: "Twitter", nameAr: "تويتر" },
    { type: "linkedin", name: "LinkedIn", nameAr: "لينكد إن" },
    { type: "tiktok", name: "TikTok", nameAr: "تيك توك" },
    { type: "youtube", name: "YouTube", nameAr: "يوتيوب" },
    { type: "auto_reply", name: "Auto Reply", nameAr: "الرد الآلي" },
    { type: "analytics", name: "Analytics", nameAr: "التحليلات" },
    { type: "scheduling", name: "Scheduling", nameAr: "جدولة المنشورات" },
    { type: "all_services", name: "All Services", nameAr: "جميع الخدمات" },
  ];

  const handleServiceToggle = (serviceType) => {
    const service = availableServices.find((s) => s.type === serviceType);
    const isSelected = formData.services.some((s) => s.type === serviceType);

    if (isSelected) {
      setFormData({
        ...formData,
        services: formData.services.filter((s) => s.type !== serviceType),
      });
    } else {
      setFormData({
        ...formData,
        services: [
          ...formData.services,
          {
            type: serviceType,
            name: service.name,
            nameAr: service.nameAr,
            enabled: true,
          },
        ],
      });
    }
  };

  const handleFeatureAdd = () => {
    setFormData({
      ...formData,
      features: [
        ...formData.features,
        {
          name: "",
          nameAr: "",
          description: "",
          descriptionAr: "",
          included: true,
        },
      ],
    });
  };

  const handleFeatureRemove = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <FaRocket className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {isEdit ? "تعديل الباقة" : "إنشاء باقة جديدة"}
            </h3>
            <p className="text-gray-600">
              {isEdit ? "قم بتعديل تفاصيل الباقة" : "أضف باقة جديدة للمستخدمين"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <h4 className="text-xl font-bold text-gray-800 mb-6">
                المعلومات الأساسية
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    اسم الباقة (إنجليزي)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    اسم الباقة (عربي)
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) =>
                      setFormData({ ...formData, nameAr: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white font-medium"
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  وصف الباقة (عربي)
                </label>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionAr: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                  required
                />
              </div>
            </div>

            {/* Price and Duration */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
              <h4 className="text-xl font-bold text-gray-800 mb-6">
                السعر والمدة
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    السعر (دولار)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    المدة (أيام)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Limits */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
              <h4 className="text-xl font-bold text-gray-800 mb-6">
                الحدود والقيود
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    عدد الحسابات
                  </label>
                  <input
                    type="number"
                    value={formData.maxAccounts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxAccounts: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 focus:bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    منشورات/يوم
                  </label>
                  <input
                    type="number"
                    value={formData.maxPostsPerDay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxPostsPerDay: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 focus:bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    ردود آلية
                  </label>
                  <input
                    type="number"
                    value={formData.maxAutoReplies}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxAutoReplies: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 focus:bg-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-100">
              <h4 className="text-xl font-bold text-gray-800 mb-6">
                الخدمات المتاحة
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableServices.map((service) => {
                  const isSelected = formData.services.some(
                    (s) => s.type === service.type
                  );
                  return (
                    <label
                      key={service.type}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        isSelected
                          ? "border-orange-500 bg-orange-100 text-orange-800"
                          : "border-gray-200 bg-white hover:bg-orange-50 hover:border-orange-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleServiceToggle(service.type)}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="font-medium">{service.nameAr}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-800">الميزات</h4>
                <button
                  type="button"
                  onClick={handleFeatureAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 font-bold"
                >
                  <FaPlus className="text-sm" />
                  إضافة ميزة
                </button>
              </div>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={feature.nameAr}
                    onChange={(e) =>
                      handleFeatureChange(index, "nameAr", e.target.value)
                    }
                    placeholder="اسم الميزة"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleFeatureRemove(index)}
                    className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 font-bold"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Settings */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="text-xl font-bold text-gray-800 mb-6">
                الإعدادات
              </h4>
              <div className="flex flex-wrap items-center gap-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-lg font-medium text-gray-700">نشط</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) =>
                      setFormData({ ...formData, isPopular: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-lg font-medium text-gray-700">
                    الأكثر شعبية
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-6 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 font-bold text-lg"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-lg hover:shadow-xl"
              >
                {isEdit ? "تحديث الباقة" : "إنشاء الباقة"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPackages;
