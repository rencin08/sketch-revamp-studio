import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronLeft, Target, Check, Square, CheckSquare, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useJournalEntries } from "@/hooks/use-journal";
import { useAuth } from "@/hooks/use-auth";

const Projects = () => {
  const { pins, addPin } = useJournalEntries();
  const { user } = useAuth();
  const isOwner = !!user;
  const [expandedPinId, setExpandedPinId] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [writeContent, setWriteContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const projectPins = pins.filter(p => !p.archived && p.tags.includes("goals"));
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
    await addPin({ type: "note", content: writeContent.trim(), tags: ["goals"], archived: false, visibility: "private" });
    setWriteContent("");
    setIsWriting(false);
  };

  return (
    <div className="min-h-screen bg-background">
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
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-accent" />
                <span className="font-body text-xs tracking-[0.2em] text-accent uppercase">Goal</span>
              </div>
              <p className="font-body text-xs text-muted-foreground/40 mb-6">
                {new Date(expandedPin.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
              {(() => {
                const lines = expandedPin.content.split("\n");
                const hasChecklist = expandedPin.checklist && expandedPin.checklist.length > 0;
                return (
                  <>
                    <h2 className="font-display italic text-3xl text-foreground mb-6 leading-snug">{lines[0]}</h2>
                    {hasChecklist ? (
                      <div className="space-y-3">
                        {expandedPin.checklist!.map((ci, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {ci.checked ? <CheckSquare size={18} className="text-accent shrink-0" /> : <Square size={18} className="text-muted-foreground/40 shrink-0" />}
                            <span className={`font-body text-base ${ci.checked ? "line-through text-muted-foreground/40" : "text-foreground"}`}>{ci.text || "..."}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      lines.slice(1).join("\n").trim() && (
                        <p className="font-body text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">{lines.slice(1).join("\n").trim()}</p>
                      )
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-6 pt-8 pb-4">
        <Link to="/home" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ChevronLeft size={16} /> Back to home
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
              <Briefcase size={20} className="text-accent" />
            </div>
            <div>
              <h1 className="font-display italic text-3xl text-foreground">Projects</h1>
              <p className="font-body text-sm text-muted-foreground">What I'm building — goals, milestones, and progress.</p>
            </div>
          </div>
          {isOwner && !isWriting && (
            <motion.button onClick={() => setIsWriting(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background font-body text-xs font-medium hover:bg-foreground/90 transition-colors"
              whileTap={{ scale: 0.95 }}>
              <Plus size={14} /> Write
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isWriting && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="max-w-3xl mx-auto px-6 pb-6">
              <div className="rounded-2xl border-2 border-border bg-card p-5">
                <textarea ref={textareaRef} value={writeContent} onChange={(e) => setWriteContent(e.target.value)}
                  placeholder="Describe your project or goal..."
                  className="w-full bg-transparent font-body text-sm text-foreground resize-none outline-none placeholder:text-muted-foreground/40 min-h-[100px] leading-relaxed"
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

      <div className="max-w-3xl mx-auto px-6 pb-12">
        {projectPins.length === 0 ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Briefcase size={28} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-display italic text-muted-foreground text-lg">no projects yet</p>
            {isOwner && <button onClick={() => setIsWriting(true)} className="font-body text-sm text-accent hover:text-foreground transition-colors mt-2">add your first project →</button>}
          </motion.div>
        ) : (
          <div className="space-y-2">
            {projectPins.map(pin => {
              const hasChecklist = pin.checklist && pin.checklist.length > 0;
              const completed = pin.checklist?.filter(c => c.checked).length || 0;
              const total = pin.checklist?.length || 0;
              return (
                <motion.div key={pin.id} onClick={() => setExpandedPinId(pin.id)}
                  className="rounded-2xl border border-border bg-card p-4 cursor-pointer hover:bg-accent/5 hover:border-accent/30 transition-colors group"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-foreground truncate">{pin.content.split("\n")[0]}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="font-body text-xs text-muted-foreground/50">
                          {new Date(pin.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                        {hasChecklist && <span className="font-body text-xs text-muted-foreground">{completed}/{total} done</span>}
                      </div>
                    </div>
                    <ChevronLeft size={14} className="text-muted-foreground/30 rotate-180 group-hover:text-muted-foreground transition-colors shrink-0 ml-2" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
