import axios from 'axios';

const apiAddress = 'https://my.transfergo.com/api';

const endpoints = {
    FX_RATES: `${apiAddress}/fx-rates`,
};

const API = {
    fetchFXrates: (params: {from: string; to: string; amount: number}): Promise<{data: {toAmount: number}}> =>
        axios.get(endpoints.FX_RATES, {params}),
};

export default API;
