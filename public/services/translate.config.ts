import { I18n, TranslateOptions } from 'i18n-js';
import * as en from '../languages/en.json';
import * as pt from '../languages/pt.json';

class TranslateService {
    private i18n: I18n;
    private currentLocale: string;

    constructor() {
        this.currentLocale = 'en';
        this.i18n = new I18n();
        this.i18n.translations = { en, pt };
        this.getLocale();
    }

    public translate(key: string, options?: TranslateOptions ) {
        return this.i18n.t(key, options);
    }

    public getLocale() {
        const currentLocale = localStorage.getItem('locale');
        if (currentLocale) {
            this.setLocale(currentLocale);
            return this.currentLocale;
        }
        this.setLocale(this.currentLocale);
        return this.currentLocale;
    }

    public setLocale(locale: string) {
        localStorage.setItem('locale', locale);
        this.i18n.locale = locale;
        this.currentLocale = locale;
    }
}

export default TranslateService;
export const t = new TranslateService();