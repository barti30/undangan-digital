"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import OpeningScreen from "../components/OpeningScreen";
import MainContent from "../components/MainContent";

function InvitationApp() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to");

  useEffect(() => {
    document.body.classList.toggle("no-scroll", !isOpen);
  }, [isOpen]);

  return (
    <>
      {!isOpen ? (
        <OpeningScreen guestName={guestName} onOpen={() => setIsOpen(true)} />
      ) : (
        <MainContent />
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