import { cva } from "class-variance-authority";

export const cardVariants = cva("relative overflow-hidden transition-all duration-200 hover:shadow-md", {
  variants: {
    variant: {
      default: "bg-card text-card-foreground border",
      gradient: "bg-gradient-to-br from-primary/10 via-background to-secondary/10 border",
      glass: "bg-background/80 backdrop-blur-sm border border-border/50",
      solid: "bg-primary text-primary-foreground border-primary",
      outline: "border-2 border-dashed border-muted-foreground/25 bg-transparent",
      ghost: "border-0 shadow-none bg-transparent",
      destructive: "bg-destructive !text-white border-destructive hover:bg-destructive/90",
    },
    size: {
      sm: "p-3",
      default: "p-4",
      lg: "p-6",
      xl: "p-8",
    },
    animation: {
      none: "",
      pulse: "animate-pulse",
      bounce: "animate-bounce",
      fade: "animate-in fade-in duration-500",
      slide: "animate-in slide-in-from-bottom-4 duration-500",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    animation: "none",
  },
})