import React, {useEffect, useState} from 'react';
import {
    Alert,
    Dimensions,
    LogBox,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import axios from "axios";
import CustomButton from "../../components/CustomButton";
import CircleButton from 'react-native-circle-button';
import {Dropdown} from 'react-native-element-dropdown';
import Blank from '../../../assets/images/blank.png';
import Minus from '../../../assets/images/minus.png';
import Add from '../../../assets/images/add.png';
import CalendarPicker from "react-native-calendar-picker";
import {AirbnbRating} from 'react-native-ratings';
import * as Progress from 'react-native-progress';

let newMunro = null;

const MunroBaggingScreen = ({route}) => {
    const baseUrl = "http://localhost:8080";
    let [responseData, setResponseData] = React.useState([]);
    let [listResponseData, setListResponseData] = React.useState([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [munroModalVisible, setMunroModalVisible] = useState(false);
    const [modalData, setModalData] = useState([]);

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const today = new Date();
    let dd = String(today.getDate());
    let mm = String(today.getMonth());
    let yyyy = String(today.getFullYear());

    let formattedDate = new Date(yyyy, mm, dd);
    let newRating = 3;

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

    const addMunroToBag = () => {
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        if (formattedDate.toString() === today.toString()) {
            onDateChange(formattedDate);
        }

        axios.post(`${baseUrl}/hiking/addMunroToBag`,
            {
                username: route.params.username,
                mountainId: newMunro.id,
                mountainName: newMunro.name,
                date: formattedDate,
                rating: newRating
            })
            .then((response) => {
                setResponseData(response.data);
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    console.log(error.response.data.message);
                    Alert.alert('Sorry!', 'You have already bagged this munro.',
                        [
                            {text: 'OK'},
                        ]);
                }
            });
    };

    const removeMunroFromBag = (data) => {
        axios.post(`${baseUrl}/hiking/removeMunroFromBag`,
            {
                id: data.id,
                username: route.params.username,
                mountainId: data.mountainId,
                mountainName: data.mountainName,
                date: data.date,
                rating: data.rating
            })
            .then((response) => {
                setResponseData(response.data);
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

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }, [])

    if (route.params.reload === true) {
        axios.get(`${baseUrl}/hiking/getMunrosBaggedByUsername?username=${route.params.username}`)
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

    const openMunroModal = (data) => {
        setModalData(data);
        setMunroModalVisible(!munroModalVisible);
    };

    return (
        <View style={styles.root}>
            <Text style={styles.text}>Progress Bar</Text>
            <Progress.Bar
                style={styles.progress}
                progress={responseData.length / 36}
                width={350}
                height={25}
                color={'#459186'}
                borderColor={'#292C2CFF'}
                borderWidth={3}
                borderRadius={8}
            />
            <View style={styles.buttonContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {responseData.map((data, key) =>
                        <CustomButton
                            key={key}
                            text={data.mountainName}
                            type={"SECONDARY"}
                            onPress={() => {
                                openMunroModal(data);
                            }}
                        />
                    )}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={munroModalVisible}
                        onRequestClose={() => {
                            setMunroModalVisible(!munroModalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>{modalData.mountainName}</Text>
                                <Text style={styles.modalText}>Completed on: {modalData.date}</Text>
                                <AirbnbRating
                                    defaultRating={modalData.rating}
                                    isDisabled={true}
                                    showRating={false}
                                    onFinishRating={onRatingChange}
                                />
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button, styles.buttonClose]}
                                    onPress={() => setMunroModalVisible(!munroModalVisible)}
                                >
                                    {({pressed}) => (
                                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                                            Close
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={addModalVisible}
                        onRequestClose={() => {
                            setAddModalVisible(!addModalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>Add Munro</Text>
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
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        if (formattedDate === null || newRating === null || newMunro === null) {
                                            Alert.alert('Sorry!', 'Please enter all details to bag a munro.',
                                                [
                                                    {text: 'OK'},
                                                ]);
                                        } else {
                                            addMunroToBag();
                                            setAddModalVisible(!addModalVisible);
                                        }
                                    }}>
                                    {({pressed}) => (
                                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                                            Add
                                        </Text>
                                    )}
                                </Pressable>
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button, styles.buttonClose]}
                                    onPress={() => setAddModalVisible(!addModalVisible)}>
                                    {({pressed}) => (
                                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                                            Close
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={removeModalVisible}
                        onRequestClose={() => {
                            setRemoveModalVisible(!removeModalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalViewRemove}>
                                <Text style={styles.modalTitle}>Remove Munro</Text>
                                <ScrollView>
                                    {responseData.map((data, key) =>
                                        <CustomButton
                                            key={key}
                                            text={data.mountainName}
                                            type={"REMOVE"}
                                            style={styles.remove}
                                            onPress={() => {
                                                removeMunroFromBag(data);
                                                setRemoveModalVisible(!removeModalVisible);
                                            }}
                                        />
                                    )}
                                </ScrollView>
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button, styles.buttonClose]}
                                    onPress={() => setRemoveModalVisible(!removeModalVisible)}>
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
            <View style={styles.circleButtonContainer}>
                <CircleButton
                    size={50}
                    primaryColor="#459186"
                    secondaryColor="#41727E"
                    onPressButtonRight={() => setAddModalVisible(!addModalVisible)}
                    onPressButtonLeft={() => setRemoveModalVisible(!removeModalVisible)}
                    iconButtonRight={Add}
                    iconButtonLeft={Minus}
                    iconButtonTop={Blank}
                    iconButtonBottom={Blank}
                />
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 10,
    },
    modalView: {
        margin: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalViewRemove: {
        margin: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: Dimensions.get('window').height * 0.45,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 5,
    },
    buttonClose: {
        marginTop: 15,
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalTitle: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: "bold",
        color: '#459186',
        margin: 10,
        marginTop: -5,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
    },
    container: {
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: '#BBBBBBFF',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    label: {
        position: 'absolute',
        backgroundColor: '#EEEEEEFF',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
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
    progress: {
        alignSelf: 'center',
        backgroundColor: 'white',
        marginBottom: 15,
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
    },
    buttonContainer: {
        height: Dimensions.get('window').height * 0.65,
    },
    circleButtonContainer: {
        position: "absolute",
        bottom: 140,
    },
});

export default MunroBaggingScreen;
