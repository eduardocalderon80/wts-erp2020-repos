using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Web.Mvc;
using WTS_ERP.Models;
using Newtonsoft.Json.Linq;
using BL_ERP;
using BL_ERP.GestionProducto;
//using OfficeOpenXml;
//using OfficeOpenXml.Style;
using System.IO;
using System.Text;
using BE_ERP;
using BE_ERP.GestionProducto;
using Utilitario;
using Newtonsoft.Json;
using WTS_ERP.Models;
using System.Data;

namespace WTS_ERP.Areas.GestionProducto.Controllers
{
    public class EstiloController : Controller
    {
        private blMantenimiento oMantenimiento = null;
        private blEstilo oblEstilo = null;

        public EstiloController()
        {
            oMantenimiento = new blMantenimiento();
            oblEstilo = new blEstilo();
        }

        [AccessSecurity]
        public ActionResult Index()
        {
            string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            ViewBag.PathStyleWeb = PathFileServer + "erp/style/thumbnail/";
            return View();
        }

        public ActionResult _EnviarCorreoTechpack()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult New()
        {
            string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            ViewBag.Usuario = _.GetUsuario().Usuario.ToString();
            ViewBag.PathStyleWeb = PathFileServer + "erp/style/thumbnail/";
            ViewBag.PathFabricCombo = PathFileServer + "erp/style/FabricCombo/";
            ViewBag.perfil = _.GetUsuario().Perfiles;
            return View();
        }
        [AccessSecurity]
        public ActionResult Edit()
        {
            ViewBag.Usuario = _.GetUsuario().Usuario.ToString();
            string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            ViewBag.PathStyleWeb = PathFileServer + "erp/style/thumbnail/";// var ruta = '//WTS-FILESERVER/erp/style/thumbnail/';
            ViewBag.PathFabricCombo = PathFileServer + "erp/style/FabricCombo/";
            return View();
        }
        [AccessSecurity]
        public ActionResult _NewReq()
        {
            return PartialView();
        }
        [AccessSecurity]
        public ActionResult _Newversion()
        {
            return PartialView();
        }
        [AccessSecurity]
        public ActionResult _Color()
        {
            return PartialView();
        }

        public ActionResult _BuscarTrim() {
            return PartialView();
        }

        public string GetColorxEstilo() {
            string par = _.Get("par");

            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_ClienteEstiloColor_listar", par, false, Util.ERP);
            return data;
        }

        public ActionResult _EstilosAfectadosCambioTrim()
        {
            return View();
        }

        public ActionResult _ConsultaHangTagEstilos()
        {
            return View();
        }

        public ActionResult PrintHangTagEstilo()
        {
            string par = _.Get("par");
            ViewBag.parametro = par;
            return View();
        }

        public string Eliminar()
        {
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            blMantenimiento blm = new blMantenimiento();
            int id = blm.save_Row("usp_Estilo_Eliminar", par, Util.ERP);
            return id.ToString();
        }

        public string EliminarClienteEstiloColor()
        {
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            blMantenimiento blm = new blMantenimiento();
            int id = blm.save_Row("usp_ClienteEstiloColor_Eliminar", par, Util.ERP);
            return id.ToString();
        }
        [AccessSecurity]
        public ActionResult _CargarEstilo()
        {
            return PartialView();
        }

        public ActionResult _Migrar()
        {
            return PartialView();
        }

        public string getEstiloIntranet() {
            string par = _.Get("par");

            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_EstiloIntranet_get_csv", par, false, Util.ERP);
            return data;
        }

        public string MigrarEstiloIntranet() {
            string Estilo = _.Post("Estilo");
            string Color = _.Post("Color");
            string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            string image = _.Get_Par(Estilo, "nombreimagen");
            string Archivo = "";
            byte[] ArchivoByte = null;
            if (image != "") {
                Archivo = PathFileServer + "erp/style/thumbnail/" + image;
                ArchivoByte  = System.IO.File.ReadAllBytes(Archivo);
            }

            Estilo oEstilo = new Estilo();
            oEstilo.EstiloJSON = Estilo;
            oEstilo.imagenbyte = ArchivoByte;
            oEstilo.ColorJSON = Color;
            oEstilo.Usuario = _.GetUsuario().Usuario;
            oEstilo.Empresa = _.GetUsuario().IdEmpresa.ToString();

            int id_intranet = oblEstilo.Migrar(oEstilo);
          
            return id_intranet.ToString();              
        }

        public string NuevoReq()
        {
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            blMantenimiento blm = new blMantenimiento();
            int id = blm.save_Row_Out("uspEstiloNuevoReqDDP", par,Util.ERP);
            return id.ToString();
        }

        public string NewVersion()
        {
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            blMantenimiento blm = new blMantenimiento();
            int id = blm.save_Row_Out("uspEstiloNewVersion", par, Util.ERP);
            return id.ToString();
        }

        public string ObtenerDatosNewReq()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("uspEstiloObtenerDatosNuevoReq", par, true, Util.ERP);
            return data;
        }
         
