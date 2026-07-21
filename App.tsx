import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import portraitProfil from "@/imports/florence_photo_profil.jpg";
import portraitEditorial from "@/imports/DSC01013.JPG";

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
  description: string;
}

type Page = "home" | "collection" | "track" | "services" | "about" | "contact";
type NavigateFn = (page: Page, trackId?: number) => void;

// ── Data ───────────────────────────────────────────────────────────────────────
const TRACKS: Track[] = [
  {
    id: 1,
    title: "Halo — Bien-être mobile",
    client: "Halo Studio",
    year: "2024",
    type: "UX/UI",
    duration: "04:32",
    color: "#C9502F",
    label: "Terracotta Rec.",
    image: "https://images.unsplash.com/photo-1760105900201-f6f89fac2bef?w=600&h=600&fit=crop&auto=format",
    description:
      "Application mobile de bien-être et de méditation guidée pour les jeunes adultes urbains en quête de lenteur consciente.",
  },
  {
    id: 2,
    title: "Récits — Plateforme éditoriale",
    client: "Éditions du Monde",
    year: "2023",
    type: "Éditorial",
    duration: "03:15",
    color: "#3D5A45",
    label: "Forêt Verde",
    image: "https://images.unsplash.com/photo-1713765648359-b19501418b86?w=600&h=600&fit=crop&auto=format",
    description:
      "Refonte complète d'une plateforme de publication longue pour journalistes et auteurs indépendants francophones.",
  },
  {
    id: 3,
    title: "Canopée — Analytics",
    client: "Canopée SAS",
    year: "2024",
    type: "Dashboard",
    duration: "05:47",
    color: "#B8873C",
    label: "Ocre Éditions",
    image: "https://images.unsplash.com/photo-1777051245499-37d980393020?w=600&h=600&fit=crop&auto=format",
    description:
      "Dashboard d'analyse environnementale pour visualiser et piloter l'empreinte carbone de grandes entreprises industrielles.",
  },
  {
    id: 4,
    title: "Lumière — Photographe",
    client: "Atelier Lumière",
    year: "2023",
    type: "Web",
    duration: "02:58",
    color: "#6B5642",
    label: "Terre Profonde",
    image: "https://images.unsplash.com/photo-1778961420034-7f437e0a3b0b?w=600&h=600&fit=crop&auto=format",
    description:
      "Site vitrine minimaliste pour une photographe documentaire spécialisée dans le portrait intimiste et la lumière naturelle.",
  },
  {
    id: 5,
    title: "Racines — Identité ONG",
    client: "Racines Collective",
    year: "2022",
    type: "Branding",
    duration: "06:12",
    color: "#C9502F",
    label: "Terracotta Rec.",
    image: "https://images.unsplash.com/photo-1616410731309-4e07df6b5d42?w=600&h=600&fit=crop&auto=format",
    description:
      "Identité visuelle complète pour une ONG internationale œuvrant à la préservation des savoirs et langues autochtones.",
  },
  {
    id: 6,
    title: "Flux — Livraison urbaine",
    client: "Flux Delivery",
    year: "2024",
    type: "UX/UI",
    duration: "03:44",
    color: "#3D5A45",
    label: "Forêt Verde",
    image: "https://images.unsplash.com/photo-1750859876360-725182ebf069?w=600&h=600&fit=crop&auto=format",
    description:
      "Application de livraison durable vélo-cargo pour les centres-villes européens engagés dans la transition post-voiture.",
  },
];

const TRACK_TYPES = ["Tous", "UX/UI", "Éditorial", "Dashboard", "Web", "Branding"];

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

function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.028,
        mixBlendMode: "multiply" as const,
      }}
    />
  );
}

function ConcentricDivider({ size = 110 }: { size?: number }) {
  const rings = [10, 20, 30, 40, 50, 58];
  const c = size / 2;
  return (
    <div className="flex justify-center py-16">
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
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
          aria-label="Accueil"
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
              className="text-sm transition-colors duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: page === p ? "#C9502F" : "#6B5642",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("contact")}
          className="hidden md:block text-sm px-5 py-2 rounded-full border transition-all duration-300"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            borderColor: "#3D2B1F",
            color: "#3D2B1F",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3D2B1F";
            (e.currentTarget as HTMLButtonElement).style.color = "#F4EDE1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#3D2B1F";
          }}
        >
          Travaillons ensemble
        </button>
      </div>
    </nav>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────────
