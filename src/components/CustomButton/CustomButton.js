import React from 'react';
import {Text, StyleSheet, Pressable,} from 'react-native';

const CustomButton = ({onPress, text, type = "PRIMARY"}) => {
    return (
        <Pressable onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
            {({pressed}) => (
                <Text style={[{color: pressed ? 'white' : '#1e1e1e'}, styles.text, styles[`text_${type}`]]}>
                    {text}
                </Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 350,
        padding: 12,
        marginVertical: 5,
        alignItems: "center",
        borderRadius: 10,
    },
    container_PRIMARY: {
        backgroundColor: '#168224',
        borderColor: '#11601b',
        borderWidth: 2,
    },
    container_SECONDARY: {
        backgroundColor: '#CBCBCBFF',
        borderColor: '#168224',
        borderWidth: 2,
    },
    container_REMOVE: {
        borderColor: '#A62222FF',
        borderWidth: 2,
        backgroundColor: '#D76767FF',
        width: '100%',
    },
    container_PRESENT: {
        backgroundColor: '#b49828',
        borderColor: '#6b5c19',
        borderWidth: 2,
    },
    container_TERTIARY: {
        borderColor: '#939393',
        borderWidth: 2,
        backgroundColor: '#CBCBCBFF',
    },
    text: {
        fontWeight: "bold",
        fontSize: 15,
    },
    text_SECONDARY: {
        fontSize: 15,
    },
    text_REMOVE: {
        fontSize: 15,
    },
    text_TERTIARY: {
        fontSize: 15,
    }
});

export default CustomButton;
