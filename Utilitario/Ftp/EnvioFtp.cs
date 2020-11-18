using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WinSCP;

namespace Utilitario.EnvioFtp
{
    public class EnvioFtp
    {
        public Boolean sendftp_file(string rutaOrigen, string ftp_ruta_destino, string extension, string strFtp)
        {
            Boolean valida = false;
            try
            {

                // return false;

                string[] _archivos = Directory.GetFiles(@rutaOrigen, "*."+ extension);

                for (Int32 a = 0; a < _archivos.Length; ++a)
                {
                    string _path_archivo = _archivos[a].ToString();
                    string _nombrearchivo = Path.GetFileNameWithoutExtension(@_path_archivo);
                    string _extension_archivo = Path.GetExtension(@_path_archivo);
                    string _file_path_destino = ftp_ruta_destino + "/" + _nombrearchivo + _extension_archivo;
                    Boolean valida_subida = enviarFtp(@_path_archivo, _file_path_destino,strFtp);
                    if (valida_subida)
                    {
                        if (File.Exists(@_path_archivo)) File.Delete(@_path_archivo);
                    }

                }
                valida = true;
            }
            catch (Exception)
            {
                valida = false;
            }
            return valida;
        }

        public bool enviarFtp (string file_origen, string file_destino, string nombreFtp)
        {
            bool valida_envio = false;
           

            try
            {

                SessionOptions sessionOptions = new SessionOptions {

                    Protocol = Protocol.Ftp,
                    //FtpSecure = FtpSecure.Explicit,
                    HostName = ConfigurationManager.AppSettings[nombreFtp+"_host"].ToString(),
                    UserName = ConfigurationManager.AppSettings[nombreFtp + "_user"].ToString(),
                    Password = ConfigurationManager.AppSettings[nombreFtp + "_password"].ToString(),
                    PortNumber = Int32.Parse((ConfigurationManager.AppSettings[nombreFtp + "_puerto"].ToString())),
                    //GiveUpSecurityAndAcceptAnySshHostKey = true,
                };

                using (Session session = new Session())
                {
                    session.Open(sessionOptions);
                    // Upload files
                    TransferOptions transferOptions = new TransferOptions();
                    transferOptions.FilePermissions = null; // This is default
                    transferOptions.PreserveTimestamp = false;
                    transferOptions.TransferMode = TransferMode.Binary;
                    TransferOperationResult transferResult;

                    transferResult =
                        session.PutFiles(file_origen, file_destino, false, transferOptions);

                    transferResult.Check();
                    valida_envio = true;
                    
                }
            }

            catch (Exception exc)
            {
                valida_envio = false;
            }
            return valida_envio;
        }
    }
}
