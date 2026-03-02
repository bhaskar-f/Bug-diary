import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LeftPanel() {
  const cardsRef = useRef([]);

  useEffect(() => {
    // Set initial subtle state (optional)
    gsap.set(cardsRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    });
  }, []);

  const onEnter = (i) => {
    gsap.to(cardsRef.current[i], {
      y: -2,
      scale: 1.01,
      duration: 0.2,
      ease: "power2.out",
      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    });
  };

  const onLeave = (i) => {
    gsap.to(cardsRef.current[i], {
      y: 0,
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    });
  };

  const features = [
    {
      title: "Log Every Bug",
      desc: "Keep a clean record of issues, fixes, and notes—all in one place.",
      icon: <i className="ri-bug-fill text-[#9B2020]"></i>,
    },
    {
      title: "Learn From Mistakes",
      desc: "Capture root causes and lessons to avoid repeating problems.",
      icon: <i className="ri-lightbulb-flash-fill text-[#D1D113]"></i>,
    },
    {
      title: "Stay Organized",
      desc: "Pin important bugs, archive old ones, and filter your diary your way.",
      icon: "📌",
    },
  ];

  return (
    <div className="h-full w-full rounded-2xl bg-white p-6 xl:p-7 flex flex-col justify-between shadow-sm overflow-hidden">
      {/* Top badge */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-400 px-3 py-1.5 text-sm text-gray-700 mb-4">
          <span className="w-2 h-2 bg-red-500 drop-shadow-xl rounded-full">
            {/* <img src="/logo.png" alt="logo" className="w-5" /> */}
          </span>
          <span>Bug Diary</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl xl:text-[1.7rem] font-bold text-gray-900 leading-tight">
          Track bugs. <br />
          Learn faster. Build better.
        </h1>

        {/* Subtext */}
        <p className="mt-2 text-sm text-gray-600 max-w-md">
          A private engineering journal to log issues, record fixes, and capture
          what you learn.
        </p>

        {/* Feature cards */}
        <div className="mt-5 space-y-3 font-md">
          {features.map((f, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseEnter={() => onEnter(i)}
              onMouseLeave={() => onLeave(i)}
              className="cursor-pointer rounded-xl border border-zinc-300 bg-gray-50 p-3 flex items-start gap-3 transition-colors hover:bg-white"
            >
              <div className="text-xl">{f.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="text-xs xl:text-sm text-gray-600 mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="mt-4">
        <h3 className="text-base xl:text-lg font-semibold text-gray-900">
          Build better with Bugs. (just kidding!!)
        </h3>
        <p className="text-sm text-gray-600">
          A personal, private diary for developers.
        </p>
      </div>
    </div>
  );
}
