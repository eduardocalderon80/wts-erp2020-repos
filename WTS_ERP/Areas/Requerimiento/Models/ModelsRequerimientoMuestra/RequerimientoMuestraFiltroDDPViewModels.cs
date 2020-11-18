using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class RequerimientoMuestraFiltroDDPViewModels
    {
        public int IdEstadoEstilo_Status { get; set; }
        public int IdEstadoActividad_IdCatalogo { get; set; }
        public string IdsClientes { get; set; }
        public int IdClienteMarca { get; set; }
        public int IdClienteDivision { get; set; }
        public int IdClienteTemporada { get; set; }
		public int IdEstilo { get; set; }
		public int IdTipoMuestraxCliente { get; set; }
		public int IdActividad { get; set; }
		public int IdTipoProveedor { get; set; }
		public int IdProveedor { get; set; }
		public string IdsAnalistasResponsables { get; set; }
		public string FechaProgramadaInicio { get; set; }
		public string FechaProgramadaFin { get; set; }
        public string exportacionExcel { get; set; }
    }
}