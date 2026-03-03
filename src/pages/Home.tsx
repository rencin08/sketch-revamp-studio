import avatar from "@/assets/avatar.png";
import cityscape from "@/assets/cityscape-sketch.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Linkedin, Instagram, ArrowRight, Sparkles, BookOpen,
  Briefcase, PanelLeftClose, PanelLeftOpen, Plus, StickyNote,
  Archive, X, ChevronDown, ChevronUp, Camera, Calendar, Send, MessageCircle,
  Tag, Hash
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

const DEFAULT_TAGS = ["idea", "todo", "reflection", "random", "work", "personal"];

const TAG_COLORS: Record<string, string> = {
  idea: "bg-[hsl(48,60%,90%)] text-[hsl(40,50%,35%)]",
  todo: "bg-[hsl(28,45%,90%)] text-[hsl(25,40%,35%)]",
  reflection: "bg-[hsl(200,30%,90%)] text-[hsl(200,25%,40%)]",
  random: "bg-[hsl(320,25%,92%)] text-[hsl(320,20%,40%)]",
  work: "bg-[hsl(150,25%,90%)] text-[hsl(150,20%,35%)]",
  personal: "bg-[hsl(270,25%,92%)] text-[hsl(270,20%,40%)]",
};

const MacDots = () => (
  <div className="flex gap-1.5 absolute top-4 right-4">
    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
  </div>
);

