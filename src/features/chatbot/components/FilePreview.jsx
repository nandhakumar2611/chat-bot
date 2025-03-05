import React, { useEffect, useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { FileIcon, X } from "lucide-react";

/**
 * FilePreview Component
 *
 * This component dynamically selects a preview based on file type:
 * - Image files → `ImageFilePreview`
 * - Text files (.txt, .md) → `TextFilePreview`
 * - All other files → `GenericFilePreview`
 *
 * Props:
 * - file (File): The uploaded file.
 * - onRemove (function, optional): Function to remove the file.
 */
const FilePreview = forwardRef(({ file, onRemove }, ref) => {
  if (file.type.startsWith("image/")) {
    return <ImageFilePreview file={file} onRemove={onRemove} ref={ref} />;
  }

  if (
    file.type.startsWith("text/") ||
    file.name.endsWith(".txt") ||
    file.name.endsWith(".md")
  ) {
    return <TextFilePreview file={file} onRemove={onRemove} ref={ref} />;
  }

  return <GenericFilePreview file={file} onRemove={onRemove} ref={ref} />;
});

export default FilePreview;

/**
 * ImageFilePreview Component
 *
 * Displays a preview for image files.
 */
const ImageFilePreview = forwardRef(({ file, onRemove }, ref) => {
  return (
    <motion.div
      ref={ref}
      className="relative flex max-w-[200px] rounded-md border p-1.5 pr-2 text-xs"
      layout
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
    >
      <div className="flex w-full items-center space-x-2">
        {/* Image Preview */}
        <img
          alt={`Attachment ${file.name}`}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border bg-muted object-cover"
          src={URL.createObjectURL(file)}
        />
        <span className="w-full truncate text-muted-foreground">{file.name}</span>
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button
          className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full border bg-background"
          type="button"
          onClick={onRemove}
          aria-label="Remove attachment"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </motion.div>
  );
});

/**
 * TextFilePreview Component
 *
 * Displays a small preview of text-based files (.txt, .md).
 */
const TextFilePreview = forwardRef(({ file, onRemove }, ref) => {
  const [preview, setPreview] = useState("");

  // Read file content and display a preview.
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setPreview(text.slice(0, 50) + (text.length > 50 ? "..." : ""));
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <motion.div
      ref={ref}
      className="relative flex max-w-[200px] rounded-md border p-1.5 pr-2 text-xs"
      layout
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
    >
      <div className="flex w-full items-center space-x-2">
        {/* Text Preview Box */}
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border bg-muted p-0.5">
          <div className="h-full w-full overflow-hidden text-[6px] leading-none text-muted-foreground">
            {preview || "Loading..."}
          </div>
        </div>
        <span className="w-full truncate text-muted-foreground">{file.name}</span>
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button
          className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full border bg-background"
          type="button"
          onClick={onRemove}
          aria-label="Remove attachment"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </motion.div>
  );
});

/**
 * GenericFilePreview Component
 *
 * Displays a generic preview for non-image and non-text files.
 */
const GenericFilePreview = forwardRef(({ file, onRemove }, ref) => {
  return (
    <motion.div
      ref={ref}
      className="relative flex max-w-[200px] rounded-md border p-1.5 pr-2 text-xs"
      layout
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
    >
      <div className="flex w-full items-center space-x-2">
        {/* File Icon */}
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border bg-muted">
          <FileIcon className="h-6 w-6 text-foreground" />
        </div>
        <span className="w-full truncate text-muted-foreground">{file.name}</span>
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button
          className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full border bg-background"
          type="button"
          onClick={onRemove}
          aria-label="Remove attachment"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </motion.div>
  );
});
