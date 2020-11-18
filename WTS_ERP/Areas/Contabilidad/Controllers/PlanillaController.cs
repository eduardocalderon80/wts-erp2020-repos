using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Text;
using System.IO;
using System.Web;
using System.Configuration;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using Excel;
using Newtonsoft.Json.Linq;
using System.Net.Mail;
using System.Net;
using System.Web.UI;
using BE_ERP.Contabilidad;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace WTS_ERP.Areas.Contabilidad.Controllers
{
    public class PlanillaController : Controller
    {
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }
                
        [AccessSecurity]
        public ActionResult New()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult Detail()
        {
            return View();
        }



        public string Planilla_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_Planilla_List", "", false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Planilla_Valid()
        {
            _Helper helper = new _Helper();
            string path = helper.Upload_file(Request.Files["archivo"]);
            DataTable tabla = !string.IsNullOrEmpty(path) ? helper.convertExceltoDataSet(path) : null;                       
            string result = "";
            string nametable = "";
            bool exito = false;
            string par = _.Post("par");
            string data = _.Get_Par(par, "Documento");

            if (data == "1") { nametable = "Planilla_BoletaPago_Temporal"; }
            if (data == "2") { nametable = "Planilla_BoletaGratificacion_Temporal"; }
            if (data == "3") { nametable = "Planilla_CertificadoCTS_Temporal"; }
            if (data == "4") { nametable = "Planilla_CertificadoUtilidad_Temporal"; }


            if (tabla != null)
            {
                blMantenimiento oMantenimiento = new blMantenimiento();
                exito = (oMantenimiento.save_Row("usp_PlanillaTemporal_Delete", par, Util.ERP) >= 0) ? oMantenimiento.save_Rows_BulkCopy(nametable, tabla, Util.ERP) : false;
                result = oMantenimiento.get_Data("usp_PlanillaTemporal_List", par, false, Util.ERP);
            }
            return _.Mensaje("new", exito, result);
        }
        
        public string Planilla_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "UsuarioCreacion", _.GetUsuario().Usuario.ToString());
            par = _.addParameter(par, "Ip", "");
            par = _.addParameter(par, "Hostname", "");

            int id = oMantenimiento.save_Row("usp_Planilla_Insert", par, Util.ERP);
            string mensaje = _.Mensaje("new", id > 0);

            string resultado = id > 0 ? oMantenimiento.get_Data("usp_Planilla_Get", par, false, Util.ERP) : string.Empty;

            if (resultado != null)
            {
                string documento = _.Get_Par(par, "IdDocumento");
                Planilla_CreatePDF(resultado, documento);
            }           
            
            return mensaje;
        }
        
        public string Planilla_CreatePDF(string resultado,string documento)
        {
            string result = "";
            string nombrePDF = "Error.pdf";
            try
            {              
                if (documento == "1")
                {
                    List<BoletaPago> listBoletaPago = JsonConvert.DeserializeObject<List<BoletaPago>>(resultado);

                    foreach (var boleta in listBoletaPago)
                    {
                        Create_BoletaPagoPDF(boleta);
                    }
                }
                else if (documento == "2")
                {
                    List<BoletaGratificacion> listBoletaGratificacion = JsonConvert.DeserializeObject<List<BoletaGratificacion>>(resultado);

                    foreach (var grati in listBoletaGratificacion)
                    {
                        Create_BoletaGratificacionPDF(grati);
                    }
                }
                else if (documento == "3")
                {
                    List<CertificadoCTS> listCertificadoCTS = JsonConvert.DeserializeObject<List<CertificadoCTS>>(resultado);

                    foreach (var cts in listCertificadoCTS)
                    {
                        Create_CertificadoCTS(cts);
                    }
                }
                else if (documento == "4")
                {
                    List<CertificadoUtilidad> listCertificadoUtilidad = JsonConvert.DeserializeObject<List<CertificadoUtilidad>>(resultado);

                    foreach (var uti in listCertificadoUtilidad)
                    {
                        Create_CertificadoUtilidad(uti);
                    }
                }
            }
            catch (System.Exception)
            {
                nombrePDF = "Incomplete.pdf";
            }
            return result;
        }

        public void Create_BoletaPagoPDF(BoletaPago objBoletaPago)
        {
            BoletaPago obj = objBoletaPago;

            string rutaPdf = ConfigurationManager.AppSettings["rutaPDFCreated"].ToString();

            string nombreArchivo = obj.IdDocumento +"-" + obj.Trabajador + "-" + obj.Mes + "-" + obj.Anio + ".pdf";
            // Creamos el documento con el tamaño de página tradicional
            iTextSharp.text.Document doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER);
            //// Indicamos donde vamos a guardar el documento
            iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, new System.IO.FileStream(Server.MapPath("~") + rutaPdf + nombreArchivo, System.IO.FileMode.Create));
            // Le colocamos el título y el autor
            // **Nota: Esto no será visible en el documento
            doc.AddTitle("PDF Planillas");
            doc.AddCreator("Luis Rojas");
            // Abrimos el archivo
            doc.Open();

            iTextSharp.text.Font _standardFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.TIMES_ROMAN, 14, iTextSharp.text.Font.BOLD, iTextSharp.text.BaseColor.BLACK);
            iTextSharp.text.Font _standardFont2 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 8, iTextSharp.text.Font.NORMAL, iTextSharp.text.BaseColor.BLACK);
            iTextSharp.text.Font _standardFont3 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 5, iTextSharp.text.Font.NORMAL, iTextSharp.text.BaseColor.BLACK);
            iTextSharp.text.Font _standardFont4 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 5, iTextSharp.text.Font.BOLD, iTextSharp.text.BaseColor.BLACK);

            // Escribimos el encabezamiento en el documento
            //doc.Add(new iTextSharp.text.Paragraph("WT SOURCING PERU S.A.C", _standardFont));
            
            iTextSharp.text.pdf.PdfPTable pdfLogo = new iTextSharp.text.pdf.PdfPTable(1);
            pdfLogo.DefaultCell.BorderWidth = 0;
            pdfLogo.WidthPercentage = 100;
            pdfLogo.DefaultCell.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;

            iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/img/logos/WTSLogo2.png"));
            jpg.ScaleToFit(120f, 90f);

            iTextSharp.text.pdf.PdfPCell cellLogo = new iTextSharp.text.pdf.PdfPCell(jpg);
            cellLogo.BorderWidth = 0;
            cellLogo.BorderWidthBottom = 0;

            pdfLogo.AddCell(cellLogo);

            doc.Add(pdfLogo);

            /********************* Cabecera ******************************/
            iTextSharp.text.pdf.PdfPTable pdfCabecera = new iTextSharp.text.pdf.PdfPTable(2);
            pdfCabecera.DefaultCell.BorderWidth = 0;
            pdfCabecera.WidthPercentage = 100;
            pdfCabecera.DefaultCell.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;

            iTextSharp.text.pdf.PdfPCell Izq = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Calle Aldabas 540 oficina 301", _standardFont2));
            Izq.BorderWidth = 0;
            Izq.BorderWidthBottom = 0;

            iTextSharp.text.pdf.PdfPCell Der = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Documento + "", _standardFont2));
            Der.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            Der.BorderWidth = 0;
            
            pdfCabecera.AddCell(Izq);
            pdfCabecera.AddCell(Der);

            Izq = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("RUC: 20522506410", _standardFont2));
            Izq.BorderWidth = 0;

            Der = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("EMPLEADO - " + obj.Mes + " " + obj.Anio, _standardFont2));
            Der.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            Der.BorderWidth = 0;

            pdfCabecera.AddCell(Izq);
            pdfCabecera.AddCell(Der);

            doc.Add(pdfCabecera);

            /*********************DATOS******************************/

            iTextSharp.text.pdf.PdfPTable pdfDatos = new iTextSharp.text.pdf.PdfPTable(8);
            pdfDatos.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Trabajador", _standardFont3));
            cell1.BorderWidth = 0;
            cell1.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Trabajador, _standardFont3));
            cell2.Colspan = 3;
            cell2.BorderWidth = 0;
            cell2.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Área de Trabajo", _standardFont3));
            cell5.BorderWidth = 0;
            cell5.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Area, _standardFont3));
            cell6.BorderWidth = 0;
            cell6.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell7.BorderWidth = 0;
            cell7.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell8.BorderWidth = 0;
            cell8.BorderWidthTop = 0.75f;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Cargo/Ocupación", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Cargo, _standardFont3));
            cell2.Colspan = 3;
            cell2.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fecha de Cese", _standardFont3));
            cell5.BorderWidth = 0;

            //if (obj.FechaCese != "")
                cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.FechaCese, _standardFont3));
            //else
                //cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.FechaCese, _standardFont3));

            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);


            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fecha de Ingreso", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.FechaIngreso, _standardFont3));
            cell2.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Vacaciones", _standardFont3));
            cell5.BorderWidth = 0;

            //if (obj.InicioVacaciones != "")
                cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("desde: " + obj.InicioVacaciones, _standardFont3));
            //else
                //cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("desde: " + obj.InicioVacaciones, _standardFont3));

            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("H.E.1:", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.HESimples + "h.", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Carnet Essalud", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.carnetEssalud, _standardFont3));
            cell2.BorderWidth = 0;

            cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;

            cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell5.BorderWidth = 0;

            //if (obj.FinVacaciones != "")
                cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("hasta: " + obj.FinVacaciones, _standardFont3));
            //else
                //cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("hasta: " + obj.FinVacaciones, _standardFont3));

            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("H.E.2:", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.HESegundas + "h.", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fondo de Pensiones", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.AFP, _standardFont3));
            cell2.BorderWidth = 0;

            cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("C.U.S.P.P.  ", _standardFont3));
            cell3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cell3.BorderWidth = 0;

            cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.numCUSPP, _standardFont3));
            cell3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cell4.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Remuneración Básica", _standardFont3));
            cell5.BorderWidth = 0;

            cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.RemuneracionBasica, _standardFont3));
            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("H.E.Doble:", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.HEDobles + "h.", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("D.N.I.", _standardFont3));
            cell1.BorderWidth = 0;
            cell1.BorderWidthBottom = 0.75f;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Codigo, _standardFont3));
            cell2.BorderWidth = 0;
            cell2.BorderWidthBottom = 0.75f;

            cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;
            cell3.BorderWidthBottom = 0.75f;

            cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;
            cell4.BorderWidthBottom = 0.75f;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Cta de Ahorros", _standardFont3));
            cell5.BorderWidth = 0;
            cell5.BorderWidthBottom = 0.75f;

            cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.CuentaBancaria, _standardFont3));
            cell6.BorderWidth = 0;
            cell6.BorderWidthBottom = 0.75f;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell7.BorderWidth = 0;
            cell7.BorderWidthBottom = 0.75f;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell8.BorderWidth = 0;
            cell8.BorderWidthBottom = 0.75f;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            doc.Add(pdfDatos);

            /*********************DIAS TRABAJADOS******************************/
            iTextSharp.text.pdf.PdfPTable pdfDiasTrabajados = new iTextSharp.text.pdf.PdfPTable(10);
            pdfDiasTrabajados.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell cellTrab1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Trabajados: ", _standardFont3));
            cellTrab1.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasTrabajados, _standardFont3));
            cellTrab2.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Libres: ", _standardFont3));
            cellTrab3.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasLibres, _standardFont3));
            cellTrab4.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Subsidio Enfermedad: ", _standardFont3));
            cellTrab5.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasSubsidioEnfermedad, _standardFont3));
            cellTrab6.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días F/D: ", _standardFont3));
            cellTrab7.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.FeriadoDomingoLaborado, _standardFont3));
            cellTrab8.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab9 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días de falta: ", _standardFont3));
            cellTrab9.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab10 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasFalta, _standardFont3));
            cellTrab10.BorderWidth = 0;

            pdfDiasTrabajados.AddCell(cellTrab1);
            pdfDiasTrabajados.AddCell(cellTrab2);
            pdfDiasTrabajados.AddCell(cellTrab3);
            pdfDiasTrabajados.AddCell(cellTrab4);
            pdfDiasTrabajados.AddCell(cellTrab5);
            pdfDiasTrabajados.AddCell(cellTrab6);
            pdfDiasTrabajados.AddCell(cellTrab7);
            pdfDiasTrabajados.AddCell(cellTrab8);
            pdfDiasTrabajados.AddCell(cellTrab9);
            pdfDiasTrabajados.AddCell(cellTrab10);

            cellTrab1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Horas trabajadas: ", _standardFont3));
            cellTrab1.BorderWidth = 0;

            cellTrab2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.HorasTrabajadas, _standardFont3));
            cellTrab2.BorderWidth = 0;

            cellTrab3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Desc. Médico: ", _standardFont3));
            cellTrab3.BorderWidth = 0;

            cellTrab4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasDescanzoMedico, _standardFont3));
            cellTrab4.BorderWidth = 0;

            if (obj.Sexo == "F")
                cellTrab5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Subsidio Maternidad: ", _standardFont3));
            else
                cellTrab5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Subsidio Paternidad: ", _standardFont3));

            cellTrab5.BorderWidth = 0;

            if (obj.Sexo == "F")
                cellTrab6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasSubsidioMaternidad, _standardFont3));
            else
                cellTrab6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasSubsidioPaternidad, _standardFont3));

            cellTrab6.BorderWidth = 0;

            cellTrab7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Vacaciones: ", _standardFont3));
            cellTrab7.BorderWidth = 0;

            cellTrab8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasVacaciones, _standardFont3));
            cellTrab8.BorderWidth = 0;

            cellTrab9 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cellTrab9.BorderWidth = 0;

            cellTrab10 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cellTrab10.BorderWidth = 0;

            pdfDiasTrabajados.AddCell(cellTrab1);
            pdfDiasTrabajados.AddCell(cellTrab2);
            pdfDiasTrabajados.AddCell(cellTrab3);
            pdfDiasTrabajados.AddCell(cellTrab4);
            pdfDiasTrabajados.AddCell(cellTrab5);
            pdfDiasTrabajados.AddCell(cellTrab6);
            pdfDiasTrabajados.AddCell(cellTrab7);
            pdfDiasTrabajados.AddCell(cellTrab8);
            pdfDiasTrabajados.AddCell(cellTrab9);
            pdfDiasTrabajados.AddCell(cellTrab10);

            doc.Add(pdfDiasTrabajados);

            /*********************DETALLE BOLETA******************************/
            iTextSharp.text.pdf.PdfPTable pdfDetalleBoleta = new iTextSharp.text.pdf.PdfPTable(6);
            pdfDetalleBoleta.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("REMUNERACIONES", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            cellBoleta1.BackgroundColor = iTextSharp.text.BaseColor.GRAY;
            cellBoleta1.BorderWidth = 0.75f;
            cellBoleta1.Colspan = 2;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("DESCUENTOS Y RETENCIONES", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            cellBoleta2.BackgroundColor = iTextSharp.text.BaseColor.GRAY;
            cellBoleta2.BorderWidth = 0.75f;
            cellBoleta2.Colspan = 2;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("APORTACIONES", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            cellBoleta3.BackgroundColor = iTextSharp.text.BaseColor.GRAY;
            cellBoleta3.BorderWidth = 0.75f;
            cellBoleta3.Colspan = 2;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);

            List<string> listaIngresos = new List<string>();
            List<string> listaDescuentos = new List<string>();
            List<string> listaAportaciones = new List<string>();

            /**************************LISTA DE INGRESOS*******************/

            if (obj.LicGoceHaber != "0.00")
                listaIngresos.Add("LICENCIA CON GOCE DE HABER" + "¬" + obj.LicGoceHaber);
            //listaIngresos.Add("VALE DE CONSUMO" + "," + obj.ValeD);

            if (obj.ValeD != "0.00")
                listaIngresos.Add("VALE DE CONSUMO" + "¬" + obj.ValeD);
                //listaIngresos.Add("VALE DE CONSUMO" + "," + obj.ValeD);

            if (obj.RemuneracionBasica != "0.00")
                listaIngresos.Add("REMUNERACIÓN BASICA" + "¬" + obj.RemuneracionBasica);
                //listaIngresos.Add("REMUNERACIÓN BASICA" + "," + obj.RemuneracionBasica);

            if (obj.AsignacionFamiliar != "0.00")
                listaIngresos.Add("ASIGNACIÓN FAMILIAR" + "¬" + obj.AsignacionFamiliar);
                //listaIngresos.Add("ASIGNACIÓN FAMILIAR" + "," + obj.AsignacionFamiliar);

            if (obj.Movilidad != "0.00")
                listaIngresos.Add("MOVILIDAD" + "¬" + obj.Movilidad);
            //listaIngresos.Add("MOVILIDAD" + "," + obj.Movilidad);

            if (obj.ReintegroNoAfecta != "0.00")
                listaIngresos.Add("REINTEGRO NO AFECTO" + "¬" + obj.ReintegroNoAfecta);
            //listaIngresos.Add("MOVILIDAD" + "," + obj.Movilidad);

            if (obj.NO_SUBSMATER != "0.00")
                listaIngresos.Add("SUBSIDIO MATERNIDAD" + "¬" + obj.NO_SUBSMATER);

            if (obj.NO_vacio2 != "0.00")
                listaIngresos.Add("SUBSIDIO PATERNIDAD" + "¬" + obj.NO_vacio2);

            if (obj.DescMedic != "0.00")
                listaIngresos.Add("DESCANSO MÉDICO" + "¬" + obj.DescMedic);
                //listaIngresos.Add("DESCANSO MÉDICO" + "," + obj.DescMedic);

            if (obj.BonifExt != "0.00")
                listaIngresos.Add("BONIFICACIÓN EXTRAORD." + "¬" + obj.BonifExt);
                //listaIngresos.Add("BONIFICACIÓN EXTRAORD." + "," + obj.BonifExt);

            if (obj.Vacaciones != "0.00")
                listaIngresos.Add("VACACIONES" + "¬" + obj.Vacaciones);
                //listaIngresos.Add("VACACIONES" + "," + obj.Vacaciones);

            if (obj.CompVacaciones != "0.00")
                listaIngresos.Add("COMPRA VACACIONES" + "¬" + obj.CompVacaciones);
                //listaIngresos.Add("COMPRA VACACIONES" + "," + obj.CompVacaciones);  

            if (obj.Subsidio != "0.00")
                listaIngresos.Add("SUBSIDIO" + "¬" + obj.Subsidio);
                //listaIngresos.Add("SUBSIDIO" + "," + obj.Subsidio);

            if (obj.HE != "0.00")
                listaIngresos.Add("HORAS EXTRAS" + "¬" + obj.HE);
                //listaIngresos.Add("HORAS EXTRAS" + "," + obj.HE);

            if (obj.HE135 != "0.00")
                listaIngresos.Add("HORAS EXTRAS SEGUNDAS" + "¬" + obj.HE135);
                //listaIngresos.Add("HORAS EXTRAS SEGUNDAS" + "," + obj.HE135);

            if (obj.Dobles != "0.00")
                listaIngresos.Add("HORAS EXTRAS DOBLES" + "¬" + obj.Dobles);
                //listaIngresos.Add("HORAS EXTRAS DOBLES" + "," + obj.Dobles);

            if (obj.PresNavidad1 != "0.00")
                listaIngresos.Add("PRÉSTAMO NAVIDAD" + "¬" + obj.PresNavidad1);
                //listaIngresos.Add("PRÉSTAMO NAVIDAD" + "," + obj.PresNavidad1);

            if (obj.Utilidades != "0.00")
                listaIngresos.Add("UTILIDADES" + "¬" + obj.Utilidades);
            //listaIngresos.Add("UTILIDADES" + "," + obj.Utilidades);

            if (obj.BonificaAfecta != "0.00")
                listaIngresos.Add("BONFICACIÓN AFECTA" + "¬" + obj.BonificaAfecta);
            //listaIngresos.Add("UTILIDADES" + "," + obj.Utilidades);

            /**************************LISTA DE DESCUENTOS*******************/

            if (obj.TDescuentos != "0.00")
                listaDescuentos.Add("HORAS DESCUENTOS" + "¬" + obj.TDescuentos);
                //listaDescuentos.Add("HORAS DESCUENTOS" + "," + obj.TDescuentos);

            if (obj.SegRimac != "0.00")
                listaDescuentos.Add("SEGURO RIMAC" + "¬" + obj.SegRimac);
                //listaDescuentos.Add("SEGURO RIMAC" + "," + obj.SegRimac);

            if (obj.ONP != "0.00")
                listaDescuentos.Add("DESCUENTO ONP" + "¬" + obj.ONP);
                //listaDescuentos.Add("DESCUENTO ONP" + "," + obj.ONP);
            else
            {
                listaDescuentos.Add("DESCUENTO AFP" + "¬" + obj.AFPFondo);
                listaDescuentos.Add("SEGURO AFP" + "¬" + obj.AFPSeguro);
                listaDescuentos.Add("COMISION AFP" + "¬" + obj.AFPComision);
                //listaDescuentos.Add("DESCUENTO AFP" + "," + obj.AFPFondo);
                //listaDescuentos.Add("SEGURO AFP" + "," + obj.AFPSeguro);
                //listaDescuentos.Add("COMISION AFP" + "," + obj.AFPComision);
            }

            if (obj.Quinta != "0.00")
                listaDescuentos.Add("QUINTA CATEGORÍA" + "¬" + obj.Quinta);
                //listaDescuentos.Add("QUINTA CATEGORÍA" + "," + obj.Quinta);

            if (obj.Adelanto != "0.00")
                listaDescuentos.Add("ADELANTO" + "¬" + obj.Adelanto);
                //listaDescuentos.Add("ADELANTO" + "," + obj.Adelanto);

            if (obj.EPS != "0.00")
                listaDescuentos.Add("EPS" + "¬" + obj.EPS);
                //listaDescuentos.Add("EPS" + "," + obj.EPS);
            //se elimino
            //if (obj.SegRimac != "0.00")
            //    listaDescuentos.Add("SEGURO RIMAC" + "¬" + obj.SegRimac);
                //listaDescuentos.Add("SEGURO RIMAC" + "," + obj.SegRimac);

            if (obj.PresNavidad2 != "0.00")
                listaDescuentos.Add("PRÉSTAMO NAVIDAD" + "¬" + obj.PresNavidad2);
            //listaDescuentos.Add("PRÉSTAMO NAVIDAD" + "," + obj.PresNavidad2);
            //se elimino
            //if (obj.Prestamos != "0.00")
            //    listaDescuentos.Add("PRÉSTAMOS" + "¬" + obj.Prestamos);
            //listaDescuentos.Add("PRÉSTAMOS" + "," + obj.Prestamos);

            if (obj.RetJudicial != "0.00")
                listaDescuentos.Add("RET. JUDICIAL" + "¬" + obj.RetJudicial);
            //listaDescuentos.Add("RET. JUDICIAL" + "," + obj.RetJudicial);
            //se agrego
            if (obj.DifPago != "0.00")
                listaDescuentos.Add("PRÉSTAMOS" + "¬" + obj.DifPago);
            //listaDescuentos.Add("PRÉSTAMOS" + "," + obj.Prestamos);

            if (obj.OtrosDescuentos != "0.00")
                listaDescuentos.Add("OTROS DESCUENTOS" + "¬" + obj.OtrosDescuentos);
                //listaDescuentos.Add("OTROS DESCUENTOS" + "," + obj.OtrosDescuentos);

            if (obj.AdelaUtilidades != "0.00")
                listaDescuentos.Add("ADELANTO UTILIDADES" + "¬" + obj.AdelaUtilidades);
            //listaDescuentos.Add("ADELANTO UTILIDADES" + "," + obj.AdelaUtilidades);

            if (obj.AdelaBonificacion != "0.00")
                listaDescuentos.Add("ADELANTO DE BONIFICACIÓN" + "¬" + obj.AdelaBonificacion);


            /**************************LISTA DE APORTACIONES*******************/

            if (obj.ESSALUD != "0.00")
                listaAportaciones.Add("APORTE ESSALUD" + "¬" + obj.ESSALUD);
                //listaAportaciones.Add("APORTE ESSALUD" + "," + obj.ESSALUD);

            /******************************************************************/

            int longIngresos = listaIngresos.Count;
            int longDescuentos = listaDescuentos.Count;
            int longAportaciones = listaAportaciones.Count;
            int longMayor = 0;

            if (longIngresos < longDescuentos)
                longMayor = longDescuentos;
            else
                longMayor = longIngresos;

            for (int r = 0; r < longMayor; r++)
            {
                if (r < longIngresos)
                {
                    string[] datos = listaIngresos[r].Split('¬');

                    cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos[0], _standardFont4));
                    cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta1.BorderWidth = 0f;
                    cellBoleta1.BorderWidthLeft = 0.75f;

                    cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos[1], _standardFont4));
                    cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta2.BorderWidth = 0f;
                    cellBoleta2.BorderWidthRight = 0.75f;

                }
                else
                {
                    cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
                    cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta1.BorderWidth = 0f;
                    cellBoleta1.BorderWidthLeft = 0.75f;

                    cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
                    cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta2.BorderWidth = 0f;
                    cellBoleta2.BorderWidthRight = 0.75f;
                }

                if (r < longDescuentos)
                {
                    string[] datos2 = listaDescuentos[r].Split('¬');

                    cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos2[0], _standardFont4));
                    cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta3.BorderWidth = 0f;

                    cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos2[1], _standardFont4));
                    cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta4.BorderWidth = 0f;
                    cellBoleta4.BorderWidthRight = 0.75f;

                }
                else
                {
                    cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta3.BorderWidth = 0f;

                    cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta4.BorderWidth = 0f;
                    cellBoleta4.BorderWidthRight = 0.75f;
                }

                if (r < longAportaciones)
                {
                    string[] datos3 = listaAportaciones[r].Split('¬');

                    cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos3[0], _standardFont4));
                    cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta5.BorderWidth = 0f;

                    cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos3[1], _standardFont4));
                    cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta6.BorderWidth = 0f;
                    cellBoleta6.BorderWidthRight = 0.75f;

                }
                else
                {
                    cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta5.BorderWidth = 0f;

                    cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta6.BorderWidth = 0f;
                    cellBoleta6.BorderWidthRight = 0.75f;
                }

                pdfDetalleBoleta.AddCell(cellBoleta1);
                pdfDetalleBoleta.AddCell(cellBoleta2);
                pdfDetalleBoleta.AddCell(cellBoleta3);
                pdfDetalleBoleta.AddCell(cellBoleta4);
                pdfDetalleBoleta.AddCell(cellBoleta5);
                pdfDetalleBoleta.AddCell(cellBoleta6);

            }

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            cellBoleta2.BorderWidthRight = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            cellBoleta2.BorderWidthRight = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            cellBoleta2.BorderWidthRight = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("TOTAL", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TotalAportes, _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);


            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("TOTAL INGRESOS", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;
            cellBoleta1.BorderWidthTop = 0.75f;
            cellBoleta1.BorderWidthBottom = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TIngresos, _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            //cellBoleta2.BorderWidthRight = 0.75f;
            cellBoleta2.BorderWidthTop = 0.75f;
            cellBoleta2.BorderWidthBottom = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("TOTAL DESCUENTOS", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;
            cellBoleta3.BorderWidthLeft = 0.75f;
            cellBoleta3.BorderWidthTop = 0.75f;
            cellBoleta3.BorderWidthBottom = 0.75f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TotalDescuentos, _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;
            cellBoleta4.BorderWidthTop = 0.75f;
            cellBoleta4.BorderWidthBottom = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("NETO RECIBIR", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;
            cellBoleta5.BorderWidthTop = 0.75f;
            cellBoleta5.BorderWidthBottom = 0.75f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.NetoPagar, _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;
            cellBoleta6.BorderWidthTop = 0.75f;
            cellBoleta6.BorderWidthBottom = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);

            doc.Add(pdfDetalleBoleta);

            /*********************PIE DETALLE BOLETA******************************/

            // Creamos una tabla que contendrá el nombre, apellido y país 
            // de nuestros visitante.
            iTextSharp.text.pdf.PdfPTable tblPrueba = new iTextSharp.text.pdf.PdfPTable(1);
            tblPrueba.WidthPercentage = 100;

            // Configuramos el título de las columnas de la tabla
            iTextSharp.text.pdf.PdfPCell clNombre = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Depositado en " + obj.Banco + " Cta. Nro. " + obj.CuentaBancaria, _standardFont3));
            clNombre.BorderWidth = 0;
            tblPrueba.AddCell(clNombre);

            // Finalmente, añadimos la tabla al documento PDF y cerramos el documento
            doc.Add(tblPrueba);

            //Agregamos firma digital
            //iTextSharp.text.Image imagen = iTextSharp.text.Image.GetInstance(Server.MapPath("~") + ConfigurationManager.AppSettings["rutaPDFFirmaDigital"].ToString());
            iTextSharp.text.Image imagen = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/imgSigned/firma.jpg"));
            imagen.BorderWidth = 0;
            imagen.Alignment = iTextSharp.text.Element.ALIGN_LEFT;
            float percentage = 0.0f;
            percentage = 150 / imagen.Width;
            imagen.ScalePercent(percentage * 100);

            // Insertamos la imagen en el documento
            doc.Add(imagen);

            iTextSharp.text.pdf.PdfPTable tblFirmas = new iTextSharp.text.pdf.PdfPTable(3);
            tblFirmas.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell firmaEmpleador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Firma Empleador", _standardFont2));
            firmaEmpleador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaEmpleador.BorderWidth = 0;
            firmaEmpleador.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell firmaEspacio = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" "));
            firmaEspacio.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell firmaTrabajador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Firma Trabajador", _standardFont2));
            firmaTrabajador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaTrabajador.BorderWidth = 0;
            firmaTrabajador.BorderWidthTop = 0.75f;

            tblFirmas.AddCell(firmaEmpleador);
            tblFirmas.AddCell(firmaEspacio);
            tblFirmas.AddCell(firmaTrabajador);

            doc.Add(tblFirmas);

            doc.Close();
            writer.Close();
        }

        public void Create_BoletaGratificacionPDF(BoletaGratificacion objBoletaGratificacion)
        {
            BoletaGratificacion obj = objBoletaGratificacion;

            string rutaPdf = ConfigurationManager.AppSettings["rutaPDFCreated"].ToString();

            string nombreArchivo = obj.IdDocumento + "-" + obj.Trabajador + "-" + obj.Mes + "-" + obj.Anio + ".pdf";
            // Creamos el documento con el tamaño de página tradicional
            iTextSharp.text.Document doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER);
            //// Indicamos donde vamos a guardar el documento
            iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, new System.IO.FileStream(Server.MapPath("~") + rutaPdf + nombreArchivo, System.IO.FileMode.Create));
            // Le colocamos el título y el autor
            // **Nota: Esto no será visible en el documento
            doc.AddTitle("PDF Planillas");
            doc.AddCreator("Luis Rojas");
            // Abrimos el archivo
            doc.Open();

            iTextSharp.text.Font _standardFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.TIMES_ROMAN, 14, iTextSharp.text.Font.BOLD, iTextSharp.text.BaseColor.BLACK);
            iTextSharp.text.Font _standardFont2 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 8, iTextSharp.text.Font.NORMAL, iTextSharp.text.BaseColor.BLACK);
            iTextSharp.text.Font _standardFont3 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 5, iTextSharp.text.Font.NORMAL, iTextSharp.text.BaseColor.BLACK);
            iTextSharp.text.Font _standardFont4 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 5, iTextSharp.text.Font.BOLD, iTextSharp.text.BaseColor.BLACK);

            // Escribimos el encabezamiento en el documento
            //doc.Add(new iTextSharp.text.Paragraph("WT SOURCING PERU S.A.C", _standardFont));


            iTextSharp.text.pdf.PdfPTable pdfLogo = new iTextSharp.text.pdf.PdfPTable(1);
            pdfLogo.DefaultCell.BorderWidth = 0;
            pdfLogo.WidthPercentage = 100;
            pdfLogo.DefaultCell.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;

            iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/img/logos/WTSLogo2.png"));
            jpg.ScaleToFit(120f, 90f);

            iTextSharp.text.pdf.PdfPCell cellLogo = new iTextSharp.text.pdf.PdfPCell(jpg);
            cellLogo.BorderWidth = 0;
            cellLogo.BorderWidthBottom = 0;

            pdfLogo.AddCell(cellLogo);

            doc.Add(pdfLogo);

            /********************* Cabecera ******************************/
            iTextSharp.text.pdf.PdfPTable pdfCabecera = new iTextSharp.text.pdf.PdfPTable(2);
            pdfCabecera.DefaultCell.BorderWidth = 0;
            pdfCabecera.WidthPercentage = 100;
            pdfCabecera.DefaultCell.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;

            //iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/img/logos/WTSLogo2.png"));
            //jpg.ScaleToFit(120f, 90f);

            //iTextSharp.text.pdf.PdfPCell cellLogo = new iTextSharp.text.pdf.PdfPCell(jpg);
            //cellLogo.BorderWidth = 0;
            //cellLogo.BorderWidthBottom = 0;


            iTextSharp.text.pdf.PdfPCell Izq = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Calle Aldabas 540 oficina 301", _standardFont2));
            Izq.BorderWidth = 0;
            Izq.BorderWidthBottom = 0;

            iTextSharp.text.pdf.PdfPCell Der = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Documento + "", _standardFont2));
            Der.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            Der.BorderWidth = 0;

            //pdfCabecera.AddCell(cellLogo);
            pdfCabecera.AddCell(Izq);
            pdfCabecera.AddCell(Der);

            Izq = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("RUC: 20522506410", _standardFont2));
            Izq.BorderWidth = 0;

            Der = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("EMPLEADO - " + obj.Mes + " " + obj.Anio, _standardFont2));
            Der.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            Der.BorderWidth = 0;

            pdfCabecera.AddCell(Izq);
            pdfCabecera.AddCell(Der);

            doc.Add(pdfCabecera);

            /*********************DATOS******************************/

            iTextSharp.text.pdf.PdfPTable pdfDatos = new iTextSharp.text.pdf.PdfPTable(8);
            pdfDatos.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Trabajador", _standardFont3));
            cell1.BorderWidth = 0;
            cell1.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Trabajador, _standardFont3));
            cell2.Colspan = 3;
            cell2.BorderWidth = 0;
            cell2.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Área de Trabajo", _standardFont3));
            cell5.BorderWidth = 0;
            cell5.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Area, _standardFont3));
            cell6.BorderWidth = 0;
            cell6.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell7.BorderWidth = 0;
            cell7.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell8.BorderWidth = 0;
            cell8.BorderWidthTop = 0.75f;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Cargo/Ocupación", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Cargo, _standardFont3));
            cell2.Colspan = 3;
            cell2.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fecha de Cese", _standardFont3));
            cell5.BorderWidth = 0;

            cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.FechaCese, _standardFont3));
            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);


            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fecha de Ingreso", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.FechaIngreso, _standardFont3));
            cell2.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Vacaciones", _standardFont3));
            cell5.BorderWidth = 0;

            //if (obj.InicioVacaciones != "")
            //    cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("desde: " + obj.InicioVacaciones, _standardFont3));
            //else
                cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("desde: " + obj.InicioVacaciones, _standardFont3));

            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("H.E.1:", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.HESimples + "h.", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Carnet Essalud", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.carnetEssalud, _standardFont3));
            cell2.BorderWidth = 0;

            cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;

            cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell5.BorderWidth = 0;

            //if (obj.FinVacaciones != "")
            //    cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("hasta: " + Convert.ToDateTime(obj.FinVacaciones).ToShortDateString(), _standardFont3));
            //else
                cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("hasta: " + obj.FinVacaciones, _standardFont3));

            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("H.E.2:", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.HESegundas + "h.", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fondo de Pensiones", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.AFP, _standardFont3));
            cell2.BorderWidth = 0;

            cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("C.U.S.P.P.  ", _standardFont3));
            cell3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cell3.BorderWidth = 0;

            cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.numCUSPP, _standardFont3));
            cell3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cell4.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell5.BorderWidth = 0;

            cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("H.E.Doble:", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.HEDobles + "h.", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("D.N.I.", _standardFont3));
            cell1.BorderWidth = 0;
            cell1.BorderWidthBottom = 0.75f;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Codigo, _standardFont3));
            cell2.BorderWidth = 0;
            cell2.BorderWidthBottom = 0.75f;

            cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;
            cell3.BorderWidthBottom = 0.75f;

            cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;
            cell4.BorderWidthBottom = 0.75f;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Cta de Ahorros", _standardFont3));
            cell5.BorderWidth = 0;
            cell5.BorderWidthBottom = 0.75f;

            cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.CuentaBancaria, _standardFont3));
            cell6.BorderWidth = 0;
            cell6.BorderWidthBottom = 0.75f;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell7.BorderWidth = 0;
            cell7.BorderWidthBottom = 0.75f;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell8.BorderWidth = 0;
            cell8.BorderWidthBottom = 0.75f;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            doc.Add(pdfDatos);

            /*********************DIAS TRABAJADOS******************************/
            iTextSharp.text.pdf.PdfPTable pdfDiasTrabajados = new iTextSharp.text.pdf.PdfPTable(10);
            pdfDiasTrabajados.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell cellTrab1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Trabajados: ", _standardFont3));
            cellTrab1.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasTrabajados, _standardFont3));
            cellTrab2.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Libres: ", _standardFont3));
            cellTrab3.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasLibres, _standardFont3));
            cellTrab4.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Subsidio Enfermedad: ", _standardFont3));
            cellTrab5.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasSubsidioEnfermedad, _standardFont3));
            cellTrab6.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días F/D: ", _standardFont3));
            cellTrab7.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.FeriadoDomingoLaborado, _standardFont3));
            cellTrab8.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab9 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días faltas: ", _standardFont3));
            cellTrab9.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab10 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasFalta, _standardFont3));
            cellTrab10.BorderWidth = 0;

            pdfDiasTrabajados.AddCell(cellTrab1);
            pdfDiasTrabajados.AddCell(cellTrab2);
            pdfDiasTrabajados.AddCell(cellTrab3);
            pdfDiasTrabajados.AddCell(cellTrab4);
            pdfDiasTrabajados.AddCell(cellTrab5);
            pdfDiasTrabajados.AddCell(cellTrab6);
            pdfDiasTrabajados.AddCell(cellTrab7);
            pdfDiasTrabajados.AddCell(cellTrab8);
            pdfDiasTrabajados.AddCell(cellTrab9);
            pdfDiasTrabajados.AddCell(cellTrab10);

            cellTrab1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Horas Trabajadas: ", _standardFont3));
            cellTrab1.BorderWidth = 0;

            cellTrab2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.HorasTrabajadas, _standardFont3));
            cellTrab2.BorderWidth = 0;

            cellTrab3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Desc. Médico: ", _standardFont3));
            cellTrab3.BorderWidth = 0;

            cellTrab4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasDescanzoMedico, _standardFont3));
            cellTrab4.BorderWidth = 0;

            if (obj.Sexo == "F")
                cellTrab5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Subsidio Maternidad: ", _standardFont3));
            else
                cellTrab5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Subsidio Paternidad: ", _standardFont3));

            cellTrab5.BorderWidth = 0;

            if (obj.Sexo == "F")
                cellTrab6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasSubsidioMaternidad, _standardFont3));
            else
                cellTrab6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasSubsidioPaternidad, _standardFont3));

            cellTrab6.BorderWidth = 0;

            cellTrab7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días Vacaciones: ", _standardFont3));
            cellTrab7.BorderWidth = 0;

            cellTrab8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasVacaciones, _standardFont3));
            cellTrab8.BorderWidth = 0;

            cellTrab9 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cellTrab9.BorderWidth = 0;

            cellTrab10 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cellTrab10.BorderWidth = 0;

            pdfDiasTrabajados.AddCell(cellTrab1);
            pdfDiasTrabajados.AddCell(cellTrab2);
            pdfDiasTrabajados.AddCell(cellTrab3);
            pdfDiasTrabajados.AddCell(cellTrab4);
            pdfDiasTrabajados.AddCell(cellTrab5);
            pdfDiasTrabajados.AddCell(cellTrab6);
            pdfDiasTrabajados.AddCell(cellTrab7);
            pdfDiasTrabajados.AddCell(cellTrab8);
            pdfDiasTrabajados.AddCell(cellTrab9);
            pdfDiasTrabajados.AddCell(cellTrab10);

            doc.Add(pdfDiasTrabajados);

            /*********************DETALLE BOLETA******************************/
            iTextSharp.text.pdf.PdfPTable pdfDetalleBoleta = new iTextSharp.text.pdf.PdfPTable(6);
            pdfDetalleBoleta.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("REMUNERACIONES", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            cellBoleta1.BackgroundColor = iTextSharp.text.BaseColor.GRAY;
            cellBoleta1.BorderWidth = 0.75f;
            cellBoleta1.Colspan = 2;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("DESCUENTOS Y RETENCIONES", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            cellBoleta2.BackgroundColor = iTextSharp.text.BaseColor.GRAY;
            cellBoleta2.BorderWidth = 0.75f;
            cellBoleta2.Colspan = 2;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("APORTACIONES", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            cellBoleta3.BackgroundColor = iTextSharp.text.BaseColor.GRAY;
            cellBoleta3.BorderWidth = 0.75f;
            cellBoleta3.Colspan = 2;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);

            List<string> listaIngresos = new List<string>();
            List<string> listaDescuentos = new List<string>();
            List<string> listaAportaciones = new List<string>();

            /**************************LISTA DE INGRESOS*******************/

            //if (obj.ValeD != "0.00")
            //    listaIngresos.Add("VALE DE CONSUMO" + "," + obj.ValeD);

            //if (obj.RemuneracionBasica != "0.00")
            //    listaIngresos.Add("REMUNERACION BASICA" + "," + obj.RemuneracionBasica);

            if (obj.AsignacionFamiliar != "0.00")
                listaIngresos.Add("ASIGNACIÓN FAMILIAR" + "¬" + obj.AsignacionFamiliar);
                //listaIngresos.Add("ASIGNACIÓN FAMILIAR" + "," + obj.AsignacionFamiliar);

            //if (obj.Movilidad != "0.00")
            //    listaIngresos.Add("MOVILIDAD" + "," + obj.Movilidad);

            //if (obj.DescMedic != "0.00")
            //    listaIngresos.Add("DESCANZO MEDICO" + "," + obj.DescMedic);

            if (obj.BonifExt != "0.00")
                listaIngresos.Add("BONIFICACIÓN EXTRAORD." + "¬" + obj.BonifExt);
                //listaIngresos.Add("BONIFICACIÓN EXTRAORD." + "," + obj.BonifExt);

            //if (obj.Vacaciones != "0.00")
            //    listaIngresos.Add("VACACIONES" + "," + obj.Vacaciones);

            //if (obj.CompVacaciones != "0.00")
            //    listaIngresos.Add("COMPRA VACACIONES" + "," + obj.CompVacaciones);

            //if (obj.Subsidio != "0.00")
            //    listaIngresos.Add("SUBSIDIO" + "," + obj.Subsidio);

            if (obj.HE != "0.00")
                listaIngresos.Add("HORAS EXTRAS" + "¬" + obj.HE);
                //listaIngresos.Add("HORAS EXTRAS" + "," + obj.HE);

            if (obj.OtrosIngresos != "0.00")
                listaIngresos.Add("OTROS INGRESOS" + "¬" + obj.OtrosIngresos);
                //listaIngresos.Add("OTROS INGRESOS" + "," + obj.OtrosIngresos);

            if (obj.Gratificacion != "0.00")
                listaIngresos.Add("GRATIFICACIÓN" + "¬" + obj.Gratificacion);
                //listaIngresos.Add("GRATIFICACIÓN" + "," + obj.Gratificacion);

            //if (obj.HE135 != "0.00")
            //    listaIngresos.Add("HORAS EXTRAS SEGUNDAS" + "," + obj.HE135);

            //if (obj.Dobles != "0.00")
            //    listaIngresos.Add("HORAS EXTRAS DOBLES" + "," + obj.Dobles);

            //if (obj.PresNavidad1 != "0.00")
            //    listaIngresos.Add("PRESTAMO NAVIDAD" + "," + obj.PresNavidad1);

            //if (obj.Utilidades != "0.00")
            //    listaIngresos.Add("UTILIDADES" + "," + obj.Utilidades);

            /**************************LISTA DE DESCUENTOS*******************/

            if (obj.TDescuentos != "0.00")
                listaDescuentos.Add("HORAS DESCUENTOS" + "¬" + obj.TDescuentos);
                //listaDescuentos.Add("HORAS DESCUENTOS" + "," + obj.TDescuentos);

            //if (obj.SegRimac != "0.00")
            //    listaDescuentos.Add("SEGURO RIMAC" + "," + obj.SegRimac);

            //if (obj.ONP != "0.00")
            //    listaDescuentos.Add("DESCUENTO ONP" + "," + obj.ONP);
            //else
            //{
            //    listaDescuentos.Add("DESCUENTO AFP" + "," + obj.AFPFondo);
            //    listaDescuentos.Add("SEGURO AFP" + "," + obj.AFPSeguro);
            //    listaDescuentos.Add("COMISION AFP" + "," + obj.AFPComision);
            //}

            //if (obj.Quinta != "0.00")
            //    listaDescuentos.Add("QUINTA CATEGORIA" + "," + obj.Quinta);

            if (obj.Adelanto != "0.00")
                listaDescuentos.Add("ADELANTO" + "¬" + obj.Adelanto);
                //listaDescuentos.Add("ADELANTO" + "," + obj.Adelanto);

            //if (obj.EPS != "0.00")
            //    listaDescuentos.Add("EPS" + "," + obj.EPS);

            //if (obj.SegRimac != "0.00")
            //    listaDescuentos.Add("SEGURO RIMAC" + "," + obj.SegRimac);

            //if (obj.PresNavidad2 != "0.00")
            //    listaDescuentos.Add("PRESTAMO NAVIDAD" + "," + obj.PresNavidad2);

            //if (obj.Prestamos != "0.00")
            //    listaDescuentos.Add("PRESTAMOS" + "," + obj.Prestamos);

            if (obj.RetJudicial != "0.00")
                listaDescuentos.Add("RET. JUDICIAL" + "¬" + obj.RetJudicial);
                //listaDescuentos.Add("RET. JUDICIAL" + "," + obj.RetJudicial);

            if (obj.DifPago != "0.00")
                listaDescuentos.Add("PRÉSTAMOS" + "¬" + obj.DifPago);
                //listaDescuentos.Add("PRÉSTAMOS" + "," + obj.DifPago);

            //if (obj.OtrosDescuentos != "0.00")
            //    listaDescuentos.Add("OTROS DESCUENTOS" + "," + obj.OtrosDescuentos);

            //if (obj.AdelaUtilidades != "0.00")
            //    listaDescuentos.Add("ADELANTO UTILIDADES" + "," + obj.AdelaUtilidades);

            /**************************LISTA DE APORTACIONES*******************/

            //if (obj.Suspension != "0.00")
            //    listaAportaciones.Add("SUSPENSION" + "," + obj.Suspension);

            //if (obj.OtrosIngresos != "0.00")
            //    listaAportaciones.Add("OTROS INGRESOS" + "," + obj.OtrosIngresos);

            //if (obj.Gratificacion != "0.00")
            //    listaAportaciones.Add("GRATIFICACION" + "," + obj.Gratificacion);

            //if (obj.DifPago != "0.00")
            //    listaAportaciones.Add("DIFERENCIA DE PAGOS" + "," + obj.DifPago);
            /******************************************************************/

            int longIngresos = listaIngresos.Count;
            int longDescuentos = listaDescuentos.Count;
            int longAportaciones = listaAportaciones.Count;
            int longMayor = 0;

            if (longIngresos < longDescuentos)
                longMayor = longDescuentos;
            else
                longMayor = longIngresos;

            for (int r = 0; r < longMayor; r++)
            {
                if (r < longIngresos)
                {
                    string[] datos = listaIngresos[r].Split('¬');

                    cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos[0], _standardFont4));
                    cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta1.BorderWidth = 0f;
                    cellBoleta1.BorderWidthLeft = 0.75f;

                    cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos[1], _standardFont4));
                    cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta2.BorderWidth = 0f;
                    cellBoleta2.BorderWidthRight = 0.75f;

                }
                else
                {
                    cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
                    cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta1.BorderWidth = 0f;
                    cellBoleta1.BorderWidthLeft = 0.75f;

                    cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
                    cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta2.BorderWidth = 0f;
                    cellBoleta2.BorderWidthRight = 0.75f;
                }

                if (r < longDescuentos)
                {
                    string[] datos2 = listaDescuentos[r].Split('¬');

                    cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos2[0], _standardFont4));
                    cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta3.BorderWidth = 0f;

                    cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos2[1], _standardFont4));
                    cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta4.BorderWidth = 0f;
                    cellBoleta4.BorderWidthRight = 0.75f;

                }
                else
                {
                    cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta3.BorderWidth = 0f;

                    cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta4.BorderWidth = 0f;
                    cellBoleta4.BorderWidthRight = 0.75f;
                }

                if (r < longAportaciones)
                {
                    string[] datos3 = listaAportaciones[r].Split('¬');

                    cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos3[0], _standardFont4));
                    cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta5.BorderWidth = 0f;

                    cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos3[1], _standardFont4));
                    cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta6.BorderWidth = 0f;
                    cellBoleta6.BorderWidthRight = 0.75f;

                }
                else
                {
                    cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta5.BorderWidth = 0f;

                    cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta6.BorderWidth = 0f;
                    cellBoleta6.BorderWidthRight = 0.75f;
                }

                pdfDetalleBoleta.AddCell(cellBoleta1);
                pdfDetalleBoleta.AddCell(cellBoleta2);
                pdfDetalleBoleta.AddCell(cellBoleta3);
                pdfDetalleBoleta.AddCell(cellBoleta4);
                pdfDetalleBoleta.AddCell(cellBoleta5);
                pdfDetalleBoleta.AddCell(cellBoleta6);

            }

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            cellBoleta2.BorderWidthRight = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            cellBoleta2.BorderWidthRight = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            cellBoleta2.BorderWidthRight = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("TOTAL", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TotalAportes, _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);


            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("TOTAL INGRESOS", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;
            cellBoleta1.BorderWidthTop = 0.75f;
            cellBoleta1.BorderWidthBottom = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TIngresos, _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            //cellBoleta2.BorderWidthRight = 0.75f;
            cellBoleta2.BorderWidthTop = 0.75f;
            cellBoleta2.BorderWidthBottom = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("TOTAL DESCUENTOS", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;
            cellBoleta3.BorderWidthLeft = 0.75f;
            cellBoleta3.BorderWidthTop = 0.75f;
            cellBoleta3.BorderWidthBottom = 0.75f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TotalDescuentos, _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;
            cellBoleta4.BorderWidthTop = 0.75f;
            cellBoleta4.BorderWidthBottom = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("NETO RECIBIR", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;
            cellBoleta5.BorderWidthTop = 0.75f;
            cellBoleta5.BorderWidthBottom = 0.75f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.NetoPagar, _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;
            cellBoleta6.BorderWidthTop = 0.75f;
            cellBoleta6.BorderWidthBottom = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);

            doc.Add(pdfDetalleBoleta);

            /*********************PIE DETALLE BOLETA******************************/

            // Creamos una tabla que contendrá el nombre, apellido y país 
            // de nuestros visitante.
            iTextSharp.text.pdf.PdfPTable tblPrueba = new iTextSharp.text.pdf.PdfPTable(1);
            tblPrueba.WidthPercentage = 100;

            // Configuramos el título de las columnas de la tabla
            iTextSharp.text.pdf.PdfPCell clNombre = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Depositado en " + obj.Banco + " Cta. Nro. " + obj.CuentaBancaria, _standardFont3));
            clNombre.BorderWidth = 0;
            tblPrueba.AddCell(clNombre);

            // Finalmente, añadimos la tabla al documento PDF y cerramos el documento
            doc.Add(tblPrueba);

            //Agregamos firma digital
            //iTextSharp.text.Image imagen = iTextSharp.text.Image.GetInstance(Server.MapPath("~") + ConfigurationManager.AppSettings["rutaPDFFirmaDigital"].ToString());
            iTextSharp.text.Image imagen = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/imgSigned/firma.jpg"));
            imagen.BorderWidth = 0;
            imagen.Alignment = iTextSharp.text.Element.ALIGN_LEFT;
            float percentage = 0.0f;
            percentage = 150 / imagen.Width;
            imagen.ScalePercent(percentage * 100);

            // Insertamos la imagen en el documento
            doc.Add(imagen);

            iTextSharp.text.pdf.PdfPTable tblFirmas = new iTextSharp.text.pdf.PdfPTable(3);
            tblFirmas.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell firmaEmpleador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Firma Empleador", _standardFont2));
            firmaEmpleador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaEmpleador.BorderWidth = 0;
            firmaEmpleador.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell firmaEspacio = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" "));
            firmaEspacio.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell firmaTrabajador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Firma Trabajador", _standardFont2));
            firmaTrabajador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaTrabajador.BorderWidth = 0;
            firmaTrabajador.BorderWidthTop = 0.75f;

            tblFirmas.AddCell(firmaEmpleador);
            tblFirmas.AddCell(firmaEspacio);
            tblFirmas.AddCell(firmaTrabajador);

            doc.Add(tblFirmas);

            doc.Close();
            writer.Close();
        }

        public void Create_CertificadoCTS(CertificadoCTS objCertificadoCTS)
        {
            CertificadoCTS obj = objCertificadoCTS;
            string rutaPdf = ConfigurationManager.AppSettings["rutaPDFCreated"].ToString();
            string nombreArchivo = obj.IdDocumento + "-" + obj.Trabajador + "-" + obj.Mes + "-" + obj.Anio + ".pdf";
            
            string mesanterior = "";
            //string diadepo = Convert.ToDateTime(obj.FechaDeposito).ToString("dd");
            string diadepo = Convert.ToDateTime(obj.FechaDeposito).Day.ToString();

            if (obj.Mes == "MAYO") { mesanterior = "ABRIL"; }
            if (obj.Mes == "NOVIEMBRE") { mesanterior = "OCTUBRE"; }
            
            iTextSharp.text.Document doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER);
            iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, new System.IO.FileStream(Server.MapPath("~") + rutaPdf + nombreArchivo, System.IO.FileMode.Create));
            doc.AddTitle("PDF Planillas");
            doc.AddCreator("Luis Rojas");
            doc.Open();            

            iTextSharp.text.Font _standarddata = new iTextSharp.text.Font();
            _standarddata.SetStyle(iTextSharp.text.Font.NORMAL);
            _standarddata.SetFamily(iTextSharp.text.Font.FontFamily.HELVETICA.ToString());
            _standarddata.Size = 8;

            iTextSharp.text.Font _standardtitulo = new iTextSharp.text.Font();
            _standardtitulo.SetStyle(iTextSharp.text.Font.UNDERLINE | iTextSharp.text.Font.BOLD);
            _standardtitulo.SetFamily(iTextSharp.text.Font.FontFamily.HELVETICA.ToString());
            _standardtitulo.Size = 8;

            //Creamos el Documento
            iTextSharp.text.pdf.PdfPTable pdfLogo = new iTextSharp.text.pdf.PdfPTable(1);
            pdfLogo.DefaultCell.BorderWidth = 0;
            pdfLogo.WidthPercentage = 100;
            pdfLogo.DefaultCell.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;

            //Agregamos el Logo
            iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/img/logos/WTSLogo2.png"));
            jpg.ScaleToFit(120f, 90f);

            iTextSharp.text.pdf.PdfPCell cellLogo = new iTextSharp.text.pdf.PdfPCell(jpg);
            cellLogo.BorderWidth = 0;
            cellLogo.BorderWidthBottom = 0;
            cellLogo.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            pdfLogo.AddCell(cellLogo);

            doc.Add(pdfLogo);

            //Agregamos el Titulo
            iTextSharp.text.pdf.PdfPTable pdfTitulo = new iTextSharp.text.pdf.PdfPTable(1);
            pdfTitulo.WidthPercentage = 100;
            
            iTextSharp.text.pdf.PdfPCell titulo1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("LIQUIDACIÓN POR TIEMPO DE SERVICIOS", _standardtitulo));
            titulo1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            titulo1.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell titulo2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("DEPOSITO SEMESTRAL", _standardtitulo));
            titulo2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;            
            titulo2.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell titulo3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("T.U.O. D.LEG. No 650", _standardtitulo));
            titulo3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            titulo3.BorderWidth = 0;

            pdfTitulo.AddCell(titulo1);
            pdfTitulo.AddCell(titulo2);
            pdfTitulo.AddCell(titulo3);

            doc.Add(pdfTitulo);

            // Agregamos cabecera
            iTextSharp.text.pdf.PdfPTable pdfcabecera = new iTextSharp.text.pdf.PdfPTable(5);
            pdfcabecera.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell cabizq1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("COMPAÑIA", _standarddata));
            cabizq1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cabizq1.PaddingTop = 15;
            cabizq1.PaddingLeft = 100;
            cabizq1.BorderWidth = 0;
            cabizq1.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell cabcen1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":  WT SOURCING PERU S.A.C", _standarddata));
            cabcen1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cabcen1.PaddingTop = 15;
            cabcen1.BorderWidth = 0;
            cabcen1.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell cabizq2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("RUC", _standarddata));
            cabizq2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cabizq2.PaddingLeft = 100;
            cabizq2.BorderWidth = 0;
            cabizq2.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell cabcen2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":  20522506410", _standarddata));
            cabcen2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cabcen2.BorderWidth = 0;
            cabcen2.Colspan = 3;
            
            iTextSharp.text.pdf.PdfPCell cabizq3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("DOMICILIO", _standarddata));
            cabizq3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cabizq3.PaddingLeft = 100;
            cabizq3.PaddingBottom = 10;
            cabizq3.BorderWidth = 0;
            cabizq3.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell cabcen3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":  CALLE ALDABAS 540 OFICINA 301", _standarddata));
            cabcen3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cabcen3.BorderWidth = 0;
            cabcen3.PaddingBottom = 10;
            cabcen3.Colspan = 3;
            
            pdfcabecera.AddCell(cabizq1);
            pdfcabecera.AddCell(cabcen1);
            pdfcabecera.AddCell(cabizq2);
            pdfcabecera.AddCell(cabcen2);
            pdfcabecera.AddCell(cabizq3);
            pdfcabecera.AddCell(cabcen3);

            doc.Add(pdfcabecera);

            // Agregar Datos Personal

            iTextSharp.text.pdf.PdfPTable pdfdatatitulo = new iTextSharp.text.pdf.PdfPTable(5);
            pdfdatatitulo.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell titulodetizq = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("DATOS DE PERSONAL", _standardtitulo));
            titulodetizq.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            titulodetizq.BorderWidth= 0;
            titulodetizq.BorderWidthTop = 0.7f;
            titulodetizq.PaddingTop = 15;
            titulodetizq.PaddingLeft = 100;
            titulodetizq.Colspan = 2;
            
            iTextSharp.text.pdf.PdfPCell titulodetcen = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" "));
            titulodetcen.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            titulodetcen.BorderWidth = 0;
            titulodetcen.BorderWidthTop = 0.7f;
            titulodetcen.PaddingTop = 15;
            titulodetcen.Colspan = 3;

            pdfdatatitulo.AddCell(titulodetizq);
            pdfdatatitulo.AddCell(titulodetcen);

            doc.Add(pdfdatatitulo);
            
            // Agregar data
            iTextSharp.text.pdf.PdfPTable pdfdata = new iTextSharp.text.pdf.PdfPTable(5);
            pdfdata.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell dataizq1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Apellidos y Nombres", _standarddata));
            dataizq1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            dataizq1.BorderWidth = 0;
            dataizq1.PaddingLeft = 100;
            dataizq1.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datacen1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":     " + obj.Trabajador, _standarddata));
            datacen1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datacen1.BorderWidth = 0;
            datacen1.Colspan = 3;            

            iTextSharp.text.pdf.PdfPCell dataizq2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fecha de Ingreso", _standarddata));
            dataizq2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            dataizq2.BorderWidth = 0;
            dataizq2.PaddingLeft = 100;
            dataizq2.Colspan = 2;
            
            iTextSharp.text.pdf.PdfPCell datacen2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":     " + obj.FechaIngreso, _standarddata));
            datacen2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datacen2.BorderWidth = 0;
            datacen2.Colspan = 3;
            
            iTextSharp.text.pdf.PdfPCell dataizq3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Documento de Identidad", _standarddata));
            dataizq3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            dataizq3.BorderWidth = 0;
            dataizq3.PaddingLeft = 100;
            dataizq3.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datacen3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":     " + obj.Codigo, _standarddata));
            datacen3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datacen3.BorderWidth = 0;
            datacen3.Colspan = 3;
            
            pdfdata.AddCell(dataizq1);
            pdfdata.AddCell(datacen1);
            pdfdata.AddCell(dataizq2);
            pdfdata.AddCell(datacen2);
            pdfdata.AddCell(dataizq3);
            pdfdata.AddCell(datacen3);

            doc.Add(pdfdata);

            // Agregar data
            iTextSharp.text.pdf.PdfPTable pdfremuneracion = new iTextSharp.text.pdf.PdfPTable(1);
            pdfremuneracion.WidthPercentage = 100;
            
            iTextSharp.text.pdf.PdfPCell inforem = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("REMUNERACIÓN COMPUTABLE AL MES DE " + mesanterior + " DEL " + obj.Anio, _standarddata));
            inforem.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            inforem.BorderWidth = 0;
            inforem.PaddingLeft = 100;
            inforem.PaddingTop = 10;
            inforem.PaddingBottom = 10;

            pdfremuneracion.AddCell(inforem);

            doc.Add(pdfremuneracion);

            // Agregar data remuneracion
            iTextSharp.text.pdf.PdfPTable pdfdatarem = new iTextSharp.text.pdf.PdfPTable(7);
            pdfdatarem.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell dataremizq1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Haber Básico", _standarddata));
            dataremizq1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            dataremizq1.BorderWidth = 0;
            dataremizq1.PaddingLeft = 100;
            dataremizq1.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell dataremcen1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            dataremcen1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremcen1.BorderWidth = 0;
            dataremcen1.Colspan = 1;


            iTextSharp.text.pdf.PdfPCell dataremder1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.SueldoBase, _standarddata));
            dataremder1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremder1.BorderWidth = 0;
            dataremder1.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex1.BorderWidth = 0;
            ex1.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell dataremizq2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Asignación Familiar", _standarddata));
            dataremizq2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            dataremizq2.BorderWidth = 0;
            dataremizq2.PaddingLeft = 100;
            dataremizq2.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell dataremcen2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            dataremcen2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremcen2.BorderWidth = 0;
            dataremcen2.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell dataremder2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.AsignacionFamiliar, _standarddata));
            dataremder2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremder2.BorderWidth = 0;
            dataremder2.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex2.BorderWidth = 0;
            ex2.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell dataremizq3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Horas Extras", _standarddata));
            dataremizq3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            dataremizq3.BorderWidth = 0;
            dataremizq3.PaddingLeft = 100;
            dataremizq3.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell dataremcen3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            dataremcen3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremcen3.BorderWidth = 0;
            dataremcen3.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell dataremder3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.HE, _standarddata));
            dataremder3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremder3.BorderWidth = 0;
            dataremder3.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex3.BorderWidth = 0;
            ex3.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell dataremizq4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("1/6 Gratificación", _standarddata));
            dataremizq4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            dataremizq4.BorderWidth = 0;
            dataremizq4.PaddingLeft = 100;
            dataremizq4.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell dataremcen4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            dataremcen4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremcen4.BorderWidth = 0;
            dataremcen4.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell dataremder4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Gratificacion, _standarddata));
            dataremder4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremder4.BorderWidth = 0;
            dataremder4.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex4.BorderWidth = 0;
            ex4.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell dataremizq5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Vacaciones Pagadas", _standarddata));
            dataremizq5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            dataremizq5.BorderWidth = 0;
            dataremizq5.PaddingLeft = 100;
            dataremizq5.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell dataremcen5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            dataremcen5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremcen5.BorderWidth = 0;
            dataremcen5.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell dataremder5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.ImpComisiones, _standarddata));
            dataremder5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremder5.BorderWidth = 0;
            dataremder5.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex5.BorderWidth = 0;
            ex5.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell dataremizq6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Otros", _standarddata));
            dataremizq6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            dataremizq6.BorderWidth = 0;
            dataremizq6.PaddingLeft = 100;
            dataremizq6.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell dataremcen6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            dataremcen6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremcen6.BorderWidth = 0;
            dataremcen6.Colspan = 1;

            double resultado = Convert.ToDouble(obj.Otros) + Convert.ToDouble(obj.ImpRefrigerio);

            iTextSharp.text.pdf.PdfPCell dataremder6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(resultado.ToString("#.00"), _standarddata));
            dataremder6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremder6.BorderWidth = 0;
            dataremder6.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex6.BorderWidth = 0;
            ex6.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell dataremizq7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Total Remuneración Computable", _standarddata));
            dataremizq7.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            dataremizq7.BorderWidth = 0;
            dataremizq7.PaddingLeft = 100;
            dataremizq7.PaddingBottom = 10;
            dataremizq7.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell dataremcen7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            dataremcen7.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremcen7.BorderWidth = 0;
            dataremcen7.BorderWidthTop = 0.7f;
            dataremcen7.PaddingBottom = 10;
            dataremcen7.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell dataremder7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.ImpRemuneracion, _standarddata));
            dataremder7.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            dataremder7.BorderWidth = 0;
            dataremder7.BorderWidthTop = 0.7f;
            dataremder7.PaddingBottom = 10;
            dataremder7.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex7.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex7.BorderWidth = 0;
            ex7.PaddingBottom = 10;
            ex7.Colspan = 2;

            pdfdatarem.AddCell(dataremizq1);
            pdfdatarem.AddCell(dataremcen1);
            pdfdatarem.AddCell(dataremder1);
            pdfdatarem.AddCell(ex1);
            pdfdatarem.AddCell(dataremizq2);
            pdfdatarem.AddCell(dataremcen2);
            pdfdatarem.AddCell(dataremder2);
            pdfdatarem.AddCell(ex2);
            pdfdatarem.AddCell(dataremizq3);
            pdfdatarem.AddCell(dataremcen3);
            pdfdatarem.AddCell(dataremder3);
            pdfdatarem.AddCell(ex3);
            pdfdatarem.AddCell(dataremizq4);
            pdfdatarem.AddCell(dataremcen4);
            pdfdatarem.AddCell(dataremder4);
            pdfdatarem.AddCell(ex4);
            pdfdatarem.AddCell(dataremizq5);
            pdfdatarem.AddCell(dataremcen5);
            pdfdatarem.AddCell(dataremder5);
            pdfdatarem.AddCell(ex5);
            pdfdatarem.AddCell(dataremizq6);
            pdfdatarem.AddCell(dataremcen6);
            pdfdatarem.AddCell(dataremder6);
            pdfdatarem.AddCell(ex6);
            pdfdatarem.AddCell(dataremizq7);
            pdfdatarem.AddCell(dataremcen7);
            pdfdatarem.AddCell(dataremder7);
            pdfdatarem.AddCell(ex7);

            doc.Add(pdfdatarem);

            //Agregar datos pago
            iTextSharp.text.pdf.PdfPTable pdfdatapago = new iTextSharp.text.pdf.PdfPTable(5);
            pdfdatapago.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell datapagoizq1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Entidad Depositaria", _standarddata));
            datapagoizq1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datapagoizq1.BorderWidth = 0;
            datapagoizq1.BorderWidthTop = 0.7f;
            datapagoizq1.PaddingTop = 15;
            datapagoizq1.PaddingLeft = 100;
            datapagoizq1.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datapagocen1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":     " + obj.Banco, _standarddata));
            datapagocen1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datapagocen1.BorderWidth = 0;
            datapagocen1.BorderWidthTop = 0.7f;
            datapagocen1.PaddingTop = 15;
            datapagocen1.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell datapagoizq2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Nro. de Cuenta", _standarddata));
            datapagoizq2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datapagoizq2.BorderWidth = 0;
            datapagoizq2.PaddingLeft = 100;
            datapagoizq2.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datapagocen2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":     " + obj.CuentaBancaria, _standarddata));
            datapagocen2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datapagocen2.BorderWidth = 0;
            datapagocen2.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell datapagoizq3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Tipo Moneda", _standarddata));
            datapagoizq3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datapagoizq3.BorderWidth = 0;
            datapagoizq3.PaddingLeft = 100;
            datapagoizq3.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datapagocen3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":     SOLES", _standarddata));
            datapagocen3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datapagocen3.BorderWidth = 0;
            datapagocen3.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell datapagoizq4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fecha Depósito", _standarddata));
            datapagoizq4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datapagoizq4.BorderWidth = 0;
            datapagoizq4.PaddingLeft = 100;
            datapagoizq4.PaddingBottom = 10;
            datapagoizq4.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datapagocen4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":     " + diadepo + " DE " + obj.Mes + " DEL " + obj.Anio, _standarddata));
            datapagocen4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datapagocen4.BorderWidth = 0;
            datapagocen4.PaddingBottom = 10;
            datapagocen4.Colspan = 3;

            pdfdatapago.AddCell(datapagoizq1);
            pdfdatapago.AddCell(datapagocen1);
            pdfdatapago.AddCell(datapagoizq2);
            pdfdatapago.AddCell(datapagocen2);
            pdfdatapago.AddCell(datapagoizq3);
            pdfdatapago.AddCell(datapagocen3);
            pdfdatapago.AddCell(datapagoizq4);
            pdfdatapago.AddCell(datapagocen4);

            doc.Add(pdfdatapago);

            //Agregar detalle de tiempo
            iTextSharp.text.pdf.PdfPTable pdfdatatime = new iTextSharp.text.pdf.PdfPTable(7);
            pdfdatatime.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell datatimeizq1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Periodo de servicio a liquidar", _standarddata));
            datatimeizq1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datatimeizq1.BorderWidth = 0;
            datatimeizq1.BorderWidthTop = 0.7f;
            datatimeizq1.PaddingTop = 15;
            datatimeizq1.PaddingLeft = 100;
            datatimeizq1.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell datatimeder1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":     " + obj.PeriodoLiquidar, _standarddata));
            datatimeder1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datatimeder1.BorderWidth = 0;
            datatimeder1.BorderWidthTop = 0.7f;
            datatimeder1.PaddingTop = 15;
            datatimeder1.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell ex8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex8.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex8.BorderWidth = 0;
            ex8.BorderWidthTop = 0.7f;
            ex8.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datatimeizq2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Tiempo a liquidar", _standarddata));
            datatimeizq2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datatimeizq2.BorderWidth = 0;
            datatimeizq2.PaddingLeft = 100;
            datatimeizq2.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell datatimeder2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(":     " + obj.NumeroMes + " MESES.", _standarddata));
            datatimeder2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datatimeder2.BorderWidth = 0;
            datatimeder2.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell ex9 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex9.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex9.BorderWidth = 0;
            ex9.Colspan = 2;

            pdfdatatime.AddCell(datatimeizq1);
            pdfdatatime.AddCell(datatimeder1);
            pdfdatatime.AddCell(ex8);
            pdfdatatime.AddCell(datatimeizq2);
            pdfdatatime.AddCell(datatimeder2);
            pdfdatatime.AddCell(ex9);

            doc.Add(pdfdatatime);

            //Agregar Detalle 
            iTextSharp.text.pdf.PdfPTable pdfdatadet = new iTextSharp.text.pdf.PdfPTable(7);
            pdfdatadet.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell datadetizq1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Liquidación por tiempo de servicios", _standarddata));
            datadetizq1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datadetizq1.BorderWidth = 0;
            datadetizq1.PaddingLeft = 100;
            datadetizq1.PaddingTop = 10;
            datadetizq1.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell datadetcen1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            datadetcen1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datadetcen1.BorderWidth = 0;
            datadetcen1.PaddingTop = 10;
            datadetcen1.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell datadetder1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Total", _standarddata));
            datadetder1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            datadetder1.BorderWidth = 0;
            datadetder1.PaddingTop = 10;
            datadetder1.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex10 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex10.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex10.BorderWidth = 0;
            ex10.PaddingTop = 10;
            ex10.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datadetizq2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.   " + obj.ImpRemuneracion + " /12 X " + obj.NumeroMes + " MESES" , _standarddata));
            datadetizq2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            datadetizq2.BorderWidth = 0;
            datadetizq2.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell datadetcen2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("=", _standarddata));
            datadetcen2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            datadetcen2.BorderWidth = 0;
            datadetcen2.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell datadetder2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.ImpCTS, _standarddata));
            datadetder2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            datadetder2.BorderWidth = 0;
            datadetder2.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex11 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex11.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex11.BorderWidth = 0;
            ex11.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datadetizq3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Total a depositar", _standarddata));
            datadetizq3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datadetizq3.BorderWidth = 0;
            datadetizq3.PaddingLeft = 100;
            datadetizq3.PaddingTop = 20;
            datadetizq3.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell datadetcen3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            datadetcen3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datadetcen3.BorderWidth = 0;
            datadetcen3.PaddingTop = 20;
            datadetcen3.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell datadetder3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.ImpCTS, _standarddata));
            datadetder3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            datadetder3.BorderWidth = 0;
            datadetder3.PaddingTop = 20;
            datadetder3.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex12 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex12.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex12.BorderWidth = 0;
            ex12.PaddingTop = 20;
            ex12.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datadetizq4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Total Depositado", _standarddata));
            datadetizq4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datadetizq4.BorderWidth = 0;
            datadetizq4.PaddingLeft = 100;
            datadetizq4.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell datadetcen4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            datadetcen4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datadetcen4.BorderWidth = 0;
            datadetcen4.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell datadetder4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.ImpCTS, _standarddata));
            datadetder4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            datadetder4.BorderWidth = 0;
            datadetder4.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex13 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex13.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex13.BorderWidth = 0;
            ex13.Colspan = 2;

            iTextSharp.text.pdf.PdfPCell datadetizq5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("T.C S/.", _standarddata));
            datadetizq5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datadetizq5.BorderWidth = 0;
            datadetizq5.PaddingLeft = 100;
            datadetizq5.PaddingBottom = 20;
            datadetizq5.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell datadetcen5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            datadetcen5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            datadetcen5.BorderWidth = 0;
            datadetcen5.PaddingBottom = 20;
            datadetcen5.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell datadetder5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TipoCambio, _standarddata));
            datadetder5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            datadetder5.BorderWidth = 0;
            datadetder5.PaddingBottom = 20;
            datadetder5.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell ex14 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            ex14.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            ex14.BorderWidth = 0;
            ex14.PaddingBottom = 20;
            ex14.Colspan = 2;

            pdfdatadet.AddCell(datadetizq1);
            pdfdatadet.AddCell(datadetcen1);
            pdfdatadet.AddCell(datadetder1);
            pdfdatadet.AddCell(ex10);
            pdfdatadet.AddCell(datadetizq2);
            pdfdatadet.AddCell(datadetcen2);
            pdfdatadet.AddCell(datadetder2);
            pdfdatadet.AddCell(ex11);
            pdfdatadet.AddCell(datadetizq3);
            pdfdatadet.AddCell(datadetcen3);
            pdfdatadet.AddCell(datadetder3);
            pdfdatadet.AddCell(ex12);
            pdfdatadet.AddCell(datadetizq4);
            pdfdatadet.AddCell(datadetcen4);
            pdfdatadet.AddCell(datadetder4);
            pdfdatadet.AddCell(ex13);
            pdfdatadet.AddCell(datadetizq5);
            pdfdatadet.AddCell(datadetcen5);
            pdfdatadet.AddCell(datadetder5);
            pdfdatadet.AddCell(ex14);

            doc.Add(pdfdatadet);


            //Agregamos firma digital
            iTextSharp.text.Image imagen = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/imgSigned/firma.jpg"));
            imagen.BorderWidth = 0;
            imagen.Alignment = iTextSharp.text.Element.ALIGN_LEFT;            
            float percentage = 0.0f;
            percentage = 150 / imagen.Width;
            imagen.ScalePercent(percentage * 100);
            
            doc.Add(imagen);

            //Agregamos Espacio para Firmas
            iTextSharp.text.pdf.PdfPTable tblFirmas = new iTextSharp.text.pdf.PdfPTable(3);
            tblFirmas.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell firmaEmpleador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("WT SOURCING PERU S.A.C", _standarddata));
            firmaEmpleador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaEmpleador.BorderWidth = 0;
            firmaEmpleador.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell firmaEspacio = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" "));
            firmaEspacio.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell firmaTrabajador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Trabajador, _standarddata));
            firmaTrabajador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaTrabajador.BorderWidth = 0;
            firmaTrabajador.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell firmaysello = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Firma y Sello", _standarddata));
            firmaysello.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaysello.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell firmaEspacio1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" "));
            firmaEspacio1.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell DniTrabajador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Doc. Identidad : " + obj.Codigo, _standarddata));
            DniTrabajador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            DniTrabajador.BorderWidth = 0;

            tblFirmas.AddCell(firmaEmpleador);
            tblFirmas.AddCell(firmaEspacio);
            tblFirmas.AddCell(firmaTrabajador);
            tblFirmas.AddCell(firmaysello);
            tblFirmas.AddCell(firmaEspacio1);
            tblFirmas.AddCell(DniTrabajador);

            doc.Add(tblFirmas);

            //Agregamos fecha documento
            iTextSharp.text.pdf.PdfPTable pdffecha = new iTextSharp.text.pdf.PdfPTable(1);
            pdffecha.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell fecha1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("LIMA, " + diadepo + " DE " + obj.Mes + " DEL " + obj.Anio, _standarddata));
            fecha1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            fecha1.PaddingTop = 20;
            fecha1.BorderWidth = 0;

            pdffecha.AddCell(fecha1);

            doc.Add(pdffecha);

            doc.Close();
            writer.Close();
        }

        public void Create_CertificadoUtilidad(CertificadoUtilidad objCertificadoUtilidad)
        {
            CertificadoUtilidad obj = objCertificadoUtilidad;
            string rutaPdf = ConfigurationManager.AppSettings["rutaPDFCreated"].ToString();
            string nombreArchivo = obj.IdDocumento + "-" + obj.Trabajador + "-" + obj.Mes + "-" + obj.Anio + ".pdf";

            iTextSharp.text.Document doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER);
            iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, new System.IO.FileStream(Server.MapPath("~") + rutaPdf + nombreArchivo, System.IO.FileMode.Create));
            doc.AddTitle("PDF Planillas");
            doc.AddCreator("Luis Rojas");
            doc.Open();

            iTextSharp.text.Font _standarddata = new iTextSharp.text.Font();
            _standarddata.SetStyle(iTextSharp.text.Font.NORMAL);
            _standarddata.SetFamily(iTextSharp.text.Font.FontFamily.HELVETICA.ToString());
            _standarddata.Size = 8;

            iTextSharp.text.Font _standarddatabold = new iTextSharp.text.Font();
            _standarddatabold.SetStyle(iTextSharp.text.Font.BOLD);
            _standarddatabold.SetFamily(iTextSharp.text.Font.FontFamily.HELVETICA.ToString());
            _standarddatabold.Size = 8;

            iTextSharp.text.Font _standardtitulo = new iTextSharp.text.Font();
            _standardtitulo.SetStyle(iTextSharp.text.Font.BOLD);
            _standardtitulo.SetFamily(iTextSharp.text.Font.FontFamily.HELVETICA.ToString());
            _standardtitulo.Size = 9;
            

            //Creamos el Documento
            iTextSharp.text.pdf.PdfPTable pdfLogo = new iTextSharp.text.pdf.PdfPTable(1);
            pdfLogo.DefaultCell.BorderWidth = 0;
            pdfLogo.WidthPercentage = 100;
            pdfLogo.DefaultCell.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;

            //Agregamos el Logo
            iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/img/logos/WTSLogo2.png"));
            jpg.ScaleToFit(120f, 90f);

            iTextSharp.text.pdf.PdfPCell cellLogo = new iTextSharp.text.pdf.PdfPCell(jpg);
            cellLogo.BorderWidth = 0;
            cellLogo.BorderWidthBottom = 0;
            cellLogo.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            pdfLogo.AddCell(cellLogo);

            doc.Add(pdfLogo);

            //Agregamos el Titulo
            iTextSharp.text.pdf.PdfPTable pdfTitulo = new iTextSharp.text.pdf.PdfPTable(1);
            pdfTitulo.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell titulo1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Liquidación de la Distribución de Utilidades", _standardtitulo));
            titulo1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            titulo1.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell titulo2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Ejercicio Año " + obj.Anio, _standardtitulo));
            titulo2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            titulo2.BorderWidth = 0;

            pdfTitulo.AddCell(titulo1);
            pdfTitulo.AddCell(titulo2);

            doc.Add(pdfTitulo);

            //Agregamos descripcion
            iTextSharp.text.pdf.PdfPTable pdfdesc = new iTextSharp.text.pdf.PdfPTable(1);
            pdfdesc.WidthPercentage = 100;

            string texto1 = "WT SOURCING PERÚ S.A.C con RUC 20522506410, domiciliado en CALLE ALDABAS 540 OFICINA 301, en cumplimiento de lo ";
            string texto2 = "dispuesto por el D. Leg. No. 892 y D.S. 009-08-TR, deja constancia de la determinación, distribución y pago de la participacíón en la ";
            string texto3 = "utilidades al Sr.(a) ";

            
            iTextSharp.text.pdf.PdfPCell desc1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(texto1, _standarddata));
            desc1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            desc1.PaddingLeft = 60;
            desc1.PaddingTop = 15;
            desc1.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell desc2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(texto2, _standarddata));
            desc2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            desc2.PaddingLeft = 60;
            desc2.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell desc3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(texto3 + obj.Trabajador + ".", _standarddata));
            desc3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            desc3.PaddingLeft = 60;
            desc3.BorderWidth = 0;

            pdfdesc.AddCell(desc1);
            pdfdesc.AddCell(desc2);
            pdfdesc.AddCell(desc3);

            doc.Add(pdfdesc);

            //Agregar titulo
            iTextSharp.text.pdf.PdfPTable pdftitdata = new iTextSharp.text.pdf.PdfPTable(1);
            pdftitdata.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell descsub = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Cálculo del Monto de la Participación en las Utilidades", _standarddatabold));
            descsub.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            descsub.PaddingLeft = 60;
            descsub.PaddingTop = 30;
            descsub.BorderWidth = 0;

            pdftitdata.AddCell(descsub);

            doc.Add(pdftitdata);

            //Agregar Detalle uti
            iTextSharp.text.pdf.PdfPTable pdfdetuti = new iTextSharp.text.pdf.PdfPTable(7);
            pdfdetuti.WidthPercentage = 100;

            //1
            iTextSharp.text.pdf.PdfPCell detuti1a = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("1.", _standarddatabold));
            detuti1a.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detuti1a.PaddingLeft = 60;
            detuti1a.PaddingTop = 10;
            detuti1a.BorderWidth = 0;
            detuti1a.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detuti1b = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Utilidad por Distribuir", _standarddatabold));
            detuti1b.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detuti1b.PaddingLeft = 10;
            detuti1b.PaddingTop = 10;
            detuti1b.BorderWidth = 0;
            detuti1b.Colspan = 4;

            iTextSharp.text.pdf.PdfPCell detuti1c = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddatabold));
            detuti1c.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detuti1c.BorderWidth = 0;
            detuti1c.PaddingTop = 10;
            detuti1c.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detuti1d = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.UtilidadDistribuir, _standarddatabold));
            detuti1d.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detuti1d.BorderWidth = 0;
            detuti1d.PaddingTop = 10;
            detuti1d.Colspan = 1;

            //1.1
            iTextSharp.text.pdf.PdfPCell detuti11a = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detuti11a.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detuti11a.PaddingLeft = 60;
            detuti11a.PaddingTop = 10;
            detuti11a.BorderWidth = 0;
            detuti11a.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detuti11b = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Utilidad anual de la empresa antes de impuestos", _standarddata));
            detuti11b.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detuti11b.PaddingLeft = 10;
            detuti11b.PaddingTop = 10;
            detuti11b.BorderWidth = 0;
            detuti11b.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell detuti11c = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            detuti11c.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detuti11c.BorderWidth = 0;
            detuti11c.PaddingTop = 10;
            detuti11c.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detuti11d = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.UtilidadAnual, _standarddata));
            detuti11d.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detuti11d.BorderWidth = 0;
            detuti11d.PaddingTop = 10;
            detuti11d.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detuti11e = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detuti11e.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detuti11e.BorderWidth = 0;
            detuti11e.PaddingTop = 10;
            detuti11e.Colspan = 1;

            //1.2
            iTextSharp.text.pdf.PdfPCell detuti12a = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detuti12a.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detuti12a.PaddingLeft = 60;
            detuti12a.BorderWidth = 0;
            detuti12a.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detuti12b = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Porcentaje a distribuir", _standarddata));
            detuti12b.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detuti12b.PaddingLeft = 10;
            detuti12b.BorderWidth = 0;
            detuti12b.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell detuti12c = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detuti12c.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detuti12c.BorderWidth = 0;
            detuti12c.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detuti12d = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.PorcentajeDistribuir + " %", _standarddata));
            detuti12d.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detuti12d.BorderWidth = 0;
            detuti12d.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detuti12e = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detuti12e.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detuti12e.BorderWidth = 0;
            detuti12e.Colspan = 1;

            pdfdetuti.AddCell(detuti1a);
            pdfdetuti.AddCell(detuti1b);
            pdfdetuti.AddCell(detuti1c);
            pdfdetuti.AddCell(detuti1d);

            pdfdetuti.AddCell(detuti11a);
            pdfdetuti.AddCell(detuti11b);
            pdfdetuti.AddCell(detuti11c);
            pdfdetuti.AddCell(detuti11d);
            pdfdetuti.AddCell(detuti11e);
            pdfdetuti.AddCell(detuti12a);
            pdfdetuti.AddCell(detuti12b);
            pdfdetuti.AddCell(detuti12c);
            pdfdetuti.AddCell(detuti12d);
            pdfdetuti.AddCell(detuti12e);

            doc.Add(pdfdetuti);

            //2

            iTextSharp.text.pdf.PdfPTable pdfdetpar = new iTextSharp.text.pdf.PdfPTable(7);
            pdfdetpar.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell detpar2a = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("2.", _standarddatabold));
            detpar2a.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar2a.PaddingLeft = 60;
            detpar2a.PaddingTop = 20;
            detpar2a.BorderWidth = 0;
            detpar2a.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar2b = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Cálculo de la Participación", _standarddatabold));
            detpar2b.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar2b.PaddingLeft = 10;
            detpar2b.PaddingTop = 20;
            detpar2b.BorderWidth = 0;
            detpar2b.Colspan = 4;

            iTextSharp.text.pdf.PdfPCell detpar2c = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddatabold));
            detpar2c.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar2c.PaddingTop = 20;
            detpar2c.BorderWidth = 0;
            detpar2c.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar2d = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddatabold));
            detpar2d.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar2d.BorderWidth = 0;
            detpar2d.PaddingTop = 20;
            detpar2d.Colspan = 1;

            //2.1
            iTextSharp.text.pdf.PdfPCell detpar21a = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddatabold));
            detpar21a.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar21a.PaddingLeft = 60;
            detpar21a.PaddingTop = 10;
            detpar21a.BorderWidth = 0;
            detpar21a.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar21b = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("2.1 Según los días laborados", _standarddatabold));
            detpar21b.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar21b.PaddingLeft = 10;
            detpar21b.PaddingTop = 10;
            detpar21b.BorderWidth = 0;
            detpar21b.Colspan = 4;
            
            iTextSharp.text.pdf.PdfPCell detpar21c = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddatabold));
            detpar21c.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar21c.BorderWidth = 0;
            detpar21c.PaddingTop = 10;
            detpar21c.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar21d = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TotalParticipacion, _standarddatabold));
            detpar21d.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar21d.BorderWidth = 0;
            detpar21d.PaddingTop = 10;
            detpar21d.Colspan = 1;

            //2.1.1
            iTextSharp.text.pdf.PdfPCell detpar21a1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detpar21a1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar21a1.PaddingLeft = 60;
            detpar21a1.PaddingTop = 10;
            detpar21a1.BorderWidth = 0;
            detpar21a1.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar21b1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("- Número total de días laborados durante el ejercicio por todos los trabajadores de la empresa", _standarddata));
            detpar21b1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar21b1.PaddingLeft = 10;
            detpar21b1.PaddingTop = 10;
            detpar21b1.BorderWidth = 0;
            detpar21b1.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell detpar21c1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detpar21c1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar21c1.PaddingTop = 10;
            detpar21c1.BorderWidth = 0;
            detpar21c1.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar21d1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TotalDiasTrabajadores, _standarddata));
            detpar21d1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar21d1.PaddingTop = 10;
            detpar21d1.BorderWidth = 0;
            detpar21d1.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar21e1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detpar21e1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar21e1.PaddingTop = 10;
            detpar21e1.BorderWidth = 0;
            detpar21e1.Colspan = 1;

            //2.1.2
            iTextSharp.text.pdf.PdfPCell detpar21a2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detpar21a2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar21a2.PaddingLeft = 60;
            detpar21a2.BorderWidth = 0;
            detpar21a2.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar21b2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("- Número de días laborados por el trabajador", _standarddata));
            detpar21b2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar21b2.PaddingLeft = 10;
            detpar21b2.BorderWidth = 0;
            detpar21b2.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell detpar21c2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detpar21c2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar21c2.BorderWidth = 0;
            detpar21c2.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar21d2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.DiasTrabajados, _standarddata));
            detpar21d2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar21d2.BorderWidth = 0;
            detpar21d2.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar21e2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detpar21e2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar21e2.BorderWidth = 0;
            detpar21e2.Colspan = 1;

            //2.2
            iTextSharp.text.pdf.PdfPCell detpar22a = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddatabold));
            detpar22a.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar22a.PaddingLeft = 60;
            detpar22a.PaddingTop = 10;
            detpar22a.BorderWidth = 0;
            detpar22a.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar22b = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("2.1 Según las remuneraciones percibidas", _standarddatabold));
            detpar22b.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar22b.PaddingLeft = 10;
            detpar22b.PaddingTop = 10;
            detpar22b.BorderWidth = 0;
            detpar22b.Colspan = 4;

            iTextSharp.text.pdf.PdfPCell detpar22c = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddatabold));
            detpar22c.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar22c.PaddingTop = 10;
            detpar22c.BorderWidth = 0;
            detpar22c.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar22d = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Distribucion, _standarddatabold));
            detpar22d.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar22d.PaddingTop = 10;
            detpar22d.BorderWidth = 0;
            detpar22d.Colspan = 1;

            //2.2.1
            iTextSharp.text.pdf.PdfPCell detpar22a1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detpar22a1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar22a1.PaddingLeft = 60;
            detpar22a1.PaddingTop = 10;
            detpar22a1.BorderWidth = 0;
            detpar22a1.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar22b1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("- Remuneración computable total pagada durante el ejercicio a todos los trabajadores de la empresa", _standarddata));
            detpar22b1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar22b1.PaddingLeft = 10;
            detpar22b1.PaddingTop = 10;
            detpar22b1.BorderWidth = 0;
            detpar22b1.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell detpar22c1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            detpar22c1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar22c1.PaddingTop = 10;
            detpar22c1.BorderWidth = 0;
            detpar22c1.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar22d1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TotalRemuneracionTrab, _standarddata));
            detpar22d1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar22d1.PaddingTop = 10;
            detpar22d1.BorderWidth = 0;
            detpar22d1.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar22e1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detpar22e1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar22e1.PaddingTop = 10;
            detpar22e1.BorderWidth = 0;
            detpar22e1.Colspan = 1;

            //2.2.2
            iTextSharp.text.pdf.PdfPCell detpar22a2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detpar22a2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar22a2.PaddingLeft = 60;
            detpar22a2.BorderWidth = 0;
            detpar22a2.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar22b2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("- Remuneración computable percibida durante el ejercicio por el trabajador", _standarddata));
            detpar22b2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detpar22b2.PaddingLeft = 10;
            detpar22b2.BorderWidth = 0;
            detpar22b2.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell detpar22c2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddata));
            detpar22c2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar22c2.BorderWidth = 0;
            detpar22c2.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar22d2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TotalRemuneracion, _standarddata));
            detpar22d2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar22d2.BorderWidth = 0;
            detpar22d2.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detpar22e2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detpar22e2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detpar22e2.BorderWidth = 0;
            detpar22e2.Colspan = 1;

            //2
            pdfdetpar.AddCell(detpar2a);
            pdfdetpar.AddCell(detpar2b);
            pdfdetpar.AddCell(detpar2c);
            pdfdetpar.AddCell(detpar2d);
            //2.1
            pdfdetpar.AddCell(detpar21a);
            pdfdetpar.AddCell(detpar21b);
            pdfdetpar.AddCell(detpar21c);
            pdfdetpar.AddCell(detpar21d);
            pdfdetpar.AddCell(detpar21a1);
            pdfdetpar.AddCell(detpar21b1);
            pdfdetpar.AddCell(detpar21c1);
            pdfdetpar.AddCell(detpar21d1);
            pdfdetpar.AddCell(detpar21e1);
            pdfdetpar.AddCell(detpar21a2);
            pdfdetpar.AddCell(detpar21b2);
            pdfdetpar.AddCell(detpar21c2);
            pdfdetpar.AddCell(detpar21d2);
            pdfdetpar.AddCell(detpar21e2);
            //2.2
            pdfdetpar.AddCell(detpar22a);
            pdfdetpar.AddCell(detpar22b);
            pdfdetpar.AddCell(detpar22c);
            pdfdetpar.AddCell(detpar22d);
            pdfdetpar.AddCell(detpar22a1);
            pdfdetpar.AddCell(detpar22b1);
            pdfdetpar.AddCell(detpar22c1);
            pdfdetpar.AddCell(detpar22d1);
            pdfdetpar.AddCell(detpar22e1);
            pdfdetpar.AddCell(detpar22a2);
            pdfdetpar.AddCell(detpar22b2);
            pdfdetpar.AddCell(detpar22c2);
            pdfdetpar.AddCell(detpar22d2);
            pdfdetpar.AddCell(detpar22e2);

            //3
            iTextSharp.text.pdf.PdfPCell detneto3a = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("3.", _standarddatabold));
            detneto3a.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detneto3a.PaddingLeft = 60;
            detneto3a.PaddingTop = 20;
            detneto3a.BorderWidth = 0;
            detneto3a.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto3b = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Neto de participación", _standarddatabold));
            detneto3b.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detneto3b.PaddingLeft = 10;
            detneto3b.PaddingTop = 20;
            detneto3b.BorderWidth = 0;
            detneto3b.Colspan = 4;

            iTextSharp.text.pdf.PdfPCell detneto3c = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddatabold));
            detneto3c.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto3c.PaddingTop = 20;
            detneto3c.BorderWidth = 0;
            detneto3c.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto3d = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.TotalPagar, _standarddatabold));
            detneto3d.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto3d.PaddingTop = 20;
            detneto3d.BorderWidth = 0;
            detneto3d.Colspan = 1;

            //3.1
            iTextSharp.text.pdf.PdfPCell detneto31a = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detneto31a.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detneto31a.PaddingLeft = 60;
            detneto31a.PaddingTop = 10;
            detneto31a.BorderWidth = 0;
            detneto31a.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto31b = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("- Total de participación", _standarddata));
            detneto31b.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detneto31b.PaddingLeft = 10;
            detneto31b.PaddingTop = 10;
            detneto31b.BorderWidth = 0;
            detneto31b.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell detneto31c = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddatabold));
            detneto31c.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto31c.PaddingTop = 10;
            detneto31c.BorderWidth = 0;
            detneto31c.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto31d = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.UtilidadTotal, _standarddatabold));
            detneto31d.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto31d.PaddingTop = 10;
            detneto31d.BorderWidth = 0;
            detneto31d.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto31e = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detneto31e.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto31e.PaddingTop = 10;
            detneto31e.BorderWidth = 0;
            detneto31e.Colspan = 1;


            //3.2
            iTextSharp.text.pdf.PdfPCell detneto32a = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detneto32a.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detneto32a.PaddingLeft = 60;
            detneto32a.BorderWidth = 0;
            detneto32a.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto32b = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("- (-) Descuento (Renta de 5ta)", _standarddata));
            detneto32b.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detneto32b.PaddingLeft = 10;
            detneto32b.BorderWidth = 0;
            detneto32b.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell detneto32c = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddatabold));
            detneto32c.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto32c.BorderWidth = 0;
            detneto32c.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto32d = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.QuintaCategoria, _standarddatabold));
            detneto32d.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto32d.BorderWidth = 0;
            detneto32d.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto32e = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detneto32e.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto32e.BorderWidth = 0;
            detneto32e.Colspan = 1;

            //3.3
            iTextSharp.text.pdf.PdfPCell detneto33a = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detneto33a.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detneto33a.PaddingLeft = 60;
            detneto33a.BorderWidth = 0;
            detneto33a.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto33b = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("- (-) Descuento (Préstamos)", _standarddata));
            detneto33b.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            detneto33b.PaddingLeft = 10;
            detneto33b.BorderWidth = 0;
            detneto33b.Colspan = 3;

            iTextSharp.text.pdf.PdfPCell detneto33c = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("S/.", _standarddatabold));
            detneto33c.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto33c.BorderWidth = 0;
            detneto33c.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto33d = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.OtrosDecuento, _standarddatabold));
            detneto33d.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto33d.BorderWidth = 0;
            detneto33d.Colspan = 1;

            iTextSharp.text.pdf.PdfPCell detneto33e = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standarddata));
            detneto33e.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            detneto33e.BorderWidth = 0;
            detneto33e.Colspan = 1;

            //3
            pdfdetpar.AddCell(detneto3a);
            pdfdetpar.AddCell(detneto3b);
            pdfdetpar.AddCell(detneto3c);
            pdfdetpar.AddCell(detneto3d);
            //3.1
            pdfdetpar.AddCell(detneto31a);
            pdfdetpar.AddCell(detneto31b);
            pdfdetpar.AddCell(detneto31c);
            pdfdetpar.AddCell(detneto31d);
            pdfdetpar.AddCell(detneto31e);
            //3.1
            pdfdetpar.AddCell(detneto32a);
            pdfdetpar.AddCell(detneto32b);
            pdfdetpar.AddCell(detneto32c);
            pdfdetpar.AddCell(detneto32d);
            pdfdetpar.AddCell(detneto32e);
            //3.1
            pdfdetpar.AddCell(detneto33a);
            pdfdetpar.AddCell(detneto33b);
            pdfdetpar.AddCell(detneto33c);
            pdfdetpar.AddCell(detneto33d);
            pdfdetpar.AddCell(detneto33e);

            doc.Add(pdfdetpar);

            // Agregar descripcion
            iTextSharp.text.pdf.PdfPTable pdfdescfin = new iTextSharp.text.pdf.PdfPTable(1);
            pdfdescfin.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell descfin1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Estando conforme con la liquidación de Distribución de Utilidades y no teniendo nada que reclamar, suscribo la presente.", _standarddata));
            descfin1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            descfin1.PaddingLeft = 60;
            descfin1.PaddingTop = 20;
            descfin1.PaddingBottom = 20;
            descfin1.BorderWidth = 0;

            pdfdescfin.AddCell(descfin1);

            doc.Add(pdfdescfin);

            //Agregamos firma digital
            iTextSharp.text.Image imagen = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/imgSigned/firma.jpg"));
            imagen.BorderWidth = 0;
            imagen.Alignment = iTextSharp.text.Element.ALIGN_LEFT;
            float percentage = 0.0f;
            percentage = 150 / imagen.Width;
            imagen.ScalePercent(percentage * 100);

            doc.Add(imagen);

            //Agregamos Espacio para Firmas
            iTextSharp.text.pdf.PdfPTable tblFirmas = new iTextSharp.text.pdf.PdfPTable(3);
            tblFirmas.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell firmaEmpleador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("WT SOURCING PERU S.A.C", _standarddata));
            firmaEmpleador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaEmpleador.BorderWidth = 0;
            firmaEmpleador.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell firmaEspacio = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" "));
            firmaEspacio.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell firmaTrabajador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(obj.Trabajador, _standarddata));
            firmaTrabajador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaTrabajador.BorderWidth = 0;
            firmaTrabajador.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell firmaysello = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Firma y Sello", _standarddata));
            firmaysello.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaysello.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell firmaEspacio1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" "));
            firmaEspacio1.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell DniTrabajador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Doc. Identidad : " + obj.Codigo, _standarddata));
            DniTrabajador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            DniTrabajador.BorderWidth = 0;

            tblFirmas.AddCell(firmaEmpleador);
            tblFirmas.AddCell(firmaEspacio);
            tblFirmas.AddCell(firmaTrabajador);
            tblFirmas.AddCell(firmaysello);
            tblFirmas.AddCell(firmaEspacio1);
            tblFirmas.AddCell(DniTrabajador);

            doc.Add(tblFirmas);

            //Agregamos fecha documento
            iTextSharp.text.pdf.PdfPTable pdffecha = new iTextSharp.text.pdf.PdfPTable(1);
            pdffecha.WidthPercentage = 100;

            string mes = "";
            string diadepo = Convert.ToDateTime(obj.FechaDeposito).ToString("dd");
            string mesdepo = Convert.ToDateTime(obj.FechaDeposito).ToString("MM");
            if (mesdepo == "01") { mes = "ENERO"; } else if (mesdepo == "02") { mes = "FEBRERO"; } else if (mesdepo == "03") { mes = "MARZO"; } else if (mesdepo == "04") { mes = "ABRIL"; } else if (mesdepo == "05") { mes = "MAYO"; }
            else if (mesdepo == "06") { mes = "JUNIO"; } else if (mesdepo == "07") { mes = "JULIO"; } else if (mesdepo == "08") { mes = "AGOSTO"; } else if (mesdepo == "09") { mes = "SEPTIEMBRE"; }
            else if (mesdepo == "10") { mes = "OCTUBRE"; } else if (mesdepo == "11") { mes = "NOVIEMBRE"; } else if (mesdepo == "12") { mes = "DICIEMBRE"; }

            string aniodepo = Convert.ToDateTime(obj.FechaDeposito).ToString("yyyy");

            iTextSharp.text.pdf.PdfPCell fecha1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("LIMA, " + diadepo + " DE " + mes + " DEL " + aniodepo, _standarddata));
            fecha1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            fecha1.PaddingTop = 20;
            fecha1.BorderWidth = 0;

            pdffecha.AddCell(fecha1);

            doc.Add(pdffecha);

            doc.Close();
            writer.Close();
        }


        public string Planilla_Delete()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "UsuarioActualizacion", _.GetUsuario().Usuario.ToString());

            string data = oMantenimiento.get_Data("usp_Planilla_GetNamePDF", par, false, Util.ERP);
            int id = oMantenimiento.save_Row("usp_Planilla_Delete", par, Util.ERP);
            
            string mensaje = _.Mensaje("edit", id > 0);

            if (id > 0 && data != null)
            {
                List<BoletaPago> listBoletaPago = JsonConvert.DeserializeObject<List<BoletaPago>>(data);

                string rutapdf = Server.MapPath("~") + ConfigurationManager.AppSettings["rutaPDFCreated"].ToString();
                string rutapdfsigned = Server.MapPath("~") + ConfigurationManager.AppSettings["rutaPDFSigned"].ToString();

                foreach (var item in listBoletaPago)
                {
                    string nombre = "";
                    string alternativename = "";
                    if (item.archivoPDF == 0)
                    {
                        nombre = rutapdf + item.nombrePDF;
                        alternativename = rutapdf + item.IdDocumento + '-' + item.Trabajador + '-' + item.Mes + '-' + item.Anio + '-' + "signed.pdf";
                    }
                    else if (item.archivoPDF == 1)
                    {
                        nombre = rutapdf + item.nombrePDF;
                        alternativename = rutapdf + item.IdDocumento + '-' + item.Trabajador + '-' + item.Mes + '-' + item.Anio + '-' + "signed.pdf";
                    }
                    else if (item.archivoPDF == 2)
                    {
                        nombre = rutapdfsigned + item.nombrePDF;
                    }

                    Planilla_DeletePDF(nombre, alternativename);
                }
            }

            return mensaje;
        }

        public static void Planilla_DeletePDF(string data, string alternativename)
        {
            if (System.IO.File.Exists(data))
            {
                System.IO.FileInfo info = new System.IO.FileInfo(data);
                info.Attributes = System.IO.FileAttributes.Normal;
                System.IO.File.Delete(data);
            }
            if (System.IO.File.Exists(alternativename))
            {
                System.IO.FileInfo info = new System.IO.FileInfo(alternativename);
                info.Attributes = System.IO.FileAttributes.Normal;
                System.IO.File.Delete(alternativename);
            }

        }
        
        public string Planilla_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string documento = _.Get_Par(par, "Documento");
            string iddocumento = _.Get_Par(par, "IdDocumento");
            string estado = _.Get_Par(par, "Estado");
            string mes = _.Get_Par(par, "Mes");
            string anio = _.Get_Par(par, "Anio");

            par = _.addParameter(par, "UsuarioActualizacion", _.GetUsuario().Usuario.ToString());
            int id = oMantenimiento.save_Row("usp_Planilla_Update", par, Util.ERP);
            string mensaje = _.Mensaje("edit", id > 0);

            string val = _.Get_Par(mensaje, "estado");

            if (val == "success")
            {
                if (estado == "0")
                {
                    Planilla_SendEmail(documento, mes, anio, estado);
                }

                if (estado == "1")
                {                    
                    string ruta = Server.MapPath("~") + ConfigurationManager.AppSettings["rutaPDFCreated"].ToString();
                    string origen = ruta;
                    string destino = Server.MapPath("~") + ConfigurationManager.AppSettings["rutaPDFSigned"].ToString();

                    Planilla_CopyDirectoryContent(iddocumento, origen, destino, true);
                }
            }

            return mensaje;
        }

        public string Planilla_Email()
        {
            string mensaje = "";
            try
            {
                string par = _.Post("par");

                string documento = _.Get_Par(par, "Documento");
                string estado = _.Get_Par(par, "Estado");
                string mes = _.Get_Par(par, "Mes");
                string anio = _.Get_Par(par, "Anio");

                Planilla_SendEmail(documento, mes, anio, estado);

                mensaje = "success";
            }
            catch (Exception ex) 
            {
                throw ex;
            }
            return mensaje;
        }

        public void Planilla_SendEmail(string documento, string mes, string anio, string estado)
        {

            MailMessage email = new MailMessage();

            string w = "";
            string x = "";

            if (documento == "Boleta de Pago") { x = "Boletas de Pago"; w = "las "; }
            if (documento == "Boleta de Gratificación") { x = "Boletas de Gratificación"; w = "las "; }
            if (documento == "Certificado de CTS") { x = "Certificados de CTS"; w = "los "; }
            if (documento == "Certificado de Utilidades") { x = "Certificados de Utilidades"; w = "los "; }

            if (estado == "0")
            {
                email.To.Add(new MailAddress(ConfigurationManager.AppSettings["mailPDFSigned"].ToString()));
                email.From = new MailAddress("erp@wts.com.pe");
                email.Subject = "Correo ERP - Creacion PDF de " + documento + " - " + DateTime.Now.ToString("dd / MMM / yyy hh:mm:ss");
                email.Body = "Buenos dias <b> " + ConfigurationManager.AppSettings["namePDFSigned"].ToString() +
                             "</b><br>El Sistema ERP - WTS le informa que se ha cargado " + w + "<b>" + x + " </b>para el mes de <b>" + mes +
                             ".</b><br> Por favor realizar la firma de los documentos respectivos. <br><br> Atte. <br><br> <b>SISTEMA ERP-WTS</b>";               
            }

            if (estado == "2")
            {
                email.To.Add(new MailAddress(ConfigurationManager.AppSettings["mailEveryOneWTS"].ToString()));
                email.From = new MailAddress("erp@wts.com.pe");
                email.Subject = "Correo ERP - " + documento;
                email.Body = "Estimados colaboradores, <b> "+
                             "</b><br>El Sistema ERP - WTS les informa que se han cargado " + w + "<b>" + x + " </b>del mes de <b>" + mes +
                             ".</b><br>Muchas Gracias. <br><br> Atte. <br><br> <b>SISTEMA ERP-WTS</b>";               
            }

            email.IsBodyHtml = true;

            string imgLogo = "";
            imgLogo = Server.MapPath("~/Content/img/logos/WTSLogo3.png");
            AlternateView VistaHtml = AlternateView.CreateAlternateViewFromString(email.Body + "<br><img src=cid:imgLogo></br>", null, "text/html");

            LinkedResource img = new LinkedResource(imgLogo);
            img.ContentId = "imgLogo";

            VistaHtml.LinkedResources.Add(img);
            email.AlternateViews.Add(VistaHtml);

            email.Priority = MailPriority.Normal;

            SmtpClient smtp = new SmtpClient();
            smtp.Host = "192.168.0.20";
            smtp.EnableSsl = false;
            smtp.UseDefaultCredentials = false;

            string output = null;

            try
            {
                smtp.Send(email);
                email.Dispose();
            }
            catch (Exception ex)
            {
                output = "Error enviando correo electrónico: " + ex.Message;
            }
            return;
        }
        
        private static void Planilla_CopyDirectoryContent(string iddocumento, string origPath, string destPath, bool overwrite)
        {
            string destPathOrigin = destPath;

            if (System.IO.Directory.Exists(origPath))
            {
                foreach (string dirPath in System.IO.Directory.GetDirectories(origPath, "*", System.IO.SearchOption.AllDirectories))
                {
                    Planilla_CreateEmptyDirectory(dirPath.Replace(origPath, destPath));
                }

                foreach (string newPath in System.IO.Directory.GetFiles(origPath, "*.*", System.IO.SearchOption.AllDirectories))
                {
                    string result = iddocumento + "_" + Path.GetRandomFileName();
                    destPath = destPathOrigin + result;
                    while (System.IO.File.Exists(destPath))
                    {
                        destPath = "";
                        result = Path.GetRandomFileName();
                        destPath = destPath + result;
                    }

                    Planilla_CopyFile(newPath, destPath, overwrite, result);
                }
            }
        }

        public static void Planilla_CreateEmptyDirectory(string fullPath)
        {
            if (!System.IO.Directory.Exists(fullPath))
            {
                System.IO.Directory.CreateDirectory(fullPath);
            }
        }

        public static void Planilla_CopyFile(string origPath, string destPath, bool overwrite, string nom_archivo)
        {
            try
            {
                string[] archivo = origPath.Split('\\');
                int longArreglo = archivo.Length;

                if (archivo[longArreglo - 1].Contains("signed"))
                {
                    string[] nomarchivo = archivo[longArreglo - 1].Split('-');
                    string tipodocumento = nomarchivo[0];
                    string trabajadorBoleta = nomarchivo[1];
                    string periodo = nomarchivo[2];
                    string anio = nomarchivo[3].Split('.')[0];

                    if (System.IO.Path.GetExtension(destPath) == "")
                    {
                        destPath = System.IO.Path.Combine(destPath, System.IO.Path.GetFileName(origPath));
                    }
                    if (!System.IO.Directory.Exists(System.IO.Path.GetDirectoryName(destPath)))
                    {
                        Planilla_CreateEmptyDirectory(System.IO.Path.GetDirectoryName(destPath));
                    }
                    if (!System.IO.File.Exists(destPath))
                    {
                        System.IO.File.Copy(origPath, destPath, true);
                    }
                    else
                    {
                        if (overwrite == true)
                        {
                            Planilla_DeleteFile(destPath);
                            System.IO.File.Copy(origPath, destPath, true);
                        }
                    }
                    Planilla_DeleteFile(origPath);
                    Planilla_UpdateNamePDF(tipodocumento, trabajadorBoleta, periodo, anio, nom_archivo);
                }
                else
                    Planilla_DeleteFile(origPath);
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static void Planilla_UpdateNamePDF(string TipoDocumento, string Trabajador, string Periodo, string Anio, string Archivo)
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            
            string par = "{\"IdDocumento\":\"" + TipoDocumento + "\",\"Trabajador\":\"" + Trabajador + "\",\"Periodo\":\"" + Periodo + "\",\"Anio\":\"" + Anio + "\",\"Archivo\":\"" + Archivo + "\"}";            
            oMantenimiento.get_Data("usp_Planilla_UpdateNamePDF", par, true, Util.ERP); 
        }

        public static void Planilla_DeleteFile(string fullPath)
        {
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.FileInfo info = new System.IO.FileInfo(fullPath);
                info.Attributes = System.IO.FileAttributes.Normal;
                System.IO.File.Delete(fullPath);
            }
        }

        public string Planilla_Get() {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("usp_Planilla_Get", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public FileResult Planilla_Download(string nameFile)
        {
            string [] x = nameFile.Split('.');
            string name = x[0].ToString();
            string file = x[1].ToString();

            string alternativefile = name + "-signed." + file;

            byte[] byteArchivo = new byte[0];
            try
            {         
                string rutaPdf = Server.MapPath("~/Content/pdfCreated/");
                string ruta = rutaPdf + nameFile;
                string rutaalternativa = rutaPdf + alternativefile;

                if (System.IO.File.Exists(ruta))
                {
                    byteArchivo = System.IO.File.ReadAllBytes(@ruta);
                }
                if (System.IO.File.Exists(rutaalternativa)) {
                    byteArchivo = System.IO.File.ReadAllBytes(@rutaalternativa);
                }               
            }
            catch (Exception ex)
            {
                string mensaje = ex.Message;
            }
            
            return File(byteArchivo, System.Net.Mime.MediaTypeNames.Application.Octet, nameFile);
        }





        /*** JORGE ***/

        public string Load_Planilla()
        {
            
            bool exito = true;
            int id = -1;
            string data = "";
            blMantenimiento oMantenimiento = new blMantenimiento();
            data = id < 0 ? oMantenimiento.get_Data("usp_PlanillaBoleta_traerxid", id.ToString(), true, Util.ERP) : string.Empty;

            return _.Mensaje("new", exito, data);
        }
        
        // 2er paso
        public string Upload_Planilla()
        {
            _Helper helper = new _Helper();
            string path = helper.Upload_file(Request.Files["archivo"]);
            DataTable tabla = !string.IsNullOrEmpty(path) ? helper.convertExceltoDataSet(path) : null;
            string data = (tabla != null && tabla.Rows.Count > 0) ? "ok" : string.Empty;

            JObject obj = new JObject();
            obj.Add("data", data);
            obj.Add("path", path);
            obj.Add("estado", data == "ok" ? "success" : "error");
            obj.Add("mensaje", data == "ok" ? "Se registro correctamente" : "No se pudo registrar");

            bool exito = false;
            int id = -1;
            //string data = string.Empty;
            if (tabla != null)
            {

                blMantenimiento oMantenimiento = new blMantenimiento();
                exito = (oMantenimiento.save_Row("usp_PlanillaBoletaTemporal_eliminar", "", Util.ERP) >= 0) ? oMantenimiento.save_Rows_BulkCopy("Planilla_Boleta_Temporal", tabla, Util.ERP) : false;
                id = exito ? (oMantenimiento.save_Rows_Out("usp_PlanillaBoleta_insertar", _.Post("par"), Util.ERP)) : -1;

                data = id > 0 ? oMantenimiento.get_Data("usp_PlanillaBoleta_traerxid", id.ToString(), true, Util.ERP) : string.Empty;
            }

            return _.Mensaje("new", exito, data);

            //return data.ToString();
        }


        //3.1er paso -- se obtiene los datos de boletas
        public string Create_PlanillaPDF()
        {
            //_Helper helper = new _Helper();
            string IdPeriodo = _.Get("idperiodo");
            string data = "";

            blMantenimiento oMantenimiento = new blMantenimiento();
            data = Convert.ToInt32(IdPeriodo) > 0 ? oMantenimiento.get_Data("usp_GetListPlanillasPeriodoAll_2", IdPeriodo.ToString(), false, Util.ERP) : string.Empty;
            return data;
        }

        //3.1.1 er paso --crea el PDF segun lo obtenido
        public string Create_FilePDF()
        {
 
            string result = "0";

            string mesBoleta, anioBoleta, dniNumero, trabajadorBoleta, OcupacionBoleta, Sexo, areaBoleta, seccionBoleta, fechaingreso, diasTrabajados;
            string diasVacaciones, TotalDias, afpBoleta, Sueldo, TipoAsiento, ceseBoleta, centroCosto, bancoCtaSueldo, numeroCtaSueldo, numDiasTrabajados;
            string Dominical, Feriado, diasLibres, horasTrabajadas, heSimples, heSegundas, heDobles, horasNocturno, horasNocturnoFeriado, horasNocturnoSimple;
            string horasNocturnoSegundas, horasNocturnoDoble, diasDescanzoMedico, feriadoDomingoLaborado, diasSubsidioEnf, diasMaternidad, diasPaternidad;
            string diasFalta, horasTardanza, horasDescuento, diasSuspencionPerfecta, dVacaciones, heDomingoFeriadoSimple, heDomingoFeriadoSegundas, heDomingoFeriadoDoble;
            string licenciaSinGoce, licenciaConGoce, vacacionesDesde, vacacionesHasta, vacacionesDesde2, vacacionesHasta2, carnetEssalud, numCUSPP;

            string montoSubsidioMaternidad, HE1, HEDoble, montoDescanzoMedico, montoVacaciones, montoCompraVacaciones, montoBonificacion, HE2, Subsidio, remuneracionBasica;
            string asignacionFamiliar, valeConsumo, movilidadPago, totalIngresos, presNavidad1;

            string totalDescuentoHoras, SeguroRimac, DescuentoONP, DescuentoAFP, seguroAFP, comisionAFP, descQuinta, EPS, adelanto, totalDescuentos, presNavidad2, prestamos, retJudicial, otrosDescuentos;
            string aporteEssalud, totalAportes, utilidades, adelaUtilidades;

            string netoRecibir;

            string rutaPdf = ConfigurationManager.AppSettings["rutaPDFCreated"].ToString();


            mesBoleta = _.Post("mesBoleta");
            anioBoleta = _.Post("anioBoleta");
            dniNumero = _.Post("dniNumero");
            trabajadorBoleta = _.Post("trabajadorBoleta");
            areaBoleta = _.Post("areaBoleta");
            OcupacionBoleta = _.Post("ocupacionBoleta");
            Sexo = _.Post("Sexo");
            seccionBoleta = _.Post("Seccion");
            fechaingreso = _.Post("fechaingreso");
            diasTrabajados = _.Post("diasTrabajados");
            diasVacaciones = _.Post("diasVacaciones");
            TotalDias = _.Post("totalDias");
            afpBoleta = _.Post("afpBoleta");
            Sueldo = _.Post("Sueldo");
            TipoAsiento = _.Post("tipoAsiento");
            ceseBoleta = _.Post("ceseBoleta");
            centroCosto = _.Post("centroCosto");
            bancoCtaSueldo = _.Post("bancoCtaSueldo");
            numeroCtaSueldo = _.Post("numeroCtaSueldo");
            numDiasTrabajados = _.Post("noDiasTrabajados");
            Dominical = _.Post("Dominical");
            Feriado = _.Post("Feriado");
            diasLibres = _.Post("diasLibres");
            horasTrabajadas = _.Post("horasTrabajadas");
            heSimples = _.Post("heSimples");
            heSegundas = _.Post("heSegundas");
            heDobles = _.Post("heDobles");
            horasNocturno = _.Post("horasNocturno");
            horasNocturnoFeriado = _.Post("horasNocturnoFeriado");
            horasNocturnoSimple = _.Post("horasNocturnoSimple");
            horasNocturnoSegundas = _.Post("horasNocturnoSegundas");
            horasNocturnoDoble = _.Post("horasNocturnoDoble");
            diasDescanzoMedico = _.Post("diasDescanzoMedico");
            feriadoDomingoLaborado = _.Post("feriadoDomingoLaborado");
            diasSubsidioEnf = _.Post("diasSubsidioEnf");
            diasMaternidad = _.Post("diasSubsidioMaternidad");
            diasPaternidad = _.Post("diasSubsidioPaternidad");
            diasFalta = _.Post("diasFalta");
            horasTardanza = _.Post("horasTardanza");
            horasDescuento = _.Post("horasDescuento");
            diasSuspencionPerfecta = _.Post("diasSuspencionPerfecta");
            dVacaciones = _.Post("dVacaciones");
            heDomingoFeriadoSimple = _.Post("heDomingoFeriadoSimple");
            heDomingoFeriadoSegundas = _.Post("heDomingoFeriadoSegundas");
            heDomingoFeriadoDoble = _.Post("heDomingoFeriadoDoble");
            licenciaSinGoce = _.Post("licenciaSinGoce");
            licenciaConGoce = _.Post("licenciaConGoce");
            vacacionesDesde = _.Post("vacacionesDesde");
            vacacionesHasta = _.Post("vacacionesHasta");
            vacacionesDesde2 = _.Post("vacacionesDesde2");
            vacacionesHasta2 = _.Post("vacacionesHasta2");
            carnetEssalud = _.Post("carnetEssalud");
            numCUSPP = "34567";

            montoSubsidioMaternidad = _.Post("montoSubsidioMaternidad");
            HE1 = _.Post("HE1");
            HEDoble = _.Post("HEDoble");
            montoDescanzoMedico = _.Post("montoDescanzoMedico");
            montoVacaciones = _.Post("montoVacaciones");
            montoCompraVacaciones = _.Post("montoCompraVacaciones");
            montoBonificacion = _.Post("montoBonificacion");
            HE2 = _.Post("HE2");
            Subsidio = _.Post("Subsidio");
            remuneracionBasica = _.Post("remuneracionBasica");
            asignacionFamiliar = _.Post("asignacionFamiliar");
            valeConsumo = _.Post("valeConsumo");
            movilidadPago = _.Post("movilidadPago");
            presNavidad1 = _.Post("PresNavidad1");
            totalIngresos = _.Post("totalIngresos");

            totalDescuentoHoras = _.Post("totalDescuentoHoras");
            SeguroRimac = _.Post("SeguroRimac");
            DescuentoONP = _.Post("DescuentoONP");
            DescuentoAFP = _.Post("DescuentoAFP");
            seguroAFP = _.Post("seguroAFP");
            comisionAFP = _.Post("comisionAFP");
            descQuinta = _.Post("descQuinta");
            adelanto = _.Post("adelantos");
            EPS = _.Post("EPS");
            presNavidad2 = _.Post("PresNavidad2");
            prestamos = _.Post("Prestamos");
            retJudicial = _.Post("RetJudicial");
            otrosDescuentos = _.Post("OtrosDescuentos");
            totalDescuentos = _.Post("totalDescuentos");

            aporteEssalud = _.Post("aporteEssalud");
            totalAportes = _.Post("totalAportes");

            netoRecibir = _.Post("netoRecibir");

            utilidades = _.Post("utilidades");
            adelaUtilidades = _.Post("adelaUtilidades");


            string nombreArchivo = trabajadorBoleta + "-" + mesBoleta + "-" + anioBoleta + ".pdf";
            // Creamos el documento con el tamaño de página tradicional
            iTextSharp.text.Document doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER);
            //// Indicamos donde vamos a guardar el documento
            iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, new System.IO.FileStream(Server.MapPath("~") + rutaPdf + nombreArchivo, System.IO.FileMode.Create));
            //iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, new System.IO.FileStream( Server.MapPath("/" + "Content/pdfCreated/") + nombreArchivo, System.IO.FileMode.Create));


            // Le colocamos el título y el autor
            // **Nota: Esto no será visible en el documento
            doc.AddTitle("PDF Planillas");
            doc.AddCreator("Jorge Castañeda");

            // Abrimos el archivo
            doc.Open();


            iTextSharp.text.Font _standardFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.TIMES_ROMAN, 14, iTextSharp.text.Font.BOLD, iTextSharp.text.BaseColor.BLACK);
            iTextSharp.text.Font _standardFont2 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 8, iTextSharp.text.Font.NORMAL, iTextSharp.text.BaseColor.BLACK);
            iTextSharp.text.Font _standardFont3 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 5, iTextSharp.text.Font.NORMAL, iTextSharp.text.BaseColor.BLACK);
            iTextSharp.text.Font _standardFont4 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 5, iTextSharp.text.Font.BOLD, iTextSharp.text.BaseColor.BLACK);

            // Escribimos el encabezamiento en el documento
            doc.Add(new iTextSharp.text.Paragraph("WT SOURCING PERU S.A.C", _standardFont));

            /*********************CABECERA******************************/
            iTextSharp.text.pdf.PdfPTable pdfCabecera = new iTextSharp.text.pdf.PdfPTable(2);
            pdfCabecera.DefaultCell.BorderWidth = 0;
            pdfCabecera.WidthPercentage = 100;
            pdfCabecera.DefaultCell.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;

            iTextSharp.text.pdf.PdfPCell Izq = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("CALLE ALDABAS 540 OFICINA 401", _standardFont2));
            Izq.BorderWidth = 0;
            Izq.BorderWidthBottom = 0;

            iTextSharp.text.pdf.PdfPCell Der = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Boleta de Pago", _standardFont2));
            Der.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            Der.BorderWidth = 0;

            pdfCabecera.AddCell(Izq);
            pdfCabecera.AddCell(Der);

            Izq = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("RUC: 20522506410", _standardFont2));
            Izq.BorderWidth = 0;

            Der = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("EMPLEADO - " + mesBoleta + " " + anioBoleta, _standardFont2));
            Der.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            Der.BorderWidth = 0;

            pdfCabecera.AddCell(Izq);
            pdfCabecera.AddCell(Der);

            doc.Add(pdfCabecera);

            /*********************DATOS******************************/

            iTextSharp.text.pdf.PdfPTable pdfDatos = new iTextSharp.text.pdf.PdfPTable(8);
            pdfDatos.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Trabajador", _standardFont3));
            cell1.BorderWidth = 0;
            cell1.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(trabajadorBoleta, _standardFont3));
            cell2.Colspan = 3;
            cell2.BorderWidth = 0;
            cell2.BorderWidthTop = 0.75f;

            /*iTextSharp.text.pdf.PdfPCell cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;
            cell3.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;
            cell4.BorderWidthTop = 0.75f;*/

            iTextSharp.text.pdf.PdfPCell cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Area de Trabajo", _standardFont3));
            cell5.BorderWidth = 0;
            cell5.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(areaBoleta, _standardFont3));
            cell6.BorderWidth = 0;
            cell6.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell7.BorderWidth = 0;
            cell7.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell8.BorderWidth = 0;
            cell8.BorderWidthTop = 0.75f;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            /*pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);*/
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Cargo/Ocupacion", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(OcupacionBoleta, _standardFont3));
            cell2.Colspan = 3;
            cell2.BorderWidth = 0;

            /*iTextSharp.text.pdf.PdfPCell cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;*/

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fecha de Cese", _standardFont3));
            cell5.BorderWidth = 0;

            cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(ceseBoleta, _standardFont3));
            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell8.BorderWidth = 0;


            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            /*pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);*/
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);


            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fecha de Ingreso", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(Convert.ToDateTime(fechaingreso).ToShortDateString(), _standardFont3));
            cell2.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Vacaciones", _standardFont3));
            cell5.BorderWidth = 0;

            if (vacacionesDesde != "")
                cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("desde " + Convert.ToDateTime(vacacionesDesde).ToShortDateString(), _standardFont3));
            else
                cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("desde " + vacacionesDesde, _standardFont3));

            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("H.E.1:", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(heSimples + "h.", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Carnet Essalud", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(carnetEssalud, _standardFont3));
            cell2.BorderWidth = 0;

            cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;

            cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell5.BorderWidth = 0;

            if (vacacionesHasta != "")
                cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("hasta " + Convert.ToDateTime(vacacionesHasta).ToShortDateString(), _standardFont3));
            else
                cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("hasta " + vacacionesHasta, _standardFont3));

            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("H.E.2:", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(heSegundas + "h.", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fondo de Pensiones", _standardFont3));
            cell1.BorderWidth = 0;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(afpBoleta, _standardFont3));
            cell2.BorderWidth = 0;

            cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("C.U.S.P.P.  ", _standardFont3));
            cell3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cell3.BorderWidth = 0;

            cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(numCUSPP, _standardFont3));
            cell3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cell4.BorderWidth = 0;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Remuneracion Basica", _standardFont3));
            cell5.BorderWidth = 0;

            cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(remuneracionBasica, _standardFont3));
            cell6.BorderWidth = 0;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("H.E.Doble:", _standardFont3));
            cell7.BorderWidth = 0;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(heDobles + "h.", _standardFont3));
            cell8.BorderWidth = 0;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("D.N.I.", _standardFont3));
            cell1.BorderWidth = 0;
            cell1.BorderWidthBottom = 0.75f;

            cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(dniNumero, _standardFont3));
            cell2.BorderWidth = 0;
            cell2.BorderWidthBottom = 0.75f;

            cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell3.BorderWidth = 0;
            cell3.BorderWidthBottom = 0.75f;

            cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell4.BorderWidth = 0;
            cell4.BorderWidthBottom = 0.75f;

            cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Cta de Ahorros", _standardFont3));
            cell5.BorderWidth = 0;
            cell5.BorderWidthBottom = 0.75f;

            cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(numeroCtaSueldo, _standardFont3));
            cell6.BorderWidth = 0;
            cell6.BorderWidthBottom = 0.75f;

            cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell7.BorderWidth = 0;
            cell7.BorderWidthBottom = 0.75f;

            cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cell8.BorderWidth = 0;
            cell8.BorderWidthBottom = 0.75f;

            pdfDatos.AddCell(cell1);
            pdfDatos.AddCell(cell2);
            pdfDatos.AddCell(cell3);
            pdfDatos.AddCell(cell4);
            pdfDatos.AddCell(cell5);
            pdfDatos.AddCell(cell6);
            pdfDatos.AddCell(cell7);
            pdfDatos.AddCell(cell8);

            doc.Add(pdfDatos);

            /*********************DIAS TRABAJADOS******************************/
            iTextSharp.text.pdf.PdfPTable pdfDiasTrabajados = new iTextSharp.text.pdf.PdfPTable(10);
            pdfDiasTrabajados.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell cellTrab1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Dias Trabajados: ", _standardFont3));
            cellTrab1.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(diasTrabajados, _standardFont3));
            cellTrab2.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Dias Libres: ", _standardFont3));
            cellTrab3.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(diasLibres, _standardFont3));
            cellTrab4.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Dias Subsidio Enfermedad: ", _standardFont3));
            cellTrab5.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(diasSubsidioEnf, _standardFont3));
            cellTrab6.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días F/D: ", _standardFont3));
            cellTrab7.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(feriadoDomingoLaborado, _standardFont3));
            cellTrab8.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab9 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Días de falta: ", _standardFont3));
            cellTrab9.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell cellTrab10 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(diasFalta, _standardFont3));
            cellTrab10.BorderWidth = 0;

            pdfDiasTrabajados.AddCell(cellTrab1);
            pdfDiasTrabajados.AddCell(cellTrab2);
            pdfDiasTrabajados.AddCell(cellTrab3);
            pdfDiasTrabajados.AddCell(cellTrab4);
            pdfDiasTrabajados.AddCell(cellTrab5);
            pdfDiasTrabajados.AddCell(cellTrab6);
            pdfDiasTrabajados.AddCell(cellTrab7);
            pdfDiasTrabajados.AddCell(cellTrab8);
            pdfDiasTrabajados.AddCell(cellTrab9);
            pdfDiasTrabajados.AddCell(cellTrab10);

            cellTrab1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° de horas trabajadas: ", _standardFont3));
            cellTrab1.BorderWidth = 0;

            cellTrab2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(horasTrabajadas, _standardFont3));
            cellTrab2.BorderWidth = 0;

            cellTrab3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° de días desc. Médico: ", _standardFont3));
            cellTrab3.BorderWidth = 0;

            cellTrab4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(diasDescanzoMedico, _standardFont3));
            cellTrab4.BorderWidth = 0;

            if (Sexo == "F")
                cellTrab5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° de días subsidio Maternidad: ", _standardFont3));
            else
                cellTrab5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° de días subsidio Paternidad: ", _standardFont3));

            cellTrab5.BorderWidth = 0;

            if (Sexo == "F")
                cellTrab6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(diasMaternidad, _standardFont3));
            else
                cellTrab6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(diasPaternidad, _standardFont3));

            cellTrab6.BorderWidth = 0;

            cellTrab7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° de días de vacaciones: ", _standardFont3));
            cellTrab7.BorderWidth = 0;

            cellTrab8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(diasVacaciones, _standardFont3));
            cellTrab8.BorderWidth = 0;

            cellTrab9 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cellTrab9.BorderWidth = 0;

            cellTrab10 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont3));
            cellTrab10.BorderWidth = 0;

            pdfDiasTrabajados.AddCell(cellTrab1);
            pdfDiasTrabajados.AddCell(cellTrab2);
            pdfDiasTrabajados.AddCell(cellTrab3);
            pdfDiasTrabajados.AddCell(cellTrab4);
            pdfDiasTrabajados.AddCell(cellTrab5);
            pdfDiasTrabajados.AddCell(cellTrab6);
            pdfDiasTrabajados.AddCell(cellTrab7);
            pdfDiasTrabajados.AddCell(cellTrab8);
            pdfDiasTrabajados.AddCell(cellTrab9);
            pdfDiasTrabajados.AddCell(cellTrab10);


            doc.Add(pdfDiasTrabajados);

            /*********************DETALLE BOLETA******************************/
            iTextSharp.text.pdf.PdfPTable pdfDetalleBoleta = new iTextSharp.text.pdf.PdfPTable(6);
            pdfDetalleBoleta.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
            iTextSharp.text.pdf.PdfPCell cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("REMUNERACIONES", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            cellBoleta1.BackgroundColor = iTextSharp.text.BaseColor.GRAY;
            cellBoleta1.BorderWidth = 0.75f;
            cellBoleta1.Colspan = 2;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("DESCUENTOS Y RETENCIONES", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            cellBoleta2.BackgroundColor = iTextSharp.text.BaseColor.GRAY;
            cellBoleta2.BorderWidth = 0.75f;
            cellBoleta2.Colspan = 2;


            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("APORTACIONES", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            cellBoleta3.BackgroundColor = iTextSharp.text.BaseColor.GRAY;
            cellBoleta3.BorderWidth = 0.75f;
            cellBoleta3.Colspan = 2;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);

            List<string> listaIngresos = new List<string>();
            List<string> listaDescuentos = new List<string>();
            List<string> listaAportaciones = new List<string>();

            /**************************LISTA DE INGRESOS*******************/

            if (valeConsumo != "0.00")
                listaIngresos.Add("VALE DE CONSUMO" + "," + valeConsumo);

            if (remuneracionBasica != "0.00")
                listaIngresos.Add("REMUNERACION BASICA" + "," + remuneracionBasica);

            if (asignacionFamiliar != "0.00")
                listaIngresos.Add("ASIGNACION FAMILIAR" + "," + asignacionFamiliar);

            if (movilidadPago != "0.00")
                listaIngresos.Add("MOVILIDAD" + "," + movilidadPago);
            
            if (montoDescanzoMedico != "0.00")
                listaIngresos.Add("DESCANZO MEDICO" + "," + montoDescanzoMedico);

            if (montoBonificacion != "0.00")
                listaIngresos.Add("BONIFICACION EXTRAORD." + "," + movilidadPago);

            if (montoVacaciones != "0.00")
                listaIngresos.Add("VACACIONES" + "," + montoVacaciones);

            if (montoCompraVacaciones != "0.00")
                listaIngresos.Add("COMPRA VACACIONES" + "," + montoCompraVacaciones);

            if (Subsidio != "0.00")
                listaIngresos.Add("SUBSIDIO" + "," + Subsidio);

            if (HE1 != "0.00")
                listaIngresos.Add("HORAS EXTRAS" + "," + HE1);

            if (HE2 != "0.00")
                listaIngresos.Add("HORAS EXTRAS SEGUNDAS" + "," + HE2);

            if (HEDoble != "0.00")
                listaIngresos.Add("HORAS EXTRAS DOBLES" + "," + HEDoble);

            if (presNavidad1 != "0.00")
                listaIngresos.Add("PRESTAMO NAVIDAD" + "," + presNavidad1);

            if (utilidades != "0.00")
                listaIngresos.Add("UTILIDADES" + "," + utilidades);

            /**************************LISTA DE DESCUENTOS*******************/


            if (totalDescuentoHoras != "0.00")
                listaDescuentos.Add("HORAS DESCUENTOS" + "," + totalDescuentoHoras);

            if (SeguroRimac != "0.00")
                listaDescuentos.Add("SEGURO RIMAC" + "," + SeguroRimac);

            if (DescuentoONP != "0.00")
                listaDescuentos.Add("DESCUENTO ONP" + "," + DescuentoONP);
            else
            {
                listaDescuentos.Add("DESCUENTO AFP" + "," + DescuentoAFP);
                listaDescuentos.Add("SEGURO AFP" + "," + seguroAFP);
                listaDescuentos.Add("COMISION AFP" + "," + comisionAFP);
            }

            if (descQuinta != "0.00")
                listaDescuentos.Add("QUINTA CATEGORIA" + "," + descQuinta);

            if (adelanto != "0.00")
                listaDescuentos.Add("ADELANTO" + "," + adelanto);

            if (EPS != "0.00")
                listaDescuentos.Add("EPS" + "," + EPS);

            if (SeguroRimac != "0.00")
                listaDescuentos.Add("SEGURO RIMAC" + "," + SeguroRimac);

            if (presNavidad2 != "0.00")
                listaDescuentos.Add("PRESTAMO NAVIDAD" + "," + presNavidad2);

            if (prestamos != "0.00")
                listaDescuentos.Add("PRESTAMOS" + "," + prestamos);

            if (retJudicial != "0.00")
                listaDescuentos.Add("RET. JUDICIAL" + "," + retJudicial);

            if (otrosDescuentos != "0.00")
                listaDescuentos.Add("OTROS DESCUENTOS" + "," + otrosDescuentos);

            if (adelaUtilidades != "0.00")
                listaDescuentos.Add("ADELANTO UTILIDADES" + "," + adelaUtilidades);

            /**************************LISTA DE APORTACIONES*******************/

            if (aporteEssalud != "0.00")
                listaAportaciones.Add("APORTE ESSALUD" + "," + aporteEssalud);

            /******************************************************************/

            int longIngresos = listaIngresos.Count;
            int longDescuentos = listaDescuentos.Count;
            int longAportaciones = listaAportaciones.Count;
            int longMayor = 0;

            if (longIngresos < longDescuentos)
                longMayor = longDescuentos;
            else
                longMayor = longIngresos;

            for (int r = 0; r < longMayor; r++)
            {
                if (r < longIngresos)
                {
                    string[] datos = listaIngresos[r].Split(',');

                    cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos[0], _standardFont4));
                    cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta1.BorderWidth = 0f;
                    cellBoleta1.BorderWidthLeft = 0.75f;

                    cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos[1], _standardFont4));
                    cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta2.BorderWidth = 0f;
                    cellBoleta2.BorderWidthRight = 0.75f;

                }
                else
                {
                    cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
                    cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta1.BorderWidth = 0f;
                    cellBoleta1.BorderWidthLeft = 0.75f;

                    cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
                    cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta2.BorderWidth = 0f;
                    cellBoleta2.BorderWidthRight = 0.75f;
                }

                if (r < longDescuentos)
                {
                    string[] datos2 = listaDescuentos[r].Split(',');

                    cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos2[0], _standardFont4));
                    cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta3.BorderWidth = 0f;

                    cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos2[1], _standardFont4));
                    cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta4.BorderWidth = 0f;
                    cellBoleta4.BorderWidthRight = 0.75f;

                }
                else
                {
                    cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta3.BorderWidth = 0f;

                    cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta4.BorderWidth = 0f;
                    cellBoleta4.BorderWidthRight = 0.75f;
                }

                if (r < longAportaciones)
                {
                    string[] datos3 = listaAportaciones[r].Split(',');

                    cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos3[0], _standardFont4));
                    cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta5.BorderWidth = 0f;

                    cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(datos3[1], _standardFont4));
                    cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta6.BorderWidth = 0f;
                    cellBoleta6.BorderWidthRight = 0.75f;

                }
                else
                {
                    cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellBoleta5.BorderWidth = 0f;

                    cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellBoleta6.BorderWidth = 0f;
                    cellBoleta6.BorderWidthRight = 0.75f;
                }

                pdfDetalleBoleta.AddCell(cellBoleta1);
                pdfDetalleBoleta.AddCell(cellBoleta2);
                pdfDetalleBoleta.AddCell(cellBoleta3);
                pdfDetalleBoleta.AddCell(cellBoleta4);
                pdfDetalleBoleta.AddCell(cellBoleta5);
                pdfDetalleBoleta.AddCell(cellBoleta6);

            }


            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            cellBoleta2.BorderWidthRight = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            cellBoleta2.BorderWidthRight = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);

            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            cellBoleta2.BorderWidthRight = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" ", _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Total", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(totalAportes, _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);


            cellBoleta1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("TOTAL INGRESOS", _standardFont4));
            cellBoleta1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta1.BorderWidth = 0f;
            cellBoleta1.BorderWidthLeft = 0.75f;
            cellBoleta1.BorderWidthTop = 0.75f;
            cellBoleta1.BorderWidthBottom = 0.75f;

            cellBoleta2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(totalIngresos, _standardFont4));
            cellBoleta2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta2.BorderWidth = 0f;
            //cellBoleta2.BorderWidthRight = 0.75f;
            cellBoleta2.BorderWidthTop = 0.75f;
            cellBoleta2.BorderWidthBottom = 0.75f;

            cellBoleta3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("TOTAL DESCUENTOS", _standardFont4));
            cellBoleta3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta3.BorderWidth = 0f;
            cellBoleta3.BorderWidthLeft = 0.75f;
            cellBoleta3.BorderWidthTop = 0.75f;
            cellBoleta3.BorderWidthBottom = 0.75f;

            cellBoleta4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(totalDescuentos, _standardFont4));
            cellBoleta4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta4.BorderWidth = 0f;
            cellBoleta4.BorderWidthRight = 0.75f;
            cellBoleta4.BorderWidthTop = 0.75f;
            cellBoleta4.BorderWidthBottom = 0.75f;

            cellBoleta5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("NETO RECIBIR", _standardFont4));
            cellBoleta5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
            cellBoleta5.BorderWidth = 0f;
            //cellBoleta5.BorderWidthLeft = 0.75f;
            cellBoleta5.BorderWidthTop = 0.75f;
            cellBoleta5.BorderWidthBottom = 0.75f;

            cellBoleta6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(netoRecibir, _standardFont4));
            cellBoleta6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
            cellBoleta6.BorderWidth = 0f;
            cellBoleta6.BorderWidthRight = 0.75f;
            cellBoleta6.BorderWidthTop = 0.75f;
            cellBoleta6.BorderWidthBottom = 0.75f;

            pdfDetalleBoleta.AddCell(cellBoleta1);
            pdfDetalleBoleta.AddCell(cellBoleta2);
            pdfDetalleBoleta.AddCell(cellBoleta3);
            pdfDetalleBoleta.AddCell(cellBoleta4);
            pdfDetalleBoleta.AddCell(cellBoleta5);
            pdfDetalleBoleta.AddCell(cellBoleta6);

            doc.Add(pdfDetalleBoleta);

            /*********************PIE DETALLE BOLETA******************************/

            // Creamos una tabla que contendrá el nombre, apellido y país 
            // de nuestros visitante.
            iTextSharp.text.pdf.PdfPTable tblPrueba = new iTextSharp.text.pdf.PdfPTable(1);
            tblPrueba.WidthPercentage = 100;

            // Configuramos el título de las columnas de la tabla
            iTextSharp.text.pdf.PdfPCell clNombre = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Depositado en " + bancoCtaSueldo + " Cta. Nro. " + numeroCtaSueldo, _standardFont3));
            clNombre.BorderWidth = 0;

            tblPrueba.AddCell(clNombre);

            // Finalmente, añadimos la tabla al documento PDF y cerramos el documento
            doc.Add(tblPrueba);
            
            //Agregamos firma digital
            //iTextSharp.text.Image imagen = iTextSharp.text.Image.GetInstance(Server.MapPath("~") + ConfigurationManager.AppSettings["rutaPDFFirmaDigital"].ToString());
            iTextSharp.text.Image imagen = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/imgSigned/firma.jpg"));
            imagen.BorderWidth = 0;
            imagen.Alignment = iTextSharp.text.Element.ALIGN_LEFT;
            float percentage = 0.0f;
            percentage = 150 / imagen.Width;
            imagen.ScalePercent(percentage * 100);

            // Insertamos la imagen en el documento
            doc.Add(imagen);

            iTextSharp.text.pdf.PdfPTable tblFirmas = new iTextSharp.text.pdf.PdfPTable(3);
            tblFirmas.WidthPercentage = 100;

            iTextSharp.text.pdf.PdfPCell firmaEmpleador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Firma Empleador", _standardFont2));
            firmaEmpleador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaEmpleador.BorderWidth = 0;
            firmaEmpleador.BorderWidthTop = 0.75f;

            iTextSharp.text.pdf.PdfPCell firmaEspacio = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(" "));
            firmaEspacio.BorderWidth = 0;

            iTextSharp.text.pdf.PdfPCell firmaTrabajador = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Firma Trabajador", _standardFont2));
            firmaTrabajador.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
            firmaTrabajador.BorderWidth = 0;
            firmaTrabajador.BorderWidthTop = 0.75f;

            tblFirmas.AddCell(firmaEmpleador);
            tblFirmas.AddCell(firmaEspacio);
            tblFirmas.AddCell(firmaTrabajador);

            doc.Add(tblFirmas);

            doc.Close();
            writer.Close();

            return result;
        }

        //3.2do paso -- actualiza el estado de 0 a 1
        public string actualizaPeriodo()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = "Exito";
            string par = "{\"valor\":\"" + _.Get("valor") + "\"}";
            par = _.addParameter(par, "idperiodo", _.Get("idperiodo"));
            oMantenimiento.get_Data("usp_UpdatePeriodoPlanillaStatus", par, true, Util.ERP);
            return result;
        }

        //3.3er paso -- envia correo
        public void enviarMail()
        {
            string mes = _.Get("mes");

            MailMessage email = new MailMessage();
            email.To.Add(new MailAddress(ConfigurationManager.AppSettings["mailPDFSigned"].ToString()));
            email.From = new MailAddress("erp@wts.com.pe");
            email.Subject = "Correo ERP - Creacion PDF de Boletas de Pago - " + DateTime.Now.ToString("dd / MMM / yyy hh:mm:ss");
            //email.Subject = "Pago Planilla ( Creacion PDF de Boletas de Pago - " + DateTime.Now.ToString("dd / MMM / yyy hh:mm:ss") + " ) ";
            email.Body = "Buenos dias <b> " + ConfigurationManager.AppSettings["namePDFSigned"].ToString() +
                         "</b><br>El Sistema ERP - WTS le informa que se ha cargado la planilla para el mes de <b>" + mes +
                         ".</b><br> Por favor realizar la firma de las boletas de pago respectivas. <br><br> Atte. <br><br> <b>SISTEMA ERP-WTS</b>";
            email.IsBodyHtml = true;
            email.Priority = MailPriority.Normal;

            SmtpClient smtp = new SmtpClient();
            smtp.Host = "192.168.0.20";
            smtp.EnableSsl = false;
            smtp.UseDefaultCredentials = false;

            string output = null;

            try
            {
                smtp.Send(email);
                email.Dispose();
                //output = "Corre electrónico fue enviado satisfactoriamente.";
            }
            catch (Exception ex)
            {
                output = "Error enviando correo electrónico: " + ex.Message;
            }



        }
        
        //4to paso - cambia de estado de 1 a 2 , se ejecuta luego que claudia halla firmado
        public string pdfCreateFileMovePath()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string ruta = Server.MapPath("~") + ConfigurationManager.AppSettings["rutaPDFCreated"].ToString();
            string result = "Exito";
            string origen = ruta;
            string destino = Server.MapPath("~") + ConfigurationManager.AppSettings["rutaPDFSigned"].ToString();

            CopyDirectoryContent(origen, destino, true);

            string par = "{\"valor\":\"" + 2.ToString() + "\"}";
            par = _.addParameter(par, "idperiodo", _.Get("idperiodo"));
            oMantenimiento.get_Data("usp_UpdatePeriodoPlanillaStatus", par, true, Util.ERP);

            //result = origen + " " + destino;
            return result;
        }
        

        //public ActionResult subirPlanilla()
        //{
        //    return View();
        //}



       

        //4.5
        public static void ActualizaNombrePDFBoleta(string Trabajador, string Periodo, string Anio, string Archivo)
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            //string result = "Exito";
            string par = "{\"trabajador\":\"" + Trabajador + "\",\"periodo\":\"" + Periodo + "\",\"anio\":\"" + Anio + "\",\"archivo\":\"" + Archivo + "\"}";
            //par = _.addParameter(par, "archivo", Archivo);
            oMantenimiento.get_Data("usp_PlanillaInsertNombrePDFBoleta", par, true, Util.ERP);
            //return result;
        }

        /***********************************************************************************************/

        //4.1
        /// Copiar el contenido de un directorio
        /// </summary>
        private static void CopyDirectoryContent(string origPath, string destPath, bool overwrite)
        {

            string destPathOrigin = destPath;

            if (System.IO.Directory.Exists(origPath))
            {
                foreach (string dirPath in System.IO.Directory.GetDirectories(origPath, "*", System.IO.SearchOption.AllDirectories))
                {
                    CreateEmptyDirectory(dirPath.Replace(origPath, destPath));
                }

                foreach (string newPath in System.IO.Directory.GetFiles(origPath, "*.*", System.IO.SearchOption.AllDirectories))
                {
                    string result = Path.GetRandomFileName();

                    destPath = destPathOrigin + result;
                    while (System.IO.File.Exists(destPath))
                    {
                        destPath = "";
                        result = Path.GetRandomFileName();
                        destPath = destPath + result;
                    }

                    CopyFile(newPath, destPath, overwrite, result);
                }
            }
        }

        //4.2  -- /4.3.1
        /// Crear un directorio vacior
        /// </summary>
        public static void CreateEmptyDirectory(string fullPath)
        {
            if (!System.IO.Directory.Exists(fullPath))
            {
                System.IO.Directory.CreateDirectory(fullPath);
            }
        }

        //4.3
        /// Copiar archivo
        /// </summary>
        public static void CopyFile(string origPath, string destPath, bool overwrite, string nom_archivo)
        {
            try
            {
                string[] archivo = origPath.Split('\\');
                int longArreglo = archivo.Length;

                if (archivo[longArreglo - 1].Contains("signed"))
                {
                    string[] nomarchivo = archivo[longArreglo - 1].Split('-');
                    string trabajadorBoleta = nomarchivo[0];
                    string periodo = nomarchivo[1];
                    string anio = nomarchivo[2].Split('.')[0];

                    if (System.IO.Path.GetExtension(destPath) == "")
                    {
                        destPath = System.IO.Path.Combine(destPath, System.IO.Path.GetFileName(origPath));
                    }
                    if (!System.IO.Directory.Exists(System.IO.Path.GetDirectoryName(destPath)))
                    {
                        CreateEmptyDirectory(System.IO.Path.GetDirectoryName(destPath));
                    }
                    if (!System.IO.File.Exists(destPath))
                    {
                        System.IO.File.Copy(origPath, destPath, true);
                    }
                    else
                    {
                        if (overwrite == true)
                        {
                            DeleteFile(destPath);
                            System.IO.File.Copy(origPath, destPath, true);
                        }
                    }


                    DeleteFile(origPath);
                    ActualizaNombrePDFBoleta(trabajadorBoleta, periodo, anio, nom_archivo);
                }
                else
                    DeleteFile(origPath);
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //4.4
        /// Borrar un archivo
        /// </summary>
        public static void DeleteFile(string fullPath)
        {
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.FileInfo info = new System.IO.FileInfo(fullPath);
                info.Attributes = System.IO.FileAttributes.Normal;
                System.IO.File.Delete(fullPath);
            }
        }

        /***********************************************************************************************/

        /*public string Save_Planilla()
        {
            _Helper helper = new _Helper();
            DataTable dt = _.Post("path") != null ? helper.convertExceltoDataSet(_.Post("path")) : null;
            bool exito = false;
            int id = -1;
            string data = string.Empty;
            if (dt != null)
            {                
                blMantenimiento oMantenimiento = new blMantenimiento();
                    exito = (oMantenimiento.save_Row("usp_PlanillaBoletaTemporal_eliminar", "",Util.ERP) >= 0) ? oMantenimiento.save_Rows_BulkCopy("Planilla_Boleta_Temporal", dt,Util.ERP) : false;
                    id = exito ? (oMantenimiento.save_Rows_Out("usp_PlanillaBoleta_insertar", _.Post("par"), Util.ERP)) : -1;
                    data = id>0 ? oMantenimiento.get_Data("usp_PlanillaBoleta_traerxid", id.ToString(), true, Util.ERP) : string.Empty;
            }
            return _.Mensaje("new", exito,data);
            }*/


    }
}