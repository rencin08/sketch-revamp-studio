import avatar from "@/assets/avatar.png";
import cityscape from "@/assets/cityscape-sketch.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Linkedin, Instagram, ArrowRight, Sparkles, BookOpen,
  Briefcase, PanelLeftClose, PanelLeftOpen, Plus, Image, StickyNote,
  Archive, X, ChevronDown, ChevronUp, Camera
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

// --- Left panel constants (unchanged) ---

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
  content: string; // text for notes, dataURL for photos
  caption?: string;
  createdAt: number;
  archived: boolean;
}

const STORAGE_KEY = "cindy-today-pins";

const loadPins = (): PinItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const savePins = (pins: PinItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
};

// --- Component ---

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [pins, setPins] = useState<PinItem[]>(loadPins);
  const [showArchive, setShowArchive] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  useEffect(() => { savePins(pins); }, [pins]);
  useEffect(() => {
    if (addingNote) setTimeout(() => noteInputRef.current?.focus(), 50);
  }, [addingNote]);

  const activePins = pins.filter((p) => !p.archived);
  const archivedPins = pins.filter((p) => p.archived);

  const addPhoto = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPins((prev) => [
          {
            id: crypto.randomUUID(),
            type: "photo",
            content: reader.result as string,
            caption: "",
            createdAt: Date.now(),
            archived: false,
          },
          ...prev,
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, []);

  const addNote = () => {
    if (!noteText.trim()) return;
    setPins((prev) => [
      {
        id: crypto.randomUUID(),
        type: "note",
        content: noteText.trim(),
        createdAt: Date.now(),
        archived: false,
      },
      ...prev,
    ]);
    setNoteText("");
    setAddingNote(false);
  };

  const archivePin = (id: string) => {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, archived: true } : p)));
  };

  const unarchivePin = (id: string) => {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, archived: false } : p)));
  };

  const deletePin = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* NYC cityscape background */}
      <div
        className="fixed right-0 bottom-0 w-2/3 h-full bg-contain bg-right-bottom bg-no-repeat opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: `url(${cityscape})` }}
      />

      <div className="relative z-10 flex min-h-screen">
        {/* LEFT PANEL — Summary Dashboard */}
        <motion.div
          animate={{ width: collapsed ? 0 : 340 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0 border-r border-border bg-card/40 backdrop-blur-sm overflow-hidden"
        >
          <div className="w-[340px] p-4 h-full overflow-y-auto">
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

              {/* Small widget row */}
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
        </motion.div>

        {/* RIGHT PANEL — Today (Pinterest + Notes) */}
        <div className="flex-1 overflow-y-auto bg-background">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto px-6 md:px-10 py-8"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
              >
                {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </button>
              <p className="font-body text-xs tracking-widest text-muted-foreground uppercase">{formattedDate}</p>
            </div>

            {/* Title */}
            <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-4">Today</h1>
            <div className="w-full h-px bg-border mb-6" />

            {/* Action bar */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent/10 hover:border-accent/30 font-body text-sm text-foreground/70 hover:text-foreground transition-all"
              >
                <Camera size={15} /> Add Photo
              </button>
              <button
                onClick={() => setAddingNote(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent/10 hover:border-accent/30 font-body text-sm text-foreground/70 hover:text-foreground transition-all"
              >
                <StickyNote size={15} /> Add Note
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                className="hidden"
                onChange={addPhoto}
              />
            </div>

            {/* New note input */}
            <AnimatePresence>
              {addingNote && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="rounded-2xl border border-accent/30 bg-card p-4">
                    <textarea
                      ref={noteInputRef}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Write something..."
                      className="w-full bg-transparent font-body text-base text-foreground/90 leading-relaxed resize-none outline-none placeholder:text-muted-foreground/50 min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.metaKey) addNote();
                      }}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => { setAddingNote(false); setNoteText(""); }}
                        className="px-3 py-1.5 rounded-lg font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addNote}
                        className="px-4 py-1.5 rounded-lg bg-accent text-accent-foreground font-body text-sm hover:bg-accent/90 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pinterest-style masonry grid */}
            {activePins.length === 0 && !addingNote ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
                  <Plus size={24} className="text-muted-foreground" />
                </div>
                <p className="font-body text-muted-foreground">Your board is empty</p>
                <p className="font-body text-sm text-muted-foreground/60 mt-1">Add photos or notes to start pinning</p>
              </div>
            ) : (
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                <AnimatePresence>
                  {activePins.map((pin) => (
                    <motion.div
                      key={pin.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="break-inside-avoid rounded-2xl border border-border bg-card overflow-hidden group relative"
                    >
                      {/* Hover actions */}
                      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => archivePin(pin.id)}
                          className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors"
                          title="Archive"
                        >
                          <Archive size={13} />
                        </button>
                        <button
                          onClick={() => deletePin(pin.id)}
                          className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <X size={13} />
                        </button>
                      </div>

                      {pin.type === "photo" ? (
                        <>
                          <img src={pin.content} alt="" className="w-full object-cover" />
                          <div className="p-3">
                            <input
                              type="text"
                              value={pin.caption || ""}
                              onChange={(e) => updateCaption(pin.id, e.target.value)}
                              placeholder="Add a caption..."
                              className="w-full bg-transparent font-body text-xs text-foreground/70 outline-none placeholder:text-muted-foreground/40"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="p-4">
                          <p className="font-body text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
                            {pin.content}
                          </p>
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

            {/* Archive section */}
            <div className="mt-12 pt-6 border-t border-border/50">
              <button
                onClick={() => setShowArchive(!showArchive)}
                className="flex items-center gap-2 font-body text-xs tracking-widest text-muted-foreground uppercase hover:text-foreground transition-colors w-full"
              >
                <Archive size={14} />
                Archive ({archivedPins.length})
                {showArchive ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
              </button>

              <AnimatePresence>
                {showArchive && archivedPins.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 columns-2 md:columns-3 gap-3 space-y-3 overflow-hidden"
                  >
                    {archivedPins.map((pin) => (
                      <div
                        key={pin.id}
                        className="break-inside-avoid rounded-2xl border border-border/50 bg-card/50 overflow-hidden group relative opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => unarchivePin(pin.id)}
                            className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors text-xs font-body"
                            title="Restore"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => deletePin(pin.id)}
                            className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete"
                          >
                            <X size={13} />
                          </button>
                        </div>

                        {pin.type === "photo" ? (
                          <>
                            <img src={pin.content} alt="" className="w-full object-cover" />
                            {pin.caption && (
                              <div className="p-3">
                                <p className="font-body text-xs text-foreground/50">{pin.caption}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="p-4">
                            <p className="font-body text-sm text-foreground/60 leading-relaxed whitespace-pre-wrap">{pin.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
