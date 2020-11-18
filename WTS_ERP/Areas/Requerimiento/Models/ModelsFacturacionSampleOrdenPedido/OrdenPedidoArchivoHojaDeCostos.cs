using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class OrdenPedidoArchivoHojaDeCostos
    {
        public int IdOrdenPedidoArchivoHojaDeCostos { get; set; }
        public int IdOrdenPedido { get; set; }
        public string NombreArchivoOriginal { get; set; }
        public string NombreArchivoGenerado { get; set; }
        public string UsuarioCreacion { get; set; }
        public string UsuarioActualizacion { get; set; }
        public string FechaCreacion { get; set; }
        public string FechaActualizacion { get; set; }
        public string Ip { get; set; }
        public string HostName { get; set; }
        public int Eliminado { get; set; }
    }
}