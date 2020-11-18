using BL_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using System.IO;
using System.Configuration;
using Utilitario;
using Utilitario.Imagen;

namespace WTS_ERP.Areas.DesarrolloTextil.Controllers
{
    public class AtxController : Controller
    {
        // GET: DesarrolloTextil/Atx
        
        public ActionResult AtxView()
        {
            return View();
        }

        public ActionResult _VerLigamentos()
        {
            return View();
        }

        public ActionResult _CrearAcabadoFisico()
        {
            return View();
        }

        public ActionResult _CrearAcabadoQuimico()
        {
            return View();
        }

        public ActionResult _CrearPretratamiento()
        {
            return View();
        }

        public ActionResult _CrearTipoTenido()
        {
            return View();
        }

        public ActionResult _CrearGalgaDiametro()
        {
            return View();
        }

        public ActionResult _NewHilado_FromAtx()
        {
            return View();
        }

        public ActionResult _ViewMateriaPrima_Hilado_FromAtx()
        {
            return View();
        }

        public ActionResult _ViewHiladoPorPasada()
        {
            return View();
        }

        public ActionResult BuscadorAtx()
        {
            return View();
        }

        public ActionResult _FiltroBuscadorAtx()
        {
            return View();
        }

        public ActionResult AnalisisTextilImprimir(string idatx = "")
        {
            string par = _.Get("par");
            string fileserver = ConfigurationManager.AppSettings["fileserver"].ToString();
            //par = _.addParameter(par, "fileserver", fileserver);
            par += ",fileserver:" + fileserver;
            ViewBag.parametro = par;
            return View();
        }

        public ActionResult PrintAtx_FromCorreo(string idatx)
        {
            string par = "";
            string idDecodificado = Utilitario.Utils.DeCodificar(idatx);
            par = "idsolicitud:,idatx:" + idDecodificado;

            string fileserver = ConfigurationManager.AppSettings["fileserver"].ToString();
            //par = _.addParameter(par, "fileserver", fileserver);
            par += ",fileserver:" + fileserver;
            ViewBag.parametro = par;
            return View("AnalisisTextilImprimir");
        }
        
        // Jacob
        public string GetData() {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_AnalisisTextil_getdata_csv", par, true, Util.ERP);
            return data;
        }

        public string getData_newhilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("usp_GetDataModalMateriaPrima_New", "", true, Util.ERP);
            return data;
        }

