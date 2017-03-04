import { inject } from 'aurelia-framework';
import { PipelineStep, NavigationInstruction, Redirect } from 'aurelia-router';
import { AuthService } from './authService';

@inject(AuthService)
export class AuthStep implements PipelineStep {

    constructor(private authService: AuthService) {

    }

    run(routingContext: NavigationInstruction, next: any)
    {
        let isLoggedIn = this.authService.authentication.isAuth;
        let loginRoute = "/login";

        if(routingContext.getAllInstructions().some(i => i.config.auth)) {
            return next.cancel(new Redirect(loginRoute));
        }

        return next();
    }
}