//TODO addUrlParams convert to [addUrlParams,addUrlParam] two method later

namespace UrlBuilder {
    type Path = Array<string> | string;

    export interface Options {
        path: Path;
    }

    export class Builder {
        private url: string = '';

        constructor(private readonly baseUrl: string) {
            this.url = this.baseUrl;
        }

        addUrlParams(path: Path): this {
            if (!path) {
                return this;
            }

            if (Array.isArray(path)) {
                this.url += path
                    .map((el) => {
                        el = el ?? '';

                        return el.startsWith('/') ? el : '/' + el;
                    })
                    .join('');
            } else {
                this.url += path.startsWith('/') ? path : '/' + path;
            }

            return this;
        }

        get getUrl(): string {
            return this.url;
        }
    }
}

export function createUrl(baseUrl: string, opts: UrlBuilder.Options): string {
    const builder = new UrlBuilder.Builder(baseUrl);

    return builder.addUrlParams(opts.path).getUrl;
}

export function buildUrl(baseUrl: string) {
    return new UrlBuilder.Builder(baseUrl);
}

// buildUrl('http://example.com', {
//   path: 'about',
//   hash: 'contact',
//   queryParams: {
//     foo: bar,
//     bar: ['foo', 'bar']
//   }
// });
