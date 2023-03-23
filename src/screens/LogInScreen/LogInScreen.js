import React from 'react';
import {View, Image, StyleSheet, Alert, Text, Dimensions, SafeAreaView} from 'react-native';
import Logo from '../../../assets/images/logo.png';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import {useNavigation} from "@react-navigation/native";
import {useForm} from 'react-hook-form';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogInScreen = () => {
    const navigation = useNavigation();
    const {control, handleSubmit} = useForm();
    const baseUrl = "http://localhost:8080";

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem("@credentials", JSON.stringify(value));
        } catch (e) {
            console.warn(e);
        }
    };

    const onLogInPressed = data => {

        storeData(data);

        axios.post(`${baseUrl}/hiking/validateLogin?username=${data.Username.trim()}&password=${data.Password.trim()}`)
            .then((response) => {
                if (response.data === true) {
                    console.log("login successful");
                    navigation.navigate("Home", {
                        username: data.Username,
                    });
                } else {
                    Alert.alert('Sorry!', 'The details entered are incorrect. Please try again',
                        [
                            {text: 'OK'},
                        ]);
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    console.log(error.response.data.message);
                    Alert.alert('Sorry!', 'You did not validate this account when you received an email. Please create a new account and validate',
                        [
                            {text: 'OK'},
                        ]);
                }
                if (error.response.status === 404) {
                    console.log(error.response.data.message);
                    Alert.alert('Sorry!', 'This account with this username does not exist. Please create a new account and validate',
                        [
                            {text: 'OK'},
                        ]);
                }
            });
    };

    const onForgotPasswordPressed = () => {
        navigation.navigate("Forgot Password");
    };

    const onSignUpPressed = () => {
        navigation.navigate("Sign Up");
    };

    return (
        <SafeAreaView>
            <View style={styles.root}>
                <Text style={styles.title}>Hiking App</Text>
                <Image
                    source={Logo}
                    style={styles.logo}
                    resizeMode={"contain"}
                />
                <CustomInput
                    name={"Username"}
                    placeholder={"Username"}
                    control={control}
                    rules={{required: 'Username is required'}}
                />
                <CustomInput
                    name={"Password"}
                    placeholder={"Password"}
                    secureTextEntry={true}
                    control={control}
                    rules={{required: 'Password is required'}}
                />
                <CustomButton
                    text={"Log In"}
                    onPress={handleSubmit(onLogInPressed)}
                />
                <CustomButton
                    text={"Forgot Password?"}
                    onPress={onForgotPasswordPressed}
                    type={"TERTIARY"}
                />
                <CustomButton
                    text={"Don't have an account? Create one"}
                    onPress={onSignUpPressed}
                    type={"TERTIARY"}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: "#74CC56BE",
        justifyContent: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 200,
        marginVertical: 20,
    },
    title: {
        fontSize: 65,
        fontWeight: "bold",
        color: '#168224',
        margin: 10,
        marginTop: -125,
        textShadowColor: '#3d3d3d',
        shadowOffset: {
            width: 1,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4.5,
    },
});

export default LogInScreen;
