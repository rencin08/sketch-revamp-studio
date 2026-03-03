import avatar from "@/assets/avatar.png";
import cityscape from "@/assets/cityscape-sketch.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Linkedin, Instagram, ArrowRight, Sparkles, BookOpen,
  Briefcase, PanelLeftClose, PanelLeftOpen, Plus, StickyNote,
  Archive, X, ChevronDown, ChevronUp, Camera, Calendar, Send, MessageCircle,
  Hash, Share2, Check, Square, CheckSquare, ShoppingCart, Lightbulb,
  ListTodo, BookMarked, Utensils, Target, Pen, Menu, Heart, Zap
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";

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

// --- Tag system with templates ---
interface TagConfig {
  label: string;
  icon: any;
  color: string;
  template?: string;
}

const TAGS: Record<string, TagConfig> = {
  todo: {
    label: "To-Do",
    icon: ListTodo,
    color: "bg-[hsl(28,45%,90%)] text-[hsl(25,40%,35%)]",
    template: "☐ \n☐ \n☐ ",
  },
  grocery: {
    label: "Grocery",
    icon: ShoppingCart,
    color: "bg-[hsl(150,30%,90%)] text-[hsl(150,25%,35%)]",
    template: "🛒 Grocery List\n☐ \n☐ \n☐ \n☐ \n☐ ",
  },
  idea: {
    label: "Idea",
    icon: Lightbulb,
    color: "bg-[hsl(48,60%,90%)] text-[hsl(40,50%,35%)]",
    template: "💡 Idea: \n\nWhy it matters:\n\nNext steps:\n- ",
  },
  journal: {
    label: "Journal",
    icon: BookMarked,
    color: "bg-[hsl(270,25%,92%)] text-[hsl(270,20%,40%)]",
    template: "How am I feeling today?\n\n\nWhat happened?\n\n\nWhat am I grateful for?\n1. \n2. \n3. ",
  },
  recipe: {
    label: "Recipe",
    icon: Utensils,
    color: "bg-[hsl(15,40%,92%)] text-[hsl(15,35%,40%)]",
    template: "🍳 Recipe: \n\nIngredients:\n- \n- \n- \n\nSteps:\n1. \n2. \n3. ",
  },
  goals: {
    label: "Goals",
    icon: Target,
    color: "bg-[hsl(200,30%,90%)] text-[hsl(200,25%,40%)]",
    template: "🎯 Goal: \n\nWhy:\n\nMilestones:\n☐ \n☐ \n☐ \n\nDeadline: ",
  },
  note: {
    label: "Note",
    icon: Pen,
    color: "bg-[hsl(38,25%,91%)] text-[hsl(30,18%,40%)]",
  },
  random: {
    label: "Random",
    icon: Sparkles,
    color: "bg-[hsl(320,25%,92%)] text-[hsl(320,20%,40%)]",
  },
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
    className="flex items-end gap-3 mb-3"
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
    <motion.div className="flex gap-1 pb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-accent/40" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </motion.div>
  </motion.div>
);

// --- Types ---

interface PinItem {
  id: string;
  type: "note" | "photo" | "mood" | "moment";
  content: string;
  caption?: string;
  tags: string[];
  checklist?: { text: string; checked: boolean }[];
  mood?: string;
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
    return raw.map((p: any) => ({ ...p, tags: p.tags || [], checklist: p.checklist || undefined }));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};
const savePins = (pins: PinItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
  } catch (e) {
    console.warn("localStorage quota exceeded, pruning photo data...");
    const pruned = pins.map((p) => {
      if (p.type === "photo" && p.archived) {
        return { ...p, content: "" };
      }
      return p;
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
    } catch {
      const aggressive = pruned.filter((p) => p.type !== "photo" || !p.archived);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(aggressive));
      } catch {
        // Give up silently
      }
    }
  }
};

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

const getTimeOfDayContext = () => {
  const h = new Date().getHours();
  if (h < 12) return { period: "morning", emoji: "🌅", prompt: "Set an intention" };
  if (h < 17) return { period: "afternoon", emoji: "☀️", prompt: "Energy check" };
  return { period: "evening", emoji: "🌙", prompt: "Reflect on today" };
};

// Daily prompts — rotates based on day of year
const DAILY_PROMPTS = [
  "What's one thing you want to remember about today?",
  "What scared you recently — and what did you learn?",
  "Who made your week better? Tell them.",
  "What would past-you be proud of right now?",
  "What's something you're avoiding? Why?",
  "Describe today in three words.",
  "What's one small thing that brought you joy?",
  "If you could tell tomorrow-you one thing, what would it be?",
  "What's a belief you changed recently?",
  "What does 'enough' look like today?",
  "What's the bravest thing you did this week?",
  "What conversation is stuck in your head?",
  "What would you do if you weren't afraid?",
  "Name one person you're grateful for today.",
];

