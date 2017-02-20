using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Mvc5_Aurelia_Cli.Entities;

namespace Mvc5_Aurelia_Cli.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            var clientId = string.Empty;
            var clientSecret = string.Empty;
            Client client = null;

            if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
            {
                context.TryGetFormCredentials(out clientId, out clientSecret);
            }

            if (context.ClientId == null)
            {
                context.Validated();
                return Task.FromResult<object>(null);
            }

            return base.ValidateClientAuthentication(context);
        }
    }
}