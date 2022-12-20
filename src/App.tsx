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
import axios, {CancelTokenSource} from 'axios';

let previousRequestToken: CancelTokenSource;
let timer: ReturnType<typeof setTimeout>;

interface ConvertInterface {
    from: string;
    to: string;
    amount: number;
    reversed?: boolean;
}

const App = () => {
    const [fromCurrency, setFromCurrency] = useState<Country>(DefaultFromCountry);
    const [toCurrency, setToCurrency] = useState<Country>(DefaultToCountry);
    const [fromValue, setFromValue] = useState(1);
    const [toValue, setToValue] = useState(0);
    const [ratesFetched, setRatesFetched] = useState(false);
    const [err, setErr] = useState('');
    const {width: switchWidth, onLayout} = useLayout();

    const convertDisabled = useMemo(
        () => !fromCurrency || !toCurrency || !fromValue,
        [fromCurrency, toCurrency, fromValue],
    );

    const onConvert = useCallback(({from, to, amount, reversed = false}: ConvertInterface) => {
        const fetchRates = async () => {
            try {
                setErr('');
                if (typeof previousRequestToken !== typeof undefined) {
                    previousRequestToken.cancel();
                }
                previousRequestToken = axios.CancelToken.source();
                const result = await axios.get('https://my.transfergo.com/api/fx-rates', {
                    params: {
                        from,
                        to,
                        amount,
                    },
                });
                const calculatedAmount = result.data.toAmount;
                if (reversed) {
                    setFromValue(calculatedAmount);
                } else {
                    setToValue(calculatedAmount);
                }
                setRatesFetched(true);
            } catch (e) {
                setErr('Something went wrong, please make sure amounts are not too small.');
            }
        };
        fetchRates();
    }, []);

    const debouncedConvert = useCallback(
        (params: ConvertInterface) => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                onConvert(params);
            }, 300);
        },
        [onConvert],
    );

    const onSwitch = useCallback(() => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        debouncedConvert({from: toCurrency.code, to: fromCurrency.code, amount: fromValue});
    }, [fromCurrency, toCurrency, fromValue, debouncedConvert]);

    return (
        <MenuProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.topBox}>
                        <CountrySelect
                            title="FROM:"
                            onPress={(value) => {
                                setFromCurrency(value);
                                debouncedConvert({
                                    from: value.code,
                                    to: toCurrency.code,
                                    amount: fromValue,
                                });
                            }}
                            selectedCountry={fromCurrency}
                        />
                        <View onLayout={onLayout}>
                            <SwitchButton onPress={onSwitch} />
                        </View>
                        <CountrySelect
                            title="TO:"
                            onPress={(value) => {
                                setToCurrency(value);
                                debouncedConvert({
                                    from: fromCurrency.code,
                                    to: value.code,
                                    amount: fromValue,
                                });
                            }}
                            selectedCountry={toCurrency}
                        />
                    </View>
                    <View style={styles.bottomBox}>
                        <View style={styles.currencyInputWrapper}>
                            <CurrencyInput
                                currencyCode={fromCurrency.code}
                                title="AMOUNT:"
                                value={fromValue}
                                onValueChange={(value) => {
                                    setFromValue(value);
                                    debouncedConvert({
                                        from: fromCurrency.code,
                                        to: toCurrency.code,
                                        amount: value,
                                    });
                                }}
                            />
                        </View>
                        {ratesFetched && <View style={{width: switchWidth}} />}
                        {ratesFetched && (
                            <View style={styles.currencyInputWrapper}>
                                <CurrencyInput
                                    currencyCode={toCurrency.code}
                                    title="TO:"
                                    value={toValue}
                                    onValueChange={(value) => {
                                        setToValue(value);
                                        debouncedConvert({
                                            from: toCurrency.code,
                                            to: fromCurrency.code,
                                            amount: value,
                                            reversed: true,
                                        });
                                    }}
                                />
                            </View>
                        )}
                    </View>
                    {!ratesFetched && (
                        <TouchableOpacity
                            disabled={convertDisabled}
                            onPress={() =>
                                onConvert({
                                    from: fromCurrency.code,
                                    to: toCurrency.code,
                                    amount: fromValue,
                                })
                            }
                            style={{
                                ...styles.convertButton,
                                backgroundColor: convertDisabled ? Colors.disabled : '#67d259',
                            }}>
                            <Text style={styles.convertText}>Convert</Text>
                        </TouchableOpacity>
                    )}
                    {ratesFetched && (
                        <View style={styles.convertionRate}>
                            {err ? (
                                <Text style={styles.convertionRateText}>{err}</Text>
                            ) : (
                                <>
                                    <Text style={styles.convertionRateText}>
                                        {fromValue} {fromCurrency.code} = {toValue} {toCurrency.code}
                                    </Text>
                                    <Text style={styles.infoText}>
                                        All figures are live mid-market rates, which are for informational purposes
                                        only. To see the rates for money transfer, please select sending money option.
                                    </Text>
                                </>
                            )}
                        </View>
                    )}
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
    convertionRate: {},
    convertionRateText: {
        color: 'black',
        fontSize: 18,
        marginTop: 40,
    },
    infoText: {
        color: 'grey',
        fontSize: 14,
        marginTop: 15,
    },
});

export default App;
