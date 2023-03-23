import React, {useState} from 'react'
import {
    Alert,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    RefreshControl
} from 'react-native'
import axios from "axios";
import {Dropdown} from "react-native-element-dropdown";
import CalendarPicker from "react-native-calendar-picker";
import {AirbnbRating} from "react-native-ratings";

let newMunro = null;

const ReviewsScreen = ({route}) => {
    const baseUrl = "http://localhost:8080";
    let [responseData, setResponseData] = React.useState([]);
    let [listResponseData, setListResponseData] = React.useState([]);
    const [createReviewModalVisible, setCreateReviewModalVisible] = useState(false);
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const today = new Date();
    let dd = String(today.getDate());
    let mm = String(today.getMonth());
    let yyyy = String(today.getFullYear());
    let formattedDate = new Date(yyyy, mm, dd);
    let newRating = 3;
    let newComment = "";
    let differenceInDays = 0;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    if (route.params.reload === true) {
        axios.get(`${baseUrl}/hiking/getAllReviews`)
            .then((response) => {
                setResponseData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        axios.get(`${baseUrl}/hiking/getAllMountains`)
            .then((listResponse) => {
                setListResponseData(listResponse.data);
            })
            .catch((error) => {
                console.log(error);
            });

        route.params.reload = false;
    }

    const onDateChange = (date) => {
        let date1 = new Date(date);
        let day = date1.getDate();
        let month = date1.getMonth() + 1;
        let year = date1.getFullYear();
        formattedDate = day + "/" + month + "/" + year;
    };

    const onRatingChange = (rating) => {
        newRating = rating;
    };

    const onMunroChange = (munro) => {
        newMunro = munro;
    };

    const onCommentChange = (comment) => {
        newComment = comment;
    };

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

    const createReview = () => {
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        if (formattedDate.toString() === today.toString()) {
            onDateChange(formattedDate);
        }

        const dateObj = new Date(today);
        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObj.getFullYear().toString();
        let todayFormatted = day + "/" + month + "/" + year;

        axios.post(`${baseUrl}/hiking/createReview`,
            {
                username: route.params.username,
                reviewDate: todayFormatted,
                mountainId: newMunro.id,
                mountainName: newMunro.name,
                walkDate: formattedDate,
                rating: newRating,
                comment: newComment
            })
            .then((response) => {
                setResponseData(response.data);
                setCreateReviewModalVisible(!createReviewModalVisible);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && {color: '#459186'}]}>
                    Munro
                </Text>
            );
        }
        return null;
    };

    const orderDateAscending = (data) => {
        const sortedData = [...data].sort((a, b) => new Date(...a.reviewDate.split('/').reverse())
            - new Date(...b.reviewDate.split('/').reverse()));
        setResponseData(sortedData);
    };

    const orderDateDescending = (data) => {
        const sortedData = [...data].sort((a, b) => new Date(...b.reviewDate.split('/').reverse())
            - new Date(...a.reviewDate.split('/').reverse()));
        setResponseData(sortedData);
    };

    return (
        <View style={styles.root}>
            <View style={styles.orderButtonsContainer}>
                <Pressable
                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.orderButtons]}
                    onPress={() => orderDateDescending(responseData)}
                >
                    {({pressed}) => (
                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                            Latest
                        </Text>
                    )}
                </Pressable>
                <Pressable
                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.orderButtons]}
                    onPress={() => orderDateAscending(responseData)}
                >
                    {({pressed}) => (
                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                            Oldest
                        </Text>
                    )}
                </Pressable>
            </View>
            <View style={styles.buttonContainer}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }
                >
                    {responseData.map((data) => {
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
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={createReviewModalVisible}
                        onRequestClose={() => {
                            setCreateReviewModalVisible(!createReviewModalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>Create Review</Text>
                                <View style={styles.container}>
                                    {renderLabel()}
                                    <Dropdown
                                        style={[styles.dropdown, isFocus && {borderColor: '#459186'}]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        data={listResponseData}
                                        search
                                        maxHeight={300}
                                        labelField="name"
                                        valueField="id"
                                        placeholder={!isFocus ? 'Select a Munro' : '...'}
                                        searchPlaceholder="Search..."
                                        value={value}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={item => {
                                            setValue(item.id);
                                            onMunroChange(item);
                                            setIsFocus(false);
                                        }}
                                    />
                                </View>
                                <CalendarPicker
                                    selectedStartDate={new Date(yyyy, mm, dd)}
                                    startFromMonday={true}
                                    restrictMonthNavigation={true}
                                    minDate={new Date(2018, 1, 1)}
                                    maxDate={new Date(yyyy, mm, dd)}
                                    weekdays={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                                    months={[
                                        'Jan',
                                        'Feb',
                                        'Mar',
                                        'Apr',
                                        'May',
                                        'Jun',
                                        'Jul',
                                        'Aug',
                                        'Sep',
                                        'Oct',
                                        'Nov',
                                        'Dec',
                                    ]}
                                    previousTitle="Back"
                                    nextTitle="Next"
                                    selectedDayColor="#459186"
                                    selectedDayTextColor="white"
                                    scaleFactor={400}
                                    onDateChange={onDateChange}
                                />
                                <AirbnbRating
                                    showRating={false}
                                    onFinishRating={onRatingChange}
                                />
                                <TextInput
                                    style={styles.commentBox}
                                    onChangeText={onCommentChange}
                                    placeholder="comment.."
                                    clearButtonMode={'while-editing'}
                                />
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button]}
                                    onPress={() => {
                                        if (formattedDate === null || newMunro === null || newComment === "") {
                                            Alert.alert('Sorry!', 'Please enter all details to review a trip.',
                                                [
                                                    {text: 'OK'},
                                                ]);
                                        } else {
                                            createReview();
                                            setCreateReviewModalVisible(!createReviewModalVisible);
                                        }
                                    }}>
                                    {({pressed}) => (
                                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                                            Post
                                        </Text>
                                    )}
                                </Pressable>
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button]}
                                    onPress={() => setCreateReviewModalVisible(!createReviewModalVisible)}>
                                    {({pressed}) => (
                                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                                            Close
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
            <View style={styles.createButtonContainer}>
                <Pressable
                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.createButton]}
                    onPress={() => setCreateReviewModalVisible(!createReviewModalVisible)}
                >
                    {({pressed}) => (
                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.createTextStyle]}>
                            Create Review
                        </Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: "#74CC56BE",
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    buttonContainer: {
        height: Dimensions.get('window').height * 0.65,
    },
    createButtonContainer: {
        position: "absolute",
        bottom: 140,
    },
    createButton: {
        borderRadius: 15,
        padding: 15,
        elevation: 2,
        margin: 5,
        borderColor: 'black',
        borderWidth: 2,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 5,
        marginTop: 10,
    },
    createTextStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 10,
    },
    modalView: {
        margin: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: "bold",
        color: '#459186',
        margin: 10,
        marginTop: -5,
    },
    modalText: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    dropdown: {
        height: 50,
        borderColor: '#BBBBBBFF',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    container: {
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        borderColor: '#BBBBBBFF',
        borderRadius: 10,
    },
    orderButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    orderButtons: {
        borderRadius: 10,
        padding: 4,
        elevation: 2,
        margin: 3,
        marginBottom: 10,
        borderColor: 'black',
        borderWidth: 2,
        color: '#459186',
        width: '23%',
        justifyContent: 'center',
    },
    commentBox: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
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

export default ReviewsScreen;
