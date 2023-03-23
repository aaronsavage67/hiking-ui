import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View,} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";

const ListOfMunrosScreen = () => {
    const baseUrl = "http://localhost:8080";
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [filterSelected, setFilterSelected] = useState(true);
    const [searchSelected, setSearchSelected] = useState(true);

    useEffect(() => {
        fetch(`${baseUrl}/hiking/getAllMountains`)
            .then((response) => response.json())
            .then((responseJson) => {
                setFilteredDataSource(responseJson);
                setMasterDataSource(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const getAllMountains = () => {
        axios.get(`${baseUrl}/hiking/getAllMountains`)
            .then((response) => {
                setFilteredDataSource(response.data);
                setMasterDataSource(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const getMountainsByRegion = (region) => {
        axios.get(`${baseUrl}/hiking/getMountainsByRegion?region=${region}`)
            .then((response) => {
                setFilteredDataSource(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    const ItemView = ({item}) => {
        return (
            <Text style={styles.itemStyle} onPress={() => getItem(item)}>
                {item.name}
            </Text>
        );
    };

    const ItemSeparatorView = () => {
        return (
            <View
                style={{
                    height: 2,
                    width: 325,
                    backgroundColor: '#168224',
                }}
            />
        );
    };

    const getItem = (item) => {
        navigation.navigate("Single Munro", {
            title: item.name,
            munroId: item.id,
            reload: true,
        })
    };

    const renderFilter = () => {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.root}>
                    <RNPickerSelect
                        style={pickerSelectStyles}
                        placeholder={{label: "All Regions", value: "all"}}
                        onValueChange={(region) => {
                            if (region === "all") {
                                setSearchSelected(true);
                                setFilterSelected(true);
                                getAllMountains();
                            } else {
                                setSearchSelected(false);
                                setFilterSelected(true);
                                getMountainsByRegion(region);
                            }
                        }}
                        items={[
                            {label: "Angus", value: "Angus"},
                            {label: "Argyll", value: "Argyll"},
                            {label: "Cairngorms", value: "Cairngorms"},
                            {label: "Fort William", value: "Fort William"},
                            {label: "Isle of Mull", value: "Isle of Mull"},
                            {label: "Isle of Skye", value: "Isle of Skye"},
                            {label: "Kintail", value: "Kintail"},
                            {label: "Loch Lomond", value: "Loch Lomond"},
                            {label: "Loch Ness", value: "Loch Ness"},
                            {label: "Perthshire", value: "Perthshire"},
                            {label: "Sutherland", value: "Sutherland"},
                            {label: "Torridon", value: "Torridon"},
                            {label: "Ullapool", value: "Ullapool"},
                        ]}
                    />
                    <View style={{height: Dimensions.get('window').height * 0.75}}>
                        <FlatList
                            data={filteredDataSource}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={ItemSeparatorView}
                            renderItem={ItemView}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    };

    const renderSearch = () => {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.root}>
                    <TextInput
                        style={styles.textInputStyle}
                        onChangeText={(text) => {
                            setSearchSelected(true);
                            setFilterSelected(false);
                            searchFilterFunction(text);
                            if (text === "") {
                                setFilterSelected(true);
                            }
                        }}
                        value={search}
                        underlineColorAndroid="transparent"
                        placeholder="Search"
                        clearButtonMode={"always"}
                    />
                    <View style={{height: Dimensions.get('window').height * 0.75}}>
                        <FlatList
                            data={filteredDataSource}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={ItemSeparatorView}
                            renderItem={ItemView}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    };

    const renderBoth = () => {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.root}>
                    <RNPickerSelect
                        style={pickerSelectStyles}
                        placeholder={{label: "All Regions", value: "all"}}
                        onValueChange={(region) => {
                            if (region === "all") {
                                setSearchSelected(true);
                                setFilterSelected(true);
                                getAllMountains();
                            } else {
                                setSearchSelected(false);
                                setFilterSelected(true);
                                getMountainsByRegion(region);
                            }
                        }}
                        items={[
                            {label: "Angus", value: "Angus"},
                            {label: "Argyll", value: "Argyll"},
                            {label: "Cairngorms", value: "Cairngorms"},
                            {label: "Fort William", value: "Fort William"},
                            {label: "Isle of Mull", value: "Isle of Mull"},
                            {label: "Isle of Skye", value: "Isle of Skye"},
                            {label: "Kintail", value: "Kintail"},
                            {label: "Loch Lomond", value: "Loch Lomond"},
                            {label: "Loch Ness", value: "Loch Ness"},
                            {label: "Perthshire", value: "Perthshire"},
                            {label: "Sutherland", value: "Sutherland"},
                            {label: "Torridon", value: "Torridon"},
                            {label: "Ullapool", value: "Ullapool"},
                        ]}
                    />
                    <TextInput
                        style={styles.textInputStyle}
                        onChangeText={(text) => {
                            setSearchSelected(true);
                            setFilterSelected(false);
                            searchFilterFunction(text);
                            if (text === "") {
                                setFilterSelected(true);
                            }
                        }}
                        value={search}
                        underlineColorAndroid="transparent"
                        placeholder="Search"
                        clearButtonMode={"always"}
                    />
                    <View style={{height: Dimensions.get('window').height * 0.68}}>
                        <FlatList
                            data={filteredDataSource}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={ItemSeparatorView}
                            renderItem={ItemView}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    };

    if (searchSelected && !filterSelected) {
        return renderSearch();
    } else if (filterSelected && !searchSelected) {
        return renderFilter();
    } else {
        return renderBoth();
    }
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: "#74CC56BE",
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    itemStyle: {
        padding: 20,
        fontSize: 20,
        alignSelf: 'center',
    },
    textInputStyle: {
        height: 50,
        width: 325,
        borderWidth: 2,
        paddingLeft: 20,
        margin: 10,
        borderColor: '#BBBBBBFF',
        borderRadius: 10,
        backgroundColor: '#EEEEEEFF',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 50,
        width: 325,
        borderWidth: 2,
        paddingLeft: 20,
        borderColor: '#BBBBBBFF',
        borderRadius: 10,
        backgroundColor: '#EEEEEEFF',
        marginLeft: 17,
    },
});


export default ListOfMunrosScreen;
