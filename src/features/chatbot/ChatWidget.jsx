import React, { useEffect, useState } from 'react'
import ChatButton from './components/ChatButton';
import ChatWindow from './components/ChatWindow';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    }    
    useEffect(() => {
      // Listen for toggle messages from parent
      const handleMessage = (event) => {
        if (event.data === "TOGGLE_CHATBOT") {
          setIsOpen((prev) => !prev);
        }
      };
  
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, []);
         
  return (


<div className="fixed bottom-5 right-5">
    <ChatButton onClick={toggleChat} isOpen={isOpen} />
    {isOpen && <ChatWindow onClose={toggleChat} />}
</div>
  )
}

export default ChatWidget