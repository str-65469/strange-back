import {
    AxiosfitRequestInterceptor,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosfitResponseInterceptor,
} from '@yggdrasilts/axiosfit';

export class LolApiInterceptor implements AxiosfitRequestInterceptor, AxiosfitResponseInterceptor {
    // register headers for lol api
    onRequest(config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> {
        config.timeout = 10000; // 10 sec
        return config;
    }

    onResponse(response: AxiosResponse<any>): AxiosResponse<any> | Promise<AxiosResponse<any>> {
        return response.data;
    }
}
