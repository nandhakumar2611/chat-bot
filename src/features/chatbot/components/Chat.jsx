import React, { forwardRef, useCallback, useState } from "react";
import { ArrowDown, ThumbsDown, ThumbsUp } from "lucide-react";

import { cn } from "@/lib/utils";
import useAutoScroll from "../hooks/useAutoScroll";
import { Button } from "@/components/ui/button";
import MessageList from "../components/MessageList";
import CopyButton  from "../components/CopyButton";
import MessageInput  from "../components/MessageInput";
import PromptSuggestions from "../components/promptSuggestions";

/**
 * Chat Component
 * 
 * This is the main chat UI component responsible for:
 * - Displaying messages
 * - Handling user input
 * - Managing chat interactions (copy, thumbs-up/down rating)
 * - Supporting attachments
 * 
 * Props:
 * - messages: Array of chat messages
 * - handleSubmit: Function to handle form submission
 * - input: Current message input value
 * - handleInputChange: Function to handle input changes
 * - stop: Function to stop message generation
 * - isGenerating: Boolean indicating if a response is being generated
 * - append: Function to append user messages (optional)
 * - suggestions: Suggested prompts for the user (optional)
 * - className: Additional CSS classes
 * - onRateResponse: Function to handle thumbs-up/down rating (optional)
 */
const Chat = ({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  stop,
  isGenerating,
  append,
  suggestions,
  className,
  onRateResponse,
}) => {
  const lastMessage = messages.at(-1);
  const isEmpty = messages.length === 0;
  const isTyping = lastMessage?.role === "user";

  /**
   * Generates message action buttons (Copy, Thumbs Up/Down)
   */
  const messageOptions = useCallback(
    (message) => ({
      actions: onRateResponse ? (
        <>
          <div className="border-r pr-1">
            <CopyButton content={message.content} copyMessage="Copied response to clipboard!" />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, "thumbs-up")}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, "thumbs-down")}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <CopyButton content={message.content} copyMessage="Copied response to clipboard!" />
      ),
    }),
    [onRateResponse]
  );

  return (    
    <ChatContainer className={className}>
      {isEmpty && append && suggestions ? (
        <PromptSuggestions label="Try these prompts ✨" append={append} suggestions={suggestions} />
      ) : null}

      {messages.length > 0 ? (
        <ChatMessages messages={messages}>
          <MessageList messages={messages} isTyping={isTyping} messageOptions={messageOptions} />
        </ChatMessages>
      ) : null}

      <ChatForm className="mt-auto" isPending={isGenerating || isTyping} handleSubmit={handleSubmit}>
        {({ files, setFiles }) => (
          <MessageInput
            value={input}
            onChange={handleInputChange}
            allowAttachments
            files={files}
            setFiles={setFiles}
            stop={stop}
            isGenerating={isGenerating}
          />
        )}
      </ChatForm>
    </ChatContainer>
  );
};

export default Chat;

/**
 * ChatMessages Component
 * 
 * Displays chat messages and provides auto-scrolling.
 */
const ChatMessages = ({ messages, children }) => {
  const { containerRef, scrollToBottom, handleScroll, shouldAutoScroll, handleTouchStart } =
    useAutoScroll([messages]);
  return (
    <div
      className="grid grid-cols-1 overflow-y-auto pb-4"
      ref={containerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
    >
      <div className="max-w-full [grid-column:1/1] [grid-row:1/1]">{children}</div>

      <div className="flex flex-1 items-end justify-end [grid-column:1/1] [grid-row:1/1]">
        {!shouldAutoScroll && (
          <div className="sticky bottom-0 left-0 flex w-full justify-end">
            <Button
              onClick={scrollToBottom}
              className="h-8 w-8 rounded-full ease-in-out animate-in fade-in-0 slide-in-from-bottom-1"
              size="icon"
              variant="ghost"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ChatContainer Component
 * 
 * Acts as the main wrapper for the chat UI.
 */
const ChatContainer = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid max-h-full w-full grid-rows-[1fr_auto]", className)}
      {...props}
    />
  );
});

/**
 * ChatForm Component
 * 
 * Handles user input submission and manages file attachments.
 */
const ChatForm = forwardRef(({ children, handleSubmit, isPending, className }, ref) => {
  const [files, setFiles] = useState(null);

  /**
   * Handles form submission:
   * - If no files are attached, submits as text.
   * - If files exist, submits as attachments.
   */
  const onSubmit = (event) => {
    if (!files) {
      handleSubmit(event);
      return;
    }

    const fileList = createFileList(files);
    handleSubmit(event, { experimental_attachments: fileList });
    setFiles(null);
  };

  return (
    <form ref={ref} onSubmit={onSubmit} className={className}>
      {children({ files, setFiles })}
    </form>
  );
});

/**
 * createFileList Utility Function
 * 
 * Converts an array of File objects into a FileList.
 * Used to manage attachments in the chat form.
 */
function createFileList(files) {
  const dataTransfer = new DataTransfer();
  for (const file of Array.from(files)) {
    dataTransfer.items.add(file);
  }
  return dataTransfer.files;
}
