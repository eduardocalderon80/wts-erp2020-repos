using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Facturas
{
    public class FacturaFabrica
    {
        public int IdFacturaFabrica { get; set; }
        public int IdFabrica { get; set; }
        public int IdCliente { get; set; }
        public int IdDestino { get; set; }
        public string Serie { get; set; }
        public string Numero { get; set; }
        public DateTime FechaFactura { get; set; }
        public decimal ImporteFisico { get; set; }
        public decimal ImporteDebit { get; set; }
        public decimal ImporteCredit { get; }
        public decimal ImporteTotal { get; set; }
        public decimal ImporteTotalFactor { get; set; }

        // CAMPOS ADICIONALES: DATOS PARA EL REPORTE PDF
        public string numerofactura { get; set; }

        public string strfechafactura { get; set; }
        public string NombreCliente { get; set; }
        public string NombreFabrica { get; set; }
        public string DireccionFabrica { get; set; }
        public string UsuarioActualizacion { get; set; }

        public List<FacturaFabricaDetalle> ListaFacturaFabricaDetalle { get; set; }
    }
}
