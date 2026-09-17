import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { Card } from "../shared/Card";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Share2,
  File,
} from "lucide-react";
import { PreviewModal } from "../shared/PreviewModal";
import { toast } from "../../utils/toast";

export const PublicProfileDesktop = ({
  user,
  links,
  onClickonLink,
  showcaseItems,
  updates,
}) => {
  const [previewItem, setPreviewItem] = useState(null);

  const updatesRef = useRef(null);
  const showcaseRef = useRef(null);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8;
      ref.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`min-h-screen bg-bg-primary text-text-primary font-sans p-8`}
      data-theme={user.theme}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <header className="flex justify-between items-center py-6 border-b border-brand-primary/10">
          <div className="flex items-center gap-4">
            {user.profileimage ? (
              <img
                src={user.profileimage}
                alt={user.name}
                className="w-20 aspect-square rounded-full object-cover border-2 border-brand-primary/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center text-xl font-bold text-brand-primary">
                {user.name?.[0] || "U"}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-brand-primary m-0 p-0 leading-tight">
                {user.name}
              </h1>
              <p className="text-lg text-text-primary/70 mb-1">
                {user.worktitle}
              </p>
              {user.bio && (
                <p className="text-sm text-text-primary/80 max-w-md leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 rounded-full transition-colors flex items-center gap-2 font-bold"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast("Profile link copied to clipboard!");
              }}
              title="Share Profile"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
        </header>

        {/* Updates */}
        {updates && updates.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-100">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-brand-primary m-0">
                Updates
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollContainer(updatesRef, "prev")}
                  className="p-2 rounded-full border border-brand-primary/20 hover:bg-brand-primary/5 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollContainer(updatesRef, "next")}
                  className="p-2 rounded-full border border-brand-primary/20 hover:bg-brand-primary/5 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div
              ref={updatesRef}
              className="flex gap-6 overflow-x-auto hide-scrollbar snap-x scroll-smooth pb-4 pt-4 -mt-4"
            >
              {updates.map((update) => (
                <Card
                  key={update.id}
                  className="flex-1 min-w-[320px] max-w-[350px] shrink-0 snap-start h-48 flex flex-col bg-gradient-to-br from-brand-primary/5 to-bg-primary rounded-3xl border-[3px] border-brand-accent/20 shadow-xl cursor-pointer hover:border-brand-accent hover:-translate-y-1 transition-all duration-300 overflow-hidden"
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
                    <div className="h-24 bg-brand-primary/5 w-full overflow-hidden">
                      <img
                        src={update.img_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 grow flex flex-col justify-between">
                    <p className="text-sm line-clamp-5 text-ellipsis text-text-primary">
                      {update.content}
                    </p>
                    <span className="text-xs text-text-primary/50 mt-2">
                      {new Date(update.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Featured Work / Achievements */}
        {showcaseItems && showcaseItems.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-200">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-brand-primary m-0">
                Featured Work
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollContainer(showcaseRef, "prev")}
                  className="p-2 rounded-full border border-brand-primary/20 hover:bg-brand-primary/5 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollContainer(showcaseRef, "next")}
                  className="p-2 rounded-full border border-brand-primary/20 hover:bg-brand-primary/5 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div
              ref={showcaseRef}
              className="flex gap-6 overflow-x-auto hide-scrollbar snap-x scroll-smooth pb-6 pt-4 -mt-4"
            >
              {showcaseItems.map((item) => (
                <Card
                  key={item.id}
                  className="flex-1 min-w-[420px] max-w-[500px] shrink-0 snap-start flex flex-col relative overflow-hidden rounded-3xl border-[3px] border-brand-accent/20 bg-gradient-to-br from-brand-accent/10 to-bg-primary shadow-xl cursor-pointer hover:border-brand-accent hover:-translate-y-1 transition-all duration-300 group"
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
                  <div className="absolute top-4 right-4 bg-brand-accent text-bg-primary text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                    Featured
                  </div>
                  {item.url && !item.url.endsWith(".pdf") ? (
                    <div className="h-64 bg-brand-primary/10 w-full overflow-hidden flex items-center justify-center relative">
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                      <span className="hidden text-brand-primary/30 font-mono text-sm absolute">
                        {item.filetype} preview
                      </span>
                    </div>
                  ) : (
                    <div className="h-64 bg-brand-primary/10 flex items-center justify-center overflow-hidden">
                      <File
                        size={64}
                        className="text-brand-primary/30 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="bg-brand-primary text-bg-primary text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.filetype}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-brand-primary mb-2 flex items-center justify-between">
                      <span className="truncate pr-4">{item.file_title}</span>
                      {item.link_url && (
                        <a
                          href={item.link_url}
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-accent hover:opacity-80 shrink-0"
                        >
                          <ExternalLink size={24} />
                        </a>
                      )}
                    </h3>
                    <p className="text-text-primary/80 truncate text-lg">
                      {item.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Links */}
        {links && links.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-300">
            <h2 className="text-2xl font-bold text-brand-primary mb-6 m-0">
              Links
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {links
                .sort((a, b) => a.position - b.position)
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onClickonLink(link)}
                    className="bg-gradient-to-r from-brand-primary/5 to-bg-primary border-2 border-brand-primary/10 rounded-xl p-4 flex justify-between items-center hover:border-brand-accent hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <span className="font-medium text-brand-primary">
                      {link.label}
                    </span>
                    <ExternalLink
                      size={18}
                      className="text-brand-primary/30 group-hover:text-brand-accent"
                    />
                  </a>
                ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-12 text-center border-t border-brand-primary/10 mt-8 animate-in fade-in duration-700 delay-500">
          <p className="text-sm text-text-primary/50 font-medium">
            by Threshold
          </p>
        </footer>
      </div>

      <PreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        {...previewItem}
      />
    </div>
  );
};

PublicProfileDesktop.propTypes = {
  user: PropTypes.object,
  links: PropTypes.array,
  showcaseItems: PropTypes.array,
  updates: PropTypes.array,
};
