import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

/* ---------- Komponen kecil ---------- */
function FadeInSection({ children, delay = 0, type = 'default' }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
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

const PlayIcon = () => (<svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>);
const PauseIcon = () => (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>);
const CalendarIcon = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const IgIcon = () => (<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>);

const IgLink = ({ href, handle, tone }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
    className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${tone}`}>
    <IgIcon />@{handle}
  </a>
);

const COUNTDOWN_UNITS = [['days', 'Hari'], ['hours', 'Jam'], ['minutes', 'Menit'], ['seconds', 'Detik']];
const QUOTE = 'Cinta bukan tentang menemukan orang yang sempurna, tetapi tentang melihat kesempurnaan dalam ketidaksempurnaan.';

/* ---------- Halaman utama ---------- */
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

  const fullVerse = 'Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.';
  const [displayedVerse, setDisplayedVerse] = useState(fullVerse);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('wedding_wishes');
    if (saved) setWishes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const targetDate = new Date('October 31, 2026 09:00:00').getTime();
    const interval = setInterval(() => {
      const distance = targetDate - new Date().getTime();
      if (distance < 0) clearInterval(interval);
      else setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleBgMusic = () => {
    if (!bgAudioRef.current) return;
    if (bgAudioRef.current.paused) {
      if (isVersePlaying) {
        verseAudioRef.current.pause();
        setIsVersePlaying(false); setIsTyping(false); setDisplayedVerse(fullVerse);
      }
      bgAudioRef.current.play().catch(console.error);
      setShowNotification(false);
    } else bgAudioRef.current.pause();
  };

  const handleScreenTap = () => {
    if (bgAudioRef.current && bgAudioRef.current.paused && !isVersePlaying) {
      bgAudioRef.current.play().catch(() => {});
      setShowNotification(false);
    }
  };

  const toggleVerseAudio = () => {
    if (isVersePlaying) {
      verseAudioRef.current.pause();
      setIsVersePlaying(false); setIsTyping(false); setDisplayedVerse(fullVerse);
      if (bgAudioRef.current) bgAudioRef.current.play().catch(() => {});
    } else {
      if (bgAudioRef.current) bgAudioRef.current.pause();
      verseAudioRef.current.currentTime = 0;
      verseAudioRef.current.play().catch(() => {});
      setIsVersePlaying(true); setIsTyping(true); setDisplayedVerse('');
    }
  };

  useEffect(() => {
    if (!isTyping) return;
    let i = 0;
    setDisplayedVerse('');
    const t = setInterval(() => {
      setDisplayedVerse(fullVerse.slice(0, i + 1));
      i++;
      if (i >= fullVerse.length) { clearInterval(t); setIsTyping(false); }
    }, 70);
    return () => clearInterval(t);
  }, [isTyping]);

  const handleVerseEnded = () => {
    setIsVersePlaying(false); setIsTyping(false); setDisplayedVerse(fullVerse);
    if (bgAudioRef.current) bgAudioRef.current.play().catch(() => {});
  };

  const handleKirimUcapan = (e) => {
    e.preventDefault();
    if (!nama || !ucapan) return;
    const updated = [{ id: Date.now(), nama, ucapan, kehadiran }, ...wishes];
    setWishes(updated);
    localStorage.setItem('wedding_wishes', JSON.stringify(updated));
    setNama(''); setUcapan(''); setKehadiran('Hadir');
  };

  const calendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=The+Wedding+of+Disa+%26+Iqbal&dates=20261031T020000Z/20261031T100000Z&location=Kp.+Cikupa,+Bojongmalaka,+Kec.+Baleendah,+Kabupaten+Bandung';

  return (
    <div
      className="min-h-screen bg-[#f8f9fa] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] text-slate-800 font-sans overflow-x-hidden relative"
      onClick={handleScreenTap}
    >
      <Head>
        <title>The Wedding of Disa & Iqbal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

      <audio ref={bgAudioRef} src="/audio/tri.mp4" loop onPlay={() => setIsBgPlaying(true)} onPause={() => setIsBgPlaying(false)} />
      <audio ref={verseAudioRef} src="/audio/arum.mp4" onEnded={handleVerseEnded} />

      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[95] w-max max-w-[90vw] bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-4 py-2 rounded-full shadow-lg text-center animate-bounce pointer-events-none">
          Ketuk layar atau tekan tombol 🎵 di kanan untuk memutar musik
        </div>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); toggleBgMusic(); }}
        className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-[90] w-10 h-10 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center text-[#9dbad5] shadow-xl transition-all hover:scale-110 hover:bg-[#9dbad5] hover:text-white"
        aria-label="Toggle Music"
      >
        {isBgPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      {/* ================= HERO ================= */}
      <section className="relative min-h-[100svh] overflow-hidden bg-gradient-to-br from-[#bcd3ea] via-[#eef3f8] to-[#fbf7f0] flex flex-col">
        <img src="/images/couple-2.jpg" alt="" className="md:hidden absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-white/25 via-white/10 to-[#fbf7f0]/50 pointer-events-none" />

        <img src="/images/couple-2.jpg" alt="" className="hidden md:block absolute -left-20 top-0 h-full w-1/2 object-cover opacity-50 pointer-events-none"
          style={{ maskImage: 'linear-gradient(to right, black 30%, transparent)', WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent)' }} />
        <img src="/images/couple-2.jpg" alt="" className="hidden md:block absolute -right-24 top-0 h-full w-1/3 object-cover opacity-25 pointer-events-none"
          style={{ maskImage: 'linear-gradient(to left, black 20%, transparent)', WebkitMaskImage: 'linear-gradient(to left, black 20%, transparent)' }} />

        <div className="absolute -bottom-20 -left-20 w-64 h-64 md:-bottom-24 md:-left-24 md:w-72 md:h-72 rounded-full bg-[#1f3556] opacity-90 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 md:-bottom-24 md:-left-24 md:w-72 md:h-72 rounded-full border-2 border-[#c9a96a]/70 scale-110 pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4 pt-12 pb-6 md:pt-10 md:pb-24">
          <div className="relative w-[min(340px,88vw)] aspect-[340/540] md:w-[460px] md:aspect-[460/620] shrink-0">
            <div className="absolute top-0 left-0 w-[52%] z-10">
              <FadeInSection delay={200}>
                <div onClick={(e) => { e.stopPropagation(); setZoomedImage('/images/couple-1.jpg'); }} className="relative bg-white p-2 pb-8 shadow-xl cursor-zoom-in hover:scale-105 transition-transform duration-500" style={{ transform: 'rotate(-8deg)' }}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#e8dcc0]/80 rotate-[-4deg] shadow-sm" />
                  <img src="/images/couple-1.jpg" alt="Disa & Iqbal 1" className="w-full aspect-[4/5] object-cover object-top" />
                </div>
              </FadeInSection>
            </div>
            <div className="absolute top-[2%] right-0 w-[48%] z-20">
              <FadeInSection delay={500}>
                <div onClick={(e) => { e.stopPropagation(); setZoomedImage('/images/couple-2.jpg'); }} className="bg-white p-2 pb-8 shadow-xl cursor-zoom-in hover:scale-105 transition-transform duration-500" style={{ transform: 'rotate(7deg)' }}>
                  <img src="/images/couple-2.jpg" alt="Prambanan" className="w-full aspect-[4/5] object-cover object-center" />
                </div>
              </FadeInSection>
            </div>
            <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2 w-[68%] z-30">
              <FadeInSection delay={800}>
                <div onClick={(e) => { e.stopPropagation(); setZoomedImage('/images/anjay.jpeg'); }} className="relative bg-[#faf8f3] p-2.5 pb-12 md:pb-14 shadow-2xl cursor-zoom-in hover:scale-105 transition-transform duration-500" style={{ transform: 'rotate(-1deg)' }}>
                  <div className="absolute -top-5 left-6 w-4 h-10 border-2 border-slate-400 rounded-full" />
                  <img src="/images/anjay.jpeg" alt="Disa & Iqbal 3" className="w-full aspect-[4/5] object-cover object-top" />
                  <p className="absolute bottom-2 left-3 text-xl md:text-2xl font-handwriting text-[#2f5385]">Disa &amp; Iqbal</p>
                </div>
              </FadeInSection>
            </div>
          </div>

          <div className="w-full max-w-sm px-2 text-center md:text-left flex flex-col items-center md:items-start">
            <FadeInSection delay={1000}>
              <p className="text-[10px] tracking-[0.35em] font-semibold text-[#55697a] uppercase mb-3">The Wedding of</p>
              <div className="flex items-center gap-2 mb-2 opacity-60 justify-center md:justify-start">
                <span className="h-px w-12 md:w-16 bg-[#2f5385]" /><span className="text-[#2f5385] text-xs">❖</span><span className="h-px w-12 md:w-16 bg-[#2f5385]" />
              </div>
              <h1 className="font-serif-hero italic font-semibold text-[#2f5385] leading-[0.95] text-6xl md:text-7xl">
                Disa <span className="text-4xl md:text-5xl">&amp;</span><br />
                <span className="md:ml-10 inline-block">Iqbal</span>
              </h1>
              <p className="text-[#2f5385]/60 mt-3 text-sm">〰 ♡ 〰</p>
            </FadeInSection>

            <FadeInSection delay={1300}>
              <p className="font-body text-sm text-slate-600 leading-relaxed mt-4 mb-6 max-w-xs mx-auto md:mx-0">
                Dengan penuh rasa syukur dan bahagia, kami mengundang Anda untuk hadir dalam hari istimewa kami.
              </p>
              <div className="w-full space-y-5 text-left mb-7 mx-auto max-w-[19rem] md:max-w-none">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-6 h-6 shrink-0 text-[#2f5385] mt-0.5" />
                  <p className="text-sm text-slate-700 leading-snug">Sabtu,<br /><b>31 Oktober 2026</b></p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 shrink-0 text-[#2f5385] mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                  <div className="min-w-0 text-sm text-slate-700 leading-snug break-words">
                    <p className="font-bold">Rancanumpang </p>
                    <p>Kelurahan Rancanumpang</p>
                    <p className="text-[12px] text-slate-500"> RT 003 RW 001 Kecamatan Gedebage Kota Bandung 40613</p>
                  </div>
                </div>
              </div>
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 bg-[#2f5385] text-white px-8 py-3.5 rounded-full font-body font-bold text-sm shadow-lg hover:bg-[#244067] hover:scale-105 transition-all">
                <CalendarIcon className="w-4 h-4" />Save to Calendar →
              </a>
            </FadeInSection>
          </div>
        </div>

        <div className="md:hidden h-40" />
        <p className="absolute bottom-4 left-4 md:bottom-6 md:left-5 z-20 max-w-[8.5rem] text-white/90 text-xs md:text-[13px] font-handwriting leading-tight pointer-events-none">{QUOTE}</p>
      </section>

      {/* ================= KONTEN LAINNYA ================= */}
      <div className="w-full max-w-2xl mx-auto bg-white/60 shadow-2xl">

        {/* Ayat */}
        <section className="py-16 px-6 sm:px-8 text-center relative border-t border-slate-100">
          <FadeInSection>
            <h3 className="text-4xl font-body text-[#7a8a9a] mb-6">
              Disa <span className="text-pink-300 font-serif italic">&</span> Iqbal
            </h3>
            
            <div className="bg-[#fcf8f9] p-6 sm:p-8 rounded-[2rem] mb-8 shadow-sm border border-pink-100 flex flex-col items-center justify-center min-h-[160px]">
              {/* Teks Arab (Tampil statis di atas) */}
              <p className="text-lg sm:text-xl font-serif text-[#5c4a42] leading-relaxed mb-4 text-center" dir="rtl">
                وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ ۝٢١
              </p>
              
              {/* Terjemahan dengan Efek Ketikan (Typewriter) */}
              <p className={`text-xs sm:text-sm italic text-[#7a8a9a] leading-relaxed font-medium mb-4 ${isTyping ? 'typewriter-cursor' : ''}`}>
                &ldquo;{displayedVerse}&rdquo;
              </p>

              {/* Label Surat */}
              <div>
                <span className={`font-bold text-xs bg-blue-600 text-white px-2.5 py-1 rounded shadow-sm transition-opacity duration-1000 ${(displayedVerse.length === fullVerse.length && !isTyping) ? 'opacity-100' : 'opacity-0'}`}>
                  QS. Ar-Rum: 21
                </span>
              </div>
            </div>
          </FadeInSection>

          {/* Tombol Audio / Musik Surat */}
          <FadeInSection delay={200}>
            <div className="flex justify-center mb-4"><span className="text-xl text-pink-300">🩷</span></div>
            <p className="text-[10px] text-[#7a8a9a] tracking-wider mb-6 uppercase font-semibold">
              {isVersePlaying ? 'Membacakan Surat...' : 'Click to play our song!'}
            </p>
            <div className="flex items-center justify-center gap-6 text-[#b0c4de]">
              <button className="hover:text-[#7a8a9a] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); toggleVerseAudio(); }} className="w-12 h-12 bg-[#b0c4de] text-white rounded-full flex items-center justify-center hover:bg-[#9eb5c7] transform hover:scale-105 transition-all shadow-sm">
                {isVersePlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button className="hover:text-[#7a8a9a] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 5.168A1 1 0 0010 6v2.798l-5.445-3.63A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z"/></svg>
              </button>
            </div>
          </FadeInSection>
        </section>

        {/* Bride & Groom */}
        <section className="py-12 px-6 text-center overflow-hidden">
          <FadeInSection><h2 className="text-3xl font-handwriting text-[#627a8e] mb-12">Bride & Groom</h2></FadeInSection>
          <div className="flex flex-col md:flex-row md:justify-center md:items-start md:gap-10 items-center">
            <div className="flex flex-col items-center mb-10">
              <FadeInSection delay={100} type="aesthetic">
                <div onClick={(e) => { e.stopPropagation(); setZoomedImage('/images/bride-profile.jpg'); }} className="w-40 bg-[#f4f1ea] p-3 pb-10 shadow-lg border border-[#e6e2d6] relative transform -rotate-2 hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-zoom-in">
                  <img src="/images/bride-profile.jpg" alt="Disa" className="w-full h-36 object-cover object-top sepia-[.2]" />
                  <span className="absolute -bottom-5 right-2 text-4xl font-handwriting text-pink-400 transform -rotate-6 drop-shadow-sm">Disa</span>
                </div>
              </FadeInSection>
              <FadeInSection delay={400}><p className="font-bold text-[#627a8e] mt-8 text-lg tracking-wide">Disa Cahya Ramadhanty, S.K.M.</p></FadeInSection>
              <FadeInSection delay={600}>
                <div className="flex flex-col items-center">
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed px-4">Putri pertama dari<br />Bpk. Mamat Rahmat & Ibu Eneng Eka Agustini</p>
                  <IgLink href="https://www.instagram.com/disee.cr/" handle="disee.cr" tone="border-pink-200 bg-pink-50 text-pink-500 hover:bg-pink-100" />
                </div>
              </FadeInSection>
            </div>

            <FadeInSection delay={200}><div className="text-2xl text-pink-300 font-serif mb-10 md:mt-14 animate-bounce">&</div></FadeInSection>

            <div className="flex flex-col items-center">
              <FadeInSection delay={300} type="aesthetic">
                <div onClick={(e) => { e.stopPropagation(); setZoomedImage('/images/groom-profile.jpg'); }} className="w-40 bg-[#f4f1ea] p-3 pb-10 shadow-lg border border-[#e6e2d6] relative transform rotate-2 hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-zoom-in">
                  <img src="/images/groom-profile.jpg" alt="Iqbal" className="w-full h-36 object-cover object-top sepia-[.2]" />
                  <span className="absolute -bottom-5 left-2 text-4xl font-handwriting text-[#9eb5c7] transform rotate-6 drop-shadow-sm">Iqbal</span>
                </div>
              </FadeInSection>
              <FadeInSection delay={600}><p className="font-bold text-[#627a8e] mt-8 text-lg tracking-wide">Iqbal Mohamad Taufik, S.H.</p></FadeInSection>
              <FadeInSection delay={800}>
                <div className="flex flex-col items-center">
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed px-4">Putra bungsu dari<br />Bpk. Inen & Ibu Nyai Ison</p>
                  <IgLink href="https://www.instagram.com/iqbalmohamad12/" handle="iqbalmohamad12" tone="border-blue-200 bg-blue-50 text-[#55697a] hover:bg-blue-100" />
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* Save the Date */}
        <section className="py-16 px-6 sm:px-8 text-center bg-white/50 border-t border-slate-100">
          <FadeInSection>
            <h2 className="text-3xl font-handwriting text-[#627a8e] mb-4">Save the Date</h2>
            <p className="text-xs text-slate-500 mb-8 max-w-xs mx-auto">Kami berharap Anda dapat menjadi bagian dari hari istimewa kami.</p>
            <div className="flex justify-center gap-2 sm:gap-3 mb-12">
              {COUNTDOWN_UNITS.map(([key, label]) => (
                <div key={key} className="flex flex-col items-center justify-center bg-white w-14 h-14 sm:w-16 sm:h-16 rounded-xl shadow-sm border border-slate-100">
                  <span className={`text-xl sm:text-2xl font-bold font-serif ${key === 'seconds' ? 'text-pink-400' : 'text-[#627a8e]'}`}>{timeLeft[key]}</span>
                  <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-6 mb-10 text-[#627a8e]">
              <div className="text-center"><p className="text-[10px] uppercase font-semibold">Fri</p><p className="text-xl opacity-50">30</p></div>
              <div className="text-center relative hover:scale-110 transition-transform duration-300">
                <p className="text-[10px] uppercase text-pink-400 font-bold mb-1">Sat</p>
                <div className="w-14 h-14 mx-auto flex items-center justify-center border-2 border-pink-300 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] rotate-45 bg-pink-50 shadow-sm"><span className="text-3xl font-bold text-pink-400 -rotate-45 block">31</span></div>
                <p className="text-[9px] text-pink-500 mt-2 font-bold bg-pink-100 px-2 py-0.5 rounded-full inline-block">D-day !!</p>
              </div>
              <div className="text-center"><p className="text-[10px] uppercase font-semibold">Sun</p><p className="text-xl opacity-50">1</p></div>
            </div>
          </FadeInSection>
          <FadeInSection delay={200}>
            <div className="space-y-8 text-sm text-[#627a8e]">
              
              <div className="flex items-center justify-center opacity-60 py-1"><svg width="150" height="20" viewBox="0 0 150 20" fill="none" stroke="#9eb5c7" strokeWidth="1.5"><path d="M0 10 Q 37.5 10, 50 10 T 65 10 Q 70 0, 75 10 Q 80 20, 85 10 Q 90 10, 100 10 T 150 10" /><path d="M72 10 L78 10 M75 7 L75 13" stroke="#f4aab9" strokeWidth="2.5" /></svg></div>
              <div>
                <h4 className="text-2xl font-handwriting text-pink-400 mb-1">Resepsi</h4>
                <p className="text-sm font-bold text-slate-700 mb-0.5">Sabtu, 31 Oktober 2026</p>
                <p className="text-xs font-semibold text-slate-500">Pukul 10.00 WIB - selesai</p>
              </div>
              
              <div className="pt-2 text-xs text-slate-500 leading-relaxed border-t border-slate-200/60 max-w-xs mx-auto">
                <p className="font-bold text-slate-700 text-sm">Kp. Rancanumpang</p>
                <p>RT 003 RW 001 Kelurahan Rancanumpang Kecamatan Gedebage Kota Bandung 40613</p>
              </div>
            </div>
          </FadeInSection>
          <FadeInSection delay={400}>
            <div className="mt-8">
              <a href="https://maps.app.goo.gl/W7f2YfqvprXWAqpW9?g_st=iw" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center gap-2 border-2 border-[#9dbad5] text-[#55697a] px-8 py-3 rounded-full text-xs font-bold hover:bg-[#9dbad5] hover:text-white hover:border-[#9dbad5] transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>Lihat Lokasi di Maps
              </a>
            </div>
          </FadeInSection>
        </section>

        {/* RSVP & Wishes */}
        <section className="py-16 px-5 sm:px-6 bg-[#fcf8f9] text-center border-t border-slate-100">
          <FadeInSection><h2 className="text-3xl font-handwriting text-[#627a8e] mb-8">RSVP & Wishes</h2></FadeInSection>
          <FadeInSection delay={200}>
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 max-w-sm mx-auto text-left">
              <h4 className="font-bold text-[#627a8e] mb-4 text-sm flex items-center gap-2">💌 Konfirmasi Kehadiran</h4>
              <form onSubmit={handleKirimUcapan} className="space-y-4">
                <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Anda..." className="w-full px-4 py-3 bg-[#f8f9fa] border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#9dbad5] focus:ring-1 focus:ring-[#9dbad5] transition-all" required />
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Apakah Anda akan hadir?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"><input type="radio" name="kehadiran" value="Hadir" checked={kehadiran === 'Hadir'} onChange={(e) => setKehadiran(e.target.value)} className="accent-[#9dbad5]" />Hadir</label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"><input type="radio" name="kehadiran" value="Tidak Hadir" checked={kehadiran === 'Tidak Hadir'} onChange={(e) => setKehadiran(e.target.value)} className="accent-pink-300" />Tidak Hadir</label>
                  </div>
                </div>
                <textarea value={ucapan} onChange={(e) => setUcapan(e.target.value)} placeholder="Tulis ucapan dan doa kamu di sini..." className="w-full px-4 py-3 bg-[#f8f9fa] border border-slate-200 rounded-xl text-xs h-24 resize-none focus:outline-none focus:border-[#9dbad5] focus:ring-1 focus:ring-[#9dbad5] transition-all" required />
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
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed break-words">{wish.ucapan}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </section>
      </div>

      {/* Zoom foto */}
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