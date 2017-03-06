import { inject } from 'aurelia-framework';
import { AuthService, IRegistration } from './services/authService';

interface UserInfo {
    email: string;
    password: string;
}

@inject(AuthService)
export class Signup {
    heading = "Sign Up";

    email = "";
    password = "";

    signupError = "";

    constructor(private auth: AuthService) {
    }

    signup() {

        var userInfo : IRegistration = { userName: this.email, password: this.password, confirmPassword: this.password };

        return this.auth.signUp(userInfo)
            .then((response) => {
                console.log("Signed Up!");
            })
            .catch(error => {
                this.signupError = error.response;
            });
    };
}