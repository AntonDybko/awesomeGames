import './Slider.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface SliderProps {
    slides: { url: string; title: string; description: string; }[];
}
    
const  Slider: React.FC<SliderProps> = ({slides}) =>  {
    const [currentSlide, setCurrentSlide] = useState(0);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const goToPreviousSlide = () => {
        const slideIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        setCurrentSlide(slideIndex);
    }

    const goToNextSlide = useCallback(() => {
        const slideIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
        setCurrentSlide(slideIndex);
    }, [currentSlide, slides]);

    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
    }

    useEffect(() => {   
        timer.current = setTimeout(() => {
            goToNextSlide();
        }, 4000);

        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [goToNextSlide]);
 
     return (
        <div className='slider'>
            <KeyboardArrowLeftIcon 
                className='leftArrow'
                onClick={goToPreviousSlide}/>
            <div className='slider-object'>
                <div className='slider-img' style={{ backgroundImage: `url(${slides[currentSlide].url})` }}></div>
                <div className='slider-dots'>
                    {slides.map((slide, i) => (
                        <div 
                            key={i} 
                            onClick={() => goToSlide(i)}
                            className={i === currentSlide ? 'active-slide' : ''}
                        >
                            ⬤
                        </div>
                    ))}
                </div>
                <div className='slide-description'>
                    <h2>{slides[currentSlide].title}</h2>
                    <p>{slides[currentSlide].description}</p>
                </div>
            </div>
            <KeyboardArrowRightIcon 
                className='rightArrow'
                onClick={goToNextSlide}/>
        </div>
    );
}

export default Slider;