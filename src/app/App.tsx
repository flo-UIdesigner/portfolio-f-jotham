import { useState, useEffect, useRef, useCallback } from "react";
import DivContainerMouse from "@/imports/DivContainerMouse";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import portraitProfil from "@/imports/magic_edit_TUFIUUFELTRwRlEjMSNjYTlhMWE4ZDA5M2Y5ZDk1NTg4ZjEzOTU2NWRiZmMzNiMyNDAwIyNUUkFOU0ZPUk1BVElPTl9SRVFVRVNU.png";
import portraitEditorial from "@/imports/_MG_3539.jpg";
import duranvilleCapture from "@/imports/portfolio-accueil-responsive.png";
import duranvilleHtml from "@/imports/1-accueil-1.html?raw";
import clubSaintJamesHtml from "@/imports/pasted_text/club-saint-james-brand.html?raw";
import memberHero from "@/imports/Firefly_Gemini_Flash_Portrait_hyperre_aliste_de_2_femmes_et_1_homme__en_tenue_business_casual__membres_d_un_664072.png";
import memberGroup from "@/imports/Firefly_Gemini_Flash_Portrait_hyperre_aliste_de_5_femmes_et_5_hommes__en_tenue_business_casual__membres_d_u_664072.png";

const patchedClubSaintJamesHtml = (() => {
  let html = clubSaintJamesHtml;
  // srcdoc iframes have a null origin so relative paths break — use an absolute URL
  const absoluteHeroUrl = new URL(memberHero as unknown as string, window.location.href).href;
  html = html.replace(
    /(<div class="site-hero" style="background-image:url\(')data:image\/[^']+(')/g,
    `$1${absoluteHeroUrl}$2`
  );
  // Inject visible scrollbar styles
  html = html.replace(
    "</head>",
    `<style>
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #f0e9de; }
      ::-webkit-scrollbar-thumb { background: #C6A15B; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #a8883d; }
      * { scrollbar-width: thin; scrollbar-color: #C6A15B #f0e9de; }
    </style></head>`
  );
  return html;
})();

import daPage1 from "@/imports/DURANVILLE-direction-artistique_page-0001.jpg";
import daPage2 from "@/imports/DURANVILLE-direction-artistique_page-0002.jpg";
import daPage3 from "@/imports/DURANVILLE-direction-artistique_page-0003.jpg";
import daPage4 from "@/imports/DURANVILLE-direction-artistique_page-0004.jpg";
import daPage5 from "@/imports/DURANVILLE-direction-artistique_page-0005.jpg";
import daPage6 from "@/imports/DURANVILLE-direction-artistique_page-0006.jpg";
import daPage7 from "@/imports/DURANVILLE-direction-artistique_page-0007.jpg";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Track {
  id: number;
  title: string;
  client: string;
  year: string;
  type: string;
  duration: string;
  color: string;
  label: string;
  image: string;
  imagePosition?: string;
  description: string;
  url?: string;
  htmlContent?: string; // HTML brut injecté via srcdoc
  inProgress?: boolean;
}

type Page = "home" | "collection" | "track" | "services" | "about" | "contact";
type NavigateFn = (page: Page, trackId?: number) => void;

// ── Data ───────────────────────────────────────────────────────────────────────
const TRACKS: Track[] = [
  {
    id: 1,
    title: "Duranville — Mode Martiniquaise",
    client: "Duranville",
    year: "2026",
    type: "Web",
    duration: "05:18",
    color: "#F5C518",
    label: "Solaire Édit.",
    image: duranvilleCapture as unknown as string,
    imagePosition: "top center",
    description:
      "Site vitrine et e-commerce pour une marque de prêt-à-porter fondée en Martinique — identité solaire, typographie éditoriale, ancrage caribéen.",
    url: "/duranville.html",
    htmlContent: duranvilleHtml,
  },
  {
    id: 2,
    title: "Club Saint-James — Identité de marque",
    client: "Club Saint-James de Montréal",
    year: "2026",
    type: "Branding",
    duration: "05:55",
    color: "#C6A15B",
    label: "Or & Marine",
    image: memberGroup as unknown as string,
    imagePosition: "center 25%",
    description:
      "Refonte de la charte graphique d'un club montréalais centenaire — du noir & or historique vers un bleu marine & or contemporain, pensé pour ouvrir le club à une nouvelle génération sans trahir son prestige.",
    htmlContent: patchedClubSaintJamesHtml,
  },
  {
    id: 3,
    title: "Omnifood",
    client: "Omnifood",
    year: "2025",
    type: "UX/UI",
    duration: "—",
    color: "#B8873C",
    label: "Ocre Éditions",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=600&fit=crop&auto=format",
    description: "Projet en cours de réalisation.",
    inProgress: true,
  },
  {
    id: 4,
    title: "Japan Travels",
    client: "Japan Travels",
    year: "2025",
    type: "Web",
    duration: "—",
    color: "#6B5642",
    label: "Terre Profonde",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=600&fit=crop&auto=format",
    description: "Projet en cours de réalisation.",
    inProgress: true,
  },
  {
    id: 5,
    title: "CIBUKERA",
    client: "Projet musical",
    year: "2025",
    type: "Branding",
    duration: "—",
    color: "#C9502F",
    label: "Terracotta Rec.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop&auto=format",
    description: "Projet en cours de réalisation.",
    inProgress: true,
  },
  {
    id: 6,
    title: "MG Conciergerie",
    client: "MG Conciergerie",
    year: "2025",
    type: "UX/UI",
    duration: "—",
    color: "#3D5A45",
    label: "Forêt Verde",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=600&fit=crop&auto=format",
    description: "Projet en cours de réalisation.",
    inProgress: true,
  },
];

const TRACK_TYPES = ["Tous", "UX/UI", "Éditorial", "Dashboard", "Web", "Branding"];

// ── Mettre à true quand vous avez des avis à afficher ─────────────────────────
const SHOW_REVIEWS = false;

const REVIEWS = [
  {
    name: "Marie-Claire D.",
    role: "Fondatrice, Studio Kaleo",
    rating: 5,
    text: "Florence a une façon rare de comprendre ce qu'on ne sait pas encore formuler. Le résultat dépasse ce qu'on imaginait.",
    date: "Il y a 2 semaines",
  },
  {
    name: "Thomas B.",
    role: "CPO, Canopée SAS",
    rating: 5,
    text: "Un travail d'une précision et d'une sensibilité remarquables. Les équipes ont adoré la collaboration.",
    date: "Il y a 1 mois",
  },
  {
    name: "Sonia N.",
    role: "Directrice éditoriale, Récits",
    rating: 5,
    text: "Florence ne livre pas juste des maquettes — elle livre une vision. On a transformé notre produit grâce à ce projet.",
    date: "Il y a 3 mois",
  },
];

const SERVICES = [
  {
    num: "01",
    title: "Design UX/UI",
    duration: "12:00",
    tags: ["Recherche utilisateur", "Prototypage", "Tests", "Figma"],
    description:
      "De la recherche aux interfaces finales. Je conçois des expériences qui respectent l'intelligence des gens — avec soin, sans condescendance.",
  },
  {
    num: "02",
    title: "Copywriting UX",
    duration: "08:30",
    tags: ["Microcopy", "Tonalité", "Narration", "Content design"],
    description:
      "Les mots qui habitent vos interfaces. Un copywriting ancré dans l'usage, jamais décoratif. Chaque label, chaque message d'erreur compte.",
  },
  {
    num: "03",
    title: "Intégration Web",
    duration: "06:15",
    tags: ["React", "Figma → Code", "Accessibilité WCAG", "Animation"],
    description:
      "Du pixel au composant. J'intègre mes maquettes en React avec une attention au détail, aux états d'interface et à l'accessibilité.",
  },
];

// ── Components ─────────────────────────────────────────────────────────────────

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="tooltip-wrap relative inline-flex items-center justify-center">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-[10px] text-white opacity-0 transition-opacity duration-200"
        style={{ backgroundColor: "rgba(20,10,4,0.82)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}
      >
        {label}
      </span>
    </div>
  );
}

function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.028,
        mixBlendMode: "multiply" as const,
      }}
    />
  );
}

