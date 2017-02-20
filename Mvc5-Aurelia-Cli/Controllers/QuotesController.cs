using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Web.Hosting;
using System.Web.Http;

namespace Mvc5_Aurelia_Cli.Controllers
{
    public class QuotesController : ApiController
    {
        const string fileName = @"~/App_Data/quotes.json";

        [Route("api/random-quote")]
        public IHttpActionResult GetRandomQuote()
        {
            var quote = GetQuote();

            return Ok(quote);
        }

        [Authorize]
        [Route("api/protected/random-quote")]
        public IHttpActionResult GetProtectedQutoe()
        {
            var quote = GetQuote();

            return Ok(quote);
        }

        private static string GetQuote()
        {
            var quotes = File.ReadAllLines(HostingEnvironment.MapPath(fileName));

            var json = JArray.Parse(File.ReadAllText(HostingEnvironment.MapPath(fileName)));

            var random = new Random();
            var quote = json[random.Next(0, json.Count - 1)];
            return quote.ToString();
        }
    }
}
