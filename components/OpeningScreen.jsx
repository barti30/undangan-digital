"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function OpeningScreen({ onOpen }) {
  const audioRef = useRef(null);
  const searchParams = useSearchParams();
  const [guestName, setGuestName] = useState("Tamu Undangan");

  // Otomatis membaca nama dari parameter URL (?to=...)
  useEffect(() => {
    const to = searchParams.get("to");
    if (to) {
      setGuestName(decodeURIComponent(to.replace(/\+/g, " ")));
    }
  }, [searchParams]);

  const handleOpen = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log("Audio play diblokir browser:", err);
      });
    }
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onOpen(guestName);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#f3edf4] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] h-[100dvh] w-full px-6 py-10 overflow-hidden text-[#5c4a42] font-sans">
      
      {/* Audio Opening */}
      <audio 
        ref={audioRef} 
        src="/audio/akbar.mp3" 
        loop 
      />

      {/* Ornamen Latar Belakang Pastel */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#e6d7e8]/50 rounded-full blur-3xl pointer-events-none -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#d9d0cb]/40 rounded-full blur-3xl pointer-events-none translate-x-20 translate-y-20"></div>

      {/* --- BAGIAN ATAS: JUDUL & NAMA MEMPELAI --- */}
      <div className="text-center z-10 mt-6">
        <p className="text-xs uppercase tracking-[0.25em] font-medium text-[#8c7870] mb-3">
          Undangan Pernikahan
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif tracking-wide text-[#5c4a42] mb-2">
          Disa
        </h1>
        <span className="text-2xl font-serif italic text-[#b0988c]">&amp;</span>
        <h1 className="text-4xl sm:text-5xl font-serif tracking-wide text-[#5c4a42] mt-2 mb-8">
          Iqbal
        </h1>
      </div>

      {/* --- BAGIAN TENGAH: TANGGAL ACARA --- */}
      <div className="flex items-center justify-center gap-4 z-10 my-auto text-[#5c4a42]">
        <span className="text-xs font-medium uppercase tracking-widest text-[#8c7870]">Minggu</span>
        <div className="h-10 w-[1px] bg-[#b0988c]/60"></div>
        <div className="text-center px-1">
          <span className="text-3xl font-serif font-bold tracking-tight block text-[#7a5c52]">01</span>
          <span className="text-[10px] uppercase tracking-wider text-[#8c7870] block">2026</span>
        </div>
        <div className="h-10 w-[1px] bg-[#b0988c]/60"></div>
        <span className="text-xs font-medium uppercase tracking-widest text-[#8c7870]">November</span>
      </div>

      {/* --- BAGIAN BAWAH: KEPADA & NAMA TAMU OTOMATIS --- */}
      <div className="text-center z-10 w-full max-w-xs mb-4">
        <div className="mb-6">
          <p className="text-[11px] text-[#8c7870] italic mb-1">Kepada:</p>
          <p className="text-xs text-[#8c7870] mb-1">Yth. Bapak/Ibu/Saudara/i</p>
          
          {/* Nama tamu akan otomatis berubah sesuai link yang digenerate */}
          <p className="text-base font-bold text-[#5c4a42] tracking-wide bg-white/40 py-1.5 px-4 rounded-lg shadow-2xs inline-block border border-[#e5dcda]">
            {guestName}
          </p>
        </div>

        <button
          onClick={handleOpen}
          className="w-full bg-[#a89387] text-white py-3.5 rounded-full font-medium text-xs uppercase tracking-[0.2em] shadow-md hover:bg-[#947d71] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          {/* Ikon Loading/Buka Undangan */}
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Buka Undangan
        </button>
      </div>

    </div>
  );
}