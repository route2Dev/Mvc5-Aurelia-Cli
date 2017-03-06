import { inject } from 'aurelia-framework';
import { AuthConfig } from './auth-config';
import { LocalStorageService } from './localStorageService';

export interface IAuthorizationData {
    accessToken: string;
    tokenType: string;
    refreshToken: string;
    userName: string;
    useRefreshTokens: boolean;
}

@inject(AuthConfig, LocalStorageService)
export class AuthHelperService {

    private _tokenName:string;
    private _initialUrl:string = "";

    constructor(private config : AuthConfig, private storage: LocalStorageService) {                
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

    saveAuthData(authData: IAuthorizationData) {
        this.storage.set('authorizationData', authData);
    }

    getAuthData() : IAuthorizationData {
       let data = this.storage.get('authorizationData');

       return JSON.parse(data);
    }

    removeAuthData() {
        this.storage.remove('authorizationData');
    }
}