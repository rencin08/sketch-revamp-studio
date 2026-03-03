import avatar from "@/assets/avatar.png";
import cityscape from "@/assets/cityscape-sketch.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TypingText from "@/components/TypingText";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background cityscape */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${cityscape})` }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-44 h-44 md:w-56 md:h-56 rounded-full border-2 border-border overflow-hidden bg-background/60 backdrop-blur-sm"
        >
          <img
            src={avatar}
            alt="Cindy's avatar"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <TypingText
          text="welcome to cindy's home"
          className="font-display italic text-4xl md:text-6xl tracking-wide text-foreground"
          speed={90}
          delay={600}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="font-body text-lg md:text-xl tracking-widest text-muted-foreground"
        >
          harvard grad · building startups · matcha lover · nyc
        </motion.p>

        <motion.button
          onClick={() => navigate("/home")}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 px-8 py-3 rounded-full border-2 border-foreground bg-foreground/10 font-body text-lg tracking-widest text-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
        >
          enter world
        </motion.button>
      </div>
    </div>
  );
};

export default Index;
