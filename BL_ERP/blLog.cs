using System;
using System.IO;
using System.Configuration;
using System.Reflection;
using BE_ERP;
using System.Web;

namespace BL_ERP
{
    public class blLog
    {
        private string Archivo { get; set; }
        private string rutaLog;
        private beUser Usuario = new beUser();
        
        public blLog()
        {   
            DateTime nowDateTime = DateTime.Now;
            string sMonth = nowDateTime.Month.ToString().PadLeft(2, '0');
            string sDay = nowDateTime.Day.ToString().PadLeft(2, '0');
            rutaLog = ConfigurationManager.AppSettings["rutaLog"].ToString();
            Archivo = string.Format("{0}Log_{1}_{2}_{3}.txt", rutaLog, DateTime.Now.Year, sMonth, sDay);
        }
        public void GrabarArchivoLog(Exception ex)
        {
            Usuario = HttpContext.Current.Session["Usuario"] != null ? HttpContext.Current.Session["Usuario"] as beUser : null;
            if (Usuario == null) {
                Usuario = new beUser();
                Usuario.CodUsuario = "Not User Session";
            }
            beLog obeLogArchivo = new beLog
            {
                LogArchivo = Archivo,
                LogUsuario = Usuario.CodUsuario,
                LogAplicacion = "WTS_ERP",
                LogMensajeError = ex.Message,
                LogDetalleError = ex.StackTrace,
                LogFechaHora = DateTime.Now
            };
            grabarArchivoLog(obeLogArchivo);
        }

        private static void grabarArchivoLog(beLog obeLog)
        {
            using (StreamWriter file = new StreamWriter(obeLog.LogArchivo, true))
            {
                PropertyInfo[] propiedades = obeLog.GetType().GetProperties();
                file.WriteLine(DateTime.Now);
                for (int i = 0; i < propiedades.Length; i++)
                {
                    file.WriteLine(propiedades[i].Name + "\t" + " : " + "\t" + propiedades[i].GetValue(obeLog, null));
                }
                string lineas = new string('=', 100);
                file.WriteLine(lineas);
            }
        }
    }
}
