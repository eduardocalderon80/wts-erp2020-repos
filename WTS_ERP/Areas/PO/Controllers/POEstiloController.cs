using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using Newtonsoft.Json.Linq;
using BL_ERP;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using BE_ERP;
using BE_ERP;
using System.Configuration;

namespace WTS_ERP.Areas.PO.Controllers
{
    public class POEstiloController : Controller
    {
        blLog log = new blLog();
        public POEstiloController()
        {

        }
        // GET: POEstilo/POEstilo
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult addPOEstilo()
        {
            return View();
        }
        
        public ActionResult _BuscarEstilo()
        {
            return PartialView();
        }
        
        public ActionResult _TallaColor()
        {
            return PartialView();
        }


        public ActionResult _ConsumirBuy()
        {
            return PartialView();
        }

        public string getData_ClienteProveedor()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            //_.GetUsuario().IdUsuario.ToString()
            string data = oMantenimiento.get_Data("uspGetListaCliente_Proveedor_forEstilo", par, true, Util.ERP);//reemplazar .codUsuario=> por IdGrupo :PENDIENTE
            return data != null ? data : string.Empty;
        }

        public string getData_Productos()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("uspbuscarestilosfiltros_toJson", _.Get("par"), false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string getData_byCliente()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("uspGetDatosxCliente", _.Get("par"), true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string getData_byPOProducto()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("uspGetPoByPOEstilo", _.Get("par"), true, Util.ERP);
            return data != null ? data : string.Empty;
        }


        public string Save_POProducto_new()
        {
            string par = _.Post("par");

            par =_.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());

            string parDetail = _.Post("parDetail");
            string parSubDetail = _.Post("parSubDetail");
            string parFoot = _.Post("parFoot");
            string parSubFoot = _.Post("parSubFoot");

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("uspGrabarPoNewcliente_Estilo", par, Util.ERP, parDetail, parSubDetail, parFoot, parSubFoot);
            string mensaje = _.Mensaje("new", id > 0, oMantenimiento.get_Data("uspGetPoByidpo_estilo", id.ToString(), true, Util.ERP), id);
            return mensaje;
        }


        /*Index*/
        public string getData_byParamaters()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            string data = oMantenimiento.get_Data("uspGetPoEstilobyFiltroindex_tojson", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string save_PoProudcto_update()
        {
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());

            string parDetail = _.Post("parDetail");
            string parSubDetail = _.Post("parSubDetail");
            string parFoot = _.Post("parFoot");
            string parSubFoot = _.Post("parSubFoot");

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("uspeditarpo_item_estilo", par, Util.ERP, parDetail, parSubDetail, parFoot, parSubFoot);
            string mensaje = _.Mensaje("edit", id > 0, oMantenimiento.get_Data("uspGetPobyidpo_estilo", id.ToString(), true, Util.ERP));
            return mensaje;
        }

        public string save_PoProducto_Add()
        {
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());

