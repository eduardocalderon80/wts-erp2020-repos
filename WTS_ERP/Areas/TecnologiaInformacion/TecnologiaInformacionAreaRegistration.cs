using System.Web.Mvc;

namespace WTS_ERP.Areas.TecnologiaInformacion
{
    public class TecnologiaInformacionAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "TecnologiaInformacion";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "TecnologiaInformacion_default",
                "TecnologiaInformacion/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}