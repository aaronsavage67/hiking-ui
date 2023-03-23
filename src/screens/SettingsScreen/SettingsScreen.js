import React from 'react';
import {View, SafeAreaView, StyleSheet, Dimensions, Alert,} from 'react-native';
import CustomButton from "../../components/CustomButton";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";

const SettingsScreen = ({route}) => {
    const navigation = useNavigation();
    const baseUrl = "http://localhost:8080";

    const onChangePasswordPressed = () => {
        axios.post(`${baseUrl}/hiking/isUsernameActivated?username=${route.params.username}`)
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
                <CustomButton
                    text={"Change Password"}
                    type={"TERTIARY"}
                    onPress={onChangePasswordPressed}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: "#74CC56BE",
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
});

export default SettingsScreen;
