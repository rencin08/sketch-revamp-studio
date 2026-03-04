import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronLeft, Pen, BookMarked, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useJournalEntries } from "@/hooks/use-journal";
import type { PinItem } from "@/hooks/use-journal";

const REFLECTION_TAGS: Record<string, { label: string; icon: any; color: string }> = {
  journal: { label: "Journal", icon: BookMarked, color: "bg-[hsl(270,25%,92%)] text-[hsl(270,20%,40%)]" },
  note: { label: "Note", icon: Pen, color: "bg-[hsl(38,25%,91%)] text-[hsl(30,18%,40%)]" },
  random: { label: "Random", icon: Sparkles, color: "bg-[hsl(320,25%,92%)] text-[hsl(320,20%,40%)]" },
};

const Reflections = () => {
  const { pins } = useJournalEntries();
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [expandedPinId, setExpandedPinId] = useState<string | null>(null);

  const reflectionTags = ["journal", "note", "random"];
  const reflectionPins = pins.filter(p => !p.archived && p.tags.some(t => reflectionTags.includes(t)));

  const grouped: Record<string, PinItem[]> = {};
  reflectionPins.forEach(p => {
    const tag = p.tags.find(t => reflectionTags.includes(t)) || "note";
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push(p);
  });

  const expandedPin = expandedPinId ? pins.find(p => p.id === expandedPinId) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Expanded pin overlay */}
      <AnimatePresence>
        {expandedPin && (
          <motion.div
            key="pin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md px-5 py-4 flex items-center border-b border-border/30">
              <button onClick={() => setExpandedPinId(null)} className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft size={18} /> Back
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto px-6 py-8"
            >
              {expandedPin.tags[0] && REFLECTION_TAGS[expandedPin.tags[0]] && (
                <div className="flex items-center gap-2 mb-4">
                  {(() => { const Icon = REFLECTION_TAGS[expandedPin.tags[0]]?.icon; return Icon ? <Icon size={16} className="text-accent" /> : null; })()}
                  <span className="font-body text-xs tracking-[0.2em] text-accent uppercase">{REFLECTION_TAGS[expandedPin.tags[0]]?.label}</span>
                </div>
              )}
              <p className="font-body text-xs text-muted-foreground/40 mb-6">
                {new Date(expandedPin.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
              {(() => {
                const lines = expandedPin.content.split("\n");
                const title = lines[0];
                const body = lines.slice(1).join("\n").trim();
                return (
                  <>
                    <h2 className="font-display italic text-3xl text-foreground mb-6 leading-snug">{title}</h2>
                    {body && <p className="font-body text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">{body}</p>}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-4">
        <Link to="/home" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ChevronLeft size={16} /> Back to home
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <BookOpen size={20} className="text-secondary-foreground" />
          </div>
          <div>
            <h1 className="font-display italic text-3xl text-foreground">Reflections & Thoughts</h1>
            <p className="font-body text-sm text-muted-foreground">On leaving finance, building startups, and figuring out life in your 20s.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-12">
        {reflectionPins.length === 0 ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BookOpen size={28} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-display italic text-muted-foreground text-lg">no reflections yet</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {Object.entries(grouped).map(([tagKey, tagPins]) => {
              const config = REFLECTION_TAGS[tagKey];
              const Icon = config?.icon;
              const isOpen = expandedTag === tagKey;
              return (
                <motion.div key={tagKey} className="rounded-2xl border border-border bg-card overflow-hidden" layout>
                  <button
                    onClick={() => setExpandedTag(isOpen ? null : tagKey)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-accent/5 transition-colors"
                  >
                    {Icon && <Icon size={16} className="text-muted-foreground" />}
                    <span className="font-body text-sm font-medium text-foreground flex-1 text-left">{config?.label || tagKey}</span>
                    <span className="font-body text-xs text-muted-foreground mr-2">{tagPins.length} entries</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} className="text-muted-foreground" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-border/40"
                      >
                        <div className="p-3 space-y-1">
                          {tagPins.map(pin => (
                            <div
                              key={pin.id}
                              onClick={() => setExpandedPinId(pin.id)}
                              className="flex items-center justify-between py-3 px-3 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors group"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-sm text-foreground truncate">{pin.content.split("\n")[0]}</p>
                                <p className="font-body text-xs text-muted-foreground/50 mt-0.5">
                                  {new Date(pin.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                </p>
                              </div>
                              <ChevronLeft size={14} className="text-muted-foreground/30 rotate-180 group-hover:text-muted-foreground transition-colors shrink-0 ml-2" />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reflections;
