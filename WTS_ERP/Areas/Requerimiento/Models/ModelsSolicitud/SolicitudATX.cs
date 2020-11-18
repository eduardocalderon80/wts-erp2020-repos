using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class SolicitudATX
    {
        public string usuariocreacion { get; set; }
        public int IdUsuario { get; set; }
        public int IdPersonal { get; set; }
        public int IdCliente { get; set; }
        public string Estructura { get; set; }
        public int IdProveedorFabrica { get; set; }
        public string Titulo { get; set; }
        public string Densidad { get; set; }
        public string LavadoPanos { get; set; }
        public string Color { get; set; }
        public string Partida { get; set; }
        public string TipoMuestra { get; set; }
        public string Comentario { get; set; }
        public string CodigoTela { get; set; }
        public int Anio { get; set; }
        public int Correlativo { get; set; }
        public string NombreArchivo { get; set; }
        public string NombreWeb { get; set; }
        public int Evaluacion { get; set; }
        public int IdMotivoSolicitud { get; set; }
        public string codigotelaproveedor { get; set; }
        public string codigoreporte { get; set; }
        public string codigosolicitudestandar { get; set; }
        public string codigoreporteanalisistextilexistente { get; set; }
        public int idsolicituddesarrollotela { get; set; }
        public int anio_atx_estandar { get; set; }
        public int contador_atx_estandar { get; set; }
        public int idsolicituddetalledesarrollotela { get; set; }
        public string proveedorfabrica { get; set; }
        public int desarrollotelarequiereanalisislaboratorio { get; set; }
    }
}