// --- Animated Writing Avatar ---
const WritingAvatar = () => (
  <motion.div
    className="flex items-end gap-3 mb-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.5 }}
  >
    <div className="relative">
      <motion.div
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent/30"
        animate={{ rotate: [0, -3, 3, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
      >
        <img src={avatar} alt="Cindy writing" className="w-full h-full object-cover" />
      </motion.div>
      <motion.div
        className="absolute -bottom-1 -right-1 text-accent"
        animate={{ rotate: [0, 15, -5, 10, 0], y: [0, -2, 1, -1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
      </motion.div>
    </div>
    <motion.div
      className="flex gap-1 pb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-accent/40"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.div>
  </motion.div>
);

// --- Types ---

interface PinItem {
  id: string;
  type: "note" | "photo";
  content: string;
  caption?: string;
  tags: string[];
  createdAt: number;
  archived: boolean;
}

interface ChatMessage {
  id: string;
  name: string;
  message: string;
  createdAt: number;
  isOwner?: boolean;
}

const STORAGE_KEY = "cindy-today-pins";
const CHAT_KEY = "cindy-chat-messages";

const loadPins = (): PinItem[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return raw.map((p: any) => ({ ...p, tags: p.tags || [] }));
  } catch { return []; }
};
const savePins = (pins: PinItem[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));

const loadChatMessages = (): ChatMessage[] => {
  try { return JSON.parse(localStorage.getItem(CHAT_KEY) || "[]"); } catch { return []; }
};
const saveChatMessages = (msgs: ChatMessage[]) => localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "good morning";
  if (h < 17) return "good afternoon";
  return "good evening";
};

// --- Component ---

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [pins, setPins] = useState<PinItem[]>(loadPins);
  const [showArchive, setShowArchive] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [archiveFilter, setArchiveFilter] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(loadChatMessages);
  const [chatInput, setChatInput] = useState("");
  const [chatName, setChatName] = useState(() => localStorage.getItem("cindy-chat-name") || "");
  const [showNameInput, setShowNameInput] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "calendar" | "messages">("today");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  useEffect(() => { savePins(pins); }, [pins]);
  useEffect(() => { saveChatMessages(chatMessages); }, [chatMessages]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [noteContent]);

  useEffect(() => {
    if (activeTab === "today") {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "messages") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  const activePins = pins.filter((p) => !p.archived);
  const archivedPins = pins.filter((p) => p.archived);
  const filteredArchive = archiveFilter
    ? archivedPins.filter((p) => p.tags.includes(archiveFilter))
    : archivedPins;

  // Collect all unique tags from archived pins
  const archiveTags = [...new Set(archivedPins.flatMap((p) => p.tags))];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addPhoto = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPins((prev) => [{
          id: crypto.randomUUID(), type: "photo", content: reader.result as string,
          caption: "", tags: [...selectedTags], createdAt: Date.now(), archived: false,
        }, ...prev]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, [selectedTags]);

  const saveNote = () => {
    if (!noteContent.trim()) return;
    setPins((prev) => [{
      id: crypto.randomUUID(), type: "note", content: noteContent.trim(),
      tags: [...selectedTags], createdAt: Date.now(), archived: false,
    }, ...prev]);
    setNoteContent("");
    setSelectedTags([]);
    setShowTagPicker(false);
  };

  const archivePin = (id: string) => setPins((prev) => prev.map((p) => p.id === id ? { ...p, archived: true } : p));
  const unarchivePin = (id: string) => setPins((prev) => prev.map((p) => p.id === id ? { ...p, archived: false } : p));
  const deletePin = (id: string) => setPins((prev) => prev.filter((p) => p.id !== id));
  const updateCaption = (id: string, caption: string) => setPins((prev) => prev.map((p) => p.id === id ? { ...p, caption } : p));

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const name = chatName.trim() || "Anonymous";
    localStorage.setItem("cindy-chat-name", name);
    setChatMessages((prev) => [...prev, {
      id: crypto.randomUUID(), name, message: chatInput.trim(), createdAt: Date.now(),
    }]);
    setChatInput("");
    chatInputRef.current?.focus();
  };

  const tabs = [
    { id: "today" as const, label: "Today", icon: StickyNote },
    { id: "calendar" as const, label: "Meet", icon: Calendar },
    { id: "messages" as const, label: "Messages", icon: MessageCircle },
  ];

  const renderPinTags = (tags: string[]) => {
    if (tags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`px-2 py-0.5 rounded-full text-[10px] font-body ${TAG_COLORS[tag] || "bg-muted text-muted-foreground"}`}
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-background">
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
            <div className="h-full overflow-hidden bg-background flex flex-col">
              {/* Toolbar */}
              <div className="px-6 md:px-10 pt-6 pb-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                  >
                    {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                  </button>
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

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* ============ TODAY TAB ============ */}
                {activeTab === "today" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="today">
                    {/* NYC Cityscape Hero */}
                    <div className="relative overflow-hidden" style={{ minHeight: 180 }}>
                      <div
                        className="absolute inset-0 bg-contain bg-bottom bg-no-repeat opacity-[0.08]"
                        style={{ backgroundImage: `url(${cityscape})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background" />
                      <div className="relative max-w-3xl mx-auto px-6 md:px-10 pt-4 pb-6">
                        <motion.p
                          className="font-body text-sm text-muted-foreground/60 mb-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {getGreeting()} ☀️
                        </motion.p>
                        <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-3 mt-1">Today</h1>
                        <WritingAvatar />
                      </div>
                    </div>

                    {/* Main content area */}
                    <div className="max-w-3xl mx-auto px-6 md:px-10">
                      {/* Writing area */}
                      <div className="relative mb-5 -mt-2">
                        <div className="rounded-2xl border border-border/60 bg-card/40 p-5 focus-within:border-accent/30 focus-within:bg-card/60 transition-all shadow-sm">
                          <textarea
                            ref={textareaRef}
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="dump your thoughts here... what are you thinking about? what happened today? anything goes ✏️"
                            className="w-full bg-transparent font-body text-base md:text-lg text-foreground/90 leading-relaxed resize-none outline-none placeholder:text-muted-foreground/35 min-h-[100px]"
                            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) saveNote(); }}
                          />

                          {/* Tags */}
                          {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {selectedTags.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={() => toggleTag(tag)}
                                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-body transition-all ${TAG_COLORS[tag] || "bg-muted text-muted-foreground"}`}
                                >
                                  #{tag} <X size={10} />
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/30">
                            <div className="flex items-center gap-2">
                              <button onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/50 hover:bg-accent/10 hover:border-accent/30 font-body text-xs text-muted-foreground hover:text-foreground transition-all">
                                <Camera size={13} /> Photo
                              </button>
                              <input ref={fileInputRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={addPhoto} />

                              {/* Tag button */}
                              <div className="relative">
                                <button
                                  onClick={() => setShowTagPicker(!showTagPicker)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/50 font-body text-xs transition-all ${
                                    showTagPicker || selectedTags.length > 0
                                      ? "bg-accent/10 border-accent/30 text-foreground"
                                      : "hover:bg-accent/10 hover:border-accent/30 text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  <Hash size={13} /> Tag {selectedTags.length > 0 && `(${selectedTags.length})`}
                                </button>
                                <AnimatePresence>
                                  {showTagPicker && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                      className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl p-2 shadow-lg z-20 min-w-[180px]"
                                    >
                                      <p className="font-body text-[10px] text-muted-foreground/50 uppercase tracking-widest px-2 mb-1.5">Add tags</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {DEFAULT_TAGS.map((tag) => (
                                          <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-2.5 py-1 rounded-full text-[11px] font-body transition-all ${
                                              selectedTags.includes(tag)
                                                ? `${TAG_COLORS[tag]} ring-1 ring-accent/30`
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                            }`}
                                          >
                                            #{tag}
                                          </button>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                            <AnimatePresence>
                              {noteContent.trim() && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="flex items-center gap-2"
                                >
                                  <span className="font-body text-xs text-muted-foreground/40">⌘ + Enter</span>
                                  <button onClick={saveNote} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-body text-xs hover:bg-accent/90 transition-colors">
                                    <Plus size={12} /> Pin it
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* Pins grid */}
                      {activePins.length > 0 && (
                        <div className="mb-8">
                          <p className="font-body text-xs tracking-widest text-muted-foreground/50 uppercase mb-4">Pinned</p>
                          <div className="columns-2 md:columns-3 gap-3 space-y-3">
                            <AnimatePresence>
                              {activePins.map((pin) => (
                                <motion.div key={pin.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                  className="break-inside-avoid rounded-2xl border border-border bg-card overflow-hidden group relative hover:shadow-md transition-shadow">
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
                                        {renderPinTags(pin.tags)}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="p-4">
                                      <p className="font-body text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{pin.content}</p>
                                      {renderPinTags(pin.tags)}
                                      <p className="font-body text-xs text-muted-foreground/50 mt-3">
                                        {new Date(pin.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                      </p>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}

                      {/* Empty state */}
                      {activePins.length === 0 && (
                        <motion.div
                          className="text-center py-12"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <StickyNote size={28} className="text-accent/20 mx-auto mb-3" />
                          </motion.div>
                          <p className="font-body text-sm text-muted-foreground/40">start typing above to pin your first thought</p>
                          <p className="font-body text-xs text-muted-foreground/25 mt-1">photos, ideas, reminders — anything goes</p>
                        </motion.div>
                      )}

                      {/* Archive */}
                      {archivedPins.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-border/50 pb-8">
                          <button onClick={() => setShowArchive(!showArchive)}
                            className="flex items-center gap-2 font-body text-xs tracking-widest text-muted-foreground uppercase hover:text-foreground transition-colors w-full">
                            <Archive size={14} /> Archive ({archivedPins.length})
                            {showArchive ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
                          </button>
                          <AnimatePresence>
                            {showArchive && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                {/* Tag filter for archive */}
                                {archiveTags.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 mt-4 mb-3">
                                    <Tag size={12} className="text-muted-foreground/40" />
                                    <button
                                      onClick={() => setArchiveFilter(null)}
                                      className={`px-2.5 py-1 rounded-full text-[11px] font-body transition-all ${
                                        !archiveFilter ? "bg-accent/15 text-accent" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                      }`}
                                    >
                                      All
                                    </button>
                                    {archiveTags.map((tag) => (
                                      <button
                                        key={tag}
                                        onClick={() => setArchiveFilter(archiveFilter === tag ? null : tag)}
                                        className={`px-2.5 py-1 rounded-full text-[11px] font-body transition-all ${
                                          archiveFilter === tag
                                            ? `${TAG_COLORS[tag]} ring-1 ring-accent/30`
                                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        }`}
                                      >
                                        #{tag}
                                      </button>
                                    ))}
                                  </div>
                                )}
                                <div className="mt-3 columns-2 md:columns-3 gap-3 space-y-3">
                                  {filteredArchive.map((pin) => (
                                    <div key={pin.id} className="break-inside-avoid rounded-2xl border border-border/50 bg-card/50 overflow-hidden group relative opacity-60 hover:opacity-100 transition-opacity">
                                      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => unarchivePin(pin.id)} className="p-1.5 rounded-lg bg-background/80 text-xs font-body text-muted-foreground hover:text-foreground">Restore</button>
                                        <button onClick={() => deletePin(pin.id)} className="p-1.5 rounded-lg bg-background/80 text-muted-foreground hover:text-destructive"><X size={12} /></button>
                                      </div>
                                      {pin.type === "photo" ? (
                                        <>
                                          <img src={pin.content} alt="" className="w-full object-cover" />
                                          {pin.caption && <div className="p-3"><p className="font-body text-xs text-foreground/50">{pin.caption}</p></div>}
                                          {pin.tags.length > 0 && <div className="px-3 pb-2">{renderPinTags(pin.tags)}</div>}
                                        </>
                                      ) : (
                                        <div className="p-4">
                                          <p className="font-body text-sm text-foreground/60 whitespace-pre-wrap">{pin.content}</p>
                                          {renderPinTags(pin.tags)}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  {filteredArchive.length === 0 && (
                                    <div className="col-span-full text-center py-6">
                                      <p className="font-body text-xs text-muted-foreground/40">No archived items with this tag</p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ============ CALENDAR TAB ============ */}
                {activeTab === "calendar" && (
                  <div className="max-w-3xl mx-auto px-6 md:px-10 py-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="calendar">
                      <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-4 mt-4">Let's Meet</h1>
                      <div className="w-full h-px bg-border mb-6" />
                      <p className="font-body text-base text-muted-foreground mb-6">
                        Want to chat? Pick a time that works for you.
                      </p>
                      <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ minHeight: 600 }}>
                        <iframe
                          src="https://calendly.com/ccindyren"
                          width="100%"
                          height="650"
                          frameBorder="0"
                          className="w-full"
                          title="Schedule a meeting"
                        />
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* ============ MESSAGES TAB ============ */}
                {activeTab === "messages" && (
                  <div className="max-w-3xl mx-auto px-6 md:px-10 py-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="messages" className="flex flex-col" style={{ minHeight: "calc(100vh - 140px)" }}>
                      <div className="mb-4">
                        <h1 className="font-display italic text-4xl md:text-5xl text-foreground mt-4">Messages</h1>
                        <p className="font-body text-sm text-muted-foreground mt-2">
                          send me a message — feedback, ideas, or just say hi 💬
                        </p>
                      </div>

                      <div className="flex-1 rounded-2xl border border-border bg-card/30 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
                          <div className="flex items-end gap-2 max-w-[75%]">
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-accent/30 shrink-0">
                              <img src={avatar} alt="Cindy" className="w-full h-full object-cover" />
                            </div>
                            <motion.div
                              className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2.5"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                            >
                              <p className="font-body text-sm text-secondary-foreground">hey! thanks for stopping by 🤗 leave me a message — i'd love to hear your thoughts on the site, or anything really!</p>
                            </motion.div>
                          </div>

                          {chatMessages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className={`flex items-end gap-2 ${msg.isOwner ? "max-w-[75%]" : "max-w-[75%] ml-auto flex-row-reverse"}`}
                            >
                              {msg.isOwner ? (
                                <div className="w-7 h-7 rounded-full overflow-hidden border border-accent/30 shrink-0">
                                  <img src={avatar} alt="Cindy" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                                  <span className="font-display text-[10px] text-accent">{msg.name[0].toUpperCase()}</span>
                                </div>
                              )}
                              <div className={`rounded-2xl px-4 py-2.5 ${
                                msg.isOwner ? "bg-secondary rounded-bl-md" : "bg-accent text-accent-foreground rounded-br-md"
                              }`}>
                                {!msg.isOwner && <p className="font-body text-[10px] opacity-70 mb-0.5">{msg.name}</p>}
                                <p className={`font-body text-sm leading-relaxed ${msg.isOwner ? "text-secondary-foreground" : ""}`}>{msg.message}</p>
                                <p className={`font-body text-[10px] mt-1 ${msg.isOwner ? "text-muted-foreground/40" : "opacity-50"}`}>
                                  {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                          <div ref={chatEndRef} />
                        </div>

                        <AnimatePresence>
                          {showNameInput && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-border/30 px-4 py-2 bg-card/50 overflow-hidden"
                            >
                              <input
                                type="text"
                                value={chatName}
                                onChange={(e) => setChatName(e.target.value)}
                                placeholder="Your name (optional)"
                                className="w-full bg-transparent font-body text-xs text-foreground/70 outline-none placeholder:text-muted-foreground/40"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="border-t border-border/40 p-3 bg-card/50 flex items-center gap-2">
                          <button
                            onClick={() => setShowNameInput(!showNameInput)}
                            className={`p-2 rounded-full transition-colors ${showNameInput ? "bg-accent/15 text-accent" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
                            title="Set your name"
                          >
                            <span className="font-display text-xs">
                              {chatName ? chatName[0].toUpperCase() : "?"}
                            </span>
                          </button>
                          <div className="flex-1 flex items-center bg-background rounded-full border border-border/50 px-4 py-2">
                            <input
                              ref={chatInputRef}
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="iMessage"
                              className="flex-1 bg-transparent font-body text-sm text-foreground outline-none placeholder:text-muted-foreground/30"
                              onKeyDown={(e) => { if (e.key === "Enter") sendChatMessage(); }}
                            />
                          </div>
                          <motion.button
                            onClick={sendChatMessage}
                            disabled={!chatInput.trim()}
                            className="p-2 rounded-full bg-accent text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            whileTap={{ scale: 0.9 }}
                          >
                            <Send size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
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
