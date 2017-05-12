using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Mvc5_Aurelia_Cli.Handlers
{
    public class CustomHeaderHandler : DelegatingHandler
    {
       async protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var response = await base.SendAsync(request, cancellationToken);

            response.Headers.Add("CACHE-CONTROL", "NO-CACHE");            

            return response;
        }
    }
}
