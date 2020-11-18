// :edu 20171017
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class PoCliente
    {
        public PoCliente()
        {
            //PoClienteEstilo = new List<Entidades.PoClienteEstilo>();
            PoClienteProducto = new List<PoClienteProducto>();
        }

        public int IdPoCliente { get; set; }
        public int IdPo { get; set; }
        public DateTime ArrivalPO { get; set; }
        public string Codigo { get; set; }
        public string CodigoLST { get; set; }
        public decimal Monto { get; set; }
        public decimal Costo { get; set; }
        public List<PoClienteEstilo> PoClienteEstilo { get; set; }
        public List<PoClienteProducto> PoClienteProducto { get; set; }

        public decimal CantidadRequerida { get; set; }
        public decimal CantidadRequeridaLST { get; set; }
        public decimal SaldoCantidadRequerida { get; set; }
        public int @IdTipoPo { get; set; } // 1 = BUY; 2 = PO
        public int @EstadoPo { get; set; }

        // CAMPOS ADICIONALES
        public int RegistroExistente { get; set; }
        public string ArrivalPOCadena { get; set; }
        public int IdEstilo { get; set; }
        public int Tipo { get; set; }  // 1 = (GARMENT)ESTILO; 2 = (OTHERS)PRODUCTO
        public string NombreTipoPo_BuyPo { get; set; }

        public int IdPoClienteEstilo { get; set; }
        public int IdPoClienteEstiloDestino { get; set; }
    }
}
