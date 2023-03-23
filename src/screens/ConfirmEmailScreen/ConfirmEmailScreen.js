import React from 'react';
import {View, StyleSheet, Text, Alert, Dimensions, SafeAreaView,} from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import {useNavigation} from "@react-navigation/native";
import {useForm} from "react-hook-form";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmEmailScreen = () => {
    const navigation = useNavigation();
    const {control, handleSubmit} = useForm();
    const baseUrl = "http://localhost:8080";
    let signUpUsername = null;

    const onConfirmPressed = async data => {

        try {
            const value = await AsyncStorage.getItem('@credentials');
            signUpUsername = JSON.parse(value);
        } catch (error) {
            console.log(error);
        }

        axios.post(`${baseUrl}/hiking/validateUserCode?username=${signUpUsername.Username}&code=${data.Code.trim()}`)
            .then(() => {
                console.log("verified user");
                navigation.navigate("Home", {
                    username: signUpUsername.Username,
                });
            })
            .catch((error) => {
                console.log(error.response.data.message);
                Alert.alert('Sorry!', 'The verification code you have entered is incorrect. Please try again',
                    [
                        {text: 'OK'},
                    ]);
            });
    };

    const onBackToLogInPressed = () => {
        navigation.navigate('Log In');
    };

    const onResendPressed = async () => {

        try {
            const value = await AsyncStorage.getItem('@credentials');
            signUpUsername = JSON.parse(value);
        } catch (error) {
            console.log(error);
        }

        axios.post(`${baseUrl}/hiking/resendCode?username=${signUpUsername.Username}`)
            .then(() => {
                console.log("code resent");
                Alert.alert('Code Resent!', 'The verification code has been resent to your email',
                    [
                        {text: 'OK'},
                    ]);
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    };

    const onGenerateNewCodePress = async () => {

        try {
            const value = await AsyncStorage.getItem('@credentials');
            signUpUsername = JSON.parse(value);
        } catch (error) {
            console.log(error);
        }

        axios.post(`${baseUrl}/hiking/generateNewCode?username=${signUpUsername.Username}`)
            .then(() => {
                console.log("generated new code and has been emailed");
                Alert.alert('New Code!', 'A new verification code has been sent to your email',
                    [
                        {text: 'OK'},
                    ]);
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    };

    return (
        <SafeAreaView>
            <View style={styles.root}>
                <Text style={styles.title}>Confirm your email</Text>
                <CustomInput
                    name={"Code"}
                    placeholder={"Enter your confirmation code"}
                    control={control}
                    rules={{required: 'Code is required'}}
                />
                <CustomButton
                    text={"Confirm"}
                    onPress={handleSubmit(onConfirmPressed)}
                />
                <CustomButton
                    text={"Resend code"}
                    onPress={onResendPressed}
                    type={"SECONDARY"}
                />
                <CustomButton
                    text={"Generate new code"}
                    onPress={onGenerateNewCodePress}
                    type={"SECONDARY"}
                />
                <CustomButton
                    text={"Back to Log In"}
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

export default ConfirmEmailScreen;
