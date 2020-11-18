using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iTextSharp.text;
using iTextSharp.text.pdf;
using BE_ERP.Laboratorio;
using System.Web;

namespace BL_ERP.Laboratorio
{
    public class blReportePartida : blLog
    {
        Font Font_Titulo_Grande = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 14f, 1, BaseColor.BLACK);
        Font Font_Titulo_Mediano = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 7f, 1, BaseColor.BLACK);
        Font Font_Base = FontFactory.GetFont(FontFactory.HELVETICA, 7f, 0);
        Font Font_Base_Bold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 7f, 0);
        Font Font_Chica = FontFactory.GetFont(FontFactory.HELVETICA, 6f, 0);


        public void Tabla_Encabezado_Logo(Document document, List<ReporteBase> listaBase, int numerogrupo, float[] widthTable)
        {



            //:1
            List<ReporteBase> listaFiltro = new List<ReporteBase>();
            listaFiltro = listaBase.FindAll(x => x.idgrupo == numerogrupo);

            if (listaFiltro.Count > 0)
            {
                // :rutas
                string imagepath = HttpContext.Current.Server.MapPath("~/images/empresa");
                int numcolumna = listaFiltro[0].columnagrupo;

                // :imagen
                Image imageLogo = Image.GetInstance(imagepath + "/WTSLogoWtsSac.png");
                imageLogo.ScalePercent(50f);
                imageLogo.SetAbsolutePosition(document.Left, document.Top - 60);

                // tabla Encabezado, 2 columnas
                PdfPTable tablaEncabezado = new PdfPTable(numcolumna);
                tablaEncabezado.TotalWidth = 500.0f;
                tablaEncabezado.LockedWidth = true;

                tablaEncabezado.SetWidths(widthTable);
                tablaEncabezado.HorizontalAlignment = 0;
                tablaEncabezado.SpacingBefore = 30f;
                tablaEncabezado.SpacingAfter = 5f;

                // subtabla Encabezado, 2 columnas
                PdfPTable subtable = new PdfPTable(numcolumna);
                PdfPCell celltitulo = new PdfPCell(new Phrase(listaFiltro[0].grupo.ToUpper(), Font_Titulo_Mediano));
                celltitulo.Colspan = 2;
                celltitulo.Border = 0;
                celltitulo.HorizontalAlignment = 1;//0=Left, 1=Centre, 2=Right 
                celltitulo.BackgroundColor = BaseColor.LIGHT_GRAY;
                subtable.AddCell(celltitulo);

                // :celdas
                PdfPCell cell = new PdfPCell();
                FontProperties propCelda = null;
                Font fontCelda = default(Font);
                foreach (ReporteBase item in listaFiltro)
                {
                    propCelda = new FontProperties();
                    propCelda = getProperties(item.formato);
                    fontCelda = FontFactory.GetFont(propCelda.Fuente, propCelda.Tamano, propCelda.Formato);
                    cell = new PdfPCell(new Paragraph(item.campo, fontCelda));

                    cell.Border = 0;
                    cell.HorizontalAlignment = 0;
                    subtable.AddCell(cell);
                }


                // :celda izquierda
                PdfPCell celdaEncabezado = new PdfPCell(subtable);
                celdaEncabezado.Border = 0;

                // :celda derecha
                PdfPCell celdaEncabezadoImage = new PdfPCell(imageLogo);
                celdaEncabezadoImage.Border = 0;

                // :add celdas
                tablaEncabezado.AddCell(celdaEncabezadoImage);
                tablaEncabezado.AddCell(celdaEncabezado);

                document.Add(tablaEncabezado);
            }
        }

        public void Tabla_Base(Document document, List<ReporteBase> listaBase, int numerogrupo, float[] widthTable)
        {
            //:1
            List<ReporteBase> listaFiltro = new List<ReporteBase>();
            listaFiltro = listaBase.FindAll(x => x.idgrupo == numerogrupo);

            if (listaFiltro.Count > 0)
            {
                // :columnas            
                int numcolumna = listaFiltro[0].columnagrupo;

                // tabla 
                PdfPTable tablaBase = new PdfPTable(numcolumna);
                tablaBase.TotalWidth = 500.0f;
                tablaBase.LockedWidth = true;

                tablaBase.SetWidths(widthTable);
                tablaBase.HorizontalAlignment = 0;
                tablaBase.SpacingBefore = 5f;
                tablaBase.SpacingAfter = 5f;

                //:font
                Font fontTitulo = default(Font);
                FontProperties propTitulo = getProperties(listaFiltro[0].formato);
                fontTitulo = FontFactory.GetFont(propTitulo.Fuente, propTitulo.Tamano, propTitulo.Formato);

                // :celda titulo
                PdfPCell celltitulo = new PdfPCell(new Phrase(listaFiltro[0].grupo.ToUpper(), fontTitulo));
                celltitulo.Colspan = numcolumna;
                celltitulo.Border = 0;
                celltitulo.HorizontalAlignment = propTitulo.Alineacion;
                celltitulo.BackgroundColor = BaseColor.LIGHT_GRAY;
                tablaBase.AddCell(celltitulo);

                // :celdas ForEach
                PdfPCell cell = new PdfPCell();
                FontProperties propCelda = null;
                Font fontCelda = default(Font);
                foreach (ReporteBase item in listaFiltro)
                {
                    propCelda = new FontProperties();
                    propCelda = getProperties(item.formato);
                    fontCelda = FontFactory.GetFont(propCelda.Fuente, propCelda.Tamano, propCelda.Formato);
                    cell = new PdfPCell(new Paragraph(item.campo, fontCelda));
                    cell.Border = 0;
                    cell.HorizontalAlignment = propCelda.Alineacion;
                    tablaBase.AddCell(cell);
                }
                document.Add(tablaBase);
            }
        }

        public void Tabla_Resumen(Document document, List<ReporteDetalle> listaBase, int numerogrupo, float[] widthTable)
        {
            //:1
            List<ReporteDetalle> listaFiltro = new List<ReporteDetalle>();
            listaFiltro = listaBase.FindAll(x => x.idgrupo == numerogrupo);

            if (listaFiltro.Count > 0)
            {
                // :columnas            
                int numcolumna = widthTable.Length;

                // tabla 
                PdfPTable tablaBase = new PdfPTable(numcolumna);
                tablaBase.TotalWidth = 500.0f;
                tablaBase.LockedWidth = true;

                tablaBase.SetWidths(widthTable);
                tablaBase.HorizontalAlignment = 0;
                tablaBase.SpacingBefore = 5f;
                tablaBase.SpacingAfter = 5f;

                // :celda titulo
                PdfPCell celltitulo = new PdfPCell(new Phrase(listaFiltro[0].titulo, Font_Titulo_Mediano));
                celltitulo.Colspan = numcolumna;
                celltitulo.Border = 0;
                celltitulo.HorizontalAlignment = 0;
                celltitulo.BackgroundColor = BaseColor.LIGHT_GRAY;
                tablaBase.AddCell(celltitulo);

                // :celda subtitulo
                PdfPCell cellsubtitulo = null;

                cellsubtitulo = new PdfPCell(new Paragraph(" ", Font_Base));
                cellsubtitulo.Border = 0;
                cellsubtitulo.HorizontalAlignment = 0;
                tablaBase.AddCell(cellsubtitulo);

                cellsubtitulo = new PdfPCell(new Paragraph("PASS", Font_Base));
                cellsubtitulo.Border = 0;
                cellsubtitulo.HorizontalAlignment = 1;
                tablaBase.AddCell(cellsubtitulo);

                cellsubtitulo = new PdfPCell(new Paragraph("FAIL", Font_Base));
                cellsubtitulo.Border = 0;
                cellsubtitulo.HorizontalAlignment = 1;
                tablaBase.AddCell(cellsubtitulo);

                // :celdas ForEach
                PdfPCell cell = new PdfPCell();

                foreach (ReporteDetalle item in listaFiltro)
                {
                    cell = new PdfPCell(new Paragraph(item.subgrupo, Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 0;
                    tablaBase.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(item.campo3, Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 1;
                    tablaBase.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(item.campo4, Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 1;
                    tablaBase.AddCell(cell);
                }
                document.Add(tablaBase);
            }
        }


        public void Tabla_Detalle(Document document, List<ReporteDetalle> listaDetalle, int numerogrupo, float[] widthTable)
        {
            //:1
            List<ReporteDetalle> listaFiltro = new List<ReporteDetalle>();
            List<ReporteDetalle> listaResumen = new List<ReporteDetalle>();
            List<ReporteDetalle> lista = null;
            int idgrupoResumen = 4;

            listaResumen = listaDetalle.FindAll(x => x.idgrupo == idgrupoResumen && (x.campo3 == "X" || x.campo4 == "X"));
            listaFiltro = listaDetalle.FindAll(x => x.idgrupo == numerogrupo);

            // :columna
            int numcolumna = widthTable.Length;
            // :tabla 
            PdfPTable tablaDetalle = new PdfPTable(numcolumna);
            tablaDetalle.TotalWidth = 500.0f;
            tablaDetalle.LockedWidth = true;

            tablaDetalle.SetWidths(widthTable);
            tablaDetalle.HorizontalAlignment = 0;
            tablaDetalle.SpacingBefore = 5f;
            tablaDetalle.SpacingAfter = 5f;

            // :celda titulo
            PdfPCell celltitulo = new PdfPCell(new Phrase(listaFiltro[0].titulo, Font_Titulo_Mediano));
            celltitulo.Colspan = numcolumna;
            celltitulo.Border = 0;
            celltitulo.HorizontalAlignment = 0;
            celltitulo.BackgroundColor = BaseColor.LIGHT_GRAY;
            tablaDetalle.AddCell(celltitulo);

            // :celdas ForEach        
            bool oneRow = false;

            listaResumen.ForEach(x =>
            {
                lista = new List<ReporteDetalle>();
                lista = listaFiltro.FindAll(y => y.idsubgrupo == x.idsubgrupo);
                oneRow = lista.Count == 1;
                if (lista.Count > 0)
                {
                    addCells_Details(tablaDetalle, lista, oneRow);
                }
            });
            document.Add(tablaDetalle);
        }



        public void Tabla_Keys(Document document, List<ReporteKeys> listaKeys, float[] widthTable)
        {
            // :columna
            int numcolumna = widthTable.Length;
            // :tabla 
            PdfPTable tablaKeys = new PdfPTable(numcolumna);
            tablaKeys.TotalWidth = 500.0f;
            tablaKeys.LockedWidth = true;

            tablaKeys.SetWidths(widthTable);
            tablaKeys.HorizontalAlignment = 0;
            tablaKeys.SpacingBefore = 5f;
            tablaKeys.SpacingAfter = 5f;

            // :celda titulo
            PdfPCell celltituloA = new PdfPCell(new Phrase(listaKeys[0].campoA, Font_Titulo_Mediano));
            celltituloA.Border = 0;
            celltituloA.HorizontalAlignment = 0;
            tablaKeys.AddCell(celltituloA);

            PdfPCell celltituloB = new PdfPCell(new Phrase(listaKeys[0].campoB, Font_Titulo_Mediano));
            celltituloB.Border = 0;
            celltituloB.HorizontalAlignment = 0;
            tablaKeys.AddCell(celltituloB);

            PdfPCell celltituloC = new PdfPCell(new Phrase(listaKeys[0].campoC, Font_Titulo_Mediano));
            celltituloC.Border = 0;
            celltituloC.HorizontalAlignment = 0;
            tablaKeys.AddCell(celltituloC);

            // :celdas ForEach        
            PdfPCell cell = new PdfPCell();
            int filas = listaKeys.Count;
            int x = 0;
            for (x = 1; x < filas; x++)
            {
                cell = new PdfPCell(new Paragraph(listaKeys[x].campoA, Font_Chica));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaKeys.AddCell(cell);

                cell = new PdfPCell(new Paragraph(listaKeys[x].campoB, Font_Chica));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaKeys.AddCell(cell);

                cell = new PdfPCell(new Paragraph(listaKeys[x].campoC, Font_Chica));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaKeys.AddCell(cell);

            };
            document.Add(tablaKeys);
        }


        public void Tabla_Conditions(Document document, List<ReporteConditions> listaConditions, float[] widthTable)
        {
            // :columna
            int numcolumna = widthTable.Length;
            // :tabla 
            PdfPTable tablaKeys = new PdfPTable(numcolumna);
            tablaKeys.TotalWidth = 500.0f;
            tablaKeys.LockedWidth = true;

            tablaKeys.SetWidths(widthTable);
            tablaKeys.HorizontalAlignment = 0;
            tablaKeys.SpacingBefore = 5f;
            tablaKeys.SpacingAfter = 5f;

            // :celda titulo
            PdfPCell celltitulo = new PdfPCell(new Phrase(listaConditions[0].titulo, Font_Titulo_Mediano));
            celltitulo.Border = 0;
            celltitulo.HorizontalAlignment = 0;
            celltitulo.BackgroundColor = BaseColor.LIGHT_GRAY;
            tablaKeys.AddCell(celltitulo);

            // :celdas ForEach        
            PdfPCell cell = new PdfPCell();
            listaConditions.ForEach(x =>
            {
                cell = new PdfPCell(new Paragraph(x.campo, Font_Chica));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaKeys.AddCell(cell);
            });
            document.Add(tablaKeys);


            PdfPTable tablaDetalle1 = new PdfPTable(2);
            tablaDetalle1.TotalWidth = 190.0f;
            tablaDetalle1.LockedWidth = true;

            float[] arrayWidth = new float[] { 50f, 140f };

            tablaDetalle1.SetWidths(arrayWidth);
            tablaDetalle1.HorizontalAlignment = 0;
            tablaDetalle1.SpacingBefore = 5f;
            tablaDetalle1.SpacingAfter = 5f;

            PdfPCell celltitulo1 = new PdfPCell(new Phrase("Approved by:", Font_Titulo_Mediano));
            celltitulo1.Border = 0;
            celltitulo1.HorizontalAlignment = 0;

            Font Font_Titulo_Mediano_SUB = FontFactory.GetFont(FontFactory.HELVETICA, "", false, 7f, 1, BaseColor.BLACK);
            Font_Titulo_Mediano_SUB.SetStyle(Font.UNDERLINE);

            PdfPCell celltitulo2 = new PdfPCell(new Phrase("Eng. Mercedes Carrión D. CIP 167824", Font_Titulo_Mediano_SUB));
            celltitulo2.Border = 0;
            celltitulo2.HorizontalAlignment = Element.ALIGN_CENTER;

            PdfPCell celltitulo3 = new PdfPCell(new Phrase("", Font_Titulo_Mediano));
            celltitulo3.Border = 0;
            celltitulo3.HorizontalAlignment = 0;

            PdfPCell celltitulo4 = new PdfPCell(new Phrase("Head of laboratory", Font_Titulo_Mediano));
            celltitulo4.Border = 0;
            celltitulo4.HorizontalAlignment = Element.ALIGN_CENTER;
            

            tablaDetalle1.AddCell(celltitulo1);
            tablaDetalle1.AddCell(celltitulo2);
            tablaDetalle1.AddCell(celltitulo3);
            tablaDetalle1.AddCell(celltitulo4);

            document.Add(tablaDetalle1);

            PdfPTable tablaend = new PdfPTable(1);
            tablaend.TotalWidth = 500.0f;
            tablaend.LockedWidth = true;

            PdfPCell celltituloend = new PdfPCell(new Phrase("********** END OF THE REPORT **********", Font_Titulo_Mediano));
            celltituloend.Border = 0;
            celltituloend.HorizontalAlignment = Element.ALIGN_CENTER;
            tablaend.AddCell(celltituloend);
            document.Add(tablaend);


        }

        /// <summary>
        /// Reglas: Para crear celdas en la tabla
        /// 
        /// isFirst             : Regla para asignar celdas vacias si en gaso el [SubGrupo] solo tiene una fila, a esto se le agrega una fila con celdas vacias.
        /// valorRegla_SubGrupo : Regla para obtener el valor de [SubGrupo], esto se asigna solo a la 2da fila.    
        /// valorRegla_Campo1   : Regla para obtener el valor de [Campo1], esto se asigna al primer item padre a los demas serán vacios.
        /// </summary>
        /// <param name="table"></param>
        /// <param name="lista"></param>
        /// <param name="isFirst"></param>
        public void addCells_Details(PdfPTable table, List<ReporteDetalle> lista, bool isFirst, int Row = 0)
        {

            bool isWicking = lista.FindIndex(x => x.idsubgrupo == 19) >= 0;

            string texto1 = "GRADE SA";
            string texto2 = texto1.ToUpperInvariant();

            PdfPCell cell = new PdfPCell();
            int indice = 0;
            cell = new PdfPCell(new Paragraph(Row.ToString() + " " + lista[indice].subgrupo, Font_Base));
            cell.Border = 0;
            cell.PaddingRight = 10f;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);

            cell = new PdfPCell(new Paragraph(lista[indice].campo1, Font_Base));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);

            cell = new PdfPCell(new Paragraph(lista[indice].campo2, Font_Base));
            cell.Border = 0;
            cell.HorizontalAlignment = 0;
            table.AddCell(cell);

            cell = new PdfPCell(new Paragraph(!isWicking ? lista[indice].campo3 : " ", Font_Base));
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);

            cell = new PdfPCell(new Paragraph(lista[indice].campo4, Font_Base));
            cell.Border = 0;
            cell.HorizontalAlignment = 1;
            table.AddCell(cell);

            string espacios = ""; // "            "

            if (isFirst)
            {
                string codigo = lista[indice].codigo.Trim();
                if (codigo.Length > 0)
                {
                    cell = new PdfPCell(new Paragraph(espacios + lista[indice].codigo, Font_Base));
                    cell.Border = 0;
                    cell.PaddingRight = 10f;
                    cell.HorizontalAlignment = 0;
                    table.AddCell(cell);

                    int numeroCells = 4;
                    //:celdas adicionales en blanco
                    for (int x = 0; x < numeroCells; x++)
                    {
                        cell = new PdfPCell(new Paragraph(" ", Font_Base));
                        cell.Border = 0;
                        cell.HorizontalAlignment = 0;
                        table.AddCell(cell);
                    }
                }
            }
            else
            {

                int nfilas = lista.Count;
                string valorRegla_SubGrupo = string.Empty;
                string valorRegla_Campo1 = string.Empty;

                for (indice = 1; indice < nfilas; indice++)
                {
                    valorRegla_SubGrupo = indice == 1 ? espacios + lista[indice].codigo : " ";
                    valorRegla_Campo1 = (lista[indice].campo1 != lista[indice - 1].campo1) ? lista[indice].campo1 : " ";

                    cell = new PdfPCell(new Paragraph(valorRegla_SubGrupo, Font_Base));
                    cell.Border = 0;
                    cell.PaddingRight = 10f;
                    cell.HorizontalAlignment = 0;
                    table.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(valorRegla_Campo1, Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 0;
                    table.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(lista[indice].campo2, Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 0;
                    table.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(!isWicking ? lista[indice].campo3 : " ", Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 1;
                    table.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(lista[indice].campo4, Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 1;
                    table.AddCell(cell);
                }
            }
        }



        /// <summary>
        /// Metodo para Obtener las propiedades de una celda        
        /// </summary>
        /// <param name="propiedades">
        /// FORMATO RESUMEN   => {FONT_TAMAÑO_FORMATO_ALINEACION}
        /// FORMATO DETALLADO =>
        ///{
        ///   FONT        :HELVETICA, 
        ///   TAMAÑO      :[5,6,7,8...], 
        ///   FORMATO     :[0:normal,1:negrita,2y3:cursiva,4:subrayado], 
        ///   ALINEACION  :[0:left,1:center,2:right]
        ///}
        /// </param>
        /// <returns></returns>
        private FontProperties getProperties(string propiedades)
        {
            string[] arr = propiedades.Split('_');
            FontProperties prop = new FontProperties();
            if (arr != null && arr.Length > 2)
            {
                prop.Fuente = (arr[0] != null && arr[0].Length > 0) ? arr[0].ToString() : "HELVETICA";
                prop.Tamano = (arr[1] != null && arr[1].Length > 0) ? float.Parse(arr[1].ToString()) : 6;
                prop.Formato = (arr[2] != null && arr[2].Length > 0) ? int.Parse(arr[2].ToString()) : 0;
                prop.Alineacion = (arr[3] != null && arr[3].Length > 0) ? int.Parse(arr[3].ToString()) : 0;
            }
            else
            {
                prop.Fuente = "HELVETICA";
                prop.Tamano = 6;
                prop.Formato = 0;
                prop.Alineacion = 0;
            }
            return prop;
        }




        // VERSION 2
        public void Tabla_Encabezado_Logo_v2(Document document, ReporteLaboratorio oReporte, float[] widthTable)
        {
            if (oReporte != null)
            {
                // :rutas
                string imagepath = HttpContext.Current.Server.MapPath("~/Content/img/logos");
                int numcolumna = 2;

                // :imagen
                iTextSharp.text.Image imageLogo = iTextSharp.text.Image.GetInstance(imagepath + "/WTSLogo2.png");
                imageLogo.ScalePercent(10f);
                imageLogo.SetAbsolutePosition(document.Left, document.Top - 60);

                // :table
                PdfPTable tablaEncabezado = new PdfPTable(numcolumna);
                tablaEncabezado.TotalWidth = 500.0f;
                tablaEncabezado.LockedWidth = true;

                tablaEncabezado.SetWidths(widthTable);
                tablaEncabezado.HorizontalAlignment = 0;
                tablaEncabezado.SpacingBefore = 30f;
                tablaEncabezado.SpacingAfter = 5f;

                // :celda izquierda
                PdfPCell celdaEncabezadoImage = new PdfPCell(imageLogo);
                celdaEncabezadoImage.Border = 0;

                // :celda derecha
                PdfPCell celdaEncabezadoDireccion = new PdfPCell();
                celdaEncabezadoDireccion.Border = 0;
                celdaEncabezadoDireccion.AddElement(new Phrase("WTS LABORATORY", Font_Titulo_Mediano));
                string[] adireccion = oReporte.direccion.Length > 0 ? oReporte.direccion.Split('¬') : null;
                foreach (string linea in adireccion)
                {
                    celdaEncabezadoDireccion.AddElement(new Phrase(linea, Font_Base));
                }

                // :celda medio
                PdfPCell celdaTitulo = new PdfPCell(new Phrase(oReporte.numero_reporte, FontFactory.GetFont(FontFactory.HELVETICA, 10f, 1)));
                celdaTitulo.Border = 0;
                celdaTitulo.BackgroundColor = BaseColor.LIGHT_GRAY;
                celdaTitulo.HorizontalAlignment = 1;
                celdaTitulo.Colspan = 2;
                celdaTitulo.PaddingTop = 3;
                celdaTitulo.PaddingBottom = 3;

                // :add celdas
                tablaEncabezado.AddCell(celdaEncabezadoImage);
                tablaEncabezado.AddCell(celdaEncabezadoDireccion);
                tablaEncabezado.AddCell(celdaTitulo);

                document.Add(tablaEncabezado);
            }
        }


        public void Tabla_Base_v2(Document document, List<ReporteBase> listaBase, int numerogrupo, float[] widthTable)
        {
            //:1
            List<ReporteBase> listaFiltro = new List<ReporteBase>();
            listaFiltro = listaBase.FindAll(x => x.idgrupo == numerogrupo);
            bool grupoBase = numerogrupo > 2;

            if (listaFiltro.Count > 0)
            {
                // :columnas            
                int numcolumna = widthTable.Length;

                // tabla 
                PdfPTable tablaBase = new PdfPTable(numcolumna);
                tablaBase.TotalWidth = 500.0f;
                tablaBase.LockedWidth = true;

                tablaBase.SetWidths(widthTable);
                tablaBase.HorizontalAlignment = 0;
                tablaBase.SpacingBefore = 5f;
                tablaBase.SpacingAfter = 5f;

                //:font
                Font fontTitulo = default(Font);
                FontProperties propTitulo = getProperties(listaFiltro[0].formato);
                fontTitulo = FontFactory.GetFont(propTitulo.Fuente, propTitulo.Tamano, propTitulo.Formato);

                if (grupoBase)
                {
                    // :celda titulo
                    PdfPCell celltitulo = new PdfPCell(new Phrase(listaFiltro[0].grupo.ToUpper(), fontTitulo));
                    celltitulo.Colspan = numcolumna;
                    celltitulo.Border = 0;
                    celltitulo.HorizontalAlignment = propTitulo.Alineacion;
                    celltitulo.BackgroundColor = BaseColor.LIGHT_GRAY;
                    tablaBase.AddCell(celltitulo);
                }

                // :celdas ForEach
                PdfPCell cell = new PdfPCell();
                FontProperties propCelda = null;
                Font fontCelda = default(Font);
                foreach (ReporteBase item in listaFiltro)
                {
                    propCelda = new FontProperties();
                    propCelda = getProperties(item.formato);
                    fontCelda = FontFactory.GetFont(propCelda.Fuente, propCelda.Tamano, propCelda.Formato);
                    cell = new PdfPCell(new Paragraph(item.campo, fontCelda));
                    cell.Border = 0;
                    cell.HorizontalAlignment = propCelda.Alineacion;
                    cell.PaddingRight = 10;
                    tablaBase.AddCell(cell);
                }
                document.Add(tablaBase);
            }
        }

        public void Tabla_Base_Comments_v2(Document document, List<ReporteBase> listaBase, int numerogrupo, float[] widthTable, string TipoPrueba = null)
        {
            //:1
            List<ReporteBase> listaFiltro = new List<ReporteBase>();
            listaFiltro = listaBase.FindAll(x => x.idgrupo == numerogrupo);
            bool grupoBase = numerogrupo > 2;

            if (listaFiltro.Count > 0)
            {

                if (!string.IsNullOrEmpty(listaFiltro[1].campo))
                {

                    // :columnas            
                    int numcolumna = widthTable.Length;

                    // tabla 
                    PdfPTable tablaBase = new PdfPTable(numcolumna);
                    tablaBase.TotalWidth = 500.0f;
                    tablaBase.LockedWidth = true;

                    tablaBase.SetWidths(widthTable);
                    tablaBase.HorizontalAlignment = 0;
                    tablaBase.SpacingBefore = 5f;
                    tablaBase.SpacingAfter = 5f;

                    //:font
                    Font fontTitulo = default(Font);
                    FontProperties propTitulo = getProperties(listaFiltro[0].formato);
                    fontTitulo = FontFactory.GetFont(propTitulo.Fuente, propTitulo.Tamano, propTitulo.Formato);

                    if (grupoBase)
                    {
                        // :celda titulo

                        var grupo = listaFiltro[0].grupo.ToUpper();

                        if (TipoPrueba != null)
                        {
                            if (TipoPrueba == "f" || TipoPrueba == "p" || TipoPrueba == "gf" || TipoPrueba == "gp")
                            {
                                grupo = "Submitted care instruction";
                            }
                        }

                        PdfPCell celltitulo = new PdfPCell(new Phrase(grupo.ToUpper(), fontTitulo));
                        celltitulo.Colspan = numcolumna;
                        celltitulo.Border = 0;
                        celltitulo.HorizontalAlignment = propTitulo.Alineacion;
                        celltitulo.BackgroundColor = BaseColor.LIGHT_GRAY;
                        tablaBase.AddCell(celltitulo);
                    }

                    // :celdas ForEach
                    PdfPCell cell = new PdfPCell();
                    FontProperties propCelda = null;
                    Font fontCelda = default(Font);
                    ReporteBase item = listaFiltro[1];
                    //foreach (ReporteBase item in listaFiltro)
                    if (item != null)
                    {
                        propCelda = new FontProperties();
                        propCelda = getProperties(item.formato);
                        fontCelda = FontFactory.GetFont(propCelda.Fuente, propCelda.Tamano, propCelda.Formato);
                        cell = new PdfPCell(new Paragraph(item.campo, fontCelda));
                        cell.Border = 0;
                        cell.HorizontalAlignment = propCelda.Alineacion;
                        tablaBase.AddCell(cell);
                    }
                    document.Add(tablaBase);
                }
            }
        }

        public void Tabla_Resumen_v2(Document document, List<ReporteDetalle> listaResumen, int numerogrupo, float[] widthTable)
        {
            //:1

            if (listaResumen.Count > 0)
            {

                //Font fontCelda = default(Font);
                //FontProperties propCelda = getProperties("HELVETICA_7_0_0");
                //fontCelda = FontFactory.GetFont(propCelda.Fuente, propCelda.Tamano, propCelda.Formato);


                //Font fontTitulo = default(Font);
                //FontProperties propTitulo = getProperties("HELVETICA_7_1_0");
                //fontTitulo = FontFactory.GetFont(propTitulo.Fuente, propTitulo.Tamano, propTitulo.Formato);


                // :columnas            
                int numcolumna = widthTable.Length;

                // tabla 
                PdfPTable tablaBase = new PdfPTable(numcolumna);
                tablaBase.TotalWidth = 500.0f;
                tablaBase.LockedWidth = true;

                tablaBase.SetWidths(widthTable);
                tablaBase.HorizontalAlignment = 0;
                tablaBase.SpacingBefore = 5f;
                tablaBase.SpacingAfter = 5f;

                // :celda titulo
                PdfPCell celltitulo = new PdfPCell(new Phrase(listaResumen[0].titulo, Font_Titulo_Mediano)); //Font_Titulo_Mediano
                celltitulo.Colspan = numcolumna;
                celltitulo.Border = 0;
                celltitulo.HorizontalAlignment = 0;
                celltitulo.BackgroundColor = BaseColor.LIGHT_GRAY;
                tablaBase.AddCell(celltitulo);

                // :celda subtitulo
                PdfPCell cellsubtitulo = null;

                cellsubtitulo = new PdfPCell(new Paragraph(" ", Font_Titulo_Mediano));//Font_Base
                cellsubtitulo.Border = 0;
                cellsubtitulo.HorizontalAlignment = 0;
                tablaBase.AddCell(cellsubtitulo);

                cellsubtitulo = new PdfPCell(new Paragraph("INFORMATION", Font_Titulo_Mediano));
                cellsubtitulo.Border = 0;
                cellsubtitulo.HorizontalAlignment = 1;
                tablaBase.AddCell(cellsubtitulo);

                cellsubtitulo = new PdfPCell(new Paragraph("PASS", Font_Titulo_Mediano));
                cellsubtitulo.Border = 0;
                cellsubtitulo.HorizontalAlignment = 1;
                tablaBase.AddCell(cellsubtitulo);

                cellsubtitulo = new PdfPCell(new Paragraph("FAIL", Font_Titulo_Mediano));
                cellsubtitulo.Border = 0;
                cellsubtitulo.HorizontalAlignment = 1;
                tablaBase.AddCell(cellsubtitulo);



                // :celdas ForEach
                PdfPCell cell = new PdfPCell();

                foreach (ReporteDetalle item in listaResumen)
                {
                    cell = new PdfPCell(new Paragraph(item.row + "  " + item.subgrupo, Font_Base)); //Font_Base
                    cell.Border = 0;
                    cell.HorizontalAlignment = 0;
                    tablaBase.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(item.campo5, Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 1;
                    tablaBase.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(item.campo3, Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 1;
                    tablaBase.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(item.campo4, Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 1;
                    tablaBase.AddCell(cell);
                }

                document.Add(tablaBase);

                PdfPTable tablaDetalle = new PdfPTable(1);
                tablaDetalle.TotalWidth = 500.0f;
                tablaDetalle.LockedWidth = true;

                widthTable = new float[] { 500f };

                tablaDetalle.SetWidths(widthTable);
                tablaDetalle.HorizontalAlignment = 0;
                tablaDetalle.SpacingBefore = 5f;
                tablaDetalle.SpacingAfter = 5f;

                PdfPCell celltitulo1 = new PdfPCell(new Phrase("TESTING DETAILED", Font_Titulo_Mediano));
                celltitulo1.Colspan = numcolumna;
                celltitulo1.Border = 0;
                celltitulo1.HorizontalAlignment = 0;
                celltitulo1.BackgroundColor = BaseColor.LIGHT_GRAY;
                tablaDetalle.AddCell(celltitulo1);

                document.Add(tablaDetalle);




            }
        }


        public void Tabla_Garment(Document document, List<ReporteDetalle> listaDetalle, int numerogrupo, float[] widthTable, string uom)
        {
            //:1
            //List<ReporteDetalle> listaFiltro = new List<ReporteDetalle>();
            List<ReporteDetalle> lista = new List<ReporteDetalle>();

            lista = listaDetalle.FindAll(x => x.idgrupo == numerogrupo);

            if (lista.Count > 0)
            {

                int numcolumna = widthTable.Length;
                // :tabla 
                PdfPTable table = new PdfPTable(numcolumna);
                table.TotalWidth = 500.0f;
                table.LockedWidth = true;

                

                table.SetWidths(widthTable);
                table.HorizontalAlignment = 0;
                table.SpacingBefore = 5f;
                table.SpacingAfter = 5f;


                PdfPCell cell = new PdfPCell();
                int indice = 0;
                cell = new PdfPCell(new Paragraph(lista[indice].row.ToString() + " " + lista[indice].subgrupo, Font_Base));
                cell.Border = 0;
                cell.Colspan = 8;
                cell.HorizontalAlignment = 0;
                table.AddCell(cell);

                cell = new PdfPCell(new Paragraph(lista[indice].codigo, Font_Base));
                cell.Border = 0;//
                cell.Colspan = 8;
                cell.PaddingRight = 230f;
                cell.HorizontalAlignment = 0;
                table.AddCell(cell);

                Row_Empty(table, 8);

                var primerciclo = lista[0].campo3;
                cell = new PdfPCell(new Paragraph(" ", Font_Base_Bold));
                cell.Border = 0;//
                cell.HorizontalAlignment = 0;
                table.AddCell(cell);

                cell = new PdfPCell(new Paragraph("Original", Font_Base_Bold));
                cell.Border = 0;
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                //cell.HorizontalAlignment = 0;
                table.AddCell(cell);

                cell = new PdfPCell(new Paragraph("One Cycle", Font_Base_Bold));
                cell.Border = 0;
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                //cell.HorizontalAlignment = 0;
                table.AddCell(cell);

                cell = new PdfPCell(new Paragraph("% Change", Font_Base_Bold));
                cell.Border = 0;
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                //cell.HorizontalAlignment = 0;
                table.AddCell(cell);

                cell = new PdfPCell(new Paragraph("Three Cycles", Font_Base_Bold));
                cell.Border = 0;
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                //cell.HorizontalAlignment = 1;
                table.AddCell(cell);

                cell = new PdfPCell(new Paragraph("% Change", Font_Base_Bold));
                cell.Border = 0;
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                //cell.HorizontalAlignment = 1;
                table.AddCell(cell);

                cell = new PdfPCell(new Paragraph("Five Cycles", Font_Base_Bold));
                cell.Border = 0;
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                //cell.HorizontalAlignment = 1;
                table.AddCell(cell);

                cell = new PdfPCell(new Paragraph("% Change", Font_Base_Bold));
                cell.Border = 0;
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                //cell.HorizontalAlignment = 1;
                table.AddCell(cell);


                lista.ForEach(x =>
                {
                    cell = new PdfPCell(new Paragraph(x.campo1 != "" ? x.campo1 : "-", Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = 0;
                    table.AddCell(cell);
                    
                    cell = new PdfPCell(new Paragraph(x.campo2 != "" ? x.campo2 : "-", Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    //cell.HorizontalAlignment = 0;
                    table.AddCell(cell);
                    
                    cell = new PdfPCell(new Paragraph(x.campo3 != "" ? x.campo3 : "-", Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    //cell.HorizontalAlignment = 0;
                    table.AddCell(cell);
                    
                    cell = new PdfPCell(new Paragraph(x.campo4 != "" ? x.campo4 : "-", Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    //cell.HorizontalAlignment = 1;
                    table.AddCell(cell);
                    
                    cell = new PdfPCell(new Paragraph(x.campo5 != "" ? x.campo5 : "-", Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    //cell.HorizontalAlignment = 1;
                    table.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(x.campo6 != "" ? x.campo6 : "-", Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    //cell.HorizontalAlignment = 1;
                    table.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(x.campo7 != "" ? x.campo7 : "-", Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    //cell.HorizontalAlignment = 1;
                    table.AddCell(cell);

                    cell = new PdfPCell(new Paragraph(x.campo8 != "" ? x.campo8 : "-", Font_Base));
                    cell.Border = 0;
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    //cell.HorizontalAlignment = 1;
                    table.AddCell(cell);
                });


                PdfPTable tableU = new PdfPTable(numcolumna);
                tableU.TotalWidth = 500.0f;
                tableU.LockedWidth = true;

                tableU.SetWidths(widthTable);
                tableU.HorizontalAlignment = 0;
                tableU.SpacingBefore = 5f;
                tableU.SpacingAfter = 5f;


                PdfPCell cellU = new PdfPCell();

                cellU = new PdfPCell(new Paragraph("Measure in " + uom,Font_Base_Bold));
                cellU.PaddingTop = 10;
                cellU.Border = 0;
                cellU.Colspan = 8;
                cellU.HorizontalAlignment = 0;
                table.AddCell(cellU);


                Row_Empty(table, 8);

                document.Add(table);
            }
        }

        public void Tabla_Detalle_v2(Document document, List<ReporteDetalle> listaResumen, List<ReporteDetalle> listaDetalle, int numerogrupo, float[] widthTable)
        {
            //:1
            List<ReporteDetalle> listaFiltro = new List<ReporteDetalle>();
            List<ReporteDetalle> lista = new List<ReporteDetalle>();

            listaFiltro = listaDetalle.FindAll(x => x.idgrupo == numerogrupo);

            if (listaFiltro.Count > 0)
            {

                // :columna

                //var totalWidth = widthTable.Sum();

                int numcolumna = widthTable.Length;
                // :tabla 
                PdfPTable tablaDetalle = new PdfPTable(numcolumna);
                tablaDetalle.TotalWidth = 500.0f;
                tablaDetalle.LockedWidth = true;

                tablaDetalle.SetWidths(widthTable);
                tablaDetalle.HorizontalAlignment = 0;
                tablaDetalle.SpacingBefore = 5f;
                tablaDetalle.SpacingAfter = 5f;

                // :celda titulo
                //PdfPCell celltitulo = new PdfPCell(new Phrase(listaFiltro[0].titulo, Font_Titulo_Mediano));
                //celltitulo.Colspan = numcolumna;
                //celltitulo.Border = 0;
                //celltitulo.HorizontalAlignment = 0;
                //celltitulo.BackgroundColor = BaseColor.LIGHT_GRAY;
                //tablaDetalle.AddCell(celltitulo);

                // :celdas ForEach        
                bool oneRow = false;

                listaResumen.ForEach(x =>
                {
                    lista = new List<ReporteDetalle>();
                    lista = listaFiltro.FindAll(y => y.idsubgrupo == x.idsubgrupo);
                    oneRow = lista.Count == 1;
                    if (lista.Count > 0)
                    {
                        addCells_Details(tablaDetalle, lista, oneRow, x.row);
                        Row_Empty(tablaDetalle, numcolumna);
                    }
                });
                document.Add(tablaDetalle);
            }
        }

        public void Tabla_Minimum_v2(Document document, List<ReporteDetalle> listaResumen, List<ReporteDetalle> listaDetalle, int numerogrupo, float[] widthTable)
        {
            //:1
            List<ReporteDetalle> listaFiltro = new List<ReporteDetalle>();
            int idsubGrupo_Wiking = 19;
            listaFiltro = listaDetalle.FindAll(x => x.idgrupo == numerogrupo && x.idsubgrupo == idsubGrupo_Wiking);//Wiking

            if (listaFiltro.Count > 0)
            {
                string wiking30Wales = listaFiltro[0].campo3;
                string wiking30Courses = listaFiltro[1].campo3;

                // :columna
                int numcolumna = widthTable.Length;
                // :tabla 
                PdfPTable tablaDetalle = new PdfPTable(numcolumna);
                tablaDetalle.TotalWidth = 500.0f;
                tablaDetalle.LockedWidth = true;

                tablaDetalle.SetWidths(widthTable);
                tablaDetalle.HorizontalAlignment = 0;
                tablaDetalle.SpacingBefore = 0f;
                tablaDetalle.SpacingAfter = 5f;

                // :celda titulo
                //PdfPCell celltitulo = new PdfPCell(new Phrase("Minimum - inches in - minutes", Font_Base));
                //celltitulo.Colspan = numcolumna;
                //celltitulo.Border = 0;
                //celltitulo.HorizontalAlignment = 0;
                //tablaDetalle.AddCell(celltitulo);

                PdfPCell cell = new PdfPCell();

                cell = new PdfPCell(new Paragraph("", Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                cell = new PdfPCell(new Paragraph("Time", Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                cell = new PdfPCell(new Paragraph("Results", Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                cell = new PdfPCell(new Paragraph("", Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                cell = new PdfPCell(new Paragraph("Time", Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                cell = new PdfPCell(new Paragraph("Results", Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                // --
                cell = new PdfPCell(new Paragraph("WALES", Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                cell = new PdfPCell(new Paragraph("30 Minutes", Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                cell = new PdfPCell(new Paragraph(wiking30Wales, Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                cell = new PdfPCell(new Paragraph("COURSES", Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                cell = new PdfPCell(new Paragraph("30 Minutes", Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                cell = new PdfPCell(new Paragraph(wiking30Courses, Font_Base));
                cell.Border = 0;
                cell.HorizontalAlignment = 0;
                tablaDetalle.AddCell(cell);

                document.Add(tablaDetalle);
            }
        }


        public void Row_Empty(PdfPTable table, int numeroCells)
        {
            PdfPCell cell = new PdfPCell();
            for (int x = 0; x < numeroCells; x++)
            {
                cell = new PdfPCell(new Paragraph(" ", Font_Base));
                cell.Border = 0;
                cell.PaddingTop = 3;
                cell.HorizontalAlignment = 0;
                table.AddCell(cell);
            }
        }

    }
}
