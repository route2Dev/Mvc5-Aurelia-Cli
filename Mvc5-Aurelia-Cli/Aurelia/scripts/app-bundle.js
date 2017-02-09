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

define('app',["require", "exports", "./todo"], function (require, exports, todo_1) {
    "use strict";
    var App = (function () {
        function App() {
            this.heading = "Todos";
            this.todos = [];
            this.todoDescription = '';
        }
        App.prototype.addTodo = function () {
            if (this.todoDescription) {
                this.todos.push(new todo_1.Todo(this.todoDescription));
                this.todoDescription = '';
            }
        };
        App.prototype.removeTodo = function (todo) {
            var index = this.todos.indexOf(todo);
            if (index !== -1) {
                this.todos.splice(index, 1);
            }
        };
        return App;
    }());
    exports.App = App;
});

define('auth-config',["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        baseUrl: '../auth'
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
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

define('quotes-app',["require", "exports", "bootstrap"], function (require, exports) {
    "use strict";
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('quotes-main',["require", "exports", "./auth-config", "./environment"], function (require, exports, auth_config_1, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources')
            .plugin('paulvanbladel/aurelia-auth', function (baseConfig) {
            baseConfig.configure(auth_config_1.default);
            if (environment_1.default.debug) {
                aurelia.use.developmentLogging();
            }
            if (environment_1.default.testing) {
                aurelia.use.plugin('aurelia-testing');
            }
            aurelia.start().then(function () { return aurelia.setRoot(); });
        });
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
define('nav-bar',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-auth"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_auth_1) {
    "use strict";
    var NavBar = (function () {
        function NavBar(auth) {
            this.auth = auth;
            this._isAuthenticated = false;
            this.router = null;
        }
        Object.defineProperty(NavBar.prototype, "isAuthenticated", {
            get: function () {
                return this.auth.isAuthenticated();
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
        aurelia_framework_2.inject(aurelia_auth_1.AuthService),
        __metadata("design:paramtypes", [aurelia_auth_1.AuthService])
    ], NavBar);
    exports.NavBar = NavBar;
});

define('quotes-router-config',["require", "exports", "aurelia-auth"], function (require, exports, aurelia_auth_1) {
    "use strict";
    var default_1 = (function () {
        function default_1() {
        }
        default_1.prototype.configureRouter = function (config, router) {
            config.title = 'Random Quotes App';
            config.addPipelineStep('authorize', aurelia_auth_1.AuthorizeStep);
            config.map([
                { route: ['', 'welcome'], name: 'welcome', moduleId: './welcome', nav: true, title: 'Welcome' },
                { route: 'random-quote', name: 'random-quote', moduleId: './random-quote', nav: true, title: 'Random Quote' },
                { route: 'secret-quote', name: 'secret-quote', moduleId: './secret-quote', nav: true, title: 'Super Secret Quote', auth: true },
                { route: 'signup', name: 'signup', moduleId: './signup', nav: false, title: 'Signup', authRoute: true },
                { route: 'login', name: 'login', moduleId: './login', nav: false, title: 'Login', authRoute: true },
                { route: 'logout', name: 'logout', moduleId: './logout', nav: false, title: 'Logout', authRoute: true }
            ]);
            this.router = router;
        };
        ;
        return default_1;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <h1>${heading}</h1>\n\n  <form submit.trigger=\"addTodo()\">\n    <input type=\"text\" value.bind=\"todoDescription\"/>\n    <button type=\"submit\">Add Todo</button>\n  </form>\n\n  <ul>\n    <li repeat.for=\"todo of todos\">\n      <input type=\"checkbox\" checked.bind=\"todo.done\">\n      <span css=\"text-decoration: ${todo.done ? 'line-through' : 'none'}\">\n        ${todo.description}\n      </span>\n      <button click.trigger=\"removeTodo(todo)\">Remove</button>\n    </li>    \n  </ul>\n</template>\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template>\r\n    <ul class=\"nav navbar-nav\">\r\n        <li repeat.for=\"row of router.navigation | authFilter: isAuthenticated\" class=\"${row.isActive ? 'active' : ''}\">\r\n            <a data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1.in\" href.bind=\"row.href\">${row.title}</a>\r\n        </li>\r\n    </ul>\r\n\r\n    <ul if.bind=\"!isAuthenticated\" class=\"nav navbar-nav navbar-right\">\r\n        <li><a href=\"/#/login\">Login</a></li>\r\n        <li><a href=\"/#/signup\">Signup</a></li>\r\n    </ul>\r\n\r\n    <ul if.bind=\"isAuthenticated\" class=\"nav navbar-nav navbar-right\">\r\n        <li><a href=\"/#/logout\">Logout</a></li>\r\n    </ul>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map