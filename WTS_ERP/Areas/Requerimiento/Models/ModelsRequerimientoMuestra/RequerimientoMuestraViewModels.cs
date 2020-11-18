using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class RequerimientoMuestraViewModels : RequerimientoMuestra
    {
        public string IdReqTemporalGuid { get; set; }
        public string FechaAprobacionRechazo { get; set; }
        public int IdEstado { get; set; }
        public string NombreEstado { get; set; }

        //// SE AGREGO PARA EL REPORTE DE PO SAMPLE
        public string Cadena_ExFactoryUpdate { get; set; }
        public string Cadena_FechaInDC { get; set; }
        public string DatosEstiloJSON { get; set; }
        public string DatosClienteDireccionRequerimientoJSON { get; set; }
    }
}