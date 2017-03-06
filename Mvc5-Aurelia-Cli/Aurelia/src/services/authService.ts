import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';

import {IAuthorizationData, AuthHelperService } from './auth-helper-service';
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

@inject(HttpClient, LocalStorageService, Router, AuthHelperService)
export class AuthService {

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

    isRequesting = false;

    constructor(private http: HttpClient, private storage: LocalStorageService, private router: Router, private auth: AuthHelperService) {
    }

    status(response) {
        console.log('status() returned: ' + response.status);

        if (response.status >= 200 && response.status < 400) {
            return response.json().catch(error => null);
        }

        return response.json().then((errorMesage) => {
            return Promise.reject(new Error(errorMesage.error_description));
        });
    }

    logout() {
        return new Promise(resolve => {
            console.log('User ' + this.authentication.userName + ' is being logged out.');
           this.auth.removeAuthData();

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

        this.isRequesting = true;

        return this.http.fetch('token', {
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: content
        })
            .then(this.status)
            .then((response) => {

                let authorizationData: IAuthorizationData = { accessToken: response.access_token, userName: response.userName, tokenType: "bearer", refreshToken: "", useRefreshTokens: false };

                this.auth.saveAuthData(authorizationData);

                this._authentication.isAuth = true;
                this._authentication.userName = loginData.userName;
                this._authentication.useRefreshTokens = authorizationData.useRefreshTokens;

                this.isRequesting = false;

                return response;
            })
            .catch(error => {
                this.isRequesting = false;
                this.logout();                                  

                throw error;
            });
    }

    intialize() {
        let data : IAuthorizationData = this.auth.getAuthData();

        if (data) {
            
            this._authentication.isAuth = true;
            this._authentication.userName = data.userName;
            this._authentication.useRefreshTokens = data.useRefreshTokens;
        }
    }
}
