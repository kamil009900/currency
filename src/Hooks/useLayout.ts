import {useCallback, useState} from 'react';
import {LayoutChangeEvent} from 'react-native';

const useLayout = () => {
    const [value, setValue] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        setValue(event.nativeEvent.layout);
    }, []);

    return {...value, onLayout};
};

export default useLayout;
