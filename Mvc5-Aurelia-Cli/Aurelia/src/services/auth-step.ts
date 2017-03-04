import { inject } from 'aurelia-framework';
import { PipelineStep, NavigationInstruction, Redirect, Next } from 'aurelia-router';
import { AuthService } from './authService';

@inject(AuthService)
export class AuthStep implements PipelineStep {

    constructor(private authService: AuthService) {

    }

    run(routingContext: NavigationInstruction, next: Next)
    {
        let isLoggedIn = this.authService.authentication.isAuth;
        let loginRoute = "/login";

        if(!isLoggedIn && routingContext.getAllInstructions().some(i => i.config.settings.auth)) {
            return next.cancel(new Redirect(loginRoute));
        }

        return next();
    }
}