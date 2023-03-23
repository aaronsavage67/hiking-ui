import React, {useState} from 'react'
import {Alert, Dimensions, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native'
import axios from "axios";
import CustomButton from "../../components/CustomButton";
import {Dropdown} from "react-native-element-dropdown";
import CalendarPicker from "react-native-calendar-picker";

let newMunro = null;

const ClimbWithMeScreen = ({route}) => {
    const baseUrl = "http://localhost:8080";
    let [responseData, setResponseData] = React.useState([]);
    let [listResponseData, setListResponseData] = React.useState([]);
    const [tripAddModalVisible, setTripAddModalVisible] = useState(false);
    const [tripRemoveModalVisible, setTripRemoveModalVisible] = useState(false);
    const [createTripModalVisible, setCreateTripModalVisible] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const today = new Date();
    let dd = String(today.getDate());
    let mm = String(today.getMonth());
    let yyyy = String(today.getFullYear());
    let formattedDate = new Date(yyyy, mm, dd);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    if (route.params.reload === true) {
        axios.get(`${baseUrl}/hiking/getAllTrips`)
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

    const onMunroChange = (munro) => {
        newMunro = munro;
    };

    const addUserToTrip = (modalData) => {

        axios.post(`${baseUrl}/hiking/addUserToTrip?username=${route.params.username}`,
            {
                id: modalData.id,
                mountainId: modalData.mountainId,
                mountainName: modalData.mountainName,
                date: modalData.date
            })
            .then((response) => {
                setResponseData(response.data);
                setTripAddModalVisible(!tripAddModalVisible);
                Alert.alert('Joined Trip!',
                    [
                        {text: 'OK'},
                    ]);
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    console.log(error.response.data.message);
                    Alert.alert('Sorry!', 'You have already joined this trip.',
                        [
                            {text: 'OK'},
                        ]);
                }
            });
    };

    const removeUserFromTrip = (modalData) => {

        axios.post(`${baseUrl}/hiking/removeUserFromTrip?username=${route.params.username}`,
            {
                id: modalData.id,
                mountainId: modalData.mountainId,
                mountainName: modalData.mountainName,
                date: modalData.date
            })
            .then(() => {
                axios.get(`${baseUrl}/hiking/getAllTrips`)
                    .then((response) => {
                        setResponseData(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                setTripRemoveModalVisible(!tripRemoveModalVisible);
                Alert.alert('Left Trip!',
                    [
                        {text: 'OK'},
                    ]);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const createTrip = () => {
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        if (formattedDate.toString() === today.toString()) {
            onDateChange(formattedDate);
        }

        axios.post(`${baseUrl}/hiking/createTrip?username=${route.params.username}`,
            {
                mountainId: newMunro.id,
                mountainName: newMunro.name,
                date: formattedDate
            })
            .then((response) => {
                setResponseData(response.data);
                setCreateTripModalVisible(!createTripModalVisible);
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    console.log(error.response.data.message);
                    Alert.alert('Sorry!', 'This trip already exists',
                        [
                            {text: 'OK'},
                        ]);
                }
            });
    };

    const openTripAddModal = (data) => {
        setModalData(data);
        setTripAddModalVisible(!tripAddModalVisible);
    };

    const openTripRemoveModal = (data) => {
        setModalData(data);
        setTripRemoveModalVisible(!tripRemoveModalVisible);
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
        const sortedData = [...data].sort((a, b) => new Date(...a.date.split('/').reverse())
            - new Date(...b.date.split('/').reverse()));
        setResponseData(sortedData);
    };

    const orderDateDescending = (data) => {
        const sortedData = [...data].sort((a, b) => new Date(...b.date.split('/').reverse())
            - new Date(...a.date.split('/').reverse()));
        setResponseData(sortedData);
    };

    const orderAlphabeticallyAscending = (data) => {
        const sortedData = [...data].sort((a, b) => a.mountainName.localeCompare(b.mountainName))
        setResponseData(sortedData);
    };

    const orderAlphabeticallyDescending = (data) => {
        const sortedData = [...data].sort((a, b) => b.mountainName.localeCompare(a.mountainName))
        setResponseData(sortedData);
    };

    return (
        <View style={styles.root}>
            <View style={styles.orderButtonsContainer}>
                <Pressable
                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.orderButtons]}
                    onPress={() => orderDateAscending(responseData)}
                >
                    {({pressed}) => (
                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                            Date Asc
                        </Text>
                    )}
                </Pressable>
                <Pressable
                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.orderButtons]}
                    onPress={() => orderDateDescending(responseData)}
                >
                    {({pressed}) => (
                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                            Date Desc
                        </Text>
                    )}
                </Pressable>
                <Pressable
                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.orderButtons]}
                    onPress={() => orderAlphabeticallyAscending(responseData)}
                >
                    {({pressed}) => (
                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                            A to Z
                        </Text>
                    )}
                </Pressable>
                <Pressable
                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.orderButtons]}
                    onPress={() => orderAlphabeticallyDescending(responseData)}
                >
                    {({pressed}) => (
                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                            Z to A
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
                    {responseData.map((data, key) => {
                            let present = false;
                            data.usernames.forEach(user => {
                                if (user === route.params.username) {
                                    present = true;
                                }
                            });
                            if (present === true) {
                                return (
                                    <CustomButton
                                        key={key}
                                        text={data.mountainName + " on " + data.date}
                                        type={"PRESENT"}
                                        onPress={() => {
                                            let present = false;
                                            data.usernames.forEach(user => {
                                                if (user === route.params.username) {
                                                    present = true;
                                                }
                                            });
                                            if (present === true) {
                                                openTripRemoveModal(data);
                                            } else {
                                                openTripAddModal(data);
                                            }
                                        }}
                                    />
                                );
                            } else {
                                return (
                                    <CustomButton
                                        key={key}
                                        text={data.mountainName + " on " + data.date}
                                        type={"SECONDARY"}
                                        onPress={() => {
                                            let present = false;
                                            data.usernames.forEach(user => {
                                                if (user === route.params.username) {
                                                    present = true;
                                                }
                                            });
                                            if (present === true) {
                                                openTripRemoveModal(data);
                                            } else {
                                                openTripAddModal(data);
                                            }
                                        }}
                                    />
                                );
                            }
                        }
                    )}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={tripAddModalVisible}
                        onRequestClose={() => {
                            setTripAddModalVisible(!tripAddModalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.modalTitle}>Munro: </Text>
                                    <Text style={styles.modalText}>{modalData.mountainName}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.modalTitle}>Date: </Text>
                                    <Text style={styles.modalText}>{modalData.date}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.modalTitle}>Participants: </Text>
                                    <ScrollView>
                                        <Text style={styles.modalText}>
                                            {
                                                modalData && modalData.usernames && modalData.usernames.map((data, index) => (
                                                    <Text key={index}>{data} {'\n'}</Text>
                                                ))
                                            }
                                        </Text>
                                    </ScrollView>
                                </View>
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button]}
                                    onPress={() => {
                                        addUserToTrip(modalData);
                                    }}
                                >
                                    {({pressed}) => (
                                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                                            Join
                                        </Text>
                                    )}
                                </Pressable>
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button]}
                                    onPress={() => setTripAddModalVisible(!tripAddModalVisible)}
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
                        visible={tripRemoveModalVisible}
                        onRequestClose={() => {
                            setTripRemoveModalVisible(!tripRemoveModalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.modalTitle}>Munro: </Text>
                                    <Text style={styles.modalText}>{modalData.mountainName}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.modalTitle}>Date: </Text>
                                    <Text style={styles.modalText}>{modalData.date}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.modalTitle}>Participants: </Text>
                                    <ScrollView>
                                        <Text style={styles.modalText}>
                                            {
                                                modalData && modalData.usernames && modalData.usernames.map((data, index) => (
                                                    <Text key={index}>{data} {'\n'}</Text>
                                                ))
                                            }
                                        </Text>
                                    </ScrollView>
                                </View>
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#a62222' : '#880e0e'}, styles.button]}
                                    onPress={() => {
                                        removeUserFromTrip(modalData);
                                    }}
                                >
                                    {({pressed}) => (
                                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                                            Leave
                                        </Text>
                                    )}
                                </Pressable>
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button]}
                                    onPress={() => setTripRemoveModalVisible(!tripRemoveModalVisible)}
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
                        visible={createTripModalVisible}
                        onRequestClose={() => {
                            setCreateTripModalVisible(!createTripModalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>Create Trip</Text>
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
                                    minDate={new Date(yyyy, mm, dd)}
                                    maxDate={new Date(2030, 12, 31)}
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
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button]}
                                    onPress={() => {
                                        if (formattedDate === null || newMunro === null) {
                                            Alert.alert('Sorry!', 'Please enter all details to create a trip.',
                                                [
                                                    {text: 'OK'},
                                                ]);
                                        } else {
                                            createTrip();
                                            setCreateTripModalVisible(!createTripModalVisible);
                                        }
                                    }}>
                                    {({pressed}) => (
                                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.textStyle]}>
                                            Create
                                        </Text>
                                    )}
                                </Pressable>
                                <Pressable
                                    style={({pressed}) => [{backgroundColor: pressed ? '#55bbab' : '#459186'}, styles.button]}
                                    onPress={() => setCreateTripModalVisible(!createTripModalVisible)}>
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
                    onPress={() => setCreateTripModalVisible(!createTripModalVisible)}
                >
                    {({pressed}) => (
                        <Text style={[{color: pressed ? 'black' : 'white'}, styles.createTextStyle]}>
                            Create Trip
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
        //alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ClimbWithMeScreen;
