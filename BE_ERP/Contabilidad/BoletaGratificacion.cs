using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Contabilidad
{
    public class BoletaGratificacion
    {
        public int IdDetallePeriodo { get; set; }
        public int IdDocumento { get; set; }
        public string Documento { get; set; }
        public int IdPeriodo { get; set; }
        public int IdBoletaGratificacion { get; set; }
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
        public string DiasTrabajados { get; set; }
        public string DiasVacaciones { get; set; }
        public string TotalDias { get; set; }
        public string AFP { get; set; }
        public string Sueldo { get; set; }
        public string TipoAsiento { get; set; }
        public string FechaCese { get; set; }
        public string CentroCosto { get; set; }
        public string Banco { get; set; }
        public string CuentaBancaria { get; set; }
        public string NO_DiasTrabajados { get; set; }
        public string Dominical { get; set; }
        public string Feriado { get; set; }
        public string DiasLibres { get; set; }
        public string HorasTrabajadas { get; set; }
        public string HESimples { get; set; }
        public string HESegundas { get; set; }
        public string HEDobles { get; set; }
        public string HorasNocturno { get; set; }
        public string HorasNocturnoFeriado { get; set; }
        public string HorasNocturnoSimple { get; set; }
        public string HorasNocturnoSegundas { get; set; }
        public string HorasNocturnoDobles { get; set; }
        public string DiasDescanzoMedico { get; set; }
        public string FeriadoDomingoLaborado { get; set; }
        public string DiasSubsidioEnfermedad { get; set; }
        public string DiasSubsidioMaternidad { get; set; }
        public string DiasSubsidioPaternidad { get; set; }
        public string DiasFalta { get; set; }
        public string HorasTardanza { get; set; }
        public string HorasDescuento { get; set; }
        public string DiasSuspencionPerfecta { get; set; }
        public string DVacaciones { get; set; }
        public string HEDomingoFeriadoSimple { get; set; }
        public string HEDomingoFeriadoSegundas { get; set; }
        public string HEDomingoFeriadoDobles { get; set; }
        public string LicenciaSinGoce { get; set; }
        public string LicenciaConGoce { get; set; }
        public string Suspension { get; set; }
        public string InicioVacaciones { get; set; }
        public string FinVacaciones { get; set; }
        public string NO_InicioVacaciones { get; set; }
        public string NO_FinVacaciones { get; set; }
        public string OtrosIngresos { get; set; }
        public string HE { get; set; }
        public string BonifExt { get; set; }
        public string Gratificacion { get; set; }
        public string AsignacionFamiliar { get; set; }
        public string TIngresos { get; set; }
        public string TDescuentos { get; set; }
        public string RetJudicial { get; set; }
        public string Adelanto { get; set; }
        public string DifPago { get; set; }
        public string TotalDescuentos { get; set; }
        public string NetoPagar { get; set; }
        public string TotalAportes { get; set; }
        public string carnetEssalud { get; set; }
        public string numCUSPP { get; set; }
        public string nombrePDF { get; set; }
        public string DownloadBoleta { get; set; }
        public string Habilitado { get; set; }

    }
}
