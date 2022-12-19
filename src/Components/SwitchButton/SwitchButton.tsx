import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

interface Props {
    onPress: () => void;
}

const SwitchButton = ({onPress}: Props) => (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.icon} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30,
        borderWidth: 5,
        borderColor: 'red',
        marginHorizontal: 20,
    },
});

export default SwitchButton;
