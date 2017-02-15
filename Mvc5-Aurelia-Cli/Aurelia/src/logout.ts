import {AuthService} from 'aurelia-auth';
import {inject} from 'aurelia-framework';

@inject(AuthService)
export class Logout {
    constructor(private authService: AuthService) {}

    activate() {
        this.authService.logout("#login")
            .then(respone => {
                console.log("Logged Out!");
            })
            .catch(err => {
                console.log("Error Logging Out");
            });
    }
}