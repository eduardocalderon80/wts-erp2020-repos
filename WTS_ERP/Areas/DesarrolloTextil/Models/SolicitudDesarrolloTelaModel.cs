using OfficeOpenXml;
using OfficeOpenXml.Drawing;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.DesarrolloTextil.Models
{
    public  class SolicitudDesarrolloTelaModel
    {
        public static byte[] crearExcel_LeadTimes(string titulo, string strListaCabeceraTabla, string strDatosFilasTabla, string strDatosColorTabla, string strTituloDocumento)
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
                    pic.SetSize(200, 80);

                    worksheet.Cells[3, 4, 3, 6].Merge = true;
                    worksheet.Cells[3, 4, 3, 6].Value = strTituloDocumento;
                    worksheet.Cells[3, 4, 3, 6].Style.Font.Bold = true;
                    worksheet.Cells[3, 4, 3, 6].Style.Font.Size = 13;

                    // GRID

                    string[] arrayCabeceraTabla, arrayFilasTabla, arrayColorTabla;


                    int indexColumna = 1, totalCabeceras = 0, indexInicioColumna = 1, indiceFinalColumnaTabla = 0, indexFila = 0, cantidadcombinacionceldadescripciontabla = 7,
                       indexfilainiciotabla = 7;

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

                    indexFila = indexFila + 1; // -- fila 8
                    indexColumna = indexInicioColumna; // -- columna 1

                    arrayFilasTabla = strDatosFilasTabla.Split('^');
                    arrayColorTabla = strDatosColorTabla.Split('^');
                    for (int i = 0; i < arrayFilasTabla.Length - 1; i++)
                    {
                        string[] columnas = arrayFilasTabla[i].Split('¬');
                        string[] colores = arrayColorTabla[i].Split('¬');
                        indexColumna = indexInicioColumna;
                        for (int j = 0; j < columnas.Length; j++)
                        {
                            worksheet.Cells[indexFila, indexColumna].Value = columnas[j].Trim();
                            worksheet.Cells[indexFila, indexColumna].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                            if(colores[j] != "none")
                            {
                                // BACKGROUNDCOLOR CELLS
                                Color colorcelda = ColorTranslator.FromHtml(colores[j]);

                                worksheet.Cells[indexFila, indexColumna].Style.Fill.PatternType = ExcelFillStyle.Solid;
                                worksheet.Cells[indexFila, indexColumna].Style.Fill.BackgroundColor.SetColor(colorcelda);
                            }

                            indexColumna++;
                        }
                        
                        indexFila++;
                    }
                    worksheet.Cells.AutoFitColumns();
                    result = package.GetAsByteArray();
                }
            }
            catch (Exception ex)
            {
                //GrabarArchivoLog(ex);
            }

            return result;
        }
    }
}