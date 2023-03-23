import React from 'react'
import {View, Text, StyleSheet, Dimensions, Image} from "react-native"

export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75)

const CarouselCardItem = ({item, index}) => {
    const baseUrl = "http://localhost:8080";

    return (
        <View style={styles.container} key={index}>
            <Image
                source={{uri: `${baseUrl}/hiking/getImage?munro=${item.name}`}}
                style={styles.image}
                resizeMode={"contain"}
            />
            <Text style={styles.name}>{item.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 15,
        width: ITEM_WIDTH,
        paddingBottom: 15,
        paddingTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.5,
        elevation: 7,
    },
    image: {
        width: ITEM_WIDTH,
        height: 180,
    },
    name: {
        color: "#222",
        fontSize: 26,
        fontWeight: "bold",
        alignSelf: 'center',
        paddingTop: 10,
    },
})

export default CarouselCardItem
