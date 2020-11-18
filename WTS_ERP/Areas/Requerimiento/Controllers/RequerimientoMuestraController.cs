using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Requerimiento.Models;
using WTS_ERP.Areas.Facturacion.Models;
using WTS_ERP.Areas.Requerimiento.Services;
using WTS_ERP.Models;
using Utilitario;
using BE_ERP;
using System.Net.Mime;

namespace WTS_ERP.Areas.Requerimiento.Controllers
{
    public class RequerimientoMuestraController : Controller
    {
        // GET: Requerimiento/RequerimientoMuestra

        private readonly IRequerimientoMuestraService _requerimientoMuestraService;
        string RutaFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
        string RutaFileEstiloFileO = ConfigurationManager.AppSettings["FileRequerientoEstiloOriginal"].ToString();
        string RutaFileEstiloFileT = ConfigurationManager.AppSettings["FileRequerientoEstiloThumbnail"].ToString();
        string RutaFileDDP = ConfigurationManager.AppSettings["FileRequerientoEstiloArchivos"].ToString();

        public RequerimientoMuestraController(IRequerimientoMuestraService requerimientoMuestraService)
        {
            this._requerimientoMuestraService = requerimientoMuestraService;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult _SampleDetails()
        {
            return View();
        }

        // Para DDP
        public ActionResult IndexDDP()
        {
            return View();
        }

        public ActionResult _RequerimientoDetalleDDP()
        {
            ViewBag.RutaFileServer = @RutaFileServer + RutaFileEstiloFileO;
            return View();
        }

        public ActionResult _ConfirmarAprobarRechazarMuestraFromActividad()
        {
            return View();
        }

        public ActionResult _SeleccionarArchivosByMuestra()
        {
            return View();
        }

        /// <summary>
        /// par1 => RequerimientoJSON => {}
        /// par2 => RequerimientoDetalleJSON => [{}, {}]
        /// </summary>
        /// <returns></returns>
        public string SaveRequerimientoWithDetalle()
        {
            string sParModelRequerimiento = _.Post("RequerimientoJSON");
            string sParModelRequerimientoDetalle = _.Post("RequerimientoDetalleJSON");
            string sParModelRequerimientoArchivo = _.Post("RequerimientoArchivoJSON");
            string usuario = _.GetUsuario().Usuario;
            string ip = "";
            string hostName = "";

            RequerimientoMuestraViewModels requerimiento = JsonConvert.DeserializeObject<RequerimientoMuestraViewModels>(sParModelRequerimiento);
            List<RequerimientoMuestraDetalle> requerimientoMuestraDetalle = JsonConvert.DeserializeObject<List<RequerimientoMuestraDetalle>>(sParModelRequerimientoDetalle);
            List<RequerimientoArchivoViewModels> LstRequerimientoArchivo = JsonConvert.DeserializeObject<List<RequerimientoArchivoViewModels>>(sParModelRequerimientoArchivo);

            TryValidateModel(requerimiento);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            #region ARCHIVOS
            var file = Request.Files["ArchivoTechPack"];
            foreach(var item in LstRequerimientoArchivo)
            {
                if (item.ActualizarArchivo == 1) {
                    if (file != null)
                    {
                        /*Utilitario.Imagen.Imagen UtilIma*/
                        Random aleatorio = new Random();

                        MemoryStream memory = new MemoryStream();

                        string NombreImagenOriginal = System.IO.Path.GetFileName(file.FileName);
                        string ExtensionImagenOriginal = System.IO.Path.GetExtension(file.FileName);
                        string NombreImagenGeneradoSinOptimizar = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), ExtensionImagenOriginal);

                        file.InputStream.CopyTo(memory);

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

            int IdRequerimiento = _requerimientoMuestraService.SaveNew_RequerimientoWithDetalle_JSON(requerimiento, requerimientoMuestraDetalle
                , LstRequerimientoArchivo, usuario, ip, hostName);
            string mensaje = _.Mensaje("new", IdRequerimiento > 0, _requerimientoMuestraService.GetRequerimientoWithDetalleById_JSON(IdRequerimiento), IdRequerimiento);

            return mensaje;
        }

        /// <summary>
        /// par => RequerimientoJSON => { IdCliente, IdPrograma }  //// POR MIENSTRA SE PASARA IDPROGRAMA CON CERO = 0
        /// </summary>
        /// <returns></returns>
        public string GetRequerimientoDetalleLoadNew_JSON()
        {
            string sParModelRequerimiento = _.Get("RequerimientoJSON");
            RequerimientoMuestra modelo = JsonConvert.DeserializeObject<RequerimientoMuestra>(sParModelRequerimiento);
            string data = _requerimientoMuestraService.GetRequerimientoDetalleLoadNew_JSON(modelo);
            return data;
        }

        /// <summary>
        /// par => RequerimientoJSON => { IdRequerimiento, IdCliente, IdPrograma }  //// POR MIENSTRA SE PASARA IDPROGRAMA CON CERO = 0
        /// </summary>
        /// <returns></returns>
        public string GetRequerimientoDetalleLoadEdit_JSON()
        {
            string sParModelRequerimiento = _.Get("RequerimientoJSON");
            RequerimientoMuestra modelo = JsonConvert.DeserializeObject<RequerimientoMuestra>(sParModelRequerimiento);
            string data = _requerimientoMuestraService.GetRequerimientoDetalleLoadEdit_JSON(modelo);
            return data;
        }

        /// <summary>
        /// sParModel => { IdRequerimiento, IdEstilo }
        /// </summary>
        /// <returns></returns>
        public string DeleteRequerimientoMuetraById_JSON()
        {
            string sParModel = _.Post("RequerimientoJSON");
            RequerimientoMuestraViewModels requerimiento = JsonConvert.DeserializeObject<RequerimientoMuestraViewModels>(sParModel);
            requerimiento.UsuarioActualizacion = _.GetUsuario().Usuario;
            requerimiento.Ip = "";
            requerimiento.HostName = "";

            int rows = _requerimientoMuestraService.DeleteRequerimientoMuetraById_JSON(requerimiento);
            string mensaje = _.Mensaje("edit", rows > 0, _requerimientoMuestraService.GetRequerimientoByIdEstilo_JSON(requerimiento.IdEstilo), rows);
            return mensaje;
        }

        /// <summary>
        /// sParModel => { IdRequerimientoDetalle, IdRequerimiento }
        /// </summary>
        /// <returns></returns>
        public string DeleteRequerimientoMuestraDetalleById_JSON()
        {
            string sParModel = _.Post("RequerimientoDetalleJSON");
            RequerimientoMuestraDetalle requerimiento = JsonConvert.DeserializeObject<RequerimientoMuestraDetalle>(sParModel);
            requerimiento.UsuarioActualizacion = _.GetUsuario().Usuario;
            requerimiento.Ip = "";
            requerimiento.HostName = "";

            int rows = _requerimientoMuestraService.DeleteRequerimientoMuestraDetalleById_JSON(requerimiento);
            string mensaje = _.Mensaje("edit", rows > 0, _requerimientoMuestraService.GetRequerimientoDetalleByIdRequerimiento_JSON(requerimiento.IdRequerimiento), rows);
            return mensaje;
        }

        /// <summary>
        /// sParModel => { IdArchivo, IdRequerimiento = 12, IdEstilo = 0 } 
        /// OR sParModel => { IdArchivo, IdRequerimiento = 0, IdEstilo = 10 } 
        /// </summary>
        /// <returns></returns>
        public string DeleteArchivoRequerimientoById_JSON()
        {
            string sParModel = _.Post("ArchivoJSON");
            RequerimientoArchivoViewModels requerimiento = JsonConvert.DeserializeObject<RequerimientoArchivoViewModels>(sParModel);
            requerimiento.UsuarioActualizacion = _.GetUsuario().Usuario;
            requerimiento.Ip = "";
            requerimiento.HostName = "";

            int rows = _requerimientoMuestraService.DeleteArchivoRequerimientoById_JSON(requerimiento);
            string mensaje = _.Mensaje("edit", rows > 0, _requerimientoMuestraService.GetArchivoRequerimientoByIdRequerimiento_or_IdEstilo_JSON(requerimiento.IdRequerimiento, requerimiento.IdEstilo), rows);
            return mensaje;
        }

        /// <summary>
        /// sParNombreArchivo => NombreArchivo
        /// sparNombreArchivoOriginal => NombreArchivoOriginal
        /// </summary>
        /// <returns></returns>
        public FileResult DownLoadFileTechkPack()
        {
            string sParNombreArchivo = _.Get("NombreArchivo");
            string sparNombreArchivoOriginal = _.Get("NombreArchivoOriginal");
            string rutaCompleta = @RutaFileServer + "erp/ddp/" + sParNombreArchivo;
            byte[] byteFile = System.IO.File.ReadAllBytes(rutaCompleta);
            return File(byteFile, System.Net.Mime.MediaTypeNames.Application.Octet, sparNombreArchivoOriginal);
        }

        /// ** TEST
        public string GetLoadIndexRequerimientoDespachoDDP_JSON_TEST(int parIdPersonal)
        {
            //int parIdPersonal = Convert.ToInt32(_.Get("parIdPersonal"));  //_.GetUsuario().IdPersonal;
            string data = _requerimientoMuestraService.GetLoadIndexRequerimientoDespachoDDP_JSON(parIdPersonal);
            return data;
        }

        /// ******** PARA DESPACHOS - DDP - OSCAR
        /// <summary>
        /// ''
        /// </summary>
        /// <returns></returns>
        /// PARA LA VENTANA INDEX FILTRO - DDP
        public string GetLoadIndexRequerimientoDespachoDDP_JSON()
        {
            int parIdPersonal = _.GetUsuario().IdPersonal;
            string data = _requerimientoMuestraService.GetLoadIndexRequerimientoDespachoDDP_JSON(parIdPersonal);
            return data;
        }

        /// <summary>
        /// sParModelFiltro => {  }
        /// </summary>
        /// <returns></returns>
        /// PARA CARGAR LA TABLA DE LA VENTANA INDEX FILTRO - DDP
        public string GetListaFiltroRequerimientoDespachoDDP_JSON()
        {
            string sParModelFiltro = _.Get("RequerimientoJSON");
            RequerimientoMuestraFiltroDDPViewModels filtro = JsonConvert.DeserializeObject<RequerimientoMuestraFiltroDDPViewModels>(sParModelFiltro);

            string data = _requerimientoMuestraService.GetListaFiltroRequerimientoDespachoDDP_JSON(filtro);
            return data;
        }

        public FileResult GetListaFiltroRequerimientoDespachoDDP_JSON_excel(string par)
        {
            string sParModelFiltro = _.Get("RequerimientoJSON");
            RequerimientoMuestraFiltroDDPViewModels filtro = JsonConvert.DeserializeObject<RequerimientoMuestraFiltroDDPViewModels>(sParModelFiltro);

            string data = _requerimientoMuestraService.GetListaFiltroRequerimientoDespachoDDPExportar_JSON(filtro);

            ParametrosReporteExcel parametroExcel = new ParametrosReporteExcel
            {
                DataCSV = data,
                ContieneEstructura = true,
                NombreArchivo = "Reporte RequerimientoMuestra.xlsx",
                NombreHoja = "Asignaciones,Despacho"
            };
            byte[] byteExcel = ExportacionExcel.GenerarExcelfromCSV(parametroExcel);
            return File(byteExcel, MediaTypeNames.Application.Octet, parametroExcel.NombreArchivo);
        }

        /// <summary>
        /// sParIdsClientes => '17,18,20'
        /// </summary>
        /// <returns></returns>
        /// PARA CARGAR LOS COMBOS POR CLIENTES SELECCIONADOS
        public string GetCombosFiltroDespachoByIdsClientes_JSON()
        {
            string sParIdsClientes = _.Get("IdsClientes");
            string data = _requerimientoMuestraService.GetCombosFiltroDespachoByIdsClientes_JSON(sParIdsClientes);
            return data;
        }

        /// <summary>
        /// sParIdEstilo => IdEstilo
        /// </summary>
        /// <returns></returns>
        /// PARA EL MODAL LOAD CUANDO SELECCIONA EL ESTILO DESDE EL INDEX
        public string GetLoadDetalleRequerimientoDespachoDDP_JSON()
        {
            int sParIdEstilo = Convert.ToInt32(_.Get("IdEstilo"));
            string data = _requerimientoMuestraService.GetLoadDetalleRequerimientoDespachoDDP_JSON(sParIdEstilo);
            return data;
        }

        /// <summary>
        /// sParModelEstilo => { IdEstilo, TipoSolicitudEstilo_IdCatalogo_EsReorden, ActualizarImagenEstilo }
        /// </summary>
        /// <returns></returns>
        /// PARA EL BOTON SAVE - GRABAR EN EL MODAL DETALLE DE REQUERIMIENTO - DESPACHO
        public string SaveDetalleRequerimientoDespacho_JSON()
        {
            string sParModelEstilo = _.Post("EstiloJSON");
            EstiloViewModels estilo = JsonConvert.DeserializeObject<EstiloViewModels>(sParModelEstilo);

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

            int rows = _requerimientoMuestraService.SaveDetalleRequerimientoDespacho_JSON(estilo);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }

        /// <summary>
        /// sParModelEstilo => { IdEstilo, TipoSolicitudEstilo_IdCatalogo_EsReorden, ActualizarImagenEstilo }
        /// </summary>
        /// <returns></returns>
        public string SaveDetalleRequerimientoDespacho_JSON_TEST()
        {
            string sParModelEstilo = _.Post("EstiloJSON");
            EstiloViewModels estilo = JsonConvert.DeserializeObject<EstiloViewModels>(sParModelEstilo);

            int rows = _requerimientoMuestraService.SaveDetalleRequerimientoDespacho_JSON(estilo);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }

        /// <summary>
        /// parIdRequerimiento => IdRequerimiento
        /// </summary>
        /// <returns></returns>
        /// PARA OBTENER LA LISTA DE DESPACHOS POR IDREQUERIMIENTO - MUESTRA
        public string GetListaDespachoDetalleByIdRequerimientoForSave_JSON()
        {
            int parIdRequerimiento = Convert.ToInt32(_.Get("IdRequerimiento"));
            string data = _requerimientoMuestraService.GetListaDespachoDetalleByIdRequerimientoForSave_JSON(parIdRequerimiento);
            return data;
        }

        /// <summary>
        /// sParModelRequerimientxActividad => {  }
        /// </summary>
        /// <returns></returns>
        /// PARA GRABAR - NEW LA ACTIVIDAD POR REQUERIMIENTO - MUESTRA
        public string SaveNewActividadxRequerimiento_JSON()
        {
            string sParModelRequerimientxActividad = _.Post("RequerimientoxActividadJSON");
            string sParModelRequerimiento = _.Post("RequerimientoAprobadoRechazadoJSON");
            RequerimientoxActividadViewModels requerimientoxActividad = JsonConvert.DeserializeObject<RequerimientoxActividadViewModels>(sParModelRequerimientxActividad);
            RequerimientoMuestraViewModels requerimiento = JsonConvert.DeserializeObject<RequerimientoMuestraViewModels>(sParModelRequerimiento);
            requerimientoxActividad.UsuarioCreacion = _.GetUsuario().Usuario;
            requerimientoxActividad.Ip = "";
            requerimientoxActividad.HostName = "";

            TryValidateModel(requerimientoxActividad);

            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            int idRequerimientoActividad = _requerimientoMuestraService.SaveNewActividadxRequerimiento_JSON(requerimientoxActividad, requerimiento);
            string data = "";
            if (idRequerimientoActividad > 0)
            {
                data = _requerimientoMuestraService.GetRequerimientoActividadById_JSON(idRequerimientoActividad);
            }
            string mensaje = _.Mensaje("new", idRequerimientoActividad > 0, data, idRequerimientoActividad);
            return mensaje;
        }

        /// <summary>
        /// sParModelRequerimientxActividad => {  }
        /// </summary>
        /// <returns></returns>
        /// PARA GRABAR - EDIT LA ACTIVIDAD POR REQUERIMIENTO - MUESTRA
        public string SaveEditActividadxRequerimiento_JSON()
        {
            string sParModelRequerimientxActividad = _.Post("RequerimientoxActividadJSON");
            string sParModelRequerimiento = _.Post("RequerimientoAprobadoRechazadoJSON");
            RequerimientoxActividadViewModels requerimientoxActividad = JsonConvert.DeserializeObject<RequerimientoxActividadViewModels>(sParModelRequerimientxActividad);
            RequerimientoMuestraViewModels requerimiento = JsonConvert.DeserializeObject<RequerimientoMuestraViewModels>(sParModelRequerimiento);
            requerimientoxActividad.UsuarioCreacion = _.GetUsuario().Usuario;
            requerimientoxActividad.Ip = "";
            requerimientoxActividad.HostName = "";

            TryValidateModel(requerimientoxActividad);

            if (!ModelState.IsValid)
            {
                return _.Mensaje("edit", false, null, -1);
            }

            int idRequerimientoActividad = _requerimientoMuestraService.SaveEditActividadxRequerimiento_JSON(requerimientoxActividad, requerimiento);
            string data = "";
            if (idRequerimientoActividad > 0)
            {
                data = _requerimientoMuestraService.GetRequerimientoActividadById_JSON(idRequerimientoActividad);
            }
            string mensaje = _.Mensaje("edit", idRequerimientoActividad > 0, data, idRequerimientoActividad);
            return mensaje;
        }

        /// <summary>
        /// parIdRequerimientoxActividad => IdRequerimientoxActividad
        /// </summary>
        /// <returns></returns>
        /// PARA OBTENER LA LISTA DE REQUERIMIENTO ACTIVIDAD POR SU ID PK - IdRequerimientoxActividad
        public string GetRequerimientoActividadById_JSON()
        {
            int parIdRequerimientoxActividad = Convert.ToInt32(_.Get("IdRequerimientoxActividad"));

            string data = _requerimientoMuestraService.GetRequerimientoActividadById_JSON(parIdRequerimientoxActividad);
            return data;
        }

        /// TEST; EL TEST POR QUE DESDE POSTMAN ME INVALIDA EL USUARIO YA QUE DETECTA QUE ESTOY PROBANDO DESDE OTRA APLICACION
        /// <summary>
        /// sParModel => { IdRequerimientoxActividad }
        /// </summary>
        /// <returns></returns>
        /// PARA ELIMINAR EL REQUERIMIENTO ACTIVIDAD POR SU ID PK IdRequerimientoxActividad
        public string DeleteRequerimientoxActividadById_JSON_TEST()
        {
            string sParModel = _.Post("requerimientoxActividadJSON");
            RequerimientoxActividadViewModels model = JsonConvert.DeserializeObject<RequerimientoxActividadViewModels>(sParModel);
            //model.UsuarioActualizacion = _.GetUsuario().Usuario;
            model.Ip = "";
            model.HostName = "";

            int rows = _requerimientoMuestraService.DeleteRequerimientoxActividadById_JSON(model);
            string data = "";
            if (rows > 0)
            {
                data = _requerimientoMuestraService.GetRequerimientoActividadById_JSON(model.IdRequerimientoxActividad);
            }
            string mensaje = _.Mensaje("edit", rows > 0, data, rows);
            return mensaje;
        }

        /// <summary>
        /// sParModel => { IdRequerimientoxActividad }
        /// </summary>
        /// <returns></returns>
        /// PARA ELIMINAR EL REQUERIMIENTO ACTIVIDAD POR SU ID PK IdRequerimientoxActividad
        public string DeleteRequerimientoxActividadById_JSON()
        {
            string sParModel = _.Post("requerimientoxActividadJSON");
            RequerimientoxActividadViewModels model = JsonConvert.DeserializeObject<RequerimientoxActividadViewModels>(sParModel);
            model.UsuarioActualizacion = _.GetUsuario().Usuario;
            model.Ip = "";
            model.HostName = "";

            int rows = _requerimientoMuestraService.DeleteRequerimientoxActividadById_JSON(model);
            string data = "";
            if (rows > 0)
            {
                data = _requerimientoMuestraService.GetRequerimientoActividadById_JSON(model.IdRequerimientoxActividad);
            }
            string mensaje = _.Mensaje("edit", rows > 0, data, rows);
            return mensaje;
        }

        /// TEST
        /// <summary>
        /// sParModel => DespachoDetalleViewModels => []
        /// </summary>
        /// <returns></returns>
        /// PARA GRABAR LOS DESPACHOS DESDE EL BOTON ACTUALIZAR DESPACHO
        public string SaveDespachoDetalle_BotonActualizar_JSON_TEST()
        {
            string sParModel = _.Post("DespachoDetalleJSON");
            List<DespachoDetalleViewModels> lstModel = JsonConvert.DeserializeObject<List<DespachoDetalleViewModels>>(sParModel);
            //foreach (var item in lstModel)
            //{
            //    item.UsuarioCreacion = _.GetUsuario().Usuario;
            //}
            TryValidateModel(lstModel);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            int idRequerimiento = lstModel[0].IdRequerimiento;
            int rows = _requerimientoMuestraService.SaveDespachoDetalle_BotonActualizar_JSON(lstModel);
            string data = "";
            if (rows > 0)
            {
                data = _requerimientoMuestraService.GetListaDespachoDetalleByIdRequerimientoForSave_JSON(idRequerimiento);
            }
            string mensaje = _.Mensaje("new", rows > 0, data, rows);
            return mensaje;
        }

        /// <summary>
        /// sParModel => DespachoDetalleViewModels => []
        /// </summary>
        /// <returns></returns>
        /// PARA GRABAR LOS DESPACHOS DESDE EL BOTON ACTUALIZAR DESPACHO
        public string SaveDespachoDetalle_BotonActualizar_JSON()
        {
            string sParModel = _.Post("DespachoDetalleJSON");
            List<DespachoDetalleViewModels> lstModel = JsonConvert.DeserializeObject<List<DespachoDetalleViewModels>>(sParModel);
            foreach (var item in lstModel)
            {
                item.UsuarioCreacion = _.GetUsuario().Usuario;
            }
            TryValidateModel(lstModel);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            int idRequerimiento = lstModel[0].IdRequerimiento;
            int rows = _requerimientoMuestraService.SaveDespachoDetalle_BotonActualizar_JSON(lstModel);
            string data = "";
            if (rows > 0)
            {
                data = _requerimientoMuestraService.GetListaDespachoDetalleByIdRequerimientoForSave_JSON(idRequerimiento);
            }
            string mensaje = _.Mensaje("new", rows > 0, data, rows);
            return mensaje;
        }

        /// TEST : SE QUITO EL USUARIO DE SESSION PARA PODER HACER LA PRUEBA
        /// <summary>
        /// sParModel => { IdDespachoDetalle, IdRequerimiento }
        /// </summary>
        /// <returns></returns>
        public string DeleteDespachoDetalleById_JSON_TEST()
        {
            string sParModel = _.Post("DespachoDetalleJSON");
            DespachoDetalleViewModels model = JsonConvert.DeserializeObject<DespachoDetalleViewModels>(sParModel);
            //model.UsuarioActualizacion = _.GetUsuario().Usuario;

            string sParModelUltimaCopia = _.Post("DespachoDetalleUltimoJSON");
            DespachoDetalleViewModels modelUltimaCopia = JsonConvert.DeserializeObject<DespachoDetalleViewModels>(sParModelUltimaCopia);
            modelUltimaCopia.UsuarioActualizacion = _.GetUsuario().Usuario;

            int idRequerimiento = model.IdRequerimiento;
            int rows = _requerimientoMuestraService.DeleteDespachoDetalleById_JSON(model, modelUltimaCopia);
            string data = "";
            if (rows > 0)
            {
                data = _requerimientoMuestraService.GetListaDespachoDetalleByIdRequerimientoForSave_JSON(idRequerimiento);
            }
            string mensaje = _.Mensaje("edit", rows > 0, data, rows);
            return mensaje;
        }

        /// <summary>
        /// sParModel => { IdDespachoDetalle, IdRequerimiento }
        /// </summary>
        /// <returns></returns>
        /// PARA ELIMINAR EL DESPACHO POR SU ID PK IdDespachoDetalle
        public string DeleteDespachoDetalleById_JSON()
        {
            string sParModel = _.Post("DespachoDetalleJSON");
            DespachoDetalleViewModels model = JsonConvert.DeserializeObject<DespachoDetalleViewModels>(sParModel);
            model.UsuarioActualizacion = _.GetUsuario().Usuario;

            string sParModelUltimaCopia = _.Post("DespachoDetalleUltimoJSON");
            DespachoDetalleViewModels modelUltimaCopia = JsonConvert.DeserializeObject<DespachoDetalleViewModels>(sParModelUltimaCopia);
            modelUltimaCopia.UsuarioActualizacion = _.GetUsuario().Usuario;
            
            int idRequerimiento = model.IdRequerimiento;
            int rows = _requerimientoMuestraService.DeleteDespachoDetalleById_JSON(model, modelUltimaCopia);
            string data = "";
            if (rows > 0)
            {
                data = _requerimientoMuestraService.GetListaDespachoDetalleByIdRequerimientoForSave_JSON(idRequerimiento);
            }
            string mensaje = _.Mensaje("edit", rows > 0, data, rows);
            return mensaje;
        }

        /// <summary>
        /// sParModel => RequerimientoArchivoJSON => {}
        /// </summary>
        /// <returns></returns>
        /// PARA GRABAR NEW ARCHIVO DESDE EL BOTON CARGAR ARCHIVO
        public string SaveArchivoRequerimiento_JSON()
        {
            string sParModel = _.Post("RequerimientoArchivoJSON");
            RequerimientoArchivoViewModels modelo = JsonConvert.DeserializeObject<RequerimientoArchivoViewModels>(sParModel);

            TryValidateModel(modelo);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            int IdRequerimiento = modelo.IdRequerimiento;
            int IdEstilo = modelo.IdEstilo;
            string usuario = _.GetUsuario().Usuario;
            string Ip = "";
            string HostName = "";

            #region ARCHIVOS TECHPACK
            var fileTechPack = Request.Files["ArchivoTechPack"];
            if (modelo.ActualizarArchivo == 1)
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
                    modelo.NombreArchivoOriginal = NombreImagenOriginal;
                    modelo.NombreArchivo = NombreImagenGeneradoSinOptimizar;
                }
                else
                {
                    modelo.NombreArchivoOriginal = "";
                    modelo.NombreArchivo = "";
                }
            }
            #endregion

            int rows = _requerimientoMuestraService.SaveArchivoRequerimiento_JSON(modelo, IdRequerimiento, IdEstilo, usuario, Ip, HostName);
            string data = "";
            if (rows > 0)
            {
                data = _requerimientoMuestraService.GetArchivoRequerimientoByIdRequerimiento_or_IdEstilo_JSON(0, IdEstilo);
            }
            string mensaje = _.Mensaje("new", rows > 0, data, rows);
            return mensaje;
        }

