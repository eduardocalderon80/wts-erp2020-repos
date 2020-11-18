using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using System.Configuration;
using WTS_ERP.Areas.Requerimiento.Models;
using WTS_ERP.Areas.Requerimiento.Services;
using Newtonsoft.Json;
using System.IO;

namespace WTS_ERP.Areas.Requerimiento.Controllers
{
    public class AvioController : Controller
    {
        string RutaFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
        string RutaFileAvioFile = ConfigurationManager.AppSettings["FileRequerientoAvio"].ToString();
        private readonly IAvioService _avioSevice;
        
        // GET: Requerimiento/Avio
        public AvioController(IAvioService avioService) {
            _avioSevice = avioService;
        }

        [AccessSecurity]
        public ActionResult _NewTrim()
        {
            ViewBag.RutaFileServer = @RutaFileServer + RutaFileAvioFile;
            return View();
        }

        public ActionResult _SearchTrim()
        {
            return View();
        }
        
        public string GetAvioLoadNew_JSON()
        {
            string sParModel = _.Get("par");
            sParModel = _.addParameter(sParModel, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            AvioViewModels parametro = JsonConvert.DeserializeObject<AvioViewModels>(sParModel);
            return _avioSevice.GetAvioLoadNew_JSON(parametro);
        }
        public string GetAvioLoadEditar_JSON()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            AvioViewModels sParModel = JsonConvert.DeserializeObject<AvioViewModels>(par);

            return _avioSevice.GetAvioLoadEditar_JSON(sParModel);
        }
        public string GetListaAvioByPrograma_JSON()
        {
            string par = _.Get("par");
            return _avioSevice.GetListRequeriminetoByPrograma_JSON(par);
        }
        
