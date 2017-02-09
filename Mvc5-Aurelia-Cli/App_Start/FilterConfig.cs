using System.Web;
using System.Web.Mvc;

namespace Mvc5_Aurelia_Cli
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
