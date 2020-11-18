using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Excel;
using BL_ERP;

namespace WTS_ERP.Models
{
    public class _Helper : blLog
    {
        public DataTable convertExceltoDataSet(string patFile)
        {
            DataSet ds = new DataSet();
            string log = string.Empty;
            try
            {
                using (FileStream stream = System.IO.File.Open(patFile, FileMode.Open, FileAccess.Read))
                {
                    IExcelDataReader reader = null;
                    try
                    {
                        if (patFile.EndsWith(".xls"))
                        {
                            reader = ExcelReaderFactory.CreateBinaryReader(stream);
                        }
                        if (patFile.ToLower().EndsWith(".xlsx"))
                        {
                            reader = ExcelReaderFactory.CreateOpenXmlReader(stream);
                        }
                        reader.IsFirstRowAsColumnNames = true;
                        ds = reader.AsDataSet(true);
                    }
                    catch (Exception ex1)
                    {
                        log = ex1.ToString();
                        reader.Close();
                    }
                    reader.Close();
                }
            }
            catch (IOException ex)
            {
                log = ex.ToString();
            }
            return (ds.Tables[0] != null && ds.Tables[0].Rows[0][0].ToString().Length > 0) ? ds.Tables[0] : null;
        }

        public string convertDataTabletoCSV(DataTable tabla, char separadorCampo, char separadorRegistro)
        {
            StringBuilder stringBuilder = new StringBuilder();
            for (int i = 0; i < tabla.Columns.Count; i++)
            {
                stringBuilder.Append(tabla.Columns[i].ColumnName);
                if (i < tabla.Columns.Count - 1)
                {
                    stringBuilder.Append(separadorCampo);
                }
            }
            stringBuilder.Append(separadorRegistro);
            for (int j = 0; j < tabla.Rows.Count; j++)
            {
                for (int k = 0; k < tabla.Columns.Count; k++)
                {
                    stringBuilder.Append(tabla.Rows[j][k].ToString());
                    if (k < tabla.Columns.Count - 1)
                    {
                        stringBuilder.Append(separadorCampo);
                    }
                }
                stringBuilder.Append(separadorRegistro);
            }
            return stringBuilder.ToString();
        }


        public DataTable ClearDataTable(DataTable table, string firstfield) {

            int quantityRows = table.Rows.Count;
            int posInicial = -1;

            for (int i = 0; i < quantityRows; i++)
            {
                if (table.Rows[i][0].ToString().Trim() == firstfield) {
                    posInicial = i;
                    break;
                }
            }

           if (posInicial > 0) {               
                DataRow dataRow = table.Rows[posInicial];
                string[] columns = ColumnsFromDataTable(dataRow);

                DataTable tbl = CreateDataTable(table,columns,posInicial+1);
                return tbl;
            }            
            return table;
        }


        private DataTable CreateDataTable(DataTable tblOrigin,string[] columns,int posInicial) {
            DataTable tbl = new DataTable();
            foreach (string colum in columns) {
                tbl.Columns.Add(colum,typeof(string));
            }

            int posFinal = tblOrigin.Rows.Count;
            int cantColumns = tblOrigin.Columns.Count;

            for (int x = posInicial; x < posFinal; x++) {
                DataRow dataRow = tbl.NewRow();
                for (int k = 0; k < cantColumns; k++) {
                   dataRow[columns[k]] = tblOrigin.Rows[x][k].ToString();
                }
                tbl.Rows.Add(dataRow);
            }

            return tbl;
        }

        private string[] ColumnsFromDataTable(DataRow dataRow)
        {
            List<string> lista = new List<string>();
            foreach (var x in dataRow.ItemArray) {
                lista.Add(x.ToString());
            }
            return lista.ToArray();
        }




        public string Upload_file(HttpPostedFileBase parFile)
        {
            bool exito = false;
            string path = string.Empty;
            try
            {
                HttpPostedFileBase file = parFile;
                string nombreArchivo = Path.GetFileName(file.FileName);
                string rutaUpload = Util.RutaUpload;
                path = System.Web.HttpContext.Current.Server.MapPath(String.Format("~/{0}/{1}", rutaUpload, nombreArchivo));

                if (System.IO.File.Exists(path)) { System.IO.File.Delete(path); }
                file.SaveAs(path);
                exito = true;
            }
            catch (Exception ex)
            {
                exito = false;
                GrabarArchivoLog(ex);
            }
            return exito ? path : string.Empty;
        }

        public string GetPathUpload(string nombreArchivo)
        {
            string rutaUpload = Util.RutaUpload;
            string path = System.Web.HttpContext.Current.Server.MapPath(String.Format("~/{0}/{1}", rutaUpload, nombreArchivo));
            return path;
        }

        public string ConvertDataTableToJSON(DataTable table)
        {
            var JSONString = new StringBuilder();
            if (table.Rows.Count > 0)
            {
                JSONString.Append("[");
                for (int i = 0; i < table.Rows.Count; i++)
                {
                    JSONString.Append("{");
                    for (int j = 0; j < table.Columns.Count; j++)
                    {
                        if (j < table.Columns.Count - 1)
                        {
                            JSONString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\",");
                        }
                        else if (j == table.Columns.Count - 1)
                        {
                            JSONString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\"");
                        }
                    }
                    if (i == table.Rows.Count - 1)
                    {
                        JSONString.Append("}");
                    }
                    else
                    {
                        JSONString.Append("},");
                    }
                }
                JSONString.Append("]");
            }
            return JSONString.ToString();
        }

        public string ConvertDataTableToHTML(DataTable dt)
        {
            //string html = "<tbody>";
            //add header row
            //html += "<tr>";
            //for (int i = 0; i < dt.Columns.Count; i++)
            //    html += "<td>" + dt.Columns[i].ColumnName + "</td>";
            //html += "</tr>";
            //add rows
            string html = "";
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                html += "<tr>";
                for (int j = 0; j < dt.Columns.Count; j++)
                    html += "<td>" + dt.Rows[i][j].ToString() + "</td>";
                html += "</tr>";
            }
            //html += "</tbody>";
            return html;
        }

    }
}