import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';

import { LocalStorageService } from './localStorageService';

interface IAuthentication {
    isAuth: boolean;
    userName: string;
    useRefreshTokens: boolean;
}

interface IExternalData {
    provider: string;
    userName: string;
    externalAccessToken: string;
}

export interface ILoginData {
    userName: string;
    password: string;
}

export interface IRegistration extends ILoginData {
    confirmPassword: string;
}

export interface IAuthorizationData {
    accessToken: string;
    tokenType: string;
    refreshToken: string;
    userName: string;
    useRefreshTokens: boolean;
}

@inject(HttpClient, LocalStorageService)
export class AuthService {
    baseUrl = "http://localhost:45933/";

    private _authentication: IAuthentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false
    };

    get authentication() : IAuthentication {
        return this._authentication;
    }

    externalAuthData: IExternalData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    constructor(private http: HttpClient, private storage: LocalStorageService) {
        this.http.configure(config => {
            config
                .withBaseUrl('http://localhost:45933/')
            // .withDefaults({
            //     credentials: 'same-origin',
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json'
            //     }
            // })
        })
    }

    status(response) {
        if (response.status >= 200 && response.status < 400) {
            return response.json().catch(error => null);
        }
        throw response;
    }

    logout() {
        this.storage.remove('authorizationData');
    }

    /**saveRegistration */
    signUp(registration: IRegistration) {

        this.logout();

        return this.http.fetch('api/account/register', {
            method: 'post',
            body: json(registration)
        })
            .then(this.status)
            .then((response) => {
                return response;
            });
    }

    login(loginData: ILoginData) {
        // data
        var content = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        return this.http.fetch('token', {
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: content
        })
            .then(this.status)
            .then((response) => {
                // this.auth.setToken(response);

                let authorizationData: IAuthorizationData = {accessToken: response.access_token, userName: response.userName, tokenType: "bearer", refreshToken: "", useRefreshTokens: false};                                
                
                this.storage.set('authorizationData', authorizationData);

                this._authentication.isAuth = true;
                this._authentication.userName = loginData.userName;
                this._authentication.useRefreshTokens = authorizationData.useRefreshTokens;

                return response;
            })
            .catch(error => {
                this.logout();
                console.log("Error logging in.");
            });
    }

    intialize() {
        var data : IAuthorizationData = JSON.parse( this.storage.get("authorizationData"));
        if(data) {
            this._authentication.isAuth = true;
            this._authentication.userName = data.userName;
            this._authentication.useRefreshTokens : data.useRefreshTokens;
        }
    }
}
