import React, { useState } from "react";
import Chat from "./components/Chat";
import { MessageCircle, X } from "lucide-react";

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
      content: `\`\`\`tsx \n console.log("Hello World")\n \`\`\``
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
    {/* Floating Chatbot Button */}
    <button
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      onClick={() => setIsOpen(!isOpen)}
    >
      <MessageCircle className="w-6 h-6" />
    </button>

    {/* Chat Window */}
    {isOpen && (
      <div className="fixed inset-0 md:inset-auto md:bottom-22 md:right-6 md:w-[380px] md:max-h-[500px] bg-white shadow-lg rounded-lg border p-4 flex flex-col">
        {/* Chat Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Chatbot</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6"/>
          </button>
        </div>

        {/* Chat Component */}
        <div className="flex-grow overflow-y-auto">
          <Chat
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            append={append}
            isGenerating={false} // No AI processing state needed
            stop={() => {}} // Placeholder stop function (not used here)
            suggestions={[
              "Generate a tasty vegan lasagna recipe for 3 people.",
              "Generate a list of 5 questions for a frontend job interview.",
              "Who won the 2022 FIFA World Cup?",
            ]}
          />
        </div>
      </div>
    )}
  </>
  );
};

export default ChatBot;
