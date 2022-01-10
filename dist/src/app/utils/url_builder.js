"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUrl = exports.createUrl = void 0;
var UrlBuilder;
(function (UrlBuilder) {
    class Builder {
        constructor(baseUrl) {
            this.baseUrl = baseUrl;
            this.url = '';
            this.url = this.baseUrl;
        }
        addUrlParams(path) {
            if (!path) {
                return this;
            }
            if (Array.isArray(path)) {
                this.url += path
                    .map((el) => {
                    el = el !== null && el !== void 0 ? el : '';
                    return el.startsWith('/') ? el : '/' + el;
                })
                    .join('');
            }
            else {
                this.url += path.startsWith('/') ? path : '/' + path;
            }
            return this;
        }
        get getUrl() {
            return this.url;
        }
    }
    UrlBuilder.Builder = Builder;
})(UrlBuilder || (UrlBuilder = {}));
function createUrl(baseUrl, opts) {
    const builder = new UrlBuilder.Builder(baseUrl);
    return builder.addUrlParams(opts.path).getUrl;
}
exports.createUrl = createUrl;
function buildUrl(baseUrl) {
    return new UrlBuilder.Builder(baseUrl);
}
exports.buildUrl = buildUrl;
//# sourceMappingURL=url_builder.js.map