using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.PackingList
{
    public class bePackingListDetalle : bePackingListHeader
    {
        // Add Ricky 18-11-2015
        public List<bePackingListDetalleCarton> Carton { get; set; }

        public List<bePackingListDetalleSKU> SKU { get; set; }
        private int _cierre = 0;
        private int _retirado = 0;
        private decimal _precioFabrica = 0;
        private decimal _precioCliente = 0;
        private decimal _importe = 0;
        private int _balance = 0;
        private decimal _porcentajeActual = 0;
        private int _porcentajeCliente = 0;

        //public int IdPackingList { get; set; }
        public int IdPackingListDetalle { get; set; }

        public string CodEmpresa { get; set; }
        public string CodCliente { get; set; }
        public string CodPurord { get; set; }
        public string CodLotest { get; set; }
        public string CodEstilo { get; set; }
        public string CodFabrica { get; set; }
        public string CodigoDestino { get; set; }

        public string Tienda { get; set; }
        public string Hts { get; set; }

        public bool Mapped { get; set; }

        public string StrMapped
        {
            get
            {
                if (Mapped)
                {
                    return "Yes";
                }
                else
                {
                    return "No";
                }
            }
        }

        public int CantidadRequerida { get; set; }
        public int CantidadDespachadas { get; set; }
        public int CantidadxDespachar { get; set; }

        public int CantidadDespachadas_PkList { get; set; }

        public int cierre
        {
            get { return _cierre; }
            set { _cierre = value; }
        }

        public int retirado
        {
            get { return _retirado; }
            set { _retirado = value; }
        }

        public decimal PrecioFabrica
        {
            get { return _precioFabrica; }
            set { _precioFabrica = value; }
        }

        public decimal Importe
        {
            get { return CantidadDespachadas * PrecioFabrica; }
            set { _importe = value; }
        }

        public string Cod_PagEmb { get; set; }  // AIR, SEA
        public string Des_Estilo { get; set; }

        public decimal PrecioCliente
        {
            get { return _precioCliente; }
            set { _precioCliente = value; }
        }

        public string Color { get; set; }
        public string Talla { get; set; }

        public int idPoLotest { get; set; }

        public int Balance
        {
            get { return _balance; }
            set { _balance = value; }
        }

        public int PorcentajeCliente
        {
            get { return _porcentajeCliente; }
            set { _porcentajeCliente = value; }
        }

        public decimal PorcentajeActual
        {
            get { return _porcentajeActual; }
            set { _porcentajeActual = value; }
        }

        public string FechaRegistro { get; set; }
        public decimal ImporteFC_Edit { get; set; }
        //Adicional
        public decimal Importe_CMDM { get; set; }

        // Add 31-07-2016
        //public bool ClienteEDI
        //{
        //    get
        //    {
        //        if (Nom_Cliente.Trim() == "SOFT SURROUNDINGS")
        //        {
        //            return true;
        //        }
        //        return false;
        //    }
        //}

        public string edi { get; set; }    
        public int CantidadCarrito { get; set; }
        public int CantidadCarritoDES { get; set; }

    }
}
