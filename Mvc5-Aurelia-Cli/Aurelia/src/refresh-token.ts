import { inject } from 'aurelia-framework';
import { AuthService } from './services/authService';

@inject(AuthService)
export class RefreshToken {
    
    auth;

    constructor(auth: AuthService) {        
        this.auth = auth;
    }    
    
    private _tokenRefreshed : boolean;

    get tokenRefreshed() {
        return this._tokenRefreshed;
    }

    private _tokenResponse;

    get tokenResponse() {
        return this._tokenResponse;
    }

    activate() {
        console.log('Use RefreshTokens: ' + this.auth.authentication.useRefreshTokens);
        this._tokenRefreshed = false;
        this._tokenResponse = null;
    }

    refreshToken() {
        this.auth.refreshToken()
        .then(response => {
            console.log('Refresh-Token: ' + response.access_token);

            this._tokenRefreshed = true;
            this._tokenResponse = response;
        })
    }
}