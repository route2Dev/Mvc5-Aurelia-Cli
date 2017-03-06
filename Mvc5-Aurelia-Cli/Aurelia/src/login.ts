import { inject } from 'aurelia-framework';
import { Router, Redirect } from 'aurelia-router';
import { AuthService, ILoginData } from './services/authService';
import { AuthHelperService } from './services/auth-helper-service';

interface UserInfo {
    email: string;
    password: string;
}

@inject(AuthService, AuthHelperService, Router)
export class Login {
    heading = "Login";

    email = "";
    password = "";
    useRefreshTokens = false;

    loginError = "";

    constructor(private auth: AuthService, private helper: AuthHelperService, private router: Router) {
    }

    login() {                  
        let loginData : ILoginData = { 
            userName: this.email,
            password: this.password
        };

        return this.auth.login(loginData)
            .then(response => {
                let redirect = new Redirect(this.helper.loginRedirect);
                redirect.navigate(this.router);
            })
            .catch(error => {
                this.loginError = error;
                console.log(this.loginError);
            });
    }
}