import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"
import { ChatWidget } from './features/chatbot'
// import { ChatBot } from './features/chatbot'





function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <h1 className='text-5xl text-center p-16'>Hello World</h1> */}
      {/* <Button variant="default">Button</Button> */}
      {/* <ChatBot/> */}
      <ChatWidget/>

    </>
  )
}

export default App
