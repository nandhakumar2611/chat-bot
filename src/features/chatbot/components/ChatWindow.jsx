import React, { useState } from 'react';
// import ChatMessages from './ChatMessages';
// import ChatInput from './ChatInput';
import Chat from './Chat';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const ChatWindow = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
          id: "1",
          role: "assistant",
          content: "Hello! How can I assist you today?",
        },
        {
          id: "1",
          role: "assistant",
          content: `\`\`\`tsx \n console.log("Hello World")\n \`\`\``,
        },
      ]);
    
      // State for user input
      const [input, setInput] = useState("");
    
      // Handles input change
      const handleInputChange = (event) => {
        setInput(event.target.value);
      };
    
      // Handles message submission
      const handleSubmit = (event) => {
        event.preventDefault();
        if (!input.trim()) return;
    
        append({ id: Date.now().toString(), role: "user", content: input });
        setInput(""); // Clear input
      };
    
      // Function to append messages (manual state update)
      const append = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    
        // Simulate AI response with a delay (Replace with real API)
        if (message.role === "user") {
          setTimeout(() => {
            const botResponse = {
              id: Date.now().toString(),
              role: "assistant",
              content: `You asked: "${message.content}". Here’s some info!`,
              suggestions: [
                "Tell me more.",
                "Can you summarize?",
                "Give me an example.",
              ],
            };
            setMessages((prevMessages) => [...prevMessages, botResponse]);
          }, 1000);
        }
      };

  return (
    <div className="fixed bottom-16 right-5 w-80 md:w-96  h-[500px] bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
            <h2 className="text-lg font-semibold">Chat Support</h2>
            <Button onClick={onClose} variant="ghost">
              <X size={20} />
            </Button>
          </div>

          {/* Chat Component */}
          <div className="flex-1 overflow-y-auto p-3">
            <Chat
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>


  );
};

export default ChatWindow;