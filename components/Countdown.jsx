"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
    jam: Math.floor((diff / (1000 * 60 * 60)) % 24),
    menit: Math.floor((diff / (1000 * 60)) % 60),
    detik: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ targetDate }) {
  // Mulai dari null supaya hasil render pertama di server & client SAMA PERSIS
  // (sama-sama belum ada angka). Angka aslinya baru dihitung setelah komponen
  // benar-benar aktif di browser (useEffect), jadi tidak ada hydration mismatch.
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(getTimeLeft(targetDate));
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const items = [
    { label: "Hari", value: time?.hari ?? 0 },
    { label: "Jam", value: time?.jam ?? 0 },
    { label: "Menit", value: time?.menit ?? 0 },
    { label: "Detik", value: time?.detik ?? 0 },
  ];

  return (
    <div className="flex justify-center gap-3 sm:gap-6" suppressHydrationWarning>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex w-16 flex-col items-center rounded-xl bg-white/80 py-3 shadow-md sm:w-20"
        >
          <span className="font-serif text-2xl font-bold text-sage sm:text-3xl">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-gray-500 sm:text-xs">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
