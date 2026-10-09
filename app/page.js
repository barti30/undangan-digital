"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import OpeningScreen from "../components/OpeningScreen";
import OpeningScreen2 from "../components/OpeningScreen2"; // Buat file ini jika tanggal/isinya berbeda
import MainContent from "../components/MainContent";
import MainContent2 from "../components/MainContent2";

function InvitationApp() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  
  const guestName = searchParams.get("to");
  const version = searchParams.get("versi"); // Mengecek apakah link mengandung ?versi=2

  useEffect(() => {
    document.body.classList.toggle("no-scroll", !isOpen);
  }, [isOpen]);

  return (
    <>
      {!isOpen ? (
        /* Jika versi 2, tampilkan OpeningScreen2. Jika tidak, tampilkan OpeningScreen biasa */
        version === "2" ? (
          <OpeningScreen2 guestName={guestName} onOpen={() => setIsOpen(true)} />
        ) : (
          <OpeningScreen guestName={guestName} onOpen={() => setIsOpen(true)} />
        )
      ) : (
        /* Jika versi 2, tampilkan MainContent2. Jika tidak, tampilkan MainContent biasa */
        version === "2" ? <MainContent2 /> : <MainContent />
      )}
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <InvitationApp />
    </Suspense>
  );
}