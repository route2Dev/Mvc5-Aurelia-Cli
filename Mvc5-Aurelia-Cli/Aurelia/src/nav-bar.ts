import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';

@inject(AuthService)
export class NavBar {
    _isAuthenticated = false;
    @bindable router = null;

    constructor(private auth: AuthService) {
        
    }

    get isAuthenticated() {
        return this.auth.isAuthenticated();
    }
}


