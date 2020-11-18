using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class ParametrosReporteExcel
    {
        private string _NombreArchivo = "Reporte";
        private string _NombreHoja = "Hoja1";
        private char _DelimitadorFila = '^';
        private char _DelimitadorHoja = '|';
        private char _DelimitadorCampo = '¬';
        private char _DelimitadorNombre = ',';
        private bool _ContieneEstructura = false;

        public ParametrosReporteExcel()
        {

        }

        public string NombreArchivo
        {
            get { return _NombreArchivo; }
            set { _NombreArchivo = value; }
        }
        public string NombreHoja
        {
            get { return _NombreHoja; }
            set { _NombreHoja = value; }
        }

        public string DataCSV { get; set; }
        public char DelimitadorFila
        {
            get { return _DelimitadorFila; }
            set { _DelimitadorFila = value; }
        }
        public char DelimitadorHoja
        {
            get { return _DelimitadorHoja; }
            set { _DelimitadorHoja = value; }
        }
        public char DelimitadorCampo
        {
            get { return _DelimitadorCampo; }
            set { _DelimitadorCampo = value; }
        }
        public bool ContieneEstructura
        {
            get { return _ContieneEstructura; }
            set { _ContieneEstructura = value; }
        }
        
         public char DelimitadorNombre
        {
            get { return _DelimitadorNombre; }
            set { _DelimitadorNombre = value; }
        }
    }
}
