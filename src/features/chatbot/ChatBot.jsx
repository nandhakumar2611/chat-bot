import React, { useEffect, useState } from "react";
import Chat from "./components/Chat";
import { MessageCircle, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatBot = () => {
  // State to store chat messages
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
  
  const [isOpen, setIsOpen] = useState(false);
  

 
  return (
    <>
 
 <div className="fixed bottom-5 right-5">
      {/* Toggle Chat Button */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full shadow-lg"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat Box (Visible only when isOpen is true) */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 w-80 md:w-96  h-[500px] bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
            <h2 className="text-lg font-semibold">Chat Support</h2>
            <Button onClick={() => setIsOpen(false)} variant="ghost">
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
      )}
    </div>
    </>
  );
};

export default ChatBot;
