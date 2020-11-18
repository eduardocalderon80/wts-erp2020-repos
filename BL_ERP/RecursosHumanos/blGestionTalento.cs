using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using BE_ERP.TecnologiaInformacion.HelpDesk;
using DAL_ERP;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using OfficeOpenXml.Drawing;
using Newtonsoft.Json;
using System.Configuration;
using System.IO;
using System.Web;

namespace BL_ERP.RecursosHumanos
{
    public class blGestionTalento : blLog
    {
        public string GestionTalento_GuardarArchivos(string parfoot, string detparfoot, string cFolderThumbnail)
        {
            Archivo objArchivo = new Archivo();
            List<Archivo> listaArchivo = new List<Archivo>();
            try
            {
                //Generar Lista Archivo

                List<Archivo> listaarchivosfromjavascript = JsonConvert.DeserializeObject<List<Archivo>>(parfoot);
                Random oAleatorio = new Random();

                string cExtension = "";
                byte[] Imagen = new byte[0];
                MemoryStream target = new MemoryStream();
                

                int contador = 0;


                foreach (string item in HttpContext.Current.Request.Files)
                {
                    target = new MemoryStream();
                    Imagen = new byte[0];
                    var requestArchivo = HttpContext.Current.Request.Files[item];
                    if (listaarchivosfromjavascript[contador].modificado == 1)
                    {
                        string NombreArchivoOriginal = System.IO.Path.GetFileName(requestArchivo.FileName);

                        cExtension = Path.GetExtension(requestArchivo.FileName);

                        requestArchivo.InputStream.CopyTo(target);
                        Imagen = target.ToArray();

                        string cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                        objArchivo = new Archivo();
                        objArchivo.TipoArchivo = 1;
                        objArchivo.NombreArchivoOriginal = NombreArchivoOriginal;
                        objArchivo.NombreArchivo = cImagenWebNombre;
                        objArchivo.modificado = 1;
                        objArchivo.bytearchivo = Imagen;
                        listaArchivo.Add(objArchivo);
                    }

                    contador++;
                }

                string TempdesFoot = string.Empty;
                contador = 0;
                int totalarchivos = listaArchivo.Count;

                if (listaArchivo.Count > 0)
                {
                    TempdesFoot = "[";
                    foreach (var item in listaArchivo)
                    {
                        item.NombreArchivoOriginal = item.NombreArchivoOriginal.Replace("#", "%23");
                        contador++;
                        if (contador < totalarchivos)
                        {
                            TempdesFoot += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"},";
                        }
                        else
                        {
                            TempdesFoot += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"}";
                        }
                    }
                    TempdesFoot += "]";
                    detparfoot = TempdesFoot;
                }

                if (parfoot == "[]") { parfoot = ""; }
                if (detparfoot == "[]") { detparfoot = ""; }

                foreach (var item in listaArchivo)
                {
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, item.NombreArchivo), item.bytearchivo);
                }
            }
            catch (Exception ex)
            {
                return detparfoot;
            }
            return detparfoot;
        }
    }   
}