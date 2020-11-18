using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.PackingList
{
    public class bePackingListHeader
    {
        public int IdPackingList { get; set; }
        public string NumeroPackingList { get; set; }
        public string Cod_Cliente { get; set; }
        public string Cod_fabrica { get; set; }
        public string Cod_Empresa { get; set; }
        public string Cod_Destino { get; set; }
        public string FechaDespacho { get; set; }

        //Agregados
        public string Nom_Cliente { get; set; }
        public string Nom_Fabrica { get; set; }
        public string Nom_Destino { get; set; }

        public string FechaIni { get; set; }
        public string FechaFin { get; set; }

        public int TotalCantidadDespachada { get; set; }

        public string TBC_BL_HAWBL { get; set; }
        //Agregados 2
        public string SerieFactura { get; set; }
        public string NumeroFactura { get; set; }
        public string FechaFactura { get; set; }
        public decimal ImporteFactura { get; set; }
        public string NumeroGuia { get; set; }
        public string Fecha_BL_HAWBL { get; set; }
        public string CodigoUsuario { get; set; }
        public string PC { get; set; }
        public string DireccionFabrica { get; set; }

        //Agregados 3
        public string DescripcionFactura { get; set; }

        //Agregados 4
        public decimal ImporteFactura_Fisica { get; set; } // 09-30-2015
        public string SerieCMDM { get; set; }
        public string NumeroCMDM { get; set; }
        public decimal MontoCMDM { get; set; }
        public string TipoCMDM { get; set; }
        public string ConceptoCMDM { get; set; }

        //Agregado 5
        public string tablaCMDM { get; set; }
        public string tienedi { get; set; }

        //Agregado By Ricky
        public string Shipped_Date { get; set; }
        public List<bePackingListDetalle> Lote { get; set; }
        public List<bePackingListDetalleSKU> SKU { get; set; }
        //agregado por LA
        public string NumPackingList { get; set; }
        public int MasDespachos { get; set; }
    }
}