function HomePage({ navigate }: { navigate: NavigateFn }) {
  const [spinningId, setSpinningId] = useState<number | null>(null);
  const heroTracks = TRACKS.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen pt-28 lg:pt-32 pb-20 px-8 lg:px-10 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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

          {/* Portrait frame */}
          <div
            className="relative z-10 w-[260px] lg:w-[300px] h-[320px] lg:h-[370px] overflow-hidden bg-[#D4C8B8]"
            style={{
              borderRadius: "2px",
              boxShadow: "10px 14px 48px rgba(61,43,31,0.24)",
            }}
          >
            <ImageWithFallback
              src={portraitProfil}
              alt="Portrait de Florence Jotham, designer UX/UI"
              className="w-full h-full object-cover"
              style={{ filter: "sepia(8%) contrast(1.03) brightness(0.97)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 45%, rgba(61,43,31,0.42) 100%)",
              }}
            />
          </div>

          {/* Sleeve tag */}
          <div
            className="absolute bottom-2 left-0 z-20 px-4 py-2.5 bg-[#F4EDE1]"
            style={{ border: "1px solid rgba(61,43,31,0.14)", borderRadius: "2px" }}
          >
            <p
              className="text-[10px] text-[#6B5642] tracking-[0.13em] uppercase"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Side A — En cours
            </p>
          </div>
        </motion.div>
      </section>

      <ConcentricDivider />

      {/* Projects preview */}
      <section className="py-20 px-8 lg:px-10 max-w-[1280px] mx-auto">
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
                className="group cursor-pointer"
                onClick={() => navigate("track", track.id)}
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
                      alt={track.title}
                      className="w-full h-full object-cover transition-opacity duration-500"
                      style={{ opacity: 0.65, filter: "sepia(10%)" }}
                    />
                  </div>
                  {/* Vinyl — slides out on hover */}
                  <div
                    className="relative z-10 transition-all duration-500 ease-out"
                    style={{ transform: "none" }}
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

      <ConcentricDivider />

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
            {["LinkedIn", "Dribbble", "Read.cv"].map((s) => (
              <span
                key={s}
                className="text-sm text-[#6B5642] hover:text-[#3D2B1F] transition-colors cursor-pointer"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {s}
              </span>
            ))}
          </div>
          <p
            className="text-[10px] text-[#6B5642] tracking-[0.1em]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            © 2024 — Tous droits réservés
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
    <div className="min-h-screen pt-28 pb-24 px-8 lg:px-10 max-w-[1280px] mx-auto">
      <RevealBlock className="mb-10">
        <p
          className="text-xs text-[#6B5642] tracking-[0.16em] uppercase mb-4"
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
      <RevealBlock delay={0.1} className="mb-14">
        <div className="flex flex-wrap gap-2">
          {TRACK_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="text-[11px] px-4 py-2 rounded-full transition-all duration-300"
              style={{
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.06em",
                backgroundColor:
                  filter === type ? "#3D2B1F" : "transparent",
                color: filter === type ? "#F4EDE1" : "#6B5642",
                border:
                  filter === type
                    ? "1px solid #3D2B1F"
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
              className="group cursor-pointer"
              onClick={() => navigate("track", track.id)}
            >
              <div className="relative mb-6 flex justify-center items-center h-[240px]">
                {/* Sleeve background */}
                <div
                  className="absolute inset-3 overflow-hidden bg-[#D4C8B8]"
                  style={{ borderRadius: "2px" }}
                >
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover transition-all duration-500"
                    style={{ opacity: 0.55, filter: "sepia(8%)" }}
                  />
                </div>
                {/* Vinyl */}
                <div
                  className="relative z-10 transition-all duration-500 ease-out"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSpinningId(spinningId === track.id ? null : track.id);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform =
                      "translateX(22px) rotate(6deg)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "none")
                  }
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
                    className="text-[#3D2B1F] text-lg font-medium leading-snug mb-0.5"
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
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-[10px] tracking-[0.1em] uppercase mb-0.5"
                    style={{ fontFamily: "'DM Mono', monospace", color: "#B8873C" }}
                  >
                    {track.type}
                  </p>
                  <p
                    className="text-[10px] text-[#6B5642]"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {track.duration}
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
const TIMESTAMPS = [
  {
    time: "00:00",
    label: "Intro",
    heading: "La commande",
    body: (client: string) =>
      `${client} est venu avec une conviction et peu de certitudes. Ma première mission : questionner, creuser, reformuler — avant de dessiner le moindre pixel.`,
  },
  {
    time: "00:45",
    label: "Contexte",
    heading: "Comprendre le terrain",
    body: () =>
      "Entretiens utilisateurs, analyse concurrentielle, cartographie des flux existants. Un mois d'immersion pour comprendre ce que les données ne racontent pas.",
  },
  {
    time: "03:45",
    label: "Outro",
    heading: "Ce que le projet a produit",
    body: () =>
      "Les métriques ont suivi, mais ce qui compte davantage : l'équipe a changé sa façon de penser le produit. Un héritage plus durable que n'importe quel chiffre.",
  },
];

function TrackPage({
  track,
  navigate,
}: {
  track: Track;
  navigate: NavigateFn;
}) {
  const [progress, setProgress] = useState(0);
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
                className="mt-10 flex gap-8 pt-8"
                style={{ borderTop: "1px solid rgba(61,43,31,0.1)" }}
              >
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

      {/* Cover image */}
      <div className="w-full h-[420px] lg:h-[520px] overflow-hidden bg-[#D4C8B8]">
        <img
          src={`${track.image.split("?")[0]}?w=1400&h=520&fit=crop&auto=format`}
          alt={`Visuel du projet ${track.title}`}
          className="w-full h-full object-cover"
          style={{ filter: "sepia(8%) contrast(1.03) brightness(0.97)" }}
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
                  {ts.body(track.client)}
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
                  "L'interface n'est pas un écran — c'est une conversation entre deux intelligences."
                </blockquote>
              </div>
            </div>
          </div>
        </RevealBlock>

        <ConcentricDivider />

        {/* Next track */}
        <RevealBlock className="pb-16">
          <div
            className="group cursor-pointer flex items-center justify-between p-8 transition-all duration-300"
            style={{
              border: "1px solid rgba(61,43,31,0.1)",
              borderRadius: "2px",
            }}
            onClick={() => navigate("track", nextTrack.id)}
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
              className="group py-10 grid items-start gap-8 cursor-default transition-colors duration-300"
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
    "Mes projets ont une matière. Pas seulement un aspect. Je cherche la cohérence entre ce que le produit dit, ce qu'il fait, et comment il se sent — au doigt, à l'œil, à la lecture.",
    "Cette façon de travailler, je la dois en partie à mes racines — une double culture afro-caribéenne et guyanaise qui m'a appris que l'ambiance d'un espace, la chaleur d'une couleur, le rythme d'une phrase portent autant de sens que n'importe quel framework UX.",
    "Avant de devenir designer, j'ai été journaliste. Ça m'a appris une chose essentielle : les gens ne lisent pas les interfaces, ils les écoutent.",
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 px-8 lg:px-10 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 lg:gap-24">
        {/* Left content */}
        <div>
          <RevealBlock className="mb-12">
            <p
              className="text-xs text-[#6B5642] tracking-[0.16em] uppercase mb-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Liner Notes
            </p>
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
                    alt="Portrait éditorial de Florence — cliché intime"
                    className="w-full h-full object-cover"
                    style={{ filter: "sepia(10%) contrast(1.06) brightness(0.95)", objectPosition: "center 20%" }}
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
                    <p
                      className="text-[10px] tracking-[0.1em]"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: "rgba(251,246,237,0.55)",
                      }}
                    >
                      Paris, 2024
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
              <div>
                {["LinkedIn", "Dribbble", "Read.cv", "hello@florencejotham.fr"].map(
                  (link) => (
                    <div
                      key={link}
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: "1px solid rgba(61,43,31,0.08)" }}
                    >
                      <span
                        className="text-sm text-[#6B5642]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {link}
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
                    </div>
                  )
                )}
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
                { label: "Disponibilité", value: "Août 2024 →" },
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
            <div className="py-20 text-center">
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
                Je reviens vers vous dans les 48h.
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

  return (
    <div className="bg-[#F4EDE1] min-h-screen">
      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        ::placeholder { color: #B8A898; font-family: 'DM Sans', sans-serif; }
      `}</style>

      <GrainOverlay />
      <Nav page={page} navigate={navigate} />

      {page === "home" && <HomePage navigate={navigate} />}
      {page === "collection" && <CollectionPage navigate={navigate} />}
      {page === "track" && <TrackPage track={selectedTrack} navigate={navigate} />}
      {page === "services" && <ServicesPage navigate={navigate} />}
      {page === "about" && <AboutPage navigate={navigate} />}
      {page === "contact" && <ContactPage />}
    </div>
  );
}
