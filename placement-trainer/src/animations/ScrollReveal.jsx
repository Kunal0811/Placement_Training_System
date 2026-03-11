import { motion } from "framer-motion";

export default function ScrollReveal({ children, delay = 0, direction = "up" }) {
  const yOffset = direction === "up" ? 50 : direction === "down" ? -50 : 0;
  const xOffset = direction === "left" ? 50 : direction === "right" ? -50 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}