        public string SaveRequerimientoAvio_JSON()
        {
            string sParAvioModel = _.Post("requerimientoAvioJSON");
            var fileTechPack = Request.Files["archivoAvio"];
            AvioFile file = SaveFile("ImagenTrim");
            sParAvioModel = _.addParameter(sParAvioModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParAvioModel = _.addParameter(sParAvioModel, "UsuarioActualizacion", _.GetUsuario().Usuario);

            AvioViewModels requerimiento = JsonConvert.DeserializeObject<AvioViewModels>(sParAvioModel);
            requerimiento.ImagenNombre = file.NombreArchivo;
            requerimiento.ImagenOriginal = file.NombreArchivoOriginal;
            requerimiento.ImagenWebNombre = file.NombreArchivoOriginal;

            //TryValidateModel(requerimiento);
            //if (!ModelState.IsValid)
            //{
            //    return _.Mensaje("new", false, null, -1);
            //}

            int IdRequerimientoDetalle = _avioSevice.Save_JSON(requerimiento);

            string mensaje = _.Mensaje("new", IdRequerimientoDetalle > 0, IdRequerimientoDetalle.ToString(), IdRequerimientoDetalle);
            return mensaje;
        }
        public AvioFile SaveFile(string descripcionFile)
        {
            var fileTechPack = Request.Files[descripcionFile];
            AvioFile _file = new AvioFile();

            if (fileTechPack != null)
            {

                Random aleatorio = new Random();
                MemoryStream memory = new MemoryStream();

                string NombreArchivoOriginal = System.IO.Path.GetFileName(fileTechPack.FileName);
                string ExtensionArchivoOriginal = System.IO.Path.GetExtension(fileTechPack.FileName);
                string NombreArchivoGeneradoSinOptimizar = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionArchivoOriginal);

                fileTechPack.InputStream.CopyTo(memory);
                byte[] ArrayArchivoSinOptimizar = memory.ToArray();
                string RutaArchivoSaveSinOptimizar = @RutaFileServer + RutaFileAvioFile + NombreArchivoGeneradoSinOptimizar;

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
            string sParModelAvio = _.Post("requerimientoAvioJSON");            
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioActualizacion", _.GetUsuario().Usuario);
            AvioFile _aviofile = JsonConvert.DeserializeObject<AvioFile>(sParModelAvio);
            var fileTechPack = Request.Files["archivoAvio"];

            if (fileTechPack != null)
            {

                Random aleatorio = new Random();
                MemoryStream memory = new MemoryStream();

                string NombreArchivoOriginal = System.IO.Path.GetFileName(fileTechPack.FileName);
                string ExtensionArchivoOriginal = System.IO.Path.GetExtension(fileTechPack.FileName);
                string NombreArchivoGeneradoSinOptimizar = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionArchivoOriginal);

                fileTechPack.InputStream.CopyTo(memory);
                byte[] ArrayArchivoSinOptimizar = memory.ToArray();
                string RutaArchivoSaveSinOptimizar = @RutaFileServer + @RutaFileAvioFile + NombreArchivoGeneradoSinOptimizar;

                System.IO.File.WriteAllBytes(RutaArchivoSaveSinOptimizar, ArrayArchivoSinOptimizar);

                _aviofile.NombreArchivoOriginal = NombreArchivoOriginal;
                _aviofile.NombreArchivo = NombreArchivoGeneradoSinOptimizar;
            }
            else
            {
                _aviofile.NombreArchivoOriginal = "";
                _aviofile.NombreArchivo = "";
            }

            int IdFileAvio = _avioSevice.SaveFileAvio_JSON(_aviofile);
            string mensaje = _.Mensaje("new", IdFileAvio > 0, IdFileAvio.ToString(), IdFileAvio);
            return mensaje;
        }
        public string UpdateFileRequerimiento()
        {
            string sParModelAvio = _.Post("requerimientoAvioJSON");
            //sParModelAvio = _.addParameter(sParModelAvio, "UsuarioCreacion", _.GetUsuario().Usuario);
            AvioFile[] _aviofile = JsonConvert.DeserializeObject<AvioFile[]>(sParModelAvio);
            
            int IdFileAvio = _avioSevice.UpdateFileAvio_JSON(_aviofile);
            string mensaje = _.Mensaje("new", IdFileAvio > 0, IdFileAvio.ToString(), IdFileAvio);
            return mensaje;
        }
        public string DeleteFileRequerimiento_jSON()
        {
            string sParModelAvio = _.Post("requerimientoFileAvioJSON");
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioActualizacion", _.GetUsuario().Usuario);
            AvioFile _aviofile = JsonConvert.DeserializeObject<AvioFile>(sParModelAvio);

            int rows = _avioSevice.DeleteFileAvio_JSON(_aviofile);
            string mensaje = _.Mensaje("edit", rows > 0, rows.ToString(), rows);
            return mensaje;
        }
        public string GetListaFileRequerimiento_JSON()
        {
            string sParModelAvio = _.Post("requerimientoAvioJSON");
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioActualizacion", _.GetUsuario().Usuario);
            AvioFile _aviofile = JsonConvert.DeserializeObject<AvioFile>(sParModelAvio);
            string strData = _avioSevice.GetListaFileRequerimiento_JSON(_aviofile);

            return strData;
        }
        public FileResult DownLoadFile()
        {
            string sParNombreArchivo = _.Get("NombreArchivo");
            string sparNombreArchivoOriginal = _.Get("NombreArchivoOriginal");
            string rutaCompleta = @RutaFileServer + @RutaFileAvioFile + sParNombreArchivo;
            byte[] byteFile = System.IO.File.ReadAllBytes(rutaCompleta);
            return File(byteFile, System.Net.Mime.MediaTypeNames.Application.Octet, sparNombreArchivoOriginal);
        }
        //FUNCIONALIDAD DE FILE REQUERIMIENTO:FIN

        //FUNCIONALIDAD DE FILE SUMMARY REQUERIMIENTO:INICIO
        public string SaveFileRequerimientoAvioSummary()
        {
            string sParModelAvio = _.Post("requerimientoAvioJSON");            
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioActualizacion", _.GetUsuario().Usuario);
            AvioFile _aviofile = JsonConvert.DeserializeObject<AvioFile>(sParModelAvio);
            var fileTechPack = Request.Files["archivoAvio"];

            if (fileTechPack != null)
            {

                Random aleatorio = new Random();
                MemoryStream memory = new MemoryStream();

                string NombreArchivoOriginal = System.IO.Path.GetFileName(fileTechPack.FileName);
                string ExtensionArchivoOriginal = System.IO.Path.GetExtension(fileTechPack.FileName);
                string NombreArchivoGeneradoSinOptimizar = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionArchivoOriginal);

                fileTechPack.InputStream.CopyTo(memory);
                byte[] ArrayArchivoSinOptimizar = memory.ToArray();
                string RutaArchivoSaveSinOptimizar = @RutaFileServer + @RutaFileAvioFile + NombreArchivoGeneradoSinOptimizar;

                System.IO.File.WriteAllBytes(RutaArchivoSaveSinOptimizar, ArrayArchivoSinOptimizar);

                _aviofile.NombreArchivoOriginal = NombreArchivoOriginal;
                _aviofile.NombreArchivo = NombreArchivoGeneradoSinOptimizar;
            }
            else
            {
                _aviofile.NombreArchivoOriginal = "";
                _aviofile.NombreArchivo = "";
            }

