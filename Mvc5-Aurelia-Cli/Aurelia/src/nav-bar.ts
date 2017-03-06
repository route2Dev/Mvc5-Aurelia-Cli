import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {AuthService} from './services/authService';

@inject(AuthService)
export class NavBar {
    _isAuthenticated = false;
    @bindable router = null;

    constructor(private auth: AuthService) {
        
    }

    get isAuthenticated() {
        return this.auth.authentication.isAuth;
    }

    get userName() {
        return this.auth.authentication.userName;
    }
}


