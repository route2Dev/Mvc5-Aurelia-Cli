import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';

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

@inject(HttpClient, LocalStorageService, Router)
export class AuthService {
    baseUrl = "http://localhost:45933/";

    private _authentication: IAuthentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false
    };

    get authentication(): IAuthentication {
        return this._authentication;
    }

    externalAuthData: IExternalData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    constructor(private http: HttpClient, private storage: LocalStorageService, private router: Router) {    
    }

    status(response) {
        if (response.status >= 200 && response.status < 400) {
            return response.json().catch(error => null);
        }
        console.log('status says bad request.');
        throw response;
    }

    logout() {
        return new Promise(resolve => {
            console.log('logout called.');
            this.storage.remove('authorizationData');
            
            this.authentication.isAuth = false;
            this.authentication.userName = '';

            resolve();
        });
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

                let authorizationData: IAuthorizationData = { accessToken: response.access_token, userName: response.userName, tokenType: "bearer", refreshToken: "", useRefreshTokens: false };

                this.storage.set('authorizationData', authorizationData);

                this._authentication.isAuth = true;
                this._authentication.userName = loginData.userName;
                this._authentication.useRefreshTokens = authorizationData.useRefreshTokens;

                return response;
            })
            .catch(error => {
                this.logout();
                console.log("Error logging in.");
                return error;
            });
    }

    intialize() {
        var data = this.storage.get("authorizationData");
        //var data : IAuthorizationData = JSON.parse( this.storage.get("authorizationData"));
        if (data) {
            var authorizationData: IAuthorizationData = JSON.parse(data);
            this._authentication.isAuth = true;
            this._authentication.userName = authorizationData.userName;
            this._authentication.useRefreshTokens = authorizationData.useRefreshTokens;
        }
    }
}
