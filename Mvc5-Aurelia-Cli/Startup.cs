using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Mvc5_Aurelia_Cli.Startup))]
namespace Mvc5_Aurelia_Cli
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
