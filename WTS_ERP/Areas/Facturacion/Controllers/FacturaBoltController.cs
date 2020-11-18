using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using System;
using System.Text;
using BE_ERP;
using System.Web;
using System.IO;
using System.Configuration;
using Utilitario;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using WTS_ERP.Areas.Facturacion.Models;
using System.Linq;
using Utilitario.EnvioFtp;
using System.Reflection;

namespace WTS_ERP.Areas.Facturacion.Controllers
{
    public class FacturaBoltController : Controller
    {
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult New()
        {
            return View();
        }

        public string BoltFiltro_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_Bolt_List", "", false, Util.ERP);
            return data != null ? data : string.Empty;
        }
        
        public string GetData_FacturaPo(string par)
        {          
           
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_Get_FacturaPoTemp", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Save_New()
        {
            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = string.Empty;
            string parfoot = string.Empty;

            string usu = _.GetUsuario().Usuario.ToString();

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());           
          
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("usp_PoBol_Insert_Csv", par, Util.ERP, pardetalle, parsubdetail, parfoot);

            string mensaje = _.Mensaje("new", id > 0, oMantenimiento.get_Data("usp_FacturaPoBol_GetById_Csv", id.ToString(), true, Util.ERP), id);
            return mensaje;
        }

        public string Save_FileResumen()
        {
            string respuesta = "";
            string file = _.Post("filearchivo");

            // Guardar file de resument
            try {

                string cFolder = Server.MapPath("..\\" + Util.RutaUpload + "\\InvoiceBol\\");
                cFolder = cFolder.Replace("Facturacion\\", "");

                if (!Directory.Exists(cFolder)) {
                    cFolder = ConfigurationManager.AppSettings["rutaInvoiceTrancepta"].ToString();
                }

                byte[] fileByte = new byte[0];
                Random oAleatorio = new Random();
                MemoryStream target = new MemoryStream();
                HttpPostedFileBase fileArchivo = Request.Files["fileArchivo"];
                string NombreArchivo = "";
                string Extension = "";
                string NombreWeb = "";
                EnvioFtp utilEnvioFtp = new EnvioFtp();

                if (fileArchivo != null)
                {
                    NombreArchivo = System.IO.Path.GetFileName(fileArchivo.FileName);
                    Extension = Path.GetExtension(fileArchivo.FileName);
                    NombreWeb = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), Extension);                  
                    fileArchivo.InputStream.CopyTo(target);
                    fileByte = target.ToArray();
                   System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolder, NombreWeb), fileByte);


                    string ftp_ruta_destino = ConfigurationManager.AppSettings["810_out"].ToString();
                    string _path_archivo = cFolder + "\\"+ NombreWeb;
                    string _nombrearchivo = Path.GetFileNameWithoutExtension(@_path_archivo);
                    string _extension_archivo = Path.GetExtension(@_path_archivo);
                    string _file_path_destino = ftp_ruta_destino + "/" + _nombrearchivo + _extension_archivo;
                    Boolean valida_subida = utilEnvioFtp.enviarFtp(@_path_archivo, _file_path_destino, "810");
                    if (valida_subida)
                    {
                        if (System.IO.File.Exists(@_path_archivo))
                             System.IO.File.Delete(@_path_archivo);
                    }
                }

                respuesta = "1";
            }
            catch (Exception ex) {
                respuesta = ex.ToString();
            }
            return respuesta;
        }

        public string Get_FacturaPoBolInd()
        {

            string id = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string mensaje = _.Mensaje("new", 1 > 0, oMantenimiento.get_Data("usp_FacturaPoBol_GetById_Csv", id.ToString(), true, Util.ERP), Convert.ToInt32(id));

            return mensaje;
        }

        public string Get_FacturaPoBolList()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_FacturaPoBol_LIST_CSV", par, false, Util.ERP);
            return data;
        }

        public string Send_BolFtp()
        {
            string mensaje = "";
            string IdBolt = _.Post("par");        
            string strDetalle = _.Post("pardetalle");

            string par_ = _.Post("par_");
            string pardetalle_ = _.Post("pardetalle_");
            string parsubdetail = string.Empty;
            string parfoot = string.Empty;

            //bool bEnviado = false;            
            //inicio envio de BOL ftp
            List<string> listDetalle = strDetalle.Split(',').ToList();
            string rutaOrigen = Server.MapPath("~/Content/Facturacion");
            mensaje = FacturacionBol.recorrerListado(listDetalle, IdBolt, rutaOrigen);
            //fin envio de BOL ftp

            if (mensaje.Length==4) {

                string usu = _.GetUsuario().Usuario.ToString();
                par_ = _.addParameter(par_, "idempresa", _.GetUsuario().IdEmpresa.ToString());
                par_ = _.addParameter(par_, "usuariocreacion", _.GetUsuario().Usuario);
                par_ = _.addParameter(par_, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
                par_ = _.addParameter(par_, "IdPersonal", _.GetUsuario().IdPersonal.ToString());

                blMantenimiento oMantenimiento = new blMantenimiento();
                int id = oMantenimiento.save_Rows_Out("usp_PoBol_upd_send_Csv", par_, Util.ERP, pardetalle_, parsubdetail, parfoot);

                mensaje = _.Mensaje("sendmail", id > 0, oMantenimiento.get_Data("usp_FacturaPoBol_GetById_Csv", id.ToString(), true, Util.ERP), id);
               
            }
            return mensaje;
        }

        public string EliminarDetalleBol()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            int rows = bl.save_Row("usp_EliminarDetalleBol_csv", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        public string EliminarBol()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");           
            string usu = _.GetUsuario().Usuario.ToString();

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());
            int rows = bl.save_Row("usp_EliminarBol_csv", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        public ActionResult _FechaBol()
        {
            return View();
        }
    }
}