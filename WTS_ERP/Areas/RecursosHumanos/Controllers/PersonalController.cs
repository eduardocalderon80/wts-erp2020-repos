using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Web.Mvc;
using WTS_ERP.Models;
using Newtonsoft.Json.Linq;
using BL_ERP;
using BL_ERP.GestionProducto;
using System.IO;
using System.Text;
using BE_ERP;
using BE_ERP.GestionProducto;
using Utilitario;
using Newtonsoft.Json;
using BE_ERP.GestionProducto.Requerimiento;
using System.Threading;
using System.Net.Mail;
using System.Net.Mime;
using System.Text.RegularExpressions;
using iTextSharp.text;
using iTextSharp.text.pdf;
using BE_ERP.RecursosHumanos;
using BL_ERP.RecursosHumanos;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class PersonalController : Controller
    {
        // GET: RecursosHumanos/Personal
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New()
        {
            return View();
        }

        public ActionResult Edit()
        {
            string ruta = ConfigurationManager.AppSettings["urlFilePersonalView"].ToString();
            ViewBag.PathStyleWeb = ruta;
            return View();
        }
        
        //public string Personal_List()
        //{
        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    string data = oMantenimiento.get_Data("usp_Personal_List", "", false, Util.ERP);
        //    return data != null ? data : string.Empty;
        //}

        /* Nuevo */
        public string Personal_List()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Personal_List", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Personal_GetDataCombos()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Personal_GetDataCombos", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Personal_Get()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Personal_Get", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Personal_Insert(byte[] ImagenWebCopy)
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            string dni = _.Get_Par(par, "dni");

            string urlPersonal = ConfigurationManager.AppSettings["urlFilePersonal"].ToString();
            HttpPostedFileBase PersonalImagen = Request.Files["parimagen"];

            string ImagenWebNombre = "";

            if (PersonalImagen != null)
            {
                string cImagenWeb = "";

                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cRutaImagenWeb = Server.MapPath("~" + urlPersonal);

                MemoryStream target = new MemoryStream();
                PersonalImagen.InputStream.CopyTo(target);

                byte[] Imagen = target.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(PersonalImagen.FileName);
                Random oAleatorio = new Random();

                string cFolderThumbnail = cRutaImagenWeb;
                //cImagenWeb = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                cImagenWeb = dni + cExtension;
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWeb), ImagenWeb);

                ImagenWebNombre = cImagenWeb;
            }

            par = _.addParameter(par, "imagenwebnombre", ImagenWebNombre);

            int id = oMantenimiento.save_Rows_Out("GestionTalento.usp_Personal_Insert", par, Util.ERP);

            //agregado por Luis Albarracin 09042019 crear ticket al crear el personal para infraestructura
            bool bresp = HelpDesk_Insert("{\"IdPersonal\":" + id + "}", _.Post("par"), 1);
            //fin Luis Albarracin 09042019

            string dataResult = _.Mensaje("new", id > 0);

            return dataResult;
        }       

        public string Personal_Update(byte[] ImagenWebCopy)
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            string dni = _.Get_Par(par, "dni");

            string urlPersonal = ConfigurationManager.AppSettings["urlFilePersonal"].ToString();
            HttpPostedFileBase PersonalImagen = Request.Files["parimagen"];

            string ImagenWebNombre = "";

            if (PersonalImagen != null)
            {
                string cImagenWeb = "";

                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                string cRutaImagenWeb = Server.MapPath("~" + urlPersonal);

                MemoryStream target = new MemoryStream();
                PersonalImagen.InputStream.CopyTo(target);

                byte[] Imagen = target.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(PersonalImagen.FileName);
                Random oAleatorio = new Random();

                string cFolderThumbnail = cRutaImagenWeb;
                //cImagenWeb = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                cImagenWeb = dni + cExtension;
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWeb), ImagenWeb);

                ImagenWebNombre = cImagenWeb;
            }
            else if (ImagenWebCopy != null)
            {
                string cImagenWeb = "";
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();


                string cRutaImagenWeb = Server.MapPath("~" + urlPersonal);

                byte[] Imagen = ImagenWebCopy.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);

                string ImagenNombreArchivo = _.Post("ImagenNombre");

                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(ImagenNombreArchivo);
                Random oAleatorio = new Random();

                string cFolderThumbnail = cRutaImagenWeb;
                //cImagenWeb = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                cImagenWeb = dni + cExtension;
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWeb), ImagenWeb);

                ImagenWebNombre = cImagenWeb;
            }

            par = _.addParameter(par, "imagenwebnombre", ImagenWebNombre);

            int id = oMantenimiento.save_Rows_Out("GestionTalento.usp_Personal_Update", par, Util.ERP);
            string dataResult = _.Mensaje("edit", id > 0);
            return dataResult;
        }

        public string Personal_Delete()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().Usuario.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("GestionTalento.usp_Personal_Delete", parhead, Util.ERP);

            //agregado por Luis Albarracin 09042019 crear ticket al crear el personal para infraestructura
            bool bresp = HelpDesk_Insert(_.Post("par"), "", 2);
            //fin Luis Albarracin 09042019

            string dataResult = _.Mensaje("edit", id > 0);
            return dataResult;
        }

        public void Personal_EnvioCorreo(string resultado)
        {
            string Personal = _.Get_Par(resultado, "NombrePersonal");
            string Usuario = _.Get_Par(resultado, "Usuario");
            string Area = _.Get_Par(resultado, "NombreArea");
            string Cargo = _.Get_Par(resultado, "NombreCargo");

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

        public JsonResult Personal_ReportExcel(int IdArea, int IdCargo, int Estado)
        {
            var jsonsession = new JsonResponse();
            var respuesta = new JsonResponse();
            blPersonal blPersonal = new blPersonal();
            List<Personal> listPersonal = blPersonal.Personal_ReportPDF(Util.ERP, IdArea, IdCargo, Estado);
            string strListaCabeceraTabla = string.Empty, strDatosFilasTabla = string.Empty, strTituloDocumento = string.Empty, strEstado = string.Empty;
            int totalfilas = 0, contador = 0;
            totalfilas = listPersonal.Count;

            string TituloHoja = "Listado de Personal";

            if (Estado == 0) { strEstado = "ACTIVO"; }
            else { strEstado = "INACTIVO"; }

            string strFecha = DateTime.Now.ToString("dd/MM/yyyy");

            strTituloDocumento = "LISTADO DE COLABORADORES " + strEstado + " AL " + strFecha;
            strListaCabeceraTabla = "N°¬APELLIDO PATERNO¬APELLIDO MATERNO¬PRIMER NOMBRE¬SEGUNDO NOMBRE¬NOMBRE PREFERIDO¬DNI¬ÁREA¬SUB ÁREA¬EQUIPO¬PUESTO DE TRABAJO¬REGISTRA MARCACIÓN¬CORREO PERSONAL¬CORREO LABORAL¬FECHA DE INCORPORACIÓN¬FECHA DE CESE¬FECHA NACIMIENTO¬GENERO";

            if (listPersonal.Count > 0)
            {
                foreach (var item in listPersonal)
                {
                    contador++;
                    strDatosFilasTabla += (contador).ToString()
                                              + "¬" + item.PrimerApellido
                                              + "¬" + item.SegundoApellido
                                              + "¬" + item.PrimerNombre
                                              + "¬" + item.SegundoNombre
                                              + "¬" + item.NombrePreferido /*NOMBRE PREFERIDO*/
                                              + "¬" + item.Dni
                                              + "¬" + item.Area
                                              + "¬" + item.SubArea
                                              + "¬" + item.EquipoTrabajo
                                              + "¬" + item.Cargo
                                              + "¬" + item.RegistraMarcacion /*REGISTRA MARCACIÓN*/
                                              + "¬" + item.CorreoPersonal /*CORREO PERSONAL*/
                                              + "¬" + item.CorreoElectronico /*CORREO LABORAL*/
                                              + "¬" + item.FechaInicio
                                              + "¬" + item.FechaCese
                                              + "¬" + item.FechaNacimiento
                                              + "¬" + item.Sexo + "^";
                }
            }

            byte[] filecontent = blPersonal.crearExcel_Personal(TituloHoja, strListaCabeceraTabla, strDatosFilasTabla, strTituloDocumento);

            jsonsession.Data = filecontent;

            System.Web.HttpContext.Current.Session["excelfacturav"] = jsonsession;

            respuesta.Success = true;
            respuesta.Message = "Exito";
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

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
        
        public FileResult Personal_ReportPDF(int IdArea, int IdCargo, int Estado)
        {
            byte[] bytes = new byte[0];
            string FileName = "Error.pdf";
            try
            {
                FileName = "Reporte del Personal WTS " + DateTime.Now.ToString("yyyyMMddhmm");

                blPersonal blPersonal = new blPersonal();
                List<Personal> listPersonal = blPersonal.Personal_ReportPDF(Util.ERP, IdArea, IdCargo, Estado);

                string strEstado = string.Empty;

                if (Estado == 0)
                {
                    strEstado = "ACTIVOS";
                }
                else
                {
                    strEstado = "INACTIVOS";
                }

                if (listPersonal != null)
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        Document document = new Document(iTextSharp.text.PageSize.A4.Rotate(), 30, 30, 20, 45);

                        PdfWriter writer = PdfWriter.GetInstance(document, ms);

                        TwoColumnHeaderFooter PageEventHandler = new TwoColumnHeaderFooter();
                        writer.PageEvent = PageEventHandler;
                        //Define the page header
                        PageEventHandler.Title = ""; //set empty title only to not add title and add footer
                        PageEventHandler.HeaderFont = FontFactory.GetFont(BaseFont.COURIER_BOLD, 10, Font.BOLD);
                        PageEventHandler.HeaderLeft = "Group";
                        PageEventHandler.HeaderRight = "1";

                        document.Open();
                        var Smaller = FontFactory.GetFont(FontFactory.HELVETICA, 6);
                        var SmallerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 6);
                        var SmallFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 7);
                        var SmallFont = FontFactory.GetFont(FontFactory.HELVETICA, 7);
                        var RegularFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);

                        var MediumFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14);
                        var MediumFont = FontFactory.GetFont(FontFactory.HELVETICA, 9);
                        var LargeFontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16);
                        var LargeFont = FontFactory.GetFont(FontFactory.HELVETICA, 32);

                        PdfPTable table = new PdfPTable(1);
                        table.WidthPercentage = 100;

                        PdfPTable Row1 = new PdfPTable(2);
                        Row1.WidthPercentage = 100;
                        //Row1.DefaultCell.Border = Rectangle.NO_BORDER;


                        iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/img/logos/WTSLogo2.png"));
                        jpg.ScaleToFit(120f, 90f);

                        PdfPCell cellLogo = new PdfPCell(jpg);
                        cellLogo.Border = Rectangle.NO_BORDER;
                        cellLogo.PaddingBottom = 15;

                        PdfPCell cellUsuario = new PdfPCell(new Phrase(string.Format("Fecha: {0} \n" + "Usuario: {1}", DateTime.Today.ToShortDateString(), _.GetUsuario().Usuario), SmallFontBold));
                        cellUsuario.HorizontalAlignment = Element.ALIGN_RIGHT;
                        cellUsuario.VerticalAlignment = Element.ALIGN_BOTTOM;
                        cellUsuario.Border = Rectangle.NO_BORDER;
                        cellUsuario.PaddingBottom = 15;

                        Row1.AddCell(cellLogo);
                        Row1.AddCell(cellUsuario);

                        table.DefaultCell.Border = Rectangle.NO_BORDER;
                        table.AddCell(Row1);

                        PdfPTable Row1_1 = new PdfPTable(1);
                        Row1_1.WidthPercentage = 150;

                        PdfPCell cellBlank = new PdfPCell(new Phrase(" "));
                        cellBlank.Border = Rectangle.TOP_BORDER;

                        Row1_1.AddCell(cellBlank);

                        table.AddCell(Row1_1);

                        PdfPTable Row2 = new PdfPTable(1);
                        Row2.WidthPercentage = 100;
                        PdfPCell cellTitle = new PdfPCell(new Phrase(string.Format("LISTADO DEL PERSONAL " + strEstado), MediumFontBold));
                        //cellTitle.PaddingRight = 100;
                        cellTitle.PaddingLeft = 100;
                        cellTitle.PaddingRight = 100;
                        /*cellTitle.PaddingTop = 20;*/
                        cellTitle.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellTitle.Border = Rectangle.NO_BORDER;

                        Row2.AddCell(cellTitle);

                        table.AddCell(Row2);


                        PdfPTable Row3 = new PdfPTable(1);
                        Row3.WidthPercentage = 100;

                        // Aqui se agrega la cantidad de columnas
                        PdfPTable DetailTable = new PdfPTable(18);

                        PdfPCell cellId = new PdfPCell(new Phrase("N ° ", SmallerFont));
                        cellId.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellId.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellId.PaddingTop = 10;
                        cellId.PaddingBottom = 10;

                        PdfPCell cellApellidoPaterno = new PdfPCell(new Phrase("APELLIDO PATERNO", SmallerFont));
                        cellApellidoPaterno.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellApellidoPaterno.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellApellidoPaterno.PaddingTop = 10;
                        cellApellidoPaterno.PaddingBottom = 10;

                        PdfPCell cellApellidoMaterno = new PdfPCell(new Phrase("APELLIDO MATERNO", SmallerFont));
                        cellApellidoMaterno.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellApellidoMaterno.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellApellidoMaterno.PaddingTop = 10;
                        cellApellidoMaterno.PaddingBottom = 10;

                        PdfPCell cellPrimerNombre = new PdfPCell(new Phrase("PRIMER NOMBRE", SmallerFont));
                        cellPrimerNombre.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellPrimerNombre.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellPrimerNombre.PaddingTop = 10;
                        cellPrimerNombre.PaddingBottom = 10;

                        PdfPCell cellSegundoNombre = new PdfPCell(new Phrase("SEGUNDO NOMBRE", SmallerFont));
                        cellSegundoNombre.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellSegundoNombre.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellSegundoNombre.PaddingTop = 10;
                        cellSegundoNombre.PaddingBottom = 10;

                        PdfPCell cellNombrePreferido = new PdfPCell(new Phrase("NOMBRE PREFERIDO", SmallerFont));
                        cellNombrePreferido.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellNombrePreferido.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellNombrePreferido.PaddingTop = 10;
                        cellNombrePreferido.PaddingBottom = 10;

                        PdfPCell cellDni = new PdfPCell(new Phrase("DNI", SmallerFont));
                        cellDni.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellDni.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellDni.PaddingTop = 10;
                        cellDni.PaddingBottom = 10;

                        PdfPCell cellNombreArea = new PdfPCell(new Phrase("ÁREA", SmallerFont));
                        cellNombreArea.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellNombreArea.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellNombreArea.PaddingTop = 10;
                        cellNombreArea.PaddingBottom = 10;

                        PdfPCell cellNombreSubArea = new PdfPCell(new Phrase("SUB ÁREA", SmallerFont));
                        cellNombreSubArea.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellNombreSubArea.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellNombreSubArea.PaddingTop = 10;
                        cellNombreSubArea.PaddingBottom = 10;

                        PdfPCell cellEquipo = new PdfPCell(new Phrase("EQUIPO", SmallerFont));
                        cellEquipo.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellEquipo.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellEquipo.PaddingTop = 10;
                        cellEquipo.PaddingBottom = 10;

                        PdfPCell cellNombreCargo = new PdfPCell(new Phrase("PUESTO DE TRABAJO", SmallerFont));
                        cellNombreCargo.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellNombreCargo.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellNombreCargo.PaddingTop = 10;
                        cellNombreCargo.PaddingBottom = 10;

                        PdfPCell cellRegistraMarcacion = new PdfPCell(new Phrase("REGISTRA MARCACIÓN", SmallerFont));
                        cellRegistraMarcacion.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellRegistraMarcacion.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellRegistraMarcacion.PaddingTop = 10;
                        cellRegistraMarcacion.PaddingBottom = 10;

                        PdfPCell cellCorreoPersonal = new PdfPCell(new Phrase("CORREO PERSONAL", SmallerFont));
                        cellCorreoPersonal.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellCorreoPersonal.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellCorreoPersonal.PaddingTop = 10;
                        cellCorreoPersonal.PaddingBottom = 10;

                        PdfPCell cellCorreoElectronico = new PdfPCell(new Phrase("CORREO LABORAL", SmallerFont));
                        cellCorreoElectronico.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellCorreoElectronico.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellCorreoElectronico.PaddingTop = 10;
                        cellCorreoElectronico.PaddingBottom = 10;

                        PdfPCell cellFechaInicio = new PdfPCell(new Phrase("FECHA DE INCORPORACIÓN", SmallerFont));
                        cellFechaInicio.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellFechaInicio.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellFechaInicio.PaddingTop = 10;
                        cellFechaInicio.PaddingBottom = 10;

                        PdfPCell cellFechaCese = new PdfPCell(new Phrase("FECHA DE CESE", SmallerFont));
                        cellFechaCese.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellFechaCese.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellFechaCese.PaddingTop = 10;
                        cellFechaCese.PaddingBottom = 10;

                        PdfPCell cellFechaNacimiento = new PdfPCell(new Phrase("FECHA NACIMIENTO", SmallerFont));
                        cellFechaNacimiento.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellFechaNacimiento.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellFechaNacimiento.PaddingTop = 10;
                        cellFechaNacimiento.PaddingBottom = 10;

                        PdfPCell cellGenero = new PdfPCell(new Phrase("GENERO", SmallerFont));
                        cellGenero.HorizontalAlignment = Element.ALIGN_CENTER;
                        cellGenero.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
                        cellGenero.PaddingTop = 10;
                        cellGenero.PaddingBottom = 10;

                        DetailTable.AddCell(cellId);
                        DetailTable.AddCell(cellApellidoPaterno);
                        DetailTable.AddCell(cellApellidoMaterno);
                        DetailTable.AddCell(cellPrimerNombre);
                        DetailTable.AddCell(cellSegundoNombre);
                        DetailTable.AddCell(cellNombrePreferido);
                        DetailTable.AddCell(cellDni);
                        DetailTable.AddCell(cellNombreArea);
                        DetailTable.AddCell(cellNombreSubArea);
                        DetailTable.AddCell(cellEquipo);
                        DetailTable.AddCell(cellNombreCargo);
                        DetailTable.AddCell(cellRegistraMarcacion);
                        DetailTable.AddCell(cellCorreoPersonal);
                        DetailTable.AddCell(cellCorreoElectronico);
                        DetailTable.AddCell(cellFechaInicio);
                        DetailTable.AddCell(cellFechaCese);
                        DetailTable.AddCell(cellFechaNacimiento);
                        DetailTable.AddCell(cellGenero);

                        int q = listPersonal.Count;
                        int x = 0;

                        // 1ra parte

                        //cellId = new PdfPCell(new Phrase(Convert.ToString(x + 1), Smaller));
                        //cellId.HorizontalAlignment = Element.ALIGN_CENTER;
                        //cellId.Border = Rectangle.NO_BORDER;

                        //cellNombrePersonal = new PdfPCell(new Phrase(listPersonal[0].NombrePersonal, Smaller));
                        //cellNombrePersonal.HorizontalAlignment = Element.ALIGN_LEFT;
                        //cellNombrePersonal.Border = Rectangle.NO_BORDER;

                        //cellDni = new PdfPCell(new Phrase(listPersonal[0].Dni, Smaller));
                        //cellDni.HorizontalAlignment = Element.ALIGN_CENTER;
                        //cellDni.Border = Rectangle.NO_BORDER;

                        //cellNombreArea = new PdfPCell(new Phrase(listPersonal[0].NombreArea, Smaller));
                        //cellNombreArea.HorizontalAlignment = Element.ALIGN_LEFT;
                        //cellNombreArea.Border = Rectangle.NO_BORDER;

                        //cellNombreCargo = new PdfPCell(new Phrase(listPersonal[0].NombreCargo, Smaller));
                        //cellNombreCargo.HorizontalAlignment = Element.ALIGN_LEFT;
                        //cellNombreCargo.Border = Rectangle.NO_BORDER;


                        //cellId.PaddingTop = 10;
                        //cellNombrePersonal.PaddingTop = 10;
                        //cellDni.PaddingTop = 10;
                        //cellNombreArea.PaddingTop = 10;
                        //cellNombreCargo.PaddingTop = 10;

                        //DetailTable.AddCell(cellId);
                        //DetailTable.AddCell(cellNombrePersonal);
                        //DetailTable.AddCell(cellDni);
                        //DetailTable.AddCell(cellNombreArea);
                        //DetailTable.AddCell(cellNombreCargo);

                        // 2da parte
                        for (x = 0; x < q; x++)
                        {
                            cellId = new PdfPCell(new Phrase(Convert.ToString(x + 1), Smaller));
                            cellId.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellId.Border = Rectangle.NO_BORDER;

                            cellApellidoPaterno = new PdfPCell(new Phrase(listPersonal[x].PrimerApellido, Smaller));
                            cellApellidoPaterno.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellApellidoPaterno.Border = Rectangle.NO_BORDER;

                            cellApellidoMaterno = new PdfPCell(new Phrase(listPersonal[x].SegundoApellido, Smaller));
                            cellApellidoMaterno.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellApellidoMaterno.Border = Rectangle.NO_BORDER;

                            cellPrimerNombre = new PdfPCell(new Phrase(listPersonal[x].PrimerNombre, Smaller));
                            cellPrimerNombre.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellPrimerNombre.Border = Rectangle.NO_BORDER;

                            cellSegundoNombre = new PdfPCell(new Phrase(listPersonal[x].SegundoNombre, Smaller));
                            cellSegundoNombre.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellSegundoNombre.Border = Rectangle.NO_BORDER;

                            cellNombrePreferido = new PdfPCell(new Phrase(listPersonal[x].NombrePreferido, Smaller));
                            cellNombrePreferido.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellNombrePreferido.Border = Rectangle.NO_BORDER;

                            cellDni = new PdfPCell(new Phrase(listPersonal[x].Dni, Smaller));
                            cellDni.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellDni.Border = Rectangle.NO_BORDER;

                            cellNombreArea = new PdfPCell(new Phrase(listPersonal[x].Area, Smaller));
                            cellNombreArea.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellNombreArea.Border = Rectangle.NO_BORDER;

                            cellNombreSubArea = new PdfPCell(new Phrase(listPersonal[x].SubArea, Smaller));
                            cellNombreSubArea.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellNombreSubArea.Border = Rectangle.NO_BORDER;

                            cellEquipo = new PdfPCell(new Phrase(listPersonal[x].EquipoTrabajo, Smaller));
                            cellEquipo.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellEquipo.Border = Rectangle.NO_BORDER;

                            cellNombreCargo = new PdfPCell(new Phrase(listPersonal[x].Cargo, Smaller));
                            cellNombreCargo.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellNombreCargo.Border = Rectangle.NO_BORDER;

                            cellRegistraMarcacion = new PdfPCell(new Phrase(listPersonal[x].RegistraMarcacion, Smaller));
                            cellRegistraMarcacion.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellRegistraMarcacion.Border = Rectangle.NO_BORDER;

                            cellCorreoPersonal = new PdfPCell(new Phrase(listPersonal[x].CorreoPersonal, Smaller));
                            cellCorreoPersonal.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellCorreoPersonal.Border = Rectangle.NO_BORDER;

                            cellCorreoElectronico = new PdfPCell(new Phrase(listPersonal[x].CorreoElectronico, Smaller));
                            cellCorreoElectronico.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellCorreoElectronico.Border = Rectangle.NO_BORDER;

                            cellFechaInicio = new PdfPCell(new Phrase(listPersonal[x].FechaInicio, Smaller));
                            cellFechaInicio.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellFechaInicio.Border = Rectangle.NO_BORDER;

                            cellFechaCese = new PdfPCell(new Phrase(listPersonal[x].FechaCese, Smaller));
                            cellFechaCese.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellFechaCese.Border = Rectangle.NO_BORDER;

                            cellFechaNacimiento = new PdfPCell(new Phrase(listPersonal[x].FechaNacimiento, Smaller));
                            cellFechaNacimiento.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellFechaNacimiento.Border = Rectangle.NO_BORDER;

                            cellGenero = new PdfPCell(new Phrase(listPersonal[x].Sexo, Smaller));
                            cellGenero.HorizontalAlignment = Element.ALIGN_CENTER;
                            cellGenero.Border = Rectangle.NO_BORDER;

                            if (x == 0)
                            {
                                cellId.PaddingTop = 10;
                                cellApellidoPaterno.PaddingTop = 10;
                                cellApellidoMaterno.PaddingTop = 10;
                                cellPrimerNombre.PaddingTop = 10;
                                cellSegundoNombre.PaddingTop = 10;
                                cellNombrePreferido.PaddingTop = 10;
                                cellDni.PaddingTop = 10;
                                cellNombreArea.PaddingTop = 10;
                                cellNombreSubArea.PaddingTop = 10;
                                cellEquipo.PaddingTop = 10;
                                cellNombreCargo.PaddingTop = 10;
                                cellRegistraMarcacion.PaddingTop = 10;
                                cellCorreoPersonal.PaddingTop = 10;
                                cellCorreoElectronico.PaddingTop = 10;
                                cellFechaInicio.PaddingTop = 10;
                                cellFechaCese.PaddingTop = 10;
                                cellFechaNacimiento.PaddingTop = 10;
                                cellGenero.PaddingTop = 10;
                            }

                            DetailTable.AddCell(cellId);
                            DetailTable.AddCell(cellApellidoPaterno);
                            DetailTable.AddCell(cellApellidoMaterno);
                            DetailTable.AddCell(cellPrimerNombre);
                            DetailTable.AddCell(cellSegundoNombre);
                            DetailTable.AddCell(cellNombrePreferido);
                            DetailTable.AddCell(cellDni);
                            DetailTable.AddCell(cellNombreArea);
                            DetailTable.AddCell(cellNombreSubArea);
                            DetailTable.AddCell(cellEquipo);
                            DetailTable.AddCell(cellNombreCargo);
                            DetailTable.AddCell(cellRegistraMarcacion);
                            DetailTable.AddCell(cellCorreoPersonal);
                            DetailTable.AddCell(cellCorreoElectronico);
                            DetailTable.AddCell(cellFechaInicio);
                            DetailTable.AddCell(cellFechaCese);
                            DetailTable.AddCell(cellFechaNacimiento);
                            DetailTable.AddCell(cellGenero);
                        }


                        PdfPCell cellContent = new PdfPCell(DetailTable);
                        cellContent.Border = Rectangle.NO_BORDER;
                        cellContent.PaddingTop = 20;

                        Row3.AddCell(cellContent);

                        table.AddCell(Row3);

                        table.SplitLate = false;

                        document.Add(table);

                        document.Close();
                        writer.Close();

                        bytes = ms.GetBuffer();


                    }
                }
            }
            catch (Exception ex)
            {
                string hola = ex.Message;
            }
            return File(bytes, "application/pdf", FileName + ".pdf");
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
        //                Document document = new Document(iTextSharp.text.PageSize.A4.Rotate(), 30, 30, 20, 45);

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

        //                // Aqui se agrega la cantidad de columnas
        //                PdfPTable DetailTable = new PdfPTable(17);

        //                PdfPCell cellId = new PdfPCell(new Phrase("N ° ", SmallerFont));
        //                cellId.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellId.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellId.PaddingTop = 10;
        //                cellId.PaddingBottom = 10;

        //                PdfPCell cellApellidoPaterno = new PdfPCell(new Phrase("APELLIDO PATERNO", SmallerFont));
        //                cellApellidoPaterno.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellApellidoPaterno.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellApellidoPaterno.PaddingTop = 10;
        //                cellApellidoPaterno.PaddingBottom = 10;

        //                PdfPCell cellApellidoMaterno = new PdfPCell(new Phrase("APELLIDO MATERNO", SmallerFont));
        //                cellApellidoMaterno.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellApellidoMaterno.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellApellidoMaterno.PaddingTop = 10;
        //                cellApellidoMaterno.PaddingBottom = 10;

        //                PdfPCell cellPrimerNombre = new PdfPCell(new Phrase("PRIMER NOMBRE", SmallerFont));
        //                cellPrimerNombre.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellPrimerNombre.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellPrimerNombre.PaddingTop = 10;
        //                cellPrimerNombre.PaddingBottom = 10;

        //                PdfPCell cellSegundoNombre = new PdfPCell(new Phrase("SEGUNDO NOMBRE", SmallerFont));
        //                cellSegundoNombre.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellSegundoNombre.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellSegundoNombre.PaddingTop = 10;
        //                cellSegundoNombre.PaddingBottom = 10;

        //                PdfPCell cellNombrePreferido = new PdfPCell(new Phrase("NOMBRE PREFERIDO", SmallerFont));
        //                cellNombrePreferido.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellNombrePreferido.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellNombrePreferido.PaddingTop = 10;
        //                cellNombrePreferido.PaddingBottom = 10;

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

        //                PdfPCell cellNombreSubArea = new PdfPCell(new Phrase("SUB ÁREA", SmallerFont));
        //                cellNombreSubArea.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellNombreSubArea.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellNombreSubArea.PaddingTop = 10;
        //                cellNombreSubArea.PaddingBottom = 10;

        //                PdfPCell cellNombreCargo = new PdfPCell(new Phrase("PUESTO DE TRABAJO", SmallerFont));
        //                cellNombreCargo.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellNombreCargo.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellNombreCargo.PaddingTop = 10;
        //                cellNombreCargo.PaddingBottom = 10;

        //                PdfPCell cellRegistraMarcacion = new PdfPCell(new Phrase("REGISTRA MARCACIÓN", SmallerFont));
        //                cellRegistraMarcacion.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellRegistraMarcacion.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellRegistraMarcacion.PaddingTop = 10;
        //                cellRegistraMarcacion.PaddingBottom = 10;

        //                PdfPCell cellCorreoPersonal = new PdfPCell(new Phrase("CORREO PERSONAL", SmallerFont));
        //                cellCorreoPersonal.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellCorreoPersonal.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellCorreoPersonal.PaddingTop = 10;
        //                cellCorreoPersonal.PaddingBottom = 10;

        //                PdfPCell cellCorreoElectronico = new PdfPCell(new Phrase("CORREO LABORAL", SmallerFont));
        //                cellCorreoElectronico.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellCorreoElectronico.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellCorreoElectronico.PaddingTop = 10;
        //                cellCorreoElectronico.PaddingBottom = 10;

        //                PdfPCell cellFechaInicio = new PdfPCell(new Phrase("FECHA DE INCORPORACIÓN", SmallerFont));
        //                cellFechaInicio.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellFechaInicio.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellFechaInicio.PaddingTop = 10;
        //                cellFechaInicio.PaddingBottom = 10;

        //                PdfPCell cellFechaCese = new PdfPCell(new Phrase("FECHA DE CESE", SmallerFont));
        //                cellFechaCese.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellFechaCese.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellFechaCese.PaddingTop = 10;
        //                cellFechaCese.PaddingBottom = 10;

        //                PdfPCell cellFechaNacimiento = new PdfPCell(new Phrase("FECHA NACIMIENTO", SmallerFont));
        //                cellFechaNacimiento.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellFechaNacimiento.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellFechaNacimiento.PaddingTop = 10;
        //                cellFechaNacimiento.PaddingBottom = 10;

        //                PdfPCell cellGenero = new PdfPCell(new Phrase("GENERO", SmallerFont));
        //                cellGenero.HorizontalAlignment = Element.ALIGN_CENTER;
        //                cellGenero.Border = Rectangle.TOP_BORDER | Rectangle.BOTTOM_BORDER;
        //                cellGenero.PaddingTop = 10;
        //                cellGenero.PaddingBottom = 10;

        //                DetailTable.AddCell(cellId);
        //                DetailTable.AddCell(cellApellidoPaterno);
        //                DetailTable.AddCell(cellApellidoMaterno);
        //                DetailTable.AddCell(cellPrimerNombre);
        //                DetailTable.AddCell(cellSegundoNombre);
        //                DetailTable.AddCell(cellNombrePreferido);
        //                DetailTable.AddCell(cellDni);
        //                DetailTable.AddCell(cellNombreArea);
        //                DetailTable.AddCell(cellNombreSubArea);
        //                DetailTable.AddCell(cellNombreCargo);
        //                DetailTable.AddCell(cellRegistraMarcacion);
        //                DetailTable.AddCell(cellCorreoPersonal);
        //                DetailTable.AddCell(cellCorreoElectronico);
        //                DetailTable.AddCell(cellFechaInicio);
        //                DetailTable.AddCell(cellFechaCese);
        //                DetailTable.AddCell(cellFechaNacimiento);
        //                DetailTable.AddCell(cellGenero);

        //                int q = listPersonal.Count;
        //                int x = 0;

        //                // 1ra parte

        //                //cellId = new PdfPCell(new Phrase(Convert.ToString(x + 1), Smaller));
        //                //cellId.HorizontalAlignment = Element.ALIGN_CENTER;
        //                //cellId.Border = Rectangle.NO_BORDER;

        //                //cellNombrePersonal = new PdfPCell(new Phrase(listPersonal[0].NombrePersonal, Smaller));
        //                //cellNombrePersonal.HorizontalAlignment = Element.ALIGN_LEFT;
        //                //cellNombrePersonal.Border = Rectangle.NO_BORDER;

        //                //cellDni = new PdfPCell(new Phrase(listPersonal[0].Dni, Smaller));
        //                //cellDni.HorizontalAlignment = Element.ALIGN_CENTER;
        //                //cellDni.Border = Rectangle.NO_BORDER;

        //                //cellNombreArea = new PdfPCell(new Phrase(listPersonal[0].NombreArea, Smaller));
        //                //cellNombreArea.HorizontalAlignment = Element.ALIGN_LEFT;
        //                //cellNombreArea.Border = Rectangle.NO_BORDER;

        //                //cellNombreCargo = new PdfPCell(new Phrase(listPersonal[0].NombreCargo, Smaller));
        //                //cellNombreCargo.HorizontalAlignment = Element.ALIGN_LEFT;
        //                //cellNombreCargo.Border = Rectangle.NO_BORDER;


        //                //cellId.PaddingTop = 10;
        //                //cellNombrePersonal.PaddingTop = 10;
        //                //cellDni.PaddingTop = 10;
        //                //cellNombreArea.PaddingTop = 10;
        //                //cellNombreCargo.PaddingTop = 10;

        //                //DetailTable.AddCell(cellId);
        //                //DetailTable.AddCell(cellNombrePersonal);
        //                //DetailTable.AddCell(cellDni);
        //                //DetailTable.AddCell(cellNombreArea);
        //                //DetailTable.AddCell(cellNombreCargo);

        //                // 2da parte
        //                for (x = 0; x < q; x++)
        //                {
        //                    cellId = new PdfPCell(new Phrase(Convert.ToString(x + 1), Smaller));
        //                    cellId.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellId.Border = Rectangle.NO_BORDER;

        //                    cellApellidoPaterno = new PdfPCell(new Phrase(listPersonal[x].PrimerApellido, Smaller));
        //                    cellApellidoPaterno.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellApellidoPaterno.Border = Rectangle.NO_BORDER;

        //                    cellApellidoMaterno = new PdfPCell(new Phrase(listPersonal[x].SegundoApellido, Smaller));
        //                    cellApellidoMaterno.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellApellidoMaterno.Border = Rectangle.NO_BORDER;

        //                    cellPrimerNombre = new PdfPCell(new Phrase(listPersonal[x].PrimerNombre, Smaller));
        //                    cellPrimerNombre.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellPrimerNombre.Border = Rectangle.NO_BORDER;

        //                    cellSegundoNombre = new PdfPCell(new Phrase(listPersonal[x].SegundoNombre, Smaller));
        //                    cellSegundoNombre.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellSegundoNombre.Border = Rectangle.NO_BORDER;

        //                    cellNombrePreferido = new PdfPCell(new Phrase(listPersonal[x].NombrePreferido, Smaller));
        //                    cellNombrePreferido.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellNombrePreferido.Border = Rectangle.NO_BORDER;

        //                    cellDni = new PdfPCell(new Phrase(listPersonal[x].Dni, Smaller));
        //                    cellDni.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellDni.Border = Rectangle.NO_BORDER;

        //                    if (listPersonal[x].IdPadre == 0)
        //                    {
        //                        cellNombreArea = new PdfPCell(new Phrase(listPersonal[x].NombreArea, Smaller));
        //                        cellNombreArea.HorizontalAlignment = Element.ALIGN_CENTER;
        //                        cellNombreArea.Border = Rectangle.NO_BORDER;

        //                        cellNombreSubArea = new PdfPCell(new Phrase("", Smaller));
        //                        cellNombreSubArea.HorizontalAlignment = Element.ALIGN_CENTER;
        //                        cellNombreSubArea.Border = Rectangle.NO_BORDER;
        //                    }
        //                    else
        //                    {
        //                        cellNombreArea = new PdfPCell(new Phrase(listPersonal[x].NombreAreaPadre, Smaller));
        //                        cellNombreArea.HorizontalAlignment = Element.ALIGN_CENTER;
        //                        cellNombreArea.Border = Rectangle.NO_BORDER;

        //                        cellNombreSubArea = new PdfPCell(new Phrase(listPersonal[x].NombreArea, Smaller));
        //                        cellNombreSubArea.HorizontalAlignment = Element.ALIGN_CENTER;
        //                        cellNombreSubArea.Border = Rectangle.NO_BORDER;
        //                    }

        //                    cellNombreCargo = new PdfPCell(new Phrase(listPersonal[x].NombreCargo, Smaller));
        //                    cellNombreCargo.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellNombreCargo.Border = Rectangle.NO_BORDER;

        //                    cellRegistraMarcacion = new PdfPCell(new Phrase(listPersonal[x].RegistraMarcacion, Smaller));
        //                    cellRegistraMarcacion.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellRegistraMarcacion.Border = Rectangle.NO_BORDER;

        //                    cellCorreoPersonal = new PdfPCell(new Phrase(listPersonal[x].CorreoPersonal, Smaller));
        //                    cellCorreoPersonal.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellCorreoPersonal.Border = Rectangle.NO_BORDER;

        //                    cellCorreoElectronico = new PdfPCell(new Phrase(listPersonal[x].CorreoElectronico, Smaller));
        //                    cellCorreoElectronico.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellCorreoElectronico.Border = Rectangle.NO_BORDER;

        //                    cellFechaInicio = new PdfPCell(new Phrase(listPersonal[x].FechaInicio, Smaller));
        //                    cellFechaInicio.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellFechaInicio.Border = Rectangle.NO_BORDER;

        //                    cellFechaCese = new PdfPCell(new Phrase(listPersonal[x].FechaCese, Smaller));
        //                    cellFechaCese.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellFechaCese.Border = Rectangle.NO_BORDER;

        //                    cellFechaNacimiento = new PdfPCell(new Phrase(listPersonal[x].FechaNacimiento, Smaller));
        //                    cellFechaNacimiento.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellFechaNacimiento.Border = Rectangle.NO_BORDER;

        //                    cellGenero = new PdfPCell(new Phrase(listPersonal[x].Sexo, Smaller));
        //                    cellGenero.HorizontalAlignment = Element.ALIGN_CENTER;
        //                    cellGenero.Border = Rectangle.NO_BORDER;

        //                    if (x == 0)
        //                    {
        //                        cellId.PaddingTop = 10;
        //                        cellApellidoPaterno.PaddingTop = 10;
        //                        cellApellidoMaterno.PaddingTop = 10;
        //                        cellPrimerNombre.PaddingTop = 10;
        //                        cellSegundoNombre.PaddingTop = 10;
        //                        cellNombrePreferido.PaddingTop = 10;
        //                        cellDni.PaddingTop = 10;
        //                        cellNombreArea.PaddingTop = 10;
        //                        cellNombreSubArea.PaddingTop = 10;
        //                        cellNombreCargo.PaddingTop = 10;
        //                        cellRegistraMarcacion.PaddingTop = 10;
        //                        cellCorreoPersonal.PaddingTop = 10;
        //                        cellCorreoElectronico.PaddingTop = 10;
        //                        cellFechaInicio.PaddingTop = 10;
        //                        cellFechaCese.PaddingTop = 10;
        //                        cellFechaNacimiento.PaddingTop = 10;
        //                        cellGenero.PaddingTop = 10;
        //                    }

        //                    DetailTable.AddCell(cellId);
        //                    DetailTable.AddCell(cellApellidoPaterno);
        //                    DetailTable.AddCell(cellApellidoMaterno);
        //                    DetailTable.AddCell(cellPrimerNombre);
        //                    DetailTable.AddCell(cellSegundoNombre);
        //                    DetailTable.AddCell(cellNombrePreferido);
        //                    DetailTable.AddCell(cellDni);
        //                    DetailTable.AddCell(cellNombreArea);
        //                    DetailTable.AddCell(cellNombreSubArea);
        //                    DetailTable.AddCell(cellNombreCargo);
        //                    DetailTable.AddCell(cellRegistraMarcacion);
        //                    DetailTable.AddCell(cellCorreoPersonal);
        //                    DetailTable.AddCell(cellCorreoElectronico);
        //                    DetailTable.AddCell(cellFechaInicio);
        //                    DetailTable.AddCell(cellFechaCese);
        //                    DetailTable.AddCell(cellFechaNacimiento);
        //                    DetailTable.AddCell(cellGenero);
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
        //        strEstado = "ACTIVO";
        //    }
        //    else
        //    {
        //        strEstado = "INACTIVO";
        //    }

        //    string strFecha = DateTime.Now.ToString("dd/MM/yyyy");

        //    strTituloDocumento = "LISTADO DE COLABORADORES " + strEstado + " AL " + strFecha;

        //    strListaCabeceraTabla = "N°¬APELLIDO PATERNO¬APELLIDO MATERNO¬PRIMER NOMBRE¬SEGUNDO NOMBRE¬NOMBRE PREFERIDO¬DNI¬ÁREA¬SUB ÁREA¬EQUIPO¬PUESTO DE TRABAJO¬REGISTRA MARCACIÓN¬CORREO PERSONAL¬CORREO LABORAL¬FECHA DE INCORPORACIÓN¬FECHA DE CESE¬FECHA NACIMIENTO¬GENERO";

        //    if (listPersonal.Count > 0)
        //    {
        //        foreach (var item in listPersonal)
        //        {
        //            contador++;
        //            strDatosFilasTabla += (contador).ToString()
        //                                      + "¬" + item.PrimerApellido
        //                                      + "¬" + item.SegundoApellido
        //                                      + "¬" + item.PrimerNombre
        //                                      + "¬" + item.SegundoNombre
        //                                      + "¬" + item.NombrePreferido /*NOMBRE PREFERIDO*/
        //                                      + "¬" + item.Dni
        //                                      + "¬" + item.Area
        //                                      + "¬" + item.SubArea
        //                                      + "¬" + item.EquipoTrabajo
        //                                      + "¬" + item.Cargo
        //                                      + "¬" + item.RegistraMarcacion /*REGISTRA MARCACIÓN*/
        //                                      + "¬" + item.CorreoPersonal /*CORREO PERSONAL*/
        //                                      + "¬" + item.CorreoElectronico /*CORREO LABORAL*/
        //                                      + "¬" + item.FechaInicio
        //                                      + "¬" + item.FechaCese
        //                                      + "¬" + item.FechaNacimiento
        //                                      + "¬" + item.Sexo + "^";


        //            //if (contador < totalfilas)
        //            //{
        //            //    if (item.IdPadre == 0)
        //            //    {
        //            //        strDatosFilasTabla += (contador).ToString()
        //            //                           + "¬" + item.PrimerApellido
        //            //                           + "¬" + item.SegundoApellido
        //            //                           + "¬" + item.PrimerNombre
        //            //                           + "¬" + item.SegundoNombre
        //            //                           + "¬" + item.NombrePreferido /*NOMBRE PREFERIDO*/
        //            //                           + "¬" + item.Dni
        //            //                           + "¬" + item.NombreArea
        //            //                           + "¬" + "" /*SUB ÁREA*/
        //            //                           + "¬" + item.NombreCargo
        //            //                           + "¬" + item.RegistraMarcacion /*REGISTRA MARCACIÓN*/
        //            //                           + "¬" + item.CorreoPersonal /*CORREO PERSONAL*/
        //            //                           + "¬" + item.CorreoElectronico /*CORREO LABORAL*/
        //            //                           + "¬" + item.FechaInicio
        //            //                           + "¬" + item.FechaCese
        //            //                           + "¬" + item.FechaNacimiento
        //            //                           + "¬" + item.Sexo + "^";
        //            //    }
        //            //    else
        //            //    {
        //            //        strDatosFilasTabla += (contador).ToString()
        //            //                           + "¬" + item.PrimerApellido
        //            //                           + "¬" + item.SegundoApellido
        //            //                           + "¬" + item.PrimerNombre
        //            //                           + "¬" + item.SegundoNombre
        //            //                           + "¬" + item.NombrePreferido /*NOMBRE PREFERIDO*/
        //            //                           + "¬" + item.Dni
        //            //                           + "¬" + item.NombreAreaPadre
        //            //                           + "¬" + item.NombreArea
        //            //                           + "¬" + item.NombreCargo
        //            //                           + "¬" + item.RegistraMarcacion /*REGISTRA MARCACIÓN*/
        //            //                           + "¬" + item.CorreoPersonal /*CORREO PERSONAL*/
        //            //                           + "¬" + item.CorreoElectronico /*CORREO LABORAL*/
        //            //                           + "¬" + item.FechaInicio
        //            //                           + "¬" + item.FechaCese
        //            //                           + "¬" + item.FechaNacimiento
        //            //                           + "¬" + item.Sexo + "^";
        //            //    }

        //            //}
        //            //else
        //            //{
        //            //    if (item.IdPadre == 0)
        //            //    {
        //            //        strDatosFilasTabla += (contador).ToString()
        //            //                           + "¬" + item.PrimerApellido
        //            //                           + "¬" + item.SegundoApellido
        //            //                           + "¬" + item.PrimerNombre
        //            //                           + "¬" + item.SegundoNombre
        //            //                           + "¬" + item.NombrePreferido /*NOMBRE PREFERIDO*/
        //            //                           + "¬" + item.Dni
        //            //                           + "¬" + item.NombreArea
        //            //                           + "¬" + "" /*SUB ÁREA*/
        //            //                           + "¬" + item.NombreCargo
        //            //                           + "¬" + item.RegistraMarcacion /*REGISTRA MARCACIÓN*/
        //            //                           + "¬" + item.CorreoPersonal /*CORREO PERSONAL*/
        //            //                           + "¬" + item.CorreoElectronico /*CORREO LABORAL*/
        //            //                           + "¬" + item.FechaInicio
        //            //                           + "¬" + item.FechaCese
        //            //                           + "¬" + item.FechaNacimiento
        //            //                           + "¬" + item.Sexo + "^";
        //            //    }
        //            //    else
        //            //    {
        //            //        strDatosFilasTabla += (contador).ToString()
        //            //                           + "¬" + item.PrimerApellido
        //            //                           + "¬" + item.SegundoApellido
        //            //                           + "¬" + item.PrimerNombre
        //            //                           + "¬" + item.SegundoNombre
        //            //                           + "¬" + item.NombrePreferido /*NOMBRE PREFERIDO*/
        //            //                           + "¬" + item.Dni
        //            //                           + "¬" + item.NombreAreaPadre
        //            //                           + "¬" + item.NombreArea
        //            //                           + "¬" + item.NombreCargo /*SUB ÁREA*/
        //            //                           + "¬" + item.RegistraMarcacion /*REGISTRA MARCACIÓN*/
        //            //                           + "¬" + item.CorreoPersonal /*CORREO PERSONAL*/
        //            //                           + "¬" + item.CorreoElectronico /*CORREO LABORAL*/
        //            //                           + "¬" + item.FechaInicio
        //            //                           + "¬" + item.FechaCese
        //            //                           + "¬" + item.FechaNacimiento
        //            //                           + "¬" + item.Sexo + "^";
        //            //    }
        //            //}
        //        }
        //    }

        //    byte[] filecontent = blPersonal.crearExcel_Personal(TituloHoja, strListaCabeceraTabla, strDatosFilasTabla, strTituloDocumento);

        //    jsonsession.Data = filecontent;

        //    System.Web.HttpContext.Current.Session["excelfacturav"] = jsonsession;

        //    respuesta.Success = true;
        //    respuesta.Message = "Exito";
        //    return Json(respuesta, JsonRequestBehavior.AllowGet);
        //}

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
        //        strEstado = "ACTIVO";
        //    }
        //    else
        //    {
        //        strEstado = "INACTIVO";
        //    }

        //    string strFecha = DateTime.Now.ToString("MM/dd/yyyy");

        //    strTituloDocumento = "LISTADO DE COLABORADORES " + strEstado + " AL " + strFecha;

        //    strListaCabeceraTabla = "N°¬NOMBRE¬DNI¬ÁREA¬SUB ÁREA¬CARGO¬CORREO¬FECHA INICIO¬FECHA FIN¬FECHA NACIMIENTO";

        //    if (listPersonal.Count > 0)
        //    {
        //        foreach (var item in listPersonal)
        //        {
        //            contador++;
        //            if (contador < totalfilas)
        //            {
        //                if (item.IdPadre == 0)
        //                {
        //                    strDatosFilasTabla += (contador).ToString() + "¬" + item.NombrePersonal + "¬" + item.Dni + "¬" + item.NombreArea + "¬"+ ""+"¬" + item.NombreCargo + "¬"
        //                    + item.CorreoElectronico + "¬" + item.FechaInicio + "¬" + item.FechaCese + "¬"+item.FechaNacimiento+ "^";
        //                }
        //                else
        //                {
        //                    strDatosFilasTabla += (contador).ToString() + "¬" + item.NombrePersonal + "¬" + item.Dni + "¬" + item.NombreAreaPadre + "¬" + item.NombreArea + "¬" + item.NombreCargo + "¬"
        //                    + item.CorreoElectronico + "¬" + item.FechaInicio + "¬" + item.FechaCese + "¬" + item.FechaNacimiento + "^";
        //                }

        //            }
        //            else
        //            {
        //                if (item.IdPadre == 0)
        //                {
        //                    strDatosFilasTabla += (contador).ToString() + "¬" + item.NombrePersonal + "¬" + item.Dni + "¬" + item.NombreArea + "¬" + "" + "¬" + item.NombreCargo + "¬"
        //                    + item.CorreoElectronico + "¬" + item.FechaInicio + "¬" + item.FechaCese + "¬" + item.FechaNacimiento + "^";
        //                }
        //                else
        //                {
        //                    strDatosFilasTabla += (contador).ToString() + "¬" + item.NombrePersonal + "¬" + item.Dni + "¬" + item.NombreAreaPadre + "¬" + item.NombreArea + "¬" + item.NombreCargo + "¬"
        //                    + item.CorreoElectronico + "¬" + item.FechaInicio + "¬" + item.FechaCese + "¬" + item.FechaNacimiento + "^";
        //                }
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
        
        public bool HelpDesk_Insert(string par, string datapar, int accion)
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int iresp = -1;
            var oJObject = Newtonsoft.Json.Linq.JObject.Parse(par);
            string IdPersonal = oJObject["IdPersonal"].ToString().Trim();
            par = "{\"id\":" + IdPersonal + "}";
            string data = oMantenimiento.get_Data("usp_Personal_get", par, false, Util.ERP);
            string usuario = "", nombrepersonal = "", idusuario = "", nombrearea = "", nombrecargo = "", Observacion = "";
            string date = DateTime.Today.ToString("yyyyMMdd");

            string pardetail_Helpdesk = string.Empty;
            Newtonsoft.Json.Linq.JObject opardetail_Helpdesk = new Newtonsoft.Json.Linq.JObject();
            opardetail_Helpdesk.Add("IdAprobador", "3"); //usuario aprobador de karen garcia
            opardetail_Helpdesk.Add("EstadoFirma", "1");

            Newtonsoft.Json.Linq.JObject parhead_Helpdesk = new Newtonsoft.Json.Linq.JObject();
            if (data == "" && accion == 1)
            {
                Newtonsoft.Json.Linq.JObject oJObjectPersonal = Newtonsoft.Json.Linq.JObject.Parse(datapar);

                nombrepersonal = oJObjectPersonal["primernombre"].ToString().Trim() + " " +
                                 oJObjectPersonal["segundonombre"].ToString().Trim() + " " +
                                 oJObjectPersonal["primerapellido"].ToString().Trim() + " " +
                                 oJObjectPersonal["segundoapellido"].ToString().Trim();

                Observacion = "Creación de usuario por alta de personal.  Datos del Personal: " +
                            "IdPersonal: " + IdPersonal + " " +
                            ", Nombre Personal: " + nombrepersonal;
            }
            else if (data != "" && accion == 2)
            {
                Newtonsoft.Json.Linq.JArray oJObjectPersonal = Newtonsoft.Json.Linq.JArray.Parse(data);
                foreach (Newtonsoft.Json.Linq.JObject oJO in oJObjectPersonal)
                {
                    usuario = oJO.GetValue("Usuario").ToString().Trim();
                    idusuario = oJO.GetValue("IIDUSUARIO").ToString().Trim();
                    nombrepersonal = oJO.GetValue("NombrePersonal").ToString().Trim();
                    nombrearea = oJO.GetValue("NombreArea").ToString().Trim();
                    nombrecargo = oJO.GetValue("NombreCargo").ToString().Trim();
                    break;
                }
                Observacion = "Cese de usuario por baja de personal.  Datos del Personal: " +
                            "IdPersonal: " + IdPersonal + " " +
                            ", IdUsuario: " + idusuario + "" +
                            ", Usuario: " + usuario + "" +
                            ", Nombre Personal: " + nombrepersonal + "" +
                            ", Nombre Cargo: " + nombrecargo + "" +
                            ", Nombre Area: " + nombrearea;
            }

            bool boolAccion = false;
            if (accion == 1 || accion == 2)
            {
                boolAccion = true;
                parhead_Helpdesk = new JObject();
                parhead_Helpdesk.Add("IdEquipoTIC", "2");
                parhead_Helpdesk.Add("FechaSolicitud", date);
                parhead_Helpdesk.Add("IdTipoSolicitud", "2");
                parhead_Helpdesk.Add("IdPrioridad", "2");
                parhead_Helpdesk.Add("IdCategoria", (accion == 2) ? "25" : "44");
                parhead_Helpdesk.Add("IdSistema", "0");
                parhead_Helpdesk.Add("Observations", Observacion);
                parhead_Helpdesk.Add("IdEstado", 2);
                parhead_Helpdesk.Add("IdAccion", "1");
                parhead_Helpdesk.Add("UsuarioSolicitante", 231);
                parhead_Helpdesk.Add("AreaSolicitante", 13);
                parhead_Helpdesk.Add("IdUsuario", 207);
                parhead_Helpdesk.Add("UsuarioCreacion", "marco.valdivieso");
                parhead_Helpdesk.Add("Ip", "");
                parhead_Helpdesk.Add("Hostname", "");
            }

            if (boolAccion)
            {
                //iresp = oMantenimiento.save_Rows_Out("usp_HelpDesk_Insert_ModuloPersonal", parhead_Helpdesk.ToString(), Util.ERP, opardetail_Helpdesk.ToString(), "", "");
            }

            return (iresp > 0);
        }

        public ActionResult Update()
        {
            return View();
        }

        public ActionResult Nuevo()
        {
            return View();
        }

        public ActionResult Editar()
        {
            return View();
        }

        [HttpGet]
        [AccessSecurity]
        public string Personal_GetData()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            string data = oMantenimiento.get_Data("GestionTalento.usp_Get_PerfilUsuario", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string Personal_Guardar()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().UsuarioAD);

            /* Inicia - Para guardar foto de personal en erp */
            string urlPersonal = ConfigurationManager.AppSettings["urlFilePersonal"].ToString();
            HttpPostedFileBase PersonalImagen = Request.Files["parimg"];
            string ImagenWebNombre = "";
           
            if (PersonalImagen != null)
            {
                string dni = _.Get_Par(par, "dni");
                string cImagenWeb = "";
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();
                string cRutaImagenWeb = Server.MapPath("~" + urlPersonal);
                MemoryStream target = new MemoryStream();
                PersonalImagen.InputStream.CopyTo(target);
                byte[] Imagen = target.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);
                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(PersonalImagen.FileName);
                string cFolderThumbnail = cRutaImagenWeb;
                cImagenWeb = dni + cExtension;
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWeb), ImagenWeb);
                ImagenWebNombre = cImagenWeb;
            }
            /* Termina - Para guardar foto de personal en erp */

            par = _.addParameter(par, "imagenwebnombre", ImagenWebNombre);
            //string data = oMantenimiento.get_Data("GestionTalento.usp_Personal_Guardar", par, false, Util.ERP);
            //return data != null ? data : string.Empty;

            int id = oMantenimiento.save_Rows_Out("GestionTalento.usp_Personal_Guardar", par, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
            
        }

    }
}