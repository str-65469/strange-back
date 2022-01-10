declare namespace UrlBuilder {
    type Path = Array<string> | string;
    export interface Options {
        path: Path;
    }
    export class Builder {
        private readonly baseUrl;
        private url;
        constructor(baseUrl: string);
        addUrlParams(path: Path): this;
        get getUrl(): string;
    }
    export {};
}
export declare function createUrl(baseUrl: string, opts: UrlBuilder.Options): string;
export declare function buildUrl(baseUrl: string): UrlBuilder.Builder;
export {};
