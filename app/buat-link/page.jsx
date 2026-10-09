"use client";

import { useState } from "react";

export default function LinkGeneratorPage() {
  const [guestName, setGuestName] = useState("");
  const [invitationVersion, setInvitationVersion] = useState("1"); // State untuk memilih versi undangan
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    // Mendapatkan domain website yang sedang aktif secara otomatis
    const baseUrl = window.location.origin;

    // Membuat format link dengan parameter nama dan versi (jika versi 2, tambahkan &versi=2)
    let link = `${baseUrl}/?to=${encodeURIComponent(guestName.trim())}`;
    if (invitationVersion === "2") {
      link += `&versi=2`;
    }

    setGeneratedLink(link);
    setCopied(false);

    // Langsung buka link di tab baru tanpa perlu disalin
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f3edf4] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] flex items-center justify-center p-4 text-[#5c4a42] font-sans">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md w-full border border-[#e5dcda]">
        
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8c7870] mb-1">Panel Klien</p>
          <h1 className="text-2xl font-serif font-bold text-[#5c4a42]">Pembuat Link Undangan</h1>
          <p className="text-xs text-[#8c7870] mt-1">Masukkan nama tamu dan pilih versi undangan untuk membuat link instan.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#7a5c52] mb-1">
              Nama Tamu Undangan:
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Contoh: Dita Rahmawati"
              className="w-full px-4 py-3 bg-white border border-[#e5dcda] rounded-xl text-xs text-[#5c4a42] focus:outline-none focus:border-[#a89387] shadow-2xs"
              required
            />
          </div>

          {/* Pilihan Versi Undangan */}
          <div>
            <label className="block text-xs font-medium text-[#7a5c52] mb-1">
              Pilih Versi Undangan:
            </label>
            <select
              value={invitationVersion}
              onChange={(e) => setInvitationVersion(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#e5dcda] rounded-xl text-xs text-[#5c4a42] focus:outline-none focus:border-[#a89387]"
            >
              <option value="1">Tempat Pengantin perempuan Tanggal 1 november 2026</option>
              <option value="2">Tempat Pengantin laki-laki Tanggal 31 Oktober 2026</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#a89387] text-white py-3 rounded-xl font-medium text-xs uppercase tracking-[0.15em] shadow-md hover:bg-[#947d71] transition-all"
          >
            Generate & Buka Link
          </button>
        </form>

        {generatedLink && (
          <div className="mt-6 pt-6 border-t border-[#e5dcda] space-y-3">
            <div>
              <p className="text-[11px] font-medium text-[#8c7870] mb-1">Link Undangan:</p>
              <div className="p-3 bg-[#f3edf4] rounded-xl text-xs font-mono text-[#5c4a42] break-all border border-[#e5dcda]">
                {generatedLink}
              </div>
            </div>

            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 rounded-xl font-medium text-xs uppercase tracking-[0.15em] transition-all shadow-sm bg-[#a89387] text-white hover:bg-[#947d71]"
            >
              Buka Link
            </a>

            <button
              onClick={handleCopy}
              className={`w-full py-3 rounded-xl font-medium text-xs uppercase tracking-[0.15em] transition-all shadow-sm ${
                copied 
                  ? "bg-emerald-600 text-white" 
                  : "bg-[#7a5c52] text-white hover:bg-[#5c4a42]"
              }`}
            >
              {copied ? "✓ Berhasil Disalin ke Clipboard!" : "Salin Link Undangan"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}