using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Laboratorio
{
    public class SolicitudPartida
    {
        public int idsolicitudpartida { get; set; }
        public string codigo { get; set; }
        public int contador { get; set; }
        public DateTime fechasolicitudpartida { get; set; }
        public int idfabrica { get; set; }
        public int idtintoreria { get; set; }
        public int idcolor { get; set; }
        public int idfamilia { get; set; }
        public string partida { get; set; }
        public int tipoorigensolicitud { get; set; }
        public int idcliente { get; set; }
        public int idestilo { get; set; }
        public int idpo { get; set; }
        public int idtela { get; set; }
        public string codigotela { get; set; }
        public string descripciontela { get; set; }
        public string titulotela { get; set; }
        public string composicionporcentajetela { get; set; }
        public decimal densidad { get; set; }
        public int lavado { get; set; }
        public int articulollevacomplementomismocolor { get; set; }
        public string comentario { get; set; }
        public string estado { get; set; }
        public int idusuariosolicitante { get; set; }
        public int idusuarioenviador { get; set; }
        public int idusuariorecibe { get; set; }
        public int idusuarioaprobador { get; set; }
        public int idusuariooperador { get; set; }
        public int idusuariocierre { get; set; }
        public DateTime fechaenviada { get; set; }
        public DateTime fecharecibida { get; set; }
        public DateTime fechaaprobadorechazado { get; set; }
        public DateTime fechainicio { get; set; }
        public DateTime fechafin { get; set; }

        public string strfechaenviada { get; set; }
        public string strfecharecibida { get; set; }
        public string strfechaaprobadorechazado { get; set; }
        public string strfechainicio { get; set; }
        public string strfechafin { get; set; }

        public string comentarioaprobadorechazado { get; set; }
        public int activo { get; set; }
        public int idsolicitudpadre { get; set; }
        public int tipopartida { get; set; }
        public int tienecodigotela { get; set; }
        public int tiporeproceso { get; set; }
        public DateTime fechaactualizacion { get; set; }
        public decimal densidadestandard { get; set; }
        public int formatoreportetecnico { get; set; }
        public int estadoenviosolicitudgenerarcodgotela { get; set; }

        // DATOS ADICIONALES
        public string nombreproveedor { get; set; }
        public string reportetecnico { get; set; }
        public string partidaestado { get; set; }
        public string nombre_estado { get; set; }
    }
}
