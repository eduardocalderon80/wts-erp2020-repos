using System.Web.Mvc;

namespace WTS_ERP.Areas.DesarrolloTextil
{
    public class DesarrolloTextilAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "DesarrolloTextil";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "DesarrolloTextil_default",
                "DesarrolloTextil/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}