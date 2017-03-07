import 'bootstrap'

import { inject } from 'aurelia-framework'
import { Router, RouterConfiguration } from 'aurelia-router';
import { HttpClient } from 'aurelia-fetch-client';

// import { AuthorizeStep } from 'aurelia-auth';
// import {FetchConfig} from 'aurelia-auth';

import { AuthService } from './services/authService';
import { AuthStep } from './services/auth-step';
import { AuthInterceptorService } from './services/auth-interceptor-service';
import { AuthConfig } from './services/auth-config';

import config from './auth-config';

@inject(HttpClient, AuthConfig, AuthService, AuthInterceptorService)
// @inject(FetchConfig)
export class App {
    router: Router;

    // constructor(private fetchConfig: FetchConfig) {
    constructor(http: HttpClient, private authConfig: AuthConfig, authService: AuthService, private authInterceptorService: AuthInterceptorService) {
        
        authConfig.configure(config);
        authService.intialize();

        http.configure(httpConfig => {
            httpConfig
                .useStandardConfiguration()
                .withBaseUrl('http://localhost:45933/')
                .withDefaults({                    
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .withInterceptor(authInterceptorService);
        });
    }

    configureRouter(config: RouterConfiguration, router: Router) {
        this.router = router;
        config.title = 'Aurelia Quotes App';

        // Here we hook into the authorize extensibility point
        // to add a route filter so that we can require authentication
        // on certain routes
        config.addPipelineStep('authorize', AuthStep);

        // Here we describe the routes we want along with information about them
        // such as which they are accessible at, which module they use, and whether
        // they should be placed in the navigation bar
        config.map([
            { route: ['', 'Home'], name: 'Home', moduleId: 'home', nav: true, title: 'Home', settings: { class: 'navbar-brand' } },
            { route: 'random-quote', name: 'random-quote', moduleId: 'random-quote', nav: true, title: 'Random Quote' },
            // The secret-quote route is the only one that the user needs to be logged in to see,  so we set auth: true
            { route: 'secret-quote', name: 'secret-quote', moduleId: 'secret-quote', nav: true, title: 'Super Secret Quote', settings: {auth: true} },
            { route: 'refresh-token', name: 'refresh-token', moduleId: 'refresh-token', nav: true, title: 'Refresh Token', settings: {auth: true} },
            { route: 'signup', name: 'signup', moduleId: 'signup', nav: false, title: 'Sign up', authRoute: true },
            { route: 'login', name: 'login', moduleId: 'login', nav: false, title: 'Login', authRoute: true },
            { route: 'logout', name: 'logout', moduleId: 'logout', nav: false, title: 'Logout', authRoute: true }
        ]);
    }

    activate() {
        // this.fetchConfig.configure();

    }
}