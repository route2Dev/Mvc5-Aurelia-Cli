import { inject } from 'aurelia-framework';
import { AuthService } from 'aurelia-auth';

interface UserInfo {
    email: string;
    password: string;
}

@inject(AuthService)
export class Login {
    heading = "Login";

    email = "";
    password = "";

    loginError = "";

    constructor(private auth: AuthService) {
    }

    login() {             
         var creds = "grant_type=password&username=" + this.email + "&password=" + this.password;

        return this.auth.login(creds, null)
            .then((response) => {
                console.log("Login response: " + response);
            })
            .catch(error => {
                this.loginError = error.response;
            });
    }
}