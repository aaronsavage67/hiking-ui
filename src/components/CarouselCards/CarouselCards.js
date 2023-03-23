import React, {useEffect, useState} from 'react'
import {View} from "react-native"
import Carousel from 'react-native-snap-carousel'
import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from '../CarouselCardItem/CarouselCardItem'

const CarouselCards = () => {
    const isCarousel = React.useRef(null)
    const baseUrl = "http://localhost:8080";
    const [responseData, setResponseData] = useState([]);

    useEffect(() => {
        fetch(`${baseUrl}/hiking/getAllMountains`)
            .then((response) => response.json())
            .then((responseJson) => {
                setResponseData(responseJson);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <View>
            <Carousel
                layout={"tinder"}
                layoutCardOffset={9}
                ref={isCarousel}
                data={responseData}
                renderItem={CarouselCardItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                inactiveSlideShift={0}
                useScrollView={true}
                loop={true}
            />
        </View>
    )
}


export default CarouselCards