        /// <summary>
        /// idPersonal => es el equipo seleccionado => MILAGROS ESQUIVEL OR ROSARIO RICCE
        /// </summary>
        /// <returns></returns>
        /// PARA OBTENER LA LISTA DE CLIENTES POR IDPERSONAL LOGEADO O DEL EQUIPO SELECCIONADO (MILAGROS O ROSARIO)
        public string GetListaClientesDDPByIdPersonal_ByReglaCliente_JSON()
        {
            int idPersonal = Convert.ToInt32(_.Get("IdPersonal"));
            string data = _requerimientoMuestraService.GetListaClientesDDPByIdPersonal_ByReglaCliente_JSON(idPersonal);
            return data;
        }

        /// TEST => POR LA SESSION EL IDPERSONAL
        /// <summary>
        /// IdPersonalJefaDDP_EquipoDDP => id del jefe de equipo seleccionado
        /// </summary>
        /// <returns></returns>
        public string GetListaResponsablesAnalistasDDP_JSON_TEST()
        {
            int IdPersonalJefaDDP_EquipoDDP = Convert.ToInt32(_.Get("IdPersonalJefaDDP_EquipoDDP"));
            int IdPersonal_Logged = Convert.ToInt32(_.Get("IdPersonal_Logged"));  //_.GetUsuario().IdPersonal;

            string data = _requerimientoMuestraService.GetListaResponsablesAnalistasDDP_JSON(IdPersonalJefaDDP_EquipoDDP, IdPersonal_Logged);
            return data;
        }

