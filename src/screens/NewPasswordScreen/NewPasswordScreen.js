import React from 'react';
import {View, StyleSheet, Text, Alert, Dimensions, SafeAreaView,} from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import {useNavigation} from "@react-navigation/native";
import {useForm} from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const NewPasswordScreen = () => {
    const navigation = useNavigation();
    const {control, handleSubmit, watch} = useForm();
    const password = watch("NewPassword");
    const baseUrl = "http://localhost:8080";
    let resetPasswordUsername = null;

    const onSubmitPressed = async data => {

        try {
            const value = await AsyncStorage.getItem('@credentials');
            resetPasswordUsername = JSON.parse(value);
        } catch (error) {
            console.log(error);
        }

        axios.post(`${baseUrl}/hiking/resetPassword?username=${resetPasswordUsername.Username}&newPassword=${data.NewPassword.trim()}&code=${data.Code.trim()}`)
            .then(() => {
                console.log("password reset");
                navigation.navigate("Home", {
                    username: resetPasswordUsername.Username,
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

    const onLogInPressed = () => {
        navigation.navigate('Log In');
    };

    return (
        <SafeAreaView>
            <View style={styles.root}>
                <Text style={styles.title}>Reset your password</Text>
                <CustomInput
                    name={"Code"}
                    placeholder={"Code"}
                    control={control}
                    rules={{required: 'Code is required'}}
                />
                <CustomInput
                    name={"NewPassword"}
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
                    name={"RepeatNewPassword"}
                    placeholder={"Repeat New Password"}
                    secureTextEntry={true}
                    control={control}
                    rules={{
                        required: 'Repeat Password is required',
                        validate: value =>
                            value === password || 'Passwords do not match',
                    }}
                />
                <CustomButton
                    text={"Submit"}
                    onPress={handleSubmit(onSubmitPressed)}
                />
                <CustomButton
                    text={"Back to Log In"}
                    onPress={onLogInPressed}
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

export default NewPasswordScreen;
