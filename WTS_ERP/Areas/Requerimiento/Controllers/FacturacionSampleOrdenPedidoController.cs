using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Requerimiento.Services;
using WTS_ERP.Models;
using WTS_ERP.Areas.Requerimiento.Models;
using System.IO;
using System.Configuration;
using Newtonsoft.Json.Linq;
using iTextSharp.text;
using iTextSharp.text.pdf;
//using OfficeOpenXml.FormulaParsing.Excel.Functions.RefAndLookup;

namespace WTS_ERP.Areas.Requerimiento.Controllers
{
    public class FacturacionSampleOrdenPedidoController : Controller
    {
        /// <summary>
        /// Requerimiento/FacturacionSampleOrdenPedido
        /// </summary>
        private readonly IOrdenPedidoService _ordenPedidoServicio;
        string rutaFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();

        public FacturacionSampleOrdenPedidoController(IOrdenPedidoService ordenPedidoServicio)
        {
            this._ordenPedidoServicio = ordenPedidoServicio;
        }
        // GET: Requerimiento/FacturacionSampleOrdenPedido
        //public ActionResult Index()
        //{
        //    return View();
        //}

        public ActionResult _OrdenPedidoFacturacionSample()
        {
            return View();
        }

        public ActionResult _SeleccionarOrdenPedido()
        {
            return View();
        }

        public string GetOrdenPedidoLoadNew_JSON()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            return _ordenPedidoServicio.GetOrdenPedidoLoadNew_JSON(par);
        }

        public string GetRequerimientoMuestraDetalle_JSON()
        {
            string listaRequerimientosSeleccionados = _.Get("listaRequerimientosSeleccionados");
            return _ordenPedidoServicio.GetRequerimientoMuestraDetalle_JSON(listaRequerimientosSeleccionados);
        }

        public string SaveNewOrdenPedido_JSON()
        {
            string sParOrdenPedidoModel = _.Post("OrdenPedidoJSON");
            string sParOrdenPedidoDetalle = _.Post("OrdenPedidoDetalleJSON");
            string sParListaArchivos = _.Post("ListaArchivosJSON");
            string sParListaColoresModificados = _.Post("ListaColoresModificadosJSON");

            OrdenPedidoViewModels ordenPedido = JsonConvert.DeserializeObject<OrdenPedidoViewModels>(sParOrdenPedidoModel);
            List<OrdenPedidoDetalleViewModels> listaOrdenPedidoDetalle = JsonConvert.DeserializeObject<List<OrdenPedidoDetalleViewModels>>(sParOrdenPedidoDetalle);
            List<OrdenPedidoArchivoHojaDeCostosViewModels> listaArchivos = JsonConvert.DeserializeObject<List<OrdenPedidoArchivoHojaDeCostosViewModels>>(sParListaArchivos);
            List<OrdenPedidoDetalleViewModels> listaColoresModificados = JsonConvert.DeserializeObject<List<OrdenPedidoDetalleViewModels>>(sParListaColoresModificados);

            ordenPedido.Usuario = _.GetUsuario().Usuario;

            #region ARCHIVOS
            Random aleatorio = new Random();
            foreach (string item in Request.Files) 
            {
                var file = Request.Files[item];
                MemoryStream memory = new MemoryStream();
                string nombreArchivoOriginal = System.IO.Path.GetFileName(file.FileName);
                string extension = System.IO.Path.GetExtension(file.FileName);
                string nombrearchivogenerado = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), extension);

