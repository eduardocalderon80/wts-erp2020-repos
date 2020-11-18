using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BE_ERP;
using BE_ERP.Planeamiento;
using BL_ERP;
using BL_ERP.Planeamiento;
using BE_ERP.Laboratorio;
using BL_ERP.Laboratorio;

namespace WTS_ERP.Areas.Planeamiento
{
    public class OrdenCompraTextilController : Controller
    {
        // GET: Planeamiento/OrdenCompraTextil
        public ActionResult Index()
        {
            return View();
        }

        public string OrdenCompraTextil_Master()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = "{\"usuarioad\":\"" + _.GetUsuario().UsuarioAD.ToString().Trim() + "\"}";
            string data = oMantenimiento.get_Data("usp_PO_OC_Master", par, true, Util.Intranet);
            return data != null ? data : string.Empty;
        }

        public string OrdenCompraTextil_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "usuarioad", _.GetUsuario().UsuarioAD.ToString());
            string data = oMantenimiento.get_Data("usp_PO_OC_List", par, true, Util.Intranet);
            return data != null ? data : string.Empty;
        }

        public string OrdenCompraTextil_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_PO_OC_Insert", parhead, Util.Intranet, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public JsonResult OrdenCompraTextil_Export_Excel(string par)
        {
            var jsonsession = new JsonResponse();
            var respuesta = new JsonResponse();

            string codigofabrica = Convert.ToString(_.Get_Par(par, "codigofabrica"));
            string codigocliente = Convert.ToString(_.Get_Par(par, "codigocliente"));
            string fechadesde = Convert.ToString(_.Get_Par(par, "fechadesde"));
            string fechahasta = Convert.ToString(_.Get_Par(par, "fechahasta"));
            int idoc = Convert.ToInt32(_.Get_Par(par, "idoc"));
            string usuarioad = Convert.ToString(_.GetUsuario().UsuarioAD.ToString());


            blOrdenCompraTextil blOrdenCompraTextil = new blOrdenCompraTextil();
            List<OrdenCompraTextil> listreporte = blOrdenCompraTextil.OrdenCompraTextil_Export_Excel(Util.Intranet, codigofabrica, codigocliente, fechadesde, fechahasta, idoc, usuarioad);
            string strlistacabecera = string.Empty,
                strlistabody = string.Empty,
                strtitulodocumento = string.Empty,
                strestado = string.Empty;
            int totalfilas = 0, contador = 0;
            totalfilas = listreporte.Count;

            string titulohoja = "Listado";

            strlistacabecera = "PO¬" +
                            "Estilo¬" +
                            "Lote¬" +
                            "Color¬" +
                            "Cantidad¬" +
                            "Fecha_Creacion¬" +
                            "Dias_Sin_OC¬" +
                            "Fecha_Fabrica_Original¬" +
                            "LeadTime_Fabrica¬" +
                            "Tela¬" +
                            "Fabrica¬" +
                            "Cliente¬" +
                            "Vendor¬" +
                            "Division¬" +
                            "Temporada¬" +
                            "Descripcion¬" +
                            "Controller¬" +
                            "Envio¬" +
                            "OC¬" +
                            "Proveedor_Tela¬" +
                            "Fecha_OC";

            if (listreporte.Count > 0)
            {
                foreach (var item in listreporte)
                {
                    contador++;
                    if (contador <= totalfilas)
                    {
                        strlistabody += "^" + item.po + "¬" +
                        item.estilo + "¬" +
                        item.lote + "¬" +
                        item.color + "¬" +
                        item.cantidad + "¬" +
                        item.fecha_creacion + "¬" +
                        item.dias_sinoct + "¬" +
                        item.fecha_fab_original + "¬" +
                        item.leadtime_fabrica + "¬" +
                        item.tela + "¬" +
                        item.fabrica + "¬" +
                        item.cliente + "¬" +
                        item.vendedor + "¬" +
                        item.division + "¬" +
                        item.temporada + "¬" +
                        item.descripcion + "¬" +
                        item.controller + "¬" +
                        item.envio + "¬" +
                        item.oc + "¬" +
                        item.proveedortela + "¬" +
                        item.fechaoc;
                    }
                }
            }

            byte[] filecontent = blOrdenCompraTextil.crearExcel_Reporte_OrdenCompraTextil(titulohoja, strlistacabecera, strlistabody, strtitulodocumento, 3);

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
            tituloreporte = "Reporte_OC.xlsx";
            System.Web.HttpContext.Current.Session.Remove("excelfacturav");
            return File(filecontent, oblReporteLab.ExcelContentType(), tituloreporte);
        }

    }
}