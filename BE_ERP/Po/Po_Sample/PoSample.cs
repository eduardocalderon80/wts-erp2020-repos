using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class PoSample : Base
    {
        public int IdPo { get; set; }
        public string Codigo { get; set; }
        public int IdEmpresa { get; set; }
        
        public int IdCliente { get; set; }
        public int IdClienteTemporada { get; set; }
        //public decimal Monto { get; set; }
        //public decimal Costo { get; set; }

        public List<PoClienteSample> PoCliente { get; set; }

        // CAMPOS ADICIONALES
        public List<PoClienteEstiloSample> ListaPoClienteEstilo { get; set; }
        public List<PoClienteEstiloDestinoTallaColorSample> ListaPoClienteEstiloDestinoTallaColor { get; set; }

        public string CadenaPoCliente { get; set; }
        public string CadenaPoClienteEstilo { get; set; }
        public string CadenaPoClienteEstiloTallaColor { get; set; }

        public string accion { get; set; }
        public int IdPoClienteEstiloPredeterminado { get; set; }
        
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string TerminoPagoDescripcion { get; set; }
        //public List<PoClienteEstilo> PoClienteEstilo { get; set; }
        //public List<PoClienteProducto> PoClienteProducto { get; set; }
        //public List<PoClienteProductoDestino> PoClienteProductoDestino { get; set; }
        //public List<PoClienteEstiloTallaColor> PoClienteEstiloTallaColor { get; set; }
        public List<PoClienteEstiloDestinoSample> PoClienteEstiloDestino { get; set; }
        public List<PoClienteEstiloDestinoTallaColorSample> PoClienteEstiloDestinoTallaColor { get; set; }
        public int FlgSeIncluyeContramuestraSinCobro { get; set; }
    }
}
