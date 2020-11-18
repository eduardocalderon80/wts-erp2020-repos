using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class SolicitudATXDetalle
    {
        public int IdDetalle { get; set; }
        public int IdMateriaPrima { get; set; }
        public int PorcentajeComposicion { get; set; }
    }
}