import { inject, Aurelia } from 'aurelia-framework';
import { HttpClient, Interceptor } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';
import { AuthService, IAuthorizationData } from './authservice';
import { LocalStorageService } from './localStorageService';

@inject(Aurelia, LocalStorageService, Router)
export class AuthInterceptorService implements Interceptor {
    constructor(private aurelia: Aurelia, private storage: LocalStorageService, private router: Router) {

    }

    foo = "bar";

    request(request: Request) {

        console.log('auth-interceptor called.');
        var data = this.storage.get('authorizationData');
        if (data) {
            console.log('auth-interceptor ' + data);
            let authData: IAuthorizationData = JSON.parse(data);
            request.headers.append('Authorization', authData.tokenType + ' ' + authData.accessToken);
        }

        return request;
    }

    responseError(response: Response) {
       if(response.status === 401) {
           this.router.navigateToRoute('login');
       }
       return response;
    }
}