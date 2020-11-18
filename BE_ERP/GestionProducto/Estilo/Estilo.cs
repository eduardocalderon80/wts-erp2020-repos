using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto
{
    public class Estilo
    {
        public string EstiloJSON { get; set; }
        public string CalloutJSON { get; set; }
        public string FabricJSON { get; set; }        
        public string TelasColorJSON { get; set; }
        public string ProcessJSON { get; set; }
        public string ArtworkJSON { get; set; }
        public string TrimJSON { get; set; }

        public string ProcessColorJSON { get; set; }
        public string ArtworkColorJSON { get; set; }
        public string TrimColorJSON { get; set; }
        public string ArtworkFileJSON { get; set; }        
        public string Usuario { get; set; }
        public string Empresa { get; set; }

        public string CalloutE { get; set; }
        public string FabricProcessE { get; set; }
        public string FabricProjectE { get; set; }
        public string FabricCodeE { get; set; }
        public string ProcessE { get; set; }
        public string ArtworkE { get; set; }
        public string TrimE { get; set; }
        public string ProcessColorE { get; set; }
        public string ArtworkColorE { get; set; }
        public string TrimColorE { get; set; }
        public string FabricProcess { get; set; }
        public string EstiloxComboJSON { get; set; }
        public string EstiloxComboColorJSON { get; set; }
        public string EstiloxFabricComboJSON { get; set; }
        public string EstiloxFabricComboColorJSON { get; set; }
        //
        public int idestilo { get; set; }
        public string codigoestilo { get; set; }
        public string nombreestilo { get; set; }
        public string descripcion { get; set; }
        public string imagenoriginal { get; set; }
        public string imagennombre { get; set; }
        public string imagenwebnombre { get; set; }
        public int version { get; set; }
        public int original { get; set; }
        public int idempresa { get; set; }
        public int idcliente { get; set; }
        public int idestilopadre { get; set; }
        public string telaopcional { get; set; }
        public int idclientetemporada { get; set; }
        public int idclientedivision { get; set; }
        public int idprograma { get; set; }
        public int status { get; set; }
        public int minutaje { get; set; }
        public int totalfilas_x_estilo { get; set; }
        public int indicecolumna_generalinfo_dondeempieza_apintar { get; set; }
        public string titulos_cabecera_generalinfo { get; set; }

        public string imagenfabriccombo { get; set; }
        public string descripcionfabriccombo { get; set; }
        public string datosfabriccombo { get; set; }

        public byte[] imagenbyte { get; set; }
        public string ColorJSON { get; set; }
        public string estilotechpack { get; set; }
    }
}
