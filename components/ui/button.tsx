import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fe-gold-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-fe-gold-500 text-fe-blue-900 hover:bg-fe-gold-600 hover:shadow-lg hover:shadow-fe-gold-500/25",
        destructive: "bg-fe-red-500 text-white hover:bg-fe-red-600 hover:shadow-lg hover:shadow-fe-red-500/25",
        outline: "border-2 border-fe-gold-500 text-fe-gold-600 bg-transparent hover:bg-fe-gold-50 hover:text-fe-gold-700 hover:border-fe-gold-600 hover:shadow-md",
        secondary: "bg-fe-blue-100 text-fe-blue-900 hover:bg-fe-blue-200 hover:text-fe-blue-950",
        ghost: "hover:bg-fe-gold-100 hover:text-fe-gold-700 text-fe-blue-900",
        link: "text-fe-gold-600 underline-offset-4 hover:text-fe-gold-700 hover:underline hover:decoration-fe-gold-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md text-xs",
        lg: "h-11 px-8 rounded-md text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };