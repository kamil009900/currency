import React, {useCallback, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CountrySelect from './Components/CountrySelect';
import CurrencyInput from './Components/CurrencyInput';
import SwitchButton from './Components/SwitchButton';
import {Country} from './Interfaces';
import {MenuProvider} from 'react-native-popup-menu';
import useLayout from './Hooks/useLayout';
import Colors from './Utils/Colors';
import {DefaultFromCountry, DefaultToCountry} from './Utils/Countries';

const App = () => {
    const [fromCurrency, setFromCurrency] = useState<Country>(DefaultFromCountry);
    const [toCurrency, setToCurrency] = useState<Country>(DefaultToCountry);
    const [fromValue, setFromValue] = useState(1);
    const [toValue, setToValue] = useState(1);
    const [vis, setVis] = useState(false);
    const {width: switchWidth, onLayout} = useLayout();

    const onSwitch = useCallback(() => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }, [fromCurrency, toCurrency]);

    const convertDisabled = useMemo(
        () => !fromCurrency || !toCurrency || !fromValue,
        [fromCurrency, toCurrency, fromValue],
    );

    return (
        <MenuProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.topBox}>
                        <CountrySelect title="FROM:" onPress={setFromCurrency} selectedCountry={fromCurrency} />
                        <View onLayout={onLayout}>
                            <SwitchButton onPress={onSwitch} />
                        </View>
                        <CountrySelect title="TO:" onPress={setToCurrency} selectedCountry={toCurrency} />
                    </View>
                    <View style={styles.bottomBox}>
                        <View style={styles.currencyInputWrapper}>
                            <CurrencyInput
                                currencyCode={fromCurrency.code}
                                title="AMOUNT:"
                                value={fromValue}
                                onValueChange={setFromValue}
                            />
                        </View>
                        {vis && <View style={{width: switchWidth}} />}
                        {vis && (
                            <View style={styles.currencyInputWrapper}>
                                <CurrencyInput
                                    currencyCode={toCurrency.code}
                                    title="TO:"
                                    value={toValue}
                                    onValueChange={setToValue}
                                />
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        disabled={convertDisabled}
                        onPress={() => setVis((visi) => !visi)}
                        style={{
                            ...styles.convertButton,
                            backgroundColor: convertDisabled ? Colors.disabled : '#67d259',
                        }}>
                        <Text style={styles.convertText}>Convert</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </MenuProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        height: '100%',
    },
    safeArea: {
        backgroundColor: 'white',
    },
    topBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomBox: {
        marginTop: 20,
        flexDirection: 'row',
    },
    currencyInputWrapper: {
        flex: 1,
    },
    convertButton: {
        backgroundColor: '#67d259',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 30,
    },
    convertText: {
        color: 'white',
    },
});

export default App;
