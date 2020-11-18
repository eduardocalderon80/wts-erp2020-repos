using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Contabilidad
{
    public class CertificadoCTS
    {
        public int IdDetallePeriodo { get; set; }
        public int IdDocumento { get; set; }
        public string Documento { get; set; }
        public int IdPeriodo { get; set; }
        public int IdCertificadoCTS { get; set; }
        public int archivoPDF { get; set; }
        public string Mes { get; set; }
        public string Anio { get; set; }

        public string Codigo { get; set; }
        public string Trabajador { get; set; }
        public string Sexo { get; set; }
        public string Cargo { get; set; }
        public string Area { get; set; }
        public string Seccion { get; set; }
        public string FechaIngreso { get; set; }
        public string FechaCese { get; set; }
        public string FechaDeposito { get; set; }
        public string PeriodoLiquidar { set; get; }
        public string NumeroMes { set; get; }
        public string NumeroDias { set; get; }
        public string SueldoBase { set; get; }
        public string Banco { set; get; }
        public string CuentaBancaria { set; get; }
        public string AsignacionFamiliar { set; get; }
        public string AFP { set; get; }
        public string HE { set; get; }
        public string HE135 { set; get; }
        public string HEDoble { set; get; }
        public string ImpComisiones { set; get; }
        public string Gratificacion { set; get; }
        public string ImpRefrigerio { set; get; }
        public string ImpBonificacion { set; get; }
        public string Otros { set; get; }
        public string ImpRemuneracion { set; get; }
        public string ImpCTS { set; get; }
        public string TipoCambio { set; get; }
        public string PrimaTextil { set; get; }

        public string nombrePDF { set; get; }
        public string DownloadBoleta { set; get; }
        public string Habilitado { set; get; }


    }
}
