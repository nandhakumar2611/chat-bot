import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";


/**
 * Custom Hook: useCopyToClipboard
 *
 * This hook allows users to copy text to the clipboard and provides feedback.
 * It uses `navigator.clipboard.writeText()` to copy the text and displays a success or error toast message.
 *
 * @param {Object} params - Parameters object.
 * @param {string} params.text - The text content to be copied.
 * @param {string} [params.copyMessage="Copied to clipboard!"] - Message to display on successful copy.
 *
 * @returns {Object} An object containing:
 * - `isCopied` (boolean): Whether the text was successfully copied.
 * - `handleCopy` (function): Function to copy text to clipboard when triggered.
 */
function useCopyToClipboard({ text, copyMessage = "Copied to clipboard!" }) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(copyMessage);
        setIsCopied(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        timeoutRef.current = setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard.");
      });
  }, [text, copyMessage]);

  return { isCopied, handleCopy };
}

export default useCopyToClipboard;
