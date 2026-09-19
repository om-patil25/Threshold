import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Card } from "../shared/Card";
import { ExternalLink, Share2, File } from "lucide-react";
import { PreviewModal } from "../shared/PreviewModal";
import { handleProfileShare } from "../../utils/share";
import { motion, AnimatePresence } from "framer-motion";

export const PublicProfileMobile = ({
  user,
  links,
  onClickonLink,
  showcaseItems,
  updates,
  isPreview = false,
}) => {
  const [activeShowcase, setActiveShowcase] = useState(0);
  const [updateCycleIndex, setUpdateCycleIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const updatesIsDragging = useRef(false);
  const [previewItem, setPreviewItem] = useState(null);

  const [featuredStartX, setFeaturedStartX] = useState(null);
  const [featuredScrollLeft, setFeaturedScrollLeft] = useState(0);
  const featuredIsDragging = useRef(false);
  const featuredScrollRef = useRef(null);

  if (!user) return null;

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = offset.x;
    if (swipe < -50) {
      // swipe left (next)
      setUpdateCycleIndex((prev) => (prev + 1) % updates.length);
    } else if (swipe > 50) {
      // swipe right (prev)
      setUpdateCycleIndex(
        (prev) => (prev - 1 + updates.length) % updates.length,
      );
    }
  };

  const handleCardClick = (e, update) => {
    if (updatesIsDragging.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setPreviewItem({
      title: "Update",
      description: update.content,
      imgUrl: update.img_url,
      date: new Date(update.createdAt).toLocaleDateString(),
    });
  };

  return (
    <div
      className={`min-h-screen bg-bg-primary text-text-primary font-sans p-6 flex flex-col items-center overflow-x-hidden`}
      data-theme={user.theme}
    >
      <div className="w-full max-w-md flex flex-col gap-10">
        {/* Header */}
        <header className="flex flex-col items-center text-center mt-6 relative">
          <button
            className="absolute top-0 right-0 p-2 text-brand-primary hover:text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 rounded-full transition-colors"
            onClick={() => handleProfileShare(user)}
            title="Share Profile"
            aria-label="Share profile"
          >
            <Share2 size={20} />
          </button>
          {user.profileimage ? (
            <img
              src={user.profileimage}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-bg-primary shadow-md mb-4"
              loading="lazy"
              width={96}
              height={96}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-brand-primary/20 flex items-center justify-center text-3xl font-bold text-brand-primary border-4 border-bg-primary shadow-md mb-4">
              {user.name?.[0] || "U"}
            </div>
          )}
          <h1 className="text-2xl font-bold text-brand-primary m-0 p-0">
            {user.name}
          </h1>
          <p className="text-md text-text-primary mb-2">{user.worktitle}</p>
          {user.bio && (
            <p className="text-sm text-text-primary max-w-sm px-4 leading-relaxed">
              {user.bio}
            </p>
          )}
        </header>

        {/* Updates (Stacked Swipe) */}
        {updates && updates.length > 0 && (
          <section
            className={`w-full ${!isPreview ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-100" : ""}`}
          >
            <h2 className="text-xl font-bold text-brand-primary mb-4 m-0 flex justify-between items-center">
              Updates
              <span className="text-xs font-normal text-text-primary">
                Swipe left to view
              </span>
            </h2>
            <div className="relative w-full h-48">
              <AnimatePresence mode="popLayout">
                {updates
                  .slice(updateCycleIndex, updateCycleIndex + 3)
                  .map((update, idx) => {
                    const pos = idx; // 0 is front card
                    return (
                      <motion.div
                        key={update._id || update.id || idx}
                        drag={pos === 0 ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragStart={() => {
                          updatesIsDragging.current = true;
                        }}
                        onDragEnd={(e, info) => {
                          setTimeout(() => {
                            updatesIsDragging.current = false;
                          }, 100);
                          if (pos === 0) handleDragEnd(e, info);
                        }}
                        initial={
                          !isPreview ? { opacity: 0, scale: 0.8, y: 50 } : false
                        }
                        animate={{
                          opacity: 1 - pos * 0.15,
                          scale: 1 - pos * 0.05,
                          y: pos * 8,
                          zIndex: 10 - pos,
                        }}
                        exit={{ opacity: 0, x: -200, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="absolute w-full h-full cursor-grab active:cursor-grabbing"
                        onClick={(e) => handleCardClick(e, update)}
                      >
                        <Card className="w-full h-full flex flex-col bg-gradient-to-br from-brand-primary/5 to-bg-primary shadow-lg overflow-hidden pointer-events-none">
                          {update.img_url && (
                            <div className="h-20 bg-brand-primary/5 w-full overflow-hidden shrink-0">
                              <img
                                src={update.img_url}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                                width={320}
                                height={80}
                              />
                            </div>
                          )}
                          <div className="p-4 flex-grow flex flex-col justify-between overflow-hidden">
                            <p className="text-sm line-clamp-5 text-ellipsis text-text-primary m-0">
                              {update.content}
                            </p>
                            <span className="text-xs text-text-primary mt-2 shrink-0">
                              {new Date(update.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Featured Work */}
        {showcaseItems && showcaseItems.length > 0 && (
          <section
            className={`w-full ${!isPreview ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-200" : ""}`}
          >
            <h2 className="text-xl font-bold text-brand-primary mb-4 m-0">
              Featured Work
            </h2>
            <div
              className="w-full overflow-x-auto flex snap-x snap-mandatory gap-4 pb-4 pt-4 -mt-4 hide-scrollbar"
              ref={featuredScrollRef}
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const childWidth =
                  e.target.children[0]?.offsetWidth ||
                  e.target.clientWidth * 0.85;
                const gap = 16; // 1rem gap
                setActiveShowcase(Math.round(scrollLeft / (childWidth + gap)));
              }}
              onPointerDown={(e) => {
                if (e.pointerType !== "mouse") return;
                setFeaturedStartX(e.clientX);
                setFeaturedScrollLeft(featuredScrollRef.current.scrollLeft);
                featuredIsDragging.current = false;
                if (featuredScrollRef.current) {
                  featuredScrollRef.current.setPointerCapture(e.pointerId);
                }
              }}
              onPointerMove={(e) => {
                if (e.pointerType !== "mouse" || featuredStartX === null)
                  return;
                const distance = e.clientX - featuredStartX;
                if (Math.abs(distance) > 5) {
                  featuredIsDragging.current = true;
                  if (featuredScrollRef.current) {
                    featuredScrollRef.current.scrollLeft =
                      featuredScrollLeft - distance;
                  }
                }
              }}
              onPointerUp={(e) => {
                if (e.pointerType !== "mouse") return;
                setFeaturedStartX(null);
                if (featuredScrollRef.current) {
                  featuredScrollRef.current.releasePointerCapture(e.pointerId);
                }
                setTimeout(() => {
                  featuredIsDragging.current = false;
                }, 0);
              }}
              onPointerCancel={(e) => {
                if (e.pointerType !== "mouse") return;
                setFeaturedStartX(null);
                featuredIsDragging.current = false;
              }}
            >
              {showcaseItems.map((item, idx) => (
                <Card
                  key={item._id || item.id || idx}
                  className="w-[85%] max-w-[85%] snap-center flex flex-col flex-shrink-0 relative overflow-hidden rounded-3xl border-[3px] border-brand-accent/20 bg-gradient-to-br from-brand-accent/10 to-bg-primary shadow-xl cursor-pointer"
                  onClick={(e) => {
                    if (featuredIsDragging.current) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                    setPreviewItem({
                      title: item.file_title,
                      description: item.description,
                      imgUrl: item.url,
                      date: new Date(item.createdAt).toLocaleDateString(),
                      linkUrl: item.link_url,
                      filetype: item.filetype,
                    });
                  }}
                >
                  <div className="absolute top-3 right-3 bg-brand-accent text-bg-primary text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-md uppercase tracking-wide">
                    Featured
                  </div>
                  {item.url && !item.url.endsWith(".pdf") ? (
                    <div className="h-48 bg-brand-primary/10 w-full overflow-hidden flex items-center justify-center relative">
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={320}
                        height={192}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                      <span className="hidden text-brand-primary/30 font-mono text-xs absolute">
                        {item.filetype} preview
                      </span>
                    </div>
                  ) : (
                    <div className="h-48 bg-brand-primary/10 flex items-center justify-center overflow-hidden">
                      <File size={48} className="text-brand-primary/30" />
                    </div>
                  )}
                  <div className="p-5 overflow-hidden">
                    <div className="flex gap-2 mb-2">
                      <span className="bg-brand-primary text-bg-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.filetype}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-brand-primary mb-1 flex items-center justify-between">
                      <span className="truncate pr-2">{item.file_title}</span>
                      {item.link_url && (
                        <a
                          href={item.link_url}
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-accent hover:opacity-80 flex-shrink-0"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </h3>
                    <p className="text-text-primary text-sm truncate">
                      {item.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            {/* Dots */}
            {showcaseItems.length > 1 && (
              <div className="flex justify-center gap-2 mt-2">
                {showcaseItems.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === activeShowcase ? "bg-brand-primary" : "bg-brand-primary/20"}`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Links */}
        {links && links.length > 0 && (
          <section
            className={`w-full ${!isPreview ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-300" : ""}`}
          >
            <h2 className="text-xl font-bold text-brand-primary mb-4 m-0">
              Links
            </h2>
            <div className="flex flex-col gap-3">
              {links
                .sort((a, b) => a.position - b.position)
                .map((link, idx) => (
                  <a
                    key={link._id || link.id || idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onClickonLink(link)}
                    className="bg-gradient-to-r from-brand-primary/5 to-bg-primary border-2 border-brand-primary/10 rounded-xl p-4 flex justify-between items-center hover:border-brand-accent active:bg-brand-primary/5 transition-all w-full"
                  >
                    <span className="font-medium text-brand-primary">
                      {link.label}
                    </span>
                    <ExternalLink size={16} className="text-brand-primary/30" />
                  </a>
                ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer
          className={`py-8 text-center mt-4 border-t border-brand-primary/10 w-full ${!isPreview ? "animate-in fade-in duration-700 delay-500" : ""}`}
        >
          <p className="text-xs text-text-primary font-medium">
            by Threshold
          </p>
        </footer>
      </div>

      <PreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        {...previewItem}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  );
};

PublicProfileMobile.propTypes = {
  user: PropTypes.object,
  links: PropTypes.array,
  showcaseItems: PropTypes.array,
  updates: PropTypes.array,
};

