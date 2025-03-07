import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import React from 'react';


  
const ChatButton = ({ onClick, isOpen }) => {
  return (
    <Button 
    onClick={onClick}
    className="p-3 rounded-full shadow-lg"
  >
    {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
  </Button>
  );
};

export default ChatButton;