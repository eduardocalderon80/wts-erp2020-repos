using System;
using System.Web.Mvc;
using System.IO;
using WTS_ERP.Models;
using BL_ERP;
using BL_ERP.GestionProducto;
using BE_ERP.GestionProducto;
using System.Collections.Generic;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Newtonsoft.Json;


namespace WTS_ERP.Areas.GestionProducto.Controllers
{
    public class LabDipController : Controller
    {
        iTextSharp.text.Font Font_Titulo = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 6f, 1, BaseColor.BLACK);
        iTextSharp.text.Font Font_Mediano = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 6f, 0, BaseColor.BLACK);
        iTextSharp.text.Font Font_Mediano_2 = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 5f, 0, BaseColor.BLACK);

        iTextSharp.text.Font Font_Titulo_Documento = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 11f, 1, iTextSharp.text.BaseColor.BLACK);
        iTextSharp.text.Font Font_SubTitulo_Documento = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 8f, 1, iTextSharp.text.BaseColor.BLACK);
        iTextSharp.text.Font Font_Base_Documento = FontFactory.GetFont(FontFactory.HELVETICA, 9f, 0, iTextSharp.text.BaseColor.BLACK);
        iTextSharp.text.Font Font_Base_Documento_GrillaHeader = FontFactory.GetFont(FontFactory.HELVETICA, 7f, 1, iTextSharp.text.BaseColor.BLACK);
        iTextSharp.text.Font Font_Base_Documento_GrillaDetail = FontFactory.GetFont(FontFactory.HELVETICA, 7f, 0, iTextSharp.text.BaseColor.BLACK);

        // GET: GestionProducto/LabDip
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult Send()
        {
            return PartialView();
        }
              
        public string LabDip_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            //string par = "{\"idgrupopersonal\":\"" + _.Get("idgrupopersonal") + "\"}";
            //string par = "{\"idgrupopersonal\":\"" + 8 + "\"}";
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("usp_Labdip_List", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string LabDip_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_Labdip_Status_Laboratorio", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        /* Print */

        public string ListarLabdip()
        {
            string par = _.Get("par");
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("usp_Labdip_Print", par, false, Util.ERP);
            return data;
        }

        public ActionResult ListarLabdipPDF()
        {
            byte[] pdfbyte = new byte[0];
            string error = string.Empty;
            List<StickersLabdip> listaSticker = new List<StickersLabdip>();

            string data = ListarLabdip();
            if (data.Trim().Length > 0)
            {
                listaSticker = data != null && data.Length > 0 ? JsonConvert.DeserializeObject<List<StickersLabdip>>(data) : null;

                if (listaSticker.Count > 0)
                {
                    try
                    {
                        pdfbyte = Stickers(listaSticker);
                    }
                    catch (Exception ex)
                    {
                        pdfbyte = new byte[0];
                        error = ex.ToString();
                    }
                }
            }
            string FileName = listaSticker[0].codigoproyectotela ?? "Error";
            return File(pdfbyte, "application/pdf", "Sticker.pdf");
        }

        private byte[] Stickers(List<StickersLabdip> lista)
        {
            byte[] pdfbyte = new byte[0];
            MemoryStream ms = new MemoryStream();

            PdfWriter pdfw = default(PdfWriter);
            iTextSharp.text.Rectangle PageSize = new iTextSharp.text.Rectangle(288, 144);//4x6 pulgadas
            Document document = new Document(PageSize, 2, 1, 5, 5);    //5>2 //2, 1, 12, 0
            pdfw = PdfWriter.GetInstance(document, ms);

            document.Open();
            float[] arrayWidth = new float[] { 144f, 144f };
            int numcolumna = arrayWidth.Length;

            int i = 0;
            int l = lista.Count;
            PdfPTable tablaSticker;
            for (i = 0; i < l; i += 2)
            {
                // :tabla 
                tablaSticker = new PdfPTable(numcolumna);
                tablaSticker.TotalWidth = 288f;
                tablaSticker.LockedWidth = true;

                tablaSticker.SetWidths(arrayWidth);
                tablaSticker.HorizontalAlignment = 1;
                tablaSticker.SpacingBefore = 1.0f;
                tablaSticker.SpacingAfter = 0.0f;

                if ((i + 1) < l)
                {
                    addCell(tablaSticker, lista[i], 5);
                    addCell(tablaSticker, lista[i + 1], 15);
                }
                else
                {
                    addCell(tablaSticker, lista[i], 5);
                    addCell_White(tablaSticker, lista[i], 15);
                }

                document.Add(tablaSticker);
            }
            document.Close();
            pdfw.Close();
            pdfbyte = ms.GetBuffer();
            ms.Close();
            ms.Dispose();

            return pdfbyte;
        }

        private void addCell(PdfPTable tableStickerPrincipal, StickersLabdip carton, int paddingLeft)
        {
            float[] arrayWidth = new float[] { 50f, 80f };
            PdfPTable tablaSticker = new PdfPTable(arrayWidth);
            tablaSticker.TotalWidth = 130.0f;
            tablaSticker.LockedWidth = true;
            tablaSticker.HorizontalAlignment = 1;
            tablaSticker.SpacingBefore = 4f;
            tablaSticker.SpacingAfter = 4f;

            PdfPCell cell = new PdfPCell();

            cell = new PdfPCell(new Paragraph("Cliente:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;            
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.cliente, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Color:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.color, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Codigo T. :", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.codigocolor, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Alternativa:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.alternativa, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Tintoreria:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.tintoreria, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);           

            cell = new PdfPCell(new Paragraph("Temporada:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.temporada, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Composición:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);
            
            /*New*/
            cell = new PdfPCell(new Paragraph("", Font_Mediano));
            cell.Border = 0;            
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.composicion, Font_Mediano_2));
            cell.Border = 0;
            cell.Colspan = 2;
            tablaSticker.AddCell(cell);

            string composicion = string.Empty;
            int h = carton.composicion.Length;
            composicion = //(q == 0) ? "                                                                                       " :
            ////             (q <= 20) ? "                                " :
                         (h <= 35) ? "                                                                " :
                         (h <= 55) ? "                                " :
            //             // (q <= 45) ? "                                                                " :
            //             //  (q <= 75) ? "                                                                                                " :
                         string.Empty;

            ////if (carton.comentario.Length > 10)
            ////{
            ////iTextSharp.text.Font Font_Mediano_White = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 7f, 0, BaseColor.WHITE);

            cell = new PdfPCell(new Paragraph(composicion, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            cell.Colspan = 2;
            tablaSticker.AddCell(cell);
            ////}

            cell = new PdfPCell(new Paragraph("Comentario:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("", Font_Mediano));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.comentario, Font_Mediano_2));
            cell.Border = 0;
            cell.PaddingBottom = 5;
            cell.Colspan = 2;
            tablaSticker.AddCell(cell);

            string comentario = string.Empty;
            int q = carton.comentario.Length;
            comentario = //(q == 0) ? "                                                                                       " :
            //             (q <= 20) ? "                                " :
                         (q <= 35) ? "                                                                " :
                         (q <= 75) ? "                                " :
                          // (q <= 45) ? "                                                                " :
                          //  (q <= 75) ? "                                                                                                " :
                         string.Empty;

           

            cell = new PdfPCell(new Paragraph(comentario, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            cell.Colspan = 2;           
            tablaSticker.AddCell(cell);           

            //Fila sticker
            PdfPCell cellContent = new PdfPCell(tablaSticker);
            cellContent.Border = 0;
            cellContent.HorizontalAlignment = 0;
            cellContent.PaddingLeft = paddingLeft;

            tableStickerPrincipal.AddCell(cellContent);
        }

        private void addCell_White(PdfPTable tableStickerPrincipal, StickersLabdip carton, int paddingLeft)
        {
            float[] arrayWidth = new float[] { 50f, 80f };
            PdfPTable tablaSticker = new PdfPTable(arrayWidth);
            tablaSticker.TotalWidth = 130.0f;
            tablaSticker.LockedWidth = true;
            tablaSticker.HorizontalAlignment = 1;
            tablaSticker.SpacingBefore = 4f;
            tablaSticker.SpacingAfter = 4f;

            iTextSharp.text.Font Font_Mediano_White = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 7f, 0, BaseColor.WHITE);

            //Fila 1
            PdfPCell cell = new PdfPCell();

            cell = new PdfPCell(new Paragraph("Cliente:", Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.cliente, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Color:", Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.color, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);



            cell = new PdfPCell(new Paragraph("Tintoreria:", Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.tintoreria, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Codigo Tintoreria:", Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.codigocolor, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);



            cell = new PdfPCell(new Paragraph("Temporada:", Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.temporada, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Comentario:", Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.comentario, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            //Cell sticker
            PdfPCell cellContent = new PdfPCell(tablaSticker);
            cellContent.Border = 0;
            cellContent.HorizontalAlignment = 1;
            cellContent.PaddingLeft = paddingLeft;

            tableStickerPrincipal.AddCell(cellContent);

        }
        

        public ActionResult ListarLabdipResumenPDF()
        {
            byte[] pdfbyte = new byte[0];
            string error = string.Empty;
            List<StickersLabdip> listaSticker = new List<StickersLabdip>();

            string data = ListarLabdip();
            if (data.Trim().Length > 0)
            {
                listaSticker = data != null && data.Length > 0 ? JsonConvert.DeserializeObject<List<StickersLabdip>>(data) : null;

                if (listaSticker.Count > 0)
                {
                    try
                    {
                        pdfbyte = DocumentorResumen(listaSticker);
                    }
                    catch (Exception ex)
                    {
                        pdfbyte = new byte[0];
                        error = ex.ToString();
                    }
                }
            }
            string FileName = listaSticker[0].codigoproyectotela ?? "Error";
            return File(pdfbyte, "application/pdf", "Resumen.pdf");
        }

        private byte[] DocumentorResumen(List<StickersLabdip> lista)
        {
            byte[] pdfbyte = new byte[0];
            MemoryStream ms = new MemoryStream();
            PdfWriter pdfw = default(PdfWriter);
            Document document = new Document(PageSize.A4, 50f, 20f, 30f, 50f);    //5>2
            pdfw = PdfWriter.GetInstance(document, ms);

            document.Open();
            float[] arrayWidth = new float[] { 100f, 350f };//500f
            int numcolumna = arrayWidth.Length;


            PdfPTable tablaEncabezado;

            // :tabla encabezado
            tablaEncabezado = new PdfPTable(numcolumna);
            tablaEncabezado.TotalWidth = 500f;
            tablaEncabezado.LockedWidth = true;
            tablaEncabezado.SetWidths(arrayWidth);
            tablaEncabezado.HorizontalAlignment = 1;
            tablaEncabezado.SpacingBefore = 1.0f;
            tablaEncabezado.SpacingAfter = 0.0f;

            addCell_Encabezado(tablaEncabezado, lista[0]);
            document.Add(tablaEncabezado);

            PdfPTable tablaDetalle;
            // :tabla detalle
            arrayWidth = new float[] { 100f, 100f, 50f, 250f };//500f
            numcolumna = arrayWidth.Length;
            tablaDetalle = new PdfPTable(numcolumna);
            tablaDetalle.TotalWidth = 500f;
            tablaDetalle.LockedWidth = true;
            tablaDetalle.SetWidths(arrayWidth);
            tablaDetalle.HorizontalAlignment = 1;
            tablaDetalle.SpacingBefore = 40.0f;
            tablaDetalle.SpacingAfter = 0.0f;

            addCell_Detalle(tablaDetalle, lista);
            document.Add(tablaDetalle);

            document.Close();
            pdfw.Close();
            pdfbyte = ms.GetBuffer();
            ms.Close();
            ms.Dispose();

            return pdfbyte;
        }
        
        private void addCell_Encabezado(PdfPTable tablaEncabezado, StickersLabdip enty)
        {

            PdfPCell celdtaTitulo = new PdfPCell();
            celdtaTitulo.Border = Rectangle.NO_BORDER;
            celdtaTitulo.Colspan = 2;
            celdtaTitulo.HorizontalAlignment = 1;
            celdtaTitulo.PaddingTop = 10;
            celdtaTitulo.PaddingBottom = 15;
            celdtaTitulo.Phrase = new Phrase("Reporte de Labdip aprobadas", Font_Titulo_Documento);

            tablaEncabezado.AddCell(celdtaTitulo);

            PdfPCell cell = new PdfPCell();

            cell = new PdfPCell(new Paragraph("Fecha:", Font_SubTitulo_Documento));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            cell.Padding = 4;
            tablaEncabezado.AddCell(cell);

            cell = new PdfPCell(new Paragraph(System.DateTime.Today.ToShortDateString(), Font_Base_Documento));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            cell.Padding = 4;
            tablaEncabezado.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Cliente:", Font_SubTitulo_Documento));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            cell.Padding = 4;
            tablaEncabezado.AddCell(cell);

            cell = new PdfPCell(new Paragraph(enty.cliente, Font_Base_Documento));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            cell.Padding = 4;
            tablaEncabezado.AddCell(cell);

            //cell = new PdfPCell(new Paragraph("Composición:", Font_SubTitulo_Documento));
            //cell.Border = 0;
            //cell.HorizontalAlignment = 0;
            //cell.Padding = 4;
            //tablaEncabezado.AddCell(cell);

            //cell = new PdfPCell(new Paragraph(enty.composicion, Font_Base_Documento));
            //cell.Border = 0;
            //cell.HorizontalAlignment = 0;
            //cell.Padding = 4;
            //tablaEncabezado.AddCell(cell);

            //cell = new PdfPCell(new Paragraph("Temporada:", Font_SubTitulo_Documento));
            //cell.Border = 0;
            //cell.HorizontalAlignment = 0;
            //cell.Padding = 4;
            //tablaEncabezado.AddCell(cell);

            //cell = new PdfPCell(new Paragraph(enty.temporada, Font_Base_Documento));
            //cell.Border = 0;
            //cell.HorizontalAlignment = 0;
            //cell.Padding = 4;
            //tablaEncabezado.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Firma:", Font_SubTitulo_Documento));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            cell.Padding = 4;
            tablaEncabezado.AddCell(cell);

            cell = new PdfPCell(new Paragraph("______________________", Font_Base_Documento));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            cell.Padding = 4;
            tablaEncabezado.AddCell(cell);

        }

        private void addCell_Detalle(PdfPTable tablaDetalle, List<StickersLabdip> lista)
        {
            PdfPCell celdaColor = null;
            PdfPCell celdaTintoreria = null;
            PdfPCell celdaCodigoTintoreria = null;
            PdfPCell celdaComentario = null;

            PdfPCell celdaColorColumna = new PdfPCell(new Paragraph("Color", Font_Base_Documento_GrillaHeader));
            PdfPCell celdaTintoreriaColumna = new PdfPCell(new Paragraph("Tintoreria", Font_Base_Documento_GrillaHeader));
            PdfPCell celdaCodigoTintoreriaColumna = new PdfPCell(new Paragraph("Codigo Tintoreria", Font_Base_Documento_GrillaHeader));
            PdfPCell celdaComentarioColumna = new PdfPCell(new Paragraph("Comentario", Font_Base_Documento_GrillaHeader));

            celdaColorColumna.BackgroundColor = BaseColor.LIGHT_GRAY;
            celdaTintoreriaColumna.BackgroundColor = BaseColor.LIGHT_GRAY;
            celdaCodigoTintoreriaColumna.BackgroundColor = BaseColor.LIGHT_GRAY;
            celdaComentarioColumna.BackgroundColor = BaseColor.LIGHT_GRAY;

            celdaColorColumna.HorizontalAlignment = 1;
            celdaTintoreriaColumna.HorizontalAlignment = 1;
            celdaCodigoTintoreriaColumna.HorizontalAlignment = 1;
            celdaComentarioColumna.HorizontalAlignment = 1;

            tablaDetalle.AddCell(celdaColorColumna);
            tablaDetalle.AddCell(celdaTintoreriaColumna);
            tablaDetalle.AddCell(celdaCodigoTintoreriaColumna);
            tablaDetalle.AddCell(celdaComentarioColumna);

            foreach (StickersLabdip item in lista)
            {
                celdaColor = new PdfPCell(new Paragraph(item.color, Font_Base_Documento_GrillaDetail));
                celdaTintoreria = new PdfPCell(new Paragraph(item.tintoreria, Font_Base_Documento_GrillaDetail));
                celdaCodigoTintoreria = new PdfPCell(new Paragraph(item.codigocolor, Font_Base_Documento_GrillaDetail));
                celdaComentario = new PdfPCell(new Paragraph(item.comentario, Font_Base_Documento_GrillaDetail));

                tablaDetalle.AddCell(celdaColor);
                tablaDetalle.AddCell(celdaTintoreria);
                tablaDetalle.AddCell(celdaCodigoTintoreria);
                tablaDetalle.AddCell(celdaComentario);
            }
        }

      
    }
}