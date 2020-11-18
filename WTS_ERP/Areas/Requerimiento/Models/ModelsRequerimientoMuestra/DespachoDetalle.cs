using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class DespachoDetalle
    {
		public int IdDespachoDetalle { get; set; }

		public int IdRequerimientoDetalle { get; set; }

        [Required]
        //[Range(1, 1000000)]
		public int Cantidad { get; set; }

        [Required]
        //[Range(1, 1000000)]
		public int CantidadCM { get; set; }

		public string FechaCreacion { get; set; }

		public string FechaActualizacion { get; set; }

		public string UsuarioCreacion { get; set; }

		public string UsuarioActualizacion { get; set; }

		public string Ip { get; set; }

		public string HostName { get; set; }

		public int Eliminado { get; set; }

		public int ConteoRechazoInterno { get; set; }

		/// <summary>
        /// FECHADESPACHO
        /// </summary>
        [Required]
		public string ActualDate { get; set; }

		public int Cantidad_Saldo { get; set; }

		public int CantidadCM_Saldo { get; set; }

        public string EsCopia { get; set; }

        public string EsCopiaUltima { get; set; }
    }
}