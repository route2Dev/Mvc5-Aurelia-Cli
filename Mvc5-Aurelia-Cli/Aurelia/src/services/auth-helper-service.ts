import { inject } from 'aurelia-framework';
import { AuthConfig } from './auth-config';
import { LocalStorageService } from './localStorageService';


@inject(AuthConfig, LocalStorageService)
export class AuthHelperService {

    private _tokenName:string;
    private _initialUrl:string = "";

    constructor(private config : AuthConfig, private localStorageService: LocalStorageService) {                
        this._tokenName = config.current.tokenPreix ? config.current.tokenPrefix + '_' + config.current.tokenName : config.current.tokenName;
    }

    set intialUrl(value: string) {
        this._initialUrl = value;
    }

    get loginRoute() {
        return this.config.current.loginRoute;
    }

    get loginRedirect() {
        return this._initialUrl || this.config.current.loginRedirect;
    }

    get logoutRedirect() {
        return this.config.current.logoutRedirect;
    }
}