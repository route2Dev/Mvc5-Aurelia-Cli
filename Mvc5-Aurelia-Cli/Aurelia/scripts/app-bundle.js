define('services/localStorageService',["require", "exports"], function (require, exports) {
    "use strict";
    var LocalStorageService = (function () {
        function LocalStorageService() {
        }
        LocalStorageService.prototype.set = function (key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        };
        LocalStorageService.prototype.get = function (key) {
            return localStorage.getItem(key);
        };
        LocalStorageService.prototype.remove = function (key) {
            localStorage.removeItem(key);
        };
        return LocalStorageService;
    }());
    exports.LocalStorageService = LocalStorageService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/authService',["require", "exports", "aurelia-framework", "aurelia-fetch-client", "aurelia-router", "./localStorageService"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, aurelia_router_1, localStorageService_1) {
    "use strict";
    var AuthService = (function () {
        function AuthService(http, storage, router) {
            this.http = http;
            this.storage = storage;
            this.router = router;
            this._authentication = {
                isAuth: false,
                userName: "",
                useRefreshTokens: false
            };
            this.externalAuthData = {
                provider: "",
                userName: "",
                externalAccessToken: ""
            };
            this.isRequesting = false;
        }
        Object.defineProperty(AuthService.prototype, "authentication", {
            get: function () {
                return this._authentication;
            },
            enumerable: true,
            configurable: true
        });
        AuthService.prototype.status = function (response) {
            console.log('status() returned: ' + response.status);
            if (response.status >= 200 && response.status < 400) {
                return response.json().catch(function (error) { return null; });
            }
            return response.json().then(function (errorMesage) {
                return Promise.reject(new Error(errorMesage.error_description));
            });
        };
        AuthService.prototype.logout = function () {
            var _this = this;
            return new Promise(function (resolve) {
                console.log('User ' + _this.authentication.userName + ' is being logged out.');
                _this.storage.remove('authorizationData');
                _this.authentication.isAuth = false;
                _this.authentication.userName = '';
                resolve();
            });
        };
        AuthService.prototype.signUp = function (registration) {
            this.logout();
            return this.http.fetch('api/account/register', {
                method: 'post',
                body: aurelia_fetch_client_1.json(registration)
            })
                .then(this.status)
                .then(function (response) {
                return response;
            });
        };
        AuthService.prototype.login = function (loginData) {
            var _this = this;
            var content = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
            this.isRequesting = true;
            return this.http.fetch('token', {
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: content
            })
                .then(this.status)
                .then(function (response) {
                var authorizationData = { accessToken: response.access_token, userName: response.userName, tokenType: "bearer", refreshToken: "", useRefreshTokens: false };
                _this.storage.set('authorizationData', authorizationData);
                _this._authentication.isAuth = true;
                _this._authentication.userName = loginData.userName;
                _this._authentication.useRefreshTokens = authorizationData.useRefreshTokens;
                _this.isRequesting = false;
                return response;
            })
                .catch(function (error) {
                _this.isRequesting = false;
                _this.logout();
                throw error;
            });
        };
        AuthService.prototype.intialize = function () {
            var data = this.storage.get("authorizationData");
            if (data) {
                var authorizationData = JSON.parse(data);
                this._authentication.isAuth = true;
                this._authentication.userName = authorizationData.userName;
                this._authentication.useRefreshTokens = authorizationData.useRefreshTokens;
            }
        };
        return AuthService;
    }());
    AuthService = __decorate([
        aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, localStorageService_1.LocalStorageService, aurelia_router_1.Router),
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, localStorageService_1.LocalStorageService, aurelia_router_1.Router])
    ], AuthService);
    exports.AuthService = AuthService;
});

