import { inject } from 'aurelia-framework';
import { PipelineStep, NavigationInstruction, Redirect, Next } from 'aurelia-router';
import { AuthService } from './authService';
import { AuthHelperService } from './auth-helper-service';

@inject(AuthService, AuthHelperService)
export class AuthStep implements PipelineStep {

    constructor(private authService: AuthService, private authHelperService:AuthHelperService) {
    }

    run(routingContext: NavigationInstruction, next: Next)
    {
        let isLoggedIn = this.authService.authentication.isAuth;
        let loginRoute = this.authHelperService.loginRoute;

         console.log('authstep:' + loginRoute);
         console.log('authstep:' + isLoggedIn);

        if(!isLoggedIn && routingContext.getAllInstructions().some(i => i.config.settings.auth)) {
            console.log('authstep.initialUrl:' + window.location.href);
            this.authHelperService.intialUrl = window.location.href;
            return next.cancel(new Redirect(loginRoute));
        } 
        
        return next();
    }
}