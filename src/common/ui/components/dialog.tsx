"use client";

import { forwardRef } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "../utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-white/30 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      " data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  onCloseClick: () => void;
};

const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, onCloseClick, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg sm:rounded-lg",
        "translate-x-[-50%] translate-y-[-50%] gap-4 bg-background shadow-lg",
        "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className,
      )}
      {...props}
    >
      {children}

      <DialogPrimitive.Close
        onClick={onCloseClick}
        className={cn(
          "absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity",
          "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
          "focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent",
          "data-[state=open]:text-muted-foreground",
        )}
      >
        <X className="color-white h-7 w-7" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeaderPattern: React.FC<{ className?: string }> = (props) => (
  <svg
    width="118"
    height="152"
    viewBox="0 0 118 152"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      width="20"
      height="161.118"
      rx="10"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 -39.752 -37)"
      fill="white"
      fill-opacity="0.08"
    />

    <rect
      width="20"
      height="245.972"
      rx="10"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 -71.752 -37)"
      fill="white"
      fill-opacity="0.08"
    />

    <rect
      width="20"
      height="164.654"
      rx="10"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 -103.752 -37)"
      fill="white"
      fill-opacity="0.08"
    />

    <rect
      width="20"
      height="177.702"
      rx="10"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 -7.75195 -37)"
      fill="white"
      fill-opacity="0.08"
    />

    <rect
      width="20"
      height="78.4889"
      rx="10"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 24.248 -37)"
      fill="white"
      fill-opacity="0.08"
    />
  </svg>
);

const DialogHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-4 pt-8 text-center sm:text-left",
      className,
    )}
    {...props}
  >
    <div
      un-position="absolute left-0 top-0"
      un-w="full"
      un-flex="~"
      un-justify="between"
      un-gap="4"
    >
      <DialogHeaderPattern />
      <DialogHeaderPattern className="rotate-180" />
    </div>

    {children}
  </div>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "prose text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
