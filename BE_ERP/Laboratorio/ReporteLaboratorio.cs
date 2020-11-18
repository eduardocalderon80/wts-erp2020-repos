using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Laboratorio
{
    public class ReporteLaboratorio
    {

        public string direccion { get; set; }
        public string numero_reporte { get; set; }
        public string reporteBase { get; set; }
        public string reporteResumen { get; set; }
        public string reporteDetalle { get; set; }
        public string reporteKeys { get; set; }
        public string reporteConditions { get; set; }


        public string dataPartida { get; set; }

        public string ReporteTecnico { get; set; }
        public string NumeroPartida { get; set; }
        public string FechaIngreso { get; set; }
        public string FechaEntrega{ get; set; }
        public string NombreColor { get; set; }
        public string CodigoTela { get; set; }
        public string NombreCliente { get; set; }
        public string NombreTintoreria { get; set; }
        public string NombreFabrica { get; set; }
        public string TipoPrueba { get; set; }


        public string Mill { get; set; }
        public string Batch { get; set; }
        public string PO { get; set; }
        public string Style { get; set; }
        public string Consesion { get; set; }

        public string Email_Subject { get; set; }
        public string Email_Body { get; set; }

        //Luis
        public string CodigoCliente { get; set; }
        public string CodigoFabrica { get; set; }
        public string CodigoTintoreria { get; set; }
        public string CodigoTemporada { get; set; }
        public string NombreTemporada { get; set; }
        public string DescripcionTela { get; set; }
        public string GramajeAcabado { get; set; }
        public string Material { get; set; }
        public string Proceso { get; set; }
        public string Lavado { get; set; }
        public string Complemento { get; set; }
        public string InstruccionCuidadoSolicitud { get; set; }
        public string ComentarioSolicitud { get; set; }
        public string CodigoColorTintoreria { get; set; }
        
        public string Estilos { get; set; }
        public string POS { get; set; }
        public string ReportesTecnicos { get; set; }


        public int CodigoPartida { get; set; }
        public string StatusPartida { get; set; }


        public string ComentarioColor { get; set; }
        public string ComentarioTesting { get; set; }
        public string InstruccionCuidado { get; set; }


        public string MuestraA_Ancho_1erLav_1 { get; set; }
        public string MuestraA_Ancho_3erLav_1 { get; set; }
        public string MuestraA_Ancho_1erLav_2 { get; set; }
        public string MuestraA_Ancho_3erLav_2 { get; set; }
        public string MuestraA_Ancho_1erLav_3 { get; set; }
        public string MuestraA_Ancho_3erLav_3 { get; set; }
        public string MuestraA_Largo_1erLav_1 { get; set; }
        public string MuestraA_Largo_3erLav_1 { get; set; }
        public string MuestraA_Largo_1erLav_2 { get; set; }
        public string MuestraA_Largo_3erLav_2 { get; set; }
        public string MuestraA_Largo_1erLav_3 { get; set; }
        public string MuestraA_Largo_3erLav_3 { get; set; }
        public string MuestraA_1erLav_AC { get; set; }
        public string MuestraA_1erLav_BD { get; set; }
        public string MuestraA_3erLav_AC { get; set; }
        public string MuestraA_3erLav_BD { get; set; }
        public string MuestraB_Ancho_1erLav_1 { get; set; }
        public string MuestraB_Ancho_3erLav_1 { get; set; }
        public string MuestraB_Ancho_1erLav_2 { get; set; }
        public string MuestraB_Ancho_3erLav_2 { get; set; }
        public string MuestraB_Ancho_1erLav_3 { get; set; }
        public string MuestraB_Ancho_3erLav_3 { get; set; }
        public string MuestraB_Largo_1erLav_1 { get; set; }
        public string MuestraB_Largo_3erLav_1 { get; set; }
        public string MuestraB_Largo_1erLav_2 { get; set; }
        public string MuestraB_Largo_3erLav_2 { get; set; }
        public string MuestraB_Largo_1erLav_3 { get; set; }
        public string MuestraB_Largo_3erLav_3 { get; set; }
        public string MuestraB_1erLav_AC { get; set; }
        public string MuestraB_1erLav_BD { get; set; }
        public string MuestraB_3erLav_AC { get; set; }
        public string MuestraB_3erLav_BD { get; set; }


        public string AcrossChestOriginal { get; set; }
        public string AcrossChestOneCyle { get; set; }
        public string AcrossChestThreeCyles { get; set; }
        public string AcrossChestFiveCycle { get; set; }
        public string BottomWidthOriginal { get; set; }
        public string BottomWidthOneCyle { get; set; }
        public string BottomWidthThreeCyles { get; set; }
        public string BottomWidthFiveCycle { get; set; }
        public string BodyFromLenOriginal { get; set; }
        public string BodyFromLeOneCyle { get; set; }
        public string BodyFromLeThreeCyles { get; set; }
        public string BodyFromLeFiveCycle { get; set; }
        public string SleeveLenOriginal { get; set; }
        public string SleeveLenOneCyle { get; set; }
        public string SleeveLenThreeCyles { get; set; }
        public string SleeveLenFiveCycle { get; set; }
        public string WaistbandWidthHalfOriginal { get; set; }
        public string WaistbandWidthHalfOneCyle { get; set; }
        public string WaistbandWidthHalfThreeCyles { get; set; }
        public string WaistbandWidthHalfFiveCycle { get; set; }
        public string LegOpeningHalfOriginal { get; set; }
        public string LegOpeningHalfOneCyle { get; set; }
        public string LegOpeningHalfThreeCyles { get; set; }
        public string LegOpeningHalfFiveCycle { get; set; }
        public string OutseambelowOriginal { get; set; }
        public string OutseambelowOneCyle { get; set; }
        public string OutseambelowThreeCyles { get; set; }
        public string OutseambelowFiveCycle { get; set; }
        public string InseamLenOriginal { get; set; }
        public string InseamLenOneCyle { get; set; }
        public string InseamLenThreeCyles { get; set; }
        public string InseamLenFiveCycle { get; set; }

        public string EncogimientoLargo
        {
            get; set;
        }
        public string EncogimientoAncho
        {
            get; set;
        }
        public string Revirado
        {
            get; set;
        }
        public string Apariencia
        {
            get; set;
        }
        public string Pilling
        {
            get; set;
        }
        public int EncogimientoStatus
        {
            get; set;
        }
        public int ReviradoStatus
        {
            get; set;
        }
        public int AparienciaStatus
        {
            get; set;
        }

        public string Densidad
        {
            get; set;
        }
        public string AnchoAcabado
        {
            get; set;
        }
        public int DensidadStatus
        {
            get; set;
        }

        public string Seco
        {
            get; set;
        }
        public string Humedo
        {
            get; set;
        }
        public int SolidezFroteStatus
        {
            get; set;
        }

        public string CambioColorSL
        {
            get; set;
        }
        public string AcetatoSL
        {
            get; set;
        }
        public string AlgodonSL
        {
            get; set;
        }
        public string NylonSL
        {
            get; set;
        }
        public string PoliesterSL
        {
            get; set;
        }
        public string AcrilicoSL
        {
            get; set;
        }
        public string LanaSL
        {
            get; set;
        }
        public string SilkSL
        {
            get; set;
        }
        public string ViscosaSL
        {
            get; set;
        }
        public string EvaluacionAparienciaSL
        {
            get; set;
        }
        public int SolidezLavadoStatus
        {
            get; set;
        }

        public string PillingResultado
        {
            get; set;
        }
        public string PillingMin
        {
            get; set;
        }
        public int ResistenciaPillingStatus
        {
            get; set;
        }

        public string BurstingResultado
        {
            get; set;
        }
        public string BurstingMin
        {
            get; set;
        }
        public int BurstingStatus
        {
            get; set;
        }

        public string CambioColorST
        {
            get; set;
        }
        public string AcetatoST
        {
            get; set;
        }
        public string AlgodonST
        {
            get; set;
        }
        public string NylonST
        {
            get; set;
        }
        public string PoliesterST
        {
            get; set;
        }
        public string AcrilicoST
        {
            get; set;
        }
        public string LanaST
        {
            get; set;
        }
        public string SilkST
        {
            get; set;
        }
        public string ViscosaST
        {
            get; set;
        }
        public int SolidezTranspiracionStatus
        {
            get; set;
        }

        public string CambioColorSA
        {
            get; set;
        }
        public string AcetatoSA
        {
            get; set;
        }
        public string AlgodonSA
        {
            get; set;
        }
        public string NylonSA
        {
            get; set;
        }
        public string PoliesterSA
        {
            get; set;
        }
        public string AcrilicoSA
        {
            get; set;
        }
        public string LanaSA
        {
            get; set;
        }
        public string SilkSA
        {
            get; set;
        }
        public string ViscosaSA
        {
            get; set;
        }
        public int SolidezAguaStatus
        {
            get; set;
        }

        public string CambioColorBlanqueadorSinCloroSodiumPerborate
        {
            get; set;
        }
        public string CambioColorBlanqueadorSinCloroHydrogenPeroxide
        {
            get; set;
        }
        public int BlanqueadorSinClaroStatus
        {
            get; set;
        }

        public string CambioColorBlanqueadorConCloro
        {
            get; set;
        }
        public int BlanqueadorConCloroStatus
        {
            get; set;
        }

        public string ResultadoPH
        {
            get; set;
        }
        public string RequeridoPH
        {
            get; set;
        }
        public int PHStatus
        {
            get; set;
        }

        public string WikingPulgadas
        {
            get; set;
        }
        public string WikingMinutes
        {
            get; set;
        }
        public string WikingMin30Wales
        {
            get; set;
        }
        public string WikingMin30Courses
        {
            get; set;
        }
        public int WikingStatus
        {
            get; set;
        }

        public string EncogimientoLargo_EP { get; set; }
        public string EncogimientoAncho_EP { get; set; }
        public string Revirado_EP { get; set; }
        public string Apariencia_EP { get; set; }
        public string Pilling_EP { get; set; }
        public string EncogimientoStatus_EP { get; set; }
        public string ReviradoStatus_EP { get; set; }


        public string EncogimientoLargo_HW { get; set; }
        public string EncogimientoAncho_HW { get; set; }
        public string Revirado_HW { get; set; }
        public string Apariencia_HW { get; set; }
        public string Pilling_HW { get; set; }
        public string EncogimientoStatus_HW { get; set; }
        public string ReviradoStatus_HW { get; set; }

        public string UOM { get; set; }

        public int IdClienteERP { get; set; }
        public int IdProveedor { get; set; }


    }
}
