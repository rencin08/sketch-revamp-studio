import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

const TypingText = ({ text, className, speed = 80, delay = 800 }: TypingTextProps) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayed, started, text, speed]);

  return (
    <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[2px] h-[0.8em] bg-foreground ml-1 align-baseline"
      />
    </motion.h1>
  );
};

export default TypingText;