            int IdFileAvio = _avioSevice.SaveFileAvioSummary_JSON(_aviofile);
            string mensaje = _.Mensaje("new", IdFileAvio > 0, IdFileAvio.ToString(), IdFileAvio);
            return mensaje;
        }
        public string DeleteFileRequerimientoAvioSummary_jSON()
        {
            string sParModelAvio = _.Post("requerimientoFileAvioJSON");
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioActualizacion", _.GetUsuario().Usuario);
            AvioFile _aviofile = JsonConvert.DeserializeObject<AvioFile>(sParModelAvio);

            int rows = _avioSevice.DeleteFileAvio_JSON(_aviofile);
            string mensaje = _.Mensaje("edit", rows > 0, rows.ToString(), rows);
            return mensaje;
        }
        public string GetListaFileRequerimientoAvioSummary_JSON()
        {
            string sParModelAvio = _.Post("requerimientoAvioJSON");
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioActualizacion", _.GetUsuario().Usuario);
            AvioFile _aviofile = JsonConvert.DeserializeObject<AvioFile>(sParModelAvio);
            string strData = _avioSevice.GetListaFileRequerimientoAvioSummary_JSON(_aviofile);

            return strData;
        }
        public FileResult DownLoadFileAvioSummary()
        {
            string sParNombreArchivo = _.Get("NombreArchivo");
            string sparNombreArchivoOriginal = _.Get("NombreArchivoOriginal");
            string rutaCompleta = @RutaFileServer + @RutaFileAvioFile + sParNombreArchivo;
            byte[] byteFile = System.IO.File.ReadAllBytes(rutaCompleta);
            return File(byteFile, System.Net.Mime.MediaTypeNames.Application.Octet, sparNombreArchivoOriginal);
        }
        //FUNCIONALIDAD DE FILE REQUERIMIENTO:FIN

        //FUNCIONALIDAD DE BUSCAR STYLECODE TAB SUMMARY REQUERIMIENTO:INICIO
        public string GetStyleCode_JSON()
        {
            string sParModel = _.Post("StyleCodeJSON");
            AvioViewModels parametro = JsonConvert.DeserializeObject<AvioViewModels>(sParModel);
            return _avioSevice.GetStyleCode_JSON(parametro);
        }
        public string GetListaStyleCodeAvio_JSON() {
            string sParModelAvio = _.Post("StyleCodeAvioJSON");
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioActualizacion", _.GetUsuario().Usuario);
            AvioViewModels _avioStyleCode = JsonConvert.DeserializeObject<AvioViewModels>(sParModelAvio);

            string strData = _avioSevice.GetListaStyleCodeAvio_JSON(_avioStyleCode);
            return strData;
           
        }
        public string DeleteStyleCodeAvio_JSON() {
            string sParModelAvio = _.Post("StyleCodeAvioJSON");
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelAvio = _.addParameter(sParModelAvio, "UsuarioActualizacion", _.GetUsuario().Usuario);
            AvioViewModels _avioStyleCode = JsonConvert.DeserializeObject<AvioViewModels>(sParModelAvio);            
            
            int rows = _avioSevice.DeleteStyleCodeAvio_JSON(_avioStyleCode);
            string mensaje = _.Mensaje("edit", rows > 0, rows.ToString(), rows);
            return mensaje;
        }
        //FUNCIONALIDAD DE BUSCAR STYLECODE TAB SUMMARY REQUERIMIENTO:FIN

        //MODAL DESCRIPCION
        [AccessSecurity]
        public ActionResult _AddDescription()
        {
            return View();
        }

        public string GetAvioSearchAll_csv()
        {
            string sParModel = _.Get("par");
            string data = _avioSevice.GetAvioSearchAll_csv(sParModel);
            return data;
        }

        [AccessSecurity]
        [HttpPost]
        public string DeleteAvio()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdRequerimiento = _avioSevice.DeleteAvio(sParModel);
            string mensaje = _.Mensaje("remove", IdRequerimiento != "", IdRequerimiento, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string SaveLinkAvioEstilo()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            int IdRequerimiento = _avioSevice.SaveLinkAvioEstilo(sParModel);
            string mensaje = _.Mensaje("new", IdRequerimiento > 0, IdRequerimiento.ToString(), IdRequerimiento);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string DeleteLinkAvioEstilo()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdRequerimiento = _avioSevice.DeleteLinkAvioEstilo(sParModel);
            string mensaje = _.Mensaje("new", IdRequerimiento != "", IdRequerimiento, int.Parse(IdRequerimiento));
            return mensaje;
        }
    }
}