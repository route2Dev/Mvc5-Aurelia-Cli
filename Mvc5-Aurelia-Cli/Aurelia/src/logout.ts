import {inject} from 'aurelia-framework';

import {AuthService} from './services/authService';

@inject(AuthService)
export class Logout {
    constructor(private authService: AuthService) {}

    activate() {
        this.authService.logout()
            .then(respone => {
                console.log("Logged Out!");
            })
            .catch(err => {
                console.log("Error Logging Out");
            });
    }
}