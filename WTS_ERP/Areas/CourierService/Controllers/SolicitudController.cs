using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using BL_ERP;
using BE_ERP.CourierService;
using WTS_ERP.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Newtonsoft.Json;

namespace WTS_ERP.Areas.CourierService.Controllers
{
    public class SolicitudController : Controller
    {

        iTextSharp.text.Font Font_Titulo = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 8f, 1, BaseColor.BLACK);
        iTextSharp.text.Font Font_Mediano = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 10f, 1, BaseColor.BLACK);
        iTextSharp.text.Font Font_Mediano_2 = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 7f, 0, BaseColor.BLACK);

        iTextSharp.text.Font Font_Titulo_Documento = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 11f, 1, iTextSharp.text.BaseColor.BLACK);
        iTextSharp.text.Font Font_SubTitulo_Documento = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 8f, 1, iTextSharp.text.BaseColor.BLACK);
        iTextSharp.text.Font Font_Base_Documento = FontFactory.GetFont(FontFactory.HELVETICA, 9f, 0, iTextSharp.text.BaseColor.BLACK);
        iTextSharp.text.Font Font_Base_Documento_GrillaHeader = FontFactory.GetFont(FontFactory.HELVETICA, 7f, 1, iTextSharp.text.BaseColor.BLACK);
        iTextSharp.text.Font Font_Base_Documento_GrillaDetail = FontFactory.GetFont(FontFactory.HELVETICA, 7f, 0, iTextSharp.text.BaseColor.BLACK);

        // GET: CourierService/Solicitud
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult List()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult New()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _ViewMap()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _AssignDriver()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _ViewDetail()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult Program()
        {
            return View();
        }


        public string Get_Informacion()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Informacion", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        /* Index */
        public string List_Informacion()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Solicitud_List_Informacion", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        /* Asignar Chofer */
        public string Get_Programacion()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Solicitud_Get_Programacion", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Save_Asignar_Chofer()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Save_Asignar_Chofer", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id >= 0);
            return dataResult;
        }

        /* Ver Detalle */
        public string Get_Detalle()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Solicitud_Get_Detalle", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Change_Vehiculo()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Change_Vehiculo", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Cancel_Solicitud()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Cancel", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Finish_Solicitud()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Finish", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Delete_Solicitud()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Delete", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Delete_Solicitud_Usuario()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            int id = -1;
            string dataresult = id < 0 ? oMantenimiento.get_Data("CourierService.usp_Solicitud_Delete_Usuario", par, false, Util.ERP) : string.Empty;
            return dataresult;
        }

        public string Add_Costo()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Add_Costo", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string ReProgram_Solicitud()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Reprogram", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Get_Dias()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Dias", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Servicio()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Servicio", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Hora()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Hora", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_TipoServicio()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_TipoServicio", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Vehiculo()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Vehiculo", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Destino()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Destino", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Direccion()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Direccion", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Insert_Courier()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Insert_Courier", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Insert_Reunion()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            string parfoot = _.Post("parfoot");
            string parsubfoot = _.Post("parsubfoot");

            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Insert_Reunion", parhead, Util.ERP, pardetail, parsubdetail, parfoot, parsubfoot);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string List_Solicitud()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Solicitud_List", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        /* Print */
        public string List_Data_Solicitud_Print()
        {
            string par = _.Get("par");
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("CourierService.usp_Solicitud_Print", par, false, Util.ERP);
            return data;
        }

        public ActionResult Print_Solicitud()
        {
            byte[] pdfbyte = new byte[0];
            string error = string.Empty;
            List<Solicitud> Solicitud = new List<Solicitud>();

            string data = List_Data_Solicitud_Print();
            if (data.Trim().Length > 0)
            {
                Solicitud = data != null && data.Length > 0 ? JsonConvert.DeserializeObject<List<Solicitud>>(data) : null;

                if (Solicitud.Count > 0)
                {
                    try
                    {
                        pdfbyte = Stickers(Solicitud);
                    }
                    catch (Exception ex)
                    {
                        pdfbyte = new byte[0];
                        error = ex.ToString();
                    }
                }
            }
            //string FileName = "hola";
            return File(pdfbyte, "application/pdf", "Sticker.pdf");
        }

        private byte[] Stickers(List<Solicitud> lista)
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
                tablaSticker.SpacingBefore = 0.0f;
                tablaSticker.SpacingAfter = 0.0f;

                if ((i + 1) < l)
                {
                    //addCell(tablaSticker, lista[i], 2);
                    //addCell(tablaSticker, lista[i + 1], 15);
                    addCell(tablaSticker, lista[i], 2);
                    addCell(tablaSticker, lista[i + 1], 12);
                }
                else
                {
                    addCell(tablaSticker, lista[i], 0);
                    addCell_White(tablaSticker, lista[i + 1], 0);
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

        private void addCell(PdfPTable tableStickerPrincipal, Solicitud carton, int paddingLeft)
        {
            float[] arrayWidth = new float[] { 100f };
            PdfPTable tablaSticker = new PdfPTable(arrayWidth);
            tablaSticker.TotalWidth = 130.0f;
            tablaSticker.LockedWidth = true;
            tablaSticker.HorizontalAlignment = 0;
            tablaSticker.SpacingBefore = 0f;
            tablaSticker.SpacingAfter = 0f;

            PdfPCell cell = new PdfPCell();

            cell = new PdfPCell(new Paragraph("WTS", Font_Mediano));
            cell.Border = 0;
            //cell.VerticalAlignment = Element.ALIGN_CENTER;
            cell.HorizontalAlignment = Element.ALIGN_CENTER;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("De:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.usuario, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Para:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.contacto, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Destino:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.destino, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Fecha:", Font_Titulo));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.fecha, Font_Mediano_2));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            //Fila sticker
            PdfPCell cellContent = new PdfPCell(tablaSticker);
            cellContent.Border = 0;
            cellContent.HorizontalAlignment = 0;
            cellContent.PaddingLeft = paddingLeft;

            tableStickerPrincipal.AddCell(cellContent);
        }

        private void addCell_White(PdfPTable tableStickerPrincipal, Solicitud carton, int paddingLeft)
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

            cell = new PdfPCell(new Paragraph("De:", Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.usuario, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Para:", Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.contacto, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);


            cell = new PdfPCell(new Paragraph("Destino:", Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.destino, Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph("Fecha:", Font_Mediano_White));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            tablaSticker.AddCell(cell);

            cell = new PdfPCell(new Paragraph(carton.fecha, Font_Mediano_White));
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


    }
}