const getDailyPrompt = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
};

const parseChecklist = (content: string): { text: string; checked: boolean }[] | undefined => {
  const lines = content.split("\n");
  const checkItems = lines.filter((l) => l.startsWith("☐ ") || l.startsWith("☑ "));
  if (checkItems.length === 0) return undefined;
  return checkItems.map((l) => ({
    checked: l.startsWith("☑"),
    text: l.replace(/^[☐☑]\s*/, ""),
  }));
};

// --- Component ---

const Home = () => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pins, setPins] = useState<PinItem[]>(loadPins);
  const [showArchive, setShowArchive] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [archiveFilter, setArchiveFilter] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(loadChatMessages);
  const [chatInput, setChatInput] = useState("");
  const [chatName, setChatName] = useState(() => localStorage.getItem("cindy-chat-name") || "");
  const [showNameInput, setShowNameInput] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "calendar" | "messages">("today");
  const [shareToast, setShareToast] = useState(false);
  const [expandedPinId, setExpandedPinId] = useState<string | null>(null);
  const [canvasDate] = useState(() => {
    const d = new Date();
    return { dayNum: d.getDate(), weekday: d.toLocaleDateString("en-US", { weekday: "long" }), monthYear: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }) };
  });
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
  const archiveTags = [...new Set(archivedPins.flatMap((p) => p.tags))];

  const selectTag = (tagKey: string) => {
    const wasSelected = selectedTags.includes(tagKey);
    const newTags = wasSelected
      ? selectedTags.filter((t) => t !== tagKey)
      : [...selectedTags, tagKey];
    setSelectedTags(newTags);

    if (!wasSelected && TAGS[tagKey]?.template && !noteContent.trim()) {
      setNoteContent(TAGS[tagKey].template!);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const pos = TAGS[tagKey].template!.indexOf(": ") + 2 || TAGS[tagKey].template!.indexOf("☐ ") + 2;
          if (pos > 1) {
            textareaRef.current.setSelectionRange(pos, pos);
          }
        }
      }, 50);
    }
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
    const checklist = parseChecklist(noteContent);
    setPins((prev) => [{
      id: crypto.randomUUID(), type: "note", content: noteContent.trim(),
      tags: [...selectedTags], checklist, createdAt: Date.now(), archived: false,
    }, ...prev]);
    setNoteContent("");
    setSelectedTags([]);
  };

  const toggleCheckItem = (pinId: string, idx: number) => {
    setPins((prev) => prev.map((p) => {
      if (p.id !== pinId || !p.checklist) return p;
      const newChecklist = p.checklist.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      );
      const lines = p.content.split("\n");
      let checkIdx = 0;
      const newLines = lines.map((line) => {
        if (line.startsWith("☐ ") || line.startsWith("☑ ")) {
          if (checkIdx === idx) {
            checkIdx++;
            return newChecklist[idx].checked ? `☑ ${newChecklist[idx].text}` : `☐ ${newChecklist[idx].text}`;
          }
          checkIdx++;
        }
        return line;
      });
      return { ...p, checklist: newChecklist, content: newLines.join("\n") };
    }));
  };

  const archivePin = (id: string) => setPins((prev) => prev.map((p) => p.id === id ? { ...p, archived: true } : p));
  const unarchivePin = (id: string) => setPins((prev) => prev.map((p) => p.id === id ? { ...p, archived: false } : p));
  const deletePin = (id: string) => setPins((prev) => prev.filter((p) => p.id !== id));
  const updateCaption = (id: string, caption: string) => setPins((prev) => prev.map((p) => p.id === id ? { ...p, caption } : p));

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

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

  const getWidgetSize = (pin: PinItem): "small" | "medium" | "large" => {
    if (pin.type === "photo") return "large";
    if (pin.checklist && pin.checklist.length > 0) return "medium";
    if (pin.content.length > 120 || pin.content.split("\n").length > 4) return "medium";
    return "small";
  };

  const groupPinsByTag = (pinsList: PinItem[]) => {
    const groups: Record<string, PinItem[]> = {};
    const ungrouped: PinItem[] = [];
    pinsList.forEach((pin) => {
      if (pin.tags.length > 0) {
        const primaryTag = pin.tags[0];
        if (!groups[primaryTag]) groups[primaryTag] = [];
        groups[primaryTag].push(pin);
      } else {
        ungrouped.push(pin);
      }
    });
    return { groups, ungrouped };
  };

  // Compact widget card
  const renderWidget = (pin: PinItem, isArchived = false) => {
    const size = getWidgetSize(pin);
    const hasChecklist = pin.checklist && pin.checklist.length > 0;
    const completedCount = pin.checklist?.filter((c) => c.checked).length || 0;
    const totalCount = pin.checklist?.length || 0;
    const primaryTag = pin.tags[0];
    const tagConfig = primaryTag ? TAGS[primaryTag] : null;
    const TagIcon = tagConfig?.icon;

    return (
      <motion.div
        key={pin.id}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`rounded-2xl border border-border bg-card overflow-hidden group relative transition-all hover:shadow-md ${
          isArchived ? "opacity-60 hover:opacity-100" : ""
        } ${size === "large" ? "col-span-2" : size === "medium" && !isMobile ? "col-span-2 sm:col-span-1" : ""}`}
      >
        {/* Hover actions */}
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isArchived ? (
            <button onClick={() => unarchivePin(pin.id)} className="px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm text-[10px] font-body text-muted-foreground hover:text-foreground">Restore</button>
          ) : (
            <button onClick={() => archivePin(pin.id)} className="p-1 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors">
              <Archive size={10} />
            </button>
          )}
          <button onClick={() => deletePin(pin.id)} className="p-1 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors">
            <X size={10} />
          </button>
        </div>

        {pin.type === "photo" ? (
          <div className="flex gap-0">
            <img src={pin.content} alt="" className="w-1/2 object-cover max-h-40" />
            <div className="flex-1 p-3 flex flex-col justify-center">
              <input type="text" value={pin.caption || ""} onChange={(e) => updateCaption(pin.id, e.target.value)}
                placeholder="Caption..." className="w-full bg-transparent font-body text-xs text-foreground/70 outline-none placeholder:text-muted-foreground/40" />
              <p className="font-body text-[10px] text-muted-foreground/40 mt-1">
                {new Date(pin.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
        ) : hasChecklist ? (
          <div className="p-3.5">
            <div className="flex items-center gap-2 mb-2">
              {TagIcon && <TagIcon size={13} className="text-accent/60" />}
              {pin.content.split("\n").filter((l) => !l.startsWith("☐ ") && !l.startsWith("☑ ") && l.trim()).slice(0, 1).map((line, i) => (
                <p key={i} className="font-body text-xs font-medium text-foreground/80 truncate">{line}</p>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div className="h-full rounded-full bg-accent/50" animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }} />
              </div>
              <span className="font-body text-[9px] text-muted-foreground/50">{completedCount}/{totalCount}</span>
            </div>
            <div className="space-y-1">
              {pin.checklist!.slice(0, 4).map((ci, idx) => (
                <button key={idx} onClick={() => !isArchived && toggleCheckItem(pin.id, idx)} className="flex items-center gap-2 w-full text-left group/item">
                  {ci.checked ? <CheckSquare size={12} className="text-accent shrink-0" /> : <Square size={12} className="text-muted-foreground/30 shrink-0 group-hover/item:text-muted-foreground" />}
                  <span className={`font-body text-xs truncate ${ci.checked ? "line-through text-muted-foreground/40" : "text-foreground/70"}`}>{ci.text || "..."}</span>
                </button>
              ))}
              {pin.checklist!.length > 4 && (
                <p className="font-body text-[10px] text-muted-foreground/40 pl-5">+{pin.checklist!.length - 4} more</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-3.5">
            {TagIcon && <TagIcon size={13} className="text-accent/40 mb-1.5" />}
            <p className="font-body text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap line-clamp-5">{pin.content}</p>
            <p className="font-body text-[10px] text-muted-foreground/35 mt-2">
              {new Date(pin.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  // Render a tag group section
  const renderTagGroup = (tagKey: string, groupPins: PinItem[], isArchived = false) => {
    const config = TAGS[tagKey];
    const Icon = config?.icon;
    return (
      <div key={tagKey} className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          {Icon && <Icon size={13} className="text-muted-foreground/50" />}
          <span className="font-body text-[11px] tracking-widest text-muted-foreground/50 uppercase">{config?.label || tagKey}</span>
          <span className="font-body text-[10px] text-muted-foreground/30">{groupPins.length}</span>
        </div>
        <div className={`grid gap-2.5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          <AnimatePresence>
            {groupPins.map((pin) => renderWidget(pin, isArchived))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // --- Extracted render helpers for layout ---

  const renderSidebarContent = () => (
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
        <div className="flex gap-2 flex-wrap">
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

      {/* Weekly Digest Card */}
      <motion.div variants={item} className="relative rounded-2xl bg-card border border-border p-5 overflow-hidden">
        <MacDots />
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-accent" />
          <p className="font-body text-xs tracking-widest text-accent uppercase">This Week</p>
        </div>
        {(() => {
          const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          const weekPins = pins.filter(p => p.createdAt > weekAgo && !p.archived);
          const weekMoods = weekPins.filter(p => p.type === "mood");
          const weekNotes = weekPins.filter(p => p.type === "note" || p.type === "moment");
          const weekPhotos = weekPins.filter(p => p.type === "photo");
          return weekPins.length > 0 ? (
            <div className="space-y-2">
              <p className="font-display text-lg text-foreground">{weekPins.length} moments</p>
              <div className="flex items-center gap-4 font-body text-xs text-muted-foreground">
                {weekNotes.length > 0 && <span>{weekNotes.length} thoughts</span>}
                {weekMoods.length > 0 && <span>{weekMoods.map(m => m.content).join("")}</span>}
                {weekPhotos.length > 0 && <span>{weekPhotos.length} 📸</span>}
              </div>
              {weekNotes.length > 0 && (
                <p className="font-body text-sm text-muted-foreground/60 italic mt-2 line-clamp-2">
                  "{weekNotes[0].content.split("\n")[0]}"
                </p>
              )}
            </div>
          ) : (
            <p className="font-body text-sm text-muted-foreground/40">Start capturing moments to see your weekly digest</p>
          );
        })()}
      </motion.div>
    </motion.div>
  );

  const renderToolbar = () => {
    if (isMobile) {
      return (
        <div className="px-5 pt-5 pb-1 flex items-center justify-between shrink-0">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 -ml-2 rounded-xl text-muted-foreground/50 hover:text-foreground hover:bg-card transition-all active:scale-95">
            <Menu size={20} />
          </button>
          <p className="font-body text-xs tracking-widest text-muted-foreground uppercase">
            {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
      );
    }
    return (
      <div className="px-10 pt-6 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <div className="flex items-center gap-1 bg-card/60 rounded-xl p-1 border border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
                  activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={shareLink} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
            <Share2 size={13} /> Share
          </button>
          <p className="font-body text-xs tracking-widest text-muted-foreground uppercase hidden lg:block">{formattedDate}</p>
        </div>
      </div>
    );
  };

  const renderTabContent = () => (
    <>
      {/* ============ TODAY TAB ============ */}
      {activeTab === "today" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="today">
          {isMobile ? (
             <div className="pb-24">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {/* Header: Today + Date */}
                <div className="px-6 pt-2 pb-4">
                  <div className="flex items-baseline justify-between mb-5">
                    <h1 className="font-display text-4xl text-foreground">Today</h1>
                    <p className="font-body text-sm text-muted-foreground">
                      {today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>

                  {/* Today / Archive tab switcher */}
                  <div className="flex mb-5 bg-secondary rounded-xl p-1">
                    <button 
                      onClick={() => setShowArchive(false)}
                      className={`flex-1 py-2 rounded-lg font-body text-sm font-medium transition-all ${
                        !showArchive ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      Today
                    </button>
                    <button 
                      onClick={() => setShowArchive(true)}
                      className={`flex-1 py-2 rounded-lg font-body text-sm font-medium transition-all ${
                        showArchive ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      Archive
                    </button>
                  </div>

                  {/* Tag filter chips */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {Object.entries(TAGS).slice(0, 6).map(([key, config]) => {
                      const Icon = config.icon;
                      const isSelected = selectedTags.includes(key);
                      return (
                        <button key={key} onClick={() => selectTag(key)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border font-body text-sm transition-all ${
                            isSelected 
                              ? "border-foreground bg-foreground/5 text-foreground" 
                              : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                          }`}>
                          <Icon size={14} /> {config.label.toLowerCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick capture input */}
                {!showArchive && (
                  <div className="px-6 mb-4">
                    <div className="rounded-2xl border-2 border-border bg-card p-4">
                      <textarea 
                        ref={textareaRef} 
                        value={noteContent} 
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="write something..."
                        className="w-full bg-transparent font-body text-base text-foreground resize-none outline-none placeholder:text-muted-foreground/40 min-h-[60px]"
                        onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey && noteContent.trim()) { e.preventDefault(); saveNote(); } }}
                      />
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                        <div className="flex items-center gap-1">
                          <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                            <Camera size={18} />
                          </button>
                          <input ref={fileInputRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={addPhoto} />
                          {["😊", "😌", "🔥", "😔"].map((emoji) => (
                            <button key={emoji} onClick={() => {
                              setPins((prev) => [{ id: crypto.randomUUID(), type: "mood" as const, content: emoji, tags: [], createdAt: Date.now(), archived: false }, ...prev]);
                            }} className="text-base p-1 opacity-40 hover:opacity-100 transition-all">{emoji}</button>
                          ))}
                        </div>
                        <AnimatePresence>
                          {noteContent.trim() && (
                            <motion.button onClick={saveNote} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-foreground text-background font-body text-xs font-medium transition-all active:scale-95">
                              <Plus size={12} /> Pin
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card grid */}
                <div className="px-6">
                  {(() => {
                    const displayPins = showArchive ? archivedPins : activePins;
                    if (displayPins.length === 0) {
                      return (
                        <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Pen size={20} className="text-muted-foreground/15 mx-auto mb-3" />
                          <p className="font-display italic text-muted-foreground/20 text-lg">
                            {showArchive ? "no archived entries yet" : "your page awaits"}
                          </p>
                        </motion.div>
                      );
                    }

                    // Build masonry-style two-column layout
                    const col1: PinItem[] = [];
                    const col2: PinItem[] = [];
                    displayPins.forEach((pin, i) => {
                      if (i % 2 === 0) col1.push(pin);
                      else col2.push(pin);
                    });

                    const renderMobileCard = (pin: PinItem) => {
                      const hasChecklist = pin.checklist && pin.checklist.length > 0;
                      const primaryTag = pin.tags[0];
                      const tagConfig = primaryTag ? TAGS[primaryTag] : null;
                      const categoryLabel = hasChecklist ? "TODO" : pin.type === "photo" ? "PHOTO" : pin.type === "mood" ? "MOOD" : tagConfig?.label?.toUpperCase() || "NOTE";

                      return (
                        <motion.div
                          key={pin.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="rounded-2xl border-2 border-border bg-card overflow-hidden group relative mb-3"
                          onClick={() => pin.type !== "mood" && setExpandedPinId(pin.id)}
                        >
                          {/* Hover delete */}
                          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); showArchive ? unarchivePin(pin.id) : archivePin(pin.id); }}
                              className="p-1 rounded-lg bg-background/80 text-muted-foreground hover:text-foreground">
                              <Archive size={12} />
                            </button>
                          </div>

                          <div className="p-4">
                            {/* Category label */}
                            <p className="font-body text-[11px] font-semibold tracking-[0.15em] text-muted-foreground mb-1.5">{categoryLabel}</p>

                            {pin.type === "mood" ? (
                              <span className="text-3xl">{pin.content}</span>
                            ) : pin.type === "photo" ? (
                              <>
                                <div className="rounded-xl overflow-hidden bg-secondary mb-2 -mx-1">
                                  <img src={pin.content} alt="" className="w-full object-cover max-h-36" />
                                </div>
                                {pin.caption && <p className="font-body text-sm text-muted-foreground italic">{pin.caption}</p>}
                              </>
                            ) : hasChecklist ? (
                              <>
                                {pin.content.split("\n").filter((l) => !l.startsWith("☐ ") && !l.startsWith("☑ ") && l.trim()).slice(0, 1).map((line, i) => (
                                  <h3 key={i} className="font-display text-lg text-foreground font-semibold mb-2">{line}</h3>
                                ))}
                                <div className="space-y-2">
                                  {pin.checklist!.map((ci, idx) => (
                                    <button key={idx} onClick={(e) => { e.stopPropagation(); toggleCheckItem(pin.id, idx); }} className="flex items-center gap-2.5 w-full text-left">
                                      {ci.checked ? <CheckSquare size={16} className="text-foreground shrink-0" /> : <Square size={16} className="text-muted-foreground/40 shrink-0" />}
                                      <span className={`font-body text-sm ${ci.checked ? "line-through text-muted-foreground/40" : "text-foreground/80"}`}>{ci.text || "..."}</span>
                                    </button>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <>
                                {(() => {
                                  const lines = pin.content.split("\n");
                                  const title = lines[0];
                                  const body = lines.slice(1).join("\n").trim();
                                  return (
                                    <>
                                      <h3 className="font-display text-lg text-foreground font-semibold mb-1">{title}</h3>
                                      {body && <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{body}</p>}
                                    </>
                                  );
                                })()}
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    };

                    return (
                      <div className="grid grid-cols-2 gap-3 items-start">
                        <div>
                          <AnimatePresence>{col1.map(renderMobileCard)}</AnimatePresence>
                        </div>
                        <div>
                          <AnimatePresence>{col2.map(renderMobileCard)}</AnimatePresence>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            </div>
          ) : (
            /* ===== DESKTOP: Keep existing layout ===== */
            <>
              <div className="relative overflow-hidden" style={{ minHeight: 160 }}>
                <div className="absolute inset-0 bg-contain bg-bottom bg-no-repeat opacity-[0.08]" style={{ backgroundImage: `url(${cityscape})` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background" />
                <div className="relative max-w-2xl mx-auto px-10 pt-4 pb-4">
                  <motion.p className="font-body text-sm text-muted-foreground/60 mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    {getGreeting()} ☀️
                  </motion.p>
                  <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-3 mt-1">Today</h1>
                  <WritingAvatar />
                </div>
              </div>
              <div className="max-w-2xl mx-auto px-10">
                {/* Desktop writing area */}
                <div className="relative mb-5 -mt-2">
                  <div className="rounded-2xl border border-border/60 bg-card/40 p-5 focus-within:border-accent/30 focus-within:bg-card/60 transition-all shadow-sm">
                    <textarea
                      ref={textareaRef}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="what's on your mind? pick a tag below to get started with a template ✏️"
                      className="w-full bg-transparent font-body text-base md:text-lg text-foreground/90 leading-relaxed resize-none outline-none placeholder:text-muted-foreground/35 min-h-[100px]"
                      onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) saveNote(); }}
                    />
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {selectedTags.map((tag) => {
                          const config = TAGS[tag];
                          const Icon = config?.icon;
                          return (
                            <button key={tag} onClick={() => selectTag(tag)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-body transition-all ${config?.color || "bg-muted text-muted-foreground"}`}>
                              {Icon && <Icon size={10} />} #{tag} <X size={10} />
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <button onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/50 hover:bg-accent/10 hover:border-accent/30 font-body text-xs text-muted-foreground hover:text-foreground transition-all">
                          <Camera size={13} /> Photo
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={addPhoto} />
                      </div>
                      <AnimatePresence>
                        {noteContent.trim() && (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center gap-2">
                            <span className="font-body text-xs text-muted-foreground/40">⌘ + Enter</span>
                            <button onClick={saveNote} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-body text-xs hover:bg-accent/90 transition-colors">
                              <Plus size={12} /> Pin it
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {Object.entries(TAGS).map(([key, config]) => {
                      const Icon = config.icon;
                      const isSelected = selectedTags.includes(key);
                      return (
                        <button key={key} onClick={() => selectTag(key)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs transition-all ${
                            isSelected ? `${config.color} ring-1 ring-accent/20 shadow-sm` : "bg-card/60 text-muted-foreground hover:text-foreground border border-border/40 hover:border-accent/30"
                          }`}>
                          <Icon size={12} /> {config.label}
                          {config.template && !isSelected && <span className="text-[9px] opacity-40 ml-0.5">✦</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activePins.length > 0 && (() => {
                  const { groups, ungrouped } = groupPinsByTag(activePins);
                  return (
                    <div className="mb-6">
                      {Object.entries(groups).map(([tagKey, groupPins]) => renderTagGroup(tagKey, groupPins))}
                      {ungrouped.length > 0 && (
                        <div className="mb-5">
                          <div className="flex items-center gap-2 mb-2">
                            <StickyNote size={13} className="text-muted-foreground/50" />
                            <span className="font-body text-[11px] tracking-widest text-muted-foreground/50 uppercase">Notes</span>
                            <span className="font-body text-[10px] text-muted-foreground/30">{ungrouped.length}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2.5">
                            <AnimatePresence>{ungrouped.map((pin) => renderWidget(pin))}</AnimatePresence>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {activePins.length === 0 && (
                  <motion.div className="text-center py-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                      <StickyNote size={28} className="text-accent/20 mx-auto mb-3" />
                    </motion.div>
                    <p className="font-body text-sm text-muted-foreground/40">pick a tag above to get started with a template</p>
                    <p className="font-body text-xs text-muted-foreground/25 mt-1">or just start typing — anything goes</p>
                  </motion.div>
                )}

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
                          {archiveTags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-4 mb-3">
                              <button onClick={() => setArchiveFilter(null)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-body transition-all ${!archiveFilter ? "bg-accent/15 text-accent" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                                All
                              </button>
                              {archiveTags.map((tag) => (
                                <button key={tag} onClick={() => setArchiveFilter(archiveFilter === tag ? null : tag)}
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-body transition-all ${
                                    archiveFilter === tag ? `${TAGS[tag]?.color || "bg-muted text-muted-foreground"} ring-1 ring-accent/30` : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                  }`}>
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          )}
                          {(() => {
                            const { groups, ungrouped } = groupPinsByTag(filteredArchive);
                            return (
                              <>
                                {Object.entries(groups).map(([tagKey, groupPins]) => renderTagGroup(tagKey, groupPins, true))}
                                {ungrouped.length > 0 && (
                                  <div className="grid grid-cols-2 gap-2.5">
                                    {ungrouped.map((pin) => renderWidget(pin, true))}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* ============ CALENDAR TAB ============ */}
      {activeTab === "calendar" && (
        <div className={`mx-auto px-4 md:px-10 py-4 ${isMobile ? "" : "max-w-3xl"}`}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="calendar">
            <h1 className={`font-display italic text-foreground mb-4 mt-4 ${isMobile ? "text-3xl" : "text-4xl md:text-5xl"}`}>Let's Meet</h1>
            <div className="w-full h-px bg-border mb-6" />
            <p className="font-body text-base text-muted-foreground mb-6">Want to chat? Pick a time that works for you.</p>
            <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ minHeight: isMobile ? 500 : 600 }}>
              <iframe src="https://calendly.com/ccindyren" width="100%" height={isMobile ? "500" : "650"} frameBorder="0" className="w-full" title="Schedule a meeting" />
            </div>
          </motion.div>
        </div>
      )}

      {/* ============ MESSAGES TAB ============ */}
      {activeTab === "messages" && (
        <div className={`mx-auto px-4 md:px-10 py-4 ${isMobile ? "" : "max-w-3xl"}`}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="messages" className="flex flex-col" style={{ minHeight: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 140px)" }}>
            <div className="mb-4">
              <h1 className={`font-display italic text-foreground mt-4 ${isMobile ? "text-3xl" : "text-4xl md:text-5xl"}`}>Messages</h1>
              <p className="font-body text-sm text-muted-foreground mt-2">send me a message — feedback, ideas, or just say hi 💬</p>
            </div>

            <div className="flex-1 rounded-2xl border border-border bg-card/30 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 min-h-[250px] md:min-h-[300px]">
                <div className={`flex items-end gap-2 ${isMobile ? "max-w-[85%]" : "max-w-[75%]"}`}>
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-accent/30 shrink-0">
                    <img src={avatar} alt="Cindy" className="w-full h-full object-cover" />
                  </div>
                  <motion.div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2.5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <p className="font-body text-sm text-secondary-foreground">hey! thanks for stopping by 🤗 leave me a message — i'd love to hear your thoughts on the site, or anything really!</p>
                  </motion.div>
                </div>

                {chatMessages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }}
                    className={`flex items-end gap-2 ${msg.isOwner ? `${isMobile ? "max-w-[85%]" : "max-w-[75%]"}` : `${isMobile ? "max-w-[85%]" : "max-w-[75%]"} ml-auto flex-row-reverse`}`}>
                    {msg.isOwner ? (
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-accent/30 shrink-0">
                        <img src={avatar} alt="Cindy" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                        <span className="font-display text-[10px] text-accent">{msg.name[0].toUpperCase()}</span>
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-2.5 ${msg.isOwner ? "bg-secondary rounded-bl-md" : "bg-accent text-accent-foreground rounded-br-md"}`}>
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
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/30 px-4 py-2 bg-card/50 overflow-hidden">
                    <input type="text" value={chatName} onChange={(e) => setChatName(e.target.value)} placeholder="Your name (optional)"
                      className="w-full bg-transparent font-body text-xs text-foreground/70 outline-none placeholder:text-muted-foreground/40" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-t border-border/40 p-3 bg-card/50 flex items-center gap-2">
                <button onClick={() => setShowNameInput(!showNameInput)}
                  className={`p-2 rounded-full transition-colors ${showNameInput ? "bg-accent/15 text-accent" : "text-muted-foreground/40 hover:text-muted-foreground"}`} title="Set your name">
                  <span className="font-display text-xs">{chatName ? chatName[0].toUpperCase() : "?"}</span>
                </button>
                <div className="flex-1 flex items-center bg-background rounded-full border border-border/50 px-4 py-2">
                  <input ref={chatInputRef} type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="iMessage"
                    className="flex-1 bg-transparent font-body text-sm text-foreground outline-none placeholder:text-muted-foreground/30"
                    onKeyDown={(e) => { if (e.key === "Enter") sendChatMessage(); }} />
                </div>
                <motion.button onClick={sendChatMessage} disabled={!chatInput.trim()}
                  className="p-2 rounded-full bg-accent text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all" whileTap={{ scale: 0.9 }}>
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );

  return (
    <div className="relative min-h-screen bg-background">
      {/* Share toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-card border border-border shadow-lg font-body text-sm text-foreground"
          >
            <Check size={14} className="inline mr-1.5 text-accent" />
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded pin journal page */}
      <AnimatePresence>
        {expandedPinId && (() => {
          const pin = pins.find((p) => p.id === expandedPinId);
          if (!pin) return null;
          const primaryTag = pin.tags[0];
          const tagConfig = primaryTag ? TAGS[primaryTag] : null;
          const TagIcon = tagConfig?.icon;
          const hasChecklist = pin.checklist && pin.checklist.length > 0;
          const completedCount = pin.checklist?.filter((c) => c.checked).length || 0;
          const totalCount = pin.checklist?.length || 0;

          return (
            <motion.div
              key="expanded-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-0 z-10 bg-background/90 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-border/30"
              >
                <button onClick={() => setExpandedPinId(null)} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <ChevronDown size={18} /> Back
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => { archivePin(pin.id); setExpandedPinId(null); }} className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                    <Archive size={16} />
                  </button>
                  <button onClick={() => { deletePin(pin.id); setExpandedPinId(null); }} className="p-2 rounded-full text-muted-foreground hover:text-destructive transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="px-6 py-6 max-w-lg mx-auto"
              >
                {tagConfig && (
                  <div className="flex items-center gap-2 mb-4">
                    {TagIcon && <TagIcon size={16} className="text-accent" />}
                    <span className="font-body text-xs tracking-[0.2em] text-accent uppercase">{tagConfig.label}</span>
                  </div>
                )}

                <p className="font-body text-xs text-muted-foreground/40 mb-6">
                  {new Date(pin.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  {" · "}
                  {new Date(pin.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </p>

                {pin.type === "photo" ? (
                  <div>
                    <img src={pin.content} alt="" className="w-full rounded-2xl mb-6 shadow-sm" />
                    <input type="text" value={pin.caption || ""} onChange={(e) => updateCaption(pin.id, e.target.value)}
                      placeholder="Add a caption..." className="w-full bg-transparent font-display italic text-2xl text-foreground outline-none placeholder:text-muted-foreground/25" />
                  </div>
                ) : hasChecklist ? (
                  <div>
                    {pin.content.split("\n").filter((l) => !l.startsWith("☐ ") && !l.startsWith("☑ ") && l.trim()).map((line, i) => (
                      <h2 key={i} className="font-display italic text-3xl text-foreground mb-4 leading-snug">{line}</h2>
                    ))}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }}
                          animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                          transition={{ delay: 0.3, duration: 0.5 }} />
                      </div>
                      <span className="font-body text-sm text-muted-foreground">{completedCount}/{totalCount}</span>
                    </div>
                    <div className="space-y-4">
                      {pin.checklist!.map((ci, idx) => (
                        <motion.button key={idx} onClick={() => toggleCheckItem(pin.id, idx)}
                          className="flex items-center gap-4 w-full text-left"
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}>
                          {ci.checked ? (
                            <motion.div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center shrink-0" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                              <Check size={14} className="text-background" />
                            </motion.div>
                          ) : (
                            <div className="w-6 h-6 rounded-lg border-2 border-border shrink-0" />
                          )}
                          <span className={`font-body text-base leading-relaxed ${ci.checked ? "line-through text-muted-foreground/40" : "text-foreground"}`}>
                            {ci.text || "..."}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {(() => {
                      const lines = pin.content.split("\n");
                      const title = lines[0];
                      const body = lines.slice(1).join("\n").trim();
                      return (
                        <>
                          <h2 className="font-display italic text-3xl text-foreground mb-6 leading-snug">{title}</h2>
                          {body && <p className="font-body text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">{body}</p>}
                        </>
                      );
                    })()}
                  </div>
                )}

                {pin.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/30">
                    {pin.tags.map((tag) => {
                      const config = TAGS[tag];
                      const Icon = config?.icon;
                      return (
                        <span key={tag} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body ${config?.color || "bg-muted text-muted-foreground"}`}>
                          {Icon && <Icon size={12} />} {config?.label || tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Mobile sidebar overlay */}
      {isMobile && (
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] z-50 bg-card border-r border-border overflow-y-auto p-4"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display italic text-xl text-foreground/70">cindy's world</h2>
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
                    <X size={18} />
                  </button>
                </div>
                {renderSidebarContent()}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      <div className="relative z-10 h-screen">
        {isMobile ? (
          <div className="h-full overflow-hidden bg-background flex flex-col">
            {renderToolbar()}
            <div className="flex-1 overflow-y-auto pb-20">
              {renderTabContent()}
            </div>
            {/* Bottom tab bar */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/90 backdrop-blur-md border-t border-border px-6 py-2 flex items-center justify-around safe-area-bottom">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all ${
                    activeTab === tab.id ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-body text-[10px]">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {!collapsed && (
              <>
                <ResizablePanel defaultSize={28} minSize={20} maxSize={40}>
                  <div className="h-full border-r border-border bg-card/40 backdrop-blur-sm overflow-y-auto p-4">
                    <div className="mb-5">
                      <h2 className="font-display italic text-xl text-foreground/70">cindy's world</h2>
                    </div>
                    {renderSidebarContent()}
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}
            <ResizablePanel defaultSize={collapsed ? 100 : 72}>
              <div className="h-full overflow-hidden bg-background flex flex-col">
                {renderToolbar()}
                <div className="flex-1 overflow-y-auto">
                  {renderTabContent()}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default Home;
