import { useState, useRef } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Input } from "../shared/Input";
import { Edit2, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import {
  createUpdate,
  patchUpdate,
  deleteUpdate,
} from "../../service/updatesServices";
import { toast } from "../../utils/toast";
import { Loader } from "../shared/Loader";
import { ConfirmModal } from "../shared/ConfirmModal";
import { PreviewModal } from "../shared/PreviewModal";

export const UpdatesEditor = () => {
  const { updates, refreshData } = useDashboard();
  const [showForm, setShowForm] = useState(false);
  const initialFormData = {
    content: "",
    img_url: "",
    file: null,
  };
  const [editFormData, setEditFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const fileInputRef = useRef(null);

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
        img_url: URL.createObjectURL(file),
      }));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await deleteUpdate(deleteId);
      toast("Update deleted successfully");
      refreshData();
    } catch (e) {
      toast(e.message || "Failed to delete update");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (update) => {
    setIsEditing(update.id);
    setEditFormData({
      content: update.content || "",
      img_url: update.img_url || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = () => {
    const newErrors = {};
    if (!editFormData.content.trim()) newErrors.content = "Update content cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setIsSaving(true);
      const formData = new FormData();

      formData.append("content", editFormData.content);
      formData.append("updateimage", editFormData.file);

      if (isEditing) {
        await patchUpdate(isEditing, formData);
        toast("Update saved successfully");
      } else {
        await createUpdate(formData);
        toast("Update created successfully");
      }
      setShowForm(false);
      setIsEditing(null);
      setEditFormData({ content: "", img_url: "" });
      setErrors({});
      refreshData();
    } catch (error) {
      console.error("update save error" + error);
      toast(error.message || (isEditing ? "Failed to Edit Update" : "Failed to save Update"));
    } finally {
      setIsSaving(false);
    }
  };
  const EditorContent = (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">
            Edit Updates
          </h1>
          <p className="text-sm text-brand-primary/60 font-medium">
            Updates are auto-deleted after 15 days.
          </p>
        </div>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setIsEditing(null);
              setEditFormData({ content: "", img_url: "" });
            } else {
              setIsEditing(null);
              setEditFormData({ content: "", img_url: "" });
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
              {isEditing ? "Edit Update" : "Post an Update"}
            </h2>
            <div className="flex flex-col gap-4">
              <Input 
                as="textarea"
                label="What's new?"
                rows="4"
                value={editFormData.content}
                onChange={(e) => {
                  setEditFormData({...editFormData, content: e.target.value});
                  if (errors.content) setErrors({...errors, content: null});
                }}
                placeholder="Share your latest project, thought, or milestone..."
                error={errors.content}
              />
              <div>
                <label className="block text-sm font-medium text-brand-primary/70 mb-1">
                  Attach Image (Optional, Max 3MB)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div
                  className="w-full h-32 border-2 border-dashed border-brand-primary/20 rounded-lg flex flex-col items-center justify-center text-brand-primary/50 hover:bg-brand-primary/5 transition-colors cursor-pointer relative overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {editFormData?.img_url ? (
                    <img
                      src={editFormData.img_url}
                      alt="Preview"
                      className="w-full h-full object-cover opacity-50"
                    />
                  ) : (
                    <>
                      <ImageIcon size={24} className="mb-2" />
                      <span className="text-sm">Click to upload image</span>
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
                    setEditFormData({ content: "", img_url: "" });
                    setErrors({});
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
                    "Update Post"
                  ) : (
                    "Post Update"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {updates.length === 0 ? (
          <div className="text-center py-12 px-6 text-brand-primary/60 bg-white rounded-xl border-2 border-dashed border-brand-primary/10 shadow-sm flex flex-col items-center justify-center">
            <p className="mb-4">You haven't posted any updates yet.</p>
            <Button variant="outline" onClick={() => setShowForm(true)}>
              Post your first update
            </Button>
          </div>
        ) : (
          updates.map((update) => (
            <Card
              key={update.id}
              className="p-4 flex gap-4 items-start cursor-pointer hover:border-brand-accent/30 transition-colors"
              onClick={() =>
                setPreviewItem({
                  title: "Update",
                  description: update.content,
                  imgUrl: update.img_url,
                  date: new Date(update.createdAt).toLocaleDateString(),
                })
              }
            >
              {update.img_url && (
                <div className="w-20 h-20 bg-brand-primary/10 rounded-lg shrink-0 flex items-center justify-center text-xs text-brand-primary/50 overflow-hidden">
                  <img src={update.img_url} alt="updateimage" />
                </div>
              )}
              <div className="grow">
                <p className="text-text-primary text-sm mb-2 line-clamp-3 text-ellipsis">
                  {update.content}
                </p>
                <span className="text-xs text-text-primary/50">
                  {new Date(update.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col gap-2 shrink-0 z-10">
                <button
                  className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(update);
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(update.id);
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
        title="Delete Update"
        message="Are you sure you want to delete this update? This action cannot be undone."
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
    <DashboardLayout previewUpdates={updates}>{EditorContent}</DashboardLayout>
  );
};
