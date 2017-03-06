import {inject} from 'aurelia-framework';
import {Router, Redirect} from 'aurelia-router';

import { AuthHelperService } from './services/auth-helper-service';
import {AuthService} from './services/authService';

@inject(AuthService, AuthHelperService, Router)
export class Logout {
    constructor(private authService: AuthService, private helper: AuthHelperService, private router: Router) {}

    activate() {
        this.authService.logout()
            .then(respone => {
                console.log("Logged Out!");

                let redirect = new Redirect(this.helper.logoutRedirect);
                redirect.navigate(this.router);
            })
            .catch(err => {
                console.log("Error Logging Out");
            });
    }
}