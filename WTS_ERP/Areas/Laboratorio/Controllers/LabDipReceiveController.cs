using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BE_ERP;
using BE_ERP.Laboratorio;
using BL_ERP;
using BL_ERP.Laboratorio;

namespace WTS_ERP.Areas.Laboratorio.Controllers
{
    public class LabDipReceiveController : Controller
    {
        blLog logerror = new blLog();
        blLabdip blLabdip = new blLabdip();

        // GET: Laboratorio/LabDipReceive
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _partida()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _Detalle()
        {
            return View();
        }

        public string LabDipReceive_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            //string par = "{\"idgrupopersonal\":\"" + _.Get("idgrupopersonal") + "\"}";
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("usp_Labdip_List", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string LabDipReceive_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_Labdip_Status_Laboratorio", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string grabarNumeroPartida()
        { 
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string data = oMantenimiento.get_Data("usp_Labdip_Insert_Partida", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string LabDipReceive_Get()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("usp_Labdip_Get", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public JsonResult LabDipReceive_Export(string par)
        {
            var jsonsession = new JsonResponse();
            var respuesta = new JsonResponse();

            int idcliente = Convert.ToInt32(_.Get_Par(par, "idcliente"));
            int estadolab = Convert.ToInt32(_.Get_Par(par, "estadolab"));

            blLabdip blLabdip = new blLabdip();
            List<Labdip> listreporte = blLabdip.LabDipReceive_Export(Util.ERP, idcliente, estadolab);
            string strlistacabecera = string.Empty, 
                strlistabody = string.Empty, 
                strtitulodocumento = string.Empty,
                strestado = string.Empty;
            int totalfilas = 0, contador = 0;
            totalfilas = listreporte.Count;

            string titulohoja = "Listado";

            strlistacabecera = "Color¬" +
                            "Fabric¬" +
                            "Standard¬" +
                            "Tipo¬" +
                            "Aprobador Por¬" +
                            "Cliente¬" +
                            "Tintoreria¬" +
                            "Temporada¬" +
                            "Alternativa¬" +
                            "Cod. Tintoreria¬" +                            
                            "Original¬" +
                            "Num. Partida¬" +
                            "S. Luz¬" +
                            "S. F. Seco¬" +
                            "S. F. Humedo¬" +
                            "Fec. Creacion¬" +
                            "Fec. Envio¬" +
                            "Fec. Recibido¬" +
                            "Comentario";

            if (listreporte.Count > 0)
            {
                foreach (var item in listreporte)
                {
                    contador++;
                    if (contador <= totalfilas)
                    {
                        strlistabody += "^" + item.color + "¬" +
                        item.fabric + "¬" +
                        item.standard + "¬" +
                        item.tipo + "¬" +
                        item.aprobadopor + "¬" +
                        item.cliente + "¬" +
                        item.tintoreria + "¬" +
                        item.temporada + "¬" +
                        item.alternativa + "¬" +
                        item.codigotintoreria + "¬" +
                        item.original + "¬" +
                        item.numeropartida + "¬" +
                        item.solidezluz + "¬" +
                        item.solidezhumedo + "¬" +
                        item.solidezseco + "¬" +
                        item.fechacreacion + "¬" +
                        item.fechaenvio + "¬" +
                        item.fecharecibido + "¬" +
                        item.comentario ;
                    }
                }
            }

            byte[] filecontent = blLabdip.crearExcel_Reporte_Labdips(titulohoja, strlistacabecera, strlistabody, strtitulodocumento, 3);

            jsonsession.Data = filecontent;

            System.Web.HttpContext.Current.Session["excelfacturav"] = jsonsession;

            respuesta.Success = true;
            respuesta.Message = "Exito";
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }


        public FileContentResult descargarexcel_reporte()
        {
            blReporteLab oblReporteLab = new blReporteLab();
            byte[] filecontent;
            string tituloreporte = string.Empty;
            var jsonsession = (JsonResponse)System.Web.HttpContext.Current.Session["excelfacturav"];
            filecontent = (byte[])jsonsession.Data;
            //tituloreporte = jsonsession.Message + ".xlsx";
            tituloreporte = "Reporte_Labdips.xlsx";
            System.Web.HttpContext.Current.Session.Remove("excelfacturav");
            return File(filecontent, oblReporteLab.ExcelContentType(), tituloreporte);
        }

    }
}