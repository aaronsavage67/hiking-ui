import React from 'react';
import {View, StyleSheet, Text, Alert, Dimensions, SafeAreaView,} from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import {useNavigation} from "@react-navigation/native";
import {useForm} from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const {control, handleSubmit} = useForm();
    const baseUrl = "http://localhost:8080";
    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem("@credentials", JSON.stringify(value));
        } catch (e) {
            console.warn(e);
        }
    }

    const onLogInPressed = () => {
        navigation.navigate('Log In');
    };

    const onResetPasswordPressed = async (data) => {

        storeData(data);

        axios.post(`${baseUrl}/hiking/isUsernameActivated?username=${data.Username.trim()}`)
            .then((response) => {
                if (response.status === 200) {
                    navigation.navigate('New Password');
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    console.log(error.response.data.message);
                    Alert.alert('Sorry!', 'You have chosen a username that is not activated. Please create a new account',
                        [
                            {text: 'OK'},
                        ]);
                } else if (error.response.status === 404) {
                    console.log(error.response.data.message);
                    Alert.alert('Sorry!', 'This account does not exist. Please try again',
                        [
                            {text: 'OK'},
                        ]);
                }
            });
    };

    return (
        <SafeAreaView>
            <View style={styles.root}>
                <Text style={styles.title}>Reset your password</Text>
                <CustomInput
                    name={"Username"}
                    placeholder={"Username"}
                    control={control}
                    rules={{required: 'Username is required'}}
                />
                <CustomButton
                    text={"Send"}
                    onPress={handleSubmit(onResetPasswordPressed)}
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

export default ForgotPasswordScreen;
