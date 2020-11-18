using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using System.ComponentModel.DataAnnotations;

namespace BE_ERP.PortalFactory.PackingList
{

    public class bePackingListDetalleCarton
    {
        public int IdPackingList { get; set; }
        public int IdPackingListDetalle { get; set; }
        
        public string CodEmpresa { get; set; }
        
        public string CodCliente { get; set; }
       
        public string CodPurord { get; set; }
       
        public string CodLotest { get; set; }
        
        public string CodEstilo { get; set; }
        
        public string CodEstiloUPC { get; set; }
        
        public string CodFabrica { get; set; }
        
        public string CodColor { get; set; }
        
        public string CodTalla { get; set; }
        public int Ratio { get; set; }
        public int From { get; set; }
        public int To { get; set; }
        public decimal NetWeight { get; set; }
        public decimal GrossWeight { get; set; }
        public int TotalBox { get; set; }
        public int BOX { get; set; }
        
        public string UPC_Code { get; set; }
      
        public string DCNumber { get; set; }
       
        public string Comentario { get; set; }
        public int QtyReq { get; set; }
    }

}
