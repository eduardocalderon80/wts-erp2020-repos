using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using BE_ERP;

namespace WTS_ERP.Models
{
    public class AccessSecurity : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            beUser oUsuario = (beUser)System.Web.HttpContext.Current.Session["Usuario"];
            if (oUsuario == null)
            {
                filterContext.Result = new RedirectResult("~/Home/LoginERP");
                ///filterContext.Result = new RedirectResult("~/Redireccionar/redirectlogincerrarsesion");  // :EDU PARA REGRESAR AL LOGIN DEL ERP1
                return;
            }
           
            base.OnActionExecuting(filterContext);
        }
    }
}