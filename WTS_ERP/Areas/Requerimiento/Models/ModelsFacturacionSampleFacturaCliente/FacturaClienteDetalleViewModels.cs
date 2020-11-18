using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class FacturaClienteDetalleViewModels : FacturaClienteDetalle
    {
        public string NombreClienteColor { get; set; }
        /// <summary>
        /// SE AGREGO PARA EL REPORTE DE PO
        /// </summary>
        public string CodigoEstilo { get; set; }
        public string NombreTipoMuestra { get; set; }
        public int Version { get; set; }
        public int Cantidad { get; set; }
        public int CantidadCM { get; set; }
        public string NombreClienteTalla { get; set; }
        public int IdClienteTalla { get; set; }
        public int IdClienteColor { get; set; }
    }
}