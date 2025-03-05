import React, { useMemo } from "react";
import { cva } from "class-variance-authority";
import { Code2, Loader2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import FilePreview from "../components/FilePreview";
import MarkdownRenderer from "../components/MarkdownRenderer";

/**
 * ChatMessage Component
 *
 * This component renders a single chat message, supporting:
 * - User & Assistant messages with different styles.
 * - Animated message appearance.
 * - Markdown rendering for content.
 * - File attachments preview.
 * - Timestamps for messages.
 * - Tool invocation handling (calls and results).
 *
 * Props:
 * - role (string): The sender of the message ("user" | "assistant" | others).
 * - content (string): The text content of the message.
 * - createdAt (Date, optional): The timestamp for the message.
 * - showTimeStamp (boolean, optional): Whether to show a timestamp (default: false).
 * - animation (string, optional): Type of animation ("none", "slide", "scale", "fade").
 * - actions (ReactNode, optional): Additional actions (like thumbs up/down).
 * - className (string, optional): Additional CSS classes.
 * - experimental_attachments (array, optional): List of file attachments.
 * - toolInvocations (array, optional): Tool-related messages (calls, results).
 */

const ChatMessage = ({
  role,
  content,
  createdAt,
  showTimeStamp = false,
  animation = "scale",
  actions,
  className,
  experimental_attachments,
  toolInvocations,
}) => {
  // Convert data URLs of attachments into File objects.
  const files = useMemo(() => {
    return experimental_attachments?.map((attachment) => {
      const dataArray = dataUrlToUint8Array(attachment.url);
      return new File([dataArray], attachment.name ?? "Unknown");
    });
  }, [experimental_attachments]);

  // If the message contains tool invocations, render them instead of a normal message.
  if (toolInvocations && toolInvocations.length > 0) {
    return <ToolCall toolInvocations={toolInvocations} />;
  }

  // Determine if the message is from the user.
  const isUser = role === "user";

  // Format the timestamp if provided.
  const formattedTime = createdAt?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      {/* Display file attachments if available */}
      {files && (
        <div className="mb-1 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <FilePreview file={file} key={index} />
          ))}
        </div>
      )}

      {/* Chat bubble containing the message */}
      <div className={cn(chatBubbleVariants({ isUser, animation }), className)}>
        <div>
          {/* Render message content as Markdown */}
          <MarkdownRenderer>{content}</MarkdownRenderer>
        </div>

        {/* Display message actions (e.g., thumbs up/down) if applicable */}
        {role === "assistant" && actions && (
          <div className="absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
            {actions}
          </div>
        )}
      </div>

      {/* Show timestamp if enabled */}
      {showTimeStamp && createdAt && (
        <time
          dateTime={createdAt.toISOString()}
          className={cn(
            "mt-1 block px-1 text-xs opacity-50",
            animation !== "none" && "duration-500 animate-in fade-in-0"
          )}
        >
          {formattedTime}
        </time>
      )}
    </div>
  );
};

export default ChatMessage;

/**
 * Converts a base64 Data URL into a Uint8Array.
 *
 * @param {string} data - The base64 data URL.
 * @returns {Uint8Array} The converted Uint8Array.
 */
function dataUrlToUint8Array(data) {
  const base64 = data.split(",")[1];
  const buf = Buffer.from(base64, "base64");
  return new Uint8Array(buf);
}

/**
 * ToolCall Component
 *
 * This component displays tool invocation messages.
 * It shows messages when a tool is being called or when results are returned.
 *
 * Props:
 * - toolInvocations (array): List of tool invocation messages.
 */
const ToolCall = ({ toolInvocations }) => {
  if (!toolInvocations?.length) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      {toolInvocations.map((invocation, index) => {
        switch (invocation.state) {
          case "partial-call":
          case "call":
            return (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground"
              >
                <Terminal className="h-4 w-4" />
                <span>Calling {invocation.toolName}...</span>
                <Loader2 className="h-3 w-3 animate-spin" />
              </div>
            );

          case "result":
            return (
              <div
                key={index}
                className="flex flex-col gap-1.5 rounded-lg border bg-muted px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code2 className="h-4 w-4" />
                  <span>Result from {invocation.toolName}</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-foreground">
                  {JSON.stringify(invocation.result, null, 2)}
                </pre>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

/**
 * chatBubbleVariants - Generates CSS styles for chat bubbles.
 *
 * This function applies different styles based on:
 * - The sender (`isUser`): Different styles for user vs assistant messages.
 * - The animation type (`animation`): Controls how the message appears.
 */
const chatBubbleVariants = cva(
  "group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%]",
  {
    variants: {
      isUser: {
        true: "bg-primary text-primary-foreground", // User messages: Primary color.
        false: "bg-muted text-foreground", // Assistant messages: Muted color.
      },
      animation: {
        none: "", // No animation.
        slide: "duration-300 animate-in fade-in-0", // Slide animation.
        scale: "duration-300 animate-in fade-in-0 zoom-in-75", // Scale animation.
        fade: "duration-500 animate-in fade-in-0", // Fade animation.
      },
    },
    compoundVariants: [
      {
        isUser: true,
        animation: "slide",
        class: "slide-in-from-right", // User messages slide in from right.
      },
      {
        isUser: false,
        animation: "slide",
        class: "slide-in-from-left", // Assistant messages slide in from left.
      },
      {
        isUser: true,
        animation: "scale",
        class: "origin-bottom-right", // User messages scale from bottom-right.
      },
      {
        isUser: false,
        animation: "scale",
        class: "origin-bottom-left", // Assistant messages scale from bottom-left.
      },
    ],
  }
);