function ConcentricDivider({ size = 110, padding = true }: { size?: number; padding?: boolean }) {
  const rings = [10, 20, 30, 40, 50, 58];
  const c = size / 2;
  return (
    <div className={`flex justify-center ${padding ? "py-16" : "py-0"}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {rings.map((r) => (
          <circle
            key={r}
            cx={c}
            cy={c}
            r={r * (size / 130)}
            fill="none"
            stroke="rgba(61,43,31,0.11)"
            strokeWidth="0.75"
          />
        ))}
        <circle cx={c} cy={c} r={size * 0.024} fill="rgba(61,43,31,0.22)" />
      </svg>
    </div>
  );
}

function VinylRecord({
  track,
  size = 240,
  spinning = false,
  onClick,
  className = "",
}: {
  track: Track;
  size?: number;
  spinning?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}) {
  const r = size / 2;
  const grooveCount = 18;
  const grooves = Array.from({ length: grooveCount }, (_, i) => {
    return r * 0.32 + i * ((r * 0.6) / grooveCount);
  });

  return (
    <div
      className={`select-none ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        animation: spinning ? "vinylSpin 3.5s linear infinite" : "none",
        willChange: spinning ? "transform" : "auto",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Vinyle — ${track.title}`}>
        <defs>
          <radialGradient id={`sheen-${track.id}`} cx="32%" cy="32%">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="55%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`label-grad-${track.id}`} cx="45%" cy="38%">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        {/* Disc */}
        <circle cx={r} cy={r} r={r - 1} fill="#18100A" />
        {/* Sheen */}
        <circle cx={r} cy={r} r={r - 1} fill={`url(#sheen-${track.id})`} />
        {/* Grooves */}
        {grooves.map((gr, i) => (
          <circle
            key={i}
            cx={r}
            cy={r}
            r={gr}
            fill="none"
            stroke="rgba(255,255,255,0.048)"
            strokeWidth="0.55"
          />
        ))}
        {/* Label circle */}
        <circle cx={r} cy={r} r={r * 0.3} fill={track.color} />
        <circle cx={r} cy={r} r={r * 0.3} fill={`url(#label-grad-${track.id})`} />
        {/* Label text — type */}
        <text
          x={r}
          y={r * 0.78}
          textAnchor="middle"
          fill="rgba(255,255,255,0.88)"
          fontSize={size * 0.048}
          fontFamily="'DM Mono', monospace"
          fontWeight="500"
          letterSpacing="0.05em"
        >
          {track.label.split(" ").slice(0, 1)[0].toUpperCase()}
        </text>
        <text
          x={r}
          y={r * 0.78 + size * 0.054}
          textAnchor="middle"
          fill="rgba(255,255,255,0.6)"
          fontSize={size * 0.038}
          fontFamily="'DM Mono', monospace"
          letterSpacing="0.04em"
        >
          {track.label.split(" ").slice(1).join(" ").toUpperCase()}
        </text>
        {/* Duration */}
        <text
          x={r}
          y={r + size * 0.01}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={size * 0.058}
          fontFamily="'DM Mono', monospace"
          fontWeight="400"
        >
          {track.duration}
        </text>
        {/* Year */}
        <text
          x={r}
          y={r + r * 0.44}
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontSize={size * 0.038}
          fontFamily="'DM Mono', monospace"
        >
          {track.year}
        </text>
        {/* Center hole */}
        <circle cx={r} cy={r} r={r * 0.042} fill="#0D0804" />
      </svg>
    </div>
  );
}

function RevealBlock({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1], delay }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── Navigation ─────────────────────────────────────────────────────────────────
function Nav({ page, navigate }: { page: Page; navigate: NavigateFn }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Collection", page: "collection" },
    { label: "Services", page: "services" },
    { label: "À propos", page: "about" },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Navigation principale"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        paddingTop: scrolled ? "12px" : "24px",
        paddingBottom: scrolled ? "12px" : "24px",
        backgroundColor: scrolled ? "rgba(244,237,225,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(61,43,31,0.08)" : "none",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-8 lg:px-10 flex items-center justify-between">
        {/* Logo mark */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-3 group"
          aria-label="Accueil — Florence Jotham"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <circle cx="13" cy="13" r="12" stroke="#3D2B1F" strokeWidth="1.2" />
            <circle cx="13" cy="13" r="8.5" stroke="#3D2B1F" strokeWidth="0.75" />
            <circle cx="13" cy="13" r="5" stroke="#3D2B1F" strokeWidth="0.6" />
            <circle cx="13" cy="13" r="1.8" fill="#C9502F" />
          </svg>
          <span
            className="text-[#3D2B1F] text-lg font-medium tracking-[-0.025em] transition-opacity duration-200 group-hover:opacity-70"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Florence Jotham
          </span>
        </button>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, page: p }) => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className="nav-link text-sm"
              aria-current={page === p ? "page" : undefined}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: page === p ? "#C9502F" : "#6B5642",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Contact link — discret */}
        <button
          onClick={() => navigate("contact")}
          className="hidden md:block text-sm text-[#6B5642] hover:text-[#3D2B1F] transition-colors duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Contact
        </button>
      </div>
    </nav>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────────
function HomePage({ navigate }: { navigate: NavigateFn }) {
  const [spinningId, setSpinningId] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const heroTracks = TRACKS.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section aria-label="Présentation" className="min-h-screen pt-28 lg:pt-32 pb-20 px-8 lg:px-10 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs text-[#6B5642] tracking-[0.16em] uppercase mb-6"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Designer UX/UI — Paris, France
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="text-[#3D2B1F] text-[2.8rem] lg:text-[4.2rem] xl:text-[4.8rem] font-light leading-[1.07] tracking-[-0.03em] mb-7"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Chaque projet
            <br />
            <em className="not-italic" style={{ color: "#C9502F" }}>
              mérite
            </em>
            <br />
            sa propre piste.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="text-[#6B5642] text-lg font-light leading-relaxed max-w-[420px] mb-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Je conçois des interfaces qui ont de la matière — du son, de la
            texture, du tempo. UX/UI, copywriting, intégration web.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="flex items-center gap-5 flex-wrap"
          >
            <button
              onClick={() => navigate("collection")}
              className="text-sm px-7 py-3.5 rounded-full text-white transition-all duration-300 hover:opacity-90"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: "#C9502F",
              }}
            >
              Écouter la collection
            </button>
            <button
              onClick={() => navigate("about")}
              className="text-sm text-[#6B5642] hover:text-[#3D2B1F] transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              À propos →
            </button>
          </motion.div>
        </div>

        {/* Right — album cover portrait + vinyl */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
          className="relative flex justify-center items-center lg:justify-end"
        >
          {/* Spinning vinyl behind */}
          <div
            className="absolute right-0 lg:right-[-20px] top-[-20px] z-0 opacity-85"
            style={{ animation: "vinylSpin 9s linear infinite" }}
          >
            <VinylRecord track={TRACKS[0]} size={320} />
          </div>

          {/* Album cover sleeve — square vinyl format */}
          <div
            className="relative z-10 w-[280px] lg:w-[320px] aspect-square bg-[#D4C8B8]"
            style={{
              borderRadius: "2px",
              boxShadow: "12px 16px 56px rgba(61,43,31,0.28), 0 2px 8px rgba(61,43,31,0.12)",
            }}
          >
            {/* Photo */}
            <ImageWithFallback
              src={portraitProfil}
              alt="Portrait de Florence Jotham, designer UX/UI"
              className="w-full h-full object-cover object-top"
              style={{ filter: "sepia(10%) contrast(1.05) brightness(0.96)" }}
            />

            {/* Gradient overlay — bottom heavy */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(61,43,31,0.08) 0%, transparent 35%, rgba(20,10,4,0.62) 100%)",
              }}
            />

            {/* Inset sleeve border — detail typique d'une pochette vinyle */}
            <div
              className="absolute inset-[6px] pointer-events-none"
              style={{ border: "1px solid rgba(255,255,255,0.18)", borderRadius: "1px" }}
            />

            {/* Top bar — label + catalogue */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            </div>

            {/* Bottom — artist name + title */}
            <div className="absolute bottom-4 left-4 right-4">
              <p
                className="text-[10px] tracking-[0.16em] uppercase mb-1"
                style={{ fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.6)" }}
              >
                Side A
              </p>
              <h3
                className="text-white text-xl font-light leading-tight tracking-[-0.01em]"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Florence Jotham
              </h3>
              <p
                className="text-sm font-light mt-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.65)" }}
              >
                Designer UX/UI
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Compétences / Outils / Intérêts — Reveal au survol ──────────── */}
      <RevealBlock>
        <section
          aria-label="Compétences, outils et intérêts"
          className="py-10 px-8 lg:px-10 max-w-[1280px] mx-auto"
          onMouseEnter={() => setRevealed(true)}
          onMouseLeave={() => setRevealed(false)}
          onFocus={() => setRevealed(true)}
          onBlur={() => setRevealed(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_1fr] gap-10 lg:gap-8 items-center">

            {/* ── Compétences — glisse depuis la gauche ── */}
            <div
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateX(0)" : "translateX(-32px)",
                transition: "opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)",
              }}
              aria-hidden={!revealed}
            >
              <p className="text-[10px] text-[#6B5642] tracking-[0.16em] uppercase mb-5"
                style={{ fontFamily: "'DM Mono', monospace" }}>Compétences</p>
              <div className="flex flex-col gap-2.5">
                {["Cheffe de projet", "Directrice artistique", "Intégratrice front-end", "UX Designer", "Spécialiste marketing", "Content manager"].map((skill, i) => (
                  <div key={skill} className="flex items-center gap-3">
                    <span className="text-[10px] tabular-nums" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(61,43,31,0.3)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm text-[#3D2B1F]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Animation centre ── */}
            <div className="flex flex-col items-center gap-4">
              {/* Ripple loader */}
              <div className="fj-loader" aria-hidden="true">
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="box" />
                <div className="logo">
                  <svg viewBox="0 0 26 26" fill="none" aria-hidden="true">
                    <circle cx="13" cy="13" r="12" stroke="#3D2B1F" strokeWidth="1.2" />
                    <circle cx="13" cy="13" r="8.5" stroke="#3D2B1F" strokeWidth="0.75" />
                    <circle cx="13" cy="13" r="5" stroke="#3D2B1F" strokeWidth="0.6" />
                    <circle cx="13" cy="13" r="1.8" fill="#C9502F" className="fj-dot" />
                  </svg>
                </div>
              </div>

              {/* Hint — visible quand non révélé */}
              <div
                className="flex flex-col items-center gap-1.5 select-none"
                style={{
                  opacity: revealed ? 0 : 1,
                  transform: revealed ? "translateY(6px)" : "translateY(0)",
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                {/* Icône souris */}
                <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
                  <rect x="1" y="1" width="16" height="22" rx="8" stroke="#B8873C" strokeWidth="1.5"/>
                  <line x1="9" y1="5" x2="9" y2="10" stroke="#B8873C" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p className="text-[10px] tracking-[0.14em] uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "#B8873C" }}>
                  Survolez pour explorer
                </p>
              </div>
            </div>

            {/* ── Intérêts — glisse depuis la droite ── */}
            <div
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateX(0)" : "translateX(32px)",
                transition: "opacity 0.65s 0.1s cubic-bezier(0.22,1,0.36,1), transform 0.65s 0.1s cubic-bezier(0.22,1,0.36,1)",
              }}
              aria-hidden={!revealed}
            >
              <p className="text-[10px] text-[#6B5642] tracking-[0.16em] uppercase mb-5"
                style={{ fontFamily: "'DM Mono', monospace" }}>Intérêts</p>
              <div className="flex flex-wrap gap-2">
                {["Musique", "Retraites bien-être holistiques", "Films David Lynch", "Films Euzhan Palcy", "Diversité & inclusion"].map((item) => (
                  <span
                    key={item}
                    className="text-[11px] px-3 py-1.5 rounded-full"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#6B5642",
                      border: "1px solid rgba(61,43,31,0.18)",
                      backgroundColor: "rgba(61,43,31,0.03)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Outils — remonte depuis le bas ── */}
          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s 0.22s cubic-bezier(0.22,1,0.36,1), transform 0.6s 0.22s cubic-bezier(0.22,1,0.36,1)",
            }}
            className="mt-10 flex flex-col items-center"
            aria-hidden={!revealed}
          >
            <p className="text-[10px] text-[#6B5642] tracking-[0.16em] uppercase mb-6 text-center"
              style={{ fontFamily: "'DM Mono', monospace" }}>Outils</p>
            <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-8">

              <Tooltip label="Figma">
                <svg width="26" height="38" viewBox="0 0 38 57" fill="none" role="img" tabIndex={0} aria-label="Figma">
                  <path d="M19 28.5C19 23.25 23.25 19 28.5 19C33.75 19 38 23.25 38 28.5C38 33.75 33.75 38 28.5 38C23.25 38 19 33.75 19 28.5Z" fill="#1ABCFE"/>
                  <path d="M0 47.5C0 42.25 4.25 38 9.5 38H19V47.5C19 52.75 14.75 57 9.5 57C4.25 57 0 52.75 0 47.5Z" fill="#0ACF83"/>
                  <path d="M19 0V19H28.5C33.75 19 38 14.75 38 9.5C38 4.25 33.75 0 28.5 0H19Z" fill="#FF7262"/>
                  <path d="M0 9.5C0 14.75 4.25 19 9.5 19H19V0H9.5C4.25 0 0 4.25 0 9.5Z" fill="#F24E1E"/>
                  <path d="M0 28.5C0 33.75 4.25 38 9.5 38H19V19H9.5C4.25 19 0 23.25 0 28.5Z" fill="#FF7262"/>
                </svg>
              </Tooltip>

              <Tooltip label="Adobe InDesign">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" role="img" tabIndex={0} aria-label="Adobe InDesign">
                  <rect width="36" height="36" rx="6" fill="#49021F"/>
                  <text x="18" y="26" textAnchor="middle" fill="#FF3BA0" fontSize="15" fontWeight="700" fontFamily="Arial, sans-serif">Id</text>
                </svg>
              </Tooltip>

              <Tooltip label="WordPress">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" role="img" tabIndex={0} aria-label="WordPress">
                  <circle cx="18" cy="18" r="18" fill="#21759B"/>
                  <path d="M3.5 18C3.5 10.5 9.5 4.5 17 4.5L5.5 31.5C4.2 27.9 3.5 23.1 3.5 18ZM27 4.9C28.5 5.9 29.8 7.2 30.8 8.7L24 27L20 16L23.2 9.5C23.8 8.1 24.5 7 25.2 6.1L27 4.9ZM18.5 19.5L22 30.5C20.7 31 19.4 31.3 18 31.3C16.7 31.3 15.4 31 14.2 30.6L18.5 19.5ZM30.8 12C31.7 14 32.3 16.4 32.3 18.8C32.3 23.5 30.4 27.7 27.4 30.7L30.8 12Z" fill="white"/>
                </svg>
              </Tooltip>

              <Tooltip label="Adobe Photoshop">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" role="img" tabIndex={0} aria-label="Adobe Photoshop">
                  <rect width="36" height="36" rx="6" fill="#001E36"/>
                  <text x="18" y="26" textAnchor="middle" fill="#31A8FF" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">Ps</text>
                </svg>
              </Tooltip>

              <Tooltip label="CapCut">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" role="img" tabIndex={0} aria-label="CapCut">
                  <rect width="36" height="36" rx="8" fill="#000000"/>
                  <path d="M18 10L10 18L18 26L26 18L18 10Z" fill="white"/>
                  <circle cx="18" cy="18" r="3" fill="black"/>
                </svg>
              </Tooltip>

              <Tooltip label="Centrix One">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" role="img" tabIndex={0} aria-label="Centrix One">
                  <rect width="36" height="36" rx="8" fill="#1A1A2E"/>
                  <text x="18" y="25" textAnchor="middle" fill="#E94560" fontSize="16" fontWeight="800" fontFamily="Arial, sans-serif">C</text>
                </svg>
              </Tooltip>

              <Tooltip label="Brevo">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" role="img" tabIndex={0} aria-label="Brevo">
                  <rect width="36" height="36" rx="8" fill="#0B996E"/>
                  <path d="M10 11H20C22.8 11 25 13.2 25 16C25 17.5 24.3 18.9 23.2 19.8C24.6 20.7 25.5 22.2 25.5 24C25.5 27 23.2 29 20.3 29H10V11ZM14 17.5H19.5C20.6 17.5 21.5 16.7 21.5 15.7C21.5 14.7 20.6 13.8 19.5 13.8H14V17.5ZM14 26.2H20C21.3 26.2 22.3 25.3 22.3 24.1C22.3 22.9 21.3 22 20 22H14V26.2Z" fill="white"/>
                </svg>
              </Tooltip>
            </div>
          </div>
        </section>
      </RevealBlock>

      {/* Projects preview */}
      <section aria-label="Pistes récentes" className="py-20 px-8 lg:px-10 max-w-[1280px] mx-auto">
        <RevealBlock className="mb-14">
          <div className="flex items-end justify-between">
            <div>
              <p
                className="text-xs text-[#6B5642] tracking-[0.16em] uppercase mb-3"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Pistes récentes
              </p>
              <h2
                className="text-[#3D2B1F] text-4xl font-light tracking-[-0.025em]"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Face A
              </h2>
            </div>
            <button
              onClick={() => navigate("collection")}
              className="text-sm transition-colors duration-200 hover:opacity-70"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#C9502F" }}
            >
              Toute la collection →
            </button>
          </div>
        </RevealBlock>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {heroTracks.map((track, i) => (
            <RevealBlock key={track.id} delay={i * 0.1}>
              <div
                className={`vinyl-card group ${track.inProgress ? "cursor-default" : "cursor-pointer"}`}
                role="article"
                tabIndex={track.inProgress ? -1 : 0}
                onClick={() => !track.inProgress && navigate("track", track.id)}
                onKeyDown={(e) => { if (!track.inProgress && (e.key === "Enter" || e.key === " ")) navigate("track", track.id); }}
              >
                {/* Vinyl card */}
                <div className="relative mb-7 flex justify-center items-center h-[260px]">
                  {/* Sleeve */}
                  <div
                    className="absolute inset-4 overflow-hidden bg-[#D4C8B8]"
                    style={{ borderRadius: "2px" }}
                  >
                    <img
                      src={track.image}
                      alt={`Visuel du projet ${track.title}`}
                      className="w-full h-full object-cover transition-opacity duration-500"
                      style={{ opacity: 0.65, filter: "sepia(10%)", objectPosition: track.imagePosition ?? "center" }}
                    />
                  </div>
                  {/* Vinyl — slides out on hover */}
                  <div
                    className="vinyl-slide relative z-10"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform =
                        "translateX(28px) rotate(8deg)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "none")
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSpinningId(spinningId === track.id ? null : track.id);
                    }}
                  >
                    <VinylRecord
                      track={track}
                      size={210}
                      spinning={spinningId === track.id}
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div
                  className="pt-4"
                  style={{ borderTop: "1px solid rgba(61,43,31,0.1)" }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[10px] tracking-[0.13em] uppercase"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: "#B8873C",
                      }}
                    >
                      {track.type}
                    </span>
                    <span
                      className="text-[10px] text-[#6B5642]"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {track.duration}
                    </span>
                  </div>
                  <h3
                    className="text-[#3D2B1F] text-xl font-medium leading-snug mb-0.5"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {track.title}
                  </h3>
                  <p
                    className="text-sm text-[#6B5642]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {track.client}
                  </p>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── Section avis Google (masquée si SHOW_REVIEWS = false) ── */}
      {SHOW_REVIEWS && (
        <>
          <ConcentricDivider />
          <section className="py-20 px-8 lg:px-10 max-w-[1280px] mx-auto">
            <RevealBlock className="mb-14">
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p
                    className="text-xs text-[#6B5642] tracking-[0.16em] uppercase mb-3"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Ce qu'ils disent
                  </p>
                  <div className="flex items-center gap-4">
                    <h2
                      className="text-[#3D2B1F] text-4xl font-light tracking-[-0.025em]"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      Avis clients
                    </h2>
                    {/* Google badge */}
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{ border: "1px solid rgba(61,43,31,0.15)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span
                        className="text-[10px] text-[#6B5642] tracking-[0.08em]"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        Google — 5,0 ★
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </RevealBlock>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REVIEWS.map((review, i) => (
                <RevealBlock key={i} delay={i * 0.1}>
                  <div
                    className="p-7 h-full flex flex-col justify-between"
                    style={{
                      border: "1px solid rgba(61,43,31,0.1)",
                      borderRadius: "2px",
                      backgroundColor: "#FBF6ED",
                    }}
                  >
                    {/* Stars */}
                    <div>
                      <div className="flex gap-0.5 mb-5">
                        {Array.from({ length: review.rating }).map((_, s) => (
                          <span key={s} style={{ color: "#B8873C", fontSize: "14px" }}>★</span>
                        ))}
                      </div>
                      <p
                        className="text-[#3D2B1F] text-base leading-relaxed mb-6"
                        style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontWeight: 300 }}
                      >
                        "{review.text}"
                      </p>
                    </div>
                    {/* Author */}
                    <div className="flex items-center justify-between pt-5"
                      style={{ borderTop: "1px solid rgba(61,43,31,0.08)" }}>
                      <div>
                        <p
                          className="text-sm text-[#3D2B1F] font-medium"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {review.name}
                        </p>
                        <p
                          className="text-xs text-[#6B5642]"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {review.role}
                        </p>
                      </div>
                      <span
                        className="text-[10px] text-[#6B5642]"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {review.date}
                      </span>
                    </div>
                  </div>
                </RevealBlock>
              ))}
            </div>

            {/* CTA — ici, bien placé après les avis */}
            <RevealBlock delay={0.3} className="mt-16 text-center">
              <p
                className="text-[#3D2B1F] text-2xl font-light mb-6 tracking-[-0.02em]"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Envie de créer quelque chose ensemble ?
              </p>
              <button
                onClick={() => navigate("contact")}
                className="text-sm px-8 py-4 rounded-full text-white transition-all duration-300 hover:opacity-85"
                style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#C9502F" }}
              >
                Travaillons ensemble
              </button>
            </RevealBlock>
          </section>
        </>
      )}

      {/* Footer */}
      <footer
        className="py-14 px-8 lg:px-10 max-w-[1280px] mx-auto"
        style={{ borderTop: "1px solid rgba(61,43,31,0.08)" }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p
              className="text-[#3D2B1F] text-xl font-light mb-1"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Florence Jotham
            </p>
            <p
              className="text-[10px] text-[#6B5642] tracking-[0.12em] uppercase"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Designer UX/UI Freelance — Paris
            </p>
          </div>
         <div className="flex gap-6">
 <a
  href="https://www.linkedin.com/in/florence-jotham"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
>
  <svg
    className="w-5 h-5 inline-block"
    viewBox="0 0 24 24"
    fill="#C9502F"
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
  </svg>
  <span>LinkedIn</span>
</a>
</div>
          <p
            className="text-[10px] text-[#6B5642] tracking-[0.1em]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            © 2026 — Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}

// ── Collection Page ────────────────────────────────────────────────────────────
function CollectionPage({ navigate }: { navigate: NavigateFn }) {
  const [filter, setFilter] = useState("Tous");
  const [spinningId, setSpinningId] = useState<number | null>(null);

  const filtered =
    filter === "Tous" ? TRACKS : TRACKS.filter((t) => t.type === filter);

  return (
    <div className="min-h-screen pt-24 pb-16 px-8 lg:px-10 max-w-[1280px] mx-auto">
      <RevealBlock className="mb-6">
        <p
          className="text-xs text-[#6B5642] tracking-[0.16em] uppercase mb-3"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Discographie
        </p>
        <h1
          className="text-[#3D2B1F] text-5xl lg:text-6xl font-light tracking-[-0.03em]"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          La Collection
        </h1>
      </RevealBlock>

      {/* Filter bar */}
      <RevealBlock delay={0.1} className="mb-10">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par type">
          {TRACK_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              aria-pressed={filter === type}
              className="collection-filter-btn text-[11px] px-4 py-2 rounded-full"
              style={{
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.06em",
                backgroundColor:
                  filter === type ? "#C9502F" : "transparent",
                color: filter === type ? "#F4EDE1" : "#6B5642",
                border:
                  filter === type
                    ? "1px solid #C9502F"
                    : "1px solid rgba(61,43,31,0.2)",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </RevealBlock>

      {/* Vinyl grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-16">
        {filtered.map((track, i) => (
          <RevealBlock key={track.id} delay={i * 0.07}>
            <div
              className={`group ${track.inProgress ? "cursor-default" : "cursor-pointer"}`}
              role="article"
              tabIndex={track.inProgress ? -1 : 0}
              onClick={() => !track.inProgress && navigate("track", track.id)}
              onKeyDown={(e) => { if (!track.inProgress && (e.key === "Enter" || e.key === " ")) navigate("track", track.id); }}
            >
              <div className="relative mb-6 flex justify-center items-center h-[240px]">
                {/* Sleeve background */}
                <div
                  className="absolute inset-3 overflow-hidden bg-[#D4C8B8]"
                  style={{ borderRadius: "2px" }}
                >
                  <img
                    src={track.image}
                    alt={`Visuel du projet ${track.title}`}
                    className="w-full h-full object-cover transition-all duration-500"
                    style={{
                      opacity: track.inProgress ? 0.3 : 0.55,
                      filter: track.inProgress ? "sepia(20%) grayscale(40%)" : "sepia(8%)",
                      objectPosition: track.imagePosition ?? "center",
                    }}
                  />
                </div>

                {/* Badge EN COURS */}
                {track.inProgress && (
                  <div
                    className="absolute top-5 left-5 z-20 px-2.5 py-1 flex items-center gap-1.5"
                    style={{
                      background: "rgba(12,19,39,0.75)",
                      backdropFilter: "blur(6px)",
                      borderRadius: "2px",
                      border: "1px solid rgba(198,161,91,0.35)",
                    }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: "#C6A15B", animation: "pulse 2s ease-in-out infinite" }}
                    />
                    <span
                      className="text-[9px] tracking-[0.18em] uppercase"
                      style={{ fontFamily: "'DM Mono', monospace", color: "#C6A15B" }}
                    >
                      En cours
                    </span>
                  </div>
                )}

                {/* Vinyl */}
                <div
                  className="vinyl-slide relative z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!track.inProgress) setSpinningId(spinningId === track.id ? null : track.id);
                  }}
                  onMouseEnter={(e) => {
                    if (!track.inProgress) e.currentTarget.style.transform = "translateX(22px) rotate(6deg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                  }}
                  style={{ opacity: track.inProgress ? 0.45 : 1 }}
                >
                  <VinylRecord
                    track={track}
                    size={190}
                    spinning={spinningId === track.id}
                  />
                </div>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3
                    className="text-lg font-medium leading-snug mb-0.5"
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      color: track.inProgress ? "rgba(61,43,31,0.45)" : "#3D2B1F",
                    }}
                  >
                    {track.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: track.inProgress ? "rgba(107,86,66,0.5)" : "#6B5642",
                    }}
                  >
                    {track.client}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-[10px] tracking-[0.1em] uppercase mb-0.5"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      color: track.inProgress ? "rgba(184,135,60,0.45)" : "#B8873C",
                    }}
                  >
                    {track.type}
                  </p>
                </div>
              </div>
            </div>
          </RevealBlock>
        ))}
      </div>
    </div>
  );
}

