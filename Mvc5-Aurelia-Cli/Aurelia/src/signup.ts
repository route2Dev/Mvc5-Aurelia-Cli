import { inject } from 'aurelia-framework';
import { AuthService } from 'aurelia-auth';

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

        var userInfo = { userName: this.email, password: this.password, confirmPassword: this.password };

        return this.auth.signup(userInfo, "", "")
            .then((response) => {
                console.log("Signed Up!");
            })
            .catch(error => {
                this.signupError = error.response;
            });
    };
}