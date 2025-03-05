import { Dot } from "lucide-react";

/**
 * TypingIndicator Component
 *
 * This component displays an animated typing indicator, typically used in chat applications.
 * It consists of three bouncing dots to indicate that someone is typing.
 *
 * Features:
 * - Animated dots using CSS animations (`animate-typing-dot-bounce`).
 * - Delayed animations for a natural typing effect.
 * - Styled chat bubble for better visibility.
 */
function TypingIndicator() {
  return (
    <div className="justify-left flex space-x-1">
      {/* Container for the typing indicator */}
      <div className="rounded-lg bg-muted p-3">
        <div className="flex -space-x-2.5">
          {/* Animated typing dots */}
          <Dot className="h-5 w-5 animate-typing-dot-bounce" />
          <Dot className="h-5 w-5 animate-typing-dot-bounce [animation-delay:90ms]" />
          <Dot className="h-5 w-5 animate-typing-dot-bounce [animation-delay:180ms]" />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
