import avatar from "@/assets/avatar.png";
import cityscape from "@/assets/cityscape-sketch.png";
import { motion } from "framer-motion";
import { Mail, Linkedin, Instagram, ArrowRight, Sparkles, BookOpen, Briefcase, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const socialLinks = [
  { icon: Mail, href: "mailto:zixinrena@gmail.com", label: "Email" },
  { icon: Linkedin, href: "https://linkedin.com/in/cindy-ren-707926147", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/dearccindy", label: "Instagram" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Subtle background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${cityscape})` }}
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:py-16">
        {/* Header area */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-center justify-between"
        >
          <h2 className="font-display italic text-2xl text-foreground/70">cindy's world</h2>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-full border border-border text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(140px,auto)]"
        >
          {/* Hero Card — spans 2 cols, 2 rows */}
          <motion.div
            variants={item}
            className="col-span-2 row-span-2 group relative overflow-hidden rounded-3xl bg-card/80 backdrop-blur-md border border-border p-8 flex flex-col justify-end cursor-pointer hover:border-foreground/20 transition-colors"
          >
            <div className="absolute top-6 right-6 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-border">
              <img src={avatar} alt="Cindy" className="w-full h-full object-cover" />
            </div>
            <div className="mt-auto">
              <p className="font-body text-sm tracking-widest text-muted-foreground uppercase mb-2">The Story So Far</p>
              <h1 className="font-display italic text-3xl md:text-5xl text-foreground leading-tight mb-3">
                hi, i'm cindy
              </h1>
              <p className="font-body text-base md:text-lg text-foreground/80 leading-relaxed max-w-md">
                23-year-old startup founder in NYC. Harvard grad who left finance to build things that matter.
              </p>
            </div>
          </motion.div>

          {/* About Widget */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="col-span-1 row-span-1 rounded-3xl bg-card/80 backdrop-blur-md border border-border p-6 flex flex-col justify-between cursor-pointer hover:border-foreground/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center mb-3">
              <Heart size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground mb-1">About Me</h3>
              <p className="font-body text-sm text-muted-foreground">My journey, values & the why behind it all</p>
            </div>
            <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all mt-2" />
          </motion.div>

          {/* AI Learning Hub Widget */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="col-span-1 row-span-1 rounded-3xl bg-card/80 backdrop-blur-md border border-border p-6 flex flex-col justify-between cursor-pointer hover:border-foreground/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center mb-3">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground mb-1">AI Hub</h3>
              <p className="font-body text-sm text-muted-foreground">My learning notes on all things artificial intelligence</p>
            </div>
            <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all mt-2" />
          </motion.div>

          {/* Thoughts / Blog Widget — spans 2 cols */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.01 }}
            className="col-span-2 row-span-1 rounded-3xl bg-card/80 backdrop-blur-md border border-border p-6 flex items-center gap-6 cursor-pointer hover:border-foreground/20 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
              <BookOpen size={22} className="text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg text-foreground mb-1">Thoughts & Reflections</h3>
              <p className="font-body text-sm text-muted-foreground">
                Essays on growing up, leaving finance, building startups, and figuring out life in your 20s.
              </p>
            </div>
            <ArrowRight size={18} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
          </motion.div>

          {/* Projects Widget */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="col-span-1 row-span-1 rounded-3xl bg-card/80 backdrop-blur-md border border-border p-6 flex flex-col justify-between cursor-pointer hover:border-foreground/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center mb-3">
              <Briefcase size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground mb-1">Projects</h3>
              <p className="font-body text-sm text-muted-foreground">What I'm building & shipping right now</p>
            </div>
            <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all mt-2" />
          </motion.div>

          {/* Quote / Mantra Widget */}
          <motion.div
            variants={item}
            className="col-span-1 row-span-1 rounded-3xl bg-foreground/5 backdrop-blur-md border border-border p-6 flex flex-col justify-center items-center text-center"
          >
            <p className="font-display italic text-xl md:text-2xl text-foreground/90 leading-snug">
              "Build the life you want to live."
            </p>
            <span className="font-body text-xs tracking-widest text-muted-foreground mt-3 uppercase">daily mantra</span>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Home;
