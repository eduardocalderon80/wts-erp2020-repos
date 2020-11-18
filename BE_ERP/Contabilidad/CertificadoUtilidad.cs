using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Contabilidad
{
    public class CertificadoUtilidad
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
        public string Banco { get; set; }
        public string CuentaBancaria { get; set; }
        public string UtilidadDistribuir { get; set; }
        public string UtilidadAnual { get; set; }
        public string PorcentajeDistribuir { get; set; }
        public string TotalDiasTrabajadores { get; set; }
        public string DiasTrabajados { get; set; }
        public string ImpDiasTrabajados { get; set; }
        public string TotalParticipacion { get; set; }
        public string TotalRemuneracionTrab { get; set; }
        public string TotalRemuneracion { get; set; }
        public string PorcentajeBasico { get; set; }
        public string Distribucion { get; set; }
        public string UtilidadTotal { get; set; }
        public string QuintaCategoria { get; set; }
        public string OtrosDecuento { get; set; }
        public string TotalPagar { get; set; }
        public string Estado { get; set; }

        public string nombrePDF { set; get; }
        public string DownloadBoleta { set; get; }
        public string Habilitado { set; get; }

    }
}
