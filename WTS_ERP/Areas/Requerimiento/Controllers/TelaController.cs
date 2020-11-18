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
using BL_ERP;


namespace WTS_ERP.Areas.Requerimiento.Controllers
{
    public class TelaController : Controller
    {
       
        string RutaFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
        string RutaFiletelaFile = ConfigurationManager.AppSettings["FileRequerientoTela"].ToString();
        private readonly ITelaService _telaSevice;
        public TelaController(ITelaService telaService)
        {
            this._telaSevice = telaService;
        }

        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _AddYarns()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _AddContent()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _NewFabric()
        {
            ViewBag.RutaFileServer = @RutaFileServer + RutaFiletelaFile;
            return View();
        }

        [AccessSecurity]
        public ActionResult _FabricReqs()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _FabricReqSimple()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _FabricReqAdvance()
        {
            return View();
        }
        
        [AccessSecurity]
        public ActionResult _SearchFabric()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _CopyFabric()
        {
            return View();
        }

        public string GetFabricLoadNew_JSON()
        {
            string sParModel = _.Get("par");
            sParModel = _.addParameter(sParModel, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            TelaViewModels parametro = JsonConvert.DeserializeObject<TelaViewModels>(sParModel);
            return _telaSevice.GetTelaLoadNew_JSON(parametro);
        }

        public string SaveRequerimientoTela_JSON()
        {
            string sParTelaModel = _.Post("RequerimientoTelaJSON");
            TelaFile file = SaveFile("ImagenTela");
            TelaFile doc = SaveFile("ImagenDoc");
            string sParameterFileProp = _.Post("requerimientoFilePropJSON");

            sParTelaModel = _.addParameter(sParTelaModel, "IdRol", _.GetUsuario().Roles);
            sParTelaModel = _.addParameter(sParTelaModel, "IdPerfil", _.GetUsuario().Perfiles);
            sParTelaModel = _.addParameter(sParTelaModel, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            sParTelaModel = _.addParameter(sParTelaModel, "IdPersonal", _.GetUsuario().IdPersonal.ToString());
            sParTelaModel = _.addParameter(sParTelaModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParTelaModel = _.addParameter(sParTelaModel, "UsuarioActualizacion", _.GetUsuario().Usuario);

            TelaViewModels requerimientoTela = JsonConvert.DeserializeObject<TelaViewModels>(sParTelaModel);
            requerimientoTela.ImagenNombre = file.NombreArchivo;
            requerimientoTela.ImagenOriginal = file.NombreArchivoOriginal;
            requerimientoTela.ImagenWebNombre = file.NombreArchivoOriginal;

            requerimientoTela.DocNombre = doc.NombreArchivo;
            requerimientoTela.DocOriginal = doc.NombreArchivoOriginal;
            requerimientoTela.DocWebNombre = doc.NombreArchivoOriginal;

            TryValidateModel(requerimientoTela);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            int IdRequerimiento = _telaSevice.Save_JSON(requerimientoTela, sParameterFileProp);

            string mensaje = _.Mensaje("new", IdRequerimiento > 0, IdRequerimiento.ToString(), IdRequerimiento);
            return mensaje;
        }

        public TelaFile SaveFile(string descripcionFile)
        {
            var fileTechPack = Request.Files[descripcionFile];
            TelaFile _file = new TelaFile();

            if (fileTechPack != null)
            {

                Random aleatorio = new Random();
                MemoryStream memory = new MemoryStream();

                string NombreArchivoOriginal = System.IO.Path.GetFileName(fileTechPack.FileName);
                string ExtensionArchivoOriginal = System.IO.Path.GetExtension(fileTechPack.FileName);
                string NombreArchivoGeneradoSinOptimizar = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionArchivoOriginal);

                fileTechPack.InputStream.CopyTo(memory);
                byte[] ArrayArchivoSinOptimizar = memory.ToArray();
                string RutaArchivoSaveSinOptimizar = @RutaFileServer + @RutaFiletelaFile + NombreArchivoGeneradoSinOptimizar;

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
            string sParModelTela = _.Post("requerimientoTelaJSON");
            sParModelTela = _.addParameter(sParModelTela, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelTela = _.addParameter(sParModelTela, "UsuarioActualizacion", _.GetUsuario().Usuario);            
            TelaFile _telafile = JsonConvert.DeserializeObject<TelaFile>(sParModelTela);          
            var fileTechPack = Request.Files["archivoTela"];  
            
            if (fileTechPack != null)
            {
               
                Random aleatorio = new Random();
                MemoryStream memory = new MemoryStream();

                string NombreArchivoOriginal = System.IO.Path.GetFileName(fileTechPack.FileName);
                string ExtensionArchivoOriginal = System.IO.Path.GetExtension(fileTechPack.FileName);
                string NombreArchivoGeneradoSinOptimizar = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionArchivoOriginal);

                fileTechPack.InputStream.CopyTo(memory);
                byte[] ArrayArchivoSinOptimizar = memory.ToArray();
                string RutaArchivoSaveSinOptimizar = @RutaFileServer + @RutaFiletelaFile + NombreArchivoGeneradoSinOptimizar;

                System.IO.File.WriteAllBytes(RutaArchivoSaveSinOptimizar, ArrayArchivoSinOptimizar);

                _telafile.NombreArchivoOriginal = NombreArchivoOriginal;
                _telafile.NombreArchivo = NombreArchivoGeneradoSinOptimizar;
            }
            else
            {
                _telafile.NombreArchivoOriginal = "";
                _telafile.NombreArchivo = "";
            }

            int IdFileTela = _telaSevice.SaveFileTela_JSON(_telafile);          
            string mensaje = _.Mensaje("new", IdFileTela > 0, IdFileTela.ToString(), IdFileTela);
            return mensaje;
        }



        public string DeleteFileRequerimiento_jSON()
        {
            string sParModelTela = _.Post("requerimientoFileTelaJSON");
            sParModelTela = _.addParameter(sParModelTela, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelTela = _.addParameter(sParModelTela, "UsuarioActualizacion", _.GetUsuario().Usuario);
            TelaFile _telafile = JsonConvert.DeserializeObject<TelaFile>(sParModelTela);

            int rows = _telaSevice.DeleteFileTela_JSON(_telafile);
            string mensaje = _.Mensaje("edit", rows > 0, rows.ToString(), rows);
            return mensaje;
        }

        public string GetListaFileRequerimiento_JSON()
        {
            string sParModelTela = _.Post("requerimientoTelaJSON");
            sParModelTela = _.addParameter(sParModelTela, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelTela = _.addParameter(sParModelTela, "UsuarioActualizacion", _.GetUsuario().Usuario);            
            TelaFile _telafile = JsonConvert.DeserializeObject<TelaFile>(sParModelTela);
            string strData = _telaSevice.GetListaFileRequerimiento_JSON(_telafile);

            return strData;
        }

        public FileResult DownLoadFile()
        {
            string sParNombreArchivo = _.Get("NombreArchivo");
            string sparNombreArchivoOriginal = _.Get("NombreArchivoOriginal");
            string rutaCompleta = @RutaFileServer + @RutaFiletelaFile + sParNombreArchivo;
            byte[] byteFile = System.IO.File.ReadAllBytes(rutaCompleta);
            return File(byteFile, System.Net.Mime.MediaTypeNames.Application.Octet, sparNombreArchivoOriginal);
        }

        //FUNCIONALIDAD DE FILE REQUERIMIENTO:FIN

        /* Test Laboratorio */
        public string GetInfo_TestLaboratorio() {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idgrupopersonal", _.GetUsuario().IdGrupoComercial.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("RequerimientoTela.usp_GetInfo_TestLaboratorio", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string SaveInfo_TestLaboratorio()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            string subdetail = _.Post("parsubdetail");

            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString());

            int id = oMantenimiento.save_Rows_Out("RequerimientoTela.usp_SaveInfo_TestLaboratorio", parhead, Util.ERP, pardetail, subdetail);

            string mensaje = _.Mensaje("new", id > 0);
            return mensaje;
        }

        public string GetListaTelaByPrograma_JSON()
        {
            string par = _.Get("par");
            return _telaSevice.GetListRequerimientoByPrograma_JSON(par);
        }

        [AccessSecurity]
        [HttpPost]
        public string UpdateEstadoTela()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdSolicitud = _telaSevice.UpdateEstadoTela(sParModel);
            string mensaje = _.Mensaje("new", IdSolicitud != "", IdSolicitud, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpGet]
        public string GetEnlacesTela()
        {
            string par = _.Get("par");
            return _telaSevice.GetEnlacesTela(par);
        }

        [AccessSecurity]
        [HttpPost]
        public string SaveEnlacesCombinaciones()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdRequerimiento = _telaSevice.SaveEnlacesCombinaciones(sParModel);
            string mensaje = _.Mensaje("new", IdRequerimiento != "", IdRequerimiento, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string DeleteEnlacesCombinaciones()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdRequerimiento = _telaSevice.DeleteEnlacesCombinaciones(sParModel);
            string mensaje = _.Mensaje("remove", IdRequerimiento != "", IdRequerimiento, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string DeleteTela()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdRequerimiento = _telaSevice.DeleteTela(sParModel);
            string mensaje = _.Mensaje("remove", IdRequerimiento != "", IdRequerimiento, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpGet]
        public string GetAllTelasCarryOverNew()
        {
            string par = _.Get("par");
            return _telaSevice.GetAllTelasCarryOverNew(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetTelaCarryOverNew()
        {
            string par = _.Get("par");
            return _telaSevice.GetTelaCarryOverNew(par);
        }

        [AccessSecurity]
        [HttpPost]
        public string SaveTelasCarryOverNew()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdRequerimiento = _telaSevice.SaveTelasCarryOverNew(sParModel);
            string mensaje = _.Mensaje("new", IdRequerimiento != "", IdRequerimiento, 0);
            return mensaje;
        }
    }
}