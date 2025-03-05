import React from "react";
import ChatMessage from "../components/ChatMessage";
import  TypingIndicator  from "../components/TypingIndicator";

/**
 * MessageList Component
 *
 * This component displays a list of chat messages.
 * It also optionally displays timestamps and a typing indicator.
 *
 * Props:
 * - messages (Array): List of message objects.
 * - showTimeStamps (boolean, optional): Whether to show timestamps (default: true).
 * - isTyping (boolean, optional): Whether the user is typing (default: false).
 * - messageOptions (Object | Function, optional): Additional message properties.
 */

const MessageList = ({ messages, showTimeStamps = true, isTyping = false, messageOptions }) => {
  return (
    <div className="space-y-4 overflow-visible">
      
      {messages.map((message, index) => {
        
        const additionalOptions =
          typeof messageOptions === "function" ? messageOptions(message) : messageOptions;

        return (
          <ChatMessage
            key={index}
            showTimeStamp={showTimeStamps}
            {...message}
            {...additionalOptions}
          />
        );
      })}
      
      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default MessageList;
