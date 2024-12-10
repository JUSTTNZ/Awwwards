import { useState, useRef, useEffect} from 'react'
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger)
const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasClicked, setHasClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isVideoReady, setIsVideoReady] = useState(false)
    const [loadedVideos, setLoadedVideos] = useState(0)
    const [showModal, setShowModal] = useState(false)

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
        if (isSmallScreen && videoRef.current) {
        videoRef.current.play();
        }
        const handleResize = () => {
        if (isSmallScreen && videoRef.current) {
            videoRef.current.play();
        }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [currentIndex, isSmallScreen]);

    useEffect(() => { 
        if(loadedVideos === totalVideos - 1) {
            setIsLoading(false)
        }
    }, [loadedVideos])

    useEffect(() => {
        const modalTimer = setTimeout(() => {
            if(!isLoading) {
                setShowModal(true)
            }
        },5000);
        return () => clearTimeout(modalTimer);
    },[isLoading]);

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
        <div className='fixed top-1/3 flex z-50 mx-6 rounded-md scale-100 md:mx-[30%] bg-[#d4d4d4] px-4  text-black '>
        <div className='mx-8 my-6 space-y-8 font-circular-web'>
            <div>
                <p className='flex text-start'>For the best experience, we recommend using a larger screen like tablet, laptop, or monitor. Some videos and animations may not display optimally on mobile devices, but on a bigger screen, you'll enjoy every detail as intended!</p>
            </div>
            <div>
                <p>And also for an immersive experience, explore the website with audio! <br /> Click the button to turn on the sound and enjoy the journey in full effect.</p>
                <div className=' flex justify-center items-center gap-6 mt-8 text-white'>
                    <span className='peer bg-black py-2 px-5 rounded-md focus:ring-2 focus:ring-blue-400 hover:bg-blue-300 hover:text-white transition duration-500 ease-in-out'>Yes</span>
                    <span className='bg-black py-2 px-5 rounded-md  hover:bg-blue-300 peer-focus:bg-gray-400 peer-focus:text-black hover:text-white transition duration-500 ease-in-out'>No</span>
                </div>
                
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
                src={getVideoSrc(1)}
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
