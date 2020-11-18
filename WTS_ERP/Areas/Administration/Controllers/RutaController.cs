using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Text;
using System.IO;
using System.Web;
using System.Configuration;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using Excel;
using Newtonsoft.Json.Linq;
using System.Net.Mail;
using System.Net;
using System.Web.UI;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.io;
using BE_ERP.Administracion;

namespace WTS_ERP.Areas.Administration.Controllers
{
    public class RutaController : Controller
    {
        [AccessSecurity]
        // GET: Administration/Ruta/Index
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        // GET: Administration/Ruta/NewRuta
        public ActionResult NewRuta()
        {
            return View();
        }

        [AccessSecurity]
        // GET: Administration/Ruta/QueryRuta
        public ActionResult QueryRuta()
        {
            return View();
        }

        [AccessSecurity]
        // GET: Administration/Ruta/UrgentRuta
        public ActionResult UrgentRuta()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult UrgentRutaBef()
        {
            return View();
        }

        [AccessSecurity]
        // GET: Administration/Ruta/NewDestination
        public ActionResult NewDestination()
        {
            return View();
        }

        [AccessSecurity]
        // GET: Administration/Ruta/NewRutaTextil
        public ActionResult NewRutaTextil()
        {
            return View();
        }


        [AccessSecurity]
        public string Upload_Combos()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            string strReturn = "";
            string dataUsuario = "";
            string dataMobilidad = "";
            string par = "{\"valor\":\"" + _.GetUsuario().IdUsuario.ToString() + "\"}";

            dataUsuario = _.GetUsuario().NombreCompleto.ToString().ToUpper();
            dataMobilidad = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaLoadMobilidadIni", par, false, Util.ERP) : string.Empty;

            strReturn = dataUsuario + '¬' + dataMobilidad;

            return strReturn;

        }


        [AccessSecurity]
        public string Update_StatusTaxi()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;

            string par = "{\"idmensaje\":\"" + _.Get("valor") + "\"}";

            var dataResult = id < 0 ? oMantenimiento.get_Data("usp_UpdateEstatusTaxiRoute", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }


        /*** Destinos ***/

        [AccessSecurity]
        public string loadRoute()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;

            string par = "{\"valor\":\"" + _.GetUsuario().IdUsuario.ToString() + "\"}";

            var dataResult = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaLoadRouteIni", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        [AccessSecurity]
        public string loadAllRoutePostResult(string idruta)
        {
            blMantenimiento oMantenimiento = new blMantenimiento();

            string par = "{\"valor\":\"" + idruta + "\"}";

            var dataResult = oMantenimiento.get_Data("usp_MensajeriaRoute_List", par, false, Util.ERP);

            return dataResult;
        }

        [AccessSecurity]
        public string loadAllRouteEdit()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;

            string par = "{\"valor\":\"" + _.Get("ruta") + "\"}";

            var dataResult = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaRoute_List", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        [AccessSecurity]
        public string LoadRouteDetails()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;

            string par = "{\"valor\":\"" + _.Get("iddestino") + "\"}";

            var dataResult = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaRoute_Details", par, false, Util.ERP) : string.Empty;

