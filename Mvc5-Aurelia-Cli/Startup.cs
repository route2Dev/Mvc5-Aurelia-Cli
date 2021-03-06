﻿using Microsoft.Owin;
using Mvc5_Aurelia_Cli.Models;
using Owin;
using System.Data.Entity;
using System.Web.Http;

[assembly: OwinStartupAttribute(typeof(Mvc5_Aurelia_Cli.Startup))]
namespace Mvc5_Aurelia_Cli
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            HttpConfiguration config = new HttpConfiguration();          

            WebApiConfig.Register(config);

            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);

            Database.SetInitializer(new MigrateDatabaseToLatestVersion<ApplicationDbContext, Migrations.Configuration>());
        }
    }
}
