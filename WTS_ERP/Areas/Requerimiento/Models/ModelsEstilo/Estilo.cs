using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class Estilo
    {
        public int IdEstilo { get; set; }

        [Required]
        public string CodigoEstilo { get; set; }

        public string NombreEstilo { get; set; }

        [Required]
        public string Descripcion { get; set; }

        public string ImagenOriginal { get; set; }

        public string ImagenNombre { get; set; }

        public string ImagenWebNombre { get; set; }

        public int Version { get; set; }

        public int Original { get; set; }

        public int IDEMPRESA { get; set; }

        public int IdCliente { get; set; }

        public int IdEstiloPadre { get; set; }

        public DateTime FechaCreacion { get; set; }

        public DateTime FechaActualizacion { get; set; }

        public string UsuarioCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }

        public string Ip { get; set; }

        public string HostName { get; set; }

        public int Eliminado { get; set; }

        public string TelaOpcional { get; set; }

        public int IdClienteTemporada { get; set; }

        public int IdClienteDivision { get; set; }

        [Required]
        [Range(1, 100000)]
        public int IdPrograma { get; set; }

        [Required]
        public int Status { get; set; }

        public int minutaje { get; set; }

        [Required]
        [Range(1, 10000)]
        public int IdProveedor { get; set; }

        public string ImageFabricCombo { get; set; }

        public string DescriptionFabricCombo { get; set; }

        public string FitStatus { get; set; }

        public int IdClienteAnterior { get; set; }

        public string EtapaInicio { get; set; }

        public string EtapaFinal { get; set; }

        public string EtapasJson { get; set; }

        public int TipoSolicitudEstilo { get; set; }

        public string Notas { get; set; }

        [Required]
        [Range(1, 10000)]
        public int IdTipoProveedor { get; set; }

        public int CalificacionNivelDificultad { get; set; }

        public int CalificacionFabrica { get; set; }

        public int TipoSolicitudTela { get; set; }

        public int IdTelaPrincipal { get; set; }
        public int TipoSolicitudEstilo_IdCatalogo_EsReorden { get; set; }

        /*Jacob*/
        public string TipoTela { get; set; }
        public string CodigoTela { get; set; }
        public string DescripcionTela { get; set; }
        public string FechaTelaDisponible { get; set; }
    }
}