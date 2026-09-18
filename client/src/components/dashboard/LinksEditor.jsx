import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Input } from "../shared/Input";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import { createLink, updateLink, deleteLink } from "../../service/linkServices";
import { toast } from "../../utils/toast";
import { ConfirmModal } from "../shared/ConfirmModal";

export const LinksEditor = () => {
  const { links, setLinks, refreshData } = useDashboard();
  const [isEditing, setIsEditing] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editFormData, setEditFormData] = useState({ label: "", url: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!editFormData.label.trim()) newErrors.label = "Link Title is required";
    if (!editFormData.url.trim()) newErrors.url = "URL is required";
    else if (
      !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
        editFormData.url,
      )
    ) {
      newErrors.url = "Please enter a valid URL";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsSaving(true);
      if (isEditing) {
        await updateLink(isEditing, editFormData);
        toast("Link updated successfully");
      } else {
        await createLink({ ...editFormData, active: true });
        toast("Link created successfully");
      }
      setShowForm(false);
      setIsEditing(null);
      setEditFormData({ label: "", url: "" });
      setErrors({});
      refreshData();
    } catch (e) {
      toast(
        e.message ||
          (isEditing ? "Failed to update link" : "Failed to create link"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await deleteLink(deleteId);
      toast("Link deleted successfully");
      refreshData();
    } catch (e) {
      toast(e.message || "Failed to delete link");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const toggleActive = async (id) => {
    const link = links.find((l) => l.id === id);
    if (link) {
      try {
        await updateLink(id, { active: !link.active });
        refreshData();
      } catch (e) {
        toast(e.message || "Failed to toggle link state");
      }
    }
  };

  const handleEdit = (link) => {
    setIsEditing(link.id);
    setEditFormData({ label: link.label || "", url: link.url || "" });
    setErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const EditorContent = (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">
          Links
        </h1>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setIsEditing(null);
              setEditFormData({ label: "", url: "" });
              setErrors({});
            } else {
              setIsEditing(null);
              setEditFormData({ label: "", url: "" });
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
              {isEditing ? "Edit Link" : "Create New Link"}
            </h2>
            <div className="flex flex-col gap-4">
              <Input
                label="Link Title"
                type="text"
                value={editFormData.label}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, label: e.target.value });
                  if (errors.label) setErrors({ ...errors, label: null });
                }}
                placeholder="e.g. My Portfolio"
                error={errors.label}
              />
              <Input
                label="URL"
                type="url"
                value={editFormData.url}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, url: e.target.value });
                  if (errors.url) setErrors({ ...errors, url: null });
                }}
                placeholder="https://..."
                error={errors.url}
              />
              <div className="flex justify-end gap-3 mt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(null);
                    setEditFormData({ label: "", url: "" });
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
                  {isSaving
                    ? "Processing..."
                    : isEditing
                      ? "Update Link"
                      : "Save Link"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {links.length === 0 ? (
          <div className="text-center py-12 px-6 text-brand-primary/60 bg-white rounded-xl border-2 border-dashed border-brand-primary/10 shadow-sm flex flex-col items-center justify-center">
            <p className="mb-4">You haven't added any links yet.</p>
            <Button variant="outline" onClick={() => setShowForm(true)}>
              Create your first link
            </Button>
          </div>
        ) : (
          links.map((link, index) => (
            <Card
              key={link._id || link.id || index}
              className="p-4 flex items-center gap-4 transition-transform hover:shadow-md"
            >
              <div className="flex-grow flex flex-col gap-1 overflow-hidden">
                <span className="font-bold text-brand-primary text-sm truncate">
                  {link.label}
                </span>
                <a
                  href={link.url}
                  className="text-brand-accent text-xs hover:underline truncate w-full"
                >
                  {link.url}
                </a>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-xs font-mono text-text-primary/50 mr-4 hidden sm:block">
                  {link.click_count} clicks
                </div>
                <button
                  className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                  onClick={() => handleEdit(link)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => setDeleteId(link.id)}
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
        title="Delete Link"
        message="Are you sure you want to delete this link? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isProcessing={isDeleting}
      />
    </div>
  );

  return (
    <DashboardLayout previewLinks={links}>{EditorContent}</DashboardLayout>
  );
};
