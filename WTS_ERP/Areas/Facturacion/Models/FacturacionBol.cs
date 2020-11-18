using BL_ERP;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Utilitario.EnvioFtp;
using System.Reflection;
using System.Configuration;

namespace WTS_ERP.Areas.Facturacion.Models
{
    public class FacturacionBol
    { 
        
        public static string recorrerListado(List<string> listFactura, string IdBol, string rutaOrigen) {

            string extension = "810";
            string rutaDestino = ConfigurationManager.AppSettings["810_in"].ToString();
            bool result = true;
            EnvioFtp utilEnvioFtp = new EnvioFtp();
            string msgErrorRecorrido = "";
            string validacionCreacion = "";
            string validacionEstructura = "";
            string validacionEnvioFtp = "";

            foreach (string idFactura in listFactura)
            {
                result = obtenerArchivoFactura(idFactura, rutaOrigen, rutaDestino, extension);

                if (!result) { validacionCreacion = "Error en la creacion de archivos"; break;  }
                    
            }

            //inicio validacion de estructura

            validacionEstructura = ValidarArchivo(rutaOrigen, extension);

            //inicio validacion de estructura


            if (result && validacionEstructura.Length == 0)
            {
                result = utilEnvioFtp.sendftp_file(rutaOrigen, rutaDestino, extension, "810");

            }
            //--Content\Facturas
            msgErrorRecorrido = validacionCreacion + "||" + validacionEstructura + "||" + validacionEnvioFtp ;


            return msgErrorRecorrido;
        }

        public static string ValidarArchivo(string direccionLocal,string extension)
        {
            
            string strError = "";  
            string[] _archivos = Directory.GetFiles(direccionLocal, "*." + extension);

            for (Int32 a = 0; a < _archivos.Length; ++a)
            {
                string _path_archivo = _archivos[a].ToString();
                string[] lines = System.IO.File.ReadAllLines(_path_archivo);
                string vacios = "                    ";
                bool error = false;

                if (lines[5].ToString() == ""|| lines[8].ToString() == ""|| lines[11].ToString() == "")
                {
                    error = true;
                    string[] words = lines[3].ToString().Split('*');

                    if (strError.Length > 0) { strError += "|" + words[2]+":"+ vacios; } else { strError +=  words[2] + ":"+ vacios; }
                    if (lines[5].ToString() == "") { strError +=  " *Ship To incomplete."+ vacios; };
                    if (lines[8].ToString() == "") { strError +=  " *Bill To incomplete."+ vacios; };
                    if (lines[11].ToString() == "") { strError += " *Remit To incomplete."+ vacios; };
                }

                if (lines[3].ToString() != "")
                {
                    string[] words = lines[3].ToString().Split('*');
                    
                    if (!error) {

                        if (strError.Length > 0) { strError += "|" + words[2] + ":" + vacios; }
                    }

                    if ((words[4].ToString()).Length !=8) { strError += " *PO customer incorrect, number must have 8 digits." + vacios; };

                }
              
            }  

            return strError;
        }

        public static bool  obtenerArchivoFactura(string idfactura, string rutaOrigen,string rutaDestino,string extension) {

            bool bResult = false;
            Boolean benvioFtp = false;
            Boolean bcreacionArchivo = false;
            EnvioFtp utilEnvioFtp = new EnvioFtp();
            blMantenimiento oMantenimiento = new blMantenimiento();
            idfactura = idfactura.Replace("\"", "");         

            try
            {
                StringBuilder str = null;
                string str_cadena = "";
                DataTable dt = oMantenimiento.get_DataDT("usp_ObtenerFactura_EDI", idfactura, Util.ERP);

                if (dt != null)
                {         
            
                    if (dt.Rows.Count > 0)
                    {
                        str = new StringBuilder();
                        for (Int32 i = 0; i < dt.Rows.Count; ++i)
                        {
                            str.Append(dt.Rows[i]["TRAMA"].ToString());

                            if (i < dt.Rows.Count - 1)
                            {
                                str.Append("\r\n");
                            }
                        }

                        str_cadena = str.ToString();
                        string nombre = idfactura+"_" + DateTime.Today.ToString("yyyyMMdd") + "."+ extension;
                        string ruta = rutaOrigen + "\\" + nombre;

                        if (File.Exists(@ruta)) File.Delete(@ruta);
                            File.WriteAllText(@ruta, str_cadena);
                            bcreacionArchivo = true;
                    }                   

                }
                bResult = true;        

            }
            catch (Exception ex) {
                bResult = false;
            }

            return bResult;
        }


    }
}