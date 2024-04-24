import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

import { type VariantProps, cva } from "class-variance-authority";
import { Button } from "./Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import { cn } from "@/lib/utils";

const inputFileVariants = cva(
  "inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground focus-within:ring-ring hover:bg-primary/90 dark:hover:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground focus-within:ring-destructive hover:bg-destructive/80",
        outline:
          "border border-input bg-background focus-within:ring-ring hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground focus-within:ring-ring hover:bg-secondary/60 dark:hover:bg-secondary/80",
        ghost:
          "focus-within:ring-ring hover:bg-accent hover:text-accent-foreground",
        none: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface InputFileProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly variant?: VariantProps<typeof inputFileVariants>["variant"];
  readonly btnSize?: VariantProps<typeof inputFileVariants>["size"];
  readonly labelText?: string | ReactNode;
  readonly tooltipContent?: ReactNode;
}

export const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  (
    {
      className,
      variant,
      btnSize,
      labelText = "Choose photo",
      id,
      tooltipContent,
      ...props
    },
    ref,
  ) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={btnSize}
              className={cn(inputFileVariants({ variant, className }))}
              asChild
            >
              <label htmlFor={id}>
                <input
                  type="file"
                  className="sr-only w-[0px]"
                  id={id}
                  ref={ref}
                  {...props}
                />
                {labelText}
              </label>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);
InputFile.displayName = "InputFile";
