using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BarcodeLib;
using System.Drawing;
using iTextSharp.text;
using iTextSharp.text.pdf;
using BL_ERP;
using WTS_ERP.Models;
using Newtonsoft.Json;

namespace WTS_ERP.Areas.PortalFabrica.Controllers
{
    public class CartonLabelOrvisController : Controller
    {

        iTextSharp.text.Font Font_Barras = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 12f, 1, BaseColor.BLACK);
        iTextSharp.text.Font Font_Mediano = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 7f, 0, BaseColor.BLACK);
        iTextSharp.text.Font Font_Base = FontFactory.GetFont(FontFactory.HELVETICA, 9f, 0, BaseColor.BLACK);


        public ActionResult Index()
        {
            return View();
        }

        public ActionResult IndexFabrica()
        {
            return View();
        }

        public ActionResult _New()
        {
            return View();
        }

        public string ListarCartonLabel() {
            blMantenimiento bl = new blMantenimiento();
            string par = " ";
            string data = bl.get_Data("usp_StickerOrvis_Listar", par, true, Util.ERP);
            return data;
        }

        public string InsertarCartonLabel()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario);
            int idresult = bl.save_Row("usp_StickerOrvis_Insertar", par, Util.ERP);
            string mensaje = _.Mensaje("new", idresult > 0);
            return mensaje;
        }



        public string CartonLabelPDF_drop() {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario);
            int idresult = bl.save_Row("usp_StickerOrvis_Drop", par, Util.ERP);
            string mensaje = _.Mensaje("remove", idresult > 0);
            return mensaje;
        }


        public ActionResult CartonLabelPDF()
        {
            byte[] pdfbyte = new byte[0];            
            string error = string.Empty;

            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("id");
            string data = bl.get_Data("usp_StickerOrvis_TraerxId", par, true, Util.ERP);

            List<CartonLabelOrvis> listaSticker = new List<CartonLabelOrvis>();
            ReporteBaseCartonLabelOrvis oReporte = new ReporteBaseCartonLabelOrvis();
            oReporte = data != null && data.Length > 0 ? JsonConvert.DeserializeObject<List<ReporteBaseCartonLabelOrvis>>(data)[0] : null;

            if (oReporte != null) {
                try
                {                    
                    listaSticker = getLista(oReporte.data);
                    pdfbyte = Stickers(listaSticker);
                }
                catch (Exception ex)
                {
                    pdfbyte = new byte[0];
                    error = ex.ToString();
                }
            }            
            string FileName = oReporte.po??"Error";
            return File(pdfbyte, "application/pdf", FileName + ".pdf");
        }
        private List<CartonLabelOrvis> getLista(string data)
        {
            List<CartonLabelOrvis> lista = new List<CartonLabelOrvis>();
            string[] adata = data.Split('^');
            int i = 0;
            int l = adata.Length;
            string[] item;
            int q = 0;
            int x = 0;
            for (i = 0; i < l; i++)
            {
                item = adata[i].Split('¬');
                q = int.Parse(item[3].ToString());
                for (x = 0; x < q; x++) {
                    lista.Add(new CartonLabelOrvis { color = item[0], code = item[1], talla = item[2] });
                }                
            }
            return lista;
        }

        private byte[] Stickers(List<CartonLabelOrvis> lista)
        {
            byte[] pdfbyte = new byte[0];
            MemoryStream ms = new MemoryStream();

            PdfWriter pdfw = default(PdfWriter);
            iTextSharp.text.Rectangle PageSize = new iTextSharp.text.Rectangle(288, 72);
            Document document = new Document(PageSize, 5, 5, 12, 0);// (5, 5, 0, 0); // (5, 5, 5, 0); // (5, 5, 2, 0);   // :1
            pdfw = PdfWriter.GetInstance(document, ms);

            document.Open();            
            float[] arrayWidth = new float[] { 144f, 144f };
            int numcolumna = arrayWidth.Length;
            
            int i = 0;
            int l = lista.Count;
            PdfPTable tablaSticker;
            for (i = 0; i < l; i += 2)
            {                
                tablaSticker = new PdfPTable(numcolumna);
                tablaSticker.TotalWidth = 288f;
                tablaSticker.LockedWidth = true;

                tablaSticker.SetWidths(arrayWidth);
                tablaSticker.HorizontalAlignment = 1;                
                tablaSticker.SpacingBefore = 1.0f;//5 => 2.5 => 10 // :2 
                tablaSticker.SpacingAfter = 0.0f;//10 =>5.0 => 1

                /*
                 if ((i + 1) < l)
                {
                    addCell(pdfw, tablaSticker, lista[i], 10);
                    addCell(pdfw, tablaSticker, lista[i + 1], 20);
                }
                else {
                    addCell(pdfw, tablaSticker, lista[i], 10);
                    addCell_White(pdfw, tablaSticker, lista[i], 20);
                }               
                 
                */
                 
                if ((i + 1) < l)
                {
                    addCell(pdfw, tablaSticker, lista[i], 5);   //10
                    addCell(pdfw, tablaSticker, lista[i + 1], 15);//20
                }
                else {
                    addCell(pdfw, tablaSticker, lista[i], 5);
                    addCell_White(pdfw, tablaSticker, lista[i], 15);
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

        private void addCell(PdfWriter pdfw, PdfPTable tableStickerPrincipal, CartonLabelOrvis carton, int paddingLeft)
        {
            float[] arrayWidth = new float[] { 40f, 50f, 40f };
            PdfPTable tablaSticker = new PdfPTable(arrayWidth);
            tablaSticker.TotalWidth = 130.0f;
            tablaSticker.LockedWidth = true;
            tablaSticker.HorizontalAlignment = 1;
            tablaSticker.SpacingBefore = 4f;
            tablaSticker.SpacingAfter = 4f;

            //Fila 1
            PdfPCell cell = new PdfPCell();

            cell = new PdfPCell(new Paragraph(carton.color, Font_Mediano));
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.code, Font_Base));
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.talla, Font_Mediano));
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            tablaSticker.AddCell(cell);

            //Fila 2 => codigo de barras
            PdfContentByte cb128 = new PdfContentByte(pdfw);
            Barcode128 code128 = new Barcode128();
            code128.ChecksumText = true;
            code128.CodeType = Barcode128.CODE128;
            code128.Code = carton.code;
            code128.Font = null;
            iTextSharp.text.Image image128 = code128.CreateImageWithBarcode(cb128, null, null);
            image128.ScaleAbsolute(90, 30);

            cell = new PdfPCell(image128);
            cell.Border = 0;
            cell.Colspan = 3;
            cell.HorizontalAlignment = 1;
            cell.PaddingBottom = 4;
            cell.PaddingTop = 4;
            tablaSticker.AddCell(cell);

            //Cell sticker
            PdfPCell cellContent = new PdfPCell(tablaSticker);
            cellContent.Border = 0;
            cellContent.HorizontalAlignment = 1;
            cellContent.PaddingLeft = paddingLeft;

            tableStickerPrincipal.AddCell(cellContent);
            /*
            cellContent.PaddingBottom = 2;
            cellContent.PaddingRight = 2;
            cellContent.PaddingTop = 2;
            cellContent.PaddingLeft = 2;
            */

        }

        private void addCell_White(PdfWriter pdfw, PdfPTable tableStickerPrincipal, CartonLabelOrvis carton, int paddingLeft)
        {
            float[] arrayWidth = new float[] { 40f, 50f, 40f };
            PdfPTable tablaSticker = new PdfPTable(arrayWidth);
            tablaSticker.TotalWidth = 130.0f;
            tablaSticker.LockedWidth = true;
            tablaSticker.HorizontalAlignment = 1;
            tablaSticker.SpacingBefore = 4f;
            tablaSticker.SpacingAfter = 4f;

            iTextSharp.text.Font Font_Barras_White = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 12f, 1, BaseColor.WHITE);
            iTextSharp.text.Font Font_Mediano_White = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 7f, 0, BaseColor.WHITE);
            iTextSharp.text.Font Font_Base_White = FontFactory.GetFont(FontFactory.HELVETICA, 9f, 0, BaseColor.WHITE);
            
            //Fila 1
            PdfPCell cell = new PdfPCell();

            cell = new PdfPCell(new Paragraph(carton.color, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.code, Font_Base_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.talla, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            tablaSticker.AddCell(cell);

            //Fila 2 => codigo de barras
            cell = new PdfPCell(new Paragraph(carton.talla, Font_Mediano_White));
            cell.Border = 0;
            cell.Colspan = 3;
            cell.HorizontalAlignment = 1;
            cell.PaddingBottom = 4;
            cell.PaddingTop = 4;
            tablaSticker.AddCell(cell);

            //Cell sticker
            PdfPCell cellContent = new PdfPCell(tablaSticker);
            cellContent.Border = 0;
            cellContent.HorizontalAlignment = 1;
            cellContent.PaddingLeft = paddingLeft;

            tableStickerPrincipal.AddCell(cellContent);
           
        }

    }

    public class CartonLabelOrvis{
        public CartonLabelOrvis() { }

        public string color { get; set; }
        public string code { get; set; }
        public string talla { get; set; }
        

    }

    public class ReporteBaseCartonLabelOrvis {
        public string po { get; set; }
        public string data { get; set; }
    }


}