define('services/auth-config',["require", "exports"], function (require, exports) {
    "use strict";
    var AuthConfig = (function () {
        function AuthConfig() {
            this._current = {
                httpInterceptor: true,
                loginOnSignup: true,
                baseUrl: '/',
                loginRedirect: '#/',
                logoutRedirect: '#/',
                signupRedirect: '#/login',
                loginUrl: '/auth/login',
                signupUrl: '/auth/signup',
                profileUrl: '/auth/me',
                loginRoute: '/login',
                signupRoute: '/signup',
                tokenRoot: false,
                tokenName: 'token',
                idTokenName: 'id_token',
                tokenPrefix: 'aurelia',
                responseTokenProp: 'access_token',
                responseIdTokenProp: 'id_token',
                unlinkUrl: '/auth/unlink/',
                unlinkMethod: 'get',
                authHeader: 'Authorization',
                authToken: 'Bearer',
                withCredentials: true,
                platform: 'browser',
                storage: 'localStorage',
                providers: {
                    identSrv: {
                        name: 'identSrv',
                        url: '/auth/identSrv',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        scope: ['profile', 'openid'],
                        responseType: 'code',
                        scopePrefix: '',
                        scopeDelimiter: ' ',
                        requiredUrlParams: ['scope', 'nonce'],
                        optionalUrlParams: ['display', 'state'],
                        state: function () {
                            var rand = Math.random().toString(36).substr(2);
                            return encodeURIComponent(rand);
                        },
                        display: 'popup',
                        type: '2.0',
                        clientId: 'jsClient',
                        nonce: function () {
                            var val = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
                            return encodeURIComponent(val);
                        },
                        popupOptions: { width: 452, height: 633 }
                    },
                    google: {
                        name: 'google',
                        url: '/auth/google',
                        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        scope: ['profile', 'email'],
                        scopePrefix: 'openid',
                        scopeDelimiter: ' ',
                        requiredUrlParams: ['scope'],
                        optionalUrlParams: ['display', 'state'],
                        display: 'popup',
                        type: '2.0',
                        state: function () {
                            var rand = Math.random().toString(36).substr(2);
                            return encodeURIComponent(rand);
                        },
                        popupOptions: {
                            width: 452,
                            height: 633
                        }
                    },
                    facebook: {
                        name: 'facebook',
                        url: '/auth/facebook',
                        authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
                        redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
                        scope: ['email'],
                        scopeDelimiter: ',',
                        nonce: function () {
                            return Math.random();
                        },
                        requiredUrlParams: ['nonce', 'display', 'scope'],
                        display: 'popup',
                        type: '2.0',
                        popupOptions: {
                            width: 580,
                            height: 400
                        }
                    },
                    linkedin: {
                        name: 'linkedin',
                        url: '/auth/linkedin',
                        authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        requiredUrlParams: ['state'],
                        scope: ['r_emailaddress'],
                        scopeDelimiter: ' ',
                        state: 'STATE',
                        type: '2.0',
                        popupOptions: {
                            width: 527,
                            height: 582
                        }
                    },
                    github: {
                        name: 'github',
                        url: '/auth/github',
                        authorizationEndpoint: 'https://github.com/login/oauth/authorize',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        optionalUrlParams: ['scope'],
                        scope: ['user:email'],
                        scopeDelimiter: ' ',
                        type: '2.0',
                        popupOptions: {
                            width: 1020,
                            height: 618
                        }
                    },
                    yahoo: {
                        name: 'yahoo',
                        url: '/auth/yahoo',
                        authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        scope: [],
                        scopeDelimiter: ',',
                        type: '2.0',
                        popupOptions: {
                            width: 559,
                            height: 519
                        }
                    },
                    twitter: {
                        name: 'twitter',
                        url: '/auth/twitter',
                        authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
                        type: '1.0',
                        popupOptions: {
                            width: 495,
                            height: 645
                        }
                    },
                    live: {
                        name: 'live',
                        url: '/auth/live',
                        authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        scope: ['wl.emails'],
                        scopeDelimiter: ' ',
                        requiredUrlParams: ['display', 'scope'],
                        display: 'popup',
                        type: '2.0',
                        popupOptions: {
                            width: 500,
                            height: 560
                        }
                    },
                    instagram: {
                        name: 'instagram',
                        url: '/auth/instagram',
                        authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        requiredUrlParams: ['scope'],
                        scope: ['basic'],
                        scopeDelimiter: '+',
                        display: 'popup',
                        type: '2.0',
                        popupOptions: {
                            width: 550,
                            height: 369
                        }
                    }
                }
            };
        }
        Object.defineProperty(AuthConfig.prototype, "current", {
            get: function () {
                return this._current;
            },
            enumerable: true,
            configurable: true
        });
        AuthConfig.prototype.configure = function (overrideConfig) {
            this._current = Object.assign({}, this._current, overrideConfig);
        };
        return AuthConfig;
    }());
    exports.AuthConfig = AuthConfig;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/auth-helper-service',["require", "exports", "aurelia-framework", "./auth-config", "./localStorageService"], function (require, exports, aurelia_framework_1, auth_config_1, localStorageService_1) {
    "use strict";
    var AuthHelperService = (function () {
        function AuthHelperService(config, localStorageService) {
            this.config = config;
            this.localStorageService = localStorageService;
            this._initialUrl = "";
            this._tokenName = config.current.tokenPreix ? config.current.tokenPrefix + '_' + config.current.tokenName : config.current.tokenName;
        }
        Object.defineProperty(AuthHelperService.prototype, "intialUrl", {
            set: function (value) {
                this._initialUrl = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AuthHelperService.prototype, "loginRoute", {
            get: function () {
                return this.config.current.loginRoute;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AuthHelperService.prototype, "loginRedirect", {
            get: function () {
                return this._initialUrl || this.config.current.loginRedirect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AuthHelperService.prototype, "logoutRedirect", {
            get: function () {
                return this.config.current.logoutRedirect;
            },
            enumerable: true,
            configurable: true
        });
        return AuthHelperService;
    }());
    AuthHelperService = __decorate([
        aurelia_framework_1.inject(auth_config_1.AuthConfig, localStorageService_1.LocalStorageService),
        __metadata("design:paramtypes", [auth_config_1.AuthConfig, localStorageService_1.LocalStorageService])
    ], AuthHelperService);
    exports.AuthHelperService = AuthHelperService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/auth-step',["require", "exports", "aurelia-framework", "aurelia-router", "./authService", "./auth-helper-service"], function (require, exports, aurelia_framework_1, aurelia_router_1, authService_1, auth_helper_service_1) {
    "use strict";
    var AuthStep = (function () {
        function AuthStep(authService, authHelperService) {
            this.authService = authService;
            this.authHelperService = authHelperService;
        }
        AuthStep.prototype.run = function (routingContext, next) {
            var isLoggedIn = this.authService.authentication.isAuth;
            var loginRoute = this.authHelperService.loginRoute;
            console.log('authstep:' + loginRoute);
            console.log('authstep:' + isLoggedIn);
            if (!isLoggedIn && routingContext.getAllInstructions().some(function (i) { return i.config.settings.auth; })) {
                console.log('authstep.initialUrl:' + window.location.href);
                this.authHelperService.intialUrl = window.location.href;
                return next.cancel(new aurelia_router_1.Redirect(loginRoute));
            }
            return next();
        };
        return AuthStep;
    }());
    AuthStep = __decorate([
        aurelia_framework_1.inject(authService_1.AuthService, auth_helper_service_1.AuthHelperService),
        __metadata("design:paramtypes", [authService_1.AuthService, auth_helper_service_1.AuthHelperService])
    ], AuthStep);
    exports.AuthStep = AuthStep;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/auth-interceptor-service',["require", "exports", "aurelia-framework", "aurelia-router", "./localStorageService"], function (require, exports, aurelia_framework_1, aurelia_router_1, localStorageService_1) {
    "use strict";
    var AuthInterceptorService = (function () {
        function AuthInterceptorService(aurelia, storage, router) {
            this.aurelia = aurelia;
            this.storage = storage;
            this.router = router;
        }
        AuthInterceptorService.prototype.request = function (request) {
            console.log('auth-interceptor called.');
            var data = this.storage.get('authorizationData');
            if (data) {
                console.log('auth-interceptor ' + data);
                var authData = JSON.parse(data);
                request.headers.append('Authorization', authData.tokenType + ' ' + authData.accessToken);
            }
            return request;
        };
        AuthInterceptorService.prototype.responseError = function (response) {
            if (response.status === 401) {
                console.log('auth-Interceptor-Service redirecting request.');
                this.router.navigateToRoute('login');
            }
            return response;
        };
        return AuthInterceptorService;
    }());
    AuthInterceptorService = __decorate([
        aurelia_framework_1.inject(aurelia_framework_1.Aurelia, localStorageService_1.LocalStorageService, aurelia_router_1.Router),
        __metadata("design:paramtypes", [aurelia_framework_1.Aurelia, localStorageService_1.LocalStorageService, aurelia_router_1.Router])
    ], AuthInterceptorService);
    exports.AuthInterceptorService = AuthInterceptorService;
});

define('auth-config',["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        baseUrl: 'http://localhost:45933',
        signupUrl: 'api/account/register',
        loginUrl: 'token',
        tokenName: 'access_token',
        loginRedirect: "#/secret-quote"
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework", "aurelia-fetch-client", "./services/authService", "./services/auth-step", "./services/auth-interceptor-service", "./services/auth-config", "./auth-config", "bootstrap"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, authService_1, auth_step_1, auth_interceptor_service_1, auth_config_1, auth_config_2) {
    "use strict";
    var App = (function () {
        function App(http, authConfig, authService, authInterceptorService) {
            this.authConfig = authConfig;
            this.authInterceptorService = authInterceptorService;
            authConfig.configure(auth_config_2.default);
            authService.intialize();
            http.configure(function (httpConfig) {
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
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.title = 'Aurelia Quotes App';
            config.addPipelineStep('authorize', auth_step_1.AuthStep);
            config.map([
                { route: ['', 'Home'], name: 'Home', moduleId: 'home', nav: true, title: 'Home', settings: { class: 'navbar-brand' } },
                { route: 'random-quote', name: 'random-quote', moduleId: 'random-quote', nav: true, title: 'Random Quote' },
                { route: 'secret-quote', name: 'secret-quote', moduleId: 'secret-quote', nav: true, title: 'Super Secret Quote', settings: { auth: true } },
                { route: 'signup', name: 'signup', moduleId: 'signup', nav: false, title: 'Sign up', authRoute: true },
                { route: 'login', name: 'login', moduleId: 'login', nav: false, title: 'Login', authRoute: true },
                { route: 'logout', name: 'logout', moduleId: 'logout', nav: false, title: 'Logout', authRoute: true }
            ]);
        };
        App.prototype.activate = function () {
        };
        return App;
    }());
    App = __decorate([
        aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, auth_config_1.AuthConfig, authService_1.AuthService, auth_interceptor_service_1.AuthInterceptorService),
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, auth_config_1.AuthConfig, authService_1.AuthService, auth_interceptor_service_1.AuthInterceptorService])
    ], App);
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('home',["require", "exports"], function (require, exports) {
    "use strict";
    var Home = (function () {
        function Home() {
            this.heading = "Aurelia Quotes";
            this.info = "Aurelia Quotes Application which uses OAuth Bearer Token for authentication and implements Refresh Tokens. The backend API is built using ASP.NET Web API 2, OWIN middleware, and ASP.NET Identity.";
        }
        return Home;
    }());
    exports.Home = Home;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('login',["require", "exports", "aurelia-framework", "aurelia-router", "./services/authService", "./services/auth-helper-service"], function (require, exports, aurelia_framework_1, aurelia_router_1, authService_1, auth_helper_service_1) {
    "use strict";
    var Login = (function () {
        function Login(auth, helper, router) {
            this.auth = auth;
            this.helper = helper;
            this.router = router;
            this.heading = "Login";
            this.email = "";
            this.password = "";
            this.useRefreshTokens = false;
            this.loginError = "";
        }
        Login.prototype.login = function () {
            var _this = this;
            var loginData = {
                userName: this.email,
                password: this.password
            };
            return this.auth.login(loginData)
                .then(function (response) {
                var redirect = new aurelia_router_1.Redirect(_this.helper.loginRedirect);
                redirect.navigate(_this.router);
            })
                .catch(function (error) {
                _this.loginError = error;
                console.log(_this.loginError);
            });
        };
        return Login;
    }());
    Login = __decorate([
        aurelia_framework_1.inject(authService_1.AuthService, auth_helper_service_1.AuthHelperService, aurelia_router_1.Router),
        __metadata("design:paramtypes", [authService_1.AuthService, auth_helper_service_1.AuthHelperService, aurelia_router_1.Router])
    ], Login);
    exports.Login = Login;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('logout',["require", "exports", "aurelia-framework", "aurelia-router", "./services/auth-helper-service", "./services/authService"], function (require, exports, aurelia_framework_1, aurelia_router_1, auth_helper_service_1, authService_1) {
    "use strict";
    var Logout = (function () {
        function Logout(authService, helper, router) {
            this.authService = authService;
            this.helper = helper;
            this.router = router;
        }
        Logout.prototype.activate = function () {
            var _this = this;
            this.authService.logout()
                .then(function (respone) {
                console.log("Logged Out!");
                var redirect = new aurelia_router_1.Redirect(_this.helper.logoutRedirect);
                redirect.navigate(_this.router);
            })
                .catch(function (err) {
                console.log("Error Logging Out");
            });
        };
        return Logout;
    }());
    Logout = __decorate([
        aurelia_framework_1.inject(authService_1.AuthService, auth_helper_service_1.AuthHelperService, aurelia_router_1.Router),
        __metadata("design:paramtypes", [authService_1.AuthService, auth_helper_service_1.AuthHelperService, aurelia_router_1.Router])
    ], Logout);
    exports.Logout = Logout;
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('nav-bar',["require", "exports", "aurelia-framework", "aurelia-framework", "./services/authService"], function (require, exports, aurelia_framework_1, aurelia_framework_2, authService_1) {
    "use strict";
    var NavBar = (function () {
        function NavBar(auth) {
            this.auth = auth;
            this._isAuthenticated = false;
            this.router = null;
        }
        Object.defineProperty(NavBar.prototype, "isAuthenticated", {
            get: function () {
                return this.auth.authentication.isAuth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavBar.prototype, "userName", {
            get: function () {
                return this.auth.authentication.userName;
            },
            enumerable: true,
            configurable: true
        });
        return NavBar;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], NavBar.prototype, "router", void 0);
    NavBar = __decorate([
        aurelia_framework_2.inject(authService_1.AuthService),
        __metadata("design:paramtypes", [authService_1.AuthService])
    ], NavBar);
    exports.NavBar = NavBar;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('random-quote',["require", "exports", "aurelia-framework", "aurelia-fetch-client"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1) {
    "use strict";
    var RandomQuote = (function () {
        function RandomQuote(httpClient) {
            this.httpClient = httpClient;
            this.heading = "Random Quote";
            this.randomQuote = "";
        }
        RandomQuote.prototype.activate = function () {
            return this.getQuote();
        };
        RandomQuote.prototype.getQuote = function () {
            var _this = this;
            return this.httpClient.fetch("api/random-quote")
                .then(function (response) { return response.text(); })
                .then(function (data) { return _this.randomQuote = data; })
                .catch(function (error) {
                console.log("Error getting quote.");
            });
        };
        return RandomQuote;
    }());
    RandomQuote = __decorate([
        aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient),
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
    ], RandomQuote);
    exports.RandomQuote = RandomQuote;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('secret-quote',["require", "exports", "aurelia-framework", "aurelia-fetch-client"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1) {
    "use strict";
    var RandomQuote = (function () {
        function RandomQuote(httpClient) {
            this.httpClient = httpClient;
            this.heading = "Super Secret Quote";
            this.secretQuote = "";
        }
        RandomQuote.prototype.activate = function () {
            var _this = this;
            return this.httpClient.fetch("api/protected/random-quote")
                .then(function (response) { return response.text(); })
                .then(function (data) { return _this.secretQuote = data; })
                .catch(function (error) {
                console.log("Error getting quote.");
            });
        };
        return RandomQuote;
    }());
    RandomQuote = __decorate([
        aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient),
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
    ], RandomQuote);
    exports.RandomQuote = RandomQuote;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('signup',["require", "exports", "aurelia-framework", "./services/authService"], function (require, exports, aurelia_framework_1, authService_1) {
    "use strict";
    var Signup = (function () {
        function Signup(auth) {
            this.auth = auth;
            this.heading = "Sign Up";
            this.email = "";
            this.password = "";
            this.signupError = "";
        }
        Signup.prototype.signup = function () {
            var _this = this;
            var userInfo = { userName: this.email, password: this.password, confirmPassword: this.password };
            return this.auth.signUp(userInfo)
                .then(function (response) {
                console.log("Signed Up!");
            })
                .catch(function (error) {
                _this.signupError = error.response;
            });
        };
        ;
        return Signup;
    }());
    Signup = __decorate([
        aurelia_framework_1.inject(authService_1.AuthService),
        __metadata("design:paramtypes", [authService_1.AuthService])
    ], Signup);
    exports.Signup = Signup;
});

define('todo',["require", "exports"], function (require, exports) {
    "use strict";
    var Todo = (function () {
        function Todo(description) {
            this.description = description;
            this.done = false;
        }
        return Todo;
    }());
    exports.Todo = Todo;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config.globalResources(['./elements/loading-indicator']);
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/loading-indicator',["require", "exports", "nprogress", "aurelia-framework"], function (require, exports, nprogress, aurelia_framework_1) {
    "use strict";
    var LoadingIndicator = (function () {
        function LoadingIndicator() {
            this.loading = false;
        }
        LoadingIndicator.prototype.loadingChanged = function (newValue) {
            if (newValue) {
                nprogress.start();
            }
            else {
                nprogress.done();
            }
        };
        return LoadingIndicator;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], LoadingIndicator.prototype, "loading", void 0);
    LoadingIndicator = __decorate([
        aurelia_framework_1.noView(['nprogress/nprogress.css'])
    ], LoadingIndicator);
    exports.LoadingIndicator = LoadingIndicator;
});

define('services/auth-filter',["require", "exports"], function (require, exports) {
    "use strict";
    var AuthFilterValueConverter = (function () {
        function AuthFilterValueConverter() {
        }
        AuthFilterValueConverter.prototype.toView = function (routes, isLoggedIn) {
            console.log(isLoggedIn);
            if (isLoggedIn)
                return routes;
            return routes.filter(function (r) { return !r.config.settings.auth; });
        };
        return AuthFilterValueConverter;
    }());
    exports.AuthFilterValueConverter = AuthFilterValueConverter;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"bootstrap/css/bootstrap.css\"></require>\r\n    <require from=\"./styles/main.css\"></require>\r\n    <require from='./nav-bar'></require>\r\n                \r\n    <nav-bar router.bind=\"router\"></nav-bar>\r\n    \r\n    <loading-indicator loading.bind=\"router.isNavigating || http.isRequesting || authService.isRequesting\"></loading-indicator>\r\n\r\n    <router-view></router-view>\r\n</template>"; });
define('text!styles/main.css', ['module'], function(module) { module.exports = "body {\r\n    padding-top: 70px;\r\n  }\r\n\r\n.page-header {\r\n  border-bottom: rgb(221, 221, 221) solid 1px;\r\n}"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\r\n    <section>\r\n        <div class=\"jumbotron\">\r\n            <div class=\"container\">\r\n            \r\n                <div class=\"page-header text-center\">\r\n                    <h1>${heading}</h1>\r\n                    </div>\r\n                <p>${info}</p>\r\n            </div>\r\n        </div>\r\n        <div class=\"container\">\r\n            <div class=\"row\">\r\n                <div class=\"col-md-2\">\r\n                    &nbsp;\r\n                </div>\r\n                <div class=\"col-md-5\">\r\n                    <h2>Login</h2>\r\n                    <p class=\"text-primary\">If you have Username and Password, you can use the button below to access the secured content using a\r\n                        token.</p>\r\n                    <p><a class=\"btn btn-info\" href=\"#/login\" role=\"button\">Login &raquo;</a></p>\r\n                </div>\r\n                <div class=\"col-md-4\">\r\n                    <h2>Sign Up</h2>\r\n                    <p class=\"text-primary\">Use the button below to create Username and Password to access the secured content using a token.</p>\r\n                    <p><a class=\"btn btn-info\" href=\"#/signup\" role=\"button\">Sign Up &raquo;</a></p>\r\n                </div>\r\n                <div class=\"col-md-2\">\r\n                    &nbsp;\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </section>\r\n</template>"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template>\r\n  <section>\r\n    <div class=\"container\">\r\n      <div class=\"col-sm-6 col-md-4 col-md-offset-4\">\r\n        <h2>${heading}</h2>    \r\n          <form role=\"form\" submit.delegate=\"login()\">\r\n            <div class=\"form-group\">\r\n              <label for=\"email\">Email</label>\r\n              <input type=\"text\" value.bind=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Email\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n              <label for=\"password\">Password</label>\r\n              <input type=\"password\" value.bind=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\">\r\n            </div>\r\n            <div class=\"checkbox\">\r\n              <label>\r\n                <input type=\"checkbox\" checked.bind=\"useRefreshTokens\"> <strong>Use Refresh Tokens</strong>\r\n              </label>\r\n            </div>\r\n            <button type=\"submit\" class=\"btn btn-primary\">Login</button>\r\n          </form>        \r\n        <hr>\r\n        <div class=\"alert alert-danger\" if.bind=\"loginError\">${loginError}</div>\r\n      </div>\r\n    </div>\r\n  </section>\r\n</template>"; });
define('text!logout.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./services/auth-filter\"></require>\r\n  <nav class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\r\n    <div class=\"container\">\r\n      <div class=\"navbar-header\">\r\n        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\r\n        <span class=\"sr-only\">Toggle Navigation</span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n      </button>\r\n      </div>\r\n      <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\r\n        <ul class=\"nav navbar-nav\">\r\n          <li repeat.for=\"row of router.navigation | authFilter: isAuthenticated\" class=\"${row.isActive ? 'active' : ''}\">\r\n            <a class=\"${row.settings.class}\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1.in\" href.bind=\"row.href\">${row.title}</a>\r\n          </li>\r\n        </ul>\r\n\r\n        <ul if.bind=\"!isAuthenticated\" class=\"nav navbar-nav navbar-right\">\r\n          <li><a href=\"/#/login\">Login</a></li>\r\n          <li><a href=\"/#/signup\">Sign Up</a></li>\r\n        </ul>\r\n\r\n        <ul if.bind=\"isAuthenticated\" class=\"nav navbar-nav navbar-right\">\r\n          <li><a href=\"#\">Welcome ${userName}</a>/li>\r\n          <li><a href=\"/#/logout\">Logout</a></li>\r\n        </ul>\r\n\r\n        <ul class=\"nav navbar-nav navbar-right\">\r\n          <li class=\"loader\" if.bind=\"router.isNavigating\">\r\n            <i class=\"fa fa-spinner fa-spin fa-2x\"></i>\r\n          </li>\r\n        </ul>\r\n      </div>\r\n    </div>\r\n  </nav>\r\n</template>"; });
define('text!random-quote.html', ['module'], function(module) { module.exports = "<template>\r\n  <section class=\"col-sm-12\">\r\n    <div class=\"container\">\r\n      <h2>${heading}</h2>\r\n      <div class=\"row au-stagger\">\r\n        <div class=\"well\">\r\n          <h4>${randomQuote}</h4>\r\n        </div>\r\n        <div>\r\n          <button class=\"btn btn-primary\" click.delegate=\"getQuote()\">Refresh</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </section>\r\n</template>"; });
define('text!secret-quote.html', ['module'], function(module) { module.exports = "<template>\r\n  <section class=\"au-animate\">\r\n    <div class=\"container\">\r\n      <h2>${heading}</h2>\r\n      <div class=\"row au-stagger\">\r\n        <div class=\"well\">\r\n          <h4>${secretQuote}</h4>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </section>\r\n</template>"; });
define('text!signup.html', ['module'], function(module) { module.exports = "<template>\r\n  <section class=\"au-animate\">\r\n    <div class=\"container\">\r\n      <div class=\"col-sm-6 col-md-4 col-md-offset-4\">\r\n      <h2>${heading}</h2>\r\n\r\n      <form role=\"form\" submit.delegate=\"signup()\">\r\n        <div class=\"form-group\">\r\n          <label for=\"email\">Email</label>\r\n          <input type=\"text\" value.bind=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Email\">\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label for=\"password\">Password</label>\r\n          <input type=\"password\" value.bind=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\">\r\n        </div>\r\n        <button type=\"submit\" class=\"btn btn-primary\">Signup</button>\r\n      </form>\r\n      <hr>\r\n      <div class=\"alert alert-danger\" if.bind=\"signupError\">${signupError}</div>\r\n    </div>\r\n    </div>\r\n  </section>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map