        /// <summary>
        /// IdPersonalJefaDDP_EquipoDDP => id del jefe de equipo seleccionado
        /// </summary>
        /// <returns></returns>
        /// PARA OBTENER LA LISTA DE ANALISTAS RESPONSABLES POR IDPERSONAL EQUIPO SELECCIONADO
        public string GetListaResponsablesAnalistasDDP_JSON()
        {
            int IdPersonalJefaDDP_EquipoDDP = Convert.ToInt32(_.Get("IdPersonalJefaDDP_EquipoDDP"));
            int IdPersonal_Logged = _.GetUsuario().IdPersonal;

            string data = _requerimientoMuestraService.GetListaResponsablesAnalistasDDP_JSON(IdPersonalJefaDDP_EquipoDDP, IdPersonal_Logged);
            return data;
        }

        //// TEST
        /// <summary>
        /// sParModel => RequerimientoComentarioJSON = { IdRequerimiento, Comentario }
        /// </summary>
        /// <returns></returns>
        public string SaveNewRequerimientoMuestraComentario_JSON_TEST()
        {
            string sParModel = _.Post("RequerimientoComentarioJSON");
            RequerimientoComentarioViewModels modelo = JsonConvert.DeserializeObject<RequerimientoComentarioViewModels>(sParModel);
            //modelo.UsuarioCreacion = _.GetUsuario().Usuario;

            TryValidateModel(modelo);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            int IdComentario = _requerimientoMuestraService.SaveNewRequerimientoMuestraComentario_JSON(modelo);
            string data = "";
            if (IdComentario > 0)
            {
                data = _requerimientoMuestraService.GetListaRequerimientoMuestraComentarioByIdRequerimiento_JSON(modelo.IdRequerimiento);
            }

            string mensaje = _.Mensaje("new", IdComentario > 0, data, IdComentario);
            return mensaje;
        }

