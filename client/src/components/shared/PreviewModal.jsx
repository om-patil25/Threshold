import { X, ExternalLink } from "lucide-react";
import PropTypes from "prop-types";

export const PreviewModal = ({
  isOpen,
  onClose,
  title,
  description,
  imgUrl,
  date,
  linkUrl,
  filetype,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-bg-primary text-text-primary rounded-2xl w-[90%] md:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-brand-primary/10">
          <div className="flex items-center gap-2">
            {filetype && (
              <span className="bg-brand-primary text-bg-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {filetype}
              </span>
            )}
            <h3 className="font-bold text-lg text-brand-primary">
              {title || "Preview"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-primary/10 rounded-full text-brand-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto overflow-x-hidden grow thin-scrollbar">
          {imgUrl && (
            <div className="w-full bg-brand-primary/5 border-b border-brand-primary/10">
              {imgUrl.endsWith(".pdf") ? (
                <object
                  data={imgUrl}
                  type="application/pdf"
                  className="w-full h-[60vh]"
                >
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center text-text-primary">
                    <p className="mb-4">PDF Preview not available.</p>
                    <a
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-accent underline"
                    >
                      Click here to download/view the document
                    </a>
                  </div>
                </object>
              ) : (
                <img
                  src={imgUrl}
                  alt={title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              )}
            </div>
          )}
          <div className="p-6 flex flex-col gap-4">
            <p className="text-text-primary/90 text-lg whitespace-pre-wrap">
              {description}
            </p>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-primary/10">
              {date && (
                <span className="text-sm text-text-primary">{date}</span>
              )}
              {linkUrl && (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-bg-primary rounded-lg font-bold hover:opacity-90 transition-opacity ml-auto"
                >
                  Visit Link <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .thin-scrollbar::-webkit-scrollbar { width: 4px; }
        .thin-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
        .thin-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.1) transparent; }
      `,
        }}
      />
    </div>
  );
};

PreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  imgUrl: PropTypes.string,
  date: PropTypes.string,
  linkUrl: PropTypes.string,
  filetype: PropTypes.string,
};

