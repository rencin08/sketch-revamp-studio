import avatar from "@/assets/avatar.png";
import cityscape from "@/assets/cityscape-sketch.png";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, Instagram, ArrowRight, Sparkles, BookOpen, Briefcase, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

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

const MacDots = () => (
  <div className="flex gap-1.5 absolute top-4 right-4">
    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
  </div>
);

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Subtle background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${cityscape})` }}
      />

      <div className="relative z-10 flex min-h-screen">
        {/* LEFT PANEL — Summary Dashboard */}
        <motion.div
          animate={{ width: collapsed ? 60 : "33.333%" }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="relative shrink-0 border-r border-border overflow-hidden"
        >
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-4 right-0 translate-x-1/2 z-30 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 h-full overflow-y-auto"
              >
                {/* Header */}
                <div className="mb-4">
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
                    className="relative rounded-2xl bg-card/80 backdrop-blur-md border border-border p-5 overflow-hidden"
                  >
                    <MacDots />
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-border shrink-0">
                        <img src={avatar} alt="Cindy" className="w-full h-full object-cover" />
                      </div>
                      <div className="pt-1">
                        <h1 className="font-display italic text-2xl text-foreground leading-tight">
                          hi, i'm cindy.
                        </h1>
                      </div>
                    </div>
                    <p className="font-body text-sm text-foreground/80 leading-relaxed mb-4">
                      23-year-old startup founder in NYC. Harvard grad who left finance to build things that matter.
                    </p>
                    <div className="flex gap-2">
                      {socialLinks.map(({ icon: Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-body text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
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
                    className="relative rounded-2xl bg-card/80 backdrop-blur-md border border-border p-5 cursor-pointer hover:border-foreground/20 transition-colors group"
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
                    className="relative rounded-2xl bg-card/80 backdrop-blur-md border border-border p-5 text-center"
                  >
                    <MacDots />
                    <p className="font-display italic text-lg text-foreground/90 leading-snug mt-2">
                      "Build the life you want to live."
                    </p>
                    <span className="font-body text-xs tracking-widest text-muted-foreground mt-2 uppercase block">daily mantra</span>
                  </motion.div>

                  {/* Small widget row */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      variants={item}
                      className="relative rounded-2xl bg-card/80 backdrop-blur-md border border-border p-4 cursor-pointer hover:border-foreground/20 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center mb-2">
                        <Sparkles size={16} className="text-primary" />
                      </div>
                      <h3 className="font-display text-sm text-foreground">AI Hub</h3>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">Learning notes</p>
                    </motion.div>

                    <motion.div
                      variants={item}
                      className="relative rounded-2xl bg-card/80 backdrop-blur-md border border-border p-4 cursor-pointer hover:border-foreground/20 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center mb-2">
                        <Briefcase size={16} className="text-accent" />
                      </div>
                      <h3 className="font-display text-sm text-foreground">Projects</h3>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">What I'm building</p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT PANEL — Today's View / Notepad */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 md:p-10 max-w-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display italic text-2xl text-foreground">Cindy Ren</h2>
            </div>

            {/* Origin Story */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-border p-6 mb-4"
            >
              <p className="font-body text-xs tracking-widest text-accent uppercase mb-3">Origin Story</p>
              <p className="font-body text-base text-foreground/90 leading-relaxed">
                Grew up between cultures — Shanghai-born, American-raised. Harvard '24. Studied economics, spent junior year recruiting for finance like everyone else.
              </p>
            </motion.div>

            {/* The Turn */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-border p-6 mb-4"
            >
              <p className="font-body text-xs tracking-widest text-accent uppercase mb-3">The Turn</p>
              <p className="font-body text-base text-foreground/90 leading-relaxed">
                Sat in a training room in summer 2023 and thought: <em className="font-display italic">this is not my life.</em> Quit before the analyst year started. Moved to NYC anyway.
              </p>
            </motion.div>

            {/* Now */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl border border-border p-6 mb-6"
            >
              <p className="font-body text-xs tracking-widest text-accent uppercase mb-3">Now</p>
              <p className="font-body text-base text-foreground/90 leading-relaxed">
                Building Ernest — a personal OS for Gen Z girls. Learning in public. Figuring out who I'm becoming, one day at a time.
              </p>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-2"
            >
              {["Founder", "NYC", "Harvard '24", "Ex-finance", "Builder"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-border font-body text-sm text-foreground/80 hover:bg-card/50 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
