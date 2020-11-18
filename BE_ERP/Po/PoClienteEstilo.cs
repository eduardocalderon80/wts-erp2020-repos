using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class PoClienteEstilo
    {
        public int IdPoClienteEstilo { get; set; }
        public int IdPoCliente { get; set; }
        public int IdPo { get; set; }
        public int? IdEstilo { get; set; }
        public int IdProveedor { get; set; }
        public int IdTipoPrecio { get; set; }
        public int IdFlete { get; set; }
        public int IdFormaEnvio { get; set; }
        public int IdClienteDireccion { get; set; }
        public int IdDivisionCliente { get; set; }
        public int IdDivisionAsociado { get; set; }
        public int IdEstadoPoCliente { get; set; }
        public int IdEstadoRegistro { get; set; }
        public DateTime FechaDespachoFabrica { get; set; }
        public DateTime FechaDespachoCliente { get; set; }
        public DateTime FechaEntregaCliente { get; set; }
        public DateTime? FechaDespachoFabricaUPT { get; set; }
        public DateTime? FechaDespachoClienteUPT { get; set; }
        public DateTime? FechaEntregaClienteUPT { get; set; }
        public decimal Monto { get; set; }
        public decimal Costo { get; set; }
        public decimal MontoLST { get; set; }
        public decimal CostoLST { get; set; }
        public decimal PrecioCliente { get; set; }
        public decimal PrecioFabrica { get; set; }
        public decimal PrecioClienteUPT { get; set; }
        public decimal PrecioFabricaUPT { get; set; }
        public decimal CantidadRequerida { get; set; }
        public decimal CantidadDespachada { get; set; }
        public decimal CantidadRequeridaLST { get; set; }
        public string ComentarioFabrica { get; set; }
        public string InstruccionEmpaque { get; set; }
        public string Hts { get; set; }

        public int IdTipoPo { get; set; }
        public int EstadoPo { get; set; }
        public int SaldoCantidadRequerida { get; set; }
        public int CartonLabel { get; set; }

        public string NombreTipoPoClienteEstilo { get; set; }

        public List<PoClienteEstiloTallaColor> PoClienteEstiloTallaColor { get; set; }

        public List<PoClienteEstiloDestino> PoClienteEstiloDestino { get; set; }

        // CAMPOS ADICIONALES
        public string DescripcionEstilo { get; set; }
        public string CodigoEstilo { get; set; }

        public string NombreProveedor { get; set; }

        public string FechaDespachoFabricaCadena { get; set; }
        public string FechaDespachoClienteCadena { get; set; }
        public string FechaEntregaClienteCadena { get; set; }
        public string FechaDespachoFabricaUPTCadena { get; set; }
        public string FechaDespachoClienteUPTCadena { get; set; }
        public string FechaEntregaClienteUPTCadena { get; set; }

        public int RegistroExistente { get; set; }
        public string CodigoPo { get; set; }
        public string CodigoPoCliente { get; set; }
        public DateTime ArrivalPO { get; set; }
        public string NombreCliente { get; set; }
        public decimal Margen { get; set; }
        public string NombreTipoPo { get; set; }
        public string CodigoTela { get; set; }
        public string NombreTela { get; set; }
        public string DescripcionFormaEnvio { get; set; }
        public string ProveedorDireccion { get; set; }
        public string ProveedorTelefono1 { get; set; }
        public string ImagenNombre { get; set; }  // IMAGEN DEL ESTILO

        public int TotalItems { get; set; }
        public int ItemsPorPagina { get; set; }
    }
}