        //// PARA COMENTARIOS - DDP
        /// <summary>
        /// sParModel => RequerimientoComentarioJSON = { IdRequerimiento, Comentario }
        /// </summary>
        /// <returns></returns>
        /// PARA GRABAR NEW COMENTARIO POR REQUERIMIENTO - IDREQUERIMIENTO - MUESTRA
        public string SaveNewRequerimientoMuestraComentario_JSON()
        {
            string sParModel = _.Post("RequerimientoComentarioJSON");
            RequerimientoComentarioViewModels modelo = JsonConvert.DeserializeObject<RequerimientoComentarioViewModels>(sParModel);
            modelo.UsuarioCreacion = _.GetUsuario().Usuario;

            TryValidateModel(modelo);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            int IdComentario = _requerimientoMuestraService.SaveNewRequerimientoMuestraComentario_JSON(modelo);
            string data = "";
            if (IdComentario > 0)
            {
                data = _requerimientoMuestraService.GetListaRequerimientoMuestraComentarioByIdRequerimiento_JSON(modelo.IdRequerimiento);
            }

            string mensaje = _.Mensaje("new", IdComentario > 0, data, IdComentario);
            return mensaje;
        }

        /// <summary>
        /// IdRequerimiento
        /// </summary>
        /// <returns></returns>
        /// PARA OBTENER LA LISTA DE COMENTARIOS POR REQQUERIMIENTO - MUESTA - IDREQUERIMIENTO
        public string GetListaRequerimientoMuestraComentarioByIdRequerimiento_JSON()
        {
            int IdRequerimiento = Convert.ToInt32(_.Get("IdRequerimiento"));
            string data = _requerimientoMuestraService.GetListaRequerimientoMuestraComentarioByIdRequerimiento_JSON(IdRequerimiento);
            return data;
        }

        //public string GetArchivoRequerimientoByIdRequerimiento_or_IdEstilo_JSON()
        //{

        //}

        /// <summary>
        /// IdEstilo => IdEstilo
        /// </summary>
        /// <returns></returns>
        public string GetRequerimientoMuestraWithActividadesByEstilo_JSON()
        {
            int IdEstilo = Convert.ToInt32(_.Get("IdEstilo"));
            string data = _requerimientoMuestraService.GetRequerimientoMuestraWithActividadesByEstilo_JSON(IdEstilo);
            return data;
        }

        public string GetListaArchivoByIdRequerimiento_or_IdEstilo()
        {
            int IdEstilo = Convert.ToInt32(_.Get("IdEstilo"));
            string data = _requerimientoMuestraService.GetArchivoRequerimientoByIdRequerimiento_or_IdEstilo_JSON(0, IdEstilo);
            return data;
        }

        public string SaveSendEmail_DDP_Muestras()
        {
            //RutaFileServer
            string ruta_fileserver_preprod = ConfigurationManager.AppSettings["FileServerPREPROD"].ToString();
            string FileTempFileCorreo = ConfigurationManager.AppSettings["FileTempFileCorreo"].ToString();
            string sParModel = Utils.unescape(_.Post("CorreoJSON"));
            BeCorreoViewModels ocorreo = JsonConvert.DeserializeObject<BeCorreoViewModels>(sParModel);
            ocorreo.correo_from = _.GetUsuario().Correo;
            ocorreo.usuario = _.GetUsuario().Usuario;

            string file_attachments_mail = "";
            ocorreo.cadena_lista_archivos_adjuntos = "";
            if (ocorreo.correoarchivo.Count > 0)
            {
                for (int i = 0; i < ocorreo.correoarchivo.Count; i++)
                {
                    CorreoArchivo obj = ocorreo.correoarchivo[i];
                    string rutacompleta_archivo = @"\\" + RutaFileServer + "\\" + RutaFileDDP + "\\" + obj.nombrearchivo;
                    string ruta_downloadfile_completa = @"\\" + ruta_fileserver_preprod + "\\" + FileTempFileCorreo + "\\" + obj.nombrearchivooriginal;
                    byte[] archivoBYTE = System.IO.File.ReadAllBytes(rutacompleta_archivo);
                    System.IO.File.WriteAllBytes(ruta_downloadfile_completa, archivoBYTE);

                    //string nombrearchivoconcatenado = obj.nombrearchivooriginal;
                    file_attachments_mail += ";" + obj.nombrearchivooriginal;
                    ocorreo.cadena_lista_archivos_adjuntos += obj.nombrearchivooriginal + ";";
                }
            }

            int idcorreo = _requerimientoMuestraService.SaveSendEmail_DDP_Muestras(ocorreo);
            string mensaje = _.Mensaje("sendmail", idcorreo > 0, null, idcorreo, true);
            return mensaje;
        }
    }
}