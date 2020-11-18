using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.PackingList
{
    public class bePackingListDetalleSKU
    {
        public string Cod_PurOrd { get; set; }
        public string Cod_EstCli { get; set; }
        public string Cod_LotPurOrd { get; set; }
        public string Cod_ColorCliente { get; set; }
        public string Cod_Talla { get; set; }
        public int Cant_Requerida { get; set; }
        public int Cant_Despachada { get; set; }
        public bool Relacionado { get; set; }
    }
}
