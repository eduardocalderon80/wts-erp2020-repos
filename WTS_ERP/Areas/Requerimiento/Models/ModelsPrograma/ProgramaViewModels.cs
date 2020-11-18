using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WTS_ERP.Areas.Requerimiento.Models;
using WTS_ERP.Areas.Maestra.Models;
using System.ComponentModel.DataAnnotations;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    /// <summary>
    /// PARA INSERTAR Y EDITAR
    /// </summary>
    public class ProgramaViewModels : Programa
    {
        public List<ClienteMarca> ListaClienteMarca { get; set; }
        public List<ClienteTemporada> ListaClienteTemporada { get; set; }
        public List<ClienteDivision> ListaClienteDivision { get; set; }
        public List<Catalogo> ListaCatalogo { get; set; }

        
        public int IdPersonal { get; set; }
        public int IdGrupoPersonal { get; set; }

        public string Accion { get; set; }

        public string NombreMarca { get; set; }
        
        public string NombreTemporada { get; set; }
        
        public string NombreDivision { get; set; }
        
        public string NombreCatalogo_Estado { get; set; }

        public string NombreUsuario { get; set; }
    }
}