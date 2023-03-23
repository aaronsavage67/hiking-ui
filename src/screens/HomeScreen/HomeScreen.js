import React from 'react';
import {View, StyleSheet, Text, Dimensions, SafeAreaView, Image, Pressable,} from 'react-native';
import CustomButton from "../../components/CustomButton";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CarouselCards from "../../components/CarouselCards";
import SignOut from "../../../assets/images/signOut.png";
import Settings from "../../../assets/images/settings.png";

const HomeScreen = ({route}) => {
    const navigation = useNavigation();
    let username = null;

    const onLogInPressed = () => {
        navigation.navigate('Log In');
    };

    const onSettingsPressed = async () => {
        try {
            const value = await AsyncStorage.getItem('@credentials');
            username = JSON.parse(value);
        } catch (error) {
            console.log(error);
        }

        navigation.navigate('Settings', {
            username: username.Username,
        });
    };

    const onListOfMunrosPressed = () => {
        navigation.navigate('List of Munros');
    };

    const onMunroBaggingPressed = async () => {
        try {
            const value = await AsyncStorage.getItem('@credentials');
            username = JSON.parse(value);
        } catch (error) {
            console.log(error);
        }

        navigation.navigate('Munro Bagging', {
            reload: true,
            username: username.Username,
        });
    };

    const onClimbWithMePressed = async () => {
        try {
            const value = await AsyncStorage.getItem('@credentials');
            username = JSON.parse(value);
        } catch (error) {
            console.log(error);
        }

        navigation.navigate('Climb With Me', {
            reload: true,
            username: username.Username,
        });
    };

    const onReviewsPressed = async () => {
        try {
            const value = await AsyncStorage.getItem('@credentials');
            username = JSON.parse(value);
        } catch (error) {
            console.log(error);
        }

        navigation.navigate('Reviews', {
            reload: true,
            username: username.Username,
        });
    };

    return (
        <SafeAreaView>
            <View style={styles.root}>
                <Text style={styles.title}>Hiking App</Text>
                <Text style={styles.text}>Welcome {route.params.username}</Text>
                <CarouselCards/>
                <View style={styles.buttons}>
                    <CustomButton
                        text={"List of Munro's"}
                        onPress={onListOfMunrosPressed}
                    />
                    <CustomButton
                        text={"Munro Bagging"}
                        onPress={onMunroBaggingPressed}
                    />
                    <CustomButton
                        text={"Climb With Me"}
                        onPress={onClimbWithMePressed}
                    />
                    <CustomButton
                        text={"Reviews"}
                        onPress={onReviewsPressed}
                    />
                </View>
                <View style={styles.iconLeft}>
                    <Pressable onPress={onLogInPressed}>
                        <Image
                            source={SignOut}
                            style={styles.signOut}
                            resizeMode={"contain"}
                        />
                    </Pressable>
                </View>
                <View style={styles.iconRight}>
                    <Pressable onPress={onSettingsPressed}>
                        <Image
                            source={Settings}
                            style={styles.settings}
                            resizeMode={"contain"}
                        />
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
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
    },
    text: {
        fontSize: 24,
        margin: 10,
        marginBottom: 20,
    },
    buttons: {
        width: '100%',
        marginTop: -500,
    },
    signOut: {
        width: 40,
        height: 40,
    },
    settings: {
        width: 40,
        height: 40,
    },
    iconLeft: {
        position: "absolute",
        bottom: 105,
        left: 20,
    },
    iconRight: {
        position: "absolute",
        bottom: 105,
        right: 20,
    },
});

export default HomeScreen;
