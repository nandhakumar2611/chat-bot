import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import { omit } from "remeda";

import { cn } from "@/lib/utils";
import { useAutosizeTextArea } from "../hooks/useAutosizeTextArea";
import { Button } from "@/components/ui/button";
import FilePreview  from "../components/FilePreview";

/**
 * MessageInput Component
 *
 * A user input field for chat messages, supporting:
 * - Auto-expanding textarea
 * - Drag & drop file attachments
 * - Paste-to-attach functionality
 * - Enter key to send messages
 * - Stop button for ongoing AI responses
 * - Interrupt prompt for message control
 *
 * Props:
 * - value (string): Current message input value.
 * - submitOnEnter (boolean, optional): Whether to submit on pressing Enter.
 * - stop (function, optional): Stops ongoing AI message generation.
 * - isGenerating (boolean): Indicates if AI is generating a response.
 * - enableInterrupt (boolean, optional): Enables the "Press Enter again to interrupt" prompt.
 * - allowAttachments (boolean, optional): Enables file attachment functionality.
 * - files (File[] | null, optional): List of attached files.
 * - setFiles (function, optional): Function to update attached files.
 */
const MessageInput = ({
  placeholder = "Ask AI...",
  className,
  onKeyDown: onKeyDownProp,
  submitOnEnter = true,
  stop,
  isGenerating,
  enableInterrupt = true,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showInterruptPrompt, setShowInterruptPrompt] = useState(false);

  // Hide the interrupt prompt when AI stops generating
  useEffect(() => {
    if (!isGenerating) {
      setShowInterruptPrompt(false);
    }
  }, [isGenerating]);

  // Adds files to the message input
  const addFiles = (files) => {
    if (props.allowAttachments) {
      props.setFiles((currentFiles) =>
        currentFiles ? [...currentFiles, ...files] : files
      );
    }
  };

  // Handles drag-and-drop functionality for file attachments
  const onDragOver = (event) => {
    if (!props.allowAttachments) return;
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event) => {
    if (!props.allowAttachments) return;
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event) => {
    setIsDragging(false);
    if (!props.allowAttachments) return;
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    addFiles(droppedFiles);
  };

  // Handles pasting text as an attachment if it's too long
  const onPaste = (event) => {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const text = clipboardData.getData("text");

    if (text.length > 500 && props.allowAttachments) {
      event.preventDefault();
      const blob = new Blob([text], { type: "text/plain" });
      const file = new File([blob], "Pasted text", { type: "text/plain" });
      addFiles([file]);
      return;
    }

    const pastedFiles = Array.from(clipboardData.items)
      .map((item) => item.getAsFile())
      .filter(Boolean);

    if (props.allowAttachments && pastedFiles.length > 0) {
      addFiles(pastedFiles);
    }
  };

  // Handles pressing Enter to submit a message
  const onKeyDown = (event) => {
    if (submitOnEnter && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (isGenerating && stop && enableInterrupt) {
        if (showInterruptPrompt) {
          stop();
          setShowInterruptPrompt(false);
          event.currentTarget.form?.requestSubmit();
        } else if (props.value || (props.allowAttachments && props.files?.length)) {
          setShowInterruptPrompt(true);
          return;
        }
      }

      event.currentTarget.form?.requestSubmit();
    }

    onKeyDownProp?.(event);
  };

  const textAreaRef = useRef(null);

  const showFileList = props.allowAttachments && props.files?.length > 0;

  // Auto-resizes the textarea based on input size
  useAutosizeTextArea({
    ref: textAreaRef,
    maxHeight: 240,
    borderWidth: 1,
    dependencies: [props.value, showFileList],
  });

  return (
    <div
      className="relative flex w-full"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {enableInterrupt && (
        <InterruptPrompt isOpen={showInterruptPrompt} close={() => setShowInterruptPrompt(false)} />
      )}

      {/* Textarea Input */}
      <textarea
        aria-label="Write your prompt here"
        placeholder={placeholder}
        ref={textAreaRef}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        className={cn(
          "z-10 w-full grow resize-none rounded-xl border border-input bg-background p-3 pr-24 text-sm",
          "placeholder:text-muted-foreground focus-visible:border-primary",
          showFileList && "pb-16",
          className
        )}
        {...omit(props, ["allowAttachments", "files", "setFiles"])}
      />

      {/* File Attachments Display */}
      {showFileList && (
        <div className="absolute inset-x-3 bottom-0 z-20 overflow-x-scroll py-3">
          <div className="flex space-x-3">
            <AnimatePresence mode="popLayout">
              {props.files.map((file) => (
                <FilePreview
                  key={file.name + file.lastModified}
                  file={file}
                  onRemove={() =>
                    props.setFiles((files) => files?.filter((f) => f !== file) || null)
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Action Buttons (Attach, Stop, Submit) */}
      <div className="absolute right-3 top-3 z-20 flex gap-2">
        {props.allowAttachments && (
          <Button type="button" size="icon" variant="outline" className="h-8 w-8" aria-label="Attach a file"
            onClick={async () => addFiles(await showFileUploadDialog())}>
            <Paperclip className="h-4 w-4" />
          </Button>
        )}
        {isGenerating && stop ? (
          <Button type="button" size="icon" className="h-8 w-8" aria-label="Stop generating" onClick={stop}>
            <Square className="h-3 w-3 animate-pulse" fill="currentColor" />
          </Button>
        ) : (
          <Button type="submit" size="icon" className="h-8 w-8 transition-opacity" aria-label="Send message"
            disabled={props.value === "" || isGenerating}>
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </div>

      {props.allowAttachments && <FileUploadOverlay isDragging={isDragging} />}
    </div>
  );
};

/**
 * Handles the file upload dialog.
 */
function showFileUploadDialog() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "*/*";
    input.click();

    input.onchange = (e) => {
      const files = e.target.files;
      resolve(files ? Array.from(files) : null);
    };
  });
}

/**
 * InterruptPrompt Component
 *
 * This component displays a temporary prompt that appears when the user tries to interrupt
 * an ongoing AI-generated message. The user must press "Enter" again to confirm interruption.
 *
 * Props:
 * - isOpen (boolean): Determines whether the prompt is visible.
 * - close (function): Function to close the prompt.
 */
const InterruptPrompt = ({ isOpen, close }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ top: 0, filter: "blur(5px)" }} // Start position (blurred)
          animate={{
            top: -40,
            filter: "blur(0px)", // Animates upwards and removes blur
            transition: {
              type: "spring",
              filter: { type: "tween" },
            },
          }}
          exit={{ top: 0, filter: "blur(5px)" }} // Exit animation
          className="absolute left-1/2 flex -translate-x-1/2 overflow-hidden whitespace-nowrap rounded-full border bg-background py-1 text-center text-sm text-muted-foreground"
        >
          {/* Prompt message */}
          <span className="ml-2.5">Press Enter again to interrupt</span>

          {/* Close button */}
          <button
            className="ml-1 mr-2.5 flex items-center"
            type="button"
            onClick={close}
            aria-label="Close"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * FileUploadOverlay Component
 *
 * This component displays a visual overlay when the user drags files into the message input area.
 * It ensures users are aware that they can drop files to attach them.
 *
 * Props:
 * - isDragging (boolean): Determines whether the overlay is visible.
 */
const FileUploadOverlay = ({ isDragging }) => {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center space-x-2 rounded-xl border border-dashed border-border bg-background text-sm text-muted-foreground"
          initial={{ opacity: 0 }} // Start with 0 opacity
          animate={{ opacity: 1 }} // Fade in when active
          exit={{ opacity: 0 }} // Fade out when inactive
          transition={{ duration: 0.2 }} // Smooth transition
          aria-hidden
        >
          {/* Paperclip icon to indicate file attachment */}
          <Paperclip className="h-4 w-4" />
          <span>Drop your files here to attach them.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageInput;
