import { useState, useRef, useEffect} from 'react'
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger)
const Hero = ({ setIsAudioPlaying, toggleAudioIndicator, setIsIndicatorActive, isIndicatorActive }) => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasClicked, setHasClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isVideoReady, setIsVideoReady] = useState(false)
    const [loadedVideos, setLoadedVideos] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [selected, setSelected] = useState("")
    const [hasClickedYes, setHasClickedYes] = useState(false);
    const [hasClickedNo, setHasClickedNo] = useState(false);

    const totalVideos = 4;
    const videoRef = useRef(null); 
    const nextVideoRef = useRef(null);

    const handleVideoLoad = () => {
        setLoadedVideos((prev) => prev + 1)

        if(currentIndex === 1) {
            setIsLoading(false)
        }

        setIsVideoReady(true)
    }

    const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

    const handleMiniVideoClick = () => {
        if(isVideoReady) {
            setHasClicked(true);
            setIsVideoReady(false)
            setCurrentIndex(upcomingVideoIndex);
        }
        
    }

    useEffect(() => {
        const modalTimer = setTimeout(() => {
            if(!isLoading) {
                // setIsAudioPlaying(false)
                setShowModal(true)
                
            }
        },1000);
        return () => clearTimeout(modalTimer);
       
    },[isLoading]);

    const handleAudioToggle = (option) => {
        setSelected(option)
        if(selected === "yes") {
            // toggleAudioIndicator()
            setIsAudioPlaying(true)
            setIsIndicatorActive(true)
            setShowModal(false)
        }
        else if(selected === "no"){
            setIsAudioPlaying(false)
            setShowModal(false)
        }

        else {
            setShowModal(true)
        }
        
    }

    const handleYesClick = () => {
        setHasClickedNo(true)
    }

    const handleNoClick = () => {
        setHasClickedYes(true)
    }

    // const isSmallScreen = () => window.innerWidth <= 768;

    // useEffect(() => {
    //     if(isSmallScreen && videoRef.current) {
    //         videoRef.current.play();
    //     }
    //     const handleResize = () => {
    //         if(isSmallScreen && videoRef.current) {
    //              videoRef.current.play();
    //         }
    //     }

    //     window.addEventListener("resize", handleResize)
    //     return () => window.removeEventListener("resize", handleResize)
    //   },[currentIndex])

    useGSAP(()=> {
        if(hasClicked) {
            gsap.set('#next-video', {visibility: 'visible'})

            gsap.to('#next-video', {
                transformOrigin: 'center center',
                scale: 1,
                width: '100%',
                height: '100%',
                duration: 1,
                ease: 'power1.inOut',
                onStart: () => nextVideoRef.current.play(),
            })

            gsap.from('#current-video', {
                transformOrigin: 'center center',
                scale: 0,
                duration: 1.5,
                ease: 'power1.inOut'
            })
        }
    }, {dependencies: [currentIndex], revertOnUpdate: true})


    useGSAP(()=> {
        gsap.set('#video-frame', {
            clipPath: 'polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)',
            borderRadius: '0 0 40% 10%'
        })

        gsap.from('#video-frame', {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
             borderRadius: '0 0 0 0',
             ease: 'power1.inOut',
             scrollTrigger: {
                trigger: '#video-frame',
                start: 'center center',
                end: 'bottom center',
                scrub: true,
             }
        })
    })
    const getVideoSrc = (index) => `/videos/hero-${index}.mp4`;
    
     // Detect screen width to decide whether to autoplay videos on smaller screens
    const isSmallScreen = window.innerWidth <= 768; // Adjust this value as per your requirement

    useEffect(() => {
        
        const handleResize = () => {
        if (isSmallScreen && videoRef.current) {
            videoRef.current.play();
        }
    };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [currentIndex, isSmallScreen]);

    //useEffect(() => { 
    //if(loadedVideos === totalVideos - 1) {
            //setIsLoading(false)
        //}
    //}, [loadedVideos])

    

  return (
    <div className=''>
    
      {isLoading && (
        <div className='flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50'>
            <div className='three-body'>
                <div className='three-body__dot'/>
                <div className='three-body__dot'/>
                <div className='three-body__dot'/>
            </div>
        </div>
      )}
      {showModal && (
        <div className='fixed top-1/3  flex z-50 mx-6 rounded-md scale-100 md:mx-[30%] bg-[#ffffffe9] px-4  text-black text-sm md:text-lg'>
        <div className='mx-8 my-6 md:space-y-8 space-y-4 font-circular-web'>
            <div>
                <p className={`flex text-start ${isSmallScreen ? "block" : "hidden"}`}>For the best experience, we recommend using a larger screen like tablet, laptop, or monitor. Some videos and animations may not display optimally on mobile devices, but on a bigger screen, you'll enjoy every detail as intended!</p>
            </div>
            <div>
                <p>Also for an immersive experience, explore the website with audio! <br /> Click the button to turn on the sound and enjoy the journey in full effect.</p> 

                <div className='flex justify-center items center mt-4 gap-8'>
                    <button 
                    onClick={() => {handleAudioToggle("yes"); 
                    handleYesClick() }} 
                    disabled={hasClickedYes} 
                    className={`bg-black py-2 px-5 text-white rounded transition duration-500 ease-in-out cursor-pointer ${hasClickedYes ? "bg-gray-900 cursor-not-allowed" : selected === "yes" && 'bg-blue-300'}`}>Yes</button>

                    <button 
                    onClick={() => {handleAudioToggle("no"); 
                    handleNoClick()}} 
                    disabled={hasClickedNo} 
                    className={`bg-black py-2 px-5 text-white rounded transition duration-500 ease-in-out cursor-pointer ${hasClickedNo ? "bg-gray-900 cursor-not-allowed" : selected === "no" && 'bg-blue-300'}`} >No</button>
                </div>
            </div>
            <div className='flex justify-center items-center transition duration-500 ease-in-out'>
                {selected === "yes" && <span className='text-green-500'>Click "Yes" again to play audio and exit</span>}
                {selected === "no" && <span className='text-pink-500'>Click "No" again to exit</span>}
            </div>
           
        </div>
        </div>
      )}
      <div className='relative h-dvh w-screen overflow-x-hidden'>
      <div id="video-frame" className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
      {!isSmallScreen ? 
        <div>
            <div className='mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg'>
                <div onClick={handleMiniVideoClick} className='origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100'>
                    <video 
                        src={getVideoSrc(upcomingVideoIndex)}
                        ref={nextVideoRef}
                        loop
                        muted
                        id='current-video'
                        className='size-64 origin-center scale-150 object-cover object-center'
                        onLoadedData={handleVideoLoad}
                    />
                </div>
            </div>

            <video
                ref={nextVideoRef}
                src={getVideoSrc(currentIndex)}
                loop
                muted
                id='next-video'
                className='absolute-center invisible absolute z-20 size-64 object-cover object-center'
                onLoadedData={handleVideoLoad}
            />
            <video
                ref={videoRef}
                src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
                loop
                autoPlay
                muted
                className='absolute left-0 top-0 size-full object-cover object-center'
                onLoadedData={handleVideoLoad}
            />
        </div>
       :
       <video
                ref={videoRef}
                src={getVideoSrc(2)}
                loop
                autoPlay
                muted
                className='absolute left-0 top-0 size-full object-cover object-center'
                onLoadedData={handleVideoLoad}
            />
       }
        <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75'>G<b>a</b>ming</h1>
        <div className='absolute left-0 top-0 z-40 size-full'>
            <div className='mt-24 px-5 sm:px-10'>
                <h1 className='special-font hero-heading text-blue-100'>redefi<b>n</b>e</h1>
                <p className='mb-5 max-w-64 font-robert-regular text-blue-100'>Enter the Metagame Layer <br /> Unleash the Play Economy</p>
                <Button 
                    id='watch-trailer' title='Watch Trailer' leftIcon={<TiLocationArrow/>}
                    containerClass="!bg-yellow-300 flex-center gap-1"
                />
            </div>
        </div>
      </div>
        <h1 className='special-font hero-heading absolute bottom-5 right-5 text-black'>G<b>a</b>ming</h1>
    </div>
      </div>
      
  )
}

export default Hero
