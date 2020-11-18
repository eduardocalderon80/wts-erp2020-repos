using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using BE_ERP.Planeamiento;
using DAL_ERP.Planeamiento;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using OfficeOpenXml.Drawing;

namespace BL_ERP.Planeamiento
{
    public class blOrdenCompraTextil
    {
        public List<OrdenCompraTextil> OrdenCompraTextil_Export_Excel(string nombreBD, string codigofabrica, string codigocliente, string fechadesde, string fechahasta, int idoc, string usuarioad)
        {
            List<OrdenCompraTextil> listOrdenCompraTextil = new List<OrdenCompraTextil>();
            string conexion = nombreBD ?? Util.Default;

            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    daOrdenCompraTextil daOrdenCompraTextil = new daOrdenCompraTextil();
                    listOrdenCompraTextil = daOrdenCompraTextil.OrdenCompraTextil_Export_Excel(con, codigofabrica, codigocliente, fechadesde, fechahasta, idoc, usuarioad);
                }
                catch (Exception ex)
                {
                    listOrdenCompraTextil = null;
                    //GrabarArchivoLog(ex);
                }
            }
            return listOrdenCompraTextil;
        }

        public byte[] crearExcel_Reporte_OrdenCompraTextil(string titulo, string strListaCabeceraTabla, string strDatosFilasTabla, string strTituloDocumento, int tiporeporte)
        {
            byte[] result = null;
            try
            {
                using (ExcelPackage package = new ExcelPackage())
                {

                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(titulo);

                    string[] arrayCabeceraTabla, arrayFilasTabla;


                    int indexColumna = 1, totalCabeceras = 0, indexInicioColumna = 1, indiceFinalColumnaTabla = 0, indexFila = 0, //cantidadcombinacionceldadescripciontabla = 7,
                       indexfilainiciotabla = 1;

                    // -- CABECERA TABLA
                    arrayCabeceraTabla = strListaCabeceraTabla.Split('¬');
                    totalCabeceras = arrayCabeceraTabla.Length;
                    indexFila = indexfilainiciotabla;
                    indexColumna = indexInicioColumna;

                    indiceFinalColumnaTabla = totalCabeceras;// + (cantidadcombinacionceldadescripciontabla - 1);

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
                    for (int i = 1; i < arrayFilasTabla.Length; i++)
                    {
                        string[] columnas = arrayFilasTabla[i].Split('¬');
                        indexColumna = indexInicioColumna;
                        for (int j = 0; j < columnas.Length; j++)
                        {
                            worksheet.Cells[indexFila, indexColumna].Value = columnas[j].Trim();
                            


                            worksheet.Cells[indexFila, indexColumna].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            

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
