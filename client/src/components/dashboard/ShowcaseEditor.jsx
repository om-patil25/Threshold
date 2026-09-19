import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Input } from "../shared/Input";
import {
  Edit2,
  Trash2,
  Plus,
  File,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import {
  createShowcaseItem,
  updateShowcaseItem,
  deleteShowcaseItem,
} from "../../service/showcaseItmesServices";
import { toast } from "../../utils/toast";
import { Loader } from "../shared/Loader";
import { ConfirmModal } from "../shared/ConfirmModal";
import { PreviewModal } from "../shared/PreviewModal";

export const ShowcaseEditor = () => {
  const { showcase: showcaseItems = [], refreshData, loading } = useDashboard();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const initialForm = {
    file_title: "",
    filetype: "document",
    link_url: "",
    description: "",
    file: "",
    url: "",
  };
  const [editFormData, setEditFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrors({ ...errors, file: "File size exceeds 3MB limit" });
        return;
      }
      if (errors.file) setErrors({ ...errors, file: null });

      setEditFormData((prev) => ({
        ...prev,
        file: file,
        url: URL.createObjectURL(file),
      }));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await deleteShowcaseItem(deleteId);
      toast("Item deleted successfully");
      refreshData();
    } catch (e) {
      toast(e.message || "Failed to delete item");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(item.id);
    setEditFormData({
      file_title: item.file_title || "",
      filetype: item.filetype || "docuement",
      link_url: item.link_url || "",
      description: item.description || "",
      file: null || "",
      url: item.url || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = () => {
    const newErrors = {};
    if (!editFormData.file_title.trim()) newErrors.file_title = "Title is required";
    if (editFormData.link_url && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(editFormData.link_url)) {
      newErrors.link_url = "Please enter a valid URL";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsSaving(true);
      const formData = new FormData();

      formData.append("file_title", editFormData.file_title);
      formData.append("filetype", editFormData.filetype);
      formData.append("link_url", editFormData.link_url);
      formData.append("description", editFormData.description);

      if (editFormData.file) {
        formData.append("file", editFormData.file);
      }

      if (isEditing) {
        await updateShowcaseItem(isEditing, formData);
        toast("Item updated successfully");
      } else {
        await createShowcaseItem(formData);
        toast("Item created successfully");
      }

      setShowForm(false);
      setIsEditing(null);
      setEditFormData(initialForm);
      setErrors({});

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      refreshData();
    } catch (error) {
      console.error("Showcase save error:", error);
      toast(error.message || (isEditing ? "Failed to update item" : "Failed to create item"));
    } finally {
      setIsSaving(false);
    }
  };

  const EditorContent = (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">
          Featured Work
        </h1>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setIsEditing(null);
              setEditFormData({
                file_title: "",
                filetype: "document",
                link_url: "",
                description: "",
                url: "",
              });
            } else {
              setIsEditing(null);
              setEditFormData({
                file_title: "",
                filetype: "document",
                link_url: "",
                description: "",
                url: "",
              });
              setErrors({});
              setShowForm(true);
            }
          }}
        >
          <Plus
            size={18}
            className={`transition-transform ${showForm ? "rotate-45" : ""}`}
          />
          {showForm ? "Cancel" : "Create New"}
        </Button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${showForm ? "grid-rows-[1fr] opacity-100 mb-6" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-brand-primary mb-4">
              {isEditing ? "Edit Featured Work" : "Add Featured Work"}
            </h2>
            <div className="flex flex-col gap-4">
              <Input
                label="Title"
                type="text"
                value={editFormData.file_title}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, file_title: e.target.value });
                  if (errors.file_title) setErrors({ ...errors, file_title: null });
                }}
                placeholder="e.g. Acme Corp Redesign"
                error={errors.file_title}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-primary mb-8 md:mb-3">
                    File Type
                  </label>
                  <select
                    value={editFormData.filetype}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        filetype: e.target.value,
                      })
                    }
                    className="w-full bg-bg-primary border border-brand-primary/10 rounded-lg px-4 py-2.5 text-text-primary outline-none focus:border-brand-accent transition-colors"
                  >
                    <option value={"certification"}>Certification</option>
                    <option value={"project"}>Project</option>
                    <option value={"achievement"}>Achievement</option>
                    <option value={"document"}>Document</option>
                  </select>
                </div>
                <Input
                  label="External Link (Optional)"
                  type="url"
                  value={editFormData.link_url}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, link_url: e.target.value });
                    if (errors.link_url) setErrors({ ...errors, link_url: null });
                  }}
                  placeholder="https://..."
                  error={errors.link_url}
                />
              </div>
              <Input
                as="textarea"
                label="Description"
                rows="3"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Briefly describe this work..."
              />
              <div>
                <label className="block text-sm font-medium text-brand-primary mb-1">
                  Upload Cover/Preview (Max 3MB)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={handleFileChange}
                />
                <div
                  className="w-full h-24 border-2 border-dashed border-brand-primary/20 rounded-lg flex flex-col items-center justify-center text-brand-primary hover:bg-brand-primary/5 transition-colors cursor-pointer relative overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {editFormData?.url ? (
                    <img
                      src={editFormData.url}
                      alt="Preview"
                      className="w-full h-full object-cover opacity-50"
                    />
                  ) : (
                    <>
                      <ImageIcon size={24} className="mb-2" />
                      <span className="text-sm">Click to upload file</span>
                    </>
                  )}
                </div>
                {errors.file && (
                  <p className="text-xs font-bold text-red-500 mt-1">
                    {errors.file}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(null);
                    setEditFormData(initialForm);
                    setErrors({});

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    "Processing..."
                  ) : isEditing ? (
                    "Update Item"
                  ) : (
                    "Save Item"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div
        className={
          showcaseItems.length === 0 && !isSaving && !loading
            ? "flex flex-col"
            : "grid grid-cols-1 md:grid-cols-2 gap-6"
        }
      >
        {showcaseItems.length === 0 ? (
          isSaving || loading ? (
            <div className="py-12 flex justify-center col-span-1 md:col-span-2"><Loader size={48} showText={false} /></div>
          ) : (
            <div className="text-center py-12 px-6 text-brand-primary bg-white rounded-xl border-2 border-dashed border-brand-primary/10 shadow-sm flex flex-col items-center justify-center">
              <p className="mb-4">You haven't added any featured work yet.</p>
              <Button variant="outline" onClick={() => setShowForm(true)}>
                Add your first featured work
              </Button>
            </div>
          )
        ) : (
          showcaseItems.map((item, idx) => (
            <Card
              key={item._id || item.id || idx}
              className="p-4 flex gap-4 items-start cursor-pointer hover:border-brand-accent/30 transition-colors relative group"
              onClick={() =>
                setPreviewItem({
                  title: item.file_title,
                  description: item.description,
                  imgUrl: item.url,
                  date: new Date(item.createdAt).toLocaleDateString(),
                  linkUrl: item.link_url,
                  filetype: item.filetype,
                })
              }
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-brand-primary/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                {item.url && !item.url.endsWith(".pdf") ? (
                  <img
                    src={item.url}
                    alt="featured image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <File size={32} className="text-brand-primary/30" />
                )}
              </div>

              <div className="grow">
                <div className="text-[10px] uppercase font-bold text-brand-accent mb-2 tracking-wider">
                  {item.filetype}
                </div>
                <h3 className="font-bold text-brand-primary text-lg mb-1">
                  {item.file_title}
                </h3>
                <p className="text-sm text-text-primary line-clamp-2 mb-4">
                  {item.description}
                </p>

                {item.link_url && (
                  <div className="flex items-center gap-1 text-xs text-brand-primary">
                    <ExternalLink size={12} /> {item.link_url}
                  </div>
                )}
              </div>

              {/* Hover Actions */}
              <div className="flex flex-col gap-2 shrink-0 z-10">
                <button
                  className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(item.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Featured Item"
        message="Are you sure you want to delete this featured item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isProcessing={isDeleting}
      />

      <PreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        {...(previewItem || {})}
      />
    </div>
  );

  return (
    <DashboardLayout previewShowcase={showcaseItems}>
      {EditorContent}
    </DashboardLayout>
  );
};

