using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Requerimiento.Models;
using WTS_ERP.Areas.Requerimiento.Services;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Requerimiento.Controllers
{
    public class ColorController : Controller
    {
        // GET: Requerimiento/Color
        string RutaFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
        string RutaFileColorFile = ConfigurationManager.AppSettings["FileRequerientoColor"].ToString();
        private readonly IColorService _colorSevice;
        public ColorController(IColorService colorService)
        {
            this._colorSevice = colorService;
        }

        public string DeleteColorById_JSON()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            ColorViewModels color = JsonConvert.DeserializeObject<ColorViewModels>(sParModel);
            int rows = _colorSevice.DeleteColorById_JSON(color);
            string mensaje = _.Mensaje("edit", rows > 0, _colorSevice.GetListRequerimientoByPrograma_JSON(color.IdPrograma.ToString()), rows);

            return mensaje;
        }

        [AccessSecurity]
        public ActionResult _NewColor()
        {
            ViewBag.RutaFileServer = @RutaFileServer + RutaFileColorFile;
            return View();
        }

        [AccessSecurity]
        public ActionResult _AddColor()
        {
            return View();
        }

        public ActionResult _Concession()
        {
            return View();
        }

        public string GetColorLoadNew_JSON()
        {
            string sParModel = _.Get("par");
            sParModel = _.addParameter(sParModel, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            ColorViewModels parametro = JsonConvert.DeserializeObject<ColorViewModels>(sParModel);
            return _colorSevice.GetColorLoadNew_JSON(parametro);
        }

        public string GetColorConcessionLoadNew_JSON()
        {
            string sParModel = _.Get("par");
            sParModel = _.addParameter(sParModel, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            ColorViewModels parametro = JsonConvert.DeserializeObject<ColorViewModels>(sParModel);
            return _colorSevice.GetColorConcessionLoadNew_JSON(parametro);
        }

        public string SaveRequerimientoConcesion_JSON()
        {
            string sParColorModel = _.Post("requerimientoJSON");         
            
            sParColorModel = _.addParameter(sParColorModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParColorModel = _.addParameter(sParColorModel, "UsuarioActualizacion", _.GetUsuario().Usuario);

            ColorConcesion requerimiento = JsonConvert.DeserializeObject<ColorConcesion>(sParColorModel);      
            int IdConsecion = _colorSevice.EnviarConcesion_JSON(requerimiento);

            string mensaje = _.Mensaje("new", IdConsecion > 0, IdConsecion.ToString(), IdConsecion);
            return mensaje;
        }

        public string GetListaColorByPrograma_JSON()
        {
            string par = _.Get("par");
            return _colorSevice.GetListRequerimientoByPrograma_JSON(par);
        }

        public string SaveRequerimiento_JSON()
        {
            string sParColorModel = _.Post("requerimientoJSON");
            string ParameterComboColor = _.Post("requerimientoComboColorJSON");
            string sParameterTest = _.Post("requerimientoTestJSON");
            string sParameterTestReport = _.Post("requerimientoTestReportJSON");
            string sParameterFileProp = _.Post("requerimientoFilePropJSON");
            
            
            sParColorModel = _.addParameter(sParColorModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParColorModel = _.addParameter(sParColorModel, "UsuarioActualizacion", _.GetUsuario().Usuario);          

            ColorViewModels requerimiento = JsonConvert.DeserializeObject<ColorViewModels>(sParColorModel);
            List<ColorTest> ParameterTest = JsonConvert.DeserializeObject<List<ColorTest>>(sParameterTest);
            List<ColorTestReport> ParameterTestReport = JsonConvert.DeserializeObject<List<ColorTestReport>>(sParameterTestReport);

            if (requerimiento.flgCambioImagen == 1) { 
                ColorFile file = SaveFile("Imagen");
                requerimiento.ImagenNombre = file.NombreArchivo;
                requerimiento.ImagenOriginal = file.NombreArchivoOriginal;
                requerimiento.ImagenWebNombre = file.NombreArchivoOriginal;
            }

            //TryValidateModel(requerimiento);
            //if (!ModelState.IsValid)
            //{
            //    return _.Mensaje("new", false, null, -1);
            //}

            int IdRequerimientoDetalle = _colorSevice.Save_JSON(requerimiento, ParameterComboColor, ParameterTest, sParameterFileProp, ParameterTestReport);

            string mensaje = _.Mensaje("new", IdRequerimientoDetalle > 0, IdRequerimientoDetalle.ToString(), IdRequerimientoDetalle);
            return mensaje;
        }

        public ColorFile SaveFile(string descripcionFile)
        {
            var fileTechPack = Request.Files[descripcionFile];
            ColorFile _file = new ColorFile();

            if (fileTechPack != null)
            {

                Random aleatorio = new Random();
                MemoryStream memory = new MemoryStream();

                string NombreArchivoOriginal = System.IO.Path.GetFileName(fileTechPack.FileName);
                string ExtensionArchivoOriginal = System.IO.Path.GetExtension(fileTechPack.FileName);
                string NombreArchivoGeneradoSinOptimizar = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionArchivoOriginal);

                fileTechPack.InputStream.CopyTo(memory);
                byte[] ArrayArchivoSinOptimizar = memory.ToArray();
                string RutaArchivoSaveSinOptimizar = @RutaFileServer + RutaFileColorFile + NombreArchivoGeneradoSinOptimizar;

                System.IO.File.WriteAllBytes(RutaArchivoSaveSinOptimizar, ArrayArchivoSinOptimizar);

                _file.NombreArchivoOriginal = NombreArchivoOriginal;
                _file.NombreArchivo = NombreArchivoGeneradoSinOptimizar;
            }
            else
            {
                _file.NombreArchivoOriginal = "";
                _file.NombreArchivo = "";
            }

            return _file;
        }
        
        //FUNCIONALIDAD DE FILE REQUERIMIENTO:INICIO
        public string SaveFileRequerimiento()
        {
            string sParModelFile = _.Post("requerimientoFileJSON");
            sParModelFile = _.addParameter(sParModelFile, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelFile = _.addParameter(sParModelFile, "UsuarioActualizacion", _.GetUsuario().Usuario);
            ColorFile _file = JsonConvert.DeserializeObject<ColorFile>(sParModelFile);
            ColorFile file = SaveFile("archivoFile");

            _file.NombreArchivo = file.NombreArchivo;
            _file.NombreArchivoOriginal = file.NombreArchivoOriginal;
            _file.NombreArchivoOriginal = file.NombreArchivoOriginal;   
                       
            int IdFile = _colorSevice.SaveFile_JSON(_file);
            string mensaje = _.Mensaje("new", IdFile > 0, IdFile.ToString(), IdFile);
            return mensaje;
        }

        public string DeleteFileRequerimiento_jSON()
        {
            string sParModelFile = _.Post("requerimientoFileJSON");
            sParModelFile = _.addParameter(sParModelFile, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelFile = _.addParameter(sParModelFile, "UsuarioActualizacion", _.GetUsuario().Usuario);
            ColorFile _file = JsonConvert.DeserializeObject<ColorFile>(sParModelFile);

            int rows = _colorSevice.DeleteFile_JSON(_file);
            string mensaje = _.Mensaje("edit", rows > 0, rows.ToString(), rows);
            return mensaje;
        }

        public string GetListaFileRequerimiento_JSON()
        {
            string sParModelFile = _.Post("requerimientoFileJSON");
            sParModelFile = _.addParameter(sParModelFile, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelFile = _.addParameter(sParModelFile, "UsuarioActualizacion", _.GetUsuario().Usuario);
            ColorFile _file = JsonConvert.DeserializeObject<ColorFile>(sParModelFile);
            string strData = _colorSevice.GetListaFileRequerimiento_JSON(_file);

            return strData;
        }

        public FileResult DownLoadFile()
        {
            string sParNombreArchivo = _.Get("NombreArchivo");
            string sparNombreArchivoOriginal = _.Get("NombreArchivoOriginal");
            string rutaCompleta = @RutaFileServer + RutaFileColorFile + sParNombreArchivo;
            byte[] byteFile = System.IO.File.ReadAllBytes(rutaCompleta);
            return File(byteFile, System.Net.Mime.MediaTypeNames.Application.Octet, sparNombreArchivoOriginal);
        }

        //FUNCIONALIDAD DE FILE REQUERIMIENTO:FIN
        //FUNCIONALIDAD BUSCAR TELA: INICIO
        public string GetBuscarTela_JSON()
        {
            string Codigo = _.Get("par");
         
            return _colorSevice.GetBuscarTela_JSON(Codigo);
        }
        //FUNCIONALIDAD BUSCAR TELA: FIN

        public string DeleteReport_JSON()
        {
            string sParModel = _.Post("paramsJSON");
            sParModel = _.addParameter(sParModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            ColorTestReport _file = JsonConvert.DeserializeObject<ColorTestReport>(sParModel);

            int rows = _colorSevice.DeleteReport_JSON(_file);
            string mensaje = _.Mensaje("remove", rows > 0, rows.ToString(), rows);
            return mensaje;
        }

        public string DeleteTest_JSON()
        {
            string sParModel = _.Post("paramsJSON");
            sParModel = _.addParameter(sParModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            ColorTest parametro = JsonConvert.DeserializeObject<ColorTest>(sParModel);

            int rows = _colorSevice.DeleteTest_JSON(parametro);
            string mensaje = _.Mensaje("remove", rows > 0, rows.ToString(), rows);
            return mensaje;
        }

        public string DeleteComboColor_JSON()
        {
            string sParModel = _.Post("paramsJSON");
            sParModel = _.addParameter(sParModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            ComboColor parametro = JsonConvert.DeserializeObject<ComboColor>(sParModel);

            int rows = _colorSevice.DeleteComboColor_JSON(parametro);
            string mensaje = _.Mensaje("remove", rows > 0, rows.ToString(), rows);
            return mensaje;
        }

        public string DeleteComboColorDetalle_JSON()
        {
            string sParModel = _.Post("paramsJSON");
            sParModel = _.addParameter(sParModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            ComboColor parametro = JsonConvert.DeserializeObject<ComboColor>(sParModel);

            int rows = _colorSevice.DeleteComboColorDetalle_JSON(parametro);
            string mensaje = _.Mensaje("remove", rows > 0, rows.ToString(), rows);
            return mensaje;
        }

        //FlujoAprobacion:Inicio
        public ActionResult Concesion(string Operacion, string Id, string Contacto)
        {

            string strTitulo = (Operacion != "0") ? "The Request has been approved" : "The Request has been rejected"; ;

            ViewBag.Operacion = Operacion;
            ViewBag.Id = Id;
            ViewBag.Contacto = Contacto;
            ViewBag.Titulo = strTitulo;

            
            return View();
        }

        public string GuardarRespuestaConcesion()
        {
            string sParColorModel = _.Post("par");
            
            string sParColorModel2 = _.Get("FormData");
            

            ColorConcesion requerimiento = JsonConvert.DeserializeObject<ColorConcesion>(sParColorModel);
            string respuesta = _colorSevice.GuardarRespuestaConcesion(requerimiento);
            return respuesta;
        }

        //flujo de aprovacion: Fin

        public string GetColorSearchAll_csv()
        {
            string data = _colorSevice.GetColorSearchAll_csv();
            return data;
        }

        public ActionResult _SearchColor()
        {
            return View();
        }
    }
}