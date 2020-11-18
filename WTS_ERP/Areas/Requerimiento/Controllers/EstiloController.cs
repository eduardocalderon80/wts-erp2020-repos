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
    public class EstiloController : Controller
    {
        // GET: Requerimiento/Estilo

        string RutaFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
        string RutaFileEstiloFileO = ConfigurationManager.AppSettings["FileRequerientoEstiloOriginal"].ToString();
        string RutaFileEstiloFileT = ConfigurationManager.AppSettings["FileRequerientoEstiloThumbnail"].ToString();
        private readonly IEstiloService _estiloSevice;
        public EstiloController(IEstiloService estiloService)
        {
            this._estiloSevice = estiloService;
        }

        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _NewStyle()
        {
            ViewBag.RutaFileServer = @RutaFileServer + RutaFileEstiloFileO;
            return View();
        }

        [AccessSecurity]
        public ActionResult _SearchStyle()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _CopyStyle()
        {
            return View();
        }

        /// <summary>
        /// par => IdPrograma
        /// </summary>
        /// <returns></returns>
        public string GetListaEstiloByPrograma_JSON()
        {
            string par = _.Get("par");
            return _estiloSevice.GetListaEstiloByPrograma_JSON(par);
        }
        /// <returns></returns>
        public string GetEstiloLoadNew_JSON()
        {
            string sParModel = _.Get("par");

        /// <summary>
        /// par => { IdCliente, IdGrupoPersonal }
        /// </summary>
            sParModel = _.addParameter(sParModel, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            EstiloViewModels parametro = JsonConvert.DeserializeObject<EstiloViewModels>(sParModel);
            return _estiloSevice.GetEstiloLoadNew_JSON(parametro);
        }

        /// <summary>
        /// par => { IdEstilo, IdCliente,IdGrupoPersonal }
        /// </summary>
        /// <returns></returns>
        public string GetEstiloLoadEditar_JSON()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            EstiloViewModels sParModel = JsonConvert.DeserializeObject<EstiloViewModels>(par);

            return _estiloSevice.GetEstiloLoadEditar_JSON(sParModel);
        }

        /// <summary>
        /// parHead => CLASE ESTILO {  }
        /// </summary>
        /// <returns></returns>
        public string SaveNew_Estilo_JSON()
        {
            string sParEstiloModel = _.Post("EstiloJSON");
            string sParRequerimientoModel = _.Post("RequerimientoJSON");

            sParEstiloModel = _.addParameter(sParEstiloModel, "UsuarioCreacion", _.GetUsuario().Usuario);
            EstiloViewModels estilo = JsonConvert.DeserializeObject<EstiloViewModels>(sParEstiloModel);
            List<RequerimientoMuestraViewModels> lst_requerimiento = JsonConvert.DeserializeObject<List<RequerimientoMuestraViewModels>>(sParRequerimientoModel);

            TryValidateModel(estilo);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            #region IMAGEN
            if (estilo.ActualizarImagenEstilo == 1)
            {
                var file = Request.Files["ImagenEstilo"];
                if (file != null)
                {

                    Utilitario.Imagen.Imagen UtilImagen = new Utilitario.Imagen.Imagen();
                    Random aleatorio = new Random();

                    MemoryStream memory = new MemoryStream();

                    string NombreImagenOriginal = System.IO.Path.GetFileName(file.FileName);
                    string ExtensionImagenOriginal = System.IO.Path.GetExtension(file.FileName);
                    string NombreImagenGeneradoSinOptimizar = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionImagenOriginal);
                    string NombreImagenGeneradoOptimizada = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionImagenOriginal);

                    file.InputStream.CopyTo(memory);

                    byte[] ArrayImagenSinOptimizar = memory.ToArray();
                    byte[] ArrayImagenOptimizada = UtilImagen.DevolverImagenOptimizada(ArrayImagenSinOptimizar);

                    //NombreImagenGeneradoOptimizada
                    string RutaImagenSaveSinOptimizar = @RutaFileServer + "erp/style/original/" + NombreImagenGeneradoSinOptimizar;
                    string RutaImagenSaveOptimizada = @RutaFileServer + "erp/style/thumbnail/" + NombreImagenGeneradoOptimizada;

                    System.IO.File.WriteAllBytes(RutaImagenSaveSinOptimizar, ArrayImagenSinOptimizar);
                    System.IO.File.WriteAllBytes(RutaImagenSaveOptimizada, ArrayImagenOptimizada);

                    //// SETEAR LOS NOMBRES DE IMAGEN EN EL MODEL A GRABAR
                    estilo.ImagenOriginal = NombreImagenOriginal;
                    estilo.ImagenNombre = NombreImagenGeneradoSinOptimizar;
                    estilo.ImagenWebNombre = NombreImagenGeneradoOptimizada;
                }
                else
                {
                    estilo.ImagenOriginal = "";
                    estilo.ImagenNombre = "";
                    estilo.ImagenWebNombre = "";
                }
            }
            
            #endregion

            int IdEstilo = _estiloSevice.SaveNew_Estilo_JSON(estilo, lst_requerimiento);
            
            string mensaje = _.Mensaje("new", IdEstilo > 0, _estiloSevice.GetListaEstiloByPrograma_JSON(estilo.IdPrograma.ToString()), IdEstilo);
            return mensaje;
        }

        /// <summary>
        /// par => EstiloJSON => {}
        /// </summary>
        /// <returns></returns>
        public string SaveEditar_Estilo_JSON()
        {
            string sParModelEstilo = _.Post("EstiloJSON");
            string sparModelRequerimiento = _.Post("RequerimientoJSON");
            string sParModelRequerimientoArchivo = _.Post("RequerimientoArchivoJSON");
            int sparIdRequerimiento = _.Post("IdRequerimiento") == "" ? 0 : Convert.ToInt32(_.Post("IdRequerimiento"));    //// PASAR ESTE DATO PARA GRABAR EL ARCHIVO
            
            sParModelEstilo = _.addParameter(sParModelEstilo, "UsuarioActualizacion", _.GetUsuario().Usuario);
            EstiloViewModels estilo = JsonConvert.DeserializeObject<EstiloViewModels>(sParModelEstilo);
            List<RequerimientoMuestraViewModels> lst_requerimiento = JsonConvert.DeserializeObject<List<RequerimientoMuestraViewModels>>(sparModelRequerimiento);
            List<RequerimientoArchivoViewModels> LstRequerimientoArchivo = JsonConvert.DeserializeObject<List<RequerimientoArchivoViewModels>>(sParModelRequerimientoArchivo);

            TryValidateModel(estilo);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("edit", false, null, -1);
            }

            #region IMAGEN
            if (estilo.ActualizarImagenEstilo == 1)
            {
                var file = Request.Files["ImagenEstilo"];
                if (file != null)
                {

                    Utilitario.Imagen.Imagen UtilImagen = new Utilitario.Imagen.Imagen();
                    Random aleatorio = new Random();

                    MemoryStream memory = new MemoryStream();

                    string NombreImagenOriginal = System.IO.Path.GetFileName(file.FileName);
                    string ExtensionImagenOriginal = System.IO.Path.GetExtension(file.FileName);
                    string NombreImagenGeneradoSinOptimizar = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionImagenOriginal);
                    string NombreImagenGeneradoOptimizada = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionImagenOriginal);

                    file.InputStream.CopyTo(memory);

                    byte[] ArrayImagenSinOptimizar = memory.ToArray();
                    byte[] ArrayImagenOptimizada = UtilImagen.DevolverImagenOptimizada(ArrayImagenSinOptimizar);

                    //NombreImagenGeneradoOptimizada
                    string RutaImagenSaveSinOptimizar = @RutaFileServer + "erp/style/original/" + NombreImagenGeneradoSinOptimizar;
                    string RutaImagenSaveOptimizada = @RutaFileServer + "erp/style/thumbnail/" + NombreImagenGeneradoOptimizada;

                    System.IO.File.WriteAllBytes(RutaImagenSaveSinOptimizar, ArrayImagenSinOptimizar);
                    System.IO.File.WriteAllBytes(RutaImagenSaveOptimizada, ArrayImagenOptimizada);

                    //// SETEAR LOS NOMBRES DE IMAGEN EN EL MODEL A GRABAR
                    estilo.ImagenOriginal = NombreImagenOriginal;
                    estilo.ImagenNombre = NombreImagenGeneradoSinOptimizar;
                    estilo.ImagenWebNombre = NombreImagenGeneradoOptimizada;
                }
                else
                {
                    estilo.ImagenOriginal = "";
                    estilo.ImagenNombre = "";
                    estilo.ImagenWebNombre = "";
                }
            }

            #endregion

            #region ARCHIVOS TECHPACK
            var fileTechPack = Request.Files["ArchivoTechPack"];
            foreach (var item in LstRequerimientoArchivo)
            {
                if (item.ActualizarArchivo == 1)
                {
                    if (fileTechPack != null)
                    {
                        /*Utilitario.Imagen.Imagen UtilIma*/
                        Random aleatorio = new Random();

                        MemoryStream memory = new MemoryStream();

                        string NombreImagenOriginal = System.IO.Path.GetFileName(fileTechPack.FileName);
                        string ExtensionImagenOriginal = System.IO.Path.GetExtension(fileTechPack.FileName);
                        string NombreImagenGeneradoSinOptimizar = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionImagenOriginal);

                        fileTechPack.InputStream.CopyTo(memory);

                        byte[] ArrayImagenSinOptimizar = memory.ToArray();

                        string RutaImagenSaveSinOptimizar = @RutaFileServer + "erp/ddp/" + NombreImagenGeneradoSinOptimizar;


                        System.IO.File.WriteAllBytes(RutaImagenSaveSinOptimizar, ArrayImagenSinOptimizar);

                        //// SETEAR LOS NOMBRES DE IMAGEN EN EL MODEL A GRABAR
                        item.NombreArchivoOriginal = NombreImagenOriginal;
                        item.NombreArchivo = NombreImagenGeneradoSinOptimizar;
                    }
                    else
                    {
                        item.NombreArchivoOriginal = "";
                        item.NombreArchivo = "";
                    }
                }
            }
            #endregion

            int IdEstilo = _estiloSevice.SaveEditar_Estilo_JSON(estilo, lst_requerimiento, LstRequerimientoArchivo, sparIdRequerimiento);
            string mensaje = _.Mensaje("edit", IdEstilo > 0, _estiloSevice.GetListaEstiloByPrograma_JSON(estilo.IdPrograma.ToString()), IdEstilo);
            return mensaje;
        }

        /// <summary>
        /// par => { IdEstilo, IdPrograma }
        /// </summary>
        /// <returns></returns>
        public string DeleteEstiloById_JSON()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "UsuarioActualizacion", _.GetUsuario().Usuario);
            EstiloViewModels estilo = JsonConvert.DeserializeObject<EstiloViewModels>(sParModel);
            int rows = _estiloSevice.DeleteEstiloById_JSON(estilo);
            string mensaje = _.Mensaje("edit", rows > 0, _estiloSevice.GetListaEstiloByPrograma_JSON(estilo.IdPrograma.ToString()), rows);

            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string UpdateEstadoEstilo()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdSolicitud = _estiloSevice.UpdateEstadoEstilo(sParModel);
            string mensaje = _.Mensaje("new", IdSolicitud != "", IdSolicitud, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string SendSamplesEstilo()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdMuestra = _estiloSevice.SendSamplesEstilo(sParModel);
            string mensaje = _.Mensaje("edit", IdMuestra != "", IdMuestra, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpGet]
        public string GetBuscarTela_JSON()
        {
            string par = _.Get("par");
            return _estiloSevice.GetBuscarTela_JSON(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetAllStylesCarryOverNew()
        {
            string par = _.Get("par");
            return _estiloSevice.GetAllStylesCarryOverNew(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetStyleCarryOverNew()
        {
            string par = _.Get("par");
            return _estiloSevice.GetStyleCarryOverNew(par);
        }

        [AccessSecurity]
        [HttpPost]
        public string SaveStylesCarryOverNew()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            int IdRequerimiento = _estiloSevice.SaveStylesCarryOverNew(sParModel);
            string mensaje = _.Mensaje("new", IdRequerimiento > 0, IdRequerimiento.ToString(), IdRequerimiento);
            return mensaje;
        }

        public string SaveMainFabric()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            int IdRequerimiento = _estiloSevice.SaveMainFabric(sParModel);
            string mensaje = _.Mensaje("edit", IdRequerimiento > 0, IdRequerimiento.ToString(), IdRequerimiento);
            return mensaje;
        }
    }
}