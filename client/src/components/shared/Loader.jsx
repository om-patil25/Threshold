import React from "react";
import { motion } from "framer-motion";

export const Loader = ({ size = 128 }) => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <style>{`
        .loader-stage {
          --speed: 1.35s;
          --hold: 0.35s;
          --angle: -80deg;
          --glow: 0.95;
          width: 100%;
          height: 100%;
          perspective: 900px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loader-svg { width: 75%; height: 75%; overflow: visible; }
        .loader-door-anim {
          transform-box: view-box;
          transform-origin: 782px 630px;
          transform-style: preserve-3d;
          animation: doorLoop calc(var(--speed)*2 + var(--hold)*2) cubic-bezier(.76,0,.24,1) infinite;
        }
        @keyframes doorLoop {
          0%, 12% { transform: rotateY(0); }
          44%, 56% { transform: rotateY(var(--angle)); }
          88%, 100% { transform: rotateY(0); }
        }
        .loader-glow-anim {
          animation: glowLoop calc(var(--speed)*2 + var(--hold)*2) ease-in-out infinite;
        }
        @keyframes glowLoop {
          0%, 12% { opacity: 0.25; }
          44%, 56% { opacity: var(--glow); }
          88%, 100% { opacity: 0.25; }
        }
      `}</style>
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Spinning Outer Border */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-brand-primary/0 border-t-brand-primary"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.6,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* Inner Door Animation */}
        <div className="loader-stage absolute inset-0 z-10 flex items-center justify-center">
          <svg
            className="loader-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1312 1199"
          >
            <defs>
              <linearGradient id="beamGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#15102A" />
                <stop offset="0.5" stopColor="#241744" />
                <stop offset="1" stopColor="#34205B" />
              </linearGradient>

              <linearGradient id="doorGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#120D24" />
                <stop offset="1" stopColor="#34205C" />
              </linearGradient>

              <linearGradient id="openingGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFFFFF" />
                <stop offset=".42" stopColor="#E9D5FF" />
                <stop offset=".78" stopColor="#A855F7" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>

              <radialGradient id="floorGradient" cx="52%" cy="44%" r="58%">
                <stop offset="0" stopColor="#E9D5FF" stopOpacity=".95" />
                <stop offset=".38" stopColor="#C084FC" stopOpacity=".80" />
                <stop offset=".75" stopColor="#6366F1" stopOpacity=".38" />
                <stop offset="1" stopColor="#6D28D9" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="doorHalo" cx="50%" cy="45%" r="65%">
                <stop offset="0" stopColor="#C084FC" stopOpacity=".72" />
                <stop offset=".65" stopColor="#6366F1" stopOpacity=".28" />
                <stop offset="1" stopColor="#6D28D9" stopOpacity="0" />
              </radialGradient>

              <filter id="blur24" x="-40%" y="-60%" width="180%" height="220%">
                <feGaussianBlur stdDeviation="24" />
              </filter>

              <filter id="blur10" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="10" />
              </filter>

              <filter id="blur5" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>

            {/* Ambient purple light */}
            <g className="loader-glow-anim">
              <ellipse
                cx="794"
                cy="933"
                rx="395"
                ry="205"
                fill="url(#floorGradient)"
                filter="url(#blur24)"
              />
            </g>

            {/* Soft violet halo around the doorway */}
            <g className="loader-glow-anim">
              <path
                d="M545 355 L795 416 L795 846 L545 920 Z"
                fill="url(#doorHalo)"
                filter="url(#blur10)"
              />
            </g>

            {/* Main top beam */}
            <g>
              <path
                d="M190 99 L942 343 L942 509 L190 267 Z"
                fill="url(#beamGradient)"
              />
              <path
                d="M190 99 L942 343"
                stroke="#5B4A91"
                strokeWidth="2"
                opacity="0.65"
              />
            </g>

            {/* Right architectural wall / jamb */}
            <g>
              <path d="M782 414 L942 343 L942 835 L782 835 Z" fill="#171936" />
              <path
                d="M782 414 L942 343 L942 835 L782 835 Z"
                fill="url(#beamGradient)"
                opacity="0.42"
              />
            </g>

            {/* Dark upper-left reveal behind the open door */}
            <g>
              <path d="M408 327 L548 365 L367 505 Z" fill="#2A2050" />
              <path
                d="M408 327 L548 365 L367 505"
                fill="none"
                stroke="#6657A5"
                strokeWidth="2"
                opacity="0.7"
              />
            </g>

            {/* Bright threshold / interior */}
            <g>
              <path
                d="M548 365 L782 424 L782 835 L548 904 Z"
                fill="url(#openingGradient)"
              />
              <path
                d="M548 365 L782 424 L782 835 L548 904 Z"
                fill="none"
                stroke="#F3E8FF"
                strokeWidth="3"
                opacity="0.9"
              />
            </g>

            {/* Bright light edges */}
            <g fill="none">
              <path
                d="M548 365 L782 424"
                stroke="#F5F3FF"
                strokeWidth="7"
                strokeLinecap="round"
                filter="url(#blur5)"
                opacity="0.95"
              />
              <path
                d="M548 365 L548 904"
                stroke="#F5F3FF"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#blur5)"
                opacity="0.9"
              />
              <path
                d="M782 424 L782 835"
                stroke="#F5F3FF"
                strokeWidth="7"
                strokeLinecap="round"
                filter="url(#blur5)"
                opacity="0.9"
              />
              <path d="M548 365 L782 424" stroke="#E0F2FE" strokeWidth="2" />
              <path d="M548 365 L548 904" stroke="#E0F2FE" strokeWidth="2" />
              <path d="M782 424 L782 835" stroke="#E0F2FE" strokeWidth="2" />
            </g>

            {/* Floor light */}
            <g className="loader-glow-anim">
              <ellipse
                cx="806"
                cy="921"
                rx="438"
                ry="172"
                fill="url(#floorGradient)"
                filter="url(#blur10)"
              />
              <ellipse
                cx="802"
                cy="926"
                rx="340"
                ry="120"
                fill="#B98AFF"
                opacity="0.12"
                filter="url(#blur24)"
              />
            </g>

            {/* Optional crisp threshold line */}
            <g>
              <path
                d="M548 904 L782 835"
                stroke="#E0F2FE"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>

            {/* Blue/violet pillar */}
            <g style={{ filter: "url(#blur5)", opacity: 0.96 }}>
              <path
                d="M367 505 L548 365 L548 904 L367 999 Z"
                fill="url(#doorGradient)"
              />
              <path
                d="M548 365 L548 904"
                stroke="#A78BFA"
                strokeWidth="3"
                opacity=".62"
              />
              <path
                d="M367 505 L548 365"
                stroke="#C084FC"
                strokeWidth="2"
                opacity=".5"
              />
            </g>

            {/* Loader Door (Animated) */}
            <g className="loader-door-anim">
              <path
                d="M548 365 L782 424 L782 835 L548 904Z"
                fill="url(#doorGradient)"
                stroke="#4B4380"
                strokeWidth="2"
              />
              <path
                d="M548 365L782 424M782 424V835M548 365V904"
                fill="none"
                stroke="#C084FC"
                strokeWidth="3"
                opacity=".72"
                filter="url(#blur5)"
              />
              <path
                d="M548 365L782 424L782 835L548 904Z"
                fill="none"
                stroke="#C084FC"
                strokeWidth="2"
                opacity=".8"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
