using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory
{
    public class beFabrica
    {


        private string _Cod_Fabrica = string.Empty;
        private string _Nom_Fabrica = string.Empty;

        public string Cod_Fabrica
        {
            get { return _Cod_Fabrica; }
            set { _Cod_Fabrica = value; }
        }

        public string Nom_Fabrica
        {
            get { return _Nom_Fabrica; }
            set { _Nom_Fabrica = value; }
        }

    }
}
