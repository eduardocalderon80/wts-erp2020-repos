using System.Web.Mvc;

namespace WTS_ERP.Areas.PortalFabrica
{
    public class PortalFabricaAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "PortalFabrica";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "PortalFabrica_default",
                "PortalFabrica/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}