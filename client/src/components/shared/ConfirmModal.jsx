import PropTypes from "prop-types";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      ></div>
      <div className="bg-white border border-brand-primary/10 rounded-2xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? "bg-red-50 text-red-500" : "bg-brand-primary/10 text-brand-primary"}`}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-primary mb-1">
                {title}
              </h3>
              <p className="text-sm text-brand-primary">{message}</p>
            </div>
          </div>
        </div>
        <div className="bg-bg-primary/50 px-6 py-4 flex justify-end gap-3 border-t border-brand-primary/5">
          <Button variant="ghost" onClick={onCancel} disabled={isProcessing}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className={
              isDestructive
                ? "bg-red-500 hover:bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                : ""
            }
          >
            {isProcessing ? "Processing..." : confirmText}
          </Button>
        </div>
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-2 text-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-full transition-colors disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isDestructive: PropTypes.bool,
  isProcessing: PropTypes.bool,
};

