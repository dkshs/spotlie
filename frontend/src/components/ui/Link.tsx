import { type AnchorHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const linkVariants = cva(
  "inline-flex items-center justify-center font-medium underline-offset-4 ring-offset-background duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:opacity-70",
  {
    variants: {
      variant: {
        default: "text-primary",
        destructive:
          "text-destructive hover:text-destructive/90 focus-visible:ring-destructive",
        ghost:
          "text-primary-foreground underline hover:text-primary-foreground/60 focus-visible:ring-primary-foreground",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
      },
      radius: {
        sm: "rounded-sm",
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  },
);

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  readonly asChild?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, radius, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        className={cn(linkVariants({ variant, size, radius, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Link.displayName = "Link";

export { Link, linkVariants };