// ── Track Detail Page ──────────────────────────────────────────────────────────
const TRACK_NARRATIVES: Record<number, { intro: string; contexte: string; refrain: string; outro: string }> = {
  1: {
    intro:
      "Duranville est arrivé avec une conviction forte : créer une marque de mode qui porte l'esprit des Antilles sans folklore ni exotisme. Ma mission — traduire cette ambition en une expérience web aussi affirmée que l'identité de la marque.",
    contexte:
      "Étude des codes visuels de la mode caribéenne contemporaine, benchmark des plateformes e-commerce haut de gamme, ateliers de co-conception avec les fondateurs. L'enjeu : rendre la flamboyance élégante, pas bruyante.",
    refrain:
      '"On ne fait pas de la mode martiniquaise. On fait de la mode, tout court — qui se trouve être martiniquaise."',
    outro:
      "Un site qui assume sa palette jaune solaire sans compromis, une navigation fluide sur tous les formats, et une identité visuelle cohérente du logo au footer. Le projet a posé les bases d'une vraie marque digitale.",
  },
  2: {
    intro:
      "Le Club Saint-James de Montréal est une institution fondée en 1857. La direction souhaitait rajeunir son image pour séduire une nouvelle génération de membres sans aliéner ceux qui portent l'histoire du club. Une refonte d'identité, pas une révolution.",
    contexte:
      "Immersion dans les archives visuelles du club, entretiens avec la direction et des membres de longue date, étude des grandes institutions nord-américaines qui ont réussi leur mue. L'enjeu : moderniser sans effacer — remplacer le noir historique par un bleu marine profond, ancrer l'or dans le contemporain.",
    refrain:
      '"Une identité plus que centenaire, réécrite pour aujourd\'hui."',
    outro:
      "Une charte graphique complète — palette navy & or, typographies Bricolage Grotesque et Space Mono, monogramme, motifs et applications digitales. Le club dispose désormais d'un système visuel cohérent, prestige et ouvert.",
  },
};

