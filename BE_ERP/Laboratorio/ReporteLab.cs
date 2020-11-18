using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Laboratorio
{
    public class ReporteLab
    {
        public string reporte_tecnico { get; set; }
        public string numero_partida { get; set; }
        public string fabrica { get; set; }
        public string tintoreria { get; set; }
        public string cliente { get; set; }
        public string color { get; set; }
        public string codigo_tela { get; set; }
        public string tela { get; set; }
        public string instruccion_cuidado { get; set; }
        public string tipo_prueba { get; set; }
        public string status_final { get; set; }
        public string status_lab { get; set; }
        public string status_tono { get; set; }
        public string comentario_tono { get; set; }
        public string comentario_testing { get; set; }
        public string instruccion_laboratorio { get; set; }
        
        /***** Reporte Pruebas ****/
        /* Estabilidad Dimensional - Tela */ 
        public string muestra_a_ancho_1erlav_1 { get; set; }
        public string muestra_a_ancho_3erlav_1 { get; set; }
        public string muestra_a_ancho_5tolav_1 { get; set; }
        public string muestra_a_largo_1erlav_1 { get; set; }
        public string muestra_a_largo_3erlav_1 { get; set; }
        public string muestra_a_largo_5tolav_1 { get; set; }
        public string muestra_b_ancho_1erlav_1 { get; set; }
        public string muestra_b_ancho_3erlav_1 { get; set; }
        public string muestra_b_ancho_5tolav_1 { get; set; }
        public string muestra_b_largo_1erlav_1 { get; set; }
        public string muestra_b_largo_3erlav_1 { get; set; }
        public string muestra_b_largo_5tolav_1 { get; set; }
        
        public string muestra_a_ancho_1erlav_2 { get; set; }
        public string muestra_a_ancho_3erlav_2 { get; set; }
        public string muestra_a_ancho_5tolav_2 { get; set; }
        public string muestra_a_largo_1erlav_2 { get; set; }
        public string muestra_a_largo_3erlav_2 { get; set; }
        public string muestra_a_largo_5tolav_2 { get; set; }
        public string muestra_b_ancho_1erlav_2 { get; set; }
        public string muestra_b_ancho_3erlav_2 { get; set; }
        public string muestra_b_ancho_5tolav_2 { get; set; }
        public string muestra_b_largo_1erlav_2 { get; set; }
        public string muestra_b_largo_3erlav_2 { get; set; }
        public string muestra_b_largo_5tolav_2 { get; set; }
        
        public string muestra_a_ancho_1erlav_3 { get; set; }
        public string muestra_a_ancho_3erlav_3 { get; set; }
        public string muestra_a_ancho_5tolav_3 { get; set; }
        public string muestra_a_largo_1erlav_3 { get; set; }
        public string muestra_a_largo_3erlav_3 { get; set; }
        public string muestra_a_largo_5tolav_3 { get; set; }
        public string muestra_b_ancho_1erlav_3 { get; set; }
        public string muestra_b_ancho_3erlav_3 { get; set; }
        public string muestra_b_ancho_5tolav_3 { get; set; }
        public string muestra_b_largo_1erlav_3 { get; set; }
        public string muestra_b_largo_3erlav_3 { get; set; }
        public string muestra_b_largo_5tolav_3 { get; set; }
        
        public string encogimiento_largo { get; set; }
        public string encogimiento_ancho { get; set; }
        public string status_encogimiento { get; set; }
        
        /* Estabilidad Dimensional - Prenda */
        public string acrosschest_original { get; set; }
        public string acrosschest_onecyle { get; set; }
        public string acrosschest_threecycles { get; set; }
        public string acrosschest_fivecycles { get; set; }
        public string bottomwidth_original { get; set; }
        public string bottomwidth_onecyle { get; set; }
        public string bottomwidth_threecycles { get; set; }
        public string bottomwidth_fivecycles { get; set; }
        public string bodyfromlen_original { get; set; }
        public string bodyfromle_onecycle { get; set; }
        public string bodyfromlen_threecycles { get; set; }
        public string bodyfromlen_fivecycles { get; set; }
        public string sleevelen_original { get; set; }
        public string sleevelen_onecycle { get; set; }
        public string sleevelen_threecycles { get; set; }
        public string sleevelen_fivecycles { get; set; }
        public string waistbandwidth_halforiginal { get; set; }
        public string waistbandwidth_halfonecycle { get; set; }
        public string waistbandwidth_halfthreecycles { get; set; }
        public string waistbandwidth_halffivecycles { get; set; }
        public string legopening_halforiginal { get; set; }
        public string legopening_halfonecycle { get; set; }
        public string legopening_halfthreecycles { get; set; }
        public string legopening_halffivecycles { get; set; }
        public string outseambelow_original { get; set; }
        public string outseambelow_onecycle { get; set; }
        public string outseambelow_threecycles { get; set; }
        public string outseambelow_fivecycles { get; set; }
        public string inseamlen_original { get; set; }
        public string inseamlen_onecyle { get; set; }
        public string inseamlen_threecyles { get; set; }
        public string inseamlen_fivecycle { get; set; }
        
        public string acrosschest_onecyclechange { get; set; }
        public string acrosschest_threecyclechange { get; set; }
        public string acrosschest_fivecyclechange { get; set; }
        public string bottomwidtht_onecyclechange { get; set; }
        public string bottomwidth_threecyclechange { get; set; }
        public string bottomwidtht_fivecyclechange { get; set; }
        public string bodyfromlen_onecyclechange { get; set; }
        public string bodyfromlen_threecyclechange { get; set; }
        public string bodyfromlen_fivecyclechange { get; set; }
        public string sleevelenone_cyclechange { get; set; }
        public string sleevelen_threecyclechange { get; set; }
        public string sleevelen_fivecyclechange { get; set; }
        public string waistbandwidth_halfonecyclechange { get; set; }
        public string waistbandwidth_halfthreecyclechange { get; set; }
        public string waistbandwidth_halffivecyclechange { get; set; }
        public string legopening_halfonecyclechange { get; set; }
        public string legopening_halfthreecyclechange { get; set; }
        public string legopening_halffivecyclechange { get; set; }
        public string outseambelow_onecyclechange { get; set; }
        public string outseambelow_threecyclechange { get; set; }
        public string outseambelow_fivecyclechange { get; set; }
        public string inseamlen_onecyclechange { get; set; }
        public string inseamlen_threecyclechange { get; set; }
        public string inseamlen_fivecyclechange { get; set; }
       
        public string status_encogimiento_garment { get; set; }
        public string uom { get; set; }
       
        /* Revirado */
        public string muestra_a_1erlav_ac { get; set; }
        public string muestra_a_1erlav_bd { get; set; }
        public string muestra_a_3erlav_ac { get; set; }
        public string muestra_a_3erlav_bd { get; set; }
        public string muestra_a_5tolav_ac { get; set; }
        public string muestra_a_5tolav_bd { get; set; }
       
        public string muestra_b_1erlav_ac { get; set; }
        public string muestra_b_1erlav_bd { get; set; }
        public string muestra_b_3erlav_ac { get; set; }
        public string muestra_b_3erlav_bd { get; set; }
        public string muestra_b_5tolav_ac { get; set; }
        public string muestra_b_5tolav_bd { get; set; }
       
        public string revirado { get; set; }
        public string status_revirado { get; set; }
       
        /* Estabilidad Dimensional Drycleaning in PerchLoroethylene - Tela */
        public string muestra_a_ancho_1erlav_1_ep { get; set; }
        public string muestra_a_ancho_3erlav_1_ep { get; set; }
        public string muestra_a_ancho_1erlav_2_ep { get; set; }
        public string muestra_a_ancho_3erlav_2_ep { get; set; }
        public string muestra_a_ancho_1erlav_3_ep { get; set; }
        public string muestra_a_ancho_3erlav_3_ep { get; set; }
        
        public string muestra_a_largo_1erlav_1_ep { get; set; }
        public string muestra_a_largo_3erlav_1_ep { get; set; }
        public string muestra_a_largo_1erlav_2_ep { get; set; }
        public string muestra_a_largo_3erlav_2_ep { get; set; }
        public string muestra_a_largo_1erlav_3_ep { get; set; }
        public string muestra_a_largo_3erlav_3_ep { get; set; }
       
        public string muestra_b_ancho_1erlav_1_ep { get; set; }
        public string muestra_b_ancho_3erlav_1_ep { get; set; }
        public string muestra_b_ancho_1erlav_2_ep { get; set; }
        public string muestra_b_ancho_3erlav_2_ep { get; set; }
        public string muestra_b_ancho_1erlav_3_ep { get; set; }
        public string muestra_b_ancho_3erlav_3_ep { get; set; }
        public string muestra_b_largo_1erlav_1_ep { get; set; }
        public string muestra_b_largo_3erlav_1_ep { get; set; }
        public string muestra_b_largo_1erlav_2_ep { get; set; }
        public string muestra_b_largo_3erlav_2_ep { get; set; }
        public string muestra_b_largo_1erlav_3_ep { get; set; }
        public string muestra_b_largo_3erlav_3_ep { get; set; }
       
        public string encogimientolargo_ep { get; set; }
        public string encogimientoancho_ep { get; set; }
        public string Status_Encogimiento_EP { get; set; }
       
        /* Estabilidad Dimensional Hand Wash Laundering - Tela */
        public string muestra_a_ancho_1erlav_1_hw { get; set; }
        public string muestra_a_ancho_3erlav_1_hw { get; set; }
        public string muestra_a_ancho_1erlav_2_hw { get; set; }
        public string muestra_a_ancho_3erlav_2_hw { get; set; }
        public string muestra_a_ancho_1erlav_3_hw { get; set; }
        public string muestra_a_ancho_3erlav_3_hw { get; set; }
        public string muestra_a_largo_1erlav_1_hw { get; set; }
        public string muestra_a_largo_3erlav_1_hw { get; set; }
        public string muestra_a_largo_1erlav_2_hw { get; set; }
        public string muestra_a_largo_3erlav_2_hw { get; set; }
        public string muestra_a_largo_1erlav_3_hw { get; set; }
        public string muestra_a_largo_3erlav_3_hw { get; set; }
       
        public string muestra_b_ancho_1erlav_1_hw { get; set; }
        public string muestra_b_ancho_3erlav_1_hw { get; set; }
        public string muestra_b_ancho_1erlav_2_hw { get; set; }
        public string muestra_b_ancho_3erlav_2_hw { get; set; }
        public string muestra_b_ancho_1erlav_3_hw { get; set; }
        public string muestra_b_ancho_3erlav_3_hw { get; set; }
        public string muestra_b_largo_1erlav_1_hw { get; set; }
        public string muestra_b_largo_3erlav_1_hw { get; set; }
        public string muestra_b_largo_1erlav_2_hw { get; set; }
        public string muestra_b_largo_3erlav_2_hw { get; set; }
        public string muestra_b_largo_1erlav_3_hw { get; set; }
        public string muestra_b_largo_3erlav_3_hw { get; set; }
       
        public string encogimientolargo_hw { get; set; }
        public string encogimientoancho_hw { get; set; }
        public string status_encogimiento_hw { get; set; }
       
        /* Apariencia */
        public string color_change { get; set; }
        public string grado_pilling { get; set; }
        public string grade_sa { get; set; }
        public string evaluacion_apariencia { get; set; }
        public string status_apariencia { get; set; }
       
        /* Seam twist in garment before and after home laundering */
        public string seamtwist_beforeaa { get; set; }
        public string seamtwist_beforeab { get; set; }
        public string seamtwist_before_resultado { get; set; }
        public string seamtwist_afteraa { get; set; }
        public string seamtwist_afterab { get; set; }
        public string seamtwist_after_resultado { get; set; }
        public string seamtwistchange { get; set; }
        public string status_seamtwist { get; set; }
       
        /* Densidad de Tela */
        public string muestra1_densidad { get; set; }
        public string muestra2_densidad { get; set; }
        public string muestra3_densidad { get; set; }
        public string densidad { get; set; }
        public string muestra1_ancho { get; set; }
        public string muestra2_ancho { get; set; }
        public string muestra3_ancho { get; set; }
        public string ancho_acabado { get; set; }
        public string desviacion { get; set; }
        public string status_densidad { get; set; }
       
        /* Solidez al Frote */
        public string seco { get; set; }
        public string humedo { get; set; }
        public string status_solidezfrote { get; set; }
       
        /* Solidez al Lavado */
        public string cambiocolor_sl { get; set; }
        public string acetato_sl { get; set; }
        public string algodon_sl { get; set; }
        public string nylon_sl { get; set; }
        public string silk_sl { get; set; }
        public string poliester_sl { get; set; }
        public string acrilico_sl { get; set; }
        public string lana_sl { get; set; }
        public string viscosa_sl { get; set; }
        public string status_solidezlavado { get; set; }
       
        /* Resistencia Pilling */
        public string pilling_resultado { get; set; }
        public string pilling_min { get; set; }
        public string status_resistenciapilling { get; set; }
       
        /* Bursting */
        public string bursting_resultado { get; set; }
        public string bursting_min { get; set; }
        public string status_bursting { get; set; }
       
        /* Solidez a la Transpiración */
        public string cambiocolor_st { get; set; }
        public string acetato_st { get; set; }
        public string algodon_st { get; set; }
        public string nylon_st { get; set; }
        public string silk_st { get; set; }
        public string poliester_st { get; set; }
        public string acrilico_st { get; set; }
        public string lana_st { get; set; }
        public string viscosa_st { get; set; }
        public string status_solideztranspiracion { get; set; }
       
        /* Solidez al Agua */
        public string cambiocolor_sa { get; set; }
        public string acetato_sa { get; set; }
        public string algodon_sa { get; set; }
        public string nylon_sa { get; set; }
        public string silk_sa { get; set; }
        public string poliester_sa { get; set; }
        public string acrilico_sa { get; set; }
        public string lana_sa { get; set; }
        public string viscosa_sa { get; set; }
        public string status_solidezagua { get; set; }
       
        /* Almacenamiento */
        public string cambiocolor_al { get; set; }
        public string acetato_al { get; set; }
        public string algodon_al { get; set; }
        public string nylon_al { get; set; }
        public string silk_al { get; set; }
        public string poliester_al { get; set; }
        public string acrilico_al { get; set; }
        public string lana_al { get; set; }
        public string viscose_al { get; set; }
        public string stainingwhitecloth_al { get; set; }
        public string status_almacenamiento { get; set; }
       
        /* Blanqueador sin Cloro */
        public string cambiocolor_bsc_sodiumperborate { get; set; }
        public string cambiocolor_bsc_hydrogenperoxide { get; set; }
        public string status_blanqueadorsincloro { get; set; }
       
        /* Blanqueador con Cloro */
        public string cambiocolor_bc_cloro { get; set; }
        public string status_blanqueadorconcloro { get; set; }
       
        /* PH Value */
        public string resultado_ph { get; set; }
        public string requerido_ph { get; set; }
        public string status_phvalue { get; set; }
       
        /* Wicking */
        public string wiking_pulgadas { get; set; }
        public string wiking_minutos { get; set; }
        public string wiking_wales30 { get; set; }
        public string wiking_courses30 { get; set; }
        public string status_wiking { get; set; }

        /***** Reporte Lead Time ****/ //267
        public string creadopor { get; set; }
        public string fecha_ingreso { get; set; }
        public string fecha_recibido { get; set; }
        public string fecha_entrega { get; set; }
        public int leadtime_proveedor { get; set; }
        public int leadtime_laboratorio { get; set; }

        /***** Reporte Test Summary ****/ //267
        public string dim_changes_home_laundering { get; set; }
        public string dim_changes_garments_after_home_laundering { get; set; }
        public string dimen_changes_dry_perchloroethylene { get; set; }
        public string dimen_changes_hand_wash_laundering { get; set; }
        public string skewness_after_home_laundering { get; set; }
        public string appearance_after_home_laundering { get; set; }
        public string seam_twist_garment_before_after_home_laundering { get; set; }
        public string fabric_weight { get; set; }
        public string pilling_resistance { get; set; }
        public string bursting_stregth { get; set; }
        public string colorfastness_crocking { get; set; }
        public string colorfastness_accelerated { get; set; }
        public string colorfastness_perspiration { get; set; }
        public string colorfastness_water { get; set; }
        public string colorfastness_dry_transfer { get; set; }
        public string colornonchlorine { get; set; }
        public string colorChlorine { get; set; }
        public string phwater { get; set; }
        public string wicking { get; set; }
        public string mesanio { get; set; }


        /***** Reporte Lead Time KPI ****/ //267
        public int leadtime_total { get; set; }
    }
}
