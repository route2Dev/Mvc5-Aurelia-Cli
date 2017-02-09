import 'bootstrap'

import { AuthorizeStep } from 'aurelia-auth';
import { Router, RouterConfiguration } from 'aurelia-router';
import {FetchConfig} from 'aurelia-auth';

export class QuotesApp {
    config: FetchConfig;

    configureRouter(config: RouterConfiguration, router: Router) {

        config.title = 'Random Quotes App';

        // Here we hook into the authorize extensibility point
        // to add a route filter so that we can require authentication
        // on certain routes
        config.addPipelineStep('authorize', AuthorizeStep);

        // Here we describe the routes we want along with information about them
        // such as which they are accessible at, which module they use, and whether
        // they should be placed in the navigation bar
        config.map([
            { route: ['', 'welcome'], name: 'welcome', moduleId: './welcome', nav: true, title: 'Welcome' },
            { route: 'random-quote', name: 'random-quote', moduleId: './random-quote', nav: true, title: 'Random Quote' },
            // The secret-quote route is the only one that the user needs to be logged in to see,  so we set auth: true
            { route: 'secret-quote', name: 'secret-quote', moduleId: './secret-quote', nav: true, title: 'Super Secret Quote', auth: true },
            { route: 'signup', name: 'signup', moduleId: './signup', nav: false, title: 'Signup', authRoute: true },
            { route: 'login', name: 'login', moduleId: './login', nav: false, title: 'Login', authRoute: true },
            { route: 'logout', name: 'logout', moduleId: './logout', nav: false, title: 'Logout', authRoute: true }
        ]);

    };    

    activate() {
        this.config.configure();    
    }
}