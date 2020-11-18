using System.Web.Mvc;

namespace WTS_ERP.Areas.PO
{
    public class POAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "PO";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "PO_default",
                "PO/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}