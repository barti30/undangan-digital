import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

function FadeInSection({ children, delay = 0, type = 'default' }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setVisible(true);
        else setVisible(false);
      });
    }, { threshold: 0.1 });
    
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  let transitionClass = "transition-all duration-1000 ease-out";
  let hiddenClass = "opacity-0 translate-y-12";
  let visibleClass = "opacity-100 translate-y-0";

  if (type === 'aesthetic') {
    transitionClass = "transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
    hiddenClass = "opacity-0 translate-y-12 scale-90 blur-md";
    visibleClass = "opacity-100 translate-y-0 scale-100 blur-none";
  }

  return (
    <div ref={domRef} className={`${transitionClass} ${isVisible ? visibleClass : hiddenClass}`} style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}>
      {children}
    </div>
  );
}

export default function WeddingInvitation() {
  const [nama, setNama] = useState('');
  const [ucapan, setUcapan] = useState('');
  const [kehadiran, setKehadiran] = useState('Hadir'); 
  const [wishes, setWishes] = useState([]); 
  
  const [zoomedImage, setZoomedImage] = useState(null);

  const bgAudioRef = useRef(null);
  const verseAudioRef = useRef(null);
  const [isBgPlaying, setIsBgPlaying] = useState(false);
  const [isVersePlaying, setIsVersePlaying] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  const fullVerse = '"Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya..."';
  const [displayedVerse, setDisplayedVerse] = useState(fullVerse);
  const [isTyping, setIsTyping] = useState(false);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const savedWishes = localStorage.getItem('wedding_wishes');
    if (savedWishes) setWishes(JSON.parse(savedWishes));
  }, []);

  useEffect(() => {
    const targetDate = new Date('November 1, 2026 10:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) clearInterval(interval);
      else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fungsi untuk tombol play/stop musik utama di kanan tengah
  const toggleBgMusic = () => {
    if (bgAudioRef.current) {
      if (bgAudioRef.current.paused) {
        if (isVersePlaying) {
          verseAudioRef.current.pause();
          setIsVersePlaying(false);
          setIsTyping(false);
          setDisplayedVerse(fullVerse);
        }
        bgAudioRef.current.play().catch(console.error);
        setShowNotification(false); // Sembunyikan notifikasi setelah musik dinyalakan
      } else {
        bgAudioRef.current.pause();
      }
    }
  };

  // Fungsi tap di bagian mana saja untuk menjalankan musik
  const handleScreenTap = () => {
    if (bgAudioRef.current && bgAudioRef.current.paused && !isVersePlaying) {
      bgAudioRef.current.play().catch(() => {});
      setShowNotification(false);
    }
  };

  // Fungsi tombol play surat (arum.mp4)
  const toggleVerseAudio = () => {
    if (isVersePlaying) {
      verseAudioRef.current.pause();
      setIsVersePlaying(false);
      setIsTyping(false);
      setDisplayedVerse(fullVerse);
      if (bgAudioRef.current) bgAudioRef.current.play().catch(() => {});
    } else {
      if (bgAudioRef.current) bgAudioRef.current.pause();

      verseAudioRef.current.currentTime = 0; 
      verseAudioRef.current.play().catch(() => {});
      setIsVersePlaying(true);
      setIsTyping(true);
      setDisplayedVerse('');
    }
  };

  useEffect(() => {
    if (isTyping) {
      let i = 0;
      setDisplayedVerse('');
      const typingInterval = setInterval(() => {
        setDisplayedVerse(fullVerse.slice(0, i + 1));
        i++;
        if (i >= fullVerse.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 70); 
      return () => clearInterval(typingInterval);
    }
  }, [isTyping]);

  const handleVerseEnded = () => {
    setIsVersePlaying(false);
    setIsTyping(false);
    setDisplayedVerse(fullVerse);
    if (bgAudioRef.current) {
      bgAudioRef.current.play().catch(() => {});
    }
  };

  const handleKirimUcapan = (e) => {
    e.preventDefault();
    if (!nama || !ucapan) return;
    const newWish = { id: Date.now(), nama, ucapan, kehadiran };
    const updatedWishes = [newWish, ...wishes];
    setWishes(updatedWishes);
    localStorage.setItem('wedding_wishes', JSON.stringify(updatedWishes));
    setNama(''); setUcapan(''); setKehadiran('Hadir'); 
  };

  return (
    <div 
      className="min-h-screen bg-[#f8f9fa] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] text-slate-800 font-sans max-w-md mx-auto shadow-2xl overflow-x-hidden relative"
      onClick={handleScreenTap} // Tap bagian mana saja untuk jalankan musik
    >
      <Head>
        <title>The Wedding of Disa & Iqbal</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Quicksand:wght@400;500;600;700&family=Caveat:wght@600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        .font-serif-hero { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Quicksand', sans-serif; }
        .font-handwriting { font-family: 'Caveat', cursive; }
        
        @keyframes zoomPop { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        .animate-zoom-pop { animation: zoomPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .typewriter-cursor::after { content: '|'; animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>

      {/* Musik Utama Halaman Utama: /audio/tri.mp4 */}
      <audio 
        ref={bgAudioRef} 
        src="/audio/tri.mp4" 
        loop 
        onPlay={() => setIsBgPlaying(true)}
        onPause={() => setIsBgPlaying(false)}
      />
      {/* Audio Surat: /audio/arum.mp4 */}
      <audio 
        ref={verseAudioRef} 
        src="/audio/arum.mp4" 
        onEnded={handleVerseEnded} 
      />

      {/* Notifikasi Panduan Musik */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[95] bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-4 py-2 rounded-full shadow-lg text-center animate-bounce pointer-events-none">
          Ketuk layar atau tekan tombol 🎵 di kanan untuk memutar musik
        </div>
      )}

      {/* Tombol Play/Stop Melayang di Kanan Tengah */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Mencegah bentrok dengan event klik layar
          toggleBgMusic();
        }}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-[90] w-10 h-10 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center text-[#9dbad5] shadow-xl transition-all hover:scale-110 hover:bg-[#9dbad5] hover:text-white"
        aria-label="Toggle Music"
      >
        {isBgPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
        ) : (
          <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
        )}
      </button>

      <section className="min-h-[100svh] flex flex-col items-center relative pt-4 pb-12 overflow-hidden">
        <div className="absolute top-28 opacity-10 mix-blend-multiply filter invert contrast-125 z-0 pointer-events-none"><img src="/images/wayang.jpg" alt="Ornamen Wayang" className="w-80 h-80 object-contain" /></div>
        <div className="relative w-full h-[500px] mt-6 z-10 max-w-sm mx-auto">
          <div className="absolute top-0 left-4 w-[55%] z-10 group">
            <FadeInSection delay={200}><div onClick={(e) => { e.stopPropagation(); setZoomedImage('/images/couple-1.jpg'); }} className="bg-white p-2 pb-10 shadow-xl rounded-sm transform -rotate-12 group-hover:rotate-0 group-hover:z-50 group-hover:scale-105 transition-all duration-500 relative z-10 cursor-zoom-in"><img src="/images/couple-1.jpg" alt="Gallery 1" className="w-full aspect-[4/5] object-cover object-top sepia-[.2]" /></div></FadeInSection>
          </div>
          <div className="absolute top-16 right-4 w-[55%] z-20 group">
            <FadeInSection delay={600}><div onClick={(e) => { e.stopPropagation(); setZoomedImage('/images/couple-2.jpg'); }} className="bg-white p-2 pb-10 shadow-xl rounded-sm transform rotate-12 group-hover:rotate-0 group-hover:z-50 group-hover:scale-105 transition-all duration-500 relative z-20 cursor-zoom-in"><img src="/images/couple-2.jpg" alt="Gallery 2" className="w-full aspect-[4/5] object-cover object-center sepia-[.2]" /></div></FadeInSection>
          </div>
          <div className="absolute top-52 left-1/2 -translate-x-1/2 w-[60%] z-30 group">
            <FadeInSection delay={1000}><div onClick={(e) => { e.stopPropagation(); setZoomedImage('/images/couple-3.jpg'); }} className="bg-[#f4f1ea] p-2 pb-10 shadow-2xl border border-[#e6e2d6] rounded-sm transform -rotate-2 group-hover:rotate-0 group-hover:z-50 group-hover:scale-105 transition-all duration-500 relative z-30 cursor-zoom-in"><img src="/images/couple-3.jpg" alt="Gallery 3" className="w-full aspect-[4/5] object-cover object-top sepia-[.2]" /></div></FadeInSection>
          </div>
        </div>
        <div className="text-center px-4 mt-6 z-10 flex flex-col items-center justify-center">
          <FadeInSection delay={1400}><p className="text-[10px] tracking-[0.3em] font-bold text-[#9eb5c7] mb-4 uppercase">The Wedding of</p><h1 className="text-5xl font-serif-hero font-semibold mb-6 tracking-wide text-[#55697a]">Disa & Iqbal</h1><p className="text-sm text-slate-500 font-medium font-body mb-10">Minggu, 1 November 2026</p></FadeInSection>
          <FadeInSection delay={1800}><button className="bg-[#9dbad5] text-white px-8 py-3 rounded-full font-body font-bold text-sm flex items-center gap-2 hover:bg-[#86a8c7] transition-all shadow-md transform hover:scale-105"><svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>Save to Calendar</button></FadeInSection>
        </div>
      </section>

      <section className="py-16 px-8 text-center relative border-t border-slate-100">
        <FadeInSection>
          <h3 className="text-4xl font-body text-[#7a8a9a] mb-6">Disa <span className="text-pink-300 font-serif italic">&</span> Iqbal</h3>
          <div className="bg-[#fcf8f9] p-8 rounded-[2rem] mb-12 shadow-sm border border-pink-100 flex flex-col items-center justify-center min-h-[160px]">
            <p className={`text-xs italic text-[#7a8a9a] leading-relaxed font-medium ${isTyping ? 'typewriter-cursor' : ''}`}>{displayedVerse}</p>
            <div className="mt-4"><span className={`font-bold text-xs bg-blue-600 text-white px-2 py-1 rounded transition-opacity duration-1000 ${(displayedVerse.length === fullVerse.length && !isTyping) ? 'opacity-100' : 'opacity-0'}`}>Qs. Ar-Rum: 21</span></div>
          </div>
        </FadeInSection>
        <FadeInSection delay={200}>
           <div className="flex justify-center mb-4"><span className="text-xl text-pink-300">🩷</span></div>
           <p className="text-[10px] text-[#7a8a9a] tracking-wider mb-6 uppercase font-semibold">{isVersePlaying ? 'Membacakan Surat...' : 'Click to play our song!'}</p>
           {/* Tombol Play Surat */}
           <div className="flex items-center justify-center gap-6 text-[#b0c4de]">
              <button className="hover:text-[#7a8a9a] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/></svg></button>
              <button onClick={(e) => { e.stopPropagation(); toggleVerseAudio(); }} className="w-12 h-12 bg-[#b0c4de] text-white rounded-full flex items-center justify-center hover:bg-[#9eb5c7] transform hover:scale-105 transition-all shadow-sm">
                {isVersePlaying ? (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>) : (<svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>)}
              </button>
              <button className="hover:text-[#7a8a9a] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 5.168A1 1 0 0010 6v2.798l-5.445-3.63A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z"/></svg></button>
           </div>
        </FadeInSection>
      </section>

      <section className="py-12 px-6 text-center overflow-hidden">
        <FadeInSection><h2 className="text-3xl font-handwriting text-[#627a8e] mb-12">Bride & Groom</h2></FadeInSection>
        <div className="flex flex-col items-center mb-10">
          <FadeInSection delay={100} type="aesthetic"><div onClick={(e) => { e.stopPropagation(); setZoomedImage('/images/couple-1.jpg'); }} className="w-40 bg-[#f4f1ea] p-3 pb-10 shadow-lg border border-[#e6e2d6] relative transform -rotate-2 hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-zoom-in"><img src="/images/couple-1.jpg" alt="Disa" className="w-full h-36 object-cover object-top sepia-[.2]" /><span className="absolute -bottom-5 right-2 text-4xl font-handwriting text-pink-400 transform -rotate-6 drop-shadow-sm">Disa</span></div></FadeInSection>
          <FadeInSection delay={400}><p className="font-bold text-[#627a8e] mt-8 text-lg tracking-wide">Disa Cahya Ramadhanty, S.K.M.</p></FadeInSection>
          <FadeInSection delay={600}><p className="text-[11px] text-slate-500 mt-1 leading-relaxed px-4">Putri pertama dari<br/>Bpk. Mamat Rahmat & Ibu Eneng Eka Agustini</p></FadeInSection>
        </div>
        <FadeInSection delay={200}><div className="text-2xl text-pink-300 font-serif mb-12 animate-bounce">&</div></FadeInSection>
        <div className="flex flex-col items-center">
          <FadeInSection delay={300} type="aesthetic"><div onClick={(e) => { e.stopPropagation(); setZoomedImage('/images/couple-3.jpg'); }} className="w-40 bg-[#f4f1ea] p-3 pb-10 shadow-lg border border-[#e6e2d6] relative transform rotate-2 hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-zoom-in"><img src="/images/couple-3.jpg" alt="Iqbal" className="w-full h-36 object-cover object-top sepia-[.2]" /><span className="absolute -bottom-5 left-2 text-4xl font-handwriting text-[#9eb5c7] transform rotate-6 drop-shadow-sm">Iqbal</span></div></FadeInSection>
          <FadeInSection delay={600}><p className="font-bold text-[#627a8e] mt-8 text-lg tracking-wide">Iqbal Mohamad Taufik, S.H.</p></FadeInSection>
          <FadeInSection delay={800}><p className="text-[11px] text-slate-500 mt-1 leading-relaxed px-4">Putra bungsu dari<br/>Bpk. Inen & Ibu Nyai Ison</p></FadeInSection>
        </div>
      </section>

      <section className="py-16 px-8 text-center bg-white/50 border-t border-slate-100">
        <FadeInSection>
          <h2 className="text-3xl font-handwriting text-[#627a8e] mb-4">Save the Date</h2><p className="text-xs text-slate-500 mb-8 max-w-xs mx-auto">Kami berharap Anda dapat menjadi bagian dari hari istimewa kami.</p>
          <div className="flex justify-center gap-3 mb-12">
            <div className="flex flex-col items-center justify-center bg-white w-16 h-16 rounded-xl shadow-sm border border-slate-100"><span className="text-2xl font-bold text-[#627a8e] font-serif">{timeLeft.days}</span><span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Hari</span></div>
            <div className="flex flex-col items-center justify-center bg-white w-16 h-16 rounded-xl shadow-sm border border-slate-100"><span className="text-2xl font-bold text-[#627a8e] font-serif">{timeLeft.hours}</span><span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Jam</span></div>
            <div className="flex flex-col items-center justify-center bg-white w-16 h-16 rounded-xl shadow-sm border border-slate-100"><span className="text-2xl font-bold text-[#627a8e] font-serif">{timeLeft.minutes}</span><span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Menit</span></div>
            <div className="flex flex-col items-center justify-center bg-white w-16 h-16 rounded-xl shadow-sm border border-slate-100"><span className="text-2xl font-bold text-pink-400 font-serif">{timeLeft.seconds}</span><span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Detik</span></div>
          </div>
          <div className="flex justify-center items-center gap-6 mb-10 text-[#627a8e]">
            <div className="text-center"><p className="text-[10px] uppercase font-semibold">Sat</p><p className="text-xl opacity-50">31</p></div>
            <div className="text-center relative hover:scale-110 transition-transform duration-300"><p className="text-[10px] uppercase text-pink-400 font-bold mb-1">Sun</p><div className="w-14 h-14 mx-auto flex items-center justify-center border-2 border-pink-300 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] rotate-45 bg-pink-50 shadow-sm"><span className="text-3xl font-bold text-pink-400 -rotate-45 block">1</span></div><p className="text-[9px] text-pink-500 mt-2 font-bold bg-pink-100 px-2 py-0.5 rounded-full inline-block">D-day !!</p></div>
            <div className="text-center"><p className="text-[10px] uppercase font-semibold">Mon</p><p className="text-xl opacity-50">2</p></div>
          </div>
        </FadeInSection>
        <FadeInSection delay={200}>
          <div className="space-y-6 text-sm text-[#627a8e]">
            <div><h4 className="text-2xl font-handwriting text-pink-400 mb-1">Akad Nikah</h4><p className="text-sm font-bold text-slate-700 mb-0.5">Minggu, 1 November 2026</p><p className="text-xs font-semibold text-slate-500">Pukul 10.00 WIB</p></div>
            <div className="flex items-center justify-center opacity-60 py-2"><svg width="150" height="20" viewBox="0 0 150 20" fill="none" stroke="#9eb5c7" strokeWidth="1.5"><path d="M0 10 Q 37.5 10, 50 10 T 65 10 Q 70 0, 75 10 Q 80 20, 85 10 Q 90 10, 100 10 T 150 10" /><path d="M72 10 L78 10 M75 7 L75 13" stroke="#f4aab9" strokeWidth="2.5"/></svg></div>
            <div><h4 className="text-2xl font-handwriting text-pink-400 mb-1">Resepsi</h4><p className="text-sm font-bold text-slate-700 mb-0.5">Minggu, 1 November 2026</p><p className="text-xs font-semibold text-slate-500">Pukul 12.00 WIB - Selesai</p></div>
          </div>
        </FadeInSection>
        <FadeInSection delay={400}><div className="mt-10"><a href="https://maps.app.goo.gl/FqDqY1aiXUAAeEPq8?g_st=aw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border-2 border-[#9dbad5] text-[#55697a] px-8 py-3 rounded-full text-xs font-bold hover:bg-[#9dbad5] hover:text-white hover:border-[#9dbad5] transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>Lihat Lokasi di Maps</a></div></FadeInSection>
      </section>

      <section className="py-16 px-6 bg-[#fcf8f9] text-center border-t border-slate-100">
        <FadeInSection><h2 className="text-3xl font-handwriting text-[#627a8e] mb-8">RSVP & Wishes</h2></FadeInSection>
        <FadeInSection delay={200}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 max-w-sm mx-auto text-left">
            <h4 className="font-bold text-[#627a8e] mb-4 text-sm flex items-center gap-2">💌 Konfirmasi Kehadiran</h4>
            <form onSubmit={handleKirimUcapan} className="space-y-4">
              <div><input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Anda..." className="w-full px-4 py-3 bg-[#f8f9fa] border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#9dbad5] focus:ring-1 focus:ring-[#9dbad5] transition-all" required /></div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Apakah Anda akan hadir?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"><input type="radio" name="kehadiran" value="Hadir" checked={kehadiran === 'Hadir'} onChange={(e) => setKehadiran(e.target.value)} className="accent-[#9dbad5]" />Hadir</label>
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"><input type="radio" name="kehadiran" value="Tidak Hadir" checked={kehadiran === 'Tidak Hadir'} onChange={(e) => setKehadiran(e.target.value)} className="accent-pink-300" />Tidak Hadir</label>
                </div>
              </div>
              <div><textarea value={ucapan} onChange={(e) => setUcapan(e.target.value)} placeholder="Tulis ucapan dan doa kamu di sini..." className="w-full px-4 py-3 bg-[#f8f9fa] border border-slate-200 rounded-xl text-xs h-24 resize-none focus:outline-none focus:border-[#9dbad5] focus:ring-1 focus:ring-[#9dbad5] transition-all" required ></textarea></div>
              <button type="submit" className="w-full bg-[#9dbad5] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#86a8c7] shadow-md transition-all">Kirim Ucapan</button>
            </form>
          </div>
        </FadeInSection>
        <FadeInSection delay={400}>
          <div className="w-full max-w-sm mx-auto space-y-3 text-left">
            <p className="text-[11px] font-bold text-[#627a8e] mb-4 flex items-center gap-2">✨ Sweet wishes from our guests</p>
            {wishes.length === 0 && <p className="text-xs text-slate-400 italic text-center">Belum ada ucapan.</p>}
            {wishes.map((wish) => (
              <div key={wish.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden hover:shadow-md transition-shadow">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${wish.kehadiran === 'Hadir' ? 'bg-[#9dbad5]' : 'bg-pink-300'}`}></div>
                <div className="flex justify-between items-start mb-1">
                  <h5 className="font-bold text-xs text-[#627a8e]">{wish.nama}</h5>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${wish.kehadiran === 'Hadir' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'}`}>{wish.kehadiran}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{wish.ucapan}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {zoomedImage && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out" onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}>
          <div className="relative max-w-md w-full max-h-[90vh] flex justify-center items-center animate-zoom-pop">
            <img src={zoomedImage} alt="Zoomed" className="max-h-[85vh] w-auto max-w-full object-contain rounded-md shadow-2xl border-4 border-white/10" />
            <button className="absolute -top-4 -right-1 bg-white text-slate-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-xl hover:bg-gray-200 transition-colors" onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}