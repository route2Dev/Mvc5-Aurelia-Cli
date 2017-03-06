export class AuthFilterValueConverter {
    toView(routes, isLoggedIn) {
        console.log(isLoggedIn);
        if (isLoggedIn)
            return routes;

        return routes.filter(r => !r.config.settings.auth);
    }
}