            return dataResult;

        }

        [AccessSecurity]
        public string Insert_NewDestination()
        {
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario.ToString());
            string ruta = _.Get_Par(par, "valor_idroute");
            blMantenimiento oMantenimiento = new blMantenimiento();
            int rows = oMantenimiento.save_Rows("usp_MensajeriaRoute_Insert", par, Util.ERP);
            string mensaje = _.Mensaje("add", rows > 0, loadAllRoutePostResult(ruta), rows);
            return mensaje;
        }

        [AccessSecurity]
        public string Update_Destination()
        {
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            string ruta = _.Get_Par(par, "valor_idroute");
            blMantenimiento oMantenimiento = new blMantenimiento();
            int rows = oMantenimiento.save_Rows("usp_MensajeriaRoute_Update", par, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, loadAllRoutePostResult(ruta), rows);
            return mensaje;
        }

        [AccessSecurity]
        public string Delete_Destination()
        {
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            int rows = oMantenimiento.save_Rows("usp_MensajeriaRoute_Delete", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, "", rows);
            return mensaje;
        }

        [AccessSecurity]
        public string Upload_ComboDestino()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;

            string par = "{\"valor\":\"" + _.Get("valor") + "\"}";

            var dataDestino = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaLoadDestinoIni", par, false, Util.ERP) : string.Empty;

            return dataDestino;
        }

        /*** Emergencia ***/

        [AccessSecurity]
        public string Load_RouteEmergencyAll()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;

            string par = "{\"IdUsuario\":\"" + _.GetUsuario().IdUsuario.ToString() + "\"}";

            var dataResult = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaLoadAllEmergencia", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        [AccessSecurity]
        public string load_CostoEmergencia()
        {
            string thisDay = DateTime.Today.ToString("yyyyMMdd");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string strResult = "";
            int id = -1;
            string dataResultRoute = "";
            string par = "{\"fechahoy\":\"" + thisDay + "\"}";
            dataResultRoute = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaLoadCostEmergencyIni", par, false, Util.ERP) : string.Empty;

            strResult = dataResultRoute;

            return strResult;

        }

        [AccessSecurity]
        public string Insert_NewEmergency()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;

            string par = "{\"IdUsuario\":\"" + _.GetUsuario().IdUsuario.ToString() + "\",\"IdCliente\":\"" + _.Get("IdCliente").Replace('"', ' ') + "\"," +
                            "\"IdDestino\":\"" + _.Get("IdDestino") + "\",\"Destino\":\"" + _.Get("Destino") + "\"," +
                            "\"Hora\":\"" + _.Get("Hora") + "\",\"Dia\":\"" + _.Get("Dia") + "\",\"Contacto\":\"" + _.Get("Contacto") + "\"," +
                             "\"Razon\":\"" + _.Get("Razon").Replace('"', ' ') + "\",\"Observacion\":\"" + _.Get("Observacion").Replace('"', ' ') + "\"," +
                             "\"UsuarioCreacion\":\"" + _.GetUsuario().IdUsuario.ToString() + "\",\"Ruta\":\"" + _.Get("Ruta") + "\"," +
                             "\"TipoMotivo\":\"" + _.Get("TipoMotivo") + "\",\"TipoServicio\":\"" + _.Get("TipoServicio") + "\"}";


            var dataDestino = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaInsertNewEmergency", par, false, Util.ERP) : string.Empty;

            return dataDestino;
        }
        [AccessSecurity]
        public string EmergenciaSave()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            
            int Id = int.Parse( _.Get("IdEmergencia"));

            string par = "{\"IdUsuario\":\"" + _.GetUsuario().IdUsuario.ToString() + "\",\"IdCliente\":\"" + _.Get("IdCliente").Replace('"', ' ') + "\"," +
                            "\"IdDestino\":\"" + _.Get("IdDestino") + "\","+ "\"IdEmergencia\":\"" + _.Get("IdEmergencia") + "\",\"Costo\":\"" + _.Get("Costo") + "\",\"Destino\":\"" + _.Get("Destino") + "\"," +
                            "\"Hora\":\"" + _.Get("Hora") + "\",\"Dia\":\"" + _.Get("Dia") + "\",\"Contacto\":\"" + _.Get("Contacto") + "\"," +
                             "\"Razon\":\"" + _.Get("Razon").Replace('"', ' ') + "\",\"Observacion\":\"" + _.Get("Observacion").Replace('"', ' ') + "\"," +
                             "\"UsuarioCreacion\":\"" + _.GetUsuario().IdUsuario.ToString() + "\",\"Ruta\":\"" + _.Get("Ruta") + "\"," +
                             "\"TipoMotivo\":\"" + _.Get("TipoMotivo") + "\",\"TipoServicio\":\"" + _.Get("TipoServicio") + "\"," +
                             "\"IdUsuarioShip\":\"" + _.Get("IdUsuarioShip") + "\",\"AprobadoPor\":\"" + _.Get("AprobadoPor") +
                             "\"}";

            string store = "uspMensajeriaEmergenciasInsertar";
            string accion = "new";
            if (Id > 0)
            {
                store = "uspMensajeriaEmergenciasActualizar";
                accion = "edit";
            }
            
            int idresult = accion == "new" ? oMantenimiento.save_Row_Out(store, par, Util.ERP) : oMantenimiento.save_Row(store, par, Util.ERP);
            string oresult= _.Mensaje(accion, idresult > 0, "", accion=="new"? idresult: Id);
            //var dataDestino = id < 0 ? oMantenimiento.get_Data(store, par, false, Util.ERP) : string.Empty;
            return oresult;
        }


        [AccessSecurity]
        public string EmergenciaTaxiSave()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();

            int Id = int.Parse(_.Get("IdEmergencia"));

            string par = "{\"IdUsuario\":\"" + _.GetUsuario().IdUsuario.ToString() + "\",\"IdCliente\":\"" + _.Get("IdCliente").Replace('"', ' ') + "\"," +
                            "\"IdDestino\":\"" + _.Get("IdDestino") + "\"," + "\"IdEmergencia\":\"" + _.Get("IdEmergencia") + "\",\"Costo\":\"" + _.Get("Costo") + "\",\"Destino\":\"" + _.Get("Destino") + "\"," +
                            "\"Hora\":\"" + _.Get("Hora") + "\",\"Dia\":\"" + _.Get("Dia") + "\",\"Contacto\":\"" + _.Get("Contacto") + "\"," +
                             "\"Razon\":\"" + _.Get("Razon").Replace('"', ' ') + "\",\"Observacion\":\"" + _.Get("Observacion").Replace('"', ' ') + "\"," +
                             "\"UsuarioCreacion\":\"" + _.GetUsuario().IdUsuario.ToString() + "\",\"Ruta\":\"" + _.Get("Ruta") + "\"," +
                             "\"TipoMotivo\":\"" + _.Get("TipoMotivo") + "\",\"TipoServicio\":\"" + _.Get("TipoServicio") + "\"," +
                             "\"IdUsuarioShip\":\"" + _.Get("IdUsuarioShip") + "\",\"AprobadoPor\":\"" + _.Get("AprobadoPor") +
                             "\"}";

            string store = "uspMensajeriaEmergenciasTaxiInsertar";
            string accion = "new";
            if (Id > 0)
            {
                store = "uspMensajeriaEmergenciasActualizar";
                accion = "edit";
            }

            int idresult = accion == "new" ? oMantenimiento.save_Row_Out(store, par, Util.ERP) : oMantenimiento.save_Row(store, par, Util.ERP);
            string oresult = _.Mensaje(accion, idresult > 0, "", accion == "new" ? idresult : Id);            
            return oresult;
        }

        [AccessSecurity]
        public string Update_StatusEmergencia()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;

            string par = "{\"IdEmergencia\":\"" + _.Get("IdEmergencia") + "\",\"TipoMovilidad\":\"" + _.Get("TipoMovilidad") + "\",\"IdUsuario\":\"" + _.GetUsuario().IdUsuario.ToString() + "\"}";

            var dataResult = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaProgramacionEmergenciaUpdate", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        [AccessSecurity]
        public string update_RouteEmergencyMobility()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            //string par = "{\"IdEmergencia\":\"" + _.Get("IdEmergencia") + "\",\"idusuarioship\":\"" + _.Get("idusuarioship") + "\"}";
            string par = "{\"IdEmergencia\":\"" + _.Get("IdEmergencia") + "\",\"IdUsuarioShip\":\"" + _.Get("IdUsuarioShip") + "\"}";

            var dataDestino = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaProgramacionEmergenciaDelete", par, false, Util.ERP) : string.Empty;

            return dataDestino;
        }

        [AccessSecurity]
        public string delete_RouteEmergency()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            string par = "{\"IdEmergencia\":\"" + _.Get("IdEmergencia") + "\",\"IdUsuario\":\"" + _.GetUsuario().IdUsuario.ToString() + "\"}";

            var dataDestino = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaDeleteEmergencia", par, false, Util.ERP) : string.Empty;

            return dataDestino;

        }

        [AccessSecurity]
        public string Upload_Aprueba()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            string strResult = "";
            string dataUsuario = "";
            string par = "{\"valor\":\"" + _.GetUsuario().IdUsuario.ToString() + "\"}";

            dataUsuario = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaLoadApruebaEmergencia", par, false, Util.ERP) : string.Empty;

            strResult = dataUsuario;

            return strResult;
        }

        [AccessSecurity]
        public string valid_SaveUser()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string strResult = "";
            string strUsuario = _.GetUsuario().IdUsuario.ToString();
            string strPerfil = _.GetUsuario().PerfilesNombres.ToString();

            if (strUsuario == "118" || strUsuario == "49" || strUsuario == "93" || strUsuario == "318")
                strResult = "OK" + "¬" + strPerfil;
            else
                strResult = "Error" + "¬" + strPerfil;

            return strResult;
        }

        [AccessSecurity]
        public string Update_CostoEmergencia()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;

            string par = "{\"idemergencia\":\"" + _.Get("idemergencia") + "\",\"costo\":\"" + _.Get("costo") + "\"}";

            var dataResult = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaCostoEmergenciaUpdate", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }




        /*** Mensaje ***/
        [AccessSecurity]
        public string Load_Usuarios_ShipBy()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = " ";
            string dataResult = oMantenimiento.get_Data("usp_MensajeriaListarPersonal", par, true, Util.ERP);
            return dataResult;
        }


        [AccessSecurity]
        public string Load_RouteControl()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            string strResult = "";
            string dataResultRoute = "";
            string dataResultDriver = "";
            string dataUserValid = "";

            string par = "{\"Cierre\":\"" + _.Get("Cierre") + "\",\"Dia\":\"" + _.Get("Dia") + "\"}";
            string strUsuario = _.GetUsuario().IdUsuario.ToString();

            if (strUsuario == "118" || strUsuario == "49" || strUsuario == "93" || strUsuario == "318")
                dataUserValid = "OK";
            else
                dataUserValid = "Error";

            dataResultRoute = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaLoadEnviosControlHoyIni", par, false, Util.ERP) : string.Empty;
            dataResultDriver = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaLoadControlIni", par, false, Util.ERP) : string.Empty;

            strResult = dataResultRoute + "¬" + dataResultDriver + "¬" + dataUserValid;

            return strResult;
        }

        [AccessSecurity]
        public string Upload_TableAllIniUser()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            string strResult = "";
            string dataUsuario = "";
            string par = "{\"IdUsuario\":\"" + _.GetUsuario().IdUsuario.ToString() + "\",\"Dia\":\"" + _.Get("Dia") + "\"}";
            dataUsuario = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaLoadTableAllIni", par, false, Util.ERP) : string.Empty;

            strResult = dataUsuario;

            return strResult;

        }

        [AccessSecurity]
        public string Insert_NewRoute()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            string par = "{\"idcliente\":\"" + _.Get("idcliente").Replace('"', ' ') + "\",\"idtipomobilidad\":\"" + _.Get("idtipomobilidad") + "\",\"idusuario\":\"" + _.GetUsuario().IdUsuario.ToString() + "\"," +
                          "\"idtiposervicio\":\"" + _.Get("idtiposervicio") + "\",\"usuariocrea\":\"" + _.GetUsuario().IdUsuario.ToString() + "\"," +
                          "\"hora\":\"" + _.Get("hora") + "\",\"dia\":\"" + _.Get("dia") + "\",\"contacto\":\"" + _.Get("contacto") + "\",\"destino\":\"" + _.Get("destino") + "\",\"iddestino\":\"" + _.Get("iddestino") + "\"," +
                          "\"razon\":\"" + _.Get("razon").Replace('"', ' ') + "\",\"objetivos\":\"" + _.Get("objetivos").Replace('"', ' ') + "\",\"aprobadopor\":\"" + _.Get("aprobadopor") + "\"}";

            var dataDestino = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaInsertNewRoute", par, false, Util.ERP) : string.Empty;

            return dataDestino;
        }

        [AccessSecurity]
        public string Update_StatusMensaje()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;

            string par = "{\"idmensaje\":\"" + _.Get("idmensaje") + "\",\"estado\":\"" + _.Get("estado") + "\",\"mensaje\":\"" + _.Get("mensaje") + "\",\"esemergencia\":\"" + _.Get("esemergencia") + "\"}";

            var dataResult = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaEstadoMensajeUpdate", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        [AccessSecurity]
        public string Delete_RouteID()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            string dataResult = "";
            string par = "{\"idmensaje\":\"" + _.Get("idmensaje") + "\"}";
            dataResult = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaDeleteMensajeId", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        [AccessSecurity]
        public string update_Chofer()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string strResult = "";
            int id = -1;
            string dataResultRoute = "";
            string par = "{\"ruta\":\"" + _.Get("ruta") + "\",\"idchofer\":\"" + _.Get("idchofer") + "\",\"nombre\":\"" + _.Get("nombre") + "\",\"cierre\":\"" + _.Get("cierre") + "\"}";
            dataResultRoute = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaUpdateChofer", par, false, Util.ERP) : string.Empty;

            strResult = dataResultRoute;

            return strResult;
        }

        [AccessSecurity]
        public string EliminarAsignacion()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string strResult = "";
            int id = -1;
            string dataResultRoute = "";
            string par = "{\"ruta\":\"" + _.Get("ruta") + "\",\"cierre\":\"" + _.Get("cierre") + "\"}";
            dataResultRoute = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaUpdateChofer", par, false, Util.ERP) : string.Empty;

            strResult = dataResultRoute;

            return strResult;
        }

        [AccessSecurity]
        public string ObtenerEmergencia()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");            
            string result = oMantenimiento.get_Data("uspMensajeriaEmergenciaObtener", par, true, Util.ERP);
            return result;
        }

        [AccessSecurity]
        public string move_Route()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string strResult = "";
            int id = -1;
            string dataResultRoute = "";
            string par = "{\"idmensaje\":\"" + _.Get("mensaje") + "\",\"movilidad\":\"" + _.Get("movilidad") + "\",\"dia\":\"" + _.Get("dia") + "\"}";
            dataResultRoute = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaMoveRouteIni", par, false, Util.ERP) : string.Empty;

            strResult = dataResultRoute;

            return strResult;
        }


        /*** Query Mensaje ***/

        [AccessSecurity]
        public string load_ReportData()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string strResult = "";
            int id = -1;
            string dataResultRoute = "";

            string par = "{\"FechaDesde\":\"" + _.Get("FechaDesde") + "\",\"FechaHasta\":\"" + _.Get("FechaHasta") + "\",\"TipoMensajeria\":\"" + _.Get("TipoMensajeria") + "\"}";
            dataResultRoute = id < 0 ? oMantenimiento.get_Data("usp_MensajeriaLoadDataReport", par, false, Util.ERP) : string.Empty;

            strResult = dataResultRoute;

            return strResult;
        }

        [AccessSecurity]
        public FileResult getReporte(string fi, string ff, string TipoMensajeria)
        {
            byte[] bytes = new byte[0];
            string FileName = "Error.pdf";
            try
            {
                if (TipoMensajeria != "1")
                {
                    FileName = "Reporte Rutas Emergencias " + DateTime.Now.ToString("yyyyMMddhmm");
                }
                else
                {
                    FileName = "Reporte Rutas " + DateTime.Now.ToString("yyyyMMddhmm");
                }


                string[] fiArr = fi.Split('/');
                string[] ffArr = ff.Split('/');

                string FechaInicio = fiArr[2] + fiArr[0] + fiArr[1];
                string FechaFin = ffArr[2] + ffArr[0] + ffArr[1];

                Mensajeria oMensajeria = new Mensajeria();
                List<beMensajeriaReporte> Reporte = oMensajeria.getReport(FechaInicio, FechaFin, TipoMensajeria, Util.ERP);

                decimal Total = 0;

                if (TipoMensajeria != "1")
                {
                    foreach (var item in Reporte)
                    {
                        Total = Total + Convert.ToDecimal(item.Costo);
                    }
                }

                string strFechaInicio = fiArr[1] + "/" + fiArr[0] + "/" + fiArr[2];
                string strFechaFin = ffArr[1] + "/" + ffArr[0] + "/" + ffArr[2];

                string resultado = String.Format("{0:0,0.00}", Total);


                if (Reporte != null)
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        Document document = new Document(iTextSharp.text.PageSize.A4, 30, 30, 20, 45);

                        PdfWriter writer = PdfWriter.GetInstance(document, ms);

                        TwoColumnHeaderFooter PageEventHandler = new TwoColumnHeaderFooter();
                        writer.PageEvent = PageEventHandler;
                        //Define the page header
                        PageEventHandler.Title = ""; //set empty title only to not add title and add footer
                        PageEventHandler.HeaderFont = FontFactory.GetFont(BaseFont.COURIER_BOLD, 10, Font.BOLD);
                        PageEventHandler.HeaderLeft = "Group";
                        PageEventHandler.HeaderRight = "1";

                        document.Open();
                        var Smaller = FontFactory.GetFont(FontFactory.HELVETICA, 6);
                        var SmallerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 6);
                        var SmallFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 7);
                        var SmallFont = FontFactory.GetFont(FontFactory.HELVETICA, 7);
                        var RegularFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);

                        var MediumFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14);
                        var MediumFontBold2 = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12);
                        var MediumFontBold3 = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);
                        var MediumFont = FontFactory.GetFont(FontFactory.HELVETICA, 9);
                        var LargeFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16);
                        var LargeFont = FontFactory.GetFont(FontFactory.HELVETICA, 32);

                        PdfPTable table = new PdfPTable(1);
                        table.WidthPercentage = 100;

                        PdfPTable Row1 = new PdfPTable(2);
                        Row1.WidthPercentage = 100;

                        iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/img/logos/WTSLogo2.png"));
                        jpg.ScaleToFit(120f, 90f);

                        PdfPCell cellLogo = new PdfPCell(jpg);
                        cellLogo.Border = Rectangle.NO_BORDER;
                        cellLogo.PaddingBottom = 15;

                        PdfPCell cellUsuario = new PdfPCell(new Phrase(string.Format("Date: {0} \n" + "User: {1}", DateTime.Today.ToString("dd/MM/yyyy"), _.GetUsuario().Usuario), SmallFontBold));
                        cellUsuario.HorizontalAlignment = Element.ALIGN_RIGHT;
                        cellUsuario.VerticalAlignment = Element.ALIGN_BOTTOM;
                        cellUsuario.Border = Rectangle.NO_BORDER;
                        cellUsuario.PaddingBottom = 15;

                        Row1.AddCell(cellLogo);
                        Row1.AddCell(cellUsuario);

                        table.DefaultCell.Border = Rectangle.NO_BORDER;
                        table.AddCell(Row1);

                        PdfPTable Row1_1 = new PdfPTable(1);
                        Row1_1.WidthPercentage = 150;

                        PdfPCell cellBlank = new PdfPCell(new Phrase(" "));
                        cellBlank.Border = Rectangle.TOP_BORDER;

                        Row1_1.AddCell(cellBlank);

                        table.AddCell(Row1_1);

                        DateTime Di;
                        DateTime Df;
                        bool resul = DateTime.TryParse(fi, out Di);
                        bool resul1 = DateTime.TryParse(ff, out Df);

                        PdfPTable Row2 = new PdfPTable(1);
                        Row2.WidthPercentage = 100;

                        string Titulo = string.Empty;
                        string Titulo2 = "from " + strFechaInicio + " to " + strFechaFin;

                        if (TipoMensajeria != "1")
                        {
                            Titulo = "Emergency Messaging Services Report";
                        }
                        else
                        {
                            Titulo = "Messaging Services Report";
                        }

                        PdfPCell cellTitle = new PdfPCell(new Phrase(string.Format(Titulo), MediumFontBold));
                        cellTitle.PaddingLeft = 100;
                        cellTitle.PaddingRight = 100;
                        cellTitle.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellTitle.Border = Rectangle.NO_BORDER;
                        Row2.AddCell(cellTitle);

                        PdfPCell cellTitle2 = new PdfPCell(new Phrase(string.Format(Titulo2), MediumFontBold2));
                        cellTitle2.PaddingLeft = 100;
                        cellTitle2.PaddingRight = 100;
                        cellTitle2.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellTitle2.Border = Rectangle.NO_BORDER;

                        Row2.AddCell(cellTitle2);

                        if (TipoMensajeria != "1")
                        {

                            PdfPCell total = new PdfPCell(new Phrase(string.Format("Total Cost: S/. " + Convert.ToString(resultado)), MediumFontBold3));
                            total.PaddingTop = 10;
                            total.HorizontalAlignment = Element.ALIGN_RIGHT;
                            total.Border = Rectangle.NO_BORDER;
                            Row2.AddCell(total);
                        }

                        table.AddCell(Row2);

                        PdfPTable Row3 = new PdfPTable(1);
                        Row3.WidthPercentage = 100;

                        PdfPTable DetailTable;

                        if (TipoMensajeria == "1")
                        {
                            DetailTable = new PdfPTable(8);
                        }
                        else
                        {
                            DetailTable = new PdfPTable(10);
                        }

                        PdfPCell cellFecha = new PdfPCell(new Phrase("Date", SmallerFont));
                        cellFecha.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellFecha.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellFecha.PaddingTop = 10;
                        cellFecha.PaddingBottom = 10;

                        PdfPCell cellDestino = new PdfPCell(new Phrase("Destination", SmallerFont));
                        cellDestino.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellDestino.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellDestino.PaddingTop = 10;
                        cellDestino.PaddingBottom = 10;

                        PdfPCell cellCliente = new PdfPCell(new Phrase("Client", SmallerFont));
                        cellCliente.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellCliente.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellCliente.PaddingTop = 10;
                        cellCliente.PaddingBottom = 10;

                        PdfPCell cellEnviadoPor = new PdfPCell(new Phrase("Ship By", SmallerFont));
                        cellEnviadoPor.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellEnviadoPor.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellEnviadoPor.PaddingTop = 10;
                        cellEnviadoPor.PaddingBottom = 10;

                        PdfPCell cellTipoServicio = new PdfPCell(new Phrase("Type Service", SmallerFont));
                        cellTipoServicio.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellTipoServicio.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellTipoServicio.PaddingTop = 10;
                        cellTipoServicio.PaddingBottom = 10;

                        PdfPCell cellHora = new PdfPCell(new Phrase("Time", SmallerFont));
                        cellHora.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellHora.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellHora.PaddingTop = 10;
                        cellHora.PaddingBottom = 10;

                        PdfPCell cellState = new PdfPCell(new Phrase("Request Status", SmallerFont));
                        cellState.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellState.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellState.PaddingTop = 10;
                        cellState.PaddingBottom = 10;

                        PdfPCell cellTipoMovilidad = new PdfPCell(new Phrase("Type Mobility", SmallerFont));
                        cellTipoMovilidad.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellTipoMovilidad.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellTipoMovilidad.PaddingTop = 10;
                        cellTipoMovilidad.PaddingBottom = 10;

                        PdfPCell cellCosto = new PdfPCell(new Phrase("Cost", SmallerFont));
                        cellCosto.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellCosto.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellCosto.PaddingTop = 10;
                        cellCosto.PaddingBottom = 10;

                        PdfPCell cellEstado = new PdfPCell(new Phrase("Service Status", SmallerFont));
                        cellEstado.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellEstado.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellEstado.PaddingTop = 10;
                        cellEstado.PaddingBottom = 10;

                        if (TipoMensajeria == "1")
                        {
                            DetailTable.AddCell(cellFecha);
                            DetailTable.AddCell(cellDestino);
                            DetailTable.AddCell(cellCliente);
                            DetailTable.AddCell(cellEnviadoPor);
                            DetailTable.AddCell(cellTipoServicio);
                            DetailTable.AddCell(cellHora);
                            DetailTable.AddCell(cellTipoMovilidad);
                            DetailTable.AddCell(cellEstado);

                            var cont = 0;

                            foreach (var item in Reporte)
                            {
                                cellFecha = new PdfPCell(new Phrase(item.Fecha, Smaller));
                                cellFecha.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellFecha.Border = Rectangle.NO_BORDER;

                                cellDestino = new PdfPCell(new Phrase(item.Destino, Smaller));
                                cellDestino.HorizontalAlignment = Element.ALIGN_LEFT;
                                cellDestino.Border = Rectangle.NO_BORDER;

                                cellCliente = new PdfPCell(new Phrase(item.Cliente, Smaller));
                                cellCliente.HorizontalAlignment = Element.ALIGN_LEFT;
                                cellCliente.Border = Rectangle.NO_BORDER;

                                cellEnviadoPor = new PdfPCell(new Phrase(item.EnviadoPor, Smaller));
                                cellEnviadoPor.HorizontalAlignment = Element.ALIGN_LEFT;
                                cellEnviadoPor.Border = Rectangle.NO_BORDER;

                                cellTipoServicio = new PdfPCell(new Phrase(item.TipoServicio, Smaller));
                                cellTipoServicio.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellTipoServicio.Border = Rectangle.NO_BORDER;

                                cellHora = new PdfPCell(new Phrase(item.Hora, Smaller));
                                cellHora.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellHora.Border = Rectangle.NO_BORDER;

                                cellTipoMovilidad = new PdfPCell(new Phrase(item.TipoMovilidad, Smaller));
                                cellTipoMovilidad.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellTipoMovilidad.Border = Rectangle.NO_BORDER;

                                cellEstado = new PdfPCell(new Phrase(item.Estado, Smaller));
                                cellEstado.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellEstado.Border = Rectangle.NO_BORDER;

                                if (cont == 0)
                                {
                                    cellFecha.PaddingTop = 15;
                                    cellDestino.PaddingTop = 15;
                                    cellCliente.PaddingTop = 15;
                                    cellEnviadoPor.PaddingTop = 15;
                                    cellTipoServicio.PaddingTop = 15;
                                    cellHora.PaddingTop = 15;
                                    cellTipoMovilidad.PaddingTop = 15;
                                    cellEstado.PaddingTop = 15;
                                }

                                DetailTable.AddCell(cellFecha);
                                DetailTable.AddCell(cellDestino);
                                DetailTable.AddCell(cellCliente);
                                DetailTable.AddCell(cellEnviadoPor);
                                DetailTable.AddCell(cellTipoServicio);
                                DetailTable.AddCell(cellHora);
                                DetailTable.AddCell(cellTipoMovilidad);
                                DetailTable.AddCell(cellEstado);

                                cont++;
                            }
                        }
                        else
                        {
                            DetailTable.AddCell(cellFecha);
                            DetailTable.AddCell(cellDestino);
                            DetailTable.AddCell(cellCliente);
                            DetailTable.AddCell(cellEnviadoPor);
                            DetailTable.AddCell(cellTipoServicio);
                            DetailTable.AddCell(cellHora);
                            DetailTable.AddCell(cellState);
                            DetailTable.AddCell(cellTipoMovilidad);
                            DetailTable.AddCell(cellCosto);
                            DetailTable.AddCell(cellEstado);

                            var cont = 0;

                            foreach (var item in Reporte)
                            {
                                cellFecha = new PdfPCell(new Phrase(item.Fecha, Smaller));
                                cellFecha.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellFecha.Border = Rectangle.NO_BORDER;

                                cellDestino = new PdfPCell(new Phrase(item.Destino, Smaller));
                                cellDestino.HorizontalAlignment = Element.ALIGN_LEFT;
                                cellDestino.Border = Rectangle.NO_BORDER;

                                cellCliente = new PdfPCell(new Phrase(item.Cliente, Smaller));
                                cellCliente.HorizontalAlignment = Element.ALIGN_LEFT;
                                cellCliente.Border = Rectangle.NO_BORDER;

                                cellEnviadoPor = new PdfPCell(new Phrase(item.EnviadoPor, Smaller));
                                cellEnviadoPor.HorizontalAlignment = Element.ALIGN_LEFT;
                                cellEnviadoPor.Border = Rectangle.NO_BORDER;

                                cellTipoServicio = new PdfPCell(new Phrase(item.TipoServicio, Smaller));
                                cellTipoServicio.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellTipoServicio.Border = Rectangle.NO_BORDER;

                                cellHora = new PdfPCell(new Phrase(item.Hora, Smaller));
                                cellHora.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellHora.Border = Rectangle.NO_BORDER;

                                cellState = new PdfPCell(new Phrase(item.Programacion, Smaller));
                                cellState.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellState.Border = Rectangle.NO_BORDER;

                                cellTipoMovilidad = new PdfPCell(new Phrase(item.TipoMovilidad, Smaller));
                                cellTipoMovilidad.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellTipoMovilidad.Border = Rectangle.NO_BORDER;

                                cellCosto = new PdfPCell(new Phrase(item.Costo, Smaller));
                                cellCosto.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellCosto.Border = Rectangle.NO_BORDER;

                                cellEstado = new PdfPCell(new Phrase(item.Estado, Smaller));
                                cellEstado.HorizontalAlignment = Element.ALIGN_CENTER;
                                cellEstado.Border = Rectangle.NO_BORDER;

                                if (cont == 0)
                                {
                                    cellFecha.PaddingTop = 15;
                                    cellDestino.PaddingTop = 15;
                                    cellCliente.PaddingTop = 15;
                                    cellEnviadoPor.PaddingTop = 15;
                                    cellTipoServicio.PaddingTop = 15;
                                    cellHora.PaddingTop = 15;
                                    cellState.PaddingTop = 15;
                                    cellTipoMovilidad.PaddingTop = 15;
                                    cellCosto.PaddingTop = 15;
                                    cellEstado.PaddingTop = 15;
                                }

                                DetailTable.AddCell(cellFecha);
                                DetailTable.AddCell(cellDestino);
                                DetailTable.AddCell(cellCliente);
                                DetailTable.AddCell(cellEnviadoPor);
                                DetailTable.AddCell(cellTipoServicio);
                                DetailTable.AddCell(cellHora);
                                DetailTable.AddCell(cellState);
                                DetailTable.AddCell(cellTipoMovilidad);
                                DetailTable.AddCell(cellCosto);
                                DetailTable.AddCell(cellEstado);

                                cont++;

                            }
                        }
                        PdfPCell cellContent = new PdfPCell(DetailTable);
                        cellContent.Border = Rectangle.NO_BORDER;
                        cellContent.PaddingTop = 5;

                        Row3.AddCell(cellContent);

                        table.AddCell(Row3);

                        table.SplitLate = false;

                        document.Add(table);

                        document.Close();
                        writer.Close();

                        bytes = ms.GetBuffer();


                    }
                }
            }

            catch (Exception ex)
            {
                string hola = ex.Message;
            }
            return File(bytes, "application/pdf", FileName + ".pdf");
        }

        public void AddOutline(PdfWriter writer, string Title, float Position)
        {
            PdfDestination destination = new PdfDestination(PdfDestination.FITH, Position);
            PdfOutline outline = new PdfOutline(writer.DirectContent.RootOutline, destination, Title);
            writer.DirectContent.AddOutline(outline, "Name = " + Title);
        }


    }

    [AccessSecurity]
    public class TwoColumnHeaderFooter : PdfPageEventHelper
    {
        // This is the contentbyte object of the writer
        PdfContentByte cb;
        // we will put the final number of pages in a template
        PdfTemplate template;
        // this is the BaseFont we are going to use for the header / footer
        BaseFont bf = null;
        // This keeps track of the creation time
        DateTime PrintTime = DateTime.Now;
        #region Properties
        private string _Title;
        public string Title
        {
            get { return _Title; }
            set { _Title = value; }
        }

        private string _HeaderLeft;
        public string HeaderLeft
        {
            get { return _HeaderLeft; }
            set { _HeaderLeft = value; }
        }
        private string _HeaderRight;
        public string HeaderRight
        {
            get { return _HeaderRight; }
            set { _HeaderRight = value; }
        }
        private Font _HeaderFont;
        public Font HeaderFont
        {
            get { return _HeaderFont; }
            set { _HeaderFont = value; }
        }
        private Font _FooterFont;
        public Font FooterFont
        {
            get { return _FooterFont; }
            set { _FooterFont = value; }
        }
        #endregion
        // we override the onOpenDocument method
        public override void OnOpenDocument(PdfWriter writer, Document document)
        {
            try
            {
                PrintTime = DateTime.Now;
                bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                cb = writer.DirectContent;
                template = cb.CreateTemplate(50, 50);
            }
            catch (DocumentException de)
            {
            }
            catch (System.IO.IOException ioe)
            {
            }
        }

        //public override void OnStartPage(PdfWriter writer, Document document)
        //{
        //    //base.OnStartPage(writer, document);
        //    //Rectangle pageSize = document.PageSize;
        //    //if (Title != string.Empty)
        //    //{
        //    //    cb.BeginText();
        //    //    cb.SetFontAndSize(bf, 15);
        //    //    cb.SetRGBColorFill(50, 50, 200);
        //    //    cb.SetTextMatrix(pageSize.GetLeft(40), pageSize.GetTop(40));
        //    //    cb.ShowText(Title);
        //    //    cb.EndText();
        //    //}
        //    //if (HeaderLeft + HeaderRight != string.Empty)
        //    //{
        //    //    PdfPTable HeaderTable = new PdfPTable(2);
        //    //    HeaderTable.DefaultCell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //    //    HeaderTable.TotalWidth = pageSize.Width - 80;
        //    //    HeaderTable.SetWidthPercentage(new float[] { 45, 45 }, pageSize);

        //    //    PdfPCell HeaderLeftCell = new PdfPCell(new Phrase(8, HeaderLeft, HeaderFont));
        //    //    HeaderLeftCell.Padding = 5;
        //    //    HeaderLeftCell.PaddingBottom = 8;
        //    //    HeaderLeftCell.BorderWidthRight = 0;
        //    //    HeaderTable.AddCell(HeaderLeftCell);
        //    //    PdfPCell HeaderRightCell = new PdfPCell(new Phrase(8, HeaderRight, HeaderFont));
        //    //    HeaderRightCell.HorizontalAlignment = PdfPCell.ALIGN_RIGHT;
        //    //    HeaderRightCell.Padding = 5;
        //    //    HeaderRightCell.PaddingBottom = 8;
        //    //    HeaderRightCell.BorderWidthLeft = 0;
        //    //    HeaderTable.AddCell(HeaderRightCell);
        //    //    cb.SetRGBColorFill(0, 0, 0);
        //    //    HeaderTable.WriteSelectedRows(0, -1, pageSize.GetLeft(40), pageSize.GetTop(50), cb);
        //    //}
        //}
        public override void OnEndPage(PdfWriter writer, Document document)
        {
            base.OnEndPage(writer, document);
            int pageN = writer.PageNumber;
            String text = "Page " + pageN + " of ";
            float len = bf.GetWidthPoint(text, 8);
            Rectangle pageSize = document.PageSize;
            cb.SetRGBColorFill(100, 100, 100);
            cb.BeginText();
            cb.SetFontAndSize(bf, 8);
            cb.SetTextMatrix(pageSize.GetLeft(40), pageSize.GetBottom(30));
            cb.ShowText(text);
            cb.EndText();
            cb.AddTemplate(template, pageSize.GetLeft(40) + len, pageSize.GetBottom(30));

            //cb.BeginText();
            //cb.SetFontAndSize(bf, 8);
            //cb.ShowTextAligned(PdfContentByte.ALIGN_RIGHT,
            //"Printed On " + PrintTime.ToString(),
            //pageSize.GetRight(40),
            //pageSize.GetBottom(30), 0);
            //cb.EndText();
        }
        public override void OnCloseDocument(PdfWriter writer, Document document)
        {
            base.OnCloseDocument(writer, document);
            template.BeginText();
            template.SetFontAndSize(bf, 8);
            template.SetTextMatrix(0, 0);
            template.ShowText("" + (writer.PageNumber - 1));
            template.EndText();
        }
    }

}