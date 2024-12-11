import { useState, useEffect, useRef } from 'react'
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Features from "./components/Features"
import Story from "./components/Story"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
const App = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false)
  const toggleAudioIndicator = () =>  {
    setIsAudioPlaying((prev) => !prev);

    setIsIndicatorActive((prev) => !prev);
}
  


  return (
    <main className='relative min-h-screen w-screen overflow-x-hidden'>
      <Navbar isAudioPlaying={isAudioPlaying} setIsAudioPlaying={setIsAudioPlaying} setIsIndicatorActive={setIsIndicatorActive} isIndicatorActive={isIndicatorActive}/>
      <Hero isAudioPlaying={isAudioPlaying} setIsAudioPlaying={setIsAudioPlaying} toggleAudioIndicator={toggleAudioIndicator} setIsIndicatorActive={setIsIndicatorActive} isIndicatorActive={isIndicatorActive}/>
      <About/>
      <Features/>
      <Story/>
      <Contact/>
      <Footer/>
    </main>
  )
}

export default App
