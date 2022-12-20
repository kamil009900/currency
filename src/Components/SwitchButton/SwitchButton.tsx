import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
    onPress: () => void;
}

const SwitchButton = ({onPress}: Props) => (
    <TouchableOpacity onPress={onPress} style={styles.iconWrapper}>
        <Icon name="compare-arrows" size={40} color="blue" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    iconWrapper: {
        width: 40,
        marginTop: 10,
        marginHorizontal: 20,
    },
});

export default SwitchButton;
