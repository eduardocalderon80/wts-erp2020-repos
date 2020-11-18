using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory
{
    public class beDestino
    {
        private string _Cod_Destino;
        private string _Des_Destino;
        private string _Cod_Direccion;
        private string _Des_Direccion;
        private string _Lineas_Direccion;
        private string _cod_ciudad = string.Empty;

        public string Cod_Destino
        {
            get { return _Cod_Destino; }
            set { _Cod_Destino = value; }
        }

        public string Des_Destino
        {
            get { return _Des_Destino; }
            set { _Des_Destino = value; }
        }

        public string Cod_Direccion
        {
            get { return _Cod_Direccion; }
            set { _Cod_Direccion = value; }
        }

        public string Des_Direccion
        {
            get { return _Des_Direccion; }
            set { _Des_Direccion = value; }
        }

        public string Lineas_Direccion
        {
            get { return _Lineas_Direccion; }
            set { _Lineas_Direccion = value; }
        }

        public string cod_ciudad
        {
            get { return _cod_ciudad; }
            set { _cod_ciudad = value; }
        }
    }
}
