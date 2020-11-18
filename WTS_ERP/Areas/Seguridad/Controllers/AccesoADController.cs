using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Web.Mvc;
using WTS_ERP.Models;
using Newtonsoft.Json.Linq;
using BL_ERP;
using System.IO;
using System.Text;
using BE_ERP;
using Utilitario;
using Newtonsoft.Json;
using System.Threading;
using System.Net.Mail;
using System.Net.Mime;
using System.Text.RegularExpressions;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Utilitario.Seguridad;
using System.Collections;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
 

namespace WTS_ERP.Areas.Seguridad.Controllers
{
    public class AccesoADController : Controller
    {
        // GET: Seguridad/AccesoAD
        public ActionResult Index()
        {
            return View();
        }


        public string get_access()
        {
            string usuarioAD = _.Post("usuarioAD");
            string contrasena = _.Post("password");
            AccesoAD accesoAD = new AccesoAD();
            string tipoaccesousuario = accesoAD.Access_Valid(usuarioAD, contrasena);
            string resultado = usuarioAD + '¬' + contrasena + '¬' + tipoaccesousuario;
            return resultado;
        }
        
        

    }
}
