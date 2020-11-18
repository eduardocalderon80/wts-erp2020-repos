using System;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using OfficeOpenXml.Drawing;
using System.Configuration;
using System.Linq;
using BE_ERP;
using System.Collections.Generic;

namespace Utilitario
{
    public sealed class  ExportacionExcel
    {        
        public static byte[] CrearArchivoExcel(string strListaCabeceraTabla, string strDatosFilasTabla, string pTituloPrincipal, string pStrTitulosReporte = "")
        {
            int indexColumna = 1;
            int indexInicioFila = 2;
            int indexFila = 0;
            int indexInicioColumna = 2;
            int totalFilasTituloReporte = 0;
            int contador = 0;
            int totalCabeceras = 0;
            int indiceInicioFilasDetalle = 0;
            int indiceInicioFilaCabeceraTabla = 0;
            int indiceFinalColumnaTabla = 0;

            string[] arrayCabeceraTabla;
            string[] arrayFilasTabla;
            byte[] result = null;
            string[] arrayTitulosReporte = pStrTitulosReporte.Split('|');
            totalFilasTituloReporte = arrayTitulosReporte.Length;
            indexFila = indexInicioFila;

            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add(String.Format("{0} Data", pTituloPrincipal));

                // TITULOS DEL REPORTE
                for (int i = 0; i < arrayTitulosReporte.Length; i++)
                {
                    contador = indexInicioColumna;
                    string[] titulos = arrayTitulosReporte[i].Split('|');
                    if (titulos.Length > 1)
                    {
                        for (int j = 0; j < titulos.Length; j++)
                        {
                            if (j == 0)
                            {
                                workSheet.Cells[indexFila, contador].Value = titulos[j];
                                workSheet.Cells[indexFila, contador].Style.Font.Bold = true;
                            }
                            else
                            {
                                workSheet.Cells[indexFila, contador].Value = titulos[j];
                            }

                            contador++;
                        }
                    }
                    else
                    {
                        workSheet.Cells[indexFila, contador].Value = titulos[0];
                        workSheet.Cells[indexFila, contador].Style.Font.Bold = true;
                    }
                    indexFila++;
                }

                // FIN TITULOS DEL REPORTE

                // DETALLE DEL REPORTE
                // -- CABECERA TABLA
                ////indexFila = indexFila + 2;
                indexFila = 1;

                indiceInicioFilaCabeceraTabla = indexFila;
                //Header of diccionario cabeceras
                arrayCabeceraTabla = strListaCabeceraTabla.Split('¬');
                totalCabeceras = arrayCabeceraTabla.Length;
                indexColumna = indexInicioColumna;

                indiceFinalColumnaTabla = totalCabeceras + indexInicioColumna - 1;

                for (int i = 0; i < totalCabeceras; i++)
                {
                    workSheet.Cells[indexFila, indexColumna].Value = arrayCabeceraTabla[i].Trim();
                    indexColumna++;
                }

                // -- DETALLE TABLA
                ////indexFila = indexFila + 1;
                indexFila = 1;
                indiceInicioFilasDetalle = indexFila;
                indexColumna = indexInicioColumna;

                arrayFilasTabla = strDatosFilasTabla.Split('^');
                for (int i = 0; i < arrayFilasTabla.Length; i++)
                {
                    string[] columnas = arrayFilasTabla[i].Split('¬');
                    indexColumna = indexInicioColumna;
                    for (int j = 0; j < columnas.Length; j++)
                    {
                        decimal miDecimal = 0;
                        int miInteger = 0;
                        if (decimal.TryParse(columnas[j], out miDecimal))
                        {
                            workSheet.Cells[indexFila, indexColumna].Value = miDecimal;
                        }
                        else if (int.TryParse(columnas[j], out miInteger))
                        {
                            workSheet.Cells[indexFila, indexColumna].Value = miInteger;
                        }
                        else
                        {
                            workSheet.Cells[indexFila, indexColumna].Value = columnas[j].Trim();

                            if (indexColumna == 9)
                                workSheet.Cells[indexFila, contador].Style.Numberformat.Format = "mm/dd/yyyy";
                        }

                        indexColumna++;
                    }
                    indexFila++;
                }

                // autofit width of cells with small content
                indexColumna = indexInicioColumna;
                for (int i = 0; i < totalCabeceras; i++)
                {
                    ExcelRange columnCells = workSheet.Cells[workSheet.Dimension.Start.Row, indexColumna, workSheet.Dimension.End.Row, indexColumna];
                    workSheet.Column(indexColumna).AutoFit();
                    indexColumna++;
                }

                // format header - bold, yellow on black
                indexColumna = indexInicioColumna;
                using (ExcelRange r = workSheet.Cells[indiceInicioFilaCabeceraTabla, indexColumna, indiceInicioFilaCabeceraTabla, indiceFinalColumnaTabla])
                {
                    r.Style.Font.Bold = true;
                }

                result = package.GetAsByteArray();
            }

