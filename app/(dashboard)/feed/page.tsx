"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
  Loader2,
  PlusCircle,
  TrendingUp,
  UserPlus,
  Compass,
  ArrowRight,
  Send,
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  category: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked?: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: {
      name: "Elena Rostova",
      username: "elena_photos",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
    category: "Landscape",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    caption: "Golden hour reflection over the alpine lake. Filtered through natural misty light 🏔️✨ #landscape #photography #nature",
    likes: 1420,
    comments: 89,
    timeAgo: "2h ago",
  },
  {
    id: "2",
    author: {
      name: "Marcus Chen",
      username: "marcus_urban",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    category: "Urban",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    caption: "Neon reflections in downtown Tokyo after night rain. Cyberpunk vibes preserved in raw exposure 🌆",
    likes: 2890,
    comments: 142,
    timeAgo: "4h ago",
  },
  {
    id: "3",
    author: {
      name: "Sophia Martinez",
      username: "sophia_portraits",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    category: "Portraits",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    caption: "Natural sunlight portrait series: Expressions of quiet confidence 📸✨ #portraiture #editorial",
    likes: 980,
    comments: 54,
    timeAgo: "6h ago",
  },
];

const TOP_CATEGORIES = [
  { name: "Landscape", count: "4.2k", icon: "🏔️" },
  { name: "Urban & Street", count: "2.8k", icon: "🌆" },
  { name: "Portraits", count: "3.1k", icon: "📸" },
  { name: "Architecture", count: "1.9k", icon: "🏛️" },
  { name: "Astro & Night", count: "950", icon: "🌌" },
];

const SUGGESTED_CREATORS = [
  {
    name: "Aleksandra Bychkova",
    username: "aleksandra-bychkova",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Wilhelm Barrel",
    username: "wilhelm-barrel",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Nikita Ryzhikh",
    username: "nikita-ryzhikh",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Karan Yadav",
    username: "karan-yadav",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Nishtha Jain",
    username: "nishtha-jain",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [loading, setLoading] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [followingMap, setFollowingMap] = useState<{ [key: string]: boolean }>({});

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const toggleFollow = (username: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const created: Post = {
      id: (posts.length + 1).toString(),
      author: {
        name: "Alex Morgan",
        username: "alexmorgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      },
      category: "General",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      caption: newPostText,
      likes: 1,
      comments: 0,
      timeAgo: "Just now",
    };

    setPosts([created, ...posts]);
    setNewPostText("");
  };

  const loadMorePosts = () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const nextId = posts.length + 1;
      const newPost: Post = {
        id: nextId.toString(),
        author: {
          name: "David Vance",
          username: "vance_captures",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        },
        category: "Landscape",
        image: `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80`,
        caption: `Exploring unmapped horizon line #${nextId}. Captured on 35mm wide angle lens.`,
        likes: Math.floor(Math.random() * 500) + 100,
        comments: Math.floor(Math.random() * 40) + 5,
        timeAgo: "Just now",
      };

      setPosts((prev) => [...prev, newPost]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Tab Bar: For You / Following */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
          <button
            onClick={() => setActiveTab("for-you")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "for-you"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "following"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Following
          </button>
        </div>

        <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline-block">
          UPDATED REALTIME
        </span>
      </div>

      {/* Main Grid: Feed + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Share Compose Box + Posts Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Share Something Compose Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Your Avatar"
                className="w-9 h-9 rounded-full object-cover border border-zinc-800"
              />
              <Link
                href="/feed/new"
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all flex items-center justify-between"
              >
                <span>Share a new photograph, tags or camera EXIF details...</span>
                <PlusCircle className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors hover:border-zinc-700/80"
              >
                {/* Post Author Bar */}
                <div className="p-4 flex items-center justify-between border-b border-zinc-900">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-zinc-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-xs font-semibold text-white leading-tight">
                          {post.author.name}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500">
                        @{post.author.username} • {post.timeAgo}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(post.author.username)}
                    className={`text-xs font-medium px-3 py-1 rounded-lg transition-all border ${
                      followingMap[post.author.username]
                        ? "bg-zinc-900 text-zinc-300 border-zinc-800"
                        : "bg-white hover:bg-zinc-200 text-black border-white"
                    }`}
                  >
                    {followingMap[post.author.username] ? "Following" : "Follow"}
                  </button>
                </div>

                {/* Post Caption */}
                <div className="p-4 pb-3">
                  <p className="text-xs text-zinc-200 leading-relaxed">{post.caption}</p>
                </div>

                {/* Post Image with Link to Single Post Detail View */}
                <Link href={`/feed/${post.id}`} className="block group">
                  <div className="relative aspect-[16/10] bg-black overflow-hidden border-y border-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    />
                  </div>
                </Link>

                {/* Post Footer Bar */}
                <div className="p-4 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 font-medium transition-colors ${
                        post.isLiked ? "text-rose-500" : "hover:text-white"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? "fill-rose-500" : ""}`} />
                      <span>{post.likes}</span>
                    </button>

                    <Link href={`/feed/${post.id}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </Link>

                    <button className="hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link href={`/feed/${post.id}`} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono">
                    View Single Page <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center pt-2">
            <button
              onClick={loadMorePosts}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-6 py-2.5 rounded-xl text-xs font-medium transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  Loading...
                </>
              ) : (
                "Load More Submissions"
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar Column: Categories Counter + Suggested Creators */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          {/* Top Categories Widget */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-zinc-400" />
                Top Categories
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">EXPLORE</span>
            </div>

            <div className="space-y-2">
              {TOP_CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-900 hover:border-zinc-800 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{cat.icon}</span>
                    <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                      {cat.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-semibold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Creators Widget (Matching Screenshot 1!) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-zinc-400" />
                Suggested For You
              </h3>
              <a href="#" className="text-[11px] text-zinc-500 hover:text-white transition-colors">
                See all
              </a>
            </div>

            <div className="space-y-3">
              {SUGGESTED_CREATORS.map((creator) => {
                const isFollowing = followingMap[creator.username];
                return (
                  <div
                    key={creator.username}
                    className="flex items-center justify-between gap-3 p-1.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-9 h-9 rounded-full object-cover border border-zinc-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-heading text-xs font-semibold text-white truncate leading-tight">
                          {creator.name}
                        </h4>
                        <p className="text-[11px] font-mono text-zinc-500 truncate">
                          @{creator.username}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollow(creator.username)}
                      className={`text-xs font-medium px-3 py-1 rounded-lg transition-all shrink-0 border ${
                        isFollowing
                          ? "bg-zinc-900 text-zinc-400 border-zinc-800"
                          : "bg-white hover:bg-zinc-200 text-black border-white"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
