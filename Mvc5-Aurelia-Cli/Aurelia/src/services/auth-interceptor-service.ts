import { inject, Aurelia } from 'aurelia-framework';
import { HttpClient, Interceptor } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';
import { AuthHelperService } from './auth-helper-service';
import { AuthService } from './authservice';
import { LocalStorageService } from './localStorageService';

@inject(Aurelia, AuthHelperService, Router)
export class AuthInterceptorService implements Interceptor {
    constructor(private aurelia: Aurelia, private auth: AuthHelperService, private router: Router) {
    }

    request(request: Request) {

        console.log('auth-interceptor called.');
        
        let data = this.auth.getAuthData();
        
        if (data) {
            console.log('auth-interceptor: ' + data.tokenType + ' ' + data.accessToken);
            
            request.headers.append('Authorization', data.tokenType + ' ' + data.accessToken);
        }

        return request;
    }

    responseError(response: Response) {
       if(response.status === 401) {
           console.log('auth-Interceptor-Service redirecting request.');
           this.router.navigateToRoute('login');
       }
       return response;
    }
}