        public string save_new_hilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            string detail = _.Post("pardetail");
            int id = bl.save_Rows_Out("usp_GrabarHiladoFromLaboratorio", par, Util.ERP, detail);
            string mensaje = _.Mensaje("new", id > 0, bl.get_Data("usp_GetHiladoCSV", "", false, Util.ERP), id);
            return mensaje;
        }

        public string validarsiexistehilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_ValidarSiExisteHilado", par, false, Util.ERP);
            return data;
        }

        public string getData_viewMateriaprima_hilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetDataModalMateriaPrima_View", par, false, Util.ERP);
            return data;
        }

        public string save_new_atx()
        {
            blMantenimiento bl = new blMantenimiento();
            Imagen utilimagen = new Imagen();
            string ruta_fileserver = ConfigurationManager.AppSettings["FileServer"].ToString();
            string parhead = Utils.unescape(_.Post("parhead"));
            parhead = _.addParameter(parhead, "idusuariooperador", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().Usuario);
            parhead = _.addParameter(parhead, "ip", "");
            parhead = _.addParameter(parhead, "hostname", "");

            string reenviar = _.Get_Par(parhead, "reenviar");

            #region IMAGEN ESTRUCTURA
            HttpPostedFileBase imagenestructura = Request.Files["imagenestructura"];
            Random rAleatorio = new Random();
            MemoryStream ms_imagen_estructura = new MemoryStream();
            byte[] byte_imagen_estructura = new byte[0];
            if (imagenestructura != null)
            {
                string nombreoriginal_imagen_estructura = System.IO.Path.GetFileName(imagenestructura.FileName);
                string extension_imagen_estructura = System.IO.Path.GetExtension(imagenestructura.FileName);
                string nombrealeatorio_imagen_estructura = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, rAleatorio.Next(10, 100), extension_imagen_estructura);
                string ruta_destino_grabar_imagen_estructura = Server.MapPath("~/images/structuraimport/thumbnail/"),
                    ruta_destino_grabar_imagen_estructura_folderoriginal = Server.MapPath("~/images/structuraimport/original/");
                imagenestructura.InputStream.CopyTo(ms_imagen_estructura);
                byte_imagen_estructura = ms_imagen_estructura.ToArray();

                byte[] img_estructura_ligamento_thumbnail = utilimagen.DevolverImagenOptimizada(byte_imagen_estructura);

                System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_destino_grabar_imagen_estructura, nombrealeatorio_imagen_estructura), img_estructura_ligamento_thumbnail);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_destino_grabar_imagen_estructura_folderoriginal, nombrealeatorio_imagen_estructura), byte_imagen_estructura);

                parhead = _.addParameter(parhead, "imagenoriginal", nombreoriginal_imagen_estructura);
                parhead = _.addParameter(parhead, "imagennombre", nombrealeatorio_imagen_estructura);
                parhead = _.addParameter(parhead, "imagenwebnombre", nombrealeatorio_imagen_estructura);
            }
            else
            {
                parhead = _.addParameter(parhead, "imagenoriginal", "");
                parhead = _.addParameter(parhead, "imagennombre", "");
                parhead = _.addParameter(parhead, "imagenwebnombre", "");
            }
            #endregion
            string ruta_destino_muestrafisica = ruta_fileserver + "/erp/textileanalysis/muestrasfisicas/thumbnail";

            #region IMAGEN MUESTRA FISICA
            HttpPostedFileBase imagen_muestrafisica = Request.Files["imagenmuestrafisica"];

            MemoryStream ms_imagen_muestrafisica = new MemoryStream();
            byte[] byte_imagen_muestrafisica = new byte[0];
            if (imagen_muestrafisica != null)
            {
                string nombreoriginal_imagen_muestrafisica = System.IO.Path.GetFileName(imagen_muestrafisica.FileName);
                string extension_imagen_muestrafisicca = System.IO.Path.GetExtension(imagen_muestrafisica.FileName);
                string nombrealeatorio_imagen_muestrafisica = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, rAleatorio.Next(10, 100), extension_imagen_muestrafisicca);
                string ruta_destino_grabar_imagen_muestrafisica = ruta_fileserver + "/erp/textileanalysis/muestrasfisicas/thumbnail/",
                        ruta_destino_grabar_imagen_muestrafisica_folderoriginal = ruta_fileserver + "/erp/textileanalysis/muestrasfisicas/original/";
                imagen_muestrafisica.InputStream.CopyTo(ms_imagen_muestrafisica);
                byte_imagen_muestrafisica = ms_imagen_muestrafisica.ToArray();

                byte[] img_muestra_fisica_thumbnail = utilimagen.DevolverImagenOptimizada(byte_imagen_muestrafisica);

                System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_destino_grabar_imagen_muestrafisica, nombrealeatorio_imagen_muestrafisica), img_muestra_fisica_thumbnail);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_destino_grabar_imagen_muestrafisica_folderoriginal, nombrealeatorio_imagen_muestrafisica), byte_imagen_muestrafisica);

                parhead = _.addParameter(parhead, "imagenoriginalmuestrafisica", nombreoriginal_imagen_muestrafisica);
                parhead = _.addParameter(parhead, "imagennombremuestrafisica", nombrealeatorio_imagen_muestrafisica);
                parhead = _.addParameter(parhead, "imagenwebnombremuestrafisica", nombrealeatorio_imagen_muestrafisica);
            }
            else
            {
                parhead = _.addParameter(parhead, "imagenoriginalmuestrafisica", "");
                parhead = _.addParameter(parhead, "imagennombremuestrafisica", "");
                parhead = _.addParameter(parhead, "imagenwebnombremuestrafisica", "");
            }
            #endregion

            string pardetail = _.Post("pardetail");

            //int idatx = bl.save_Rows_Out("usp_save_new_atx_jacob", parhead, Util.ERP, pardetail);
            int idatx = bl.save_Rows_Out("usp_save_new_atx", parhead, Util.ERP, pardetail);

            string data_atx = string.Empty;
            if (reenviar == "si")  //// SE HACE ESTO PARA OBTENER EL CODIGO DE TELA CUANDO ES RRENVIAR Y FINALIZAR EL ATX
            {
                data_atx = bl.get_Data("usp_GetAtx_after_grabar_By_IdAnalisisTextil_csv", idatx.ToString(), false, Util.ERP);
            }

            string mensaje = _.Mensaje("new", idatx > 0, data_atx, idatx);
            return mensaje;
        }

        public string save_edit_atx()
        {
            blMantenimiento bl = new blMantenimiento();
            Imagen utilimagen = new Imagen();
            string ruta_fileserver = ConfigurationManager.AppSettings["FileServer"].ToString();
            //// UNESCAPE PARA DECODIFICAR LO QUE SE HIZO EN JAVASCRIPT CON ESCAPE
            string parhead = Utils.unescape(_.Post("parhead"));
            parhead = _.addParameter(parhead, "idusuariooperador", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().Usuario);
            parhead = _.addParameter(parhead, "ip", "");
            parhead = _.addParameter(parhead, "hostname", "");

            string finalizaratx = _.Get_Par(parhead, "finalizaratx");

            #region IMAGEN ESTRUCTURA
            HttpPostedFileBase imagenestructura = Request.Files["imagenestructura"];
            Random rAleatorio = new Random();
            MemoryStream ms_imagen_estructura = new MemoryStream();
            byte[] byte_imagen_estructura = new byte[0];
            if (imagenestructura != null)
            {
                string nombreoriginal_imagen_estructura = System.IO.Path.GetFileName(imagenestructura.FileName);
                string extension_imagen_estructura = System.IO.Path.GetExtension(imagenestructura.FileName);
                string nombrealeatorio_imagen_estructura = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, rAleatorio.Next(10, 100), extension_imagen_estructura);
                string ruta_destino_grabar_imagen_estructura = Server.MapPath("~/images/structuraimport/thumbnail/"),
                    ruta_destino_grabar_imagen_estructura_folderoriginal = Server.MapPath("~/images/structuraimport/original/");
                imagenestructura.InputStream.CopyTo(ms_imagen_estructura);
                byte_imagen_estructura = ms_imagen_estructura.ToArray();

                byte[] img_estructura_ligamento_thumbnail = utilimagen.DevolverImagenOptimizada(byte_imagen_estructura);

                System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_destino_grabar_imagen_estructura, nombrealeatorio_imagen_estructura), img_estructura_ligamento_thumbnail);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_destino_grabar_imagen_estructura_folderoriginal, nombrealeatorio_imagen_estructura), byte_imagen_estructura);

                parhead = _.addParameter(parhead, "imagenoriginal", nombreoriginal_imagen_estructura);
                parhead = _.addParameter(parhead, "imagennombre", nombrealeatorio_imagen_estructura);
                parhead = _.addParameter(parhead, "imagenwebnombre", nombrealeatorio_imagen_estructura);
            }
            else
            {
                //// SI SE HA ELIMINADO LA IMAGEN SE ACTUALIZARA EN EL ATXT
                string actualizarimagenestructura = _.Get_Par(parhead, "actualizarimagenestructura");
                if (actualizarimagenestructura == "1")
                {
                    parhead = _.addParameter(parhead, "imagenoriginal", "");
                    parhead = _.addParameter(parhead, "imagennombre", "");
                    parhead = _.addParameter(parhead, "imagenwebnombre", "");
                }
            }
            #endregion
            string ruta_destino_muestrafisica = ruta_fileserver + "/erp/textileanalysis/muestrasfisicas/thumbnail";
            
            #region IMAGEN MUESTRA FISICA
            HttpPostedFileBase imagen_muestrafisica = Request.Files["imagenmuestrafisica"];

            MemoryStream ms_imagen_muestrafisica = new MemoryStream();
            byte[] byte_imagen_muestrafisica = new byte[0];
            if (imagen_muestrafisica != null)
            {
                string nombreoriginal_imagen_muestrafisica = System.IO.Path.GetFileName(imagen_muestrafisica.FileName);
                string extension_imagen_muestrafisicca = System.IO.Path.GetExtension(imagen_muestrafisica.FileName);
                string nombrealeatorio_imagen_muestrafisica = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, rAleatorio.Next(10, 100), extension_imagen_muestrafisicca);
                string ruta_destino_grabar_imagen_muestrafisica = ruta_fileserver + "/erp/textileanalysis/muestrasfisicas/thumbnail/",
                        ruta_destino_grabar_imagen_muestrafisica_folderoriginal = ruta_fileserver + "/erp/textileanalysis/muestrasfisicas/original/";
                imagen_muestrafisica.InputStream.CopyTo(ms_imagen_muestrafisica);
                byte_imagen_muestrafisica = ms_imagen_muestrafisica.ToArray();
                
                byte[] img_muestra_fisica_thumbnail = utilimagen.DevolverImagenOptimizada(byte_imagen_muestrafisica);

                System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_destino_grabar_imagen_muestrafisica, nombrealeatorio_imagen_muestrafisica), img_muestra_fisica_thumbnail);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_destino_grabar_imagen_muestrafisica_folderoriginal, nombrealeatorio_imagen_muestrafisica), byte_imagen_muestrafisica);

                parhead = _.addParameter(parhead, "imagenoriginalmuestrafisica", nombreoriginal_imagen_muestrafisica);
                parhead = _.addParameter(parhead, "imagennombremuestrafisica", nombrealeatorio_imagen_muestrafisica);
                parhead = _.addParameter(parhead, "imagenwebnombremuestrafisica", nombrealeatorio_imagen_muestrafisica);
            }
            else
            {
                //// SI SE HA ELIMINADO LA IMAGEN SE ACTUALIZARA EN EL ATXT
                string actualizarimagen_muestrafisica = _.Get_Par(parhead, "actualizarimagenmuestrafisica");
                if (actualizarimagen_muestrafisica == "1")
                {
                    parhead = _.addParameter(parhead, "imagenoriginalmuestrafisica", "");
                    parhead = _.addParameter(parhead, "imagennombremuestrafisica", "");
                    parhead = _.addParameter(parhead, "imagenwebnombremuestrafisica", "");
                }
            }
            #endregion

            string pardetail = _.Post("pardetail");
            // Jacob
            int idatx = bl.save_Rows_Out("usp_save_edit_atx", parhead, Util.ERP, pardetail);

            string data_atx = string.Empty;
            if (finalizaratx == "si")
            {
                data_atx = bl.get_Data("usp_GetAtx_after_grabar_By_IdAnalisisTextil_csv", idatx.ToString(), false, Util.ERP);
            }

            string mensaje = _.Mensaje("new", idatx > 0, data_atx, idatx);
            return mensaje;
        }

        // Jacob
        public string get_atx_foredit_ini()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetAtx_LoadInitForEditar_csv", par, true, Util.ERP);
            //string data = bl.get_Data("usp_GetAtx_LoadInitForEditar_csv_TEMPORAL_TIENEMASLINEAS", par, true, Util.ERP);
            return data;
        }

        public string save_acabadofisico()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            string detail = _.Post("pardetail");
            int id = bl.save_Rows("usp_AcabadoFisico_Guardar", par, Util.ERP, detail);
            string mensaje = _.Mensaje("new", id > 0, bl.get_Data("usp_AcabadoQuimicoFisico_getcsv", "", true, Util.ERP), id);
            return mensaje;
        }

        public string save_acabadoquimico()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            string detail = _.Post("pardetail");
            int id = bl.save_Rows("usp_AcabadoQuimico_Guardar", par, Util.ERP, detail);
            string mensaje = _.Mensaje("new", id > 0, bl.get_Data("usp_AcabadoQuimicoFisico_getcsv", "", true, Util.ERP), id);
            return mensaje;
        }

        public string save_galgadiametro()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            string detail = _.Post("pardetail");
            int id = bl.save_Rows_Out("usp_galgadiametro_Guardar", par, Util.ERP, detail);
            string mensaje = _.Mensaje("new", id > 0, bl.get_Data("usp_galgadiametro_getcsv", "", true, Util.ERP), id);
            return mensaje;
        }

        public string getDataGalgaDiametro()
        {
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("usp_galgadiametro_getcsv", "", true, Util.ERP);
            return data;
        }
        
        public string save_pretratamiento()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            string detail = _.Post("pardetail");
            int id = bl.save_Rows("usp_Pretratamiento_Guardar", par, Util.ERP, detail);
            string mensaje = _.Mensaje("new", id > 0, bl.get_Data("usp_Pretratamiento_getcsv", "", true, Util.ERP), id);
            return mensaje;
        }

        public string save_tipotenido()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            string detail = _.Post("pardetail");
            int id = bl.save_Rows("usp_tipoteñido_Guardar", par, Util.ERP, detail);
            string mensaje = _.Mensaje("new", id > 0, bl.get_Data("usp_tipoteñido_getcsv", "", true, Util.ERP), id);
            return mensaje;
        }

        public string get_validacion_finalizaratx()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            //// SE COMENTA POR EL ATS SIN SDT
            string data = bl.get_Data("usp_getvalidacion_finalizaratx", par, true, Util.ERP);
            //string data = bl.get_Data("usp_getvalidacion_finalizaratx_sin_sdt", par, true, Util.ERP);
            return data;
        }

        public string operador_finaliza_atx()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");
            ////int rows = bl.save_Row("usp_Estado_OperadorFinalizaAtx_csv", par, Util.ERP);
            //// :NOTA: SE CAMBIO A ESTE STORE YA QUE ESTE ENVUELVE LA FINALIZACION DEL ATX NORMAL Y DE REENVIO; INCLUYE TAMBIEN LA REPLICA A FICHATECNICA Y A LA BD DE WTS INTRANET
            ////int rows = bl.save_Row("usp_FinalizarSolicitudAtx_csv", par, Util.ERP);
            int rows = bl.save_Rows("usp_FinalizarSolicitudAtx_csv", par, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }

        public string GetData_PrintAtx()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetData_PrintAtx_csv", par, true, Util.ERP);
            
            return data;
        }

        public string GetData_LoadIni_BuscadorAtx()
        {
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("uspGetLoadIni_FiltroBuscadorAtx", "", true, Util.ERP);
            return data;
        }

        public string GetData_AtxEstandar_y_Atx_b_comparar()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_Get_atxestandar_atx_a_comparar_finalizar", par, true, Util.ERP);
            return data;
        }

        // Jacob
        public string Save_CodigoTela_From_FinalizarAtx() {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            string result = bl.save_Row_String("usp_save_codigotela_11digitos_from_finalizaratx", par, 50, Util.ERP);
            //// SE COMENTA ESTO POR SIN SDT
            ////string result = bl.save_Row_String("usp_save_codigotela_newversion_from_finalizaratx", par, 50, Util.ERP);
            return result;
        }

        public string Save_New_Titulo_Hilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario.ToString());
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            int result = bl.save_Row_Out("usp_GrabarNewTitulo_csv", par, Util.ERP);
            string data = bl.get_Data("usp_GetTitulos_hilados_csv", "", false, Util.ERP);
            string mensaje = _.Mensaje("new", result > 0, data, result);
            return mensaje;
        }

        public string Save_New_FormaHilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario.ToString());
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            int result = bl.save_Row_Out("usp_GrabarNew_FormaHilado_csv", par, Util.ERP);
            string data = bl.get_Data("usp_GetFormaHilados_csv", "", false, Util.ERP);
            string mensaje = _.Mensaje("new", result > 0, data, result);
            return mensaje;
        }

        public string GetData_Buscar_TituloHilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_Buscar_Titulo_csv", par, false, Util.ERP);
            return data;
        }

        public string GetData_Buscar_FormaHilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_Buscar_FormaHilado_csv", par, false, Util.ERP);
            return data;
        }

        public string GetData_PartidaTest_by_CodPartida()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string result = bl.get_Data("uspPartidaTestObtenerCampos_CodPartida", par,false, Util.Intranet);
            return result;
        }
    }
}