        public ActionResult _BuscarTela()
        {
            return PartialView();
        }

        public string ValidarCodigo() {
            string par = _.Post("par");
            blMantenimiento blm = new blMantenimiento();
            int data = blm.save_Row_Out("usp_Estilo_Validar", par, Util.ERP);

            return data.ToString();
        }

        public string ObtenerEstilo()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            string data = oMantenimiento.get_Data("uspEstiloObtener", par, true, Util.ERP);

            return data;
        }
        public string ObtenerDatosCarga()
        {
            string data = oMantenimiento.get_Data("uspEstiloObtenerDatosCarga", _.GetUsuario().IdUsuario.ToString(), true, Util.ERP);
            return data;
        }
        public string ObtenerDatosCargaPorCliente()
        {
            string data = oMantenimiento.get_Data("uspEstiloObtenerDatosCargaPorCliente", _.Get("par"), true, Util.ERP);
            return data;
        }

        public string BuscarTelasPorFamilia()
        {
            string data = oMantenimiento.get_Data("uspEstiloBuscarTelasPorFamilia", _.Post("par"), true, Util.ERP);
            return data;
        }

        public string BuscarEstilo()
        {
            string par = _.Post("par") + "," + _.GetUsuario().IdUsuario.ToString();
            string data = oMantenimiento.get_Data("uspEstiloBuscarv2", par, true, Util.ERP);
            return data;
        }
        [AccessSecurity]
        public ActionResult Descargar(string filename,string originalfilename)
        {
            
            if (filename != null)
            {
                string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
                string FilePath = PathFileServer + "erp/style/artwork/"+ filename;
                
                FileStream stream = new FileStream(FilePath, FileMode.Open);
                FileStreamResult result = new FileStreamResult(stream, filename);
                result.FileDownloadName = originalfilename;
                return result;
            }
            else return RedirectToAction("index");
        }
        public string Save_new_estilo(byte[] ImagenWebCopy, byte[] ImagenWebFabricCombo)
        {
            string Ruta = ConfigurationManager.AppSettings["FileServer"].ToString();

            bool exito = false;

            string Estilo = _.Post("Estilo");
            string Fabric = _.Post("Fabric");
            string Process = _.Post("Process");
            string Artwork = _.Post("Artwork");
            string Trim = _.Post("Trim");
            string ProcessColor = _.Post("ProcessColor");
            string ArtworkColor = _.Post("ArtworkColor");
            string TrimColor = _.Post("TrimColor");
            string ArtworkfileStr = _.Post("ArtworkfileStr");
            string Callout = _.Post("Callout");
            string ProcessE = _.Post("ProcessE");
            string ArtworkE = _.Post("ArtworkE");
            string TrimE = _.Post("TrimE");
            string ProcessColorE = _.Post("ProcessColorE");
            string ArtworkColorE = _.Post("ArtworkColorE");
            string TrimColorE = _.Post("TrimColorE");
            string Usuario = _.GetUsuario().Usuario.ToString();
            string IdEmpresa = _.GetUsuario().IdEmpresa.ToString();
            string EstiloxCombo = _.Post("estiloxcombojson");
            string EstiloxComboColor = _.Post("estiloxcombocolorjson");
            string EstiloxFabricCombo = _.Post("estiloxfabriccombojson");
            string EstiloxFabricComboColor = _.Post("estiloxfabriccombocolorjson");
            string EstiloTechpack = _.Post("estilotechkpack");

            HttpPostedFileBase EstiloImagen = Request.Files["EstiloImagen"];

            string ImagenWebNombre = "";
            string ImagenNombre = "";
            string ImagenNombreArchivo = "";

            //byte[] ImagenWebByte = Convert.ToByte(Request.Form["ImagenWeb"])// _.Post("bCopy");

            if (EstiloImagen != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenNombre = "";
                string cImagenWebNombre = "";
                string cRutaImagenOriginal = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenOriginal = @"\\" + Ruta + @"erp\style\original\";
                cRutaImagenMiniatura = @"\\" + Ruta + @"erp\style\thumbnail\";

                ImagenNombreArchivo = System.IO.Path.GetFileName(EstiloImagen.FileName);

                MemoryStream target = new MemoryStream();
                EstiloImagen.InputStream.CopyTo(target);

                byte[] Imagen = target.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(EstiloImagen.FileName);
                Random oAleatorio = new Random();

                string cFolderOriginal = cRutaImagenOriginal;
                cImagenNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderOriginal, cImagenNombre), Imagen);

                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenNombre = cImagenNombre;
                ImagenWebNombre = cImagenWebNombre;
            }
            else if (ImagenWebCopy != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenNombre = "";
                string cImagenWebNombre = "";
                string cRutaImagenOriginal = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenOriginal = @"\\" + Ruta + @"erp\style\original\";
                cRutaImagenMiniatura = @"\\" + Ruta + @"erp\style\thumbnail\";                
                
                ImagenNombreArchivo = _.Post("ImagenNombre");

                byte[] Imagen = ImagenWebCopy.ToArray();
                
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);
                 
                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(ImagenNombreArchivo);
                Random oAleatorio = new Random();

                string cFolderOriginal = cRutaImagenOriginal;
                cImagenNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderOriginal, cImagenNombre), Imagen);

                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenNombre = cImagenNombre;
                ImagenWebNombre = cImagenWebNombre;
            }
            
            Estilo = _.addParameter(Estilo, "ImagenWebNombre", ImagenWebNombre);
            Estilo = _.addParameter(Estilo, "ImagenNombre", ImagenNombre);
            Estilo = _.addParameter(Estilo, "ImagenNombreArchivo", ImagenNombreArchivo);

            // GUARDAR IMAGE FABRIC COMBO
            HttpPostedFileBase ImageFabricCombo = Request.Files["ImageFabricCombo"];
            if (ImageFabricCombo != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();
 
                string cImagenWebNombre = "";          
                string cRutaImagenMiniatura = "";
               
                cRutaImagenMiniatura = @"\\" + Ruta + @"erp\style\FabricCombo\";

                ImagenNombreArchivo = System.IO.Path.GetFileName(ImageFabricCombo.FileName);

                MemoryStream target = new MemoryStream();
                ImageFabricCombo.InputStream.CopyTo(target);

                byte[] Imagen = target.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(ImageFabricCombo.FileName);
                Random oAleatorio = new Random();
                 
                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);
 
                ImagenWebNombre = cImagenWebNombre;
            }
            else if (ImagenWebFabricCombo != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenWebNombre = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenMiniatura = @"\\" + Ruta + @"erp\style\FabricCombo\";
                ImagenNombreArchivo = _.Post("ImagenNombreFabricCombo");

                byte[] Imagen = ImagenWebFabricCombo.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(ImagenNombreArchivo);
                Random oAleatorio = new Random();

                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenWebNombre = cImagenWebNombre;
            }

            Estilo = _.addParameter(Estilo, "ImagenWebNombreFabricCombo", ImagenWebNombre);

            // GUARDAR ARCHIVO ARTE
            List<ArtworkFile> ArtworkFile = new List<ArtworkFile>();

            if (ArtworkfileStr != "")
            {
                Random oAleatorio = new Random();
                ArtworkfileStr = ArtworkfileStr.Substring(0, ArtworkfileStr.Length - 1);
                var FileIds = ArtworkfileStr.Split(',');
                string ArtoworkFileRuta = @"\\" + Ruta + @"erp\style\artwork\";

                foreach (var item in FileIds)
                {

                    HttpPostedFileBase file = Request.Files[item];
                    string[] datos = item.Split('_');
                    ArtworkFile oArtworkFile = new ArtworkFile();

                    oArtworkFile.Reference = datos[1];
                    oArtworkFile.NombreArchivoOriginal = Path.GetFileName(file.FileName);

                    string cExtension = "";
                    cExtension = System.IO.Path.GetExtension(file.FileName);
                    string FileName = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                    oArtworkFile.NombreArchivo = FileName;

                    ArtoworkFileRuta = ArtoworkFileRuta + FileName;
                    file.SaveAs(ArtoworkFileRuta);
                    ArtworkFile.Add(oArtworkFile);
                }
            }

            string ArtworkFileJSON = "";

            if (ArtworkFile.Count > 0)
            {
                ArtworkFileJSON = JsonConvert.SerializeObject(ArtworkFile, Formatting.Indented).ToString();
            }

            #region ESTILO X TECHPACK
            JArray listjsontechpack = new JArray();
            Random rAleatorio = new Random();

            JArray jsonArr_techpack = JArray.Parse(EstiloTechpack) as JArray;
            var lsttechpack = jsonArr_techpack.ToArray();

            foreach (string item in Request.Files)
            {
                MemoryStream streamEstiloTechpack = new MemoryStream();

                var file_estilo = Request.Files[item];

                string nombrearchivooriginal = System.IO.Path.GetFileName(file_estilo.FileName);
                string extensiontechpack = System.IO.Path.GetExtension(file_estilo.FileName);
                string nombrearchivogenerado = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, rAleatorio.Next(10, 100), extensiontechpack);

                string nombrearchivo_techpack_js = "", comentario_techpack_js = "";
                for (int i = 0; i < lsttechpack.Length; i++)
                {
                    nombrearchivo_techpack_js = "";
                    if (lsttechpack[i]["archivo"].ToString() == nombrearchivooriginal)
                    {
                        nombrearchivo_techpack_js = lsttechpack[i]["archivo"].ToString();
                        comentario_techpack_js = lsttechpack[i]["comentario"].ToString();
                        break;
                    }

                }

                JObject objtechpack = new JObject();
                objtechpack.Add("NombreArchivoOriginal", nombrearchivooriginal);
                objtechpack.Add("NombreArchivo", nombrearchivogenerado);
                objtechpack.Add("Comentario", comentario_techpack_js);

                file_estilo.InputStream.CopyTo(streamEstiloTechpack);
                byte[] bfile_techpack = streamEstiloTechpack.ToArray();
                //string ruta_estilotechpack = @ruta + ""
                //string ruta_estilotechpack = Server.MapPath("~/Content/techpack/" + nombrearchivogenerado);
                string ruta_estilotechpack = @Ruta + "erp/style/techpack/" + nombrearchivogenerado;
                System.IO.File.WriteAllBytes(ruta_estilotechpack, bfile_techpack);

                listjsontechpack.Add(objtechpack);
            }

            var estilotechpack_new = JsonConvert.SerializeObject(listjsontechpack);
            #endregion

            BE_ERP.GestionProducto.Estilo oEstilo = new BE_ERP.GestionProducto.Estilo();

            oEstilo.EstiloJSON = Estilo;
            oEstilo.CalloutJSON = Callout;
            oEstilo.FabricJSON = Fabric;
            oEstilo.ProcessJSON = Process;
            oEstilo.ProcessColorJSON = ProcessColor;
            oEstilo.ArtworkJSON = Artwork;          
            oEstilo.ArtworkColorJSON = ArtworkColor;
            oEstilo.ArtworkFileJSON = ArtworkFileJSON;
            oEstilo.TrimJSON = Trim;
            oEstilo.TrimColorJSON = TrimColor;         
            oEstilo.Usuario = Usuario;
            oEstilo.Empresa = IdEmpresa;
            oEstilo.ProcessE = ProcessE;
            oEstilo.ArtworkE = ArtworkE;
            oEstilo.TrimE = TrimE;
            oEstilo.ProcessColorE = ProcessColorE;
            oEstilo.ArtworkColorE = ArtworkColorE;
            oEstilo.TrimColorE = TrimColorE;
            oEstilo.EstiloxComboJSON = EstiloxCombo;
            oEstilo.EstiloxComboColorJSON = EstiloxComboColor;
            oEstilo.EstiloxFabricComboJSON = EstiloxFabricCombo;
            oEstilo.EstiloxFabricComboColorJSON = EstiloxFabricComboColor;
            oEstilo.estilotechpack = estilotechpack_new;

            int idestilo_return = oblEstilo.Save(oEstilo, Util.ERP);
            //exito = nrows > 0;
            
            return _.Mensaje("new", idestilo_return > 0, null, idestilo_return);
        }

        public string Save_edit_estilo(byte[] ImagenWebCopy, byte[] ImagenWebFabricCombo)
        {
            string Ruta = ConfigurationManager.AppSettings["FileServer"].ToString();

            bool exito = false;

            string Estilo = _.Post("Estilo");
            string Fabric = _.Post("Fabric");
            string TelasColor = _.Post("telascolor");
            string Process = _.Post("Process");
            string Artwork = _.Post("Artwork");
            string Trim = _.Post("Trim");
            string ProcessColor = _.Post("ProcessColor");
            string ArtworkColor = _.Post("ArtworkColor");
            string TrimColor = _.Post("TrimColor");
            string ArtworkfileStr = _.Post("ArtworkfileStr");
            string Callout = _.Post("Callout");
            string ProcessE = _.Post("ProcessE");
            string ArtworkE = _.Post("ArtworkE");
            string TrimE = _.Post("TrimE");
            string ProcessColorE = _.Post("ProcessColorE");
            string ArtworkColorE = _.Post("ArtworkColorE");
            string TrimColorE = _.Post("TrimColorE");
            string Usuario = _.GetUsuario().Usuario.ToString();
            string IdEmpresa = _.GetUsuario().IdEmpresa.ToString();
            string EstiloxCombo = _.Post("estiloxcombojson");
            string EstiloxComboColor = _.Post("estiloxcombocolorjson");
            string EstiloxFabricCombo = _.Post("estiloxfabriccombojson");
            string EstiloxFabricComboColor = _.Post("estiloxfabriccombocolorjson");
            string EstiloTechpack = _.Post("estilotechkpack");

            HttpPostedFileBase EstiloImagen = Request.Files["EstiloImagen"];

            string ImagenWebNombre = "";
            string ImagenNombre = "";
            string ImagenNombreArchivo = "";

            //byte[] ImagenWebByte = Convert.ToByte(Request.Form["ImagenWeb"])// _.Post("bCopy");

            if (EstiloImagen != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenNombre = "";
                string cImagenWebNombre = "";
                string cRutaImagenOriginal = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenOriginal = @"\\" + Ruta + @"erp\style\original\";
                cRutaImagenMiniatura = @"\\" + Ruta + @"erp\style\thumbnail\";

                ImagenNombreArchivo = System.IO.Path.GetFileName(EstiloImagen.FileName);

                MemoryStream target = new MemoryStream();
                EstiloImagen.InputStream.CopyTo(target);

                byte[] Imagen = target.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(EstiloImagen.FileName);
                Random oAleatorio = new Random();

                string cFolderOriginal = cRutaImagenOriginal;
                cImagenNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderOriginal, cImagenNombre), Imagen);

                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenNombre = cImagenNombre;
                ImagenWebNombre = cImagenWebNombre;
            }
            else if (ImagenWebCopy != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenNombre = "";
                string cImagenWebNombre = "";
                string cRutaImagenOriginal = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenOriginal = @"\\" + Ruta + @"erp\style\original\";
                cRutaImagenMiniatura = @"\\" + Ruta + @"erp\style\thumbnail\";

                ImagenNombreArchivo = _.Post("ImagenNombre");

                byte[] Imagen = ImagenWebCopy.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(ImagenNombreArchivo);
                Random oAleatorio = new Random();

                string cFolderOriginal = cRutaImagenOriginal;
                cImagenNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderOriginal, cImagenNombre), Imagen);

                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenNombre = cImagenNombre;
                ImagenWebNombre = cImagenWebNombre;
            }

            Estilo = _.addParameter(Estilo, "ImagenWebNombre", ImagenWebNombre);
            Estilo = _.addParameter(Estilo, "ImagenNombre", ImagenNombre);
            Estilo = _.addParameter(Estilo, "ImagenNombreArchivo", ImagenNombreArchivo);

            // GUARDAR IMAGE FABRIC COMBO
            HttpPostedFileBase ImageFabricCombo = Request.Files["ImageFabricCombo"];
            if (ImageFabricCombo != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenWebNombre = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenMiniatura = @"\\" + Ruta + @"erp\style\FabricCombo\";

                ImagenNombreArchivo = System.IO.Path.GetFileName(ImageFabricCombo.FileName);

                MemoryStream target = new MemoryStream();
                ImageFabricCombo.InputStream.CopyTo(target);

                byte[] Imagen = target.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(ImageFabricCombo.FileName);
                Random oAleatorio = new Random();

                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenWebNombre = cImagenWebNombre;
            }
            else if (ImagenWebFabricCombo != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenWebNombre = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenMiniatura = @"\\" + Ruta + @"erp\style\FabricCombo\";
                ImagenNombreArchivo = _.Post("ImagenNombreFabricCombo");

                byte[] Imagen = ImagenWebFabricCombo.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(ImagenNombreArchivo);
                Random oAleatorio = new Random();

                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenWebNombre = cImagenWebNombre;
            }

            Estilo = _.addParameter(Estilo, "ImageFabricCombo", ImagenWebNombre);

            List<ArtworkFile> ArtworkFile = new List<ArtworkFile>();

            if (ArtworkfileStr != "")
            {
                Random oAleatorio = new Random();
                ArtworkfileStr = ArtworkfileStr.Substring(0, ArtworkfileStr.Length - 1);
                var FileIds = ArtworkfileStr.Split(',');
                string ArtoworkFileRuta = @"\\" + Ruta + @"erp\style\artwork\";

                foreach (var item in FileIds)
                {

                    HttpPostedFileBase file = Request.Files[item];
                    string[] datos = item.Split('_');
                    ArtworkFile oArtworkFile = new ArtworkFile();

                    oArtworkFile.Reference = datos[1];
                    oArtworkFile.NombreArchivoOriginal = Path.GetFileName(file.FileName);

                    string cExtension = "";
                    cExtension = System.IO.Path.GetExtension(file.FileName);
                    string FileName = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                    oArtworkFile.NombreArchivo = FileName;

                    ArtoworkFileRuta = ArtoworkFileRuta + FileName;
                    file.SaveAs(ArtoworkFileRuta);
                    ArtworkFile.Add(oArtworkFile);
                }
            }

            string ArtworkFileJSON = "";

            if (ArtworkFile.Count > 0)
            {
                ArtworkFileJSON = JsonConvert.SerializeObject(ArtworkFile, Formatting.Indented).ToString();
            }

            BE_ERP.GestionProducto.Estilo oEstilo = new BE_ERP.GestionProducto.Estilo();

            #region ESTILO X TECHPACK
            JArray listjsontechpack = new JArray();
            Random rAleatorio = new Random();
            
            JArray jsonArr_techpack = JArray.Parse(EstiloTechpack) as JArray;
            var lsttechpack = jsonArr_techpack.ToArray();

            foreach (string item in Request.Files)
            {
                MemoryStream streamEstiloTechpack = new MemoryStream();
                
                var file_estilo = Request.Files[item];

                string nombrearchivooriginal = System.IO.Path.GetFileName(file_estilo.FileName);
                string extensiontechpack = System.IO.Path.GetExtension(file_estilo.FileName);
                string nombrearchivogenerado = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, rAleatorio.Next(10, 100), extensiontechpack);

                string nombrearchivo_techpack_js = "", comentario_techpack_js = "";
                for (int i = 0; i < lsttechpack.Length; i++)
                {
                    nombrearchivo_techpack_js = "";
                    if (lsttechpack[i]["archivo"].ToString() == nombrearchivooriginal) {
                        nombrearchivo_techpack_js = lsttechpack[i]["archivo"].ToString();
                        comentario_techpack_js = lsttechpack[i]["comentario"].ToString();
                        break;
                    }
                    
                } 
                
                JObject objtechpack = new JObject();
                objtechpack.Add("NombreArchivoOriginal", nombrearchivooriginal);
                objtechpack.Add("NombreArchivo", nombrearchivogenerado);
                objtechpack.Add("Comentario", comentario_techpack_js);
                
                file_estilo.InputStream.CopyTo(streamEstiloTechpack);
                byte[] bfile_techpack = streamEstiloTechpack.ToArray();
                
                //string ruta_estilotechpack = Server.MapPath("~/Content/techpack/" + nombrearchivogenerado);
                string ruta_estilotechpack = @Ruta + "erp/style/techpack/" + nombrearchivogenerado;
                System.IO.File.WriteAllBytes(ruta_estilotechpack, bfile_techpack);

                listjsontechpack.Add(objtechpack);
            }

            var estilotechpack_new = JsonConvert.SerializeObject(listjsontechpack);
            #endregion
            //Estilo = _.addParameter(Estilo, "estilotechpack", xd);

            oEstilo.EstiloJSON = Estilo;
            oEstilo.CalloutJSON = Callout;
            oEstilo.FabricJSON = Fabric;
            oEstilo.TelasColorJSON = TelasColor;
            oEstilo.ProcessJSON = Process;
            oEstilo.ProcessColorJSON = ProcessColor;
            oEstilo.ArtworkJSON = Artwork;
            oEstilo.ArtworkColorJSON = ArtworkColor;
            oEstilo.ArtworkFileJSON = ArtworkFileJSON;
            oEstilo.TrimJSON = Trim;
            oEstilo.TrimColorJSON = TrimColor;
            oEstilo.Usuario = Usuario;
            oEstilo.Empresa = IdEmpresa;
            oEstilo.ProcessE = ProcessE;
            oEstilo.ArtworkE = ArtworkE;
            oEstilo.TrimE = TrimE;
            oEstilo.ProcessColorE = ProcessColorE;
            oEstilo.ArtworkColorE = ArtworkColorE;
            oEstilo.TrimColorE = TrimColorE;
            oEstilo.EstiloxComboJSON = EstiloxCombo;
            oEstilo.EstiloxComboColorJSON = EstiloxComboColor;
            oEstilo.EstiloxFabricComboJSON = EstiloxFabricCombo;
            oEstilo.EstiloxFabricComboColorJSON = EstiloxFabricComboColor;
            oEstilo.estilotechpack = estilotechpack_new;

            int nrows = oblEstilo.Save_edit_estilo(oEstilo, Util.ERP);
            exito = nrows > 0;

            return _.Mensaje("new", exito);
        }

        public FileResult DownloadPO(string filename)
        {
            string Path = System.Web.HttpContext.Current.Server.MapPath("~/Content/");
            return File(string.Format(Path + "{0}", filename), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
         
        public string getData_iniCombosBuscarTela()
        {
            blMantenimiento blm = new blMantenimiento();

            string par = _.Get("par");
            string data = blm.get_Data("uspComboIniBuscarTela_Estilos", par, true, Util.ERP);
            return data;
        }

        public string getData_buscarEstilo()
        {
            blMantenimiento blm = new blMantenimiento();

            string par = _.Get("par");
            string data = blm.get_Data("uspEstiloBuscarTelaFromEstilos", par, false, Util.ERP);
            return data;
        }
        [AccessSecurity]
        public ActionResult PdChart()
        {
            return View();
        }

        public string getdata_pdchart_datacliente_ini()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("uspObtenerDatosCargaCliente_pdchart_ini", par, true, Util.ERP);
            return data;
        }

        public string getdata_pdchart_dataxcliente() {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("uspObtenerDatosCargaPorCliente_pdchart", par, true, Util.ERP);
            return data;
        }

        public FileResult ExportarExcel_pdchart()
        {
            blEstilo bl = new blEstilo();
            string par = _.Get("par"); //"{ \"idcliente\": \"19\",\"idclientedivision\":\"19\",\"idclientetemporada\":\"234\" }";
            string nombrecliente = _.Get("nombrecliente");
            string nombredivision = _.Get("nombredivision");
            string nombretemporada = _.Get("nombretemporada");
            PdChart pdchart = bl.GetPdChart("uspEstiloObtener_pdchart", par, Util.ERP);
             
            string titulos_cabecera_reporte = pdchart.titulos_columnas_reporte;

            List<Estilo> listestilo = new List<Estilo>();
            listestilo = JsonConvert.DeserializeObject<List<Estilo>>(pdchart.estilos);

            List<FichaTecnica> listtelas = new List<FichaTecnica>();
            listtelas = JsonConvert.DeserializeObject<List<FichaTecnica>>(pdchart.telas);

            List<FichaTecnicaColor_LabDip> listtelas_color = new List<FichaTecnicaColor_LabDip>();
            listtelas_color = JsonConvert.DeserializeObject<List<FichaTecnicaColor_LabDip>>(pdchart.colorfichatecnica);

            List<FichaTecnicaColor_LabDip> listproyectotela_color = new List<FichaTecnicaColor_LabDip>();
            listproyectotela_color = JsonConvert.DeserializeObject<List<FichaTecnicaColor_LabDip>>(pdchart.colorproyectotela);

            List<ProyectoTela_Proceos> listproyectotela_proceso = new List<ProyectoTela_Proceos>();
            listproyectotela_proceso = JsonConvert.DeserializeObject<List<ProyectoTela_Proceos>>(pdchart.proyectotelaproceso);

            List<EstiloxProceso> listprocesos = new List<EstiloxProceso>();
            listprocesos = JsonConvert.DeserializeObject<List<EstiloxProceso>>(pdchart.proceso);

            List<EstiloxProcesoColor> listprocesosxcolor = new List<EstiloxProcesoColor>();
            listprocesosxcolor = JsonConvert.DeserializeObject<List<EstiloxProcesoColor>>(pdchart.procesocolor);

            List<EstiloxArte> listestiloxarte = new List<EstiloxArte>();
            listestiloxarte = JsonConvert.DeserializeObject<List<EstiloxArte>>(pdchart.artwork);

            List<EstiloxArteColor> listestiloxartecolor = new List<EstiloxArteColor>();
            listestiloxartecolor = JsonConvert.DeserializeObject<List<EstiloxArteColor>>(pdchart.artworkcolor);

            List<EstiloxTrim> listestiloxtrim = new List<EstiloxTrim>();
            listestiloxtrim = JsonConvert.DeserializeObject<List<EstiloxTrim>>(pdchart.trim);

            List<EstiloxTrimColor> listestiloxtrimcolor = new List<EstiloxTrimColor>();
            listestiloxtrimcolor = JsonConvert.DeserializeObject<List<EstiloxTrimColor>>(pdchart.trimcolor);

            List<Requerimiento_pdchart> listrequerimiento = new List<Requerimiento_pdchart>();
            listrequerimiento = JsonConvert.DeserializeObject<List<Requerimiento_pdchart>>(pdchart.requerimientos);

            List<RequerimientoDetalle_pdchart> listrequerimientodetalle = new List<RequerimientoDetalle_pdchart>();
            listrequerimientodetalle = JsonConvert.DeserializeObject<List<RequerimientoDetalle_pdchart>>(pdchart.requerimientodetalle);

            List<RequerimientoComentario_pdchart> listrequerimientocomentario = new List<RequerimientoComentario_pdchart>();
            listrequerimientocomentario = JsonConvert.DeserializeObject<List<RequerimientoComentario_pdchart>>(pdchart.requerimientocomentario);

            List<Callout> listcallout = new List<Callout>();
            listcallout = JsonConvert.DeserializeObject<List<Callout>>(pdchart.callout);

            List<EstiloxCombo> listaestiloxcombo = new List<EstiloxCombo>();
            listaestiloxcombo = JsonConvert.DeserializeObject<List<EstiloxCombo>>(pdchart.estiloxcombo);

            List<EstiloxComboColor> listaestiloxcombocolor = new List<EstiloxComboColor>();
            listaestiloxcombocolor = JsonConvert.DeserializeObject<List<EstiloxComboColor>>(pdchart.estiloxcombocolor);

            // :add ESTILO X FABRIC - COLOR
            List<EstiloxFabricCombo> listaestiloxfabriccombo = new List<EstiloxFabricCombo>();
            listaestiloxfabriccombo = JsonConvert.DeserializeObject<List<EstiloxFabricCombo>>(pdchart.estiloxfabriccombo);

            List<EstiloxFabricComboColor> listaestiloxfabriccombocolor = new List<EstiloxFabricComboColor>();
            listaestiloxfabriccombocolor = JsonConvert.DeserializeObject<List<EstiloxFabricComboColor>>(pdchart.estiloxfabriccombocolor);

            string nombredelahojaexcel = "PdChartSheet", nombreArchivo = "PdChart_NombreArchivo.xlsx"; ;

            byte[] bytearchivo = bl.ExportarToExcelPdChart(nombredelahojaexcel, listestilo, listtelas, listtelas_color, listproyectotela_color, listproyectotela_proceso, listprocesos, listprocesosxcolor, listestiloxarte, listestiloxartecolor,
                listestiloxtrim, listestiloxtrimcolor, listrequerimiento, listrequerimientodetalle, listrequerimientocomentario, listcallout, listaestiloxcombo, listaestiloxcombocolor,
                listaestiloxfabriccombo, listaestiloxfabriccombocolor,
                titulos_cabecera_reporte, nombrecliente, nombredivision, nombretemporada);
                        
            return File(bytearchivo, System.Net.Mime.MediaTypeNames.Application.Octet, nombreArchivo);
        }

        public string UploadStyle() {
            _Helper helper = new _Helper();
            string file = helper.Upload_file(Request.Files["archivo"]);
            DataTable tabla = !string.IsNullOrEmpty(file) ? helper.convertExceltoDataSet(file) : null;
            string data = (tabla != null && tabla.Rows.Count > 0) ? helper.ConvertDataTableToHTML(tabla) : string.Empty;
            return data;
            //bool exito = false;
            //int id = -1;
            //string Retorna;
            // if (tabla != null)
            //{

            //    blMantenimiento oMantenimiento = new blMantenimiento();
            //    exito = (oMantenimiento.save_Row("usp_EstiloCarga_eliminar", "", Util.ERP) >= 0) ? oMantenimiento.save_Rows_BulkCopy("EstiloCarga", tabla, Util.ERP) : false;
            //    Retorna = exito ? (oMantenimiento.save_Row_String("usp_EstiloCarga_insertar", _.Post("par"),0, Util.ERP)) : "";
                               
            //}

            //return _.Mensaje("new", exito, data);
        }

        public string ValidarMasivo() {

            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            
            string data = blm.get_Data("usp_Estilo_ValidarMasivo", par, false, Util.ERP);
            return data;

        }

        public string GuardarMasivo()
        {
            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = string.Empty;
            string parfoot = string.Empty;

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);

            blMantenimiento oMantenimiento = new blMantenimiento();
             
            int id = oMantenimiento.save_Rows("usp_Estilo_InsertarMasivo", par, Util.ERP, pardetalle, parsubdetail, parfoot);
       
            return id.ToString();
        }

        public string CrearColor() {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            int data = blm.save_Row_Out("usp_ClienteEstiloColor_insertar", par,  Util.ERP);
            return data.ToString();

        }

        public string GetBuscarTrimFromEstilos()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspGetBuscarTrimFromEstilos_csv", par, true, Util.ERP);
            return data;
        }

        public string GetTrimsMasivoSeleccionados_BuscarTrim()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("GetTrims_Masivo_SeleccionadosFromEstilos", par, true, Util.ERP);
            return data;
        }

        public string Save_add_trim_color() {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");
            int idtrim = Convert.ToInt32(_.Get_Par(par, "idtrim"));
            int id = blm.save_Rows_Out("uspSaveTrim_Add_Color", par, Util.ERP);
            string mensaje =_.Mensaje("edit", id > 0, blm.get_Data("uspGetTrimByIdTrim_json", idtrim.ToString(), true, Util.ERP), id);
            return mensaje;
        }

        public string ValidarTrimSiAfecta_OtrosEstilos()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspValidarAntesEditarTrimFromEstilos_csv", par, true, Util.ERP);
            return data;
        }

        public FileResult DownloadFileEstiloTechpack(string nombrearchivogenerado, string nombrearchivooriginal, string origen) {
            string fileserver = ConfigurationManager.AppSettings["FileServer"].ToString();

            string ruta = @fileserver;
            if (origen == "estilo") {
                ruta += "erp/style/techpack/" + nombrearchivogenerado;
            } else if (origen == "requerimiento") {
                ruta += "erp/ddp/" + nombrearchivogenerado;
            }
                        
            byte[] bfile = System.IO.File.ReadAllBytes(ruta);
            return File(bfile, System.Net.Mime.MediaTypeNames.Application.Octet, nombrearchivooriginal);
        }

        public string GetDataCorreoTechpackIni()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("GetDataCorreoIniTechpack_csv", par, true, Util.ERP);
            return data;
        }

        public string SendMailTechpack()
        {
            blMantenimiento bl = new blMantenimiento();
            
            string par = _.Post("par");
            string pathfileserver = ConfigurationManager.AppSettings["FileServer"].ToString();
            string copiaoculta = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();

            par = _.addParameter(par, "codigo_usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "correo_usuario", _.GetUsuario().Correo);
            par = _.addParameter(par, "copia_hide_mail", copiaoculta.Replace(',', ';'));

            var nombrearchivooriginal = _.Get_Par(par, "nombrearchivooriginal");
            var nombrearchivogenerado = _.Get_Par(par, "nombrearchivogenerado");
            string[] arr_nombrearchivo = nombrearchivooriginal.Split('.');
            string nombrecompleto_paracorreo = arr_nombrearchivo[0] + "_" + nombrearchivogenerado;

            //var ruta = Server.MapPath("~/Content/techpack/" + nombrearchivogenerado);
            string ruta = @pathfileserver + "erp/style/techpack/" + nombrearchivogenerado;

            byte[] barchivo_origen = System.IO.File.ReadAllBytes(ruta);

            var ruta_destino = Server.MapPath("~/Content/temp_filecorreo/" + nombrecompleto_paracorreo);
            
            System.IO.File.WriteAllBytes(ruta_destino, barchivo_origen);

            par = _.addParameter(par, "file_attachments_mail", nombrecompleto_paracorreo);

            int rows = bl.save_Row("usp_SendEmailCorreoEstiloTechpackCSV", par, Util.ERP);
            string mensaje = _.Mensaje("sendmail", (rows > 0));
            return mensaje;
        }

        public string BuscarEstilos_HangTag()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par") + "," + _.GetUsuario().IdUsuario.ToString();

            string data = bl.get_Data("usp_EstiloBuscarHangTag_csv", par, false, Util.ERP);
            return data;
        }

        public string GetData_PrintEstilosHangTag()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetDataEstiloTela_HangTag_csv", par, false, Util.ERP);
            return data;
        }
    }
}