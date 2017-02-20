using Microsoft.Owin;
using Owin;
using System.Web.Http;

[assembly: OwinStartupAttribute(typeof(Mvc5_Aurelia_Cli.Startup))]
namespace Mvc5_Aurelia_Cli
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);

            ConfigureAuth(app);

            HttpConfiguration config = new HttpConfiguration();          

            WebApiConfig.Register(config);

            app.UseWebApi(config);

        }
    }
}
