using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Requerimiento.Services;
using WTS_ERP.Areas.Requerimiento.Models;
using WTS_ERP.Models;
using System.IO;

namespace WTS_ERP.Areas.Requerimiento.Controllers
{
    public class OrnamentoController : Controller
    {

        // GET: Requerimiento/Color
        string RutaFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
        string RutaFileColorFile = ConfigurationManager.AppSettings["FileRequerientoArte"].ToString();
        private readonly IOrnamentoService _ornamentoSevice;
        public OrnamentoController(IOrnamentoService ornamentoService)
        {
            this._ornamentoSevice = ornamentoService;
        }

        public string DeleteArteById_JSON()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            OrnamentoViewModels color = JsonConvert.DeserializeObject<OrnamentoViewModels>(sParModel);
            int rows = _ornamentoSevice.DeleteArteById_JSON(color);
            string mensaje = _.Mensaje("edit", rows > 0, _ornamentoSevice.GetListRequerimientoByPrograma_JSON(color.IdPrograma.ToString()), rows);

            return mensaje;
        }


        [AccessSecurity]
        public ActionResult _NewOrnament()
        {
            ViewBag.RutaFileServer = @RutaFileServer + RutaFileColorFile;
            return View();
        }
        [AccessSecurity]
        public ActionResult _Concession()
        {
            return View();
        }
        

        public string GetListaArteByPrograma_JSON()
        {
            string par = _.Get("par");
            return _ornamentoSevice.GetListRequerimientoByPrograma_JSON(par);
        }

