import avatar from "@/assets/avatar.png";
import cityscape from "@/assets/cityscape-sketch.png";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, Instagram, ArrowRight, Sparkles, BookOpen, Briefcase, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
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

const writingPrompts = [
  "What's on my mind today...",
  "A lesson I learned this week",
  "Something I'm grateful for",
  "A goal I'm working toward",
  "An idea I can't stop thinking about",
  "A conversation that stuck with me",
];

const MacDots = () => (
  <div className="flex gap-1.5 absolute top-4 right-4">
    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
  </div>
);

const Home = () => {
  const [noteContent, setNoteContent] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [noteContent]);

  const handlePromptClick = (prompt: string) => {
    setNoteContent((prev) => (prev ? prev + "\n\n" + prompt : prompt));
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* NYC cityscape background on right side */}
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
            {/* Header */}
            <div className="mb-5">
              <h2 className="font-display italic text-xl text-foreground/70">cindy's world</h2>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-3"
            >
              {/* Hero Card */}
              <motion.div
                variants={item}
                className="relative rounded-2xl bg-card border border-border p-5 overflow-hidden"
              >
                <MacDots />
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent/40 shrink-0">
                    <img src={avatar} alt="Cindy" className="w-full h-full object-cover" />
                  </div>
                  <div className="pt-1">
                    <h1 className="font-display italic text-2xl text-foreground leading-tight">
                      hi, i'm cindy.
                    </h1>
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  23-year-old startup founder in NYC. Harvard grad who left finance to build things that matter.
                </p>
                <div className="flex gap-2">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background/50 text-xs font-body text-foreground/70 hover:text-foreground hover:border-accent/40 transition-colors"
                    >
                      <Icon size={13} />
                      {label}
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Thoughts Card */}
              <motion.div
                variants={item}
                className="relative rounded-2xl bg-card border border-border p-5 cursor-pointer hover:border-accent/30 transition-colors group"
              >
                <MacDots />
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  <BookOpen size={18} className="text-secondary-foreground" />
                </div>
                <p className="font-body text-xs tracking-widest text-accent uppercase mb-1">Thoughts & Reflections</p>
                <h3 className="font-display text-lg text-foreground mb-1">Essays on growing up</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Leaving finance, building startups, and figuring out life in your 20s.
                </p>
                <ArrowRight size={14} className="text-accent mt-3 group-hover:translate-x-1 transition-transform" />
              </motion.div>

              {/* Quote Card */}
              <motion.div
                variants={item}
                className="relative rounded-2xl bg-card border border-border p-5 text-center"
              >
                <MacDots />
                <p className="font-display italic text-lg text-accent leading-snug mt-2">
                  "Build the life you want to live."
                </p>
                <span className="font-body text-xs tracking-widest text-muted-foreground mt-2 uppercase block">daily mantra</span>
              </motion.div>

              {/* Small widget row */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  variants={item}
                  className="relative rounded-2xl bg-card border border-border p-4 cursor-pointer hover:border-accent/30 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center mb-2">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                  <h3 className="font-display text-sm text-foreground">AI Hub</h3>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">Learning notes</p>
                </motion.div>

                <motion.div
                  variants={item}
                  className="relative rounded-2xl bg-card border border-border p-4 cursor-pointer hover:border-accent/30 transition-colors group"
                >
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

        {/* RIGHT PANEL — Today (Apple Notes style) */}
        <div className="flex-1 overflow-y-auto bg-background">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto px-8 py-10"
          >
            {/* Notes toolbar */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
              >
                {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </button>
              <p className="font-body text-xs tracking-widest text-muted-foreground uppercase">{formattedDate}</p>
            </div>

            {/* Title */}
            <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-8">
              Today
            </h1>

            {/* Divider line like Apple Notes */}
            <div className="w-full h-px bg-border mb-6" />

            {/* Writing area */}
            <textarea
              ref={textareaRef}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full bg-transparent font-body text-base md:text-lg text-foreground/90 leading-relaxed resize-none outline-none placeholder:text-muted-foreground/50 min-h-[200px]"
            />

            {/* Suggestion chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 pt-6 border-t border-border/50"
            >
              <p className="font-body text-xs tracking-widest text-muted-foreground uppercase mb-4">What to write about</p>
              <div className="flex flex-wrap gap-2">
                {writingPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent/10 hover:border-accent/30 font-body text-sm text-foreground/70 hover:text-foreground transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
