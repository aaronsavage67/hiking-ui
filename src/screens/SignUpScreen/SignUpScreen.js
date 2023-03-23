import React from 'react';
import {View, StyleSheet, Text, Alert, Dimensions, SafeAreaView,} from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import {useNavigation} from "@react-navigation/native";
import {useForm} from "react-hook-form";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const SignUpScreen = () => {
    const navigation = useNavigation();
    const {control, handleSubmit, watch} = useForm();
    const password = watch("Password");
    const baseUrl = "http://localhost:8080";

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem("@credentials", JSON.stringify(value));
        } catch (e) {
            console.warn(e);
        }
    }

    const onBackToLogInPressed = () => {
        navigation.navigate("Log In");
    }

    const onRegisterPressed = data => {

        storeData(data);

        axios.post(`${baseUrl}/hiking/createUser?username=${data.Username.trim()}&password=${data.Password.trim()}&email=${data.Email.trim()}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log("unique");
                    navigation.navigate("Confirm Email");
                }
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    console.log(error.response.data.message);
                    Alert.alert('Sorry!', 'You have chosen a username that already exists. Please try again',
                        [
                            {text: 'OK'},
                        ]);
                }
            });
    }

    return (
        <SafeAreaView>
            <View style={styles.root}>
                <Text style={styles.title}>Create an account</Text>
                <CustomInput
                    name={"Username"}
                    placeholder={"Username"}
                    control={control}
                    rules={{
                        required: 'Username is required',
                        minLength: {
                            value: 3,
                            message: 'Username should be at least 3 characters long',
                        },
                        maxLength: {
                            value: 20,
                            message: 'Username should be max 20 characters long',
                        },
                    }}
                />
                <CustomInput
                    name={"Email"}
                    placeholder={"Email"}
                    control={control}
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: EMAIL_REGEX,
                            message: 'Email is invalid'
                        }
                    }}
                />
                <CustomInput
                    name={"Password"}
                    placeholder={"Password"}
                    secureTextEntry={true}
                    control={control}
                    rules={{
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password should be at least 6 characters long',
                        },
                    }}
                />
                <CustomInput
                    name={"RepeatPassword"}
                    placeholder={"Repeat Password"}
                    secureTextEntry={true}
                    control={control}
                    rules={{
                        required: 'Repeat Password is required',
                        validate: value =>
                            value === password || 'Passwords do not match',
                    }}
                />
                <CustomButton
                    text={"Register"}
                    onPress={handleSubmit(onRegisterPressed)}
                />
                <CustomButton
                    text={"Have an account? Log In"}
                    onPress={onBackToLogInPressed}
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
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    title: {
        fontSize: 34,
        fontWeight: "bold",
        color: '#168224',
        margin: 10,
    },
});

export default SignUpScreen;
