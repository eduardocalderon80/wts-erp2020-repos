using System.Configuration;


namespace BL_ERP
{
  public  class Util
    {
        private static string auditoria;
        private static string seguridad;
        private static string intranet;
        private static string rutaupload;
        private static string erp;
        private static string seguridaderp;
        private static string edi;

        public static string Default
        {
            get
            {
                erp = ConfigurationManager.ConnectionStrings["cnERP"].ConnectionString;
                return erp;
            }
            
        }

        public static string QC
        {
            get {
                auditoria = ConfigurationManager.ConnectionStrings["cnQC"].ConnectionString;
                return auditoria;
            }
        }

        public static string Intranet
        {
            get
            {
                intranet = ConfigurationManager.ConnectionStrings["cnIntranet"].ConnectionString;
                return intranet;
            }
        }

        public static string Seguridad
        {
            get
            {
                seguridad = ConfigurationManager.ConnectionStrings["cnSeguridad"].ConnectionString;
                return seguridad;

            }
        }

        public static string ERP
        {
            get
            {
                erp = ConfigurationManager.ConnectionStrings["cnERP"].ConnectionString;
                return erp;
            }
        }

        public static string SeguridadERP
        {
            get
            {
                seguridaderp = ConfigurationManager.ConnectionStrings["cnERPSeguridad"].ConnectionString;
                return seguridaderp;
            }
        }

        public static string EDI
        {
            get
            {
                edi = ConfigurationManager.ConnectionStrings["cnEDI"].ConnectionString;
                return edi;
            }
        }


        public static string RutaUpload
        {
            get
            {
                rutaupload = ConfigurationManager.AppSettings["rutaFileServer"].ToString();
                return rutaupload;
            }
        }



    }
}
