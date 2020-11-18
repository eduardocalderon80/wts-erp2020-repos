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


namespace BL_ERP.GestionProducto
{
    public class blReporte: blLog
    {

        public string ExcelContentType()
        {
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }

        public byte[] Excel_ReporteDDP(string titulo, string strListaCabeceraTabla, string strDatosFilasTabla, string strTituloDocumento)
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
 
                    // GRID
                    string[] arrayCabeceraTabla, arrayFilasTabla;
                     
                    int indexColumna = 1, totalCabeceras = 0, indexInicioColumna = 1, indiceFinalColumnaTabla = 0, indexFila = 0,  
                       indexfilainiciotabla = 1;

                    // -- CABECERA TABLA
                    arrayCabeceraTabla = strListaCabeceraTabla.Split('¬');
                    totalCabeceras = arrayCabeceraTabla.Length;
                    indexFila = indexfilainiciotabla;
                    indexColumna = indexInicioColumna;

                     indiceFinalColumnaTabla = totalCabeceras;

                    for (int i = 0; i < totalCabeceras; i++)
                    {
                        worksheet.Cells[indexFila, indexColumna].Value = arrayCabeceraTabla[i].Trim();
                        worksheet.Cells[indexFila, indexColumna].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;                        
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
                    indexFila = indexFila + 1;  
                    indexColumna = indexInicioColumna; //  

                    arrayFilasTabla = strDatosFilasTabla.Split('^');
                    for (int i = 1; i < arrayFilasTabla.Length; i++)
                    {
                        string[] columnas = arrayFilasTabla[i].Split('¬');
                        indexColumna = indexInicioColumna;
                        for (int j = 0; j < columnas.Length; j++)
                        {
                            if (j == 12 || j == 13 || j == 14 || j == 15 || j == 20 || j == 23)
                            {
                                worksheet.Cells[indexFila, indexColumna].Value = Convert.ToInt32(columnas[j]); // .Replace("&amp;", "&").Trim();
                            }                         
                            else {
                                worksheet.Cells[indexFila, indexColumna].Value = columnas[j].Replace("&amp;", "&").Trim();
                            }                                                       
                            worksheet.Cells[indexFila, indexColumna].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;                             
                            indexColumna++;
                        }
                        indexFila++;
                    }
                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
                    result = package.GetAsByteArray();
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }

            return result;
        }


        public byte[] Excel_ReporteFLASHA(string titulo, string strListaCabeceraTabla, string strDatosFilasTabla, string strTituloDocumento)
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

                    // GRID
                    string[] arrayCabeceraTabla, arrayFilasTabla;

                    int indexColumna = 1, totalCabeceras = 0, indexInicioColumna = 1, indiceFinalColumnaTabla = 0, indexFila = 0,
                       indexfilainiciotabla = 1;

                    // -- CABECERA TABLA
                    arrayCabeceraTabla = strListaCabeceraTabla.Split('¬');
                    totalCabeceras = arrayCabeceraTabla.Length;
                    indexFila = indexfilainiciotabla;
                    indexColumna = indexInicioColumna;

                    indiceFinalColumnaTabla = totalCabeceras;

                    for (int i = 0; i < totalCabeceras; i++)
                    {
                        worksheet.Cells[indexFila, indexColumna].Value = arrayCabeceraTabla[i].Trim();
                        worksheet.Cells[indexFila, indexColumna].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
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
                    indexFila = indexFila + 1;
                    indexColumna = indexInicioColumna; //  

                    arrayFilasTabla = strDatosFilasTabla.Split('^');
                    for (int i = 1; i < arrayFilasTabla.Length; i++)
                    {
                        string[] columnas = arrayFilasTabla[i].Split('¬');
                        indexColumna = indexInicioColumna;
                        for (int j = 0; j < columnas.Length; j++)
                        {
                            worksheet.Cells[indexFila, indexColumna].Value = columnas[j].Replace("&amp;", "&").Trim();

                            worksheet.Cells[indexFila, indexColumna].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            indexColumna++;
                        }
                        indexFila++;
                    }
                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
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
