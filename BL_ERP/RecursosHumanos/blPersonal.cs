using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using BE_ERP.RecursosHumanos;
using DAL_ERP.RecursosHumanos;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using OfficeOpenXml.Drawing;

namespace BL_ERP.RecursosHumanos
{
    public class blPersonal : blLog
    {
        public List<Personal> Personal_ReportPDF(string nombreBD, int pIdArea, int pIdCargo, int pEstado)
        {
            List<Personal> listPersonal = new List<Personal>();
            string conexion = nombreBD ?? Util.Default;

            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    daPersonal daPersonal = new daPersonal();
                    listPersonal = daPersonal.Personal_ReportPDF(con, pIdArea, pIdCargo, pEstado);
                }
                catch (Exception ex)
                {
                    listPersonal = null;
                    GrabarArchivoLog(ex);
                }
            }
            return listPersonal;
        }

        public string ExcelContentType()
        {
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }

        public byte[] crearExcel_Personal(string titulo, string strListaCabeceraTabla, string strDatosFilasTabla, string strTituloDocumento)
        {
            byte[] result = null;
            try
            {
                using (ExcelPackage package = new ExcelPackage())
                {

                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(titulo);

                    // PONER MARGEN
                    worksheet.PrinterSettings.LeftMargin = 0.8M;
                    worksheet.PrinterSettings.RightMargin = 0.20M;
                    worksheet.PrinterSettings.TopMargin = 0.5M;
                    worksheet.PrinterSettings.BottomMargin = 0.5M;

                    Image image = Image.FromFile(System.Web.HttpContext.Current.Server.MapPath("~/Content/img/logos/WTSLogo2.png"));
                    ExcelPicture pic = worksheet.Drawings.AddPicture("logowts", image);
                    pic.SetPosition(1, 0, 1, 0);
                    pic.SetSize(240, 80);

                    // CABECERA NUMERO DE FACTURA
                    //worksheet.Cells[3, 7].Value = strTituloDocumento;
                    //worksheet.Cells[3, 7].Style.Font.Bold = true;
                    //worksheet.Cells[3, 7].Style.Font.Size = 13;
                    // TEXTO TITULO ASIGNA 6 DE ANCHO
                    worksheet.Cells[3, 4, 3, 6].Merge = true;
                    worksheet.Cells[3, 4, 3, 6].Value = strTituloDocumento;
                    worksheet.Cells[3, 4, 3, 6].Style.Font.Bold = true;
                    worksheet.Cells[3, 4, 3, 6].Style.Font.Size = 13;

                    // GRID

                    string[] arrayCabeceraTabla, arrayFilasTabla;


                    int indexColumna = 1, totalCabeceras = 0, indexInicioColumna = 1, indiceFinalColumnaTabla = 0, indexFila = 0, cantidadcombinacionceldadescripciontabla = 7,
                       indexfilainiciotabla = 7;

                    // -- CABECERA TABLA
                    arrayCabeceraTabla = strListaCabeceraTabla.Split('¬');
                    totalCabeceras = arrayCabeceraTabla.Length;
                    indexFila = indexfilainiciotabla;
                    indexColumna = indexInicioColumna;

                    /*indiceFinalColumnaTabla = totalCabeceras + (cantidadcombinacionceldadescripciontabla + 2);*/
                    //indiceFinalColumnaTabla = totalCabeceras + (cantidadcombinacionceldadescripciontabla - 1);
                    indiceFinalColumnaTabla = totalCabeceras;

                    for (int i = 0; i < totalCabeceras; i++)
                    {
                        worksheet.Cells[indexFila, indexColumna].Value = arrayCabeceraTabla[i].Trim();
                        worksheet.Cells[indexFila, indexColumna].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        // Cabecera posicion 1 le asigna 7 celdas de ancho
                        //if (i == 1)
                        //{
                        //    worksheet.Cells[indexFila, indexColumna, indexFila, cantidadcombinacionceldadescripciontabla + 1].Merge = true;
                        //    //worksheet.Cells[indexFila, indexColumna, indexFila, cantidadcombinacionceldadescripciontabla + 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        //    indexColumna = indexColumna + (cantidadcombinacionceldadescripciontabla - 1); // para que se quede en la columna 7 y luego mas abajo se suma
                        //}
                        /*
                        if (i == 3)
                        {
                            worksheet.Cells[indexFila, indexColumna, indexFila, cantidadcombinacionceldadescripciontabla + 5].Merge = true;
                            //worksheet.Cells[indexFila, indexColumna, indexFila, cantidadcombinacionceldadescripciontabla + 5].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            indexColumna = indexColumna + (cantidadcombinacionceldadescripciontabla - 5);
                        }
                        
                        if (i == 4)
                        {
                            worksheet.Cells[indexFila, indexColumna, indexFila, cantidadcombinacionceldadescripciontabla + 8].Merge = true;
                            worksheet.Cells[indexFila, indexColumna, indexFila, cantidadcombinacionceldadescripciontabla + 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            indexColumna = indexColumna + (cantidadcombinacionceldadescripciontabla - 5);
                        }
                        */

                        indexColumna++;
                    }

                    // BACKGROUNDCOLOR CABECERA
                    Color colorletracabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("White");
                    Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#005588");

                    worksheet.Cells[indexFila, indexInicioColumna, indexFila, indiceFinalColumnaTabla].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[indexFila, indexInicioColumna, indexFila, indiceFinalColumnaTabla].Style.Font.Color.SetColor(colorletracabeceratabladetalle);
                    worksheet.Cells[indexFila, indexInicioColumna, indexFila, indiceFinalColumnaTabla].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                    worksheet.Cells[indexFila, indexInicioColumna, indexFila, indiceFinalColumnaTabla].Style.Font.Bold = true;
                    worksheet.Cells[indexFila, indexInicioColumna, indexFila, indiceFinalColumnaTabla].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                    // -- DETALLE TABLA

                    indexFila = indexFila + 1; // -- fila 8
                    indexColumna = indexInicioColumna; // -- columna 1

                    arrayFilasTabla = strDatosFilasTabla.Split('^');
                    for (int i = 0; i < arrayFilasTabla.Length; i++)
                    {
                        string[] columnas = arrayFilasTabla[i].Split('¬');
                        indexColumna = indexInicioColumna;
                        for (int j = 0; j < columnas.Length; j++)
                        {
                            worksheet.Cells[indexFila, indexColumna].Value = columnas[j].Trim();
                            worksheet.Cells[indexFila, indexColumna].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                            // Centrar Columnas de excel por index
                            if (j == 0 || j == 13 || j == 14 || j == 15 || j == 16)
                            {
                                worksheet.Cells[indexFila, indexColumna].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            }
                            // Columna posicion 1 le asigna 7 celdas de ancho
                            //if (j == 1)
                            //{
                            //    worksheet.Cells[indexFila, indexColumna, indexFila, cantidadcombinacionceldadescripciontabla + 1].Merge = true;
                            //    //worksheet.Cells[indexFila, indexColumna, indexFila, cantidadcombinacionceldadescripciontabla + 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            //    indexColumna = indexColumna + (cantidadcombinacionceldadescripciontabla -1);  // se hace esto para que empiece en otro index columna por la combinacion de celdas
                            //}
                            indexColumna++;
                        }
                        //worksheet.Cells[indexFila, indexInicioColumna, indexFila, cantidadcombinacionceldadescripciontabla].Merge = true;

                        indexFila++;
                    }
                    worksheet.Cells.AutoFitColumns();
                    result = package.GetAsByteArray();
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }

            return result;
        }
    }
}
