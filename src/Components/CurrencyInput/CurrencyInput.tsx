import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CurrencyInputLib from 'react-native-currency-input';
import Colors from '../../Utils/Colors';

interface Props {
    onValueChange: (value: number) => void;
    value: number;
    title: string;
    currencyCode: string;
}

const CurrencyInput = ({title, value, onValueChange, currencyCode}: Props) => {
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            <CurrencyInputLib
                delimiter="."
                separator="."
                precision={2}
                style={styles.input}
                value={value}
                onChangeValue={onValueChange}
                maxLength={15}
            />
            <Text style={styles.currencyCode}>{currencyCode}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        color: Colors.text,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10,
    },
    input: {
        fontSize: 20,
        paddingBottom: 5,
        paddingRight: 40,
        borderBottomColor: Colors.border,
        borderBottomWidth: 2,
    },
    currencyCode: {
        color: Colors.text,
        fontWeight: '600',
        position: 'absolute',
        right: 0,
        bottom: 10,
    },
});

export default CurrencyInput;
