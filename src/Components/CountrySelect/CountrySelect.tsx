import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View, ListRenderItemInfo, Image} from 'react-native';
import {Country} from '../../Interfaces';
import Colors from '../../Utils/Colors';
import Countries from '../../Utils/Countries';
import {Menu, MenuOptions, MenuTrigger, renderers} from 'react-native-popup-menu';
import useLayout from '../../Hooks/useLayout';

interface Props {
    title: string;
    onPress: (country: Country) => void;
    selectedCountry?: Country;
}

const CountrySelect = ({title, onPress, selectedCountry}: Props) => {
    const [listVisible, setListVisible] = useState(false);

    const {width: inputWidth, onLayout} = useLayout();

    const renderCountry = useCallback(
        ({item}: ListRenderItemInfo<Country>) => (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.listCountry}
                onPress={() => {
                    onPress(item);
                    setListVisible(false);
                }}>
                <Image style={styles.flagList} source={{uri: `data:image/png;base64,${item.flag}`}} />
                <Text>{item.code}</Text>
            </TouchableOpacity>
        ),
        [onPress],
    );

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.inputContainer}>
                <Menu
                    renderer={renderers.NotAnimatedContextMenu}
                    opened={listVisible}
                    onBackdropPress={() => setListVisible(false)}>
                    <MenuTrigger onPress={() => setListVisible(true)}>
                        <View style={styles.clickable} onLayout={onLayout}>
                            {selectedCountry && (
                                <View style={styles.inputWrapper}>
                                    <Image
                                        style={styles.inputFlag}
                                        source={{uri: `data:image/png;base64,${selectedCountry.flag}`}}
                                    />
                                    <Text style={styles.inputCode}>{selectedCountry.code}</Text>
                                </View>
                            )}
                        </View>
                    </MenuTrigger>
                    <MenuOptions
                        optionsContainerStyle={{
                            marginTop: 30,
                            width: inputWidth,
                        }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            renderItem={renderCountry}
                            data={Countries}
                        />
                    </MenuOptions>
                </Menu>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
    },
    inputContainer: {
        paddingTop: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
    },
    title: {
        color: Colors.text,
        fontWeight: '600',
    },
    inputFlag: {
        width: 30,
        height: 20,
        borderRadius: 3,
        marginRight: 10,
        borderColor: Colors.border,
        borderWidth: 1,
    },
    inputCode: {
        fontSize: 20,
        top: -2,
    },
    listCountry: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: Colors.border,
        borderBottomWidth: 1,
        backgroundColor: 'white',
    },
    list: {
        height: 175,
        flexGrow: 0,
        borderColor: Colors.border,
        borderBottomWidth: 1,
    },
    listContent: {
        borderColor: Colors.border,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
    },
    flagList: {
        width: 40,
        height: 30,
        borderRadius: 3,
        marginRight: 10,
        borderColor: Colors.border,
        borderWidth: 1,
    },
    clickable: {
        borderBottomColor: Colors.border,
        borderBottomWidth: 2,
        height: 30,
        paddingBottom: 5,
        flexDirection: 'row',
    },
});

export default CountrySelect;
