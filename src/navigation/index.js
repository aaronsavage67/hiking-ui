import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LogInScreen from "../screens/LogInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ConfirmEmailScreen from "../screens/ConfirmEmailScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import NewPasswordScreen from "../screens/NewPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import ListOfMunrosScreen from "../screens/ListOfMunrosScreen";
import MunroBaggingScreen from "../screens/MunroBaggingScreen";
import ClimbWithMeScreen from "../screens/ClimbWithMeScreen";
import SingleMunroScreen from "../screens/SingleMunroScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ReviewsScreen from "../screens/ReviewsScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name={"Log In"}
                    component={LogInScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name={"Sign Up"}
                    component={SignUpScreen}
                />
                <Stack.Screen
                    name={"Confirm Email"}
                    component={ConfirmEmailScreen}
                />
                <Stack.Screen
                    name={"Forgot Password"}
                    component={ForgotPasswordScreen}
                />
                <Stack.Screen
                    name={"New Password"}
                    component={NewPasswordScreen}
                />
                <Stack.Screen
                    name={"Home"}
                    component={HomeScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name={"Settings"}
                    component={SettingsScreen}
                />
                <Stack.Screen
                    name={"List of Munros"}
                    component={ListOfMunrosScreen}
                />
                <Stack.Screen
                    name={"Single Munro"}
                    component={SingleMunroScreen}
                    options={({route}) => ({title: route.params.title})}
                />
                <Stack.Screen
                    name={"Munro Bagging"}
                    component={MunroBaggingScreen}
                />
                <Stack.Screen
                    name={"Climb With Me"}
                    component={ClimbWithMeScreen}
                />
                <Stack.Screen
                    name={"Reviews"}
                    component={ReviewsScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
