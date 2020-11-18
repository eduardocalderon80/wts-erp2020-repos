using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP;

namespace BE_ERP.PortalFactory.PackingList
{
    public class bePackingList
    {
        //Principal
        public bePackingListHeader bePackingListEncabezado { get; set; }
        public List<bePackingListDetalle> listaPackingListDetalle { get; set; }
        public List<bePackingListDetalle> listaPackingListDetalle_Filtro { get; set; }

        //Add
        public List<bePackingListDetalle> listaPackingList_Detalle_Carrito { get; set; }
        public List<bePackingListDetalle> listaPackingList_Detalle_FiltroCarrito { get; set; }

        //Mant
        public List<beCliente> listaCliente { get; set; }
        public List<beFabrica> listaFabrica { get; set; }
        public List<beDestino> listaDestino { get; set; }

        // add by ricky 27-07-2016
        public List<beCarton> Carton { get; set; }
        public List<beCarton> CartonDetail { get; set; }
       
    }
}
