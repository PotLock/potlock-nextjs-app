import { useCallback, useEffect, useMemo, useRef } from "react";

import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading1, Italic, Link as LinkIcon, Type } from "lucide-react";

import { cn } from "@/common/ui/layout/utils";

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  showCharacterCount?: boolean;
  showToolbar?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  maxLength = 500,
  label,
  required = false,
  disabled = false,
  error,
  className,
  showCharacterCount = true,
  showToolbar = true,
}) => {
  const onChangeRef = useRef(onChange);
  const lastValueRef = useRef(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Update ref when onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Debounced onChange handler
  const debouncedOnChange = useCallback((newValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (onChangeRef.current && newValue !== lastValueRef.current) {
        lastValueRef.current = newValue;
        onChangeRef.current(newValue);
      }
    }, 100);
  }, []);

  // Check if the current content would exceed the limit
  const wouldExceedLimit = useCallback(
    (newContent: string) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = newContent;
      const textLength = tempDiv.textContent?.length || 0;
      return textLength > maxLength;
    },
    [maxLength],
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline",
        },
      }),
    ],
    content: value || `<p>${placeholder ?? ""}</p>`,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const cleanHtml = html === `<p>${placeholder ?? ""}</p>` ? "" : html;
      debouncedOnChange(cleanHtml);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // Get current text content length
        const currentText = view.state.doc.textContent;
        const currentLength = currentText.length;

        // Allow deletion and navigation keys
        if (
          event.key === "Backspace" ||
          event.key === "Delete" ||
          event.key === "ArrowLeft" ||
          event.key === "ArrowRight" ||
          event.key === "ArrowUp" ||
          event.key === "ArrowDown" ||
          event.key === "Home" ||
          event.key === "End" ||
          event.key === "Tab" ||
          event.metaKey ||
          event.ctrlKey
        ) {
          return false; // Let TipTap handle these
        }

        // If we're at the limit, prevent typing
        if (currentLength >= maxLength) {
          event.preventDefault();
          return true; // Prevent the input
        }

        return false; // Allow normal input
      },
    },
  });

  // Update editor content when value prop changes (but not from internal updates)
  useEffect(() => {
    if (editor && value !== lastValueRef.current) {
      lastValueRef.current = value;
      editor.commands.setContent(value || `<p>${placeholder}</p>`);
    }
  }, [editor, value, placeholder]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Character count calculation (excluding HTML tags)
  const characterCount = useMemo(() => {
    if (!value) return 0;
    // Create a temporary div to properly parse HTML and get text content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = value;
    return tempDiv.textContent?.length || 0;
  }, [value]);

  const isOverLimit = characterCount > maxLength;
  const isAtLimit = characterCount >= maxLength;

  const addLink = useCallback(() => {
    // Don't allow adding links if we're at the limit
    if (isAtLimit) {
      return;
    }

    const url = window.prompt("Enter URL:");

    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor, isAtLimit]);

  const removeLink = useCallback(() => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  }, [editor]);

  if (!editor) {
    return <div className="h-32 animate-pulse rounded-lg bg-gray-200" />;
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div
        className={cn(
          "rounded-lg border bg-white transition-colors",
          error ? "border-red-300" : "border-gray-300",
          disabled && "cursor-not-allowed bg-gray-50",
          isAtLimit && "border-orange-300 bg-orange-50",
        )}
      >
        {showToolbar && (
          <div className="flex items-center gap-1 rounded-t-lg border-b border-gray-200 bg-gray-50 px-3 py-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={disabled || isAtLimit}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors",
                "hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50",
                editor.isActive("bold")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900",
              )}
              title="Bold"
            >
              <Bold size={14} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={disabled || isAtLimit}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors",
                "hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50",
                editor.isActive("italic")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900",
              )}
              title="Italic"
            >
              <Italic size={14} />
            </button>

            <div className="mx-2 h-6 w-px bg-gray-300" />

            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              disabled={disabled || isAtLimit}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors",
                "hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50",
                editor.isActive("paragraph")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900",
              )}
              title="Paragraph"
            >
              <Type size={14} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              disabled={disabled || isAtLimit}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors",
                "hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50",
                editor.isActive("heading", { level: 1 })
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900",
              )}
              title="Heading 1"
            >
              <Heading1 size={14} />
            </button>

            <div className="mx-2 h-6 w-px bg-gray-300" />

            {editor.isActive("link") ? (
              <button
                type="button"
                onClick={removeLink}
                disabled={disabled}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors",
                  "hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "bg-red-100 text-red-700",
                )}
                title="Remove Link"
              >
                <LinkIcon size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={addLink}
                disabled={disabled || isAtLimit}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors",
                  "hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "text-gray-600 hover:text-gray-900",
                )}
                title="Add Link"
              >
                <LinkIcon size={14} />
              </button>
            )}
          </div>
        )}

        <div className="p-4">
          <EditorContent
            editor={editor}
            className={cn(
              "prose prose-sm max-w-none",
              "prose-p:my-1 prose-headings:my-2",
              "[&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none",
              disabled && "cursor-not-allowed opacity-50",
              isAtLimit && "cursor-not-allowed",
            )}
          />
        </div>
      </div>

      {/* Character count and error */}
      <div className="mt-2 flex justify-between text-xs">
        {showCharacterCount && (
          <span
            className={cn(
              "text-gray-500",
              isOverLimit && "text-red-500",
              isAtLimit && "font-medium text-orange-500",
            )}
          >
            {characterCount} / {maxLength} characters
            {isAtLimit && " (limit reached)"}
          </span>
        )}
        {error && <span className="text-red-500">{error}</span>}
      </div>
    </div>
  );
};
