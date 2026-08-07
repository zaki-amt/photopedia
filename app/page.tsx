"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  ArrowRight,
  Image as ImageIcon,
  Users,
  Shield,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sliders,
  Star,
  Zap,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Layers,
  Award,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("photopedia_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(null);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("photopedia_token");
      localStorage.removeItem("photopedia_user");
    }
    setUser(null);
    setUserMenuOpen(false);
  };

  // Hero Featured Slides Data
  const HERO_SLIDES = [
    {
      id: "slide-1",
      title: "Alpine Horizon Glow",
      category: "Landscape",
      author: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
      exif: "Sony A7IV • 24mm f/2.8 • 1/1000s • ISO 100",
      likes: "1,420",
    },
    {
      id: "slide-2",
      title: "Tokyo Neon Nights",
      category: "Urban",
      author: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80",
      exif: "Leica Q2 • 28mm f/1.7 • 1/250s • ISO 800",
      likes: "2,890",
    },
    {
      id: "slide-3",
      title: "Golden Hour Portraiture",
      category: "Portraits",
      author: "Sophia Martinez",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80",
      exif: "Canon R5 • 85mm f/1.2 • 1/500s • ISO 160",
      likes: "980",
    },
    {
      id: "slide-4",
      title: "Silent Coastal Horizon",
      category: "Seascape",
      author: "David Vance",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
      exif: "Nikon Z9 • 14-24mm f/2.8 • 1/800s • ISO 200",
      likes: "1,830",
    },
  ];

  // Category Filter Gallery Data
  const CATEGORIES = ["All", "Landscape", "Urban", "Portraits", "Architecture", "Astro"];

  const GALLERY_ITEMS = [
    { id: "g1", category: "Landscape", title: "Misty Alpine Ridge", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", author: "@elena_photos" },
    { id: "g2", category: "Urban", title: "Shinjuku After Rain", image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80", author: "@marcus_urban" },
    { id: "g3", category: "Portraits", title: "Natural Light Reflections", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", author: "@sophia_portraits" },
    { id: "g4", category: "Architecture", title: "Geometric Curves", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", author: "@arch_lens" },
    { id: "g5", category: "Astro", title: "Stargazing In Atacama", image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80", author: "@astro_vance" },
    { id: "g6", category: "Landscape", title: "Desert Dunes Twilight", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80", author: "@david_nature" },
  ];

  const filteredGallery = activeCategory === "All" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  // Top Creators Data
  const TOP_CREATORS = [
    {
      name: "Elena Rostova",
      username: "elena_photos",
      role: "Landscape Specialist",
      followers: "42.8k",
      shots: 142,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Marcus Chen",
      username: "marcus_urban",
      role: "Street & Architectural Photography",
      followers: "29.4k",
      shots: 98,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Sophia Martinez",
      username: "sophia_portraits",
      role: "Editorial Portraiture",
      followers: "51.2k",
      shots: 210,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  ];

  // Testimonials
  const TESTIMONIALS = [
    {
      quote: "Photopedia is the only platform where color accuracy and EXIF camera metadata are preserved flawlessly without aggressive compression.",
      author: "Julian Vance",
      title: "Senior Editor, Lens Magazine",
    },
    {
      quote: "The Vercel-like interface allows my photography portfolio to take center stage. Clean, ultra-fast, and built for true visual artists.",
      author: "Chloe Dubois",
      title: "Commercial Photographer",
    },
  ];

  // FAQs
  const FAQS = [
    {
      q: "Does Photopedia compress uploaded raw photography?",
      a: "No. Photopedia uses lossless image rendering algorithms preserving full dynamic range, fine detail, and camera color profiles.",
    },
    {
      q: "Is camera EXIF metadata visible on my uploads?",
      a: "Yes! Lens focal length, aperture value, shutter speed, ISO sensitivity, and camera model are parsed and displayed automatically on every post.",
    },
    {
      q: "Can I manage moderation and reported content?",
      a: "Administrators have dedicated layout access (/admin) to inspect, review, approve, or remove flagged content in real-time.",
    },
    {
      q: "Is Photopedia free for creators?",
      a: "Yes. Creating an account, publishing portfolios, and exploring creator feeds are completely free.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-[#ededed] flex flex-col justify-between selection:bg-white selection:text-black font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800/80 backdrop-blur-xl sticky top-0 z-50 bg-black/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-heading font-semibold text-lg tracking-tight text-white">
              Photopedia
            </span>
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 p-1.5 pr-3 rounded-full text-xs transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                />
                <span className="font-semibold text-white font-heading">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 space-y-1 font-sans">
                  <div className="px-3 py-2 border-b border-zinc-900">
                    <p className="text-xs font-semibold text-white font-heading truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono truncate">@{user.username}</p>
                  </div>

                  <Link
                    href="/feed"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    Creator Profile
                  </Link>

                  <Link
                    href="/profile/edit"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-zinc-400" />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 text-xs font-medium">
              <Link href="/login" className="text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-md font-semibold transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Interactive Swiper Slider */}
      <main className="flex-1">
        <section className="relative px-6 py-16 sm:py-24 max-w-7xl mx-auto">
          {/* Subtle Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-zinc-800/25 to-transparent blur-[140px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 text-xs font-mono backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Interactive Creator Showcase</span>
              <span className="bg-zinc-900 text-white text-[10px] px-1.5 py-0.5 rounded border border-zinc-800">
                PRO SLIDER
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              The Open Platform for <br />
              <span className="bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Visual Storytellers
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Explore curated photography with preserved EXIF camera metadata, uncompressed color profiles, and a creator-first network.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/feed"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-semibold text-xs px-6 py-3 rounded-lg shadow-sm transition-all"
              >
                Explore Feed
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium text-xs px-6 py-3 rounded-lg transition-all"
              >
                Deploy Portfolio
              </Link>
            </div>
          </div>

          {/* Interactive Swiper Carousel Container */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl group">
            {/* Custom Navigation Controls */}
            <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 border border-zinc-800 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 border border-zinc-800 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
              <ChevronRight className="w-5 h-5" />
            </button>

            <Swiper
              modules={[Autoplay, Navigation, Pagination, EffectFade]}
              effect="fade"
              loop={true}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              navigation={{
                prevEl: ".swiper-button-prev-custom",
                nextEl: ".swiper-button-next-custom",
              }}
              pagination={{ clickable: true }}
              className="w-full aspect-[16/9] sm:aspect-[21/9]"
            >
              {HERO_SLIDES.map((slide) => {
                const catSlug = slide.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                const authorSlug = slide.author.toLowerCase().replace(/\s+/g, "_");
                return (
                  <SwiperSlide key={slide.id}>
                    <div className="relative w-full h-full group/slide">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 max-w-5xl">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/category/${catSlug}`}
                                className="text-[10px] font-mono font-semibold uppercase tracking-widest bg-white hover:bg-zinc-200 text-black px-2 py-0.5 rounded transition-colors"
                              >
                                {slide.category}
                              </Link>
                              <span className="text-xs font-mono text-zinc-400">{slide.exif}</span>
                            </div>
                            <Link href="/feed" className="block hover:underline">
                              <h3 className="font-heading text-2xl sm:text-4xl font-bold text-white leading-tight">
                                {slide.title}
                              </h3>
                            </Link>
                          </div>

                          <Link
                            href={`/creators/${authorSlug}`}
                            className="flex items-center gap-4 bg-black/70 hover:bg-black border border-zinc-800/80 backdrop-blur-md p-2.5 px-4 rounded-xl transition-all group/author"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={slide.avatar}
                              alt={slide.author}
                              className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
                            />
                            <div className="text-left">
                              <p className="text-xs font-semibold text-white font-heading group-hover/author:underline">
                                {slide.author}
                              </p>
                              <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                                {slide.likes} likes
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>

        {/* SECTION 2: Interactive Category Explorer */}
        <section className="py-20 border-t border-zinc-900 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                <Sliders className="w-3.5 h-3.5" />
                Category Filters
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Explore by Genre & Lens Technique
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-mono px-3.5 py-1.5 rounded-lg border transition-all ${
                    activeCategory === cat
                      ? "bg-white text-black border-white font-semibold"
                      : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h4 className="font-heading text-base font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs font-mono text-zinc-300">{item.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Live Stats & Platform Metrics */}
        <section className="py-20 border-t border-zinc-900 bg-zinc-950/60 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Platform Scale</span>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white">
                Engineered for High Performance
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-black border border-zinc-800 text-center space-y-2">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-white">14,800+</span>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Active Photographers</p>
              </div>

              <div className="p-6 rounded-xl bg-black border border-zinc-800 text-center space-y-2">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-white">98,400+</span>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Published Shots</p>
              </div>

              <div className="p-6 rounded-xl bg-black border border-zinc-800 text-center space-y-2">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-white">1.4M+</span>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Community Likes</p>
              </div>

              <div className="p-6 rounded-xl bg-black border border-zinc-800 text-center space-y-2">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-white">4.9 / 5</span>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Creator Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Top Photographers Spotlight */}
        <section className="py-20 border-t border-zinc-900 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                <Award className="w-3.5 h-3.5 text-white" />
                Featured Creators
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Top Visual Artists This Week
              </h2>
            </div>
            <Link
              href="/creators"
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1"
            >
              View all creators <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOP_CREATORS.map((creator) => (
              <div
                key={creator.username}
                className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <Link href={`/creators/${creator.username}`} className="flex items-center gap-4 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-14 h-14 rounded-full object-cover border border-zinc-700 shrink-0 group-hover:border-zinc-500 transition-colors"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading text-base font-bold text-white group-hover:underline">{creator.name}</h3>
                        <CheckCircle2 className="w-4 h-4 text-white fill-white stroke-black" />
                      </div>
                      <p className="text-xs font-mono text-zinc-500">@{creator.username}</p>
                    </div>
                  </Link>

                  <p className="text-xs text-zinc-400 leading-relaxed">{creator.role}</p>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white font-heading">{creator.followers}</span>
                    <span className="text-[10px] font-mono text-zinc-500 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-bold text-white font-heading">{creator.shots}</span>
                    <span className="text-[10px] font-mono text-zinc-500 ml-1">Shots</span>
                  </div>
                  <Link
                    href={`/creators/${creator.username}`}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black text-zinc-300 px-3 py-1 rounded text-[11px] font-mono transition-all"
                  >
                    View Portfolio
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Testimonials */}
        <section className="py-20 border-t border-zinc-900 bg-zinc-950/40 px-6">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Testimonials</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Loved by Professional Photographers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="p-8 rounded-xl bg-black border border-zinc-800 text-left space-y-6">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white">{t.author}</h4>
                    <p className="text-xs font-mono text-zinc-500">{t.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: FAQ Accordion */}
        <section className="py-20 border-t border-zinc-900 px-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div
                  key={index}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                    className="w-full p-5 text-left font-heading text-sm font-semibold text-white flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-white" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 7: Final Vercel-Style CTA Banner */}
        <section className="py-20 border-t border-zinc-900 px-6">
          <div className="max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-white/10 blur-3xl pointer-events-none" />

            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Ready to Share Your Photography?
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">
              Join thousands of creators sharing uncompressed, high-res photography portfolios with preserved camera EXIF metadata.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-semibold text-xs px-8 py-3.5 rounded-lg shadow-sm transition-all"
              >
                Create Free Creator Account
              </Link>
              <Link
                href="/feed"
                className="w-full sm:w-auto bg-black border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium text-xs px-8 py-3.5 rounded-lg transition-all"
              >
                Explore Community Feed
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500 font-mono">
        © {new Date().getFullYear()} Photopedia, Inc. Built for visual storytellers.
      </footer>
    </div>
  );
}
