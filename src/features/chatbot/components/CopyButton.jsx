import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import  useCopyToClipboard  from "../hooks/useCopyToClipboard";

/**
 * CopyButton Component
 * 
 * This button allows users to copy text to the clipboard.
 * Once clicked, it briefly shows a checkmark indicating a successful copy.
 * 
 * Props:
 * - content (string): The text content to copy.
 * - copyMessage (string): Message displayed on successful copy (can be used for notifications).
 */
function CopyButton({ content, copyMessage }) {
  const { isCopied, handleCopy } = useCopyToClipboard({
    text: content,
    copyMessage,
  });

  return (
    <button
      className="relative h-6 w-6 bg-transparent border-none cursor-pointer"
      aria-label="Copy to clipboard"
      onClick={handleCopy}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Check
          className={cn(
            "h-4 w-4 transition-transform ease-in-out",
            isCopied ? "scale-100" : "scale-0"
          )}
        />
      </div>
      <Copy
        className={cn(
          "h-4 w-4 transition-transform ease-in-out",
          isCopied ? "scale-0" : "scale-100"
        )}
      />
    </button>
  );
}

export default CopyButton;
