import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronLeft, Pen, BookMarked, Sparkles, Plus, Upload, FileText, Calendar } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useJournalEntries } from "@/hooks/use-journal";
import type { PinItem } from "@/hooks/use-journal";
import { useAuth } from "@/hooks/use-auth";
import mammoth from "mammoth";

const REFLECTION_TAGS: Record<string, { label: string; icon: any; accent: string }> = {
  journal: { label: "Journal", icon: BookMarked, accent: "bg-primary/10 text-primary" },
  note: { label: "Note", icon: Pen, accent: "bg-muted text-muted-foreground" },
  random: { label: "Random", icon: Sparkles, accent: "bg-secondary text-secondary-foreground" },
};

const Reflections = () => {
  const { pins, addPin } = useJournalEntries();
  const { user } = useAuth();
  const isOwner = !!user;
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [expandedPinId, setExpandedPinId] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [writeContent, setWriteContent] = useState("");
  const [writeTag, setWriteTag] = useState<string>("journal");
  const [importing, setImporting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reflectionTags = ["journal", "note", "random"];
  const reflectionPins = pins.filter(p => !p.archived && p.tags.some(t => reflectionTags.includes(t)));

  const grouped: Record<string, PinItem[]> = {};
  reflectionPins.forEach(p => {
    const tag = p.tags.find(t => reflectionTags.includes(t)) || "note";
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push(p);
  });

  const expandedPin = expandedPinId ? pins.find(p => p.id === expandedPinId) : null;

  useEffect(() => {
    if (isWriting && textareaRef.current) textareaRef.current.focus();
  }, [isWriting]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [writeContent]);

  const handleSave = async () => {
    if (!writeContent.trim()) return;
    await addPin({ type: "note", content: writeContent.trim(), tags: [writeTag], archived: false, visibility: "private" });
    setWriteContent("");
    setIsWriting(false);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.trim();
      if (text) {
        const title = file.name.replace(/\.(docx|doc)$/i, "");
        await addPin({ type: "note", content: `${title}\n${text}`, tags: [writeTag], archived: false, visibility: "private" });
      }
    } catch (err) {
      console.error("Error importing file:", err);
    }
    setImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getPreviewText = (content: string) => {
    const lines = content.split("\n");
    const body = lines.slice(1).join(" ").trim();
    return body.length > 80 ? body.slice(0, 80) + "…" : body;
  };

  return (
    <div className="min-h-screen bg-background">
      <input ref={fileInputRef} type="file" accept=".docx,.doc" className="hidden" onChange={handleFileImport} />

      {/* Expanded pin overlay */}
      <AnimatePresence>
        {expandedPin && (
          <motion.div key="pin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background overflow-y-auto">
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md px-5 py-4 flex items-center border-b border-border/30">
              <button onClick={() => setExpandedPinId(null)} className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft size={18} /> Back
              </button>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-2xl mx-auto px-6 py-8">
              {expandedPin.tags[0] && REFLECTION_TAGS[expandedPin.tags[0]] && (
                <div className="flex items-center gap-2 mb-4">
                  {(() => { const Icon = REFLECTION_TAGS[expandedPin.tags[0]]?.icon; return Icon ? <Icon size={16} className="text-muted-foreground" /> : null; })()}
                  <span className="font-body text-xs tracking-[0.2em] text-muted-foreground uppercase">{REFLECTION_TAGS[expandedPin.tags[0]]?.label}</span>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <BookOpen size={20} className="text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-display italic text-3xl text-foreground">Reflections & Thoughts</h1>
              <p className="font-body text-sm text-muted-foreground">On leaving finance, building startups, and figuring out life in your 20s.</p>
            </div>
          </div>
          {isOwner && !isWriting && (
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-foreground font-body text-xs font-medium hover:bg-muted transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Upload size={14} /> {importing ? "Importing…" : "Import .docx"}
              </motion.button>
              <motion.button
                onClick={() => setIsWriting(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background font-body text-xs font-medium hover:bg-foreground/90 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={14} /> Write
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Writing area */}
      <AnimatePresence>
        {isWriting && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="max-w-3xl mx-auto px-6 pb-6">
              <div className="rounded-2xl border-2 border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  {Object.entries(REFLECTION_TAGS).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button key={key} onClick={() => setWriteTag(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs transition-all ${
                          writeTag === key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}>
                        <Icon size={12} /> {config.label}
                      </button>
                    );
                  })}
                </div>
                <textarea ref={textareaRef} value={writeContent} onChange={(e) => setWriteContent(e.target.value)}
                  placeholder="Start writing..."
                  className="w-full bg-transparent font-body text-sm text-foreground resize-none outline-none placeholder:text-muted-foreground/40 min-h-[120px] leading-relaxed"
                  onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey && writeContent.trim()) { e.preventDefault(); handleSave(); } }}
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                  <button onClick={() => { setIsWriting(false); setWriteContent(""); }} className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-[10px] text-muted-foreground/40">⌘ + Enter</span>
                    <button onClick={handleSave} disabled={!writeContent.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background font-body text-xs font-medium disabled:opacity-30 transition-all">
                      <Plus size={12} /> Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-12">
        {reflectionPins.length === 0 ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BookOpen size={28} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-display italic text-muted-foreground text-lg">no reflections yet</p>
            {isOwner && (
              <button onClick={() => setIsWriting(true)} className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors mt-2">
                start writing →
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {Object.entries(grouped).map(([tagKey, tagPins]) => {
              const config = REFLECTION_TAGS[tagKey];
              const Icon = config?.icon;
              const isOpen = expandedTag === tagKey;
              return (
                <motion.div key={tagKey} className="rounded-2xl border border-border bg-card overflow-hidden" layout>
                  <button onClick={() => setExpandedTag(isOpen ? null : tagKey)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config?.accent || "bg-muted text-muted-foreground"}`}>
                      {Icon && <Icon size={15} />}
                    </div>
                    <span className="font-body text-sm font-medium text-foreground flex-1 text-left">{config?.label || tagKey}</span>
                    <span className="font-body text-xs text-muted-foreground/60 mr-2">{tagPins.length}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} className="text-muted-foreground/40" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }} className="overflow-hidden border-t border-border/30">
                        <div className="p-3 space-y-1">
                          {tagPins.map((pin, i) => (
                            <motion.div key={pin.id} onClick={() => setExpandedPinId(pin.id)}
                              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                              className="flex items-start gap-3 py-3 px-3 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors group">
                              <div className="mt-0.5 w-7 h-7 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                                <FileText size={13} className="text-muted-foreground/50" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-sm font-medium text-foreground truncate">{pin.content.split("\n")[0]}</p>
                                {getPreviewText(pin.content) && (
                                  <p className="font-body text-xs text-muted-foreground/40 mt-0.5 truncate">{getPreviewText(pin.content)}</p>
                                )}
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  <Calendar size={10} className="text-muted-foreground/30" />
                                  <p className="font-body text-[11px] text-muted-foreground/40">
                                    {new Date(pin.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                  </p>
                                </div>
                              </div>
                              <ChevronLeft size={14} className="text-muted-foreground/20 rotate-180 group-hover:text-muted-foreground transition-colors shrink-0 mt-1" />
                            </motion.div>
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
