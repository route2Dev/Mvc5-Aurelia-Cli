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

    signup() {      
        return this.auth.login(this.email, this.password)
            .then((response) => {
                console.log("Login response: " + response);
            })
            .catch(error => {
                this.loginError = error.response;
            });
    }
}