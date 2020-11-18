using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using BE_ERP;
using WTS_ERP.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Configuration;

using System.Security.Principal;

//Luis
using Utilitario.Seguridad;
using WTS_ERP.Areas.Seguridad.Controllers;

namespace WTS_ERP.Controllers
{
    public class HomeController : Controller
    {
        // GET: Seguridad
        public ActionResult LoginERP(string redirect)
        {
           
            if (System.Web.HttpContext.Current.Session["Usuario"] != null)
            {
                System.Web.HttpContext.Current.Session["Usuario"] = null;
                System.Web.HttpContext.Current.Session.Abandon();
                System.Web.HttpContext.Current.Session.Clear();
            }
            /*
            try
            {

                WindowsIdentity currentUser = WindowsIdentity.GetCurrent();
                string[] separadas;

                separadas = Convert.ToString(currentUser.Name).Split('\\');
                //string usuario = separadas[1];
                string usuario = "";

                this.accesoERPAD(usuario);


                //Console.WriteLine(usuario);
                //Console.ReadLine();
            }
            catch (Exception ex)
            {
                return View();
                //Console.Write("Acceso Denegado");
                //Console.ReadLine();
            }
            */
            ViewBag.redirect = redirect;
            return View();
        }

        // Principal
        [AccessSecurity]
        public ActionResult Index()
        {
            if (Session["Util"] != null)
            {
                // url
                ViewBag.par = ((beUtil)Session["Util"]).control;
            }
            string ruta = ConfigurationManager.AppSettings["rutaImgPersonal"].ToString();           
            ViewBag.PathStyleWeb = String.Format("'{0}'", ruta);

            return View();
        }
        
        /* Luis */
        //Login

        //public string accesoERP()
        //{
        //    blMantenimiento odata = new blMantenimiento();
        //    string par = string.Format("{0}^{1}", _.Post("usuario"), _.Post("password"));

            
        //    //string valormodolocal = ConfigurationManager.AppSettings["ejecutarmodolocal"].ToString();
        //    string respuesta = "";
        //    respuesta = odata.get_Data("uspLogin_v2", par, true, Util.SeguridadERP);

        //    if (respuesta != "")
        //    {
        //        int total = respuesta.Length;
        //        string xd = respuesta.Substring(1, total - 2);

        //        beUtil util = new beUtil();
        //        util = JsonConvert.DeserializeObject<beUtil>(xd);
        //        util.control = ""; //url;
        //        if (util.usuario != string.Empty)
        //        {
        //            System.Web.HttpContext.Current.Session.Add("Util", util);

        //            beUser Usuario = JsonConvert.DeserializeObject<beUser>(util.usuario);
        //            if (Usuario.IdEmpresa == 0) {
        //                Usuario.IdEmpresa = 1;
        //            }
        //            System.Web.HttpContext.Current.Session.Add("Usuario", Usuario);
        //        }

        //    }

        //    return respuesta;
        //}


        //Luis

        public string accesoERP()
        {
            blMantenimiento odata = new blMantenimiento();     

            string usuarioAD = _.Post("usuarioAD");
            string contrasena = _.Post("password");
            string tipoaccesousuario = _.Post("tipoaccesousuario");
            

            string par = string.Format("{0}^{1}^{2}", usuarioAD, contrasena, tipoaccesousuario);
            //// ESTO VALE ACTIVAR LUEGO
            string respuesta = odata.get_Data("usp_AccesAD", par, true, Util.SeguridadERP);
            //string respuesta = odata.get_Data("usp_AccesAD_DELETE", par, true, Util.SeguridadERP);

            if (respuesta != "")
            {
                int total = respuesta.Length;
                string xd = respuesta.Substring(1, total - 2);

                beUtil util = new beUtil();
                util = JsonConvert.DeserializeObject<beUtil>(xd);
                util.control = ""; //url;
                if (util.usuario != string.Empty)
                {
                    System.Web.HttpContext.Current.Session.Add("Util", util);

                    beUser Usuario = JsonConvert.DeserializeObject<beUser>(util.usuario);
                    if (Usuario.IdEmpresa == 0)
                    {
                        Usuario.IdEmpresa = 1;
                    }
                    //if (tipoaccesousuario == "ad") {
                    //    Usuario.Contrasena = "";                        
                    //}

                    //Usuario.tipoaccesousuario = tipoaccesousuario;

                    System.Web.HttpContext.Current.Session.Add("Usuario", Usuario);
                }

            }

            return respuesta;
        }



        public string getMenu()
        {
            beUtil util = System.Web.HttpContext.Current.Session["Util"] as beUtil;

            string sutil = JsonConvert.SerializeObject(util);
            return sutil;
        }
    }
}