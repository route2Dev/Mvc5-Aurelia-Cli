import { inject, Aurelia } from 'aurelia-framework';
import { HttpClient, Interceptor } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';
import { AuthHelperService } from './auth-helper-service';
import { AuthService } from './authService';
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

            request.headers.set('Authorization', data.tokenType + ' ' + data.accessToken);
        }

        return request;
    }

    handleErrorResponse(response: Response, request: Request) {
        console.log('auth-interceptor response called.');

        var authService: AuthService = this.aurelia.container.get(AuthService);

        if (response.status === 401) {
            console.log('auth-Interceptor-Service response error 401.');
            
            let data = this.auth.getAuthData();

            if (data.useRefreshTokens) {
                console.log('User has enabled refresh tokens. Refreshing token.');
                return authService.refreshToken().then(() => {
                    let data = this.auth.getAuthData();

                    request.headers.set('Authorization', data.tokenType + ' ' + data.accessToken);

                    let http : HttpClient = this.aurelia.container.get(HttpClient);

                    return http.fetch(request);
                       
                });
            }
            // else

            return authService.logout()
                .then(() => {
                     this.router.navigateToRoute('login');
                })           
        }
        
        return response;
    }

    responseError(error, request:Request) {
        console.log('auth-interceptor caught error: ' + error);
        if(error instanceof Response) {
            return this.handleErrorResponse(error, request);
        }

        return Promise.reject(new Error('Invalid response received.'));
    }
}