            string parDetail = _.Post("parDetail");
            string parSubDetail = _.Post("parSubDetail");
            string parFoot = _.Post("parFoot");
            string parSubFoot = _.Post("parSubFoot");

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("uspaddpo_item_estilo", par, Util.ERP, parDetail, parSubDetail, parFoot, parSubFoot);
            string mensaje = _.Mensaje("add", id > 0, oMantenimiento.get_Data("uspGetPobyidpo_estilo", id.ToString(), true, Util.ERP));
            return mensaje;
        }

        public string getData_forEdit()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("uspGetPobypoproducto_item_estilo", _.Get("par"), true, Util.ERP);
            return data != null ? data : string.Empty;
        }


        public string getData_ConsumirBuy()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("uspGetConsumirBuy_estilo", _.Get("par"), false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string getData_forConsumirBuy()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("uspGetPoByPOProducto_item_estilo", _.Get("par"), true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string eliminarPoClienteProductoById()
        {
            string par = _.Post("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("uspEliminarpoclienteestilobyid", par, Util.ERP);
            string mensaje = _.Mensaje("remove", id > 0, oMantenimiento.get_Data("uspgetpobyidpo_estilo", id.ToString(), true, Util.ERP), id);
            return mensaje;
        }

        public string getData_colorbyidcliente_tipocolor()
        {
            string par = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("uspClienteColorBuscarPorTipo_tocsv", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string getdata_opentallacolor()
        {
            blMantenimiento omantenimiento = new blMantenimiento();
            string data = omantenimiento.get_Data("uspGetDataOpenTallaColor_estilo", _.Get("par"), true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        // EXPORTAR A PDF
        public FileResult SavePoToPdf(int pIdPo, int pIdPoCliente)
        {
            byte[] bytes = new byte[0];
            string FileName = "Error.pdf";
            decimal totalCantidadPoCliente = 0, totalPoClienteCosto = 0;

            List<PoClienteEstilo> listaPoClienteEstiloFiltradoByIdPoCliente = new List<PoClienteEstilo>();
            string nombreProveedor = string.Empty, numeroCodigoPoCliente = string.Empty, direccionProveedor = string.Empty, telefonoProveedor = string.Empty;
            string nombreLogoEmpresa = string.Empty, direccionEmpresa = string.Empty, nombreEmpresa = string.Empty, nombreTipoPo_BuyPo = string.Empty;

            int idcolorerror = 0, idtallaerror = 0;


            Po po = null;
            List<Empresa> listaEmpresas = new List<Empresa>();
            Empresa empresa = new Empresa();

            blPo oMantenimientoPo = new blPo();
            try
            {
                po = oMantenimientoPo.UltimoPoInd(pIdPo, Util.ERP);

                // OBTENER DATOS DE LA EMPRESA
                listaEmpresas = oMantenimientoPo.GetAllEmpresa(Util.SeguridadERP);
                if (listaEmpresas != null)
                {
                    if (listaEmpresas.Count > 0)
                    {
                        empresa = listaEmpresas.Where(x => x.IdEmpresa == po.IdEmpresa).FirstOrDefault();
                        nombreEmpresa = empresa.Nombre;
                        nombreLogoEmpresa = empresa.NombreLogo;
                        direccionEmpresa = empresa.Direccion;
                    }
                }

                //totalPoClienteCosto = po.Costo;
                totalPoClienteCosto = po.PoCliente.Where(x => x.IdPoCliente == pIdPoCliente).FirstOrDefault().Costo;
                totalCantidadPoCliente = po.PoCliente.Where(x => x.IdPoCliente == pIdPoCliente).FirstOrDefault().CantidadRequerida;
                numeroCodigoPoCliente = po.PoCliente.Where(x => x.IdPoCliente == pIdPoCliente).FirstOrDefault().Codigo;
                nombreTipoPo_BuyPo = po.PoCliente.Where(x => x.IdPoCliente == pIdPoCliente).FirstOrDefault().NombreTipoPo_BuyPo;

                // PO ESTILO
                listaPoClienteEstiloFiltradoByIdPoCliente = po.ListaPoClienteEstilo.Where(x => x.IdPoCliente == pIdPoCliente).ToList();
                //totalCantidadPoCliente = po.ListaPoClienteEstilo.Where(y => y.IdPoCliente == pIdPoCliente).Sum(x => x.CantidadRequerida);

                nombreProveedor = listaPoClienteEstiloFiltradoByIdPoCliente.FirstOrDefault().NombreProveedor;
                direccionProveedor = listaPoClienteEstiloFiltradoByIdPoCliente.FirstOrDefault().ProveedorDireccion;
                telefonoProveedor = listaPoClienteEstiloFiltradoByIdPoCliente.FirstOrDefault().ProveedorTelefono1;

                if (po != null)
                {
                    FileName = string.Format("Po-{0}", numeroCodigoPoCliente);

                    using (MemoryStream ms = new MemoryStream())
                    {
                        Document document = new Document(iTextSharp.text.PageSize.A4, 20, 20, 20, 20);  // A4.Rotate PARA HORIZONTAL
                        PdfWriter writer = PdfWriter.GetInstance(document, ms);

                        document.Open();

                        PdfContentByte pcb = writer.DirectContent;
                        iTextSharp.text.Font _standardFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 8, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);

                        BaseColor baseColorGencianPerlado = new BaseColor(042, 100, 120);

                        var Smaller = FontFactory.GetFont(FontFactory.HELVETICA, 6);
                        var SmallFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 7);
                        var SmallFont = FontFactory.GetFont(FontFactory.HELVETICA, 7);
                        var SmallFontWhite = FontFactory.GetFont(FontFactory.HELVETICA, 7);
                        var SmallFontBoldWhite = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 7);
                        var RegularFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);

                        var MediumFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14);
                        var MediumFont = FontFactory.GetFont(FontFactory.HELVETICA, 9);
                        var LargeFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 32);
                        var LargeFont = FontFactory.GetFont(FontFactory.HELVETICA, 32);

                        MediumFont.SetColor(0, 0, 0);  // NEGRO
                        SmallFontBoldWhite.SetColor(255, 255, 255); // BLANCO
                        SmallFontWhite.SetColor(255, 255, 255);

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
                                log.GrabarArchivoLog(ex);
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
                        string cadenaNumeroPoCliente = "Purchase Order \n";
                        cadenaNumeroPoCliente += numeroCodigoPoCliente + " - " + nombreTipoPo_BuyPo;
                        PdfPCell celdaNumeroPoCliente = new PdfPCell(new Paragraph(cadenaNumeroPoCliente, MediumFontBold));
                        celdaNumeroPoCliente.Border = Rectangle.NO_BORDER;
                        celdaNumeroPoCliente.HorizontalAlignment = Rectangle.ALIGN_CENTER;
                        celdaNumeroPoCliente.VerticalAlignment = Rectangle.ALIGN_MIDDLE;
                        tablaCaceberaLogo.AddCell(celdaNumeroPoCliente);

                        // ---- FECHAS
                        // --fila 1
                        PdfPTable subTablaCabeceraLogo = new PdfPTable(2);
                        subTablaCabeceraLogo.SetWidths(new float[] { 10f, 30f });
                        //subTablaCabeceraLogo.DefaultCell.FixedHeight = 50f;

                        PdfPCell celdaSubTablaCabeceraLogo1 = new PdfPCell(new Paragraph("PO WTS", SmallFontBoldWhite));
                        celdaSubTablaCabeceraLogo1.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                        //celdaSubTablaCabeceraLogo1.FixedHeight = 40f;
                        subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo1);

                        PdfPCell celdaSubTablaCabeceraLogo2 = new PdfPCell(new Paragraph(po.Codigo, SmallFont));
                        //celdaSubTablaCabeceraLogo2.FixedHeight = 40f;
                        subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo2);

                        // --fila 2
                        PdfPCell celdaSubTablaCabeceraLogo3 = new PdfPCell(new Paragraph("PO Date", SmallFontBoldWhite));
                        //celdaSubTablaCabeceraLogo3.FixedHeight = 40f;
                        celdaSubTablaCabeceraLogo3.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                        subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo3);

                        PdfPCell celdaSubTablaCabeceraLogo4 = new PdfPCell(new Paragraph(po.FechaCreacion.ToString("MM-dd-yyyy"), SmallFont));
                        //celdaSubTablaCabeceraLogo4.FixedHeight = 40f;
                        subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo4);

                        // --fila 3
                        PdfPCell celdaSubTablaCabeceraLogo5 = new PdfPCell(new Paragraph("Rev. Date", SmallFontBoldWhite));
                        celdaSubTablaCabeceraLogo5.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                        subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo5);

                        PdfPCell celdaSubTablaCabeceraLogo6 = new PdfPCell(new Paragraph(po.FechaActualizacion.ToString("MM-dd-yyyy"), SmallFont));
                        subTablaCabeceraLogo.AddCell(celdaSubTablaCabeceraLogo6);

                        PdfPCell celdaTablaLogo = new PdfPCell(subTablaCabeceraLogo);
                        celdaTablaLogo.Border = Rectangle.NO_BORDER;
                        celdaTablaLogo.HorizontalAlignment = Rectangle.ALIGN_CENTER;
                        celdaTablaLogo.VerticalAlignment = Rectangle.ALIGN_MIDDLE;
                        celdaTablaLogo.FixedHeight = 20f;

                        tablaCaceberaLogo.AddCell(celdaTablaLogo);

                        document.Add(tablaCaceberaLogo);

                        document.Add(new Paragraph(" "));

                        // TABLA PRINCIPAL(0) PARA: DATOS DE EMPRESA, FACTORY
                        PdfPTable tablaPrincipal = new PdfPTable(2);
                        tablaPrincipal.WidthPercentage = 100;


                        // TABLA 1 | DATOS DE LA EMPRESA
                        PdfPTable table = new PdfPTable(1);
                        table.WidthPercentage = 40;
                        table.HorizontalAlignment = Element.ALIGN_LEFT;

                        //table.TotalWidth = 100f;
                        //table.HorizontalAlignment = 1;
                        //table.LockedWidth = true;

                        PdfPCell header = new PdfPCell(new Phrase(" ", SmallFontBoldWhite));
                        //header.Colspan = 2;
                        header.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                        table.AddCell(header);

                        PdfPCell newCampo = new PdfPCell(new Phrase(nombreEmpresa + "\n \n" + direccionEmpresa, SmallFont));  // ? nombreemprsa + direccion de la empresa
                        newCampo.FixedHeight = 40f;

                        table.AddCell(newCampo);

                        // TABLA 2 | DATOS DE LA FABRICA (PROVEEDOR)
                        PdfPTable table2 = new PdfPTable(1);
                        table2.WidthPercentage = 40;
                        table2.HorizontalAlignment = Element.ALIGN_RIGHT;

                        PdfPCell header2 = new PdfPCell(new Phrase("Factory:", SmallFontBoldWhite));
                        //header.Colspan = 2;
                        header2.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                        table2.AddCell(header2);

                        PdfPTable tablaAnidada = new PdfPTable(2);
                        tablaAnidada.SetWidths(new float[] { 10f, 30f });
                        // PARA LA FILA 1; ANIDADA
                        PdfPCell cellAnidada1 = new PdfPCell(new Phrase("Factory:", SmallFont));
                        cellAnidada1.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        tablaAnidada.AddCell(cellAnidada1);

                        PdfPCell cellAnidada2 = new PdfPCell(new Phrase(nombreProveedor, SmallFont));
                        cellAnidada2.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        tablaAnidada.AddCell(cellAnidada2);

                        // PARA LA FILA 2 ANIDADA
                        PdfPCell cellAnidada3 = new PdfPCell(new Phrase("Address:", SmallFont));
                        cellAnidada3.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        tablaAnidada.AddCell(cellAnidada3);

                        PdfPCell cellAnidada4 = new PdfPCell(new Phrase(direccionProveedor, SmallFont));  // ?
                        cellAnidada4.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        tablaAnidada.AddCell(cellAnidada4);

                        // PARA LA FILA 3 ANIDADA
                        PdfPCell cellAnidada5 = new PdfPCell(new Phrase("Telephone:", SmallFont));
                        cellAnidada5.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        tablaAnidada.AddCell(cellAnidada5);

                        PdfPCell cellAnidada6 = new PdfPCell(new Phrase(telefonoProveedor, SmallFont));  // ?
                        cellAnidada6.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        tablaAnidada.AddCell(cellAnidada6);

                        // AGREGAR LA TABLA ANAIDADA
                        PdfPCell newCampo2 = new PdfPCell(tablaAnidada);
                        table2.AddCell(newCampo2);

                        // TABLA PRINCIPAL
                        PdfPCell celdaPrincipal1 = new PdfPCell(table);
                        tablaPrincipal.AddCell(celdaPrincipal1);
                        PdfPCell celdaPrincipal2 = new PdfPCell(table2);
                        tablaPrincipal.AddCell(celdaPrincipal2);

                        // ***** 2da tabla
                        // TABLA SIGUIENTE: TOTAL CANTIDAD PO | TOTAL PO COST
                        PdfPTable tablaPrincipalTotalPoCantidad = new PdfPTable(3);
                        tablaPrincipalTotalPoCantidad.WidthPercentage = 100;

                        // TABLA 1
                        PdfPTable subTableTotalPoCantidad1 = new PdfPTable(1);
                        subTableTotalPoCantidad1.WidthPercentage = 40;

                        PdfPCell headerTotalPoCantidad1 = new PdfPCell(new Phrase("Total PO Quantity", SmallFontBoldWhite));
                        headerTotalPoCantidad1.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                        subTableTotalPoCantidad1.AddCell(headerTotalPoCantidad1);

                        PdfPCell newCampoTotalPoCantidad1 = new PdfPCell(new Phrase(totalCantidadPoCliente.ToString(), SmallFont));  // TOTAL CANTIDAD
                        newCampoTotalPoCantidad1.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                        //newCampoTotalPoCantidad1.FixedHeight = 40f;
                        newCampoTotalPoCantidad1.HorizontalAlignment = Element.ALIGN_RIGHT;

                        subTableTotalPoCantidad1.AddCell(newCampoTotalPoCantidad1);

                        // TABLA 2
                        PdfPTable subTableTotalPoCantidad2 = new PdfPTable(1);
                        subTableTotalPoCantidad2.WidthPercentage = 40;

                        PdfPCell headerTotalPoCantidad2 = new PdfPCell(new Phrase("Total PO Cost", SmallFontBoldWhite));
                        headerTotalPoCantidad2.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                        subTableTotalPoCantidad2.AddCell(headerTotalPoCantidad2);

                        PdfPCell newCampoTotalPoCantidad2 = new PdfPCell(new Phrase("USD " + totalPoClienteCosto.ToString("##,###0.000"), SmallFont));
                        newCampoTotalPoCantidad2.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                        //newCampoTotalPoCantidad2.FixedHeight = 40f;

                        subTableTotalPoCantidad2.AddCell(newCampoTotalPoCantidad2);

                        // TABLA 3
                        PdfPTable subTableTotalPoCantidad3 = new PdfPTable(1);
                        subTableTotalPoCantidad3.WidthPercentage = 40;

                        PdfPCell headerTotalPoCantidad3 = new PdfPCell(new Phrase("TERMS", SmallFontBoldWhite));
                        headerTotalPoCantidad3.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                        subTableTotalPoCantidad3.AddCell(headerTotalPoCantidad3);

                        PdfPCell newCampoTotalPoCantidad3 = new PdfPCell(new Phrase(po.TerminoPagoDescripcion, SmallFont));
                        //newCampoTotalPoCantidad3.FixedHeight = 40f;

                        subTableTotalPoCantidad3.AddCell(newCampoTotalPoCantidad3);

                        // TABLA PRINCIPAL
                        PdfPCell celdaPrincipalPoCantidad1 = new PdfPCell(subTableTotalPoCantidad1);
                        tablaPrincipalTotalPoCantidad.AddCell(celdaPrincipalPoCantidad1);
                        PdfPCell celdaPrincipalPoCantidad2 = new PdfPCell(subTableTotalPoCantidad2);
                        tablaPrincipalTotalPoCantidad.AddCell(celdaPrincipalPoCantidad2);
                        PdfPCell celdaPrincipalPoCantidad3 = new PdfPCell(subTableTotalPoCantidad3);
                        tablaPrincipalTotalPoCantidad.AddCell(celdaPrincipalPoCantidad3);

                        document.Add(tablaPrincipal);
                        document.Add(new Paragraph(" "));
                        document.Add(tablaPrincipalTotalPoCantidad);
                        //document.Add(new Paragraph(" "));

                        // ***** 3ra tabla / STYLE - DETALLE / ESTO VA EN UN BUCLE
                        // TABLA SIGUIENTE: DETALLE STYLE/ CON FOTO

                        ExportToPdf_DetallePOClienteEstilo(document, listaPoClienteEstiloFiltradoByIdPoCliente, subTableTotalPoCantidad1, MediumFontBold, SmallFont, SmallFontBold,
                                SmallFontBoldWhite, baseColorGencianPerlado, SmallFontWhite);

                        document.Close();
                        writer.Close();

                        bytes = ms.GetBuffer();
                    }
                }
            }
            catch (Exception ex)
            {
                string mierror = idcolorerror.ToString() + " color - talla " + idtallaerror.ToString();
            }

            return File(bytes, "application/pdf", FileName + ".pdf");
        }
        // :edu 20171023 exportar a pdf
        public void ExportToPdf_DetallePOClienteEstilo(Document document, List<PoClienteEstilo> listaPoClienteEstiloFiltradoByIdPoCliente, PdfPTable subTableTotalPoCantidad1,
            Font MediumFontBold, Font SmallFont, Font SmallFontBold, Font SmallFontBoldWhite, BaseColor baseColorGencianPerlado, Font SmallFontWhite)
        {
            document.Add(new Paragraph(" "));

            foreach (var itemPoClienteEstilo in listaPoClienteEstiloFiltradoByIdPoCliente)
            {
                PdfPTable tablaPrincipalStyleImagen = new PdfPTable(2);  // TABLA 0
                tablaPrincipalStyleImagen.WidthPercentage = 100;
                //tablaPrincipalStyleImagen.SetWidthPercentage(new float[] { 90, 10 }, PageSize.A4);
                tablaPrincipalStyleImagen.SetWidths(new float[] { 50f, 10f });
                tablaPrincipalStyleImagen.DefaultCell.Border = Rectangle.NO_BORDER;

                // TABLA 1
                PdfPTable subTablaAnidadaPrincipalStyleImagen = new PdfPTable(1);
                subTablaAnidadaPrincipalStyleImagen.WidthPercentage = 90;
                subTablaAnidadaPrincipalStyleImagen.DefaultCell.Border = Rectangle.NO_BORDER;

                // TABLA 1.1
                PdfPTable subTableStyleImagen1 = new PdfPTable(1);
                subTableTotalPoCantidad1.WidthPercentage = 90;
                // FILA 1
                PdfPCell headerStyleImagen1 = new PdfPCell(new Phrase("Style - " + itemPoClienteEstilo.CodigoEstilo, MediumFontBold));
                headerStyleImagen1.Border = iTextSharp.text.Rectangle.NO_BORDER;
                subTableStyleImagen1.AddCell(headerStyleImagen1);
                // FILA 2
                PdfPCell headerStyleImagen2 = new PdfPCell(new Phrase(itemPoClienteEstilo.DescripcionEstilo, SmallFont));
                headerStyleImagen2.Border = iTextSharp.text.Rectangle.NO_BORDER;
                subTableStyleImagen1.AddCell(headerStyleImagen2);
                // FILA 3
                PdfPCell headerStyleImagen3 = new PdfPCell(new Phrase("Technical Fabric: " + itemPoClienteEstilo.CodigoTela, SmallFont));
                headerStyleImagen3.Border = iTextSharp.text.Rectangle.NO_BORDER;
                subTableStyleImagen1.AddCell(headerStyleImagen3);
                // FILA 4
                PdfPCell headerStyleImagen4 = new PdfPCell(new Phrase("Comercial Fabric: " + itemPoClienteEstilo.NombreTela, SmallFont));
                headerStyleImagen4.Border = iTextSharp.text.Rectangle.NO_BORDER;
                subTableStyleImagen1.AddCell(headerStyleImagen4);

                subTablaAnidadaPrincipalStyleImagen.AddCell(subTableStyleImagen1);

                // TABLA 1.2 / GENERAR ESTA TABLA EN UN BUCLE
                PdfPTable subTableStyleImagen2 = new PdfPTable(4);
                subTableStyleImagen2.SetWidths(new float[] { 40f, 10f, 10f, 10f });
                subTableStyleImagen2.WidthPercentage = 90;

                // FILA 1 - CABECERA
                //BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1250, false);
                //document.Add(new Paragraph("...", new Font(bf, 7, 0, BaseColor.WHITE)));
                PdfPCell headerSubTablaStyleImagen1 = new PdfPCell(new Phrase("Destination", SmallFontBoldWhite));
                headerSubTablaStyleImagen1.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                subTableStyleImagen2.AddCell(headerSubTablaStyleImagen1);

                PdfPCell headerSubTablaStyleImagen2 = new PdfPCell(new Phrase("Ex fty Date", SmallFontBoldWhite));
                headerSubTablaStyleImagen2.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                subTableStyleImagen2.AddCell(headerSubTablaStyleImagen2);

                PdfPCell headerSubTablaStyleImagen3 = new PdfPCell(new Phrase("Cancel Date", SmallFontBoldWhite));
                headerSubTablaStyleImagen3.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                subTableStyleImagen2.AddCell(headerSubTablaStyleImagen3);

                PdfPCell headerSubTablaStyleImagen4 = new PdfPCell(new Phrase("VIA", SmallFontBoldWhite));
                headerSubTablaStyleImagen4.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                subTableStyleImagen2.AddCell(headerSubTablaStyleImagen4);

                foreach (var itemDestinos in itemPoClienteEstilo.PoClienteEstiloDestino)
                {
                    // FILA 2 - CUERPO
                    PdfPCell newColumnSubTablaStyleImagen1 = new PdfPCell(new Phrase(itemDestinos.DescripcionDireccion, SmallFont));
                    //newColumnSubTablaStyleImagen1.FixedHeight = 3f;
                    subTableStyleImagen2.AddCell(newColumnSubTablaStyleImagen1);

                    if (itemPoClienteEstilo.FechaDespachoFabricaUPT == null)
                    {
                        PdfPCell newColumnSubTablaStyleImagen2 = new PdfPCell(new Phrase(itemPoClienteEstilo.FechaDespachoFabrica.ToString("MM-dd-yyyy"), SmallFont));
                        //newColumnSubTablaStyleImagen2.FixedHeight = 3f;
                        subTableStyleImagen2.AddCell(newColumnSubTablaStyleImagen2);
                    }
                    else
                    {
                        PdfPCell newColumnSubTablaStyleImagen2 = new PdfPCell(new Phrase(itemPoClienteEstilo.FechaDespachoFabricaUPT.Value.ToString("MM-dd-yyyy"), SmallFont));
                        //newColumnSubTablaStyleImagen2.FixedHeight = 3f;
                        subTableStyleImagen2.AddCell(newColumnSubTablaStyleImagen2);
                    }

                    if (itemPoClienteEstilo.FechaDespachoClienteUPT == null)
                    {
                        PdfPCell newColumnSubTablaStyleImagen3 = new PdfPCell(new Phrase(itemPoClienteEstilo.FechaDespachoCliente.ToString("MM-dd-yyyy"), SmallFont));
                        //newColumnSubTablaStyleImagen3.FixedHeight = 3f;
                        subTableStyleImagen2.AddCell(newColumnSubTablaStyleImagen3);
                    }
                    else
                    {
                        PdfPCell newColumnSubTablaStyleImagen3 = new PdfPCell(new Phrase(itemPoClienteEstilo.FechaDespachoClienteUPT.Value.ToString("MM-dd-yyyy"), SmallFont));
                        //newColumnSubTablaStyleImagen3.FixedHeight = 3f;
                        subTableStyleImagen2.AddCell(newColumnSubTablaStyleImagen3);
                    }

                    PdfPCell newColumnSubTablaStyleImagen4 = new PdfPCell(new Phrase(itemPoClienteEstilo.DescripcionFormaEnvio, SmallFont));
                    //newColumnSubTablaStyleImagen4.FixedHeight = 3f;
                    subTableStyleImagen2.AddCell(newColumnSubTablaStyleImagen4);
                }
                subTablaAnidadaPrincipalStyleImagen.AddCell(subTableStyleImagen2);

                tablaPrincipalStyleImagen.AddCell(subTablaAnidadaPrincipalStyleImagen);
                // PARA LA FOTO

                //string urlFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
                string cFolderOriginal = string.Empty;
                PdfPCell newColumnSubTablaStyleImagen5 = new PdfPCell();
                if (itemPoClienteEstilo.ImagenNombre != string.Empty)
                {
                    cFolderOriginal = ConfigurationManager.AppSettings["urlimagesstyle"].ToString() + itemPoClienteEstilo.ImagenNombre; //System.Web.HttpContext.Current.Server.MapPath("~/images/style/original/" + itemPoClienteEstilo.ImagenNombre); // 2017072709062972.jpg //HttpContext.Current.Server.MapPath("~/images/style/original/2017072709062972.jpg");
                    try
                    {
                        byte[] miFoto = new System.Net.WebClient().DownloadData(cFolderOriginal); //System.IO.File.ReadAllBytes(@cFolderOriginal);
                        Image miImagen = Image.GetInstance(miFoto);
                        miImagen.ScalePercent(50f);
                        miImagen.ScaleAbsolute(80f, 80f);

                        newColumnSubTablaStyleImagen5 = new PdfPCell(miImagen, true); //miImagen false
                    }
                    catch (Exception ex)
                    {
                        newColumnSubTablaStyleImagen5 = new PdfPCell(new Phrase(""));
                        //oPoService.errorAlExportarToPdf(ex);
                        log.GrabarArchivoLog(ex);
                    }

                }
                else
                {
                    newColumnSubTablaStyleImagen5 = new PdfPCell(new Phrase(""));
                }

                newColumnSubTablaStyleImagen5.Border = Rectangle.NO_BORDER;
                newColumnSubTablaStyleImagen5.HorizontalAlignment = Element.ALIGN_CENTER;
                newColumnSubTablaStyleImagen5.VerticalAlignment = Element.ALIGN_MIDDLE;
                newColumnSubTablaStyleImagen5.Padding = iTextSharp.text.Utilities.MillimetersToPoints(3);
                newColumnSubTablaStyleImagen5.FixedHeight = 40f;

                tablaPrincipalStyleImagen.AddCell(newColumnSubTablaStyleImagen5);

                document.Add(tablaPrincipalStyleImagen);

                // ****** ****** AQUI GENERAR EL ORDER DETAILS
                document.Add(new Paragraph("ORDER DETAILS", MediumFontBold));
                document.Add(new Paragraph(" "));
                // CABECERA ORDER DETAILS
                // CUANTAS COLUMNAS DINAMICAS HAY?
                //var listaIdClienteTalla = itemPoClienteEstilo.PoClienteEstiloTallaColor.Where(x => x.IdPoClienteEstilo == itemPoClienteEstilo.IdPoClienteEstilo).Select(y => y.IdClienteTalla).Distinct().ToList();

                // :edu 20171026: utilizar el store: uspReporte_POEstilo_PDF ACA OBTENER LA LISTA DE POCLIENTEESTILOTALLACOLOR
                blPo oMantenimiento = new blPo();
                List<PoClienteEstiloTallaColor> listaPoClienteEstiloTallaColor = oMantenimiento.GetListaPoClienteEstiloTallaColor(itemPoClienteEstilo.IdPoClienteEstilo, Util.ERP);

                //var listaIdClienteTalla = (from data in itemPoClienteEstilo.PoClienteEstiloTallaColor
                //                           select new
                //                           {
                //                               IdClienteTalla = data.IdClienteTalla,
                //                               NombreClienteTalla = data.NombreClienteTalla
                //                           }).Distinct();
                var listaIdClienteTalla = (from data in listaPoClienteEstiloTallaColor
                                           select new
                                           {
                                               IdClienteTalla = data.IdClienteTalla,
                                               NombreClienteTalla = data.NombreClienteTalla
                                           }).Distinct();


                int totalColumnasDinamicas = listaIdClienteTalla.Count();
                int totalColumnasFijas = 4;
                int totalColumnasAGenerar = totalColumnasFijas + totalColumnasDinamicas;


                PdfPTable tablaPrincipalOrderDetails = new PdfPTable(totalColumnasAGenerar);
                tablaPrincipalOrderDetails.WidthPercentage = 100;

                PdfPCell headerOrderDetails1 = new PdfPCell(new Phrase("Color", SmallFontBoldWhite));
                headerOrderDetails1.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                tablaPrincipalOrderDetails.AddCell(headerOrderDetails1);

                // bucle para generar las columnas dinamicas
                foreach (var itemColumnasClienteTalla in listaIdClienteTalla)
                {
                    PdfPCell headerOrderDetailsTallas = new PdfPCell(new Phrase(itemColumnasClienteTalla.NombreClienteTalla.ToUpper(), SmallFontBoldWhite));
                    headerOrderDetailsTallas.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                    headerOrderDetailsTallas.HorizontalAlignment = Rectangle.ALIGN_CENTER;
                    tablaPrincipalOrderDetails.AddCell(headerOrderDetailsTallas);
                }

                PdfPCell headerOrderDetailsTallas2 = new PdfPCell(new Phrase("Total Units", SmallFontBoldWhite));
                headerOrderDetailsTallas2.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                tablaPrincipalOrderDetails.AddCell(headerOrderDetailsTallas2);

                PdfPCell headerOrderDetailsTallas3 = new PdfPCell(new Phrase("Unit Cost", SmallFontBoldWhite));
                headerOrderDetailsTallas3.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                tablaPrincipalOrderDetails.AddCell(headerOrderDetailsTallas3);

                PdfPCell headerOrderDetailsTallas4 = new PdfPCell(new Phrase("Total Cost", SmallFontBoldWhite));
                headerOrderDetailsTallas4.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                tablaPrincipalOrderDetails.AddCell(headerOrderDetailsTallas4);
                // FIN CABECERA ORDER DETAILS

                //var listaIdClienteColor = (from data in itemPoClienteEstilo.PoClienteEstiloTallaColor
                //                           select new
                //                           {
                //                               IdClienteColor = data.IdClienteColor,
                //                               NombreClienteColor = data.NombreClienteColor
                //                           }).Distinct();
                var listaIdClienteColor = (from data in listaPoClienteEstiloTallaColor
                                           select new
                                           {
                                               IdClienteColor = data.IdClienteColor,
                                               NombreClienteColor = data.NombreClienteColor
                                           }).Distinct();

                int totalCantidad = 0;
                int totalGeneralCantidad = 0;
                decimal totalGeneralCosto = 0;
                foreach (var itemClienteColor in listaIdClienteColor)
                {
                    PdfPCell newColumnClienteColor1 = new PdfPCell(new Phrase(itemClienteColor.NombreClienteColor, SmallFont));
                    tablaPrincipalOrderDetails.AddCell(newColumnClienteColor1);

                    // COLUMNAS DINAMICAS TALLAS
                    foreach (var itemColumnasClienteTalla in listaIdClienteTalla)
                    {
                        //idcolorerror = itemClienteColor.IdClienteColor;
                        //idtallaerror = itemColumnasClienteTalla.IdClienteTalla;
                        //var dataTalla = itemPoClienteEstilo.PoClienteEstiloTallaColor.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor && x.IdClienteTalla == itemColumnasClienteTalla.IdClienteTalla).ToList().FirstOrDefault();
                        var dataTalla = listaPoClienteEstiloTallaColor.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor && x.IdClienteTalla == itemColumnasClienteTalla.IdClienteTalla).ToList().FirstOrDefault();
                        string stringCantidadColorTalla = "0";
                        if (dataTalla != null)
                        {
                            stringCantidadColorTalla = dataTalla.Cantidad.ToString();
                        }

                        PdfPCell newColumnTalla = new PdfPCell(new Phrase(stringCantidadColorTalla, SmallFont));
                        newColumnTalla.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                        tablaPrincipalOrderDetails.AddCell(newColumnTalla);
                    }

                    //totalCantidad = itemPoClienteEstilo.PoClienteEstiloTallaColor.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor).Sum(y => y.Cantidad);
                    totalCantidad = listaPoClienteEstiloTallaColor.Where(x => x.IdClienteColor == itemClienteColor.IdClienteColor).Sum(y => y.Cantidad);
                    totalGeneralCantidad += totalCantidad;
                    PdfPCell newColumnClienteColor2 = new PdfPCell(new Phrase(totalCantidad.ToString(), SmallFont));
                    newColumnClienteColor2.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                    tablaPrincipalOrderDetails.AddCell(newColumnClienteColor2);

                    decimal precioFabrica = 0;
                    if (itemPoClienteEstilo.PrecioFabricaUPT == 0)
                    {
                        precioFabrica = itemPoClienteEstilo.PrecioFabricaUPT;
                        PdfPCell newColumnClienteColor3 = new PdfPCell(new Phrase("USD " + itemPoClienteEstilo.PrecioFabricaUPT.ToString("##,###0.000"), SmallFont));
                        newColumnClienteColor3.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                        tablaPrincipalOrderDetails.AddCell(newColumnClienteColor3);
                    }
                    else
                    {
                        precioFabrica = itemPoClienteEstilo.PrecioFabricaUPT;
                        PdfPCell newColumnClienteColor3 = new PdfPCell(new Phrase("USD " + itemPoClienteEstilo.PrecioFabricaUPT.ToString("##,###0.000"), SmallFont));
                        newColumnClienteColor3.HorizontalAlignment = Rectangle.ALIGN_RIGHT;
                        tablaPrincipalOrderDetails.AddCell(newColumnClienteColor3);
                    }

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

                document.Add(tablaPrincipalOrderDetails);

                // SECCION COMENTARIOS
                document.Add(new Paragraph(" "));  // SPACIO EN BLANCO
                PdfPTable tablaComentarios = new PdfPTable(2);
                tablaComentarios.SetWidths(new float[] { 10f, 30f });
                tablaComentarios.WidthPercentage = 100;

                PdfPCell tituloComentario1 = new PdfPCell(new Paragraph("Packing Instructions", SmallFontBoldWhite));
                tituloComentario1.FixedHeight = 20f;
                tituloComentario1.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                tablaComentarios.AddCell(tituloComentario1);

                PdfPCell valorComentario1 = new PdfPCell(new Paragraph(itemPoClienteEstilo.InstruccionEmpaque, SmallFont));
                valorComentario1.FixedHeight = 20f;
                tablaComentarios.AddCell(valorComentario1);

                PdfPCell tituloComentario2 = new PdfPCell(new Paragraph("HTS", SmallFontBoldWhite));
                tituloComentario2.FixedHeight = 20f;
                tituloComentario2.BackgroundColor = baseColorGencianPerlado; //BaseColor.BLUE;
                tablaComentarios.AddCell(tituloComentario2);

                PdfPCell valorComentario2 = new PdfPCell(new Paragraph(itemPoClienteEstilo.Hts, SmallFont));
                valorComentario2.FixedHeight = 20f;
                tablaComentarios.AddCell(valorComentario2);

                document.Add(tablaComentarios);
                document.Add(new Paragraph(" "));  // ESPACIO EN BLANCO
            }
        }
    }
}