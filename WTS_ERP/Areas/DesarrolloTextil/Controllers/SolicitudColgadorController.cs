using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.DesarrolloTextil.Controllers
{
    public class SolicitudColgadorController : Controller
    {
        // GET: DesarrolloTextil/SolicitudColgador
        public ActionResult NewSolicitudColgador()
        {
            return View();
        }

        public ActionResult _SeleccionarCodigoTelaWts() {
            return View();
        }

        public ActionResult ColgadorImprimir()
        {
            string par = _.Get("par");
            ViewBag.parametro = par;
            return View();
        }

        public ActionResult SolicitudColgadorImprimir()
        {
            string par = _.Get("par");
            ViewBag.parametro = par;
            return View();
        }

        public ActionResult _VerFotoColgador()
        {
            return View();
        }

        public string GetCodigoTelaWts()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetByParam_CodigoTelaWts_csv", par, false, Util.ERP);

            return data;
        }

        public string GetData() {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_LoadIniNewSolicitudColgador_csv", par, true, Util.ERP);
            return data;
        }

        public string GetData_Edit()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_LoadIniEditSolicitudColgador_csv", par, true, Util.ERP);
            return data;
        }

        public string SaveNew() {
            string ruta_fileserver = ConfigurationManager.AppSettings["FileServer"].ToString();
            blMantenimiento bl = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuario", _.GetUsuario().Usuario);

            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            

            JObject jo_pardetail = JObject.Parse(parsubdetail) as JObject;
            JArray ja_arr_fotos_new = JArray.Parse(jo_pardetail.GetValue("arr_fotos_new").ToString()) as JArray;

            Random aleatorio = new Random();
            JArray ja = JArray.Parse(pardetail) as JArray;
            
            foreach (JObject item in ja)
            {
                string nombre_data_file = item.GetValue("data_keytablainputfile").ToString();
                if (nombre_data_file != "")
                {
                    var file = Request.Files[nombre_data_file];
                    MemoryStream memory = new MemoryStream();
                    string nombrearchivooriginal = System.IO.Path.GetFileName(file.FileName);
                    string extension = System.IO.Path.GetExtension(file.FileName);
                    string nombregenerado = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), extension);

                    //JObject jo = new JObject();
                    //jo.Add("imagenoriginalcolgador", nombrearchivooriginal);
                    //jo.Add("imagenwebcolgador", nombregenerado);

                    file.InputStream.CopyTo(memory);
                    byte[] bfile = memory.ToArray();
                    string rutafila = @ruta_fileserver + "erp/textileanalysis/SolicitudColgador/FotosColgador/" + nombregenerado; //Server.MapPath("~/Content/upload/" + nombregenerado);
                    System.IO.File.WriteAllBytes(rutafila, bfile);

                    //// EJEMPLO DE COMO FILTRAR EN JARRAY
                    //JObject jofind = ja.Children<JObject>()
                    //    .FirstOrDefault(o => o["data_keytablainputfile"] != null && o["data_keytablainputfile"].ToString() == nombre_data_file);

                    item.Add("imagenoriginalcolgador", nombrearchivooriginal);
                    item.Add("imagenwebcolgador", nombregenerado);
                }
            }

            pardetail = "";
            pardetail = JsonConvert.SerializeObject(ja);

            //// PARA LAS FOTOS DE DESCRIPCION
            JArray ja_save_fotos_descripcion = new JArray();
            foreach (JObject item in ja_arr_fotos_new)
            {
                string keyvalue = item.GetValue("key_value").ToString();
                if (keyvalue != ""){
                    var file_2 = Request.Files[keyvalue];
                    MemoryStream memory_descripcion = new MemoryStream();
                    string nombrearchivooriginal_descripcion = System.IO.Path.GetFileName(file_2.FileName);
                    string extension_descripcion = System.IO.Path.GetExtension(file_2.FileName);
                    string nombregenerado_descripcion = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), extension_descripcion);

                    file_2.InputStream.CopyTo(memory_descripcion);
                    byte[] bfile_descripcion = memory_descripcion.ToArray();
                    string rutafile_descripcion = @ruta_fileserver + "erp/textileanalysis/SolicitudColgador/FotosColgador/" + nombregenerado_descripcion; //Server.MapPath("~/Content/upload/" + nombregenerado_descripcion);
                    System.IO.File.WriteAllBytes(rutafile_descripcion, bfile_descripcion);

                    JObject jo_temp = new JObject();
                    jo_temp.Add("imagenoriginalcolgador", nombrearchivooriginal_descripcion);
                    jo_temp.Add("imagenwebcolgador", nombregenerado_descripcion);

                    ja_save_fotos_descripcion.Add(jo_temp);
                }
            }

            var ja_descripcion_serializado = JsonConvert.SerializeObject(ja_save_fotos_descripcion);
            var ja_descripcion_parse = JArray.Parse(ja_descripcion_serializado);
            jo_pardetail.Add("arr_save_fotos_descripcion", ja_descripcion_parse);

            parsubdetail = JsonConvert.SerializeObject(jo_pardetail);

            int id = bl.save_Rows_Out("usp_SaveNew_SolicitudColgador_csv", parhead, Util.ERP, pardetail, parsubdetail);
            string mensaje = _.Mensaje("new", id > 0, bl.get_Data("usp_GetData_CabeceraSolicitudColgador", id.ToString(), false, Util.ERP), id);
            return mensaje;
        }

        public string SaveEdit()
        {
            string ruta_fileserver = ConfigurationManager.AppSettings["FileServer"].ToString();
            blMantenimiento bl = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuario", _.GetUsuario().Usuario);

            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");

            JObject jo_pardetail = JObject.Parse(parsubdetail) as JObject;
            JArray ja_arr_fotos_new = JArray.Parse(jo_pardetail.GetValue("arr_fotos_new").ToString()) as JArray;
            JArray ja_arr_fotos_existentes = JArray.Parse(jo_pardetail.GetValue("arr_fotos_existentes").ToString()) as JArray;

            Random aleatorio = new Random();
            JArray ja = JArray.Parse(pardetail) as JArray;
            
            foreach (JObject item in ja)
            {
                string nombre_data_file = item.GetValue("data_keytablainputfile").ToString();
                string estadofoto = item.GetValue("estadofoto").ToString();
                string confotosinfoto = item.GetValue("confotosinfoto").ToString();

                if (nombre_data_file != "" && estadofoto == "modificado" && confotosinfoto == "confoto")
                {
                    var file = Request.Files[nombre_data_file];
                    MemoryStream memory = new MemoryStream();
                    string nombrearchivooriginal = System.IO.Path.GetFileName(file.FileName);
                    string extension = System.IO.Path.GetExtension(file.FileName);
                    string nombregenerado = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), extension);

                    file.InputStream.CopyTo(memory);
                    byte[] bfile = memory.ToArray();
                    string rutafila = @ruta_fileserver + "erp/textileanalysis/SolicitudColgador/FotosColgador/" + nombregenerado; //Server.MapPath("~/Content/upload/" + nombregenerado);
                    System.IO.File.WriteAllBytes(rutafila, bfile);

                    item.Add("imagenoriginalcolgador", nombrearchivooriginal);
                    item.Add("imagenwebcolgador", nombregenerado);
                } else if (estadofoto == "modificado" && confotosinfoto == "sinfoto") {
                    item.Add("imagenoriginalcolgador", "");
                    item.Add("imagenwebcolgador", "");
                }
            }

            pardetail = "";
            pardetail = JsonConvert.SerializeObject(ja);

            //// PARA LAS FOTOS DE DESCRIPCION
            //JArray ja_save_fotos_descripcion = new JArray();
            foreach (JObject item in ja_arr_fotos_new)
            {
                string keyvalue = item.GetValue("key_value").ToString();
                if (keyvalue != "")
                {
                    var file_2 = Request.Files[keyvalue];
                    MemoryStream memory_descripcion = new MemoryStream();
                    string nombrearchivooriginal_descripcion = System.IO.Path.GetFileName(file_2.FileName);
                    string extension_descripcion = System.IO.Path.GetExtension(file_2.FileName);
                    string nombregenerado_descripcion = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), extension_descripcion);

                    file_2.InputStream.CopyTo(memory_descripcion);
                    byte[] bfile_descripcion = memory_descripcion.ToArray();
                    string rutafile_descripcion = @ruta_fileserver + "erp/textileanalysis/SolicitudColgador/FotosColgador/" + nombregenerado_descripcion; //Server.MapPath("~/Content/upload/" + nombregenerado_descripcion);
                    System.IO.File.WriteAllBytes(rutafile_descripcion, bfile_descripcion);

                    JObject jo_temp = new JObject();
                    jo_temp.Add("imagenoriginalcolgador", nombrearchivooriginal_descripcion);
                    jo_temp.Add("imagenwebcolgador", nombregenerado_descripcion);

                    //ja_save_fotos_descripcion.Add(jo_temp);
                    ja_arr_fotos_existentes.Add(jo_temp);
                }
            }

            var ja_descripcion_serializado = JsonConvert.SerializeObject(ja_arr_fotos_existentes); //ja_save_fotos_descripcion
            var ja_descripcion_parse = JArray.Parse(ja_descripcion_serializado);
            jo_pardetail.Add("arr_save_fotos_descripcion", ja_descripcion_parse);

            parsubdetail = JsonConvert.SerializeObject(jo_pardetail);

            int id = bl.save_Rows_Out("usp_SaveEdit_SolicitudColgador_csv", parhead, Util.ERP, pardetail, parsubdetail);
            string mensaje = _.Mensaje("edit", id > 0, bl.get_Data("usp_GetData_CabeceraSolicitudColgador", id.ToString(), false, Util.ERP), id);
            return mensaje;
        }

        public string grabar_telas_encontradas_x_operador()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("parhead");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            int rows = bl.save_Rows("usp_grabar_telas_encontradas_x_operador_csv", par, Util.ERP);

            string mensaje = "";
            string idcolgadorsolicitud = _.Get_Par(par, "idcolgadorsolicitud");
            string tipobusqueda = _.Get_Par(par, "tipobusqueda");
            //string parametro = "{\"idcolgadorsolicitud\":\"" + idcolgadorsolicitud + "\",\"tipobusqueda\":\"descripcion\"}";

            JObject jo = new JObject();
            jo.Add("idcolgadorsolicitud", idcolgadorsolicitud);
            jo.Add("tipobusqueda", tipobusqueda);
            string parametro = JsonConvert.SerializeObject(jo);

            mensaje = _.Mensaje("edit", rows > 0, bl.get_Data("usp_GetData_ColgadoresDetalle_ByTipoBusqueda_csv", parametro, false, Util.ERP));
            return mensaje;
        }

        public string ConfirmarCantidadRecibida_Colgadores()
        {
            blMantenimiento bl = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "usuario", _.GetUsuario().Usuario);
            int rows = bl.save_Rows("usp_ConfirmarCantidadRecibida_Colgadores_csv", parhead, Util.ERP);

            string idsolicitud = _.Get_Par(parhead, "idsolicitud");

            JObject jo = new JObject();
            jo.Add("idsolicitud", idsolicitud);
            string parametro = JsonConvert.SerializeObject(jo);

            string mensaje = _.Mensaje("edit", rows > 0, bl.get_Data("usp_ColgadoresDetalle_Armado_Y_CodigosGenerados_DespuesConfirmarCantidad", parametro, true, Util.ERP));
            return mensaje;
        }

        public string GetColgadores_Armado_Para_Imprimir()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetColgadores_Armado_Para_Imprimir_csv", par, false, Util.ERP);
            return data;
        }

        public string ActualizarEntregableColgadorOperador()
        {
            blMantenimiento bl = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "usuario", _.GetUsuario().Usuario);
            int rows = bl.save_Rows("usp_ActualizarEntregableColgadorOperador_csv", parhead, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }

        public string GetSolicitudColgadorImprimir()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetSolicitudColgadorImprimir_csv", par, true, Util.ERP);
            return data;
        }

        public string GrabarEstadoRecibirColgadores()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            int rows = bl.save_Row_Out("usp_GrabarEstadoPendienteEntregarColgadores_csv", par, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }
    }
}