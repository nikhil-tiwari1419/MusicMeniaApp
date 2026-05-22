import React from "react";
import Qna from "../assets/QnA.json";
import { useTheme } from "../Context/Theme";
import {
  ChevronDown,
  HelpCircle,
  Headphones,
  Music,
  CreditCard,
  Users,
  ShieldCheck,
} from "lucide-react";

function FAQItem({ question, answer, isOpen, onToggle, dark }) {
  return (
    <div
      className={`mb-4 overflow-hidden rounded-2xl border transition-all duration-300 ${
        dark
          ? "border-gray-700 bg-gray-900/70"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-all duration-300 cursor-pointer ${
          dark
            ? "hover:bg-gray-800 text-white"
            : "hover:bg-gray-100 text-gray-900"
        }`}
      >
        <div className="flex items-start gap-3">
          <HelpCircle
            size={24}
            className={`mt-1 flex-shrink-0 ${
              dark ? "text-green-400" : "text-green-700"
            }`}
          />

          <span className="text-lg sm:text-xl md:text-2xl font-semibold leading-snug">
            {question}
          </span>
        </div>

        <ChevronDown
          size={24}
          className={`flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className={`px-5 pb-5 text-base sm:text-lg md:text-xl leading-relaxed ${
              dark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function QnA() {
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [openId, setOpenId] = React.useState(null);

  const { theme } = useTheme();
  const dark = theme === "dark";

  const categories = ["all", ...new Set(Qna.map((q) => q.category))];

  const filteredQna =
    activeCategory === "all"
      ? Qna
      : Qna.filter((q) => q.category === activeCategory);

  const categoryIcons = {
    all: <Headphones size={18} />,
    account: <ShieldCheck size={18} />,
    music: <Music size={18} />,
    billing: <CreditCard size={18} />,
    artist: <Music size={18} />,
    community: <Users size={18} />,
    platform: <Headphones size={18} />,
    support: <HelpCircle size={18} />,
  };

  return (
    <section
      className={`relative overflow-hidden py-20 px-5 transition-colors duration-300 ${
        dark
          ? "bg-gradient-to-b from-black via-gray-900 to-black text-white"
          : "bg-gradient-to-b from-white via-gray-50 to-white text-black"
      }`}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-14 text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-5 ${
              dark
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            <HelpCircle size={16} />
            Support Center
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 leading-tight">
            Frequently Asked Questions
          </h1>

          <p
            className={`max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed ${
              dark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Everything you need to know about MusicMenia — accounts,
            uploads, artist tools, payments, community features, and more.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenId(null);
              }}
              className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm sm:text-base font-semibold capitalize transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? dark
                    ? "bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20"
                    : "bg-green-700 text-white border-green-700"
                  : dark
                  ? "border-gray-700 bg-gray-900 text-gray-300 hover:border-green-500 hover:text-green-400"
                  : "border-gray-300 bg-white text-gray-700 hover:border-green-600 hover:text-green-700"
              }`}
            >
              {categoryIcons[cat]}
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredQna.length > 0 ? (
            filteredQna.map((q) => (
              <FAQItem
                key={q.id}
                question={q.question}
                answer={q.answer}
                isOpen={openId === q.id}
                onToggle={() =>
                  setOpenId(openId === q.id ? null : q.id)
                }
                dark={dark}
              />
            ))
          ) : (
            <div
              className={`rounded-2xl border p-10 text-center ${
                dark
                  ? "border-gray-700 bg-gray-900 text-gray-400"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
            >
              No FAQs found in this category.
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-16 rounded-3xl border p-8 text-center ${
            dark
              ? "border-gray-700 bg-gray-900/70"
              : "border-gray-200 bg-white"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Still need help?
          </h2>

          <p
            className={`mb-6 text-lg ${
              dark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Our support team is available 24/7 to help you with any
            questions or issues.
          </p>

          <button
            className={`rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 cursor-pointer ${
              dark
                ? "bg-green-500 text-black hover:bg-green-400"
                : "bg-green-700 text-white hover:bg-green-800"
            }`}
          >
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}

export default QnA;