import { inject, Aurelia } from 'aurelia-framework';
import { HttpClient, Interceptor } from 'aurelia-fetch-client';
import { AuthService, IAuthorizationData } from './authservice';
import { LocalStorageService } from './localStorageService';

@inject(Aurelia, LocalStorageService)
export class AuthInterceptorService implements Interceptor {
    constructor(private aurelia: Aurelia, private storage: LocalStorageService) {

    }

    request(request: Request) {
        var data = this.storage.get('authorizationData');
        if (data) {
            let authData: IAuthorizationData = JSON.parse(data);
            request.headers.append('Authorization', authData.accessToken);
        }

        return request;
    }

}