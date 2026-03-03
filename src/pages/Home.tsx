import cityscape from "@/assets/cityscape-sketch.png";
import { motion } from "framer-motion";
import { Mail, Linkedin, Instagram } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const socialLinks = [
  { icon: Mail, href: "mailto:zixinrena@gmail.com", label: "Email" },
  { icon: Linkedin, href: "https://linkedin.com/in/cindy-ren-707926147", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/dearccindy", label: "Instagram" },
];

const navItems = [
  { label: "about", to: "/about" },
  { label: "projects", to: "/projects" },
  { label: "thoughts", to: "/thoughts" },
];

const Home = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{ backgroundImage: `url(${cityscape})` }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-2xl">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="font-display italic text-5xl md:text-7xl tracking-wide text-foreground"
        >
          hi, i'm cindy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-lg md:text-xl leading-relaxed text-foreground/80"
        >
          23-year-old startup founder based in NYC. Harvard grad who left finance to build things. 
          This is my story of who I'm growing into — and my learning hub on everything AI.
        </motion.p>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-5"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-full border border-border text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
            >
              <Icon size={20} />
            </a>
          ))}
        </motion.div>

        {/* Navigation */}
        <motion.nav
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center gap-10 mt-6"
        >
          {navItems.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              className="font-body text-xl tracking-widest text-foreground/70 hover:text-foreground transition-colors"
              activeClassName="text-foreground underline underline-offset-8"
            >
              {label}
            </NavLink>
          ))}
        </motion.nav>
      </div>
    </div>
  );
};

export default Home;
