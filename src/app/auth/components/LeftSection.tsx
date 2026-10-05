"use client";

import { IconBrandSupabase, IconLock, IconMessageCircle, IconSparkles } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function LeftSection() {
  const features = [
    {
      icon: IconMessageCircle,
      title: "Real-time Messaging",
      desc: "Chat instantly with friends and family in real-time",
    },
    {
      icon: IconLock,
      title: "Secure Authentication",
      desc: "Powered by Supabase for enterprise-grade security",
    },
    {
      icon: IconSparkles,
      title: "Modern Experience",
      desc: "Clean, fast, and beautiful user interface",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 lg:p-10 flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <motion.div
        className="relative z-10 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconBrandSupabase className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Milaap</h2>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Connect with people{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              instantly
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            A modern messaging platform built for seamless real-time
            communication.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4 group">
              <div className="p-2 bg-background/80 backdrop-blur-sm rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-sm text-muted-foreground"
      >
        Built with Next.js, Supabase, and Tailwind CSS
      </motion.div>
    </div>
  );
}