        public string GetOrnamentLoadNew_JSON()
        {
            string sParModel = _.Get("par");
            sParModel = _.addParameter(sParModel, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            OrnamentoViewModels parametro = JsonConvert.DeserializeObject<OrnamentoViewModels>(sParModel);
            return _ornamentoSevice.GetOrnamentoLoadNew_JSON(parametro);
        }

        public string GetOrnamentoConcessionLoadNew_JSON()
        {
            string sParModel = _.Get("par");
            sParModel = _.addParameter(sParModel, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            OrnamentoViewModels parametro = JsonConvert.DeserializeObject<OrnamentoViewModels>(sParModel);
            return _ornamentoSevice.GetOrnamentoConcessionLoadNew_JSON(parametro);
        }


        public string SaveRequerimientoConcesion_JSON()
        {
            string sParColorModel = _.Post("requerimientoJSON");

            sParColorModel = _.addParameter(sParColorModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParColorModel = _.addParameter(sParColorModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            sParColorModel = _.addParameter(sParColorModel, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());

            OrnamentoConcesion requerimiento = JsonConvert.DeserializeObject<OrnamentoConcesion>(sParColorModel);
            int IdConsecion = _ornamentoSevice.EnviarConcesion_JSON(requerimiento);

            string mensaje = _.Mensaje("new", IdConsecion > 0, IdConsecion.ToString(), IdConsecion);
            return mensaje;
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

            OrnamentoViewModels requerimiento = JsonConvert.DeserializeObject<OrnamentoViewModels>(sParColorModel);
            List<OrnamentoTest> ParameterTest = JsonConvert.DeserializeObject<List<OrnamentoTest>>(sParameterTest);
            List<OrnamentoTestReport> ParameterTestReport = JsonConvert.DeserializeObject<List<OrnamentoTestReport>>(sParameterTestReport);

            if (requerimiento.flgCambioImagen == 1)
            {
                OrnamentoFile file = SaveFile("Imagen");
                requerimiento.ImagenNombre = file.NombreArchivo;
                requerimiento.ImagenOriginal = file.NombreArchivoOriginal;
                requerimiento.ImagenWebNombre = file.NombreArchivoOriginal;
            }

            //TryValidateModel(requerimiento);
            //if (!ModelState.IsValid)
            //{
            //    return _.Mensaje("new", false, null, -1);
            //}

            int IdRequerimientoDetalle = _ornamentoSevice.Save_JSON(requerimiento, ParameterComboColor, ParameterTest, sParameterFileProp, ParameterTestReport);

            string mensaje = _.Mensaje("new", IdRequerimientoDetalle > 0, IdRequerimientoDetalle.ToString(), IdRequerimientoDetalle);
            return mensaje;
        }

        public OrnamentoFile SaveFile(string descripcionFile)
        {
            var fileTechPack = Request.Files[descripcionFile];
            OrnamentoFile _file = new OrnamentoFile();

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

        //FUNCIONALIDAD BUSCAR TELA: INICIO
        public string GetBuscarTela_JSON()
        {
            string Codigo = _.Get("par");

            return _ornamentoSevice.GetBuscarTela_JSON(Codigo);
        }
        //FUNCIONALIDAD BUSCAR TELA: FIN

        //FUNCIONALIDAD DE FILE REQUERIMIENTO:INICIO
        public string SaveFileRequerimiento()
        {
            string sParModelFile = _.Post("requerimientoFileJSON");
            sParModelFile = _.addParameter(sParModelFile, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelFile = _.addParameter(sParModelFile, "UsuarioActualizacion", _.GetUsuario().Usuario);
            OrnamentoFile _file = JsonConvert.DeserializeObject<OrnamentoFile>(sParModelFile);
            OrnamentoFile file = SaveFile("archivoFile");

            _file.NombreArchivo = file.NombreArchivo;
            _file.NombreArchivoOriginal = file.NombreArchivoOriginal;
            _file.NombreArchivoOriginal = file.NombreArchivoOriginal;

            int IdFile = _ornamentoSevice.SaveFile_JSON(_file);
            string mensaje = _.Mensaje("new", IdFile > 0, IdFile.ToString(), IdFile);
            return mensaje;
        }

        public string DeleteFileRequerimiento_jSON()
        {
            string sParModelFile = _.Post("requerimientoFileJSON");
            sParModelFile = _.addParameter(sParModelFile, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelFile = _.addParameter(sParModelFile, "UsuarioActualizacion", _.GetUsuario().Usuario);
            OrnamentoFile _file = JsonConvert.DeserializeObject<OrnamentoFile>(sParModelFile);

            int rows = _ornamentoSevice.DeleteFile_JSON(_file);
            string mensaje = _.Mensaje("edit", rows > 0, rows.ToString(), rows);
            return mensaje;
        }

        public string GetListaFileRequerimiento_JSON()
        {
            string sParModelFile = _.Post("requerimientoFileJSON");
            sParModelFile = _.addParameter(sParModelFile, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelFile = _.addParameter(sParModelFile, "UsuarioActualizacion", _.GetUsuario().Usuario);
            OrnamentoFile _file = JsonConvert.DeserializeObject<OrnamentoFile>(sParModelFile);
            string strData = _ornamentoSevice.GetListaFileRequerimiento_JSON(_file);

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

        public string DeleteReport_JSON()
        {
            string sParModel = _.Post("paramsJSON");
            sParModel = _.addParameter(sParModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            OrnamentoTestReport _file = JsonConvert.DeserializeObject<OrnamentoTestReport>(sParModel);

            int rows = _ornamentoSevice.DeleteReport_JSON(_file);
            string mensaje = _.Mensaje("remove", rows > 0, rows.ToString(), rows);
            return mensaje;
        }

        public string DeleteTest_JSON()
        {
            string sParModel = _.Post("paramsJSON");
            sParModel = _.addParameter(sParModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            OrnamentoTest parametro = JsonConvert.DeserializeObject<OrnamentoTest>(sParModel);

            int rows = _ornamentoSevice.DeleteTest_JSON(parametro);
            string mensaje = _.Mensaje("remove", rows > 0, rows.ToString(), rows);
            return mensaje;
        }

        public string DeleteComboColor_JSON()
        {
            string sParModel = _.Post("paramsJSON");
            sParModel = _.addParameter(sParModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            OrnamentoComboColor parametro = JsonConvert.DeserializeObject<OrnamentoComboColor>(sParModel);

            int rows = _ornamentoSevice.DeleteComboColor_JSON(parametro);
            string mensaje = _.Mensaje("remove", rows > 0, rows.ToString(), rows);
            return mensaje;
        }

        public string DeleteComboColorDetalle_JSON()
        {
            string sParModel = _.Post("paramsJSON");
            sParModel = _.addParameter(sParModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            OrnamentoComboColor parametro = JsonConvert.DeserializeObject<OrnamentoComboColor>(sParModel);

            int rows = _ornamentoSevice.DeleteComboColorDetalle_JSON(parametro);
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

            OrnamentoConcesion requerimiento = JsonConvert.DeserializeObject<OrnamentoConcesion>(sParColorModel);
            string respuesta = _ornamentoSevice.GuardarRespuestaConcesion(requerimiento);
            return respuesta;
        }

        //flujo de aprovacion: Fin

        public string GetArteSearchAll_csv()
        {
            string data = _ornamentoSevice.GetArteSearchAll_csv();
            return data;
        }

        public ActionResult _SearchArte()
        {
            return View();
        }

    }
}