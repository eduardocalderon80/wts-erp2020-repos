using System.Web.Mvc;

namespace WTS_ERP.Areas.PackingList
{
    public class PackingListAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "PackingList";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "PackingList_default",
                "PackingList/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}