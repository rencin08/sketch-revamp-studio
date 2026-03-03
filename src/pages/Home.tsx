import avatar from "@/assets/avatar.png";
import cityscape from "@/assets/cityscape-sketch.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Linkedin, Instagram, ArrowRight, Sparkles, BookOpen,
  Briefcase, PanelLeftClose, PanelLeftOpen, Plus, StickyNote,
  Archive, X, ChevronDown, ChevronUp, Camera, Calendar, Send, MessageCircle
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

// --- Constants ---

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const item = {
  hidden: { y: 12, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const socialLinks = [
  { icon: Mail, href: "mailto:zixinrena@gmail.com", label: "Email" },
  { icon: Linkedin, href: "https://linkedin.com/in/cindy-ren-707926147", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/dearccindy", label: "IG" },
];

const MacDots = () => (
  <div className="flex gap-1.5 absolute top-4 right-4">
    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
  </div>
);

// --- Types ---

interface PinItem {
  id: string;
  type: "note" | "photo";
  content: string;
  caption?: string;
  createdAt: number;
  archived: boolean;
}

interface VisitorNote {
  id: string;
  name: string;
  message: string;
  createdAt: number;
}

const STORAGE_KEY = "cindy-today-pins";
const VISITOR_NOTES_KEY = "cindy-visitor-notes";

const loadPins = (): PinItem[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
};
const savePins = (pins: PinItem[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));

const loadVisitorNotes = (): VisitorNote[] => {
  try { return JSON.parse(localStorage.getItem(VISITOR_NOTES_KEY) || "[]"); } catch { return []; }
};
const saveVisitorNotes = (notes: VisitorNote[]) => localStorage.setItem(VISITOR_NOTES_KEY, JSON.stringify(notes));

// --- Component ---

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [pins, setPins] = useState<PinItem[]>(loadPins);
  const [showArchive, setShowArchive] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [visitorNotes, setVisitorNotes] = useState<VisitorNote[]>(loadVisitorNotes);
  const [visitorName, setVisitorName] = useState("");
  const [visitorMessage, setVisitorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"today" | "calendar" | "guestbook">("today");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  useEffect(() => { savePins(pins); }, [pins]);
  useEffect(() => { saveVisitorNotes(visitorNotes); }, [visitorNotes]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [noteContent]);

  // Auto-focus textarea on mount
  useEffect(() => {
    if (activeTab === "today") {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [activeTab]);

  const activePins = pins.filter((p) => !p.archived);
  const archivedPins = pins.filter((p) => p.archived);

  const addPhoto = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPins((prev) => [{
          id: crypto.randomUUID(), type: "photo", content: reader.result as string,
          caption: "", createdAt: Date.now(), archived: false,
        }, ...prev]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, []);

  const saveNote = () => {
    if (!noteContent.trim()) return;
    setPins((prev) => [{
      id: crypto.randomUUID(), type: "note", content: noteContent.trim(),
      createdAt: Date.now(), archived: false,
    }, ...prev]);
    setNoteContent("");
  };

  const archivePin = (id: string) => setPins((prev) => prev.map((p) => p.id === id ? { ...p, archived: true } : p));
  const unarchivePin = (id: string) => setPins((prev) => prev.map((p) => p.id === id ? { ...p, archived: false } : p));
  const deletePin = (id: string) => setPins((prev) => prev.filter((p) => p.id !== id));
  const updateCaption = (id: string, caption: string) => setPins((prev) => prev.map((p) => p.id === id ? { ...p, caption } : p));

  const submitVisitorNote = () => {
    if (!visitorMessage.trim()) return;
    setVisitorNotes((prev) => [{
      id: crypto.randomUUID(), name: visitorName.trim() || "Anonymous",
      message: visitorMessage.trim(), createdAt: Date.now(),
    }, ...prev]);
    setVisitorName("");
    setVisitorMessage("");
  };

  const tabs = [
    { id: "today" as const, label: "Today", icon: StickyNote },
    { id: "calendar" as const, label: "Meet", icon: Calendar },
    { id: "guestbook" as const, label: "Guestbook", icon: MessageCircle },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="fixed right-0 bottom-0 w-2/3 h-full bg-contain bg-right-bottom bg-no-repeat opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: `url(${cityscape})` }}
      />

      <div className="relative z-10 h-screen">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* LEFT PANEL */}
          {!collapsed && (
            <>
              <ResizablePanel defaultSize={28} minSize={20} maxSize={40}>
                <div className="h-full border-r border-border bg-card/40 backdrop-blur-sm overflow-y-auto p-4">
                  <div className="mb-5">
                    <h2 className="font-display italic text-xl text-foreground/70">cindy's world</h2>
                  </div>

                  <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
                    {/* Hero Card */}
                    <motion.div variants={item} className="relative rounded-2xl bg-card border border-border p-5 overflow-hidden">
                      <MacDots />
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent/40 shrink-0">
                          <img src={avatar} alt="Cindy" className="w-full h-full object-cover" />
                        </div>
                        <div className="pt-1">
                          <h1 className="font-display italic text-2xl text-foreground leading-tight">hi, i'm cindy.</h1>
                        </div>
                      </div>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                        23-year-old startup founder in NYC. Harvard grad who left finance to build things that matter.
                      </p>
                      <div className="flex gap-2">
                        {socialLinks.map(({ icon: Icon, href, label }) => (
                          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background/50 text-xs font-body text-foreground/70 hover:text-foreground hover:border-accent/40 transition-colors">
                            <Icon size={13} /> {label}
                          </a>
                        ))}
                      </div>
                    </motion.div>

                    {/* Thoughts Card */}
                    <motion.div variants={item} className="relative rounded-2xl bg-card border border-border p-5 cursor-pointer hover:border-accent/30 transition-colors group">
                      <MacDots />
                      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center mb-3">
                        <BookOpen size={18} className="text-secondary-foreground" />
                      </div>
                      <p className="font-body text-xs tracking-widest text-accent uppercase mb-1">Thoughts & Reflections</p>
                      <h3 className="font-display text-lg text-foreground mb-1">Essays on growing up</h3>
                      <p className="font-body text-sm text-muted-foreground">Leaving finance, building startups, and figuring out life in your 20s.</p>
                      <ArrowRight size={14} className="text-accent mt-3 group-hover:translate-x-1 transition-transform" />
                    </motion.div>

                    {/* Quote Card */}
                    <motion.div variants={item} className="relative rounded-2xl bg-card border border-border p-5 text-center">
                      <MacDots />
                      <p className="font-display italic text-lg text-accent leading-snug mt-2">"Build the life you want to live."</p>
                      <span className="font-body text-xs tracking-widest text-muted-foreground mt-2 uppercase block">daily mantra</span>
                    </motion.div>

                    {/* Small widgets */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div variants={item} className="relative rounded-2xl bg-card border border-border p-4 cursor-pointer hover:border-accent/30 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center mb-2">
                          <Sparkles size={16} className="text-primary" />
                        </div>
                        <h3 className="font-display text-sm text-foreground">AI Hub</h3>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">Learning notes</p>
                      </motion.div>
                      <motion.div variants={item} className="relative rounded-2xl bg-card border border-border p-4 cursor-pointer hover:border-accent/30 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center mb-2">
                          <Briefcase size={16} className="text-accent" />
                        </div>
                        <h3 className="font-display text-sm text-foreground">Projects</h3>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">What I'm building</p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* RIGHT PANEL */}
          <ResizablePanel defaultSize={collapsed ? 100 : 72}>
            <div className="h-full overflow-y-auto bg-background">
              <div className="max-w-3xl mx-auto px-6 md:px-10 py-8">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCollapsed(!collapsed)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                    >
                      {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    </button>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-card/60 rounded-xl p-1 border border-border">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
                            activeTab === tab.id
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <tab.icon size={13} />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="font-body text-xs tracking-widest text-muted-foreground uppercase hidden md:block">{formattedDate}</p>
                </div>

                {/* ============ TODAY TAB ============ */}
                {activeTab === "today" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="today">
                    <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-4 mt-4">Today</h1>
                    <div className="w-full h-px bg-border mb-4" />

                    {/* Instant writing area */}
                    <div className="relative mb-4">
                      <textarea
                        ref={textareaRef}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="What's on your mind today..."
                        className="w-full bg-transparent font-body text-base md:text-lg text-foreground/90 leading-relaxed resize-none outline-none placeholder:text-muted-foreground/40 min-h-[120px]"
                        onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) saveNote(); }}
                      />
                      {noteContent.trim() && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 mt-1"
                        >
                          <button onClick={saveNote} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground font-body text-xs hover:bg-accent/90 transition-colors">
                            <Plus size={12} /> Pin it
                          </button>
                          <span className="font-body text-xs text-muted-foreground/50">⌘ + Enter</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-2 mb-6">
                      <button onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card/60 hover:bg-accent/10 hover:border-accent/30 font-body text-xs text-muted-foreground hover:text-foreground transition-all">
                        <Camera size={13} /> Photo
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={addPhoto} />
                    </div>

                    {/* Pins grid */}
                    {activePins.length > 0 && (
                      <div className="columns-2 md:columns-3 gap-3 space-y-3 mb-8">
                        <AnimatePresence>
                          {activePins.map((pin) => (
                            <motion.div key={pin.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                              className="break-inside-avoid rounded-2xl border border-border bg-card overflow-hidden group relative">
                              <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => archivePin(pin.id)} className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors" title="Archive">
                                  <Archive size={12} />
                                </button>
                                <button onClick={() => deletePin(pin.id)} className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                                  <X size={12} />
                                </button>
                              </div>
                              {pin.type === "photo" ? (
                                <>
                                  <img src={pin.content} alt="" className="w-full object-cover" />
                                  <div className="p-3">
                                    <input type="text" value={pin.caption || ""} onChange={(e) => updateCaption(pin.id, e.target.value)}
                                      placeholder="Add a caption..." className="w-full bg-transparent font-body text-xs text-foreground/70 outline-none placeholder:text-muted-foreground/40" />
                                  </div>
                                </>
                              ) : (
                                <div className="p-4">
                                  <p className="font-body text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{pin.content}</p>
                                  <p className="font-body text-xs text-muted-foreground/50 mt-3">
                                    {new Date(pin.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Archive */}
                    <div className="mt-8 pt-4 border-t border-border/50">
                      <button onClick={() => setShowArchive(!showArchive)}
                        className="flex items-center gap-2 font-body text-xs tracking-widest text-muted-foreground uppercase hover:text-foreground transition-colors w-full">
                        <Archive size={14} /> Archive ({archivedPins.length})
                        {showArchive ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
                      </button>
                      <AnimatePresence>
                        {showArchive && archivedPins.length > 0 && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="mt-4 columns-2 md:columns-3 gap-3 space-y-3 overflow-hidden">
                            {archivedPins.map((pin) => (
                              <div key={pin.id} className="break-inside-avoid rounded-2xl border border-border/50 bg-card/50 overflow-hidden group relative opacity-60 hover:opacity-100 transition-opacity">
                                <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => unarchivePin(pin.id)} className="p-1.5 rounded-lg bg-background/80 text-xs font-body text-muted-foreground hover:text-foreground">Restore</button>
                                  <button onClick={() => deletePin(pin.id)} className="p-1.5 rounded-lg bg-background/80 text-muted-foreground hover:text-destructive"><X size={12} /></button>
                                </div>
                                {pin.type === "photo" ? (
                                  <>
                                    <img src={pin.content} alt="" className="w-full object-cover" />
                                    {pin.caption && <div className="p-3"><p className="font-body text-xs text-foreground/50">{pin.caption}</p></div>}
                                  </>
                                ) : (
                                  <div className="p-4"><p className="font-body text-sm text-foreground/60 whitespace-pre-wrap">{pin.content}</p></div>
                                )}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* ============ CALENDAR TAB ============ */}
                {activeTab === "calendar" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="calendar">
                    <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-4 mt-4">Let's Meet</h1>
                    <div className="w-full h-px bg-border mb-6" />
                    <p className="font-body text-base text-muted-foreground mb-6">
                      Want to chat? Pick a time that works for you.
                    </p>
                    <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ minHeight: 600 }}>
                      {/* Replace with your Calendly URL */}
                      <iframe
                        src="https://calendly.com/zixinrena/30min"
                        width="100%"
                        height="650"
                        frameBorder="0"
                        className="w-full"
                        title="Schedule a meeting"
                      />
                    </div>
                  </motion.div>
                )}

                {/* ============ GUESTBOOK TAB ============ */}
                {activeTab === "guestbook" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="guestbook">
                    <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-4 mt-4">Guestbook</h1>
                    <div className="w-full h-px bg-border mb-6" />
                    <p className="font-body text-base text-muted-foreground mb-6">
                      Leave a note, say hi, or drop some wisdom ✨
                    </p>

                    {/* Submit form */}
                    <div className="rounded-2xl border border-border bg-card p-5 mb-8">
                      <input
                        type="text"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Your name (optional)"
                        className="w-full bg-transparent font-body text-sm text-foreground/90 outline-none placeholder:text-muted-foreground/40 mb-3 pb-3 border-b border-border/50"
                      />
                      <textarea
                        value={visitorMessage}
                        onChange={(e) => setVisitorMessage(e.target.value)}
                        placeholder="Write something nice..."
                        className="w-full bg-transparent font-body text-base text-foreground/90 leading-relaxed resize-none outline-none placeholder:text-muted-foreground/40 min-h-[80px]"
                        onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) submitVisitorNote(); }}
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={submitVisitorNote}
                          disabled={!visitorMessage.trim()}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-body text-sm hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Send size={13} /> Leave Note
                        </button>
                      </div>
                    </div>

                    {/* Notes list */}
                    <div className="space-y-3">
                      {visitorNotes.map((note) => (
                        <motion.div key={note.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl border border-border bg-card/60 p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                              <span className="font-display text-xs text-accent">{note.name[0].toUpperCase()}</span>
                            </div>
                            <span className="font-body text-sm text-foreground/80 font-medium">{note.name}</span>
                            <span className="font-body text-xs text-muted-foreground/50 ml-auto">
                              {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                          <p className="font-body text-sm text-foreground/75 leading-relaxed">{note.message}</p>
                        </motion.div>
                      ))}
                      {visitorNotes.length === 0 && (
                        <div className="text-center py-12">
                          <MessageCircle size={24} className="text-muted-foreground/30 mx-auto mb-3" />
                          <p className="font-body text-sm text-muted-foreground/50">No notes yet. Be the first!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Home;
