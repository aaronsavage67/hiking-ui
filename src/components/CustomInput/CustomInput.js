import React from 'react';
import {View, Text, TextInput, StyleSheet,} from 'react-native';
import {Controller} from "react-hook-form";

const CustomInput = ({control, name, rules = {}, placeholder, secureTextEntry}) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <>
                    <View style={[styles.container, {borderColor: error ? 'red' : '#BBBBBBFF'}]}>
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            style={[styles.input,]}
                            secureTextEntry={secureTextEntry}
                            clearButtonMode={'while-editing'}
                        />
                    </View>
                    {error && (
                        <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                    )}
                </>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: '#BBBBBBFF',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 5,
    },
    input: {
        fontSize: 15,
    },
});

export default CustomInput;
