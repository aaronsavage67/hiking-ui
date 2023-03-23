import React from 'react';
import {Text, ScrollView, StyleSheet, Image, useWindowDimensions, View, Dimensions,} from 'react-native';
import axios from "axios";
import {AirbnbRating} from "react-native-ratings";

const SingleMunroScreen = ({route}) => {
    const {height} = useWindowDimensions();
    const baseUrl = "http://localhost:8080";
    let [responseData, setResponseData] = React.useState([]);
    let [commentData, setCommentData] = React.useState([]);
    let differenceInDays = 0;
    const today = new Date();

    if (route.params.reload === true) {
        axios.get(`${baseUrl}/hiking/getMountainById?id=${route.params.munroId}`)
            .then((response) => {
                setResponseData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        route.params.reload = false;

        axios.get(`${baseUrl}/hiking/getReviewsByMountainName?name=${route.params.title}`)
            .then((response) => {
                setCommentData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const calculateDifferenceInDays = (date) => {
        const dateObj = new Date(today);
        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObj.getFullYear().toString();
        let todayFormatted = day + "/" + month + "/" + year;

        const date1Parts = todayFormatted.split("/");
        const date2Parts = date.split("/");
        const date1Obj = new Date(+date1Parts[2], date1Parts[1] - 1, +date1Parts[0]);
        const date2Obj = new Date(+date2Parts[2], date2Parts[1] - 1, +date2Parts[0]);
        const differenceInMs = Math.abs(date1Obj.getTime() - date2Obj.getTime());
        return differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
    };

    return (
        <View style={styles.root}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{responseData.name}</Text>
                <Image
                    source={{uri: `${baseUrl}/hiking/getImage?munro=${route.params.title}`}}
                    style={[styles.image, {height: height * 0.3}]}
                    resizeMode={"contain"}
                />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.heading}>Height:</Text>
                    <Text style={styles.text}>{responseData.height}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.heading}>Region:</Text>
                    <Text style={styles.text}>{responseData.region}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.heading}>Coords:</Text>
                    <Text style={styles.text}>{responseData.coords}</Text>
                </View>
                <Text style={styles.heading}>Description:</Text>
                <Text style={styles.text}>{responseData.description}</Text>
                <Text style={styles.reviewTitle}>Reviews</Text>
                {commentData.map((data) => {
                    calculateDifferenceInDays(data.reviewDate);
                    return (
                        <View
                            key={data.id}
                            style={styles.post}
                        >
                            <Text style={styles.textStyleA}>
                                Post by {data.username} - {differenceInDays} days ago
                            </Text>
                            <Text style={styles.textStyleB}>
                                {data.mountainName} on {data.walkDate}
                            </Text>
                            <AirbnbRating
                                defaultRating={data.rating}
                                isDisabled={true}
                                showRating={false}
                                size={22}
                            />
                            <Text style={styles.textStyleC}>
                                {data.comment}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: "#74CC56BE",
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        flex: 1,
    },
    title: {
        fontSize: 50,
        fontWeight: "bold",
        color: '#168224',
        margin: 10,
        textShadowColor: '#3d3d3d',
        shadowOffset: {
            width: 1,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4.5,
        alignSelf: 'center',
    },
    image: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 200,
        textShadowColor: '#3d3d3d',
        shadowOffset: {
            width: 1,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        alignSelf: 'center',
    },
    text: {
        fontSize: 20,
        margin: 10,
    },
    heading: {
        fontSize: 20,
        margin: 10,
        color: '#168224',
        fontWeight: 'bold',
    },
    reviewTitle: {
        fontSize: 30,
        margin: 10,
        color: '#168224',
        fontWeight: 'bold',
    },
    post: {
        backgroundColor: '#f5f5f5',
        borderColor: '#BBBBBBFF',
        margin: 5,
        borderRadius: 10,
        padding: 10,
        width: Dimensions.get('window').width * 0.85,
    },
    textStyleA: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    dateStyle: {
        fontSize: 15,
        paddingLeft: 30,
    },
    textStyleB: {
        fontSize: 20,
        color: '#168224',
        paddingVertical: 5,
    },
    textStyleC: {
        fontSize: 16,
        paddingTop: 5,
    },
});

export default SingleMunroScreen;
