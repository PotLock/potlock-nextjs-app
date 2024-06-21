"use client";

import { forwardRef } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, X } from "lucide-react";

import { Button } from "./button";
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
  onBackClick?: VoidFunction;
  onCloseClick: VoidFunction;
};

const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, onBackClick, onCloseClick, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "sm:min-w-auto fixed left-[50%] top-[50%] z-50 flex h-full w-full min-w-full flex-col",
        "items-stretch sm:h-auto sm:max-w-xl sm:rounded-lg",
        "translate-x-[-50%] translate-y-[-50%] bg-background shadow-lg",
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

      <div
        un-w="full"
        un-flex="~"
        un-justify="end"
        un-position="absolute top-4"
        un-px="4"
      >
        {typeof onBackClick === "function" && (
          <Button
            variant="standard-plain"
            size="icon"
            onClick={onBackClick}
            className={cn(
              "mr-auto h-auto w-auto rounded-sm opacity-70 ring-offset-background transition-opacity",
              "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
              "focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent",
              "data-[state=open]:text-muted-foreground",
            )}
          >
            <ArrowLeft className="color-white" width="24" height="24" />
            <span className="sr-only">Previous step</span>
          </Button>
        )}

        <DialogPrimitive.Close
          onClick={onCloseClick}
          className={cn(
            "rounded-sm opacity-70 ring-offset-background transition-opacity",
            "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
            "focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent",
            "data-[state=open]:text-muted-foreground",
          )}
        >
          <X className="color-white" width="24" height="24" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
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
      fillOpacity="0.12"
    />

    <rect
      width="20"
      height="245.972"
      rx="10"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 -71.752 -37)"
      fill="white"
      fillOpacity="0.12"
    />

    <rect
      width="20"
      height="164.654"
      rx="10"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 -103.752 -37)"
      fill="white"
      fillOpacity="0.12"
    />

    <rect
      width="20"
      height="177.702"
      rx="10"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 -7.75195 -37)"
      fill="white"
      fillOpacity="0.12"
    />

    <rect
      width="20"
      height="78.4889"
      rx="10"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 24.248 -37)"
      fill="white"
      fillOpacity="0.12"
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
      "pt-13 flex h-[max-content] w-full flex-col gap-2 bg-[var(--primary-600)] px-4 pb-5 sm:rounded-t-lg sm:px-5",
      "text-left text-white",
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
      <DialogHeaderPattern className="-scale-x-100 transform" />
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
    className={cn("mt-auto flex justify-between gap-4 p-5", className)}
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
      "prose font-600 py-1 text-xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "flex flex-col gap-6 p-5 text-sm text-neutral-950",
      className,
    )}
    {...props}
    asChild
  >
    <div>{children}</div>
  </DialogPrimitive.Description>
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
