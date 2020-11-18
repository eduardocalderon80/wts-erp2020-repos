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
using BE_ERP;
using BL_ERP;
using Excel;
using Newtonsoft;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Mail;
using System.Net;
using System.Web.UI;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.io;
using BE_ERP.RecursosHumanos;
using BL_ERP.RecursosHumanos;
using Utilitario;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class RRHHController : Controller
    {
        // GET: RecursosHumanos/RRHH/Index
        public ActionResult Index()
        {
            //string PathFileServer = Server.MapPath("~/Content/img/RRHH/personal/thumbnail/");

            string ruta = ConfigurationManager.AppSettings["rutaImgPersonal"].ToString();
            //string ruta = Server.MapPath("~") + ConfigurationManager.AppSettings["rutaImgPersonal"].ToString();
            //ViewBag.Usuario = _.GetUsuario().Usuario.ToString();
            //ViewBag.PathStyleWeb = PathFileServer + "erp/style/thumbnail/";
            ViewBag.PathStyleWeb = ruta;
            //ViewBag.perfil = _.GetUsuario().Perfiles;
            return View();
        }

        // GET: RecursosHumanos/RRHH
        public ActionResult Area()
        {
            return View();
        }

        // GET: RecursosHumanos/RRHH
        public ActionResult Cargo()
        {
            return View();
        }

        public string Area_List()
        {
            int id = -1;
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Area_List", "", false, Util.ERP) : string.Empty;
            return dataResult;
        }

        public string Area_Insert()
        {
            int id = -1;
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Area_Insert", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }

        public string Area_Update()
        {
            int id = -1;
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Area_Update", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }


        public string Cargo_List()
        {
            int id = -1;
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Cargo_List", "", false, Util.ERP) : string.Empty;
            return dataResult;
        }

        public string Cargo_Insert()
        {
            int id = -1;
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Cargo_Insert", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }

        public string Cargo_Update()
        {
            int id = -1;
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Cargo_Update", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }


        public string LoadPersonal()
        {
            int id = -1;
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_PersonalAreaCargo_List", "", false, Util.ERP) : string.Empty;
            return dataResult;
        }

        /*
        public string Personal_Insert()
        {
            int id = -1;
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Personal_Insert", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }
        */

        public string Personal_Delete()
        {
            int id = -1;
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Personal_Delete", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }

        /*
        public string Personal_Update()
        {
            int id = -1;
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Personal_Update", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }
        */

        public string Personal_Insert(byte[] ImagenWebCopy)
        {
            //string Ruta = ConfigurationManager.AppSettings["FileServer"].ToString();
            int id = -1;
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario.ToString());

            HttpPostedFileBase EstiloImagen = Request.Files["parimagen"];

            string ImagenWebNombre = "";
            string ImagenNombre = "";
            string ImagenNombreArchivo = "";

            if (EstiloImagen != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenNombre = "";
                string cImagenWebNombre = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenMiniatura = Server.MapPath("~/Content/img/RRHH/personal/");

                ImagenNombreArchivo = System.IO.Path.GetFileName(EstiloImagen.FileName);

                MemoryStream target = new MemoryStream();
                EstiloImagen.InputStream.CopyTo(target);

                byte[] Imagen = target.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(EstiloImagen.FileName);
                Random oAleatorio = new Random();

                /*string cFolderOriginal = cRutaImagenOriginal;
                cImagenNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderOriginal, cImagenNombre), Imagen);*/

                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenNombre = cImagenNombre;
                ImagenWebNombre = cImagenWebNombre;
            }
            else if (ImagenWebCopy != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenNombre = "";
                string cImagenWebNombre = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenMiniatura = @"Content\RRHH\personal\";

                ImagenNombreArchivo = _.Post("ImagenNombre");

                byte[] Imagen = ImagenWebCopy.ToArray();

                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(ImagenNombreArchivo);
                Random oAleatorio = new Random();

                /*string cFolderOriginal = cRutaImagenOriginal;
                cImagenNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderOriginal, cImagenNombre), Imagen);*/

                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenNombre = cImagenNombre;
                ImagenWebNombre = cImagenWebNombre;
            }

            par = _.addParameter(par, "ImagenWebNombre", ImagenWebNombre);
            par = _.addParameter(par, "ImagenNombre", ImagenNombre);
            par = _.addParameter(par, "ImagenNombreArchivo", ImagenNombreArchivo);

            blMantenimiento oMantenimiento = new blMantenimiento();
            //string dataResult = id < 0 ? oMantenimiento.get_Data("usp_PersonalUsuario_Insert", par, false, Util.ERP) : string.Empty;
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Personal_Insert", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }


        public string Personal_Update(byte[] ImagenWebCopy)
        {
            int id = -1;
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().CodUsuario.ToString());

            HttpPostedFileBase EstiloImagen = Request.Files["parimagen"];

            string ImagenWebNombre = "";
            string ImagenNombre = "";
            string ImagenNombreArchivo = "";

            if (EstiloImagen != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenNombre = "";
                string cImagenWebNombre = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenMiniatura = Server.MapPath("~/Content/img/RRHH/personal/");

                ImagenNombreArchivo = System.IO.Path.GetFileName(EstiloImagen.FileName);

                MemoryStream target = new MemoryStream();
                EstiloImagen.InputStream.CopyTo(target);

                byte[] Imagen = target.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(EstiloImagen.FileName);
                Random oAleatorio = new Random();


                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenNombre = cImagenNombre;
                ImagenWebNombre = cImagenWebNombre;
            }
            else if (ImagenWebCopy != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cImagenNombre = "";
                string cImagenWebNombre = "";
                string cRutaImagenMiniatura = "";

                cRutaImagenMiniatura = @"Content\RRHH\personal\";

                ImagenNombreArchivo = _.Post("ImagenNombre");

                byte[] Imagen = ImagenWebCopy.ToArray();

                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(ImagenNombreArchivo);
                Random oAleatorio = new Random();

                string cFolderThumbnail = cRutaImagenMiniatura;
                cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), ImagenWeb);

                ImagenNombre = cImagenNombre;
                ImagenWebNombre = cImagenWebNombre;
            }

            par = _.addParameter(par, "ImagenWebNombre", ImagenWebNombre);
            par = _.addParameter(par, "ImagenNombre", ImagenNombre);
            par = _.addParameter(par, "ImagenNombreArchivo", ImagenNombreArchivo);

            blMantenimiento oMantenimiento = new blMantenimiento();
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Personal_Update", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }


        //public FileResult Personal_ReportPDF(int IdArea, int IdCargo, int Estado)
        //{
        //    byte[] bytes = new byte[0];
        //    string FileName = "Error.pdf";
        //    try
        //    {

        //        FileName = "Reporte del Personal WTS " + DateTime.Now.ToString("yyyyMMddhmm");

        //        blPersonal blPersonal = new blPersonal();
        //        List<Personal> listPersonal = blPersonal.Personal_ReportPDF(Util.ERP, IdArea, IdCargo, Estado);

        //        string strEstado = string.Empty;

        //        if (Estado == 0)
        //        {
        //            strEstado = "ACTIVOS";
        //        }
        //        else
        //        {
        //            strEstado = "INACTIVOS";
        //        }

        //        if (listPersonal != null)
        //        {

        //            using (MemoryStream ms = new MemoryStream())
        //            {

        //                Document document = new Document(iTextSharp.text.PageSize.A4, 30, 30, 20, 45);

        //                PdfWriter writer = PdfWriter.GetInstance(document, ms);

        //                TwoColumnHeaderFooter PageEventHandler = new TwoColumnHeaderFooter();
        //                writer.PageEvent = PageEventHandler;
        //                //Define the page header
        //                PageEventHandler.Title = ""; //set empty title only to not add title and add footer
        //                PageEventHandler.HeaderFont = FontFactory.GetFont(BaseFont.COURIER_BOLD, 10, Font.BOLD);
        //                PageEventHandler.HeaderLeft = "Group";
        //                PageEventHandler.HeaderRight = "1";

        //                document.Open();
        //                var Smaller = FontFactory.GetFont(FontFactory.HELVETICA, 6);
        //                var SmallerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 6);
        //                var SmallFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 7);
        //                var SmallFont = FontFactory.GetFont(FontFactory.HELVETICA, 7);
        //                var RegularFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);

        //                var MediumFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14);
        //                var MediumFont = FontFactory.GetFont(FontFactory.HELVETICA, 9);
        //                var LargeFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16);
        //                var LargeFont = FontFactory.GetFont(FontFactory.HELVETICA, 32);

        //                PdfPTable table = new PdfPTable(1);
        //                table.WidthPercentage = 100;

        //                PdfPTable Row1 = new PdfPTable(2);
        //                Row1.WidthPercentage = 100;
        //                //Row1.DefaultCell.Border = Rectangle.NO_BORDER;


        //                iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/img/logos/WTSLogo2.png"));
        //                jpg.ScaleToFit(120f, 90f);

        //                PdfPCell cellLogo = new PdfPCell(jpg);
        //                cellLogo.Border = Rectangle.NO_BORDER;
        //                cellLogo.PaddingBottom = 15;

        //                PdfPCell cellUsuario = new PdfPCell(new Phrase(string.Format("Fecha: {0} \n" + "Usuario: {1}", DateTime.Today.ToShortDateString(), _.GetUsuario().Usuario), SmallFontBold));
        //                cellUsuario.HorizontalAlignment = Element.ALIGN_RIGHT;
        //                cellUsuario.VerticalAlignment = Element.ALIGN_BOTTOM;
        //                cellUsuario.Border = Rectangle.NO_BORDER;
        //                cellUsuario.PaddingBottom = 15;

        //                Row1.AddCell(cellLogo);
        //                Row1.AddCell(cellUsuario);

        //                table.DefaultCell.Border = Rectangle.NO_BORDER;
        //                table.AddCell(Row1);

        //                PdfPTable Row1_1 = new PdfPTable(1);
        //                Row1_1.WidthPercentage = 150;

        //                PdfPCell cellBlank = new PdfPCell(new Phrase(" "));
        //                cellBlank.Border = Rectangle.TOP_BORDER;

        //                Row1_1.AddCell(cellBlank);

        //                table.AddCell(Row1_1);

        //                PdfPTable Row2 = new PdfPTable(1);
        //                Row2.WidthPercentage = 100;
        //                PdfPCell cellTitle = new PdfPCell(new Phrase(string.Format("LISTADO DEL PERSONAL " + strEstado), MediumFontBold));
        //                //cellTitle.PaddingRight = 100;
        //                cellTitle.PaddingLeft = 100;
        //                cellTitle.PaddingRight = 100;
        //                /*cellTitle.PaddingTop = 20;*/
        //                cellTitle.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellTitle.Border = Rectangle.NO_BORDER;

        //                Row2.AddCell(cellTitle);

        //                table.AddCell(Row2);


        //                PdfPTable Row3 = new PdfPTable(1);
        //                Row3.WidthPercentage = 100;

        //                PdfPTable DetailTable = new PdfPTable(5);

        //                PdfPCell cellId = new PdfPCell(new Phrase("N ° ", SmallerFont));
        //                cellId.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellId.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellId.PaddingTop = 10;
        //                cellId.PaddingBottom = 10;

        //                PdfPCell cellNombrePersonal = new PdfPCell(new Phrase("PERSONAL", SmallerFont));
        //                cellNombrePersonal.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellNombrePersonal.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellNombrePersonal.PaddingTop = 10;
        //                cellNombrePersonal.PaddingBottom = 10;

        //                PdfPCell cellDni = new PdfPCell(new Phrase("DNI", SmallerFont));
        //                cellDni.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellDni.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellDni.PaddingTop = 10;
        //                cellDni.PaddingBottom = 10;

        //                PdfPCell cellNombreArea = new PdfPCell(new Phrase("ÁREA", SmallerFont));
        //                cellNombreArea.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellNombreArea.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellNombreArea.PaddingTop = 10;
        //                cellNombreArea.PaddingBottom = 10;

        //                PdfPCell cellNombreCargo = new PdfPCell(new Phrase("CARGO", SmallerFont));
        //                cellNombreCargo.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellNombreCargo.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellNombreCargo.PaddingTop = 10;
        //                cellNombreCargo.PaddingBottom = 10;

        //                DetailTable.AddCell(cellId);
        //                DetailTable.AddCell(cellNombrePersonal);
        //                DetailTable.AddCell(cellDni);
        //                DetailTable.AddCell(cellNombreArea);
        //                DetailTable.AddCell(cellNombreCargo);


        //                int q = listPersonal.Count;
        //                int x = 0;

        //                // 1ra parte

        //                cellId = new PdfPCell(new Phrase(Convert.ToString(x + 1), Smaller));
        //                cellId.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellId.Border = Rectangle.NO_BORDER;

        //                cellNombrePersonal = new PdfPCell(new Phrase(listPersonal[0].NombrePersonal, Smaller));
        //                cellNombrePersonal.HorizontalAlignment = Element.ALIGN_LEFT;
        //                cellNombrePersonal.Border = Rectangle.NO_BORDER;

        //                cellDni = new PdfPCell(new Phrase(listPersonal[0].Dni, Smaller));
        //                cellDni.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellDni.Border = Rectangle.NO_BORDER;

        //                cellNombreArea = new PdfPCell(new Phrase(listPersonal[0].NombreArea, Smaller));
        //                cellNombreArea.HorizontalAlignment = Element.ALIGN_LEFT;
        //                cellNombreArea.Border = Rectangle.NO_BORDER;

        //                cellNombreCargo = new PdfPCell(new Phrase(listPersonal[0].NombreCargo, Smaller));
        //                cellNombreCargo.HorizontalAlignment = Element.ALIGN_LEFT;
        //                cellNombreCargo.Border = Rectangle.NO_BORDER;


        //                cellId.PaddingTop = 10;
        //                cellNombrePersonal.PaddingTop = 10;
        //                cellDni.PaddingTop = 10;
        //                cellNombreArea.PaddingTop = 10;
        //                cellNombreCargo.PaddingTop = 10;

        //                DetailTable.AddCell(cellId);
        //                DetailTable.AddCell(cellNombrePersonal);
        //                DetailTable.AddCell(cellDni);
        //                DetailTable.AddCell(cellNombreArea);
        //                DetailTable.AddCell(cellNombreCargo);

        //                // 2da parte
        //                for (x = 1; x < q; x++)
        //                {

        //                    cellId = new PdfPCell(new Phrase(Convert.ToString(x + 1), Smaller));
        //                    cellId.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellId.Border = Rectangle.NO_BORDER;

        //                    cellNombrePersonal = new PdfPCell(new Phrase(listPersonal[x].NombrePersonal, Smaller));
        //                    cellNombrePersonal.HorizontalAlignment = Element.ALIGN_LEFT;
        //                    cellNombrePersonal.Border = Rectangle.NO_BORDER;

        //                    cellDni = new PdfPCell(new Phrase(listPersonal[x].Dni, Smaller));
        //                    cellDni.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellDni.Border = Rectangle.NO_BORDER;

        //                    cellNombreArea = new PdfPCell(new Phrase(listPersonal[x].NombreArea, Smaller));
        //                    cellNombreArea.HorizontalAlignment = Element.ALIGN_LEFT;
        //                    cellNombreArea.Border = Rectangle.NO_BORDER;

        //                    cellNombreCargo = new PdfPCell(new Phrase(listPersonal[x].NombreCargo, Smaller));
        //                    cellNombreCargo.HorizontalAlignment = Element.ALIGN_LEFT;
        //                    cellNombreCargo.Border = Rectangle.NO_BORDER;

        //                    DetailTable.AddCell(cellId);
        //                    DetailTable.AddCell(cellNombrePersonal);
        //                    DetailTable.AddCell(cellDni);
        //                    DetailTable.AddCell(cellNombreArea);
        //                    DetailTable.AddCell(cellNombreCargo);
        //                }


        //                PdfPCell cellContent = new PdfPCell(DetailTable);
        //                cellContent.Border = Rectangle.NO_BORDER;
        //                cellContent.PaddingTop = 20;

        //                Row3.AddCell(cellContent);

        //                table.AddCell(Row3);

        //                table.SplitLate = false;

        //                document.Add(table);

        //                document.Close();
        //                writer.Close();

        //                bytes = ms.GetBuffer();


        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        string hola = ex.Message;
        //    }
        //    return File(bytes, "application/pdf", FileName + ".pdf");
        //}

        public class TwoColumnHeaderFooter : PdfPageEventHelper
        {
            // This is the contentbyte object of the writer
            PdfContentByte cb;
            // we will put the final number of pages in a template
            PdfTemplate template;
            // this is the BaseFont we are going to use for the header / footer
            BaseFont bf = null;
            // This keeps track of the creation time
            DateTime PrintTime = DateTime.Now;
            #region Properties
            private string _Title;
            public string Title
            {
                get { return _Title; }
                set { _Title = value; }
            }

            private string _HeaderLeft;
            public string HeaderLeft
            {
                get { return _HeaderLeft; }
                set { _HeaderLeft = value; }
            }
            private string _HeaderRight;
            public string HeaderRight
            {
                get { return _HeaderRight; }
                set { _HeaderRight = value; }
            }
            private Font _HeaderFont;
            public Font HeaderFont
            {
                get { return _HeaderFont; }
                set { _HeaderFont = value; }
            }
            private Font _FooterFont;
            public Font FooterFont
            {
                get { return _FooterFont; }
                set { _FooterFont = value; }
            }
            #endregion
            // we override the onOpenDocument method
            public override void OnOpenDocument(PdfWriter writer, Document document)
            {
                try
                {
                    PrintTime = DateTime.Now;
                    bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                    cb = writer.DirectContent;
                    template = cb.CreateTemplate(50, 50);
                }
                catch (DocumentException de)
                {
                }
                catch (System.IO.IOException ioe)
                {
                }
            }

            //public override void OnStartPage(PdfWriter writer, Document document)
            //{
            //    //base.OnStartPage(writer, document);
            //    //Rectangle pageSize = document.PageSize;
            //    //if (Title != string.Empty)
            //    //{
            //    //    cb.BeginText();
            //    //    cb.SetFontAndSize(bf, 15);
            //    //    cb.SetRGBColorFill(50, 50, 200);
            //    //    cb.SetTextMatrix(pageSize.GetLeft(40), pageSize.GetTop(40));
            //    //    cb.ShowText(Title);
            //    //    cb.EndText();
            //    //}
            //    //if (HeaderLeft + HeaderRight != string.Empty)
            //    //{
            //    //    PdfPTable HeaderTable = new PdfPTable(2);
            //    //    HeaderTable.DefaultCell.VerticalAlignment = Element.ALIGN_MIDDLE;
            //    //    HeaderTable.TotalWidth = pageSize.Width - 80;
            //    //    HeaderTable.SetWidthPercentage(new float[] { 45, 45 }, pageSize);

            //    //    PdfPCell HeaderLeftCell = new PdfPCell(new Phrase(8, HeaderLeft, HeaderFont));
            //    //    HeaderLeftCell.Padding = 5;
            //    //    HeaderLeftCell.PaddingBottom = 8;
            //    //    HeaderLeftCell.BorderWidthRight = 0;
            //    //    HeaderTable.AddCell(HeaderLeftCell);
            //    //    PdfPCell HeaderRightCell = new PdfPCell(new Phrase(8, HeaderRight, HeaderFont));
            //    //    HeaderRightCell.HorizontalAlignment = PdfPCell.ALIGN_RIGHT;
            //    //    HeaderRightCell.Padding = 5;
            //    //    HeaderRightCell.PaddingBottom = 8;
            //    //    HeaderRightCell.BorderWidthLeft = 0;
            //    //    HeaderTable.AddCell(HeaderRightCell);
            //    //    cb.SetRGBColorFill(0, 0, 0);
            //    //    HeaderTable.WriteSelectedRows(0, -1, pageSize.GetLeft(40), pageSize.GetTop(50), cb);
            //    //}
            //}
            public override void OnEndPage(PdfWriter writer, Document document)
            {
                base.OnEndPage(writer, document);
                int pageN = writer.PageNumber;
                String text = "Page " + pageN + " of ";
                float len = bf.GetWidthPoint(text, 8);
                Rectangle pageSize = document.PageSize;
                cb.SetRGBColorFill(100, 100, 100);
                cb.BeginText();
                cb.SetFontAndSize(bf, 8);
                cb.SetTextMatrix(pageSize.GetLeft(40), pageSize.GetBottom(30));
                cb.ShowText(text);
                cb.EndText();
                cb.AddTemplate(template, pageSize.GetLeft(40) + len, pageSize.GetBottom(30));

                //cb.BeginText();
                //cb.SetFontAndSize(bf, 8);
                //cb.ShowTextAligned(PdfContentByte.ALIGN_RIGHT,
                //"Printed On " + PrintTime.ToString(),
                //pageSize.GetRight(40),
                //pageSize.GetBottom(30), 0);
                //cb.EndText();
            }
            public override void OnCloseDocument(PdfWriter writer, Document document)
            {
                base.OnCloseDocument(writer, document);
                template.BeginText();
                template.SetFontAndSize(bf, 8);
                template.SetTextMatrix(0, 0);
                template.ShowText("" + (writer.PageNumber - 1));
                template.EndText();
            }
        }


        //public JsonResult Personal_ReportExcel(int IdArea, int IdCargo, int Estado)
        //{
        //    var jsonsession = new JsonResponse();
        //    var respuesta = new JsonResponse();
        //    blPersonal blPersonal = new blPersonal();
        //    List<Personal> listPersonal = blPersonal.Personal_ReportPDF(Util.ERP, IdArea, IdCargo, Estado);
        //    string strListaCabeceraTabla = string.Empty, strDatosFilasTabla = string.Empty, strTituloDocumento = string.Empty, strEstado = string.Empty;
        //    int totalfilas = 0, contador = 0;
        //    totalfilas = listPersonal.Count;

        //    string TituloHoja = "Listado de Personal";

        //    if (Estado == 0)
        //    {
        //        strEstado = "ACTIVOS";
        //    }
        //    else
        //    {
        //        strEstado = "INACTIVOS";
        //    }

        //    string strFecha = DateTime.Now.ToString("MM/dd/yyyy");

        //    strTituloDocumento = "LISTADO DE PERSONAL " + strEstado + " AL " + strFecha;

        //    strListaCabeceraTabla = "N°¬PERSONAL¬DNI¬ÁREA¬CARGO¬CORREO¬FECHA INGRESO¬FECHA CESE";

        //    if (listPersonal.Count > 0)
        //    {
        //        foreach (var item in listPersonal)
        //        {
        //            contador++;
        //            if (contador < totalfilas)
        //            {
        //                strDatosFilasTabla += (contador).ToString() + "¬" + item.NombrePersonal + "¬" + item.Dni + "¬" + item.NombreArea + "¬" + item.NombreCargo + "¬"
        //                    + item.CorreoElectronico + "¬" + item.FechaInicio + "¬" + item.FechaCese + "^";
        //            }
        //            else
        //            {
        //                strDatosFilasTabla += (contador).ToString() + "¬" + item.NombrePersonal + "¬" + item.Dni + "¬" + item.NombreArea + "¬" + item.NombreCargo + "¬"
        //                  + item.CorreoElectronico + "¬" + item.FechaInicio + "¬" + item.FechaCese;
        //            }
        //        }
        //    }

        //    byte[] filecontent = blPersonal.crearExcel_Personal(TituloHoja, strListaCabeceraTabla, strDatosFilasTabla, strTituloDocumento);

        //    jsonsession.Data = filecontent;

        //    System.Web.HttpContext.Current.Session["excelfacturav"] = jsonsession;

        //    respuesta.Success = true;
        //    respuesta.Message = "Exito";
        //    return Json(respuesta, JsonRequestBehavior.AllowGet);
        //}

        public FileContentResult descargarexcel_facturav()
        {
            blPersonal oblpersonal = new blPersonal();
            byte[] filecontent;
            string tituloreporte = string.Empty;
            var jsonsession = (JsonResponse)System.Web.HttpContext.Current.Session["excelfacturav"];
            filecontent = (byte[])jsonsession.Data;
            //tituloreporte = jsonsession.Message + ".xlsx";
            tituloreporte = "Reporte Listado Personal.xlsx";
            System.Web.HttpContext.Current.Session.Remove("excelfacturav");
            return File(filecontent, oblpersonal.ExcelContentType(), tituloreporte);
        }

        /*
        public JsonResult crearExcel_facturaV(string idfacturav)
        {


            var jsonsession = new JsonResponse();
            var respuesta = new JsonResponse();
            string nombre_numerofactura = "INVOICE# - V01 - 101";
            string fechafactura = "";
            string tituloderechoplease = "PLEASE ARRANGE WIRE TRANSFER TO THE FOLLOWING ACCOUNT";
            string terminosdepago = "15";
            string deliveryterms = "AIR";
            string paisdeorigen = "";
            string otrasreferenicias = "";

            string shipmode = "";
            string strListaCabeceraTabla = string.Empty, strDatosFilasTabla = string.Empty, strDatosSubTotalTabla = string.Empty;

            blFacturaV blfacturav = new blFacturaV();
            FacturaV objfacturav = blfacturav.GetFacturavById(int.Parse(idfacturav), Util.ERP);
            FacturaVDetalle objfacturavdetalle = new FacturaVDetalle();
            List<FacturaVDetalle> listafacturavdetalle = new List<FacturaVDetalle>();
            int totalfilas = 0, contador = 0;

            strListaCabeceraTabla = "Descripcion¬Quantity¬Unit Price US$¬Total US$";

            string[] arrayfiladireccionsticker = new string[0];
            string[] arraydatossticker = new string[0];
            string[] arraybillto = new string[0];
            string[] arrayconsignenotify_shipto = new string[0];
            if (objfacturav != null)
            {
                nombre_numerofactura = "INVOICE#   " + objfacturav.numerofactura;
                fechafactura = objfacturav.strfechafacturasticker;

                arrayfiladireccionsticker = objfacturav.direccionwtssticker.Split('^');
                arraydatossticker = objfacturav.sticker.Split('^');
                tituloderechoplease = objfacturav.titulosticker;
                terminosdepago = objfacturav.terminospago;
                shipmode = objfacturav.shipmode;
                arraybillto = objfacturav.billto.Split('^');
                arrayconsignenotify_shipto = objfacturav.shipto.Split('^');

                listafacturavdetalle = objfacturav.listafacturavdetalle;
                totalfilas = listafacturavdetalle.Count;

                if (listafacturavdetalle.Count > 0)
                {
                    foreach (var item in listafacturavdetalle)
                    {
                        contador++;
                        if (contador < totalfilas)
                        {
                            strDatosFilasTabla += item.descripcion + "¬" + item.cantidad.ToString() + "¬" + item.precio.ToString() + "¬" + item.importe.ToString() + "^";
                        }
                        else
                        {
                            strDatosFilasTabla += item.descripcion + "¬" + item.cantidad.ToString() + "¬" + item.precio.ToString() + "¬" + item.importe.ToString();
                        }
                    }
                }
            }
            // PARA EL TOTAL IMPORTE
            decimal totalimporte = listafacturavdetalle.Sum(x => x.importe);
            strDatosSubTotalTabla = "TOTAL AMOUNT \n USD:" + "¬" + totalimporte.ToString();

            byte[] filecontent = blfacturav.exportartoexcel_facturav(nombre_numerofactura, fechafactura, nombre_numerofactura,
                arrayfiladireccionsticker,
                tituloderechoplease,
                arraydatossticker,
                terminosdepago, deliveryterms, paisdeorigen, otrasreferenicias, arraybillto, arrayconsignenotify_shipto,
                shipmode,
                strListaCabeceraTabla, strDatosFilasTabla, strDatosSubTotalTabla);

            jsonsession.Data = filecontent;
            jsonsession.Message = nombre_numerofactura;

            System.Web.HttpContext.Current.Session["excelfacturav"] = jsonsession;

            respuesta.Success = true;
            respuesta.Message = "Exito";
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        */

        public void Personal_EnvioCorreo()
        {

            string param = _.Get("param");
            string Personal = _.Get_Par(param, "Personal");
            string Usuario = _.Get_Par(param, "Usuario");
            string Area = _.Get_Par(param, "Area");
            string Cargo = _.Get_Par(param, "Cargo");


            MailMessage email = new MailMessage();
            email.To.Add(new MailAddress("soporte@wts.com.pe"));
            email.To.Add(new MailAddress("lrojas@wts.com.pe"));
            email.From = new MailAddress("erp@wts.com.pe");
            email.Subject = "Correo ERP - Creacion de Usuario";



            email.Body = "Buenos dias Estimados" +
                         "<br> El Sistema ERP - WTS le informa que  ha ingresado el personal <b>" + Personal + "</b>.</br>" +

                         "<br><table border=1>" +
                            "<tr>" +
                                "<th>" + "Personal" + "</th>" +
                                "<th>" + "Usuario" + "</th>" +
                                "<th>" + "Area" + "</th>" +
                                "<th>" + "Cargo" + "</th>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>" + " &nbsp; &nbsp;" + Personal + " &nbsp; &nbsp;" + "</td>" +
                                "<td>" + " &nbsp; &nbsp;" + Usuario + " &nbsp; &nbsp;" + "</td>" +
                                "<td>" + " &nbsp; &nbsp;" + Area + " &nbsp; &nbsp;" + "</td>" +
                                "<td>" + " &nbsp; &nbsp;" + Cargo + " &nbsp; &nbsp;" + "</td>" +
                            "</tr>" +
                         "</table></br>" +
                         "<br> Por favor realizar la creación del respectivo usuario en el Active Directory. <br><br> Atte. <br><br> <b>SISTEMA ERP-WTS</b>";


            email.IsBodyHtml = true;

            string imgLogo = "";
            imgLogo = Server.MapPath("~/Content/img/logos/WTSLogo3.png");

            //Attachment logo = new Attachment(imgLogo);
            //logo.ContentDisposition.Inline = true;
            //email.Attachments.Add(logo);

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



        }

    }
}