const TIMESTAMPS = [
  {
    time: "00:00",
    label: "Intro",
    heading: "La commande",
    body: (client: string, id: number) =>
      TRACK_NARRATIVES[id]?.intro ??
      `${client} est venu avec une conviction et peu de certitudes. Ma première mission : questionner, creuser, reformuler — avant de dessiner le moindre pixel.`,
  },
  {
    time: "00:45",
    label: "Contexte",
    heading: "Comprendre le terrain",
    body: (_client: string, id: number) =>
      TRACK_NARRATIVES[id]?.contexte ??
      "Entretiens utilisateurs, analyse concurrentielle, cartographie des flux existants. Un mois d'immersion pour comprendre ce que les données ne racontent pas.",
  },
  {
    time: "03:45",
    label: "Outro",
    heading: "Ce que le projet a produit",
    body: (_client: string, id: number) =>
      TRACK_NARRATIVES[id]?.outro ??
      "Les métriques ont suivi, mais ce qui compte davantage : l'équipe a changé sa façon de penser le produit. Un héritage plus durable que n'importe quel chiffre.",
  },
];

function BrandDossierIframe({ htmlContent }: { htmlContent: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    if (!hintVisible) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const hide = () => setHintVisible(false);

    const attach = () => {
      try {
        iframe.contentWindow?.addEventListener("scroll", hide, { once: true, passive: true });
      } catch {}
    };

    iframe.addEventListener("load", attach);
    attach();
    return () => iframe.removeEventListener("load", attach);
  }, [hintVisible]);

  return (
    <>
      <style>{`
        @keyframes csjDotDrop {
          0%   { transform: translate(-50%, 0);   opacity: 1; }
          60%  { transform: translate(-50%, 12px); opacity: 0.6; }
          100% { transform: translate(-50%, 0);   opacity: 1; }
        }
        @keyframes csjMouseFade {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>
      <div
        className="w-full overflow-hidden relative"
        style={{
          borderRadius: "2px",
          boxShadow: "0 8px 48px rgba(22,33,61,0.14), 0 1px 0 rgba(198,161,91,0.25)",
          border: "1px solid rgba(198,161,91,0.2)",
        }}
      >
        <iframe
          ref={iframeRef}
          srcDoc={htmlContent}
          title="Dossier d'identité de marque — Club Saint-James de Montréal"
          className="w-full border-0 block"
          style={{ height: "860px" }}
          sandbox="allow-same-origin"
        />

        {/* Scroll hint — disparaît dès le premier scroll dans l'iframe */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-700"
          style={{ opacity: hintVisible ? 1 : 0 }}
          aria-hidden="true"
        >
          {/* Halo derrière l'indicateur */}
          <div
            className="flex flex-col items-center gap-2 px-6 py-5 rounded-xl"
            style={{
              background: "rgba(12,19,39,0.55)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.35)",
              animation: "csjMouseFade 2.4s ease-in-out infinite",
            }}
          >
            {/* Mouse outline — couleurs CSJ gold */}
            <div
              style={{
                width: 36,
                height: 56,
                border: "2px solid rgba(198,161,91,0.9)",
                borderRadius: 18,
                position: "relative",
              }}
            >
              {/* Dot animé */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "rgba(198,161,91,0.95)",
                  position: "absolute",
                  left: "50%",
                  top: 10,
                  animation: "csjDotDrop 1.5s ease-in-out infinite",
                }}
              />
            </div>
            <span
              className="text-[10px] tracking-[0.14em] uppercase"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: "rgba(198,161,91,0.85)",
              }}
            >
              Défiler
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function PrototypeModal({ url, htmlContent, title, color, onClose }: { url: string; htmlContent?: string; title: string; color: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ backgroundColor: "rgba(20,10,4,0.88)", backdropFilter: "blur(6px)" }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ backgroundColor: "#1A1008", borderBottom: `2px solid ${color}` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span
            className="text-sm tracking-[0.08em]"
            style={{ fontFamily: "'DM Mono', monospace", color: "rgba(251,246,237,0.8)" }}
          >
            {title} — Prototype
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs px-4 py-2 rounded-full transition-all duration-200"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(251,246,237,0.7)",
            border: "1px solid rgba(251,246,237,0.2)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(251,246,237,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(251,246,237,0.2)")}
        >
          Fermer ✕
        </button>
      </div>
      {/* iframe — srcdoc injecte le HTML directement, sans dépendre d'une URL */}
      <iframe
        {...(htmlContent ? { srcDoc: htmlContent } : { src: url })}
        title={title}
        className="flex-1 w-full border-0"
        style={{ backgroundColor: "#FBF8F1" }}
      />
    </div>
  );
}

const DA_PAGES = [
  { src: daPage1 as unknown as string, label: "Couverture", caption: "Direction artistique" },
  { src: daPage2 as unknown as string, label: "Positionnement", caption: "Notre univers narratif" },
  { src: daPage3 as unknown as string, label: "Identité visuelle", caption: "Palette chromatique" },
  { src: daPage4 as unknown as string, label: "Identité visuelle", caption: "Typographie" },
  { src: daPage5 as unknown as string, label: "Signature graphique", caption: "La carte olfactive" },
  { src: daPage6 as unknown as string, label: "Applications", caption: "Le digital" },
  { src: daPage7 as unknown as string, label: "Ton de marque", caption: "Voix & écriture" },
];

function DuranvilleGallery() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [animating, setAnimating] = useState(false);
  const total = DA_PAGES.length;

  const go = (next: number, direction: 1 | -1) => {
    if (animating || next === current) return;
    setDir(direction);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimating(false);
    }, 320);
  };

  const prev = () => go((current - 1 + total) % total, -1);
  const next = () => go((current + 1) % total, 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, animating]);

  const page = DA_PAGES[current];

  return (
    <RevealBlock>
      <section
        aria-label="Direction artistique Duranville"
        className="py-16 px-8 lg:px-10 max-w-[1280px] mx-auto"
      >
        {/* En-tête */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <p className="text-[10px] text-[#6B5642] tracking-[0.16em] uppercase mb-2"
              style={{ fontFamily: "'DM Mono', monospace" }}>
              Document de référence
            </p>
            <h2 className="text-[#3D2B1F] text-2xl font-light tracking-[-0.02em]"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              Direction artistique
            </h2>
          </div>
          <span className="text-[11px] tabular-nums"
            style={{ fontFamily: "'DM Mono', monospace", color: "rgba(61,43,31,0.35)" }}>
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Visionneuse principale */}
        <div
          className="relative overflow-hidden bg-[#0E0E0E] mb-4"
          style={{ borderRadius: "2px", boxShadow: "0 8px 48px rgba(20,10,4,0.22)" }}
        >
          {/* Image avec animation de glissement */}
          <div
            className="relative"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? `translateX(${dir * 24}px)` : "translateX(0)",
              transition: "opacity 0.32s ease, transform 0.32s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <img
              src={page.src}
              alt={`${page.caption} — page ${current + 1}`}
              className="w-full block"
              style={{ maxHeight: "80vh", objectFit: "contain", objectPosition: "center" }}
            />
          </div>

          {/* Overlay caption bas */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 py-4"
            style={{
              background: "linear-gradient(to top, rgba(14,14,14,0.72) 0%, transparent 100%)",
              opacity: animating ? 0 : 1,
              transition: "opacity 0.32s ease",
            }}
          >
            <div>
              <p className="text-[9px] tracking-[0.16em] uppercase mb-0.5"
                style={{ fontFamily: "'DM Mono', monospace", color: "rgba(245,197,24,0.7)" }}>
                {page.label}
              </p>
              <p className="text-white text-sm font-light"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                {page.caption}
              </p>
            </div>
          </div>

          {/* Flèches de navigation */}
          <button
            onClick={prev}
            aria-label="Page précédente"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
            style={{ backgroundColor: "rgba(14,14,14,0.55)", border: "1px solid rgba(255,255,255,0.12)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(245,197,24,0.18)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(14,14,14,0.55)")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Page suivante"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
            style={{ backgroundColor: "rgba(14,14,14,0.55)", border: "1px solid rgba(255,255,255,0.12)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(245,197,24,0.18)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(14,14,14,0.55)")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 12l4-4-4-4" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Bande de thumbnails */}
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Pages de la direction artistique"
          style={{ scrollbarWidth: "none" }}
        >
          {DA_PAGES.map((p, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`${p.caption} — page ${i + 1}`}
              onClick={() => go(i, i > current ? 1 : -1)}
              className="flex-shrink-0 relative overflow-hidden transition-all duration-200"
              style={{
                width: 72, height: 52,
                borderRadius: "2px",
                outline: i === current ? "2px solid #F5C518" : "1px solid rgba(61,43,31,0.14)",
                outlineOffset: i === current ? "2px" : "0",
                opacity: i === current ? 1 : 0.52,
              }}
            >
              <img
                src={p.src}
                alt={p.caption}
                className="w-full h-full object-cover"
                style={{ filter: "sepia(5%)" }}
              />
            </button>
          ))}
        </div>
      </section>
    </RevealBlock>
  );
}

function TrackPage({
  track,
  navigate,
}: {
  track: Track;
  navigate: NavigateFn;
}) {
  const [progress, setProgress] = useState(0);
  const [showPrototype, setShowPrototype] = useState(false);
  const nextTrack = TRACKS[(TRACKS.findIndex((t) => t.id === track.id) + 1) % TRACKS.length];

  useEffect(() => {
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? scrollTop / total : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {showPrototype && track.url && (
        <PrototypeModal
          url={track.url}
          htmlContent={track.htmlContent}
          title={track.title}
          color={track.color}
          onClose={() => setShowPrototype(false)}
        />
      )}
    <div>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px]"
        style={{ backgroundColor: "rgba(61,43,31,0.08)" }}
      >
        <div
          className="h-full transition-all duration-75 ease-linear"
          style={{ width: `${progress * 100}%`, backgroundColor: track.color }}
        />
      </div>

      {/* Hero */}
      <section className="pt-32 pb-20 px-8 lg:px-10 max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-xs text-[#6B5642] tracking-[0.16em] uppercase mb-5"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {track.type} — {track.year} — {track.client}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
            <div>
              <h1
                className="text-[#3D2B1F] text-5xl lg:text-[3.8rem] font-light tracking-[-0.03em] leading-[1.06] mb-7"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {track.title}
              </h1>
              <p
                className="text-[#6B5642] text-lg font-light leading-relaxed max-w-[540px]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {track.description}
              </p>
              {/* Meta strip */}
              <div
                className="mt-10 pt-8"
                style={{ borderTop: "1px solid rgba(61,43,31,0.1)" }}
              >
                <div className="flex flex-wrap gap-8 mb-8">
                  {[
                    { label: "Client", value: track.client },
                    { label: "Durée", value: track.duration },
                    { label: "Année", value: track.year },
                    { label: "Type", value: track.type },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p
                        className="text-[10px] text-[#6B5642] tracking-[0.12em] uppercase mb-1.5"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-sm text-[#3D2B1F] font-medium"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bouton prototype — ouvre une modale iframe */}
                {track.url && (
                  <button
                    onClick={() => setShowPrototype(true)}
                    className="inline-flex items-center gap-3 text-sm px-6 py-3 rounded-full transition-all duration-300"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      border: `1px solid ${track.color}`,
                      color: track.color,
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = track.color;
                      (e.currentTarget as HTMLButtonElement).style.color = "#1A1008";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = track.color;
                    }}
                  >
                    <span>Voir le prototype</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Vinyl */}
            <div className="flex justify-center lg:justify-end pt-4">
              <div style={{ animation: "vinylSpin 5.5s linear infinite" }}>
                <VinylRecord track={track} size={260} />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Direction artistique — Duranville uniquement ── */}
      {track.id === 1 && <DuranvilleGallery />}

      {/* ── Dossier de marque — Club Saint-James uniquement ── */}
      {track.id === 2 && track.htmlContent && (
        <RevealBlock>
          <section aria-label="Dossier d'identité de marque — Club Saint-James" className="py-16 px-8 lg:px-10 max-w-[1280px] mx-auto">
            <div className="mb-8">
              <p className="text-[10px] text-[#6B5642] tracking-[0.16em] uppercase mb-2"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                Dossier de marque
              </p>
              <h2 className="text-[#3D2B1F] text-2xl font-light tracking-[-0.02em]"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                Identité visuelle complète
              </h2>
            </div>
            <BrandDossierIframe htmlContent={track.htmlContent} />
          </section>
        </RevealBlock>
      )}

      {/* Cover image */}
      <div className="w-full h-[420px] lg:h-[520px] overflow-hidden bg-[#D4C8B8]">
        <img
          src={track.image.startsWith("http") ? `${track.image.split("?")[0]}?w=1400&h=520&fit=crop&auto=format` : track.image}
          alt={`Visuel du projet ${track.title}`}
          className="w-full h-full object-cover"
          style={{ filter: "sepia(8%) contrast(1.03) brightness(0.97)", objectPosition: track.id === 2 ? "center 40%" : (track.imagePosition ?? "center") }}
        />
      </div>

      {/* Narrative sections */}
      <div className="max-w-[1280px] mx-auto px-8 lg:px-10">
        <ConcentricDivider />

        {/* Timestamps */}
        {TIMESTAMPS.map((ts, i) => (
          <RevealBlock key={ts.time} delay={0.05} className="mb-20">
            <div
              className="grid items-start gap-10"
              style={{ gridTemplateColumns: "90px 1fr" }}
            >
              <span
                className="text-2xl font-light pt-0.5"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: "rgba(61,43,31,0.18)",
                }}
              >
                {ts.time}
              </span>
              <div>
                <p
                  className="text-[10px] tracking-[0.15em] uppercase mb-4"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color: "#6B5642",
                  }}
                >
                  {ts.label} — {ts.heading}
                </p>
                <p
                  className="text-[#6B5642] leading-relaxed text-base max-w-[600px]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {ts.body(track.client, track.id)}
                </p>
              </div>
            </div>
          </RevealBlock>
        ))}

        {/* Refrain block */}
        <RevealBlock className="mb-20">
          <div
            className="p-10 lg:p-16"
            style={{
              backgroundColor: track.color + "14",
              borderLeft: `3px solid ${track.color}`,
              borderRadius: "2px",
            }}
          >
            <div className="flex items-start gap-8">
              <span
                className="text-2xl font-light flex-shrink-0 pt-1"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: "rgba(61,43,31,0.2)",
                }}
              >
                02:15
              </span>
              <div>
                <p
                  className="text-[10px] tracking-[0.15em] uppercase mb-5"
                  style={{ fontFamily: "'DM Mono', monospace", color: track.color }}
                >
                  ♪ Refrain — L'idée forte
                </p>
                <blockquote
                  className="text-[#3D2B1F] text-2xl lg:text-4xl font-light leading-[1.22] tracking-[-0.02em]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic" }}
                >
                  {TRACK_NARRATIVES[track.id]?.refrain ??
                    '"L\'interface n\'est pas un écran — c\'est une conversation entre deux intelligences."'}
                </blockquote>
              </div>
            </div>
          </div>
        </RevealBlock>

        <ConcentricDivider />

        {/* Next track */}
        <RevealBlock className="pb-16">
          <div
            className={`group flex items-center justify-between p-8 transition-all duration-300 ${nextTrack.inProgress ? "cursor-default" : "cursor-pointer"}`}
            style={{
              border: "1px solid rgba(61,43,31,0.1)",
              borderRadius: "2px",
            }}
            onClick={() => !nextTrack.inProgress && navigate("track", nextTrack.id)}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(61,43,31,0.28)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(61,43,31,0.1)")
            }
          >
            <div>
              <p
                className="text-[10px] text-[#6B5642] tracking-[0.12em] uppercase mb-2"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Piste suivante
              </p>
              <h3
                className="text-[#3D2B1F] text-2xl font-light"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {nextTrack.title}
              </h3>
            </div>
            <div className="transition-transform duration-300 group-hover:translate-x-1">
              <VinylRecord track={nextTrack} size={80} />
            </div>
          </div>
        </RevealBlock>
      </div>
    </div>
    </>
  );
}

// ── Services Page ──────────────────────────────────────────────────────────────
function ServicesPage({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-screen pt-28 pb-24 px-8 lg:px-10 max-w-[1280px] mx-auto">
      <RevealBlock className="mb-14">
        <p
          className="text-xs text-[#6B5642] tracking-[0.16em] uppercase mb-4"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Tracklist
        </p>
        <h1
          className="text-[#3D2B1F] text-5xl lg:text-6xl font-light tracking-[-0.03em]"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Ce que je joue
        </h1>
      </RevealBlock>

      {/* Tracklist */}
      <div className="mb-20">
        {SERVICES.map((svc, i) => (
          <RevealBlock key={svc.num} delay={i * 0.1}>
            <div
              className="tracklist-row group py-10 grid items-start gap-8 cursor-default"
              style={{
                borderBottom: "1px solid rgba(61,43,31,0.1)",
                gridTemplateColumns: "56px 1fr auto",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                  "rgba(61,43,31,0.02)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                  "transparent")
              }
            >
              <span
                className="text-2xl font-light pt-0.5"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: "rgba(61,43,31,0.18)",
                }}
              >
                {svc.num}
              </span>

              <div>
                <div className="flex items-baseline gap-4 mb-3">
                  <h3
                    className="text-[#3D2B1F] text-3xl font-light"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {svc.title}
                  </h3>
                  <span
                    className="text-[10px] text-[#6B5642]"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {svc.duration}
                  </span>
                </div>
                <p
                  className="text-[#6B5642] leading-relaxed max-w-[560px] mb-5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {svc.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {svc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-[#6B5642] px-3 py-1 rounded-full tracking-[0.07em]"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        border: "1px solid rgba(61,43,31,0.18)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <span
                className="text-[#C9502F] pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px" }}
              >
                →
              </span>
            </div>
          </RevealBlock>
        ))}
      </div>

      <ConcentricDivider />

      {/* CTA */}
      <RevealBlock>
        <div className="text-center py-10">
          <p
            className="text-[#3D2B1F] text-3xl lg:text-4xl font-light mb-8 tracking-[-0.02em]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Envie de créer quelque chose ensemble?
          </p>
          <button
            onClick={() => navigate("contact")}
            className="text-sm px-9 py-4 rounded-full text-white transition-all duration-300 hover:opacity-85"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              backgroundColor: "#C9502F",
            }}
          >
            Commençons la conversation
          </button>
        </div>
      </RevealBlock>
    </div>
  );
}

// ── About Page ─────────────────────────────────────────────────────────────────
function AboutPage({ navigate }: { navigate: NavigateFn }) {
  const principles = [
    {
      num: "01",
      title: "La lenteur d'abord",
      text: "Je prends le temps de comprendre avant de concevoir. Chaque projet commence par une phase d'écoute active.",
    },
    {
      num: "02",
      title: "Le détail comme soin",
      text: "Les micro-interactions, les transitions, le microcopy — ce sont eux qui font qu'un produit est humain.",
    },
    {
      num: "03",
      title: "La collaboration vraie",
      text: "Je travaille avec les équipes, pas pour elles. Mes livrables sont des conversations, pas des verdicts.",
    },
    {
      num: "04",
      title: "La matière plutôt que le style",
      text: "Je ne chasse pas les tendances. Je cherche ce qui fait sens pour ce produit, cet usage, ces gens.",
    },
  ];

  const paragraphs = [
    "Je suis designer UX/UI freelance basée à Paris. Je travaille à l'intersection du design, de l'écriture et du code — parce qu'un bon produit ne peut pas se permettre d'ignorer l'une ou l'autre de ces dimensions.",
    "J'affectionne les projets qui racontent une histoire, une vraie ! Un récit qui embarque des émotions et qui fait vibrer.",
    "Cette façon de travailler, je la dois en partie à mes racines — une double culture afro-caribéenne et amérindienne — qui m'a appris qu'une vibration, une fréquence alignée portent autant de sens que n'importe quel framework UX.",
    "Avant de devenir designer, j'ai été conceptrice-rédactrice audio et cheffe de projet en communication, ce qui m'a permis d'affûter mon instinct créatif et mon goût pour le travail d'équipe.",
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 px-8 lg:px-10 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 lg:gap-24">
        {/* Left content */}
        <div>
          <RevealBlock className="mb-12">
            <h1
              className="text-[#3D2B1F] text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.05]"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Florence Jotham
            </h1>
          </RevealBlock>

          <div className="space-y-7 max-w-[560px] mb-16">
            {paragraphs.map((text, i) => (
              <RevealBlock key={i} delay={i * 0.1}>
                <p
                  className="text-[#6B5642] text-lg font-light leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {text}
                </p>
              </RevealBlock>
            ))}
          </div>

          <ConcentricDivider />

          <RevealBlock>
            <h2
              className="text-[#3D2B1F] text-3xl font-light mb-10 tracking-[-0.02em]"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Ma façon de travailler
            </h2>
          </RevealBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {principles.map((item, i) => (
              <RevealBlock key={i} delay={i * 0.08}>
                <div
                  className="p-6"
                  style={{
                    border: "1px solid rgba(61,43,31,0.1)",
                    borderRadius: "2px",
                  }}
                >
                  <p
                    className="text-[10px] tracking-[0.12em] mb-3"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      color: "#B8873C",
                    }}
                  >
                    {item.num}
                  </p>
                  <h3
                    className="text-[#3D2B1F] text-xl font-medium mb-2"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-[#6B5642] leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.text}
                  </p>
                </div>
              </RevealBlock>
            ))}
          </div>

          <RevealBlock className="mt-14">
            <button
              onClick={() => navigate("contact")}
              className="text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:opacity-85"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: "#C9502F",
                color: "#FBF6ED",
              }}
            >
              Travaillons ensemble →
            </button>
          </RevealBlock>
        </div>

        {/* Right — sticky portrait */}
        <div className="lg:pt-20">
          <RevealBlock>
            <div className="sticky top-28">
              {/* Portrait */}
              <div className="relative mb-6">
                <div
                  className="w-full aspect-square overflow-hidden bg-[#D4C8B8]"
                  style={{
                    borderRadius: "2px",
                    boxShadow: "14px 18px 56px rgba(61,43,31,0.2)",
                  }}
                >
                  <ImageWithFallback
                    src={portraitEditorial}
                    alt="Portrait de Florence Jotham — photo éditoriale"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "top center", filter: "contrast(1.04) brightness(0.97)" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 55%, rgba(61,43,31,0.45) 100%)",
                    }}
                  />
                  <div className="absolute bottom-5 left-5">
                    <p
                      className="text-[10px] tracking-[0.12em] uppercase mb-0.5"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: "rgba(251,246,237,0.82)",
                      }}
                    >
                      Florence Jotham
                    </p>
                  </div>
                </div>
                {/* Small vinyl peeking */}
                <div
                  className="absolute -right-4 -top-5 opacity-75"
                  style={{ animation: "vinylSpin 7s linear infinite" }}
                >
                  <VinylRecord track={TRACKS[1]} size={90} />
                </div>
              </div>
{/* Links */}
{/* Links */}
              <div>
                {[
                  {
                    id: "linkedin",
                    label: (
                      <span className="flex items-center gap-2">
                        {/* Logo LinkedIn Vectoriel Native React */}
                        <svg
                          className="w-5 h-5 inline-block"
                          viewBox="0 0 24 24"
                          fill="#C9502F"
                          aria-hidden="true"
                        >
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                        </svg>
                        <span>LinkedIn</span>
                      </span>
                    ),
                    url: "https://www.linkedin.com/in/florence-jotham",
                  },
  /*
                  {
                    id: "email",
                    label: "jotham.florence@gmail.com",
                    url: "mailto:jotham.florence@gmail.com",
                  },*/
                ].map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.url.startsWith("mailto:") ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-3 hover:opacity-80 transition-opacity cursor-pointer block"
                    style={{ borderBottom: "1px solid rgba(61,43,31,0.08)" }}
                  >
                    <span
                      className="text-sm text-[#6B5642]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {link.label}
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: "#B8873C",
                      }}
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </RevealBlock>
        </div>
      </div>
    </div>
  );
}             
// ── Contact Page ───────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    project: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle = {
    fontFamily: "'DM Sans', sans-serif",
    color: "#3D2B1F",
    fontSize: "14px",
    backgroundColor: "transparent",
    outline: "none",
    borderBottom: "1px solid rgba(61,43,31,0.2)",
    width: "100%",
    padding: "12px 0",
    transition: "border-color 0.2s ease",
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-8 lg:px-10 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-20 lg:gap-28 items-start">
        {/* Left */}
        <div>
          <RevealBlock className="mb-12">
            <p
              className="text-xs text-[#6B5642] tracking-[0.16em] uppercase mb-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Contact
            </p>
            <h1
              className="text-[#3D2B1F] text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.1]"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Lançons
              <br />
              <em className="not-italic" style={{ color: "#C9502F" }}>
                la conversation.
              </em>
            </h1>
          </RevealBlock>

          <RevealBlock delay={0.14} className="mb-12">
            <p
              className="text-[#6B5642] text-lg font-light leading-relaxed max-w-[400px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Je travaille avec quelques clients à la fois, pour m'investir
              pleinement. Dites-moi ce que vous construisez.
            </p>
          </RevealBlock>

          <RevealBlock delay={0.24}>
            <div>
              {[
                { label: "Email", value: "hello@florencejotham.fr" },
                { label: "Disponibilité", value: "Mars 2027 →" },
                { label: "Localisation", value: "Paris (remote ok)" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-8 py-4"
                  style={{ borderBottom: "1px solid rgba(61,43,31,0.08)" }}
                >
                  <span
                    className="text-[10px] text-[#6B5642] tracking-[0.12em] uppercase w-28"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-sm text-[#3D2B1F]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </RevealBlock>
        </div>

        {/* Right — form */}
        <RevealBlock delay={0.18}>
          {sent ? (
            <div className="py-20 text-center" role="alert" aria-live="polite">
              <div className="mb-8 flex justify-center">
                <div style={{ animation: "vinylSpin 3.5s linear infinite" }}>
                  <VinylRecord track={TRACKS[0]} size={110} />
                </div>
              </div>
              <h3
                className="text-[#3D2B1F] text-2xl font-light mb-3"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Message reçu.
              </h3>
              <p
                className="text-[#6B5642]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Je reviens vers vous dès que possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              {[
                { id: "name", label: "Nom", type: "text", placeholder: "Votre nom" },
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "votre@email.fr",
                },
                {
                  id: "project",
                  label: "Projet",
                  type: "text",
                  placeholder: "En quelques mots...",
                },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="block text-[10px] text-[#6B5642] tracking-[0.12em] uppercase mb-2"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={form[id as keyof typeof form]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [id]: e.target.value }))
                    }
                    required
                    aria-required="true"
                    style={inputStyle}
                    onFocus={(e) =>
                      ((e.currentTarget as HTMLInputElement).style.borderBottomColor =
                        "#3D2B1F")
                    }
                    onBlur={(e) =>
                      ((e.currentTarget as HTMLInputElement).style.borderBottomColor =
                        "rgba(61,43,31,0.2)")
                    }
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] text-[#6B5642] tracking-[0.12em] uppercase mb-2"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Décrivez votre projet et vos attentes..."
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  required
                  aria-required="true"
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLTextAreaElement).style.borderBottomColor =
                      "#3D2B1F")
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLTextAreaElement).style.borderBottomColor =
                      "rgba(61,43,31,0.2)")
                  }
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full text-sm py-4 rounded-full transition-all duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    backgroundColor: "#3D2B1F",
                    color: "#F4EDE1",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#C9502F")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#3D2B1F")
                  }
                >
                  Envoyer le message
                </button>
              </div>
            </form>
          )}
        </RevealBlock>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedTrack, setSelectedTrack] = useState<Track>(TRACKS[0]);

  const navigate = useCallback<NavigateFn>((p, trackId) => {
    if (trackId !== undefined) {
      const t = TRACKS.find((tr) => tr.id === trackId);
      if (t) setSelectedTrack(t);
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Note: the host HTML element should have lang="fr" set on <html>
  return (
    <div className="bg-[#F4EDE1] min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#C9502F] focus:text-white focus:text-sm"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Aller au contenu principal
      </a>
      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        ::placeholder { color: #B8A898; font-family: 'DM Sans', sans-serif; }

        /* ── Transitions globales ─────────────────────────────────────── */

        /* Tous les boutons : légère compression au clic */
        button, a {
          transition: transform 0.15s ease, opacity 0.2s ease, background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }
        button:active, a:active {
          transform: scale(0.97);
          opacity: 0.85;
        }

        /* Nav links — soulignement qui glisse de gauche à droite */
        .nav-link {
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -1px;
          width: 0; height: 1px;
          background: currentColor;
          transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link:active::after { width: 100%; }

        /* Cartes vinyle — lift subtil au hover */
        .vinyl-card {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.4s ease;
        }
        .vinyl-card:hover {
          transform: translateY(-4px);
        }

        /* Vinyle qui glisse de la pochette */
        .vinyl-slide {
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Boutons pill — glow subtil au focus clavier */
        button:focus-visible, a:focus-visible {
          outline: 2px solid #C9502F;
          outline-offset: 3px;
          border-radius: 999px;
        }

        /* ── Ripple loader — ADN terracotta ──────────────────────────────── */
        .fj-loader {
          --size: 200px;
          --dur: 2.6s;
          height: var(--size);
          aspect-ratio: 1;
          position: relative;
          flex-shrink: 0;
        }
        .fj-loader .box {
          position: absolute;
          background: linear-gradient(160deg, rgba(201,80,47,0.06) 0%, rgba(184,135,60,0.05) 100%);
          border-radius: 50%;
          border-top: 1px solid rgba(201,80,47,1);
          box-shadow: rgba(61,43,31,0.12) 0px 10px 14px 0px;
          backdrop-filter: blur(3px);
          animation: fjRipple var(--dur) infinite ease-in-out;
        }
        .fj-loader .box:nth-child(1) { inset: 40%; z-index: 99; }
        .fj-loader .box:nth-child(2) { inset: 30%; z-index: 98; border-color: rgba(201,80,47,0.75); animation-delay: 0.22s; }
        .fj-loader .box:nth-child(3) { inset: 20%; z-index: 97; border-color: rgba(201,80,47,0.5);  animation-delay: 0.44s; }
        .fj-loader .box:nth-child(4) { inset: 10%; z-index: 96; border-color: rgba(184,135,60,0.35); animation-delay: 0.66s; }
        .fj-loader .box:nth-child(5) { inset: 0%;  z-index: 95; border-color: rgba(184,135,60,0.18); animation-delay: 0.88s; }
        .fj-loader .logo {
          position: absolute; inset: 0;
          display: grid; place-content: center;
          padding: 32%; z-index: 100;
        }
        .fj-dot {
          animation: fjDot var(--dur) infinite ease-in-out;
        }
        @keyframes fjRipple {
          0%   { transform: scale(1);    box-shadow: rgba(61,43,31,0.12) 0px 10px 14px 0px; }
          50%  { transform: scale(1.22); box-shadow: rgba(201,80,47,0.18) 0px 26px 22px 0px; }
          100% { transform: scale(1);    box-shadow: rgba(61,43,31,0.12) 0px 10px 14px 0px; }
        }
        @keyframes fjDot {
          0%,100% { fill: #C9502F; }
          50%      { fill: #B8873C; }
        }

        /* Boutons filtre Collection */
        .collection-filter-btn {
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }

        /* Liens texte discrets */
        .text-link {
          position: relative;
          transition: color 0.2s ease;
        }
        .text-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -1px;
          width: 0; height: 1px;
          background: #C9502F;
          transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .text-link:hover { color: #C9502F; }
        .text-link:hover::after { width: 100%; }

        /* Lignes de tracklist services */
        .tracklist-row {
          transition: background-color 0.25s ease, padding-left 0.3s ease;
        }
        .tracklist-row:hover { padding-left: 8px; }

        /* Tooltip */
        .tooltip-wrap:hover span[role="tooltip"] { opacity: 1; }
        .tooltip-wrap:focus-within span[role="tooltip"] { opacity: 1; }
      `}</style>

      <GrainOverlay />
      <Nav page={page} navigate={navigate} />

      <main id="main-content" tabIndex={-1}>
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "collection" && <CollectionPage navigate={navigate} />}
        {page === "track" && <TrackPage track={selectedTrack} navigate={navigate} />}
        {page === "services" && <ServicesPage navigate={navigate} />}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "contact" && <ContactPage />}
      </main>
    </div>
  );
}
