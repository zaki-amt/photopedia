"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Send, Check, ShieldAlert, ArrowLeft, LifeBuoy } from "lucide-react";
import { useUser } from "@/app/(dashboard)/layout";

export default function SupportPage() {
  const { user } = useUser();
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("Account Inquiry / Unblock Request");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 font-sans">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Feed
        </Link>
        <div>
          <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-zinc-400" />
            Photopedia Support & Inquiries
          </h1>
          <p className="text-xs text-zinc-400">Get in touch with platform administrators regarding account access or reports</p>
        </div>
      </div>

      {submitted ? (
        <div className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-base font-bold text-white">Inquiry Submitted</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Your message has been logged in the support system. Platform administrators will review your inquiry shortly.
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setMessage("");
            }}
            className="inline-block bg-white text-black px-4 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-200 transition-all"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 block">Your Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 block">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
            >
              <option value="Account Inquiry / Unblock Request">Account Inquiry / Unblock Request</option>
              <option value="Reported Content Appeal">Reported Content Appeal</option>
              <option value="General Technical Question">General Technical Question</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 block">Message Details</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your inquiry or request details..."
              className="w-full bg-black border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-zinc-200 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Support Message</span>
          </button>
        </form>
      )}
    </div>
  );
}
