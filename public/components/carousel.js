import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import Image from 'next/image';
import styles from '@/styles/Carousel.module.css'
import CarouselContents from './carouselContent';

const Carousel = () => {
    const settings = {
        dots: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
    };
    return (
        <div className={styles.carousel}>
            <Slider {...settings} className={styles.slider}>
                {CarouselContents.map((item) => (
                    <div key={item.id}>
                        <div className={styles.item}>
                            <Image className={styles.carouselImage} src={item.src} width={5000} height={3334} alt={item.alt}></Image>
                            <div className={styles.content}>
                                <div className={styles.title}>{item.title}</div>
                                <div className={styles.des}>{item.des}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Carousel