                foreach (var itemArchivo in listaArchivos)
                {
                    if (itemArchivo.NombreArchivoOriginal == nombreArchivoOriginal)
                    {
                        itemArchivo.NombreArchivoGenerado = nombrearchivogenerado;
                        break;
                    }
                }
                file.InputStream.CopyTo(memory);
                byte[] bfile = memory.ToArray();
                // ASI SERIA MI RUTA PARA EL FILE SERVER
                //string rutaFile = @rutaFileServer + "erp/Requerimiento/FacturacionSample/OrdenPedido"
                string rutaFile = Server.MapPath("~/Content/FacturacionSampleOrdenPedido/") + nombrearchivogenerado;
                System.IO.File.WriteAllBytes(rutaFile, bfile);
            }
            #endregion

            int idOrdenPedido = _ordenPedidoServicio.SaveNewOrdenPedido_JSON(ordenPedido
                , listaOrdenPedidoDetalle, listaArchivos, listaColoresModificados);

            string mensaje = _.Mensaje("new", idOrdenPedido > 0, null, idOrdenPedido);
            return mensaje;
        }

        public string SaveEditOrdenPedido_JSON()
        {
            string sParOrdenPedidoModel = _.Post("OrdenPedidoJSON");
            string sParOrdenPedidoDetalle = _.Post("OrdenPedidoDetalleJSON");
            string sParListaArchivos = _.Post("ListaArchivosJSON");
            string sParListaColoresModificados = _.Post("ListaColoresModificadosJSON");

            OrdenPedidoViewModels ordenPedido = JsonConvert.DeserializeObject<OrdenPedidoViewModels>(sParOrdenPedidoModel);
            List<OrdenPedidoDetalleViewModels> listaOrdenPedidoDetalle = JsonConvert.DeserializeObject<List<OrdenPedidoDetalleViewModels>>(sParOrdenPedidoDetalle);
            List<OrdenPedidoArchivoHojaDeCostosViewModels> listaArchivos = JsonConvert.DeserializeObject<List<OrdenPedidoArchivoHojaDeCostosViewModels>>(sParListaArchivos);
            List<OrdenPedidoDetalleViewModels> listaColoresModificados = JsonConvert.DeserializeObject<List<OrdenPedidoDetalleViewModels>>(sParListaColoresModificados);

            ordenPedido.Usuario = _.GetUsuario().Usuario;

            #region ARCHIVOS
            Random aleatorio = new Random();
            foreach (string item in Request.Files)
            {
                var file = Request.Files[item];
                MemoryStream memory = new MemoryStream();
                string nombreArchivoOriginal = System.IO.Path.GetFileName(file.FileName);
                string extension = System.IO.Path.GetExtension(file.FileName);
                string nombrearchivogenerado = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), extension);

                foreach (var itemArchivo in listaArchivos)
                {
                    if (itemArchivo.NombreArchivoOriginal == nombreArchivoOriginal)
                    {
                        itemArchivo.NombreArchivoGenerado = nombrearchivogenerado;
                        break;
                    }
                }
                file.InputStream.CopyTo(memory);
                byte[] bfile = memory.ToArray();
                // ASI SERIA MI RUTA PARA EL FILE SERVER
                //string rutaFile = @rutaFileServer + "erp/Requerimiento/FacturacionSample/OrdenPedido"
                string rutaFile = Server.MapPath("~/Content/FacturacionSampleOrdenPedido/") + nombrearchivogenerado;
                System.IO.File.WriteAllBytes(rutaFile, bfile);
            }
            #endregion

            int idOrdenPedido = _ordenPedidoServicio.SaveEditOrdenPedido_JSON(ordenPedido
                , listaOrdenPedidoDetalle, listaArchivos, listaColoresModificados);

            string mensaje = _.Mensaje("new", idOrdenPedido > 0, null, idOrdenPedido);
            return mensaje;
        }

        public string SaveCancelarOrdenPedido_JSON()
        {
            int idordenpedido = Convert.ToInt32(_.Post("IdOrdenPedido"));
            string usuario = _.GetUsuario().Usuario;
            int rows = _ordenPedidoServicio.SaveCancelarOrdenPedido_JSON(idordenpedido, usuario);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }

        //public string GetOrdenPedidoById_CSV()
        public string GetOrdenPedidoByIdForFacturaFabricaSave_CSV()
        {
            int idOrdenpedido = Convert.ToInt32(_.Get("IdOrdenPedido"));
            string data = _ordenPedidoServicio.GetOrdenPedidoByIdForFacturaFabricaSave_CSV(idOrdenpedido);
            return data;
        }

        public string GetOrdenPedidoLoadSeleccionarOP_JSON()
        {
            int idPrograma = Convert.ToInt32(_.Get("IdPrograma"));
            int idCliente = Convert.ToInt32(_.Get("IdCliente"));
            int idGrupoPersonal = Convert.ToInt32(_.GetUsuario().IdGrupoComercial);
            //// ESTO LO DEJO PENDIENTE PARA PREGUNTAR A OSCAR SI SE FILTRA POR PROVEEDOR TAMBIEN
            int idProveedor = Convert.ToInt32(_.Get("IdProveedor"));

            string data = _ordenPedidoServicio.GetOrdenPedidoLoadSeleccionarOP_JSON(idPrograma, idCliente, idGrupoPersonal, idProveedor);
            return data;
        }

        public string GetOrdenPedidoForSeleccionarOP_FacturaClienteJSON()
        {
            int idOrdenPedido = Convert.ToInt32(_.Get("IdOrdenPedido"));
            string data = _ordenPedidoServicio.GetOrdenPedidoForSeleccionarOP_FacturaClienteJSON(idOrdenPedido);
            return data;
        }

        public string SaveActualizarOrdenPedidoFromBuscarOrdenPeidoJSON()
        {
            string sParOrdenPedido = _.Post("OrdenPedidoJSON");
            OrdenPedidoViewModels ordenPedidoModels = JsonConvert.DeserializeObject<OrdenPedidoViewModels>(sParOrdenPedido);
            int rows = _ordenPedidoServicio.SaveActualizarOrdenPedidoFromBuscarOrdenPeidoJSON(ordenPedidoModels);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }

        public string GetOrdenPedidoLoadEdit_JSON()
        {
            string sPar = _.Get("par");
            sPar = _.addParameter(sPar, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial);
            string data = _ordenPedidoServicio.GetOrdenPedidoLoadEdit_JSON(sPar);
            return data;
        }

        public FileResult DownloadFileHojaCosto()
        {
            string sParNombreArchivoGenerado = _.Get("NombreArchivoGenerado");
            string sParNombreArchivoOriginal = _.Get("NombreArchivoOriginal");
            string rutaFile = Server.MapPath("~/Content/FacturacionSampleOrdenPedido/") + sParNombreArchivoGenerado;
            byte[] arrByte = System.IO.File.ReadAllBytes(rutaFile);
            return File(arrByte, System.Net.Mime.MediaTypeNames.Application.Octet, sParNombreArchivoOriginal);
        }

        /// <summary>
        /// METODOS PARA LA GENERACION DE LA PO - OC
        /// </summary>
        /// <returns></returns>
        public string test_ordenpedido()
        {
            int idordenpedido = Convert.ToInt32(_.Get("IdOrdenPedido"));
            string data = _ordenPedidoServicio.test_ordenpedido(idordenpedido);
            OrdenPedidoViewModels op = JsonConvert.DeserializeObject<OrdenPedidoViewModels>(data);
            List<OrdenPedidoDetalle> ListaOrdenPedidoDetalle = JsonConvert.DeserializeObject<List<OrdenPedidoDetalle>>(op.OrdenPedidoDetalle);
            JObject jo_empresa = JObject.Parse(op.EmpresaJSON) as JObject;
            string nombreEmpresa = jo_empresa.GetValue("NombreLargo").ToString();
            string direccionEmpresa = jo_empresa.GetValue("Direccion").ToString();
            string logoEmpresa = jo_empresa.GetValue("NombreLogo").ToString();
            

            return data;
        }

        public FileResult GeneratePO_PDF()
        {
            int idordenpedido = Convert.ToInt32(_.Get("IdOrdenPedido"));
            string data = _ordenPedidoServicio.test_ordenpedido(idordenpedido);
            OrdenPedidoViewModels po = JsonConvert.DeserializeObject<OrdenPedidoViewModels>(data);
            List<OrdenPedidoDetalleViewModels> ListaOrdenPedidoDetalle = JsonConvert.DeserializeObject<List<OrdenPedidoDetalleViewModels>>(po.OrdenPedidoDetalle);
            List<RequerimientoMuestraViewModels> ListaRequerimientoMuestra = JsonConvert.DeserializeObject<List<RequerimientoMuestraViewModels>>(po.RequerimientoMuestraJSON);
            JObject jo_empresa = JObject.Parse(po.EmpresaJSON) as JObject;
            string nombreLogoEmpresa = jo_empresa.GetValue("NombreLogo").ToString();
            string numeroCodigoPoCliente = Convert.ToDateTime(po.FechaCreacion).Year.ToString()+ "-" +Convert.ToDateTime(po.FechaCreacion).Month.ToString("00")+"-"+po.NumeroOrdenPedido.Substring(po.NumeroOrdenPedido.IndexOf("-") + 1, 5);
            JObject jo_datosFabrica = JObject.Parse(po.ProveedorJSON) as JObject;
            JObject jo_datosCliente = JObject.Parse(po.ClienteJSON) as JObject;

            byte[] bytes = new byte[0];
            string fileName = "Error.pdf";

            try
            {
                fileName = string.Format("PO Sample - {0}", numeroCodigoPoCliente);

                using (MemoryStream ms = new MemoryStream())
                {
                    Document document = new Document(iTextSharp.text.PageSize.A4,20, 20, 20, 20);  // A4.Rotate PARA HORIZONTAL
                    PdfWriter writer = PdfWriter.GetInstance(document, ms);
                    document.Open();

                    PdfContentByte pcb = writer.DirectContent;
                    iTextSharp.text.Font _standardFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 8, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);

                    BaseColor baseColorGencianPerlado = new BaseColor(042, 100, 120);

                    var Smaller = FontFactory.GetFont(FontFactory.HELVETICA, 6);
                    var SmallFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 7);
                    Font SmallFont = FontFactory.GetFont(FontFactory.HELVETICA, 7);
                    var SmallFontWhite = FontFactory.GetFont(FontFactory.HELVETICA, 7);
                    Font SmallFontBoldWhite = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 7);
                    var RegularFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);

                    var MediumFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14);
                    var MediumFont = FontFactory.GetFont(FontFactory.HELVETICA, 9);
                    var LargeFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 32);
                    var LargeFont = FontFactory.GetFont(FontFactory.HELVETICA, 32);

                    MediumFont.SetColor(0, 0, 0);  // NEGRO
                    SmallFontBoldWhite.SetColor(255, 255, 255); // BLANCO
                    SmallFontWhite.SetColor(255, 255, 255);

                    #region BLOQUE 1: TABLA CABECERA: LOGO / NUMERO PO / FECHAS
                    // TABLA PARA LA CABECERA PRINCIPAL
                    PdfPTable tablaCaceberaLogo = new PdfPTable(3);
                    tablaCaceberaLogo.WidthPercentage = 100;
                    tablaCaceberaLogo.SetWidths(new float[] { 30f, 30f, 30f });
                    tablaCaceberaLogo.DefaultCell.Border = Rectangle.NO_BORDER;

                    // --LOGO
                    string cRutaLogo = string.Empty;
                    PdfPCell celdaImagenLogo = new PdfPCell();
                    if (!string.IsNullOrEmpty(nombreLogoEmpresa))
                    {
                        //cRutaLogo = System.Web.HttpContext.Current.Server.MapPath("~/images/Empresa/" + nombreLogoEmpresa); // WTSLogo.png
                        cRutaLogo = ConfigurationManager.AppSettings["urlimagesempresa"].ToString() + nombreLogoEmpresa;
                        try
                        {
                            byte[] byteImagenLogo = new System.Net.WebClient().DownloadData(cRutaLogo); //System.IO.File.ReadAllBytes(cRutaLogo);
                            Image imgImagenLogo = Image.GetInstance(byteImagenLogo);
                            imgImagenLogo.ScalePercent(100f);
                            imgImagenLogo.ScaleAbsolute(140f, 80f);
                            celdaImagenLogo = new PdfPCell(imgImagenLogo, true);
                        }
                        catch (Exception ex)
                        {
                            celdaImagenLogo = new PdfPCell(new Phrase("")); ;
                            // :EDU REGISTRAR ERROR
                            //oPoService.errorAlExportarToPdf(ex);
                            //log.GrabarArchivoLog(ex);
                        }

                    }
                    else
                    {
                        celdaImagenLogo = new PdfPCell(new Paragraph(""));
                    }

                    celdaImagenLogo.Border = Rectangle.NO_BORDER;
                    celdaImagenLogo.FixedHeight = 80f;
                    tablaCaceberaLogo.AddCell(celdaImagenLogo);

                    // -- NUMERO POCLIENTE
                    string cadenaNumeroPoCliente = "Purchase Order \n Sample-" + numeroCodigoPoCliente;
                    PdfPCell celdaNumeroPoCliente = new PdfPCell(new Paragraph(cadenaNumeroPoCliente, MediumFontBold));
                    celdaNumeroPoCliente.Border = Rectangle.NO_BORDER;
                    celdaNumeroPoCliente.HorizontalAlignment = Rectangle.ALIGN_CENTER;
                    celdaNumeroPoCliente.VerticalAlignment = Rectangle.ALIGN_MIDDLE;
                    tablaCaceberaLogo.AddCell(celdaNumeroPoCliente);

                    // ---- FECHAS
                    // --fila 1
                    PdfPTable subTablaCabeceraLogo = new PdfPTable(2);
                    subTablaCabeceraLogo.SetWidths(new float[] { 30f, 30f });
                    //subTablaCabeceraLogo.DefaultCell.FixedHeight = 50f;

                    PdfPCell celdaSubTablaCabeceraLogo1 = new PdfPCell(new Paragraph("PO Date", SmallFontBoldWhite));
                    celdaSubTablaCabeceraLogo1.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                                                                                          //celdaSubTablaCabeceraLogo1.FixedHeight = 40f;
                    subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo1);

                    PdfPCell celdaSubTablaCabeceraLogo2 = new PdfPCell(new Paragraph(Convert.ToDateTime(po.FechaCreacion).ToString("MM-dd-yyyy"), SmallFont));
                    //celdaSubTablaCabeceraLogo2.FixedHeight = 40f;
                    subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo2);

                    // --fila 2
                    PdfPCell celdaSubTablaCabeceraLogo3 = new PdfPCell(new Paragraph("PO Issue Date", SmallFontBoldWhite));
                    //celdaSubTablaCabeceraLogo3.FixedHeight = 40f;
                    celdaSubTablaCabeceraLogo3.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                    subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo3);

                    PdfPCell celdaSubTablaCabeceraLogo4 = new PdfPCell(new Paragraph(Convert.ToDateTime(po.FechaActualizacion).ToString("MM-dd-yyyy"), SmallFont));
                    //celdaSubTablaCabeceraLogo4.FixedHeight = 40f;
                    subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo4);

                    // --fila 3
                    PdfPCell celdaSubTablaCabeceraLogo5 = new PdfPCell(new Paragraph("Rev. Date", SmallFontBoldWhite));
                    celdaSubTablaCabeceraLogo5.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                    subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo5);

                    PdfPCell celdaSubTablaCabeceraLogo6 = new PdfPCell(new Paragraph(Convert.ToDateTime(po.FechaActualizacion).ToString("MM-dd-yyyy"), SmallFont));
                    subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo6);

                    PdfPCell celdaTablaLogo = new PdfPCell(subTablaCabeceraLogo);
                    celdaTablaLogo.Border = Rectangle.NO_BORDER;
                    celdaTablaLogo.HorizontalAlignment = Rectangle.ALIGN_CENTER;
                    celdaTablaLogo.VerticalAlignment = Rectangle.ALIGN_MIDDLE;
                    celdaTablaLogo.FixedHeight = 20f;

                    tablaCaceberaLogo.AddCell(celdaTablaLogo);

                    document.Add(tablaCaceberaLogo);

                    document.Add(new Paragraph(" "));
                    #endregion

                    #region BLOQUE 2: SEGUNDA FILA TABLA: DIRECCION EMPRESA WTS / DATOS FACTORY / CLIENTE - TEMPORADA - DIVISION
                    // TABLA PRINCIPAL(0) PARA: DATOS DE EMPRESA, FACTORY
                    PdfPTable tablaPrincipal = new PdfPTable(3);
                    tablaPrincipal.WidthPercentage = 100;

                    tablaPrincipal.AddCell(DataBloque2_InformacionEmpresaWTS(jo_empresa, SmallFontBoldWhite, baseColorGencianPerlado, SmallFont));
                    tablaPrincipal.AddCell(DataBloque2_InformacionProveedor(jo_datosFabrica, SmallFontBoldWhite, baseColorGencianPerlado, SmallFont));
                    tablaPrincipal.AddCell(DataBloque2_InformacionCliente(jo_datosCliente, po.NumeroOrdenPedido, SmallFontBoldWhite, baseColorGencianPerlado, SmallFont));

                    document.Add(tablaPrincipal);
                    document.Add(new Paragraph(" "));
                    #endregion

                    #region BLOQUE 3 : TERCERA FILA : TOTAL / COSTO / TERMS DE LA PO
                    // TABLA PRINCIPAL(0) PARA: TOTAL / COSTO / TERMS DE LA PO
                    PdfPTable tablaBloque3_Total_Cantidad_Costo_Terms = new PdfPTable(3);
                    tablaBloque3_Total_Cantidad_Costo_Terms.WidthPercentage = 100;

                    //// ACA EL CONTENIDO
                    tablaBloque3_Total_Cantidad_Costo_Terms.AddCell(DataBloque3_TotalPoCantidad(po, SmallFontBoldWhite, baseColorGencianPerlado, SmallFont));
                    tablaBloque3_Total_Cantidad_Costo_Terms.AddCell(DataBloque3_TotalPoCosto(po, SmallFontBoldWhite, baseColorGencianPerlado, SmallFont));
                    tablaBloque3_Total_Cantidad_Costo_Terms.AddCell(DataBloque3_TotalPoTerms(po, SmallFontBoldWhite, baseColorGencianPerlado, SmallFont));

                    document.Add(tablaBloque3_Total_Cantidad_Costo_Terms);
                    #endregion

                    #region BLOQUE 4 : CUARTA FILA : DETALLE
                    ExportToPdf_DetallePOClienteEstilo(document, ListaRequerimientoMuestra, ListaOrdenPedidoDetalle, 
                        jo_datosCliente, po, MediumFontBold, SmallFont, SmallFontBold, SmallFontBoldWhite, 
                        baseColorGencianPerlado, SmallFontWhite);
                    #endregion

                    document.Close();
                    writer.Close();

                    bytes = ms.GetBuffer();
                }
            }
            catch (Exception ex)
            {
                string mierror = ex.ToString();
            }

            return File(bytes, "application/pdf", fileName + ".pdf");
        }

        public void ExportToPdf_DetallePOClienteEstilo(Document document,
            List<RequerimientoMuestraViewModels> listaRequerimientoMuestra,
            List<OrdenPedidoDetalleViewModels> listaOrdenPedidoDetalle,
            JObject jo_datosCliente, OrdenPedidoViewModels oOrdenPedido, 
            Font MediumFontBold, Font SmallFont, Font SmallFontBold, Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFontWhite)
        {
            document.Add(new Paragraph(" "));
            foreach (var itemRequerimiento in listaRequerimientoMuestra)
            {
                List<OrdenPedidoDetalleViewModels> listaReqMuestraByIdReq = listaOrdenPedidoDetalle.FindAll(x => x.IdRequerimiento == itemRequerimiento.IdRequerimiento);
                //// BLOQUE 1 : DATOS DEL ESTILO / TELA / DESTINO / IMAGE
                PdfPTable tablaPrincipalStyleImagen = new PdfPTable(2);  // TABLA 0
                tablaPrincipalStyleImagen.WidthPercentage = 100;
                //tablaPrincipalStyleImagen.SetWidthPercentage(new float[] { 90, 10 }, PageSize.A4);
                tablaPrincipalStyleImagen.SetWidths(new float[] { 50f, 10f });
                tablaPrincipalStyleImagen.DefaultCell.Border = Rectangle.NO_BORDER;

                // TABLA 1 : PARA EL CONTENIDO DE ESTILOS Y TELA
                PdfPTable subTablaAnidadaPrincipalStyleImagen = new PdfPTable(1);
                subTablaAnidadaPrincipalStyleImagen.WidthPercentage = 90;
                subTablaAnidadaPrincipalStyleImagen.DefaultCell.Border = Rectangle.NO_BORDER;

                subTablaAnidadaPrincipalStyleImagen.AddCell(DataBloque1Detalle_InformacionEstiloTela(itemRequerimiento, MediumFontBold, SmallFont, SmallFontBold, SmallFontBoldWhite, baseColorGencianPerlado, SmallFontWhite));
                subTablaAnidadaPrincipalStyleImagen.AddCell(DataBloque1Detalle_InformacionDestinoFechas(itemRequerimiento, jo_datosCliente, MediumFontBold, SmallFont, SmallFontBold, SmallFontBoldWhite, baseColorGencianPerlado, SmallFontWhite));

                //// COLUMNA 1 - DEL BLOQUE 1 DE IMAGEN
                tablaPrincipalStyleImagen.AddCell(subTablaAnidadaPrincipalStyleImagen);
                //// COLUMNA 2 - IMAGEN DEL ESTILO
                tablaPrincipalStyleImagen.AddCell(DataBloque1Detalle_ImagenEstilo(itemRequerimiento));

                document.Add(tablaPrincipalStyleImagen);

                //// BLOQUE 2 : DETALLE SAMPLE : COLOR / TALLA / TOTALES
                Font mediumFontoBold_Underline = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14, Font.UNDERLINE);
                document.Add(new Paragraph("ORDER DETAILS", MediumFontBold));
                document.Add(new Paragraph("Samples", mediumFontoBold_Underline));
                document.Add(new Paragraph(" "));
                document.Add(DataBloque2Detalle_OrdersDetails_Sample(listaReqMuestraByIdReq, SmallFontBoldWhite, baseColorGencianPerlado, SmallFont, SmallFontBold));

                //// BLOQUE 2 : DETALLE COUTER SAMPLE : COLOR / TALLA / TOTALES
                document.Add(new Paragraph("Counter Samples", mediumFontoBold_Underline));
                document.Add(new Paragraph(" "));
                document.Add(DataBloque2Detalle_OrdersDetails_CounterSample(listaReqMuestraByIdReq, SmallFontBoldWhite, baseColorGencianPerlado, SmallFont, SmallFontBold));

                // SECCION COMENTARIOS
                document.Add(new Paragraph(" "));  // SPACIO EN BLANCO
                document.Add(DataBloque3Detalle_Comentarios(itemRequerimiento, jo_datosCliente, oOrdenPedido, SmallFontBoldWhite, baseColorGencianPerlado, SmallFont));
                document.Add(new Paragraph(" "));  // SPACIO EN BLANCO
            }
        }

        private PdfPTable DataBloque3Detalle_Comentarios(RequerimientoMuestraViewModels oRequerimientoMuestra, 
            JObject jo_datosClienteJSON, OrdenPedidoViewModels oOrdenPedido, 
            Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFont)
        {
            
            PdfPTable tablaComentarios = new PdfPTable(2);
            tablaComentarios.SetWidths(new float[] { 10f, 30f });
            tablaComentarios.WidthPercentage = 100;

            //// 1
            #region SHIP TO
            string nombreCliente = jo_datosClienteJSON.GetValue("NombreCliente").ToString();
            JObject jo_direccionCompletaJSON = JObject.Parse(oRequerimientoMuestra.DatosClienteDireccionRequerimientoJSON) as JObject;
            string clienteDireccionCompleta = jo_direccionCompletaJSON.GetValue("DireccionCompleta_Linea1Linea2Linea3").ToString();

            PdfPCell tituloComentario1 = new PdfPCell(new Paragraph("Ship To", SmallFontBoldWhite));
            tituloComentario1.FixedHeight = 20f;
            tituloComentario1.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tablaComentarios.AddCell(tituloComentario1);

            PdfPCell valorComentario1 = new PdfPCell(new Paragraph(nombreCliente +"\n"+ clienteDireccionCompleta, SmallFont));
            valorComentario1.FixedHeight = 20f;
            tablaComentarios.AddCell(valorComentario1);
            #endregion
            //// 2
            #region SYTLE COMMENT
            PdfPCell tituloComentario2 = new PdfPCell(new Paragraph("Style Comment", SmallFontBoldWhite));
            tituloComentario2.FixedHeight = 20f;
            tituloComentario2.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tablaComentarios.AddCell(tituloComentario2);

            PdfPCell valorComentario2 = new PdfPCell(new Paragraph(" ", SmallFont));
            valorComentario2.FixedHeight = 20f;
            tablaComentarios.AddCell(valorComentario2);
            #endregion
            //// 3
            #region PO COMMENT
            PdfPCell tituloComentario3 = new PdfPCell(new Paragraph("Po Comment", SmallFontBoldWhite));
            tituloComentario3.FixedHeight = 20f;
            tituloComentario3.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tablaComentarios.AddCell(tituloComentario3);

            PdfPCell valorComentario3 = new PdfPCell(new Paragraph(oOrdenPedido.Comentario, SmallFont));
            valorComentario2.FixedHeight = 20f;
            tablaComentarios.AddCell(valorComentario3);
            #endregion
            //// 4
            #region PACKING INSTRUCTION
            PdfPCell tituloComentario4 = new PdfPCell(new Paragraph("Packing Instructions", SmallFontBoldWhite));
            tituloComentario4.FixedHeight = 20f;
            tituloComentario4.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tablaComentarios.AddCell(tituloComentario4);

            PdfPCell valorComentario4 = new PdfPCell(new Paragraph(" ", SmallFont));
            valorComentario4.FixedHeight = 20f;
            tablaComentarios.AddCell(valorComentario4);
            #endregion
            //// 5
            #region SHIPPING ALLOWANCE
            PdfPCell tituloComentario5 = new PdfPCell(new Paragraph("Shipping Allowance", SmallFontBoldWhite));
            tituloComentario5.FixedHeight = 20f;
            tituloComentario5.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tablaComentarios.AddCell(tituloComentario5);

            PdfPCell valorComentario5 = new PdfPCell(new Paragraph(" ", SmallFont));
            valorComentario5.FixedHeight = 20f;
            tablaComentarios.AddCell(valorComentario5);
            #endregion
            //// 6
            #region PENALTIES / CHGBK
            PdfPCell tituloComentario6 = new PdfPCell(new Paragraph("Penailties/Chgbk", SmallFontBoldWhite));
            tituloComentario6.FixedHeight = 20f;
            tituloComentario6.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tablaComentarios.AddCell(tituloComentario6);

            PdfPCell valorComentario6 = new PdfPCell(new Paragraph(" ", SmallFont));
            valorComentario6.FixedHeight = 20f;
            tablaComentarios.AddCell(valorComentario6);
            #endregion

            return tablaComentarios;
        }

        private PdfPTable DataBloque2Detalle_OrdersDetails_CounterSample(List<OrdenPedidoDetalleViewModels> listaOrdenPedidoDetalle,
            Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFont, Font SmallFontBold)
        {
            List<OrdenPedidoDetalleViewModels> listaIdClienteTalla = (from data in listaOrdenPedidoDetalle
                                                                      select new
                                                                      {
                                                                          IdClienteTalla = data.IdClienteTalla,
                                                                          NombreClienteTalla = data.NombreClienteTalla
                                                                      }).Distinct()
                                       .Select(x => new OrdenPedidoDetalleViewModels { IdClienteTalla = x.IdClienteTalla, NombreClienteTalla = x.NombreClienteTalla })
                                       .ToList();

            //// NOTA: SE AGRUPA HASTA NIVEL DE PRECIO PORQUE LOS PRECIOS ESTAN A NIVEL TALLA COLOR; 
            //// CADA COLOR X TALLA PUEDE QUE EL PRECIO SEA DIFERENTE; 
            //// PARA EL CASO QUE LA CONTRAMUESTRA NO SE FACTURA ENTONCES EL PRECIO POR DEFECTO SERA CERO
            List<OrdenPedidoDetalleViewModels> listaIdClienteColor = (from data in listaOrdenPedidoDetalle
                                                                      select new
                                                                      {
                                                                          IdClienteColor = data.IdClienteColor,
                                                                          NombreClienteColor = data.NombreClienteColor,
                                                                          EsContramuestraFacturableCliente = data.EsContramuestraFacturableCliente,
                                                                          PrecioContraMuestra = data.EsContramuestraFacturableCliente == 1 ? data.PrecioContraMuestra : 0
                                                                      }).Distinct()
                                                                      .Select(x => new OrdenPedidoDetalleViewModels { IdClienteColor = x.IdClienteColor, NombreClienteColor = x.NombreClienteColor, EsContramuestraFacturableCliente = x.EsContramuestraFacturableCliente, PrecioContraMuestra = x.PrecioContraMuestra })
                                                                      .ToList();


            int totalColumnasDinamicas = listaIdClienteTalla.Count();
            int totalColumnasFijas = 4;
            int totalColumnasAGenerar = totalColumnasFijas + totalColumnasDinamicas;

            //// TABLA PRINCIPAL DEL DETALLE DE LA ORDEN
            PdfPTable tablaPrincipalOrderDetails = new PdfPTable(totalColumnasAGenerar);
            tablaPrincipalOrderDetails.WidthPercentage = 100;
            SetearAnchoColumnasDinamicas(tablaPrincipalOrderDetails, totalColumnasDinamicas, totalColumnasFijas);
            Cabecera_OrdersDetails_Sample(listaIdClienteTalla, tablaPrincipalOrderDetails, SmallFontBoldWhite, baseColorGencianPerlado);
            Contenido_OrdersDetails_CounterSample(listaIdClienteColor, listaIdClienteTalla, listaOrdenPedidoDetalle, tablaPrincipalOrderDetails, totalColumnasDinamicas, SmallFont, SmallFontBold);

            return tablaPrincipalOrderDetails;
        }

        private PdfPTable DataBloque2Detalle_OrdersDetails_Sample(List<OrdenPedidoDetalleViewModels> listaOrdenPedidoDetalle,
            Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFont, Font SmallFontBold)
        {
            List<OrdenPedidoDetalleViewModels> listaIdClienteTalla = (from data in listaOrdenPedidoDetalle
                                       select new
                                       {
                                           IdClienteTalla = data.IdClienteTalla,
                                           NombreClienteTalla = data.NombreClienteTalla
                                       }).Distinct()
                                       .Select(x => new OrdenPedidoDetalleViewModels { IdClienteTalla = x.IdClienteTalla, NombreClienteTalla = x.NombreClienteTalla })
                                       .ToList();

            //// NOTA: SE AGRUPA HASTA NIVEL DE PRECIO PORQUE LOS PRECIOS ESTAN A NIVEL TALLA COLOR; 
            //// CADA COLOR X TALLA PUEDE QUE EL PRECIO SEA DIFERENTE
            List<OrdenPedidoDetalleViewModels> listaIdClienteColor = (from data in listaOrdenPedidoDetalle
                                       select new 
                                       {
                                           IdClienteColor = data.IdClienteColor,
                                           NombreClienteColor = data.NombreClienteColor,
                                           PrecioMuestra = data.PrecioMuestra
                                       }).Distinct()
                                       .Select(x => new OrdenPedidoDetalleViewModels { IdClienteColor = x.IdClienteColor, NombreClienteColor = x.NombreClienteColor, PrecioMuestra = x.PrecioMuestra })
                                       .ToList();

            
            int totalColumnasDinamicas = listaIdClienteTalla.Count();
            int totalColumnasFijas = 4;
            int totalColumnasAGenerar = totalColumnasFijas + totalColumnasDinamicas;

            //// TABLA PRINCIPAL DEL DETALLE DE LA ORDEN
            PdfPTable tablaPrincipalOrderDetails = new PdfPTable(totalColumnasAGenerar);
            tablaPrincipalOrderDetails.WidthPercentage = 100;
            SetearAnchoColumnasDinamicas(tablaPrincipalOrderDetails, totalColumnasDinamicas, totalColumnasFijas);
            Cabecera_OrdersDetails_Sample(listaIdClienteTalla, tablaPrincipalOrderDetails, SmallFontBoldWhite, baseColorGencianPerlado);
            Contenido_OrdersDetails_Sample(listaIdClienteColor, listaIdClienteTalla, listaOrdenPedidoDetalle, tablaPrincipalOrderDetails, totalColumnasDinamicas, SmallFont, SmallFontBold);

            return tablaPrincipalOrderDetails;
        }

        private void SetearAnchoColumnasDinamicas(PdfPTable tablaPrincipalOrderDetails, int totalColumnasDinamicas, int totalColumnasFijas)
        {
            int totalColumnas = totalColumnasDinamicas + totalColumnasFijas;
            float[] columnWidths = new float[totalColumnas];
            //// COLUMNAS DINAMICAS
            for (int i = 1; i <= totalColumnasDinamicas; i++)
            {
                columnWidths[i] = 10f;
            }

            for (int v = 0; v < totalColumnas; v++)
            {
                if (v == 0)
                { //// COLUMNA COLOR
                    columnWidths[v] = 30f;
                }
                else if (v > totalColumnasDinamicas)
                { //// COLUMNAS TOTALES
                    columnWidths[v] = 20f;
                }
                                
            }

            tablaPrincipalOrderDetails.SetWidths(columnWidths);
        }

        private void Contenido_OrdersDetails_Sample(List<OrdenPedidoDetalleViewModels> listaColores, 
            List<OrdenPedidoDetalleViewModels> listaTallas, List<OrdenPedidoDetalleViewModels> listaReqMuestra,
            PdfPTable tablaPrincipalOrderDetails, int totalColumnasDinamicas,
            Font SmallFont, Font SmallFontBold)
        {
            int totalCantidad = 0;
            int totalGeneralCantidad = 0;
            decimal totalGeneralCosto = 0;
            foreach (var itemClienteColor in listaColores)
            {
                PdfPCell newColumnClienteColor1 = new PdfPCell(new Phrase(itemClienteColor.NombreClienteColor, SmallFont));
                tablaPrincipalOrderDetails.AddCell(newColumnClienteColor1);

                // COLUMNAS DINAMICAS TALLAS
                foreach (var itemColumnasClienteTalla in listaTallas)
                {
                    var dataTalla = listaReqMuestra.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor && x.IdClienteTalla == itemColumnasClienteTalla.IdClienteTalla && x.PrecioMuestra == itemClienteColor.PrecioMuestra).ToList().FirstOrDefault();
                    string stringCantidadColorTalla = "0";
                    if (dataTalla != null)
                    {
                        stringCantidadColorTalla = dataTalla.CantidadMuestraFacturable.ToString();
                    }

                    PdfPCell newColumnTalla = new PdfPCell(new Phrase(stringCantidadColorTalla, SmallFont));
                    newColumnTalla.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                    tablaPrincipalOrderDetails.AddCell(newColumnTalla);
                }

                totalCantidad = listaReqMuestra.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor && x.PrecioMuestra == itemClienteColor.PrecioMuestra).Sum(y => y.CantidadMuestraFacturable);
                totalGeneralCantidad += totalCantidad;
                PdfPCell newColumnClienteColor2 = new PdfPCell(new Phrase(totalCantidad.ToString(), SmallFont));
                newColumnClienteColor2.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                tablaPrincipalOrderDetails.AddCell(newColumnClienteColor2);

                decimal precioFabrica = itemClienteColor.PrecioMuestra; //listaReqMuestra.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor).FirstOrDefault().PrecioMuestra;
                PdfPCell newColumnClienteColor3 = new PdfPCell(new Phrase("USD " + precioFabrica.ToString("##,###0.000"), SmallFont));
                newColumnClienteColor3.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                tablaPrincipalOrderDetails.AddCell(newColumnClienteColor3);

                decimal totalCosto = totalCantidad * precioFabrica;
                totalGeneralCosto += totalCosto;
                PdfPCell newColumnClienteColor4 = new PdfPCell(new Phrase("USD " + totalCosto.ToString("##,###0.000"), SmallFont));
                newColumnClienteColor4.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                tablaPrincipalOrderDetails.AddCell(newColumnClienteColor4);
            }

            // PARA LOS TOTALES GENERALES
            PdfPCell newColumnClienteColor5 = new PdfPCell(new Phrase("Total", SmallFontBold));
            newColumnClienteColor5.Colspan = totalColumnasDinamicas + 1;
            newColumnClienteColor5.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tablaPrincipalOrderDetails.AddCell(newColumnClienteColor5);

            PdfPCell newColumnClienteColor6 = new PdfPCell(new Phrase(totalGeneralCantidad.ToString(), SmallFont));
            newColumnClienteColor6.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tablaPrincipalOrderDetails.AddCell(newColumnClienteColor6);

            PdfPCell newColumnClienteColor7 = new PdfPCell(new Phrase("Grand Total", SmallFontBold));
            newColumnClienteColor7.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tablaPrincipalOrderDetails.AddCell(newColumnClienteColor7);

            PdfPCell newColumnClienteColor8 = new PdfPCell(new Phrase("USD " + totalGeneralCosto.ToString("##,###0.000"), SmallFont));
            newColumnClienteColor8.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tablaPrincipalOrderDetails.AddCell(newColumnClienteColor8);
        }

        private void Contenido_OrdersDetails_CounterSample(List<OrdenPedidoDetalleViewModels> listaColores,
            List<OrdenPedidoDetalleViewModels> listaTallas, List<OrdenPedidoDetalleViewModels> listaReqMuestra,
            PdfPTable tablaPrincipalOrderDetails, int totalColumnasDinamicas,
            Font SmallFont, Font SmallFontBold)
        {
            int totalCantidad = 0;
            int totalGeneralCantidad = 0;
            decimal totalGeneralCosto = 0;
            foreach (var itemClienteColor in listaColores)
            {
                PdfPCell newColumnClienteColor1 = new PdfPCell(new Phrase(itemClienteColor.NombreClienteColor, SmallFont));
                tablaPrincipalOrderDetails.AddCell(newColumnClienteColor1);

                // COLUMNAS DINAMICAS TALLAS
                foreach (var itemColumnasClienteTalla in listaTallas)
                {
                    OrdenPedidoDetalleViewModels dataTalla = new OrdenPedidoDetalleViewModels();
                    if (itemClienteColor.EsContramuestraFacturableCliente == 0)
                    { //// SI NO SE FACTURA LA CONTRAMUESTRA SOLO NECESITO SABER QUE SEA EsContramuestraFacturableCliente = 0
                        dataTalla = listaReqMuestra.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor && x.IdClienteTalla == itemColumnasClienteTalla.IdClienteTalla && x.EsContramuestraFacturableCliente == itemClienteColor.EsContramuestraFacturableCliente).ToList().FirstOrDefault();
                    } else
                    { //// SI SE FACTURA INTERESA SABER EL PRECIO
                        dataTalla = listaReqMuestra.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor && x.IdClienteTalla == itemColumnasClienteTalla.IdClienteTalla && x.EsContramuestraFacturableCliente == itemClienteColor.EsContramuestraFacturableCliente && x.PrecioContraMuestra == itemClienteColor.PrecioContraMuestra).ToList().FirstOrDefault();
                    }
                        
                    string stringCantidadColorTalla = "0";
                    if (dataTalla != null)
                    {
                        stringCantidadColorTalla = dataTalla.CantidadContraMuestraFacturable.ToString();
                    }

                    PdfPCell newColumnTalla = new PdfPCell(new Phrase(stringCantidadColorTalla, SmallFont));
                    newColumnTalla.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                    tablaPrincipalOrderDetails.AddCell(newColumnTalla);
                }

                //totalCantidad = listaReqMuestra.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor).Sum(y => y.CantidadContraMuestraFacturable);

                if (itemClienteColor.EsContramuestraFacturableCliente == 0)
                {
                    totalCantidad = listaReqMuestra.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor && x.EsContramuestraFacturableCliente == itemClienteColor.EsContramuestraFacturableCliente).Sum(y => y.CantidadContraMuestraFacturable);
                } else
                {
                    totalCantidad = listaReqMuestra.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor && x.EsContramuestraFacturableCliente == itemClienteColor.EsContramuestraFacturableCliente && x.PrecioContraMuestra == itemClienteColor.PrecioContraMuestra).Sum(y => y.CantidadContraMuestraFacturable);
                }

                totalGeneralCantidad += totalCantidad;
                PdfPCell newColumnClienteColor2 = new PdfPCell(new Phrase(totalCantidad.ToString(), SmallFont));
                newColumnClienteColor2.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                tablaPrincipalOrderDetails.AddCell(newColumnClienteColor2);

                decimal precioFabrica = itemClienteColor.PrecioContraMuestra; //listaReqMuestra.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor).FirstOrDefault().PrecioContraMuestra;
                int esContramuestraFacturable = listaReqMuestra.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor).FirstOrDefault().EsContramuestraFacturableCliente;
                if (esContramuestraFacturable == 0) {
                    precioFabrica = 0;
                };
                PdfPCell newColumnClienteColor3 = new PdfPCell(new Phrase("USD " + precioFabrica.ToString("##,###0.000"), SmallFont));
                newColumnClienteColor3.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                tablaPrincipalOrderDetails.AddCell(newColumnClienteColor3);

                decimal totalCosto = totalCantidad * precioFabrica;
                totalGeneralCosto += totalCosto;
                PdfPCell newColumnClienteColor4 = new PdfPCell(new Phrase("USD " + totalCosto.ToString("##,###0.000"), SmallFont));
                newColumnClienteColor4.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                tablaPrincipalOrderDetails.AddCell(newColumnClienteColor4);
            }

            // PARA LOS TOTALES GENERALES
            PdfPCell newColumnClienteColor5 = new PdfPCell(new Phrase("Total", SmallFontBold));
            newColumnClienteColor5.Colspan = totalColumnasDinamicas + 1;
            newColumnClienteColor5.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tablaPrincipalOrderDetails.AddCell(newColumnClienteColor5);

            PdfPCell newColumnClienteColor6 = new PdfPCell(new Phrase(totalGeneralCantidad.ToString(), SmallFont));
            newColumnClienteColor6.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tablaPrincipalOrderDetails.AddCell(newColumnClienteColor6);

            PdfPCell newColumnClienteColor7 = new PdfPCell(new Phrase("Grand Total", SmallFontBold));
            newColumnClienteColor7.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tablaPrincipalOrderDetails.AddCell(newColumnClienteColor7);

            PdfPCell newColumnClienteColor8 = new PdfPCell(new Phrase("USD " + totalGeneralCosto.ToString("##,###0.000"), SmallFont));
            newColumnClienteColor8.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tablaPrincipalOrderDetails.AddCell(newColumnClienteColor8);
        }

        private void Cabecera_OrdersDetails_Sample(List<OrdenPedidoDetalleViewModels> listaTallas, PdfPTable tablaPrincipalOrderDetails, Font SmallFontBoldWhite,
            BaseColor baseColorGencianPerlado)
        {
            //// COLOR
            PdfPCell headerOrderDetails1 = new PdfPCell(new Phrase("Color", SmallFontBoldWhite));
            headerOrderDetails1.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tablaPrincipalOrderDetails.AddCell(headerOrderDetails1);

            // bucle para generar las columnas dinamicas
            //// TALLAS
            foreach (var itemColumnasClienteTalla in listaTallas)
            {
                PdfPCell headerOrderDetailsTallas = new PdfPCell(new Phrase(itemColumnasClienteTalla.NombreClienteTalla.ToUpper(), SmallFontBoldWhite));
                headerOrderDetailsTallas.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                headerOrderDetailsTallas.HorizontalAlignment = Rectangle.ALIGN_CENTER;
                tablaPrincipalOrderDetails.AddCell(headerOrderDetailsTallas);
            }
            //// TOTALES
            PdfPCell headerOrderDetailsTallas2 = new PdfPCell(new Phrase("Total Units", SmallFontBoldWhite));
            headerOrderDetailsTallas2.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tablaPrincipalOrderDetails.AddCell(headerOrderDetailsTallas2);

            PdfPCell headerOrderDetailsTallas3 = new PdfPCell(new Phrase("Unit Cost", SmallFontBoldWhite));
            headerOrderDetailsTallas3.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tablaPrincipalOrderDetails.AddCell(headerOrderDetailsTallas3);

            PdfPCell headerOrderDetailsTallas4 = new PdfPCell(new Phrase("Total Cost", SmallFontBoldWhite));
            headerOrderDetailsTallas4.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tablaPrincipalOrderDetails.AddCell(headerOrderDetailsTallas4);
        }

        private PdfPCell DataBloque1Detalle_ImagenEstilo(RequerimientoMuestraViewModels oRequerimientoMuestra)
        {
            // PARA LA FOTO
            //string urlFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            JObject jo_datosEstilo = JObject.Parse(oRequerimientoMuestra.DatosEstiloJSON) as JObject;
            string cFolderOriginal = string.Empty;
            PdfPCell celdaImagen = new PdfPCell();
            if (jo_datosEstilo.GetValue("ImagenNombre").ToString() != string.Empty)
            {
                cFolderOriginal = ConfigurationManager.AppSettings["urlimagesstyle"].ToString() + jo_datosEstilo.GetValue("ImagenNombre").ToString(); //System.Web.HttpContext.Current.Server.MapPath("~/images/style/original/" + itemPoClienteEstilo.ImagenNombre); // 2017072709062972.jpg //HttpContext.Current.Server.MapPath("~/images/style/original/2017072709062972.jpg");
                try
                {
                    byte[] miFoto = new System.Net.WebClient().DownloadData(cFolderOriginal); //System.IO.File.ReadAllBytes(@cFolderOriginal);
                    Image miImagen = Image.GetInstance(miFoto);
                    miImagen.ScalePercent(50f);
                    miImagen.ScaleAbsolute(80f, 80f);

                    celdaImagen = new PdfPCell(miImagen, true); //miImagen false
                }
                catch (Exception ex)
                {
                    celdaImagen = new PdfPCell(new Phrase(""));
                    //oPoService.errorAlExportarToPdf(ex);
                    //log.GrabarArchivoLog(ex);
                }

            }
            else
            {
                //celdaImagen = new PdfPCell(new Phrase(""));
                cFolderOriginal = System.Web.HttpContext.Current.Server.MapPath("~/Content/img/sinimagen.jpg");
                byte[] byteSinimagen = new System.Net.WebClient().DownloadData(cFolderOriginal); //System.IO.File.ReadAllBytes(@cFolderOriginal);
                Image imgSinImagen = Image.GetInstance(byteSinimagen);
                imgSinImagen.ScalePercent(50f);
                imgSinImagen.ScaleAbsolute(80f, 80f);

                celdaImagen = new PdfPCell(imgSinImagen, true); //miImagen false
            }

            celdaImagen.Border = Rectangle.NO_BORDER;
            celdaImagen.HorizontalAlignment = Element.ALIGN_CENTER;
            celdaImagen.VerticalAlignment = Element.ALIGN_MIDDLE;
            celdaImagen.Padding = iTextSharp.text.Utilities.MillimetersToPoints(3);
            celdaImagen.FixedHeight = 40f;

            return celdaImagen;
        }

        private PdfPTable DataBloque1Detalle_InformacionEstiloTela(RequerimientoMuestraViewModels oRequerimientoMuestra,
            Font MediumFontBold, Font SmallFont, Font SmallFontBold, Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFontWhite)
        {
            JObject jo_datosEstiloJSON = JObject.Parse(oRequerimientoMuestra.DatosEstiloJSON) as JObject;

            // TABLA 1.1
            PdfPTable subTableStyleImagen1 = new PdfPTable(1);
            subTableStyleImagen1.WidthPercentage = 90;
            // FILA 1
            PdfPCell headerStyleImagen1 = new PdfPCell(new Phrase("Style - " + jo_datosEstiloJSON.GetValue("CodigoEstilo").ToString(), MediumFontBold));
            headerStyleImagen1.Border = iTextSharp.text.Rectangle.NO_BORDER;
            subTableStyleImagen1.AddCell(headerStyleImagen1);
            // FILA 2
            PdfPCell headerStyleImagen2 = new PdfPCell(new Phrase(jo_datosEstiloJSON.GetValue("DescripcionEstilo").ToString(), SmallFont));
            headerStyleImagen2.Border = iTextSharp.text.Rectangle.NO_BORDER;
            subTableStyleImagen1.AddCell(headerStyleImagen2);
            // FILA 3
            PdfPCell headerStyleImagen3 = new PdfPCell(new Phrase("Technical Fabric: " + jo_datosEstiloJSON.GetValue("CodigoTela").ToString(), SmallFont));
            headerStyleImagen3.Border = iTextSharp.text.Rectangle.NO_BORDER;
            subTableStyleImagen1.AddCell(headerStyleImagen3);
            // FILA 4
            PdfPCell headerStyleImagen4 = new PdfPCell(new Phrase("Comercial Fabric: " + jo_datosEstiloJSON.GetValue("NombreTela").ToString(), SmallFont));
            headerStyleImagen4.Border = iTextSharp.text.Rectangle.NO_BORDER;
            subTableStyleImagen1.AddCell(headerStyleImagen4);

            return subTableStyleImagen1;
        }

        private PdfPTable DataBloque1Detalle_InformacionDestinoFechas(RequerimientoMuestraViewModels oRequerimientoMuestra,
            JObject jo_datosCliente,
            Font MediumFontBold, Font SmallFont, Font SmallFontBold, Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFontWhite)
        {
            // TABLA 1.2 / GENERAR ESTA TABLA EN UN BUCLE
            PdfPTable subTableStyleImagen2 = new PdfPTable(4);
            subTableStyleImagen2.SetWidths(new float[] { 40f, 10f, 10f, 10f });
            subTableStyleImagen2.WidthPercentage = 90;

            // FILA 1 - CABECERA
            //// COLUMNA 1
            PdfPCell headerSubTablaStyleImagen1 = new PdfPCell(new Phrase("Destination", SmallFontBoldWhite));
            headerSubTablaStyleImagen1.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            subTableStyleImagen2.AddCell(headerSubTablaStyleImagen1);
            //// COLUMNA 2
            PdfPCell headerSubTablaStyleImagen2 = new PdfPCell(new Phrase("Ex fty Date", SmallFontBoldWhite));
            headerSubTablaStyleImagen2.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            subTableStyleImagen2.AddCell(headerSubTablaStyleImagen2);
            //// COLUMNA 3
            PdfPCell headerSubTablaStyleImagen3 = new PdfPCell(new Phrase("Cancel Date", SmallFontBoldWhite));
            headerSubTablaStyleImagen3.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            subTableStyleImagen2.AddCell(headerSubTablaStyleImagen3);
            //// COLUMNA 4
            PdfPCell headerSubTablaStyleImagen4 = new PdfPCell(new Phrase("VIA", SmallFontBoldWhite));
            headerSubTablaStyleImagen4.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            subTableStyleImagen2.AddCell(headerSubTablaStyleImagen4);

            //// CONTENIDO DE LA TABLA 
            // FILA 2 - CUERPO
            //// COLUMNA 1
            PdfPCell newColumnSubTablaStyleImagen1 = new PdfPCell(new Phrase(jo_datosCliente.GetValue("Destino").ToString(), SmallFont));
            subTableStyleImagen2.AddCell(newColumnSubTablaStyleImagen1);
            //// COLUMNA 2
            PdfPCell newColumnSubTablaStyleImagen2 = new PdfPCell(new Phrase(oRequerimientoMuestra.Cadena_ExFactoryUpdate, SmallFont));
            subTableStyleImagen2.AddCell(newColumnSubTablaStyleImagen2);
            //// COLUMNA 3
            PdfPCell newColumnSubTablaStyleImagen3 = new PdfPCell(new Phrase(oRequerimientoMuestra.Cadena_FechaInDC, SmallFont));
            subTableStyleImagen2.AddCell(newColumnSubTablaStyleImagen3);
            //// COLUMNA 4
            PdfPCell newColumnSubTablaStyleImagen4 = new PdfPCell(new Phrase(jo_datosCliente.GetValue("Via").ToString(), SmallFont));
            subTableStyleImagen2.AddCell(newColumnSubTablaStyleImagen4);

            return subTableStyleImagen2;
        }

        private PdfPCell DataBloque2_InformacionEmpresaWTS(JObject jo_empresaJSON, Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFont)
        {
            PdfPTable tableContent = new PdfPTable(1);
            tableContent.WidthPercentage = 40;
            tableContent.HorizontalAlignment = Element.ALIGN_RIGHT;

            //// CABECERA
            PdfPCell header = new PdfPCell(new Phrase(" ", SmallFontBoldWhite));
            header.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tableContent.AddCell(header);

            //// CONTENIDO DE LA TABLA
            PdfPCell cellDataEmpresa = new PdfPCell(new Phrase(jo_empresaJSON.GetValue("NombreLargo").ToString() + "\n \n" + jo_empresaJSON.GetValue("Direccion").ToString(), SmallFont));
            cellDataEmpresa.FixedHeight = 50f;
            tableContent.AddCell(cellDataEmpresa);

            PdfPCell celdaContendoraPrincipal = new PdfPCell(tableContent);
            return celdaContendoraPrincipal;
        }

        private PdfPCell DataBloque2_InformacionProveedor(JObject jo_proveedorJSON, Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFont)
        {
            PdfPTable tableContent = new PdfPTable(1);
            tableContent.WidthPercentage = 40;
            tableContent.HorizontalAlignment = Element.ALIGN_RIGHT;

            //// CABECERA
            PdfPCell header = new PdfPCell(new Phrase("Factory", SmallFontBoldWhite));
            header.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tableContent.AddCell(header);

            //// CONTENIDO DE LA TABLA
            PdfPTable tablaAnidada = new PdfPTable(2);  //// SUBTITULO: DATO
            tablaAnidada.SetWidths(new float[] { 10f, 30f });
            // PARA LA FILA 1; ANIDADA : NOMBRE DE LA FABRICA
            //// FILA 1
            //// SUBTITULO
            PdfPCell cellSubTitulo1 = new PdfPCell(new Phrase("Factory", SmallFont));
            cellSubTitulo1.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellSubTitulo1);
            //// VALOR
            PdfPCell cellDato1 = new PdfPCell(new Phrase(jo_proveedorJSON.GetValue("NombreProveedor").ToString(), SmallFont));
            cellDato1.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellDato1);

            //// FILA 2 : DIRECCION
            //// SUBTITULO
            PdfPCell cellSubTitulo2 = new PdfPCell(new Phrase("Address:", SmallFont));
            cellSubTitulo2.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellSubTitulo2);
            //// VALOR
            PdfPCell cellDato2 = new PdfPCell(new Phrase(jo_proveedorJSON.GetValue("Direccion").ToString(), SmallFont));
            cellDato2.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellDato2);

            //// FILA 3 : TELEFONO
            //// SUBTITULO
            PdfPCell cellSubTitulo3 = new PdfPCell(new Phrase("Telephone:", SmallFont));
            cellSubTitulo3.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellSubTitulo3);
            //// VALOR
            PdfPCell cellDato3 = new PdfPCell(new Phrase(jo_proveedorJSON.GetValue("Telefono").ToString(), SmallFont));
            cellDato3.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellDato3);

            // AGREGAR LA TABLA ANAIDADA
            PdfPCell celdaContendora_InfoProveedor = new PdfPCell(tablaAnidada);
            tableContent.AddCell(celdaContendora_InfoProveedor);

            PdfPCell celdaContendoraPrincipal = new PdfPCell(tableContent);
            return celdaContendoraPrincipal;
        }

        private PdfPCell DataBloque2_InformacionCliente(JObject jo_clienteJSON, string numeroOrdenPedido, Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFont)
        {
            PdfPTable tableContent = new PdfPTable(1);
            tableContent.WidthPercentage = 40;
            tableContent.HorizontalAlignment = Element.ALIGN_RIGHT;

            //// CABECERA
            PdfPCell header = new PdfPCell(new Phrase("Final Destination", SmallFontBoldWhite));
            header.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tableContent.AddCell(header);

            //// CONTENIDO DE LA TABLA
            PdfPTable tablaAnidada = new PdfPTable(2);  //// SUBTITULO: DATO
            tablaAnidada.SetWidths(new float[] { 10f, 30f });
            // PARA LA FILA 1; ANIDADA : NOMBRE DEL CLIENTE
            //// FILA 1
            //// SUBTITULO
            PdfPCell cellSubTitulo1 = new PdfPCell(new Phrase(" ", SmallFont));
            cellSubTitulo1.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellSubTitulo1);
            //// VALOR
            PdfPCell cellDato1 = new PdfPCell(new Phrase(jo_clienteJSON.GetValue("NombreCliente").ToString(), SmallFont));
            cellDato1.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellDato1);

            //// FILA 2 : TEMPORADA
            //// SUBTITULO
            PdfPCell cellSubTitulo2 = new PdfPCell(new Phrase("Season:", SmallFont));
            cellSubTitulo2.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellSubTitulo2);
            //// VALOR
            PdfPCell cellDato2 = new PdfPCell(new Phrase(jo_clienteJSON.GetValue("CodigoClienteTemporada").ToString(), SmallFont));
            cellDato2.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellDato2);

            //// FILA 3 : DIVISION
            //// SUBTITULO
            PdfPCell cellSubTitulo3 = new PdfPCell(new Phrase("Division:", SmallFont));
            cellSubTitulo3.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellSubTitulo3);
            //// VALOR
            PdfPCell cellDato3 = new PdfPCell(new Phrase(jo_clienteJSON.GetValue("NombreDivision").ToString(), SmallFont));
            cellDato3.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellDato3);

            //// FILA 4 : PO CLIENTE
            //// SUBTITULO
            PdfPCell cellSubTitulo4 = new PdfPCell(new Phrase("PO Client:", SmallFont));
            cellSubTitulo4.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellSubTitulo4);
            //// VALOR
            PdfPCell cellDato4 = new PdfPCell(new Phrase(numeroOrdenPedido, SmallFont));
            cellDato4.Border = iTextSharp.text.Rectangle.NO_BORDER;
            tablaAnidada.AddCell(cellDato4);

            // AGREGAR LA TABLA ANAIDADA
            PdfPCell celdaContendora_InfoCliente = new PdfPCell(tablaAnidada);
            tableContent.AddCell(celdaContendora_InfoCliente);

            PdfPCell celdaContendoraPrincipal = new PdfPCell(tableContent);
            return celdaContendoraPrincipal;
        }

        //// PARA EL BLOQUE 3
        private PdfPCell DataBloque3_TotalPoCantidad(OrdenPedidoViewModels po, Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFont)
        {
            PdfPTable tableContent = new PdfPTable(1);
            tableContent.WidthPercentage = 40;
            tableContent.HorizontalAlignment = Element.ALIGN_RIGHT;

            //// CABECERA
            PdfPCell header = new PdfPCell(new Phrase("Total PO Quantity", SmallFontBoldWhite));
            header.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tableContent.AddCell(header);

            //// CONTENIDO
            PdfPCell cellContenido = new PdfPCell(new Phrase(po.TotalPOCantidad.ToString(), SmallFont));
            cellContenido.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tableContent.AddCell(cellContenido);

            PdfPCell celdaContendoraPrincipal = new PdfPCell(tableContent);
            return celdaContendoraPrincipal;
        }

        private PdfPCell DataBloque3_TotalPoCosto(OrdenPedidoViewModels po, Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFont)
        {
            PdfPTable tableContent = new PdfPTable(1);
            tableContent.WidthPercentage = 40;
            tableContent.HorizontalAlignment = Element.ALIGN_RIGHT;

            //// CABECERA
            PdfPCell header = new PdfPCell(new Phrase("Total PO Cost", SmallFontBoldWhite));
            header.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tableContent.AddCell(header);

            //// CONTENIDO
            PdfPCell cellContenido = new PdfPCell(new Phrase("USD " + po.TotalPOCosto_Cadena, SmallFont));
            cellContenido.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tableContent.AddCell(cellContenido);

            PdfPCell celdaContendoraPrincipal = new PdfPCell(tableContent);
            return celdaContendoraPrincipal;
        }

        private PdfPCell DataBloque3_TotalPoTerms(OrdenPedidoViewModels po, Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFont)
        {
            PdfPTable tableContent = new PdfPTable(1);
            tableContent.WidthPercentage = 40;
            tableContent.HorizontalAlignment = Element.ALIGN_RIGHT;

            //// CABECERA
            PdfPCell header = new PdfPCell(new Phrase("TERMS", SmallFontBoldWhite));
            header.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
            tableContent.AddCell(header);

            //// CONTENIDO
            PdfPCell cellContenido = new PdfPCell(new Phrase(po.Terms, SmallFont));
            cellContenido.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
            tableContent.AddCell(cellContenido);

            PdfPCell celdaContendoraPrincipal = new PdfPCell(tableContent);
            return celdaContendoraPrincipal;
        }
    }
}