            return result;
        }

        public static byte[] GenerarExcelfromCSV(ParametrosReporteExcel parametroExcelCSV)
        {
            string[] aDataHojaCSV = parametroExcelCSV.DataCSV.Split(parametroExcelCSV.DelimitadorHoja);            
            string[] aNombreHoja = parametroExcelCSV.NombreHoja.Split(parametroExcelCSV.DelimitadorNombre);
            byte[] result = null;
            /*INICIO DE LA RECORRIDO DE HOJAS*/

            using (ExcelPackage package = new ExcelPackage())
            {

                for (int _hoja = 0; _hoja < aDataHojaCSV.Length; _hoja++)
                {
                    string[] aDataCSV = (aDataHojaCSV[_hoja]).Split(parametroExcelCSV.DelimitadorFila);
                    string[] aData = null;
                    string[] aTituloEncabezados = null;
                    string[] aTipoDatosEncabezados = null;
                    int posicionTituloEncabezado = 1;
                    int posicionTipoDatosEncabezado = 2;
                    int posicionDataCSVconEstructura = 3;
                    

                    bool contieneDataCSV = EsValidoPosicionArray(aDataCSV, posicionDataCSVconEstructura);
                    bool exitoEstructura = false;
                    int cantidadColumnasExistentes = -1;

                    if (parametroExcelCSV.ContieneEstructura && contieneDataCSV)
                    {
                        aData = ObtenerDataCSVfromPosicion(aDataCSV, posicionDataCSVconEstructura);
                        if (aData.Length > 0)
                        {
                            aTituloEncabezados = aDataCSV[posicionTituloEncabezado].Split(parametroExcelCSV.DelimitadorCampo);
                            aTipoDatosEncabezados = aDataCSV[posicionTipoDatosEncabezado].Split(parametroExcelCSV.DelimitadorCampo);
                            exitoEstructura = true;
                        }
                    }
                    else
                    {
                        aData = ObtenerDataCSVfromPosicion(aDataCSV, 1);
                        aTituloEncabezados = aDataCSV[0].Split(parametroExcelCSV.DelimitadorCampo);
                        cantidadColumnasExistentes = aData[0].Split(parametroExcelCSV.DelimitadorCampo).Length;
                    }

                    int indexFila = 1;
                    int contador = 0;
                    int cantidadCampos = aTituloEncabezados.Length;

                    ExcelWorksheet workSheet = package.Workbook.Worksheets.Add(aNombreHoja[_hoja]);                    

                    // TITULOS DEL REPORTE
                    for (int i = 0; i < cantidadCampos; i++)
                    {
                        if (aTituloEncabezados[i].Length > 0)
                        {
                            contador++;
                            workSheet.Cells[indexFila, contador].Value = aTituloEncabezados[i];
                            workSheet.Cells[indexFila, contador].Style.Font.Bold = true;                        
                        }
                    }
                    cantidadColumnasExistentes = contador;

                    //// -- DETALLE TABLA
                    int cantidadFilas = aData.Length;
                    int indiceColumna = 2;
                    string[] columnas = null;
                    decimal miDecimal = 0;
                    int miInteger = 0;                
                    contador = -1;
                    indexFila = 2;
                    for (int row = 0; row < aData.Length; row++)
                    {
                        contador++;
                        indiceColumna = 1;
                        columnas = aData[contador].Split(parametroExcelCSV.DelimitadorCampo);

                        for (int indexColumna = 0; indexColumna < cantidadCampos; indexColumna++)
                        {
                            if (exitoEstructura && aTipoDatosEncabezados[indexColumna].Length > 0)
                            {                            
                                    if (aTipoDatosEncabezados[indexColumna] == "decimal")
                                    {                                    
                                        if (decimal.TryParse(columnas[indexColumna], out miDecimal))
                                        {
                                            workSheet.Cells[indexFila, indiceColumna].Value = miDecimal;
                                            workSheet.Cells[indexFila, indiceColumna].Style.Numberformat.Format = "$ ###,###,##0.00";
                                        }
                                        else
                                        {
                                            workSheet.Cells[indexFila, indiceColumna].Value = columnas[indexColumna].Trim();
                                        }
                                    }
                                    else if (aTipoDatosEncabezados[indexColumna] == "int")
                                    {
                                        if (int.TryParse(columnas[indexColumna], out miInteger))
                                        {
                                            workSheet.Cells[indexFila, indiceColumna].Value = miInteger;
                                        }
                                        else {
                                            workSheet.Cells[indexFila, indiceColumna].Value = columnas[indexColumna].Trim();
                                        }
                                    }
                                    else if (aTipoDatosEncabezados[indexColumna] == "date")
                                    {
                                        //if (DateTime.TryParse(columnas[indexColumna], out miFecha))
                                        //{
                                        //    workSheet.Cells[indexFila, indiceColumna].Value = miFecha;
                                        //    workSheet.Cells[indexFila, indiceColumna].Style.Numberformat.Format = "mm/dd/yyyy";
                                        //}
                                        //else {
                                        //    workSheet.Cells[indexFila, indiceColumna].Value = columnas[indexColumna].Trim();
                                        //}
                                        workSheet.Cells[indexFila, indiceColumna].Value = columnas[indexColumna];
                                        workSheet.Cells[indexFila, indiceColumna].Style.Numberformat.Format = "mm/dd/yyyy";
                                    }
                                    else
                                    {
                                        workSheet.Cells[indexFila, indiceColumna].Value = columnas[indexColumna].Trim();
                                    }
                                    ////indiceColumna += 1;
                            
                            }
                            else
                            {                            
                                workSheet.Cells[indexFila, indiceColumna].Value = columnas[indexColumna].Trim();
                            }
                            indiceColumna += 1;
                        }
                        indexFila++;
                    }

                    // autofit width of cells with small content               
                    int indiceInicioColumna = 1;
                    for (int indexColumna = indiceInicioColumna; indexColumna < cantidadColumnasExistentes; indexColumna++)
                    {
                        ExcelRange columnCells = workSheet.Cells[workSheet.Dimension.Start.Row, indexColumna, workSheet.Dimension.End.Row, indexColumna];
                        workSheet.Column(indexColumna).AutoFit();
                    }


                    // format header - bold, yellow on black
                    indexFila = 1;
                    using (ExcelRange r = workSheet.Cells[indexFila, indiceInicioColumna, indexFila, cantidadColumnasExistentes])
                    {
                        r.Style.Font.Bold = true;
                    }

                    workSheet.Cells[1, 1, contador+2, cantidadColumnasExistentes].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[1, 1, contador+2, cantidadColumnasExistentes].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[1, 1, contador+2, cantidadColumnasExistentes].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[1, 1, contador+2, cantidadColumnasExistentes].Style.Border.Right.Style = ExcelBorderStyle.Thin;

                }
                result = package.GetAsByteArray();
            }

            /*FIN DE LA RECORRIDO DE HOJAS*/

            return result;
        }

        private static bool EsValidoPosicionArray(string[] adataCSV, int posicionDataCSV) {
            bool esvalido = adataCSV[posicionDataCSV] != null && adataCSV[posicionDataCSV].Length > 0;
            return esvalido;
        }

        private static string[] ObtenerDataCSVfromPosicion(string[] aData, int posicionInicio ) {
            Dictionary<int, string> map = new Dictionary<int, string>();            
            int fin = aData.Length - 1;
            for (int x= posicionInicio; x <= fin; x++) {
                map.Add(x, aData[x]);
            }
            string[] arrayData = map.Values.ToArray();
            return arrayData;
        }

    }
}
