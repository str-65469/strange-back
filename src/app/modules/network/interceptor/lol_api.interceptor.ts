import { AxiosfitRequestInterceptor, AxiosRequestConfig } from '@yggdrasilts/axiosfit';

export class LolApiInterceptor implements AxiosfitRequestInterceptor {
    // register headers for lol api
    onRequest(config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> {
        config.timeout = 10000; // 10 sec
        return config;
    }

    // onError(error: any) {
    //     console.log(error);
    // }
}
