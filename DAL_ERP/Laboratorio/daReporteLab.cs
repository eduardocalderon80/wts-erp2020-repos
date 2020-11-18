using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP.Laboratorio;
using System.Data;
using System.Data.SqlClient;

namespace DAL_ERP.Laboratorio
{
    public class daReporteLab
    {
        public List<ReporteLab> Reporte_Export_Pruebas(SqlConnection con, string fabrica, string cliente, string fechadesde, string fechahasta, string statusfinal, string tipoprueba, string reportetecnico, string numeropartida)
        {
            ReporteLab objReporteLab = new ReporteLab();
            List<ReporteLab> listReporteLab = new List<ReporteLab>();

            SqlCommand cmd = new SqlCommand("usp_Laboratorio_Reportes_Pruebas", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@fabrica", Convert.ToString(fabrica));
            cmd.Parameters.AddWithValue("@cliente", Convert.ToString(cliente));
            cmd.Parameters.AddWithValue("@fechadesde", Convert.ToString(fechadesde));
            cmd.Parameters.AddWithValue("@fechahasta", Convert.ToString(fechahasta));
            cmd.Parameters.AddWithValue("@statusfinal", Convert.ToString(statusfinal));
            cmd.Parameters.AddWithValue("@tipoprueba", Convert.ToString(tipoprueba));
            cmd.Parameters.AddWithValue("@reportetecnico", Convert.ToString(reportetecnico));
            cmd.Parameters.AddWithValue("@numeropartida", Convert.ToString(numeropartida));

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    while (oReader.Read())
                    {
                        objReporteLab = new ReporteLab();
                        
                        objReporteLab.reporte_tecnico = Convert.ToString(oReader[0]);
                        objReporteLab.numero_partida = Convert.ToString(oReader[1]);
                        objReporteLab.fabrica = Convert.ToString(oReader[2]);
                        objReporteLab.tintoreria = Convert.ToString(oReader[3]);
                        objReporteLab.cliente = Convert.ToString(oReader[4]);
                        objReporteLab.color = Convert.ToString(oReader[5]);
                        objReporteLab.codigo_tela = Convert.ToString(oReader[6]);
                        objReporteLab.tela = Convert.ToString(oReader[7]);
                        objReporteLab.instruccion_cuidado = Convert.ToString(oReader[8]);
                        objReporteLab.tipo_prueba = Convert.ToString(oReader[9]);
                        objReporteLab.status_final = Convert.ToString(oReader[10]);
                        objReporteLab.status_lab = Convert.ToString(oReader[11]);
                        objReporteLab.status_tono = Convert.ToString(oReader[12]);
                        objReporteLab.comentario_tono = Convert.ToString(oReader[13]);
                        objReporteLab.comentario_testing = Convert.ToString(oReader[14]);
                        objReporteLab.instruccion_laboratorio = Convert.ToString(oReader[15]);

                        /***** Reporte Pruebas ****/
                        /* Estabilidad Dimensional - Tela */
                        //objReporteLab.muestra_a_ancho_1erlav_1 = Convert.ToString(oReader[16]);
                        //objReporteLab.muestra_a_ancho_3erlav_1 = Convert.ToString(oReader[17]);
                        //objReporteLab.muestra_a_ancho_5tolav_1 = Convert.ToString(oReader[18]);
                        //objReporteLab.muestra_a_largo_1erlav_1 = Convert.ToString(oReader[19]);
                        //objReporteLab.muestra_a_largo_3erlav_1 = Convert.ToString(oReader[20]);
                        //objReporteLab.muestra_a_largo_5tolav_1 = Convert.ToString(oReader[21]);
                        //objReporteLab.muestra_b_ancho_1erlav_1 = Convert.ToString(oReader[21]);
                        //objReporteLab.muestra_b_ancho_3erlav_1 = Convert.ToString(oReader[22]);
                        //objReporteLab.muestra_b_ancho_5tolav_1 = Convert.ToString(oReader[23]);
                        //objReporteLab.muestra_b_largo_1erlav_1 = Convert.ToString(oReader[24]);
                        //objReporteLab.muestra_b_largo_3erlav_1 = Convert.ToString(oReader[25]);
                        //objReporteLab.muestra_b_largo_5tolav_1 = Convert.ToString(oReader[26]);

                        //objReporteLab.muestra_a_ancho_1erlav_2 = Convert.ToString(oReader[27]);
                        //objReporteLab.muestra_a_ancho_3erlav_2 = Convert.ToString(oReader[28]);
                        //objReporteLab.muestra_a_ancho_5tolav_2 = Convert.ToString(oReader[29]);
                        //objReporteLab.muestra_a_largo_1erlav_2 = Convert.ToString(oReader[30]);
                        //objReporteLab.muestra_a_largo_3erlav_2 = Convert.ToString(oReader[31]);
                        //objReporteLab.muestra_a_largo_5tolav_2 = Convert.ToString(oReader[32]);
                        //objReporteLab.muestra_b_ancho_1erlav_2 = Convert.ToString(oReader[33]);
                        //objReporteLab.muestra_b_ancho_3erlav_2 = Convert.ToString(oReader[34]);
                        //objReporteLab.muestra_b_ancho_5tolav_2 = Convert.ToString(oReader[35]);
                        //objReporteLab.muestra_b_largo_1erlav_2 = Convert.ToString(oReader[36]);
                        //objReporteLab.muestra_b_largo_3erlav_2 = Convert.ToString(oReader[37]);
                        //objReporteLab.muestra_b_largo_5tolav_2 = Convert.ToString(oReader[38]);

                        //objReporteLab.muestra_a_ancho_1erlav_3 = Convert.ToString(oReader[39]);
                        //objReporteLab.muestra_a_ancho_3erlav_3 = Convert.ToString(oReader[40]);
                        //objReporteLab.muestra_a_ancho_5tolav_3 = Convert.ToString(oReader[41]);
                        //objReporteLab.muestra_a_largo_1erlav_3 = Convert.ToString(oReader[42]);
                        //objReporteLab.muestra_a_largo_3erlav_3 = Convert.ToString(oReader[43]);
                        //objReporteLab.muestra_a_largo_5tolav_3 = Convert.ToString(oReader[44]);
                        //objReporteLab.muestra_b_ancho_1erlav_3 = Convert.ToString(oReader[45]);
                        //objReporteLab.muestra_b_ancho_3erlav_3 = Convert.ToString(oReader[46]);
                        //objReporteLab.muestra_b_ancho_5tolav_3 = Convert.ToString(oReader[47]);
                        //objReporteLab.muestra_b_largo_1erlav_3 = Convert.ToString(oReader[48]);
                        //objReporteLab.muestra_b_largo_3erlav_3 = Convert.ToString(oReader[49]);
                        //objReporteLab.muestra_b_largo_5tolav_3 = Convert.ToString(oReader[50]);

                        objReporteLab.encogimiento_largo = Convert.ToString(oReader[16]);//51
                        objReporteLab.encogimiento_ancho = Convert.ToString(oReader[17]);//52
                        //objReporteLab.status_encogimiento = Convert.ToString(oReader[53]);

                        /* Estabilidad Dimensional - Prenda */
                        //objReporteLab.acrosschest_original = Convert.ToString(oReader[54]);
                        //objReporteLab.acrosschest_onecyle = Convert.ToString(oReader[55]);
                        //objReporteLab.acrosschest_threecycles = Convert.ToString(oReader[56]);
                        //objReporteLab.acrosschest_fivecycles = Convert.ToString(oReader[57]);
                        //objReporteLab.bottomwidth_original = Convert.ToString(oReader[58]);
                        //objReporteLab.bottomwidth_onecyle = Convert.ToString(oReader[59]);
                        //objReporteLab.bottomwidth_threecycles = Convert.ToString(oReader[60]);
                        //objReporteLab.bottomwidth_fivecycles = Convert.ToString(oReader[61]);
                        //objReporteLab.bodyfromlen_original = Convert.ToString(oReader[62]);
                        //objReporteLab.bodyfromle_onecycle = Convert.ToString(oReader[63]);
                        //objReporteLab.bodyfromlen_threecycles = Convert.ToString(oReader[64]);
                        //objReporteLab.bodyfromlen_fivecycles = Convert.ToString(oReader[65]);
                        //objReporteLab.sleevelen_original = Convert.ToString(oReader[66]);
                        //objReporteLab.sleevelen_onecycle = Convert.ToString(oReader[67]);
                        //objReporteLab.sleevelen_threecycles = Convert.ToString(oReader[68]);
                        //objReporteLab.sleevelen_fivecycles = Convert.ToString(oReader[69]);
                        //objReporteLab.waistbandwidth_halforiginal = Convert.ToString(oReader[70]);
                        //objReporteLab.waistbandwidth_halfonecycle = Convert.ToString(oReader[71]);
                        //objReporteLab.waistbandwidth_halfthreecycles = Convert.ToString(oReader[72]);
                        //objReporteLab.waistbandwidth_halffivecycles = Convert.ToString(oReader[73]);
                        //objReporteLab.legopening_halforiginal = Convert.ToString(oReader[74]);
                        //objReporteLab.legopening_halfonecycle = Convert.ToString(oReader[75]);
                        //objReporteLab.legopening_halfthreecycles = Convert.ToString(oReader[76]);
                        //objReporteLab.legopening_halffivecycles = Convert.ToString(oReader[77]);
                        //objReporteLab.outseambelow_original = Convert.ToString(oReader[78]);
                        //objReporteLab.outseambelow_onecycle = Convert.ToString(oReader[79]);
                        //objReporteLab.outseambelow_threecycles = Convert.ToString(oReader[80]);
                        //objReporteLab.outseambelow_fivecycles = Convert.ToString(oReader[81]);
                        //objReporteLab.inseamlen_original = Convert.ToString(oReader[82]);
                        //objReporteLab.inseamlen_onecyle = Convert.ToString(oReader[83]);
                        //objReporteLab.inseamlen_threecyles = Convert.ToString(oReader[84]);
                        //objReporteLab.inseamlen_fivecycle = Convert.ToString(oReader[85]);

                        objReporteLab.acrosschest_onecyclechange = Convert.ToString(oReader[18]);//86
                        objReporteLab.acrosschest_threecyclechange = Convert.ToString(oReader[19]);//87
                        objReporteLab.acrosschest_fivecyclechange = Convert.ToString(oReader[20]);//88
                        objReporteLab.bottomwidtht_onecyclechange = Convert.ToString(oReader[21]);//89
                        objReporteLab.bottomwidth_threecyclechange = Convert.ToString(oReader[22]);//90
                        objReporteLab.bottomwidtht_fivecyclechange = Convert.ToString(oReader[23]);//91
                        objReporteLab.bodyfromlen_onecyclechange = Convert.ToString(oReader[24]);//92
                        objReporteLab.bodyfromlen_threecyclechange = Convert.ToString(oReader[25]);//93
                        objReporteLab.bodyfromlen_fivecyclechange = Convert.ToString(oReader[26]);//94
                        objReporteLab.sleevelenone_cyclechange = Convert.ToString(oReader[27]);//95
                        objReporteLab.sleevelen_threecyclechange = Convert.ToString(oReader[28]);//96
                        objReporteLab.sleevelen_fivecyclechange = Convert.ToString(oReader[29]);//97
                        objReporteLab.waistbandwidth_halfonecyclechange = Convert.ToString(oReader[30]);//98
                        objReporteLab.waistbandwidth_halfthreecyclechange = Convert.ToString(oReader[31]);//99
                        objReporteLab.waistbandwidth_halffivecyclechange = Convert.ToString(oReader[32]);//100
                        objReporteLab.legopening_halfonecyclechange = Convert.ToString(oReader[33]);//101
                        objReporteLab.legopening_halfthreecyclechange = Convert.ToString(oReader[34]);//102
                        objReporteLab.legopening_halffivecyclechange = Convert.ToString(oReader[35]);//103
                        objReporteLab.outseambelow_onecyclechange = Convert.ToString(oReader[36]);//104
                        objReporteLab.outseambelow_threecyclechange = Convert.ToString(oReader[37]);//105
                        objReporteLab.outseambelow_fivecyclechange = Convert.ToString(oReader[38]);//106
                        objReporteLab.inseamlen_onecyclechange = Convert.ToString(oReader[39]);//107
                        objReporteLab.inseamlen_threecyclechange = Convert.ToString(oReader[40]);//108
                        objReporteLab.inseamlen_fivecyclechange = Convert.ToString(oReader[41]);//109

                        //objReporteLab.status_encogimiento_garment = Convert.ToString(oReader[110]);
                        //objReporteLab.uom = Convert.ToString(oReader[111]);

                        /* Revirado */
                        //objReporteLab.muestra_a_1erlav_ac = Convert.ToString(oReader[112]);
                        //objReporteLab.muestra_a_1erlav_bd = Convert.ToString(oReader[113]);
                        //objReporteLab.muestra_a_3erlav_ac = Convert.ToString(oReader[114]);
                        //objReporteLab.muestra_a_3erlav_bd = Convert.ToString(oReader[115]);
                        //objReporteLab.muestra_a_5tolav_ac = Convert.ToString(oReader[116]);
                        //objReporteLab.muestra_a_5tolav_bd = Convert.ToString(oReader[117]);

                        //objReporteLab.muestra_b_1erlav_ac = Convert.ToString(oReader[118]);
                        //objReporteLab.muestra_b_1erlav_bd = Convert.ToString(oReader[119]);
                        //objReporteLab.muestra_b_3erlav_ac = Convert.ToString(oReader[120]);
                        //objReporteLab.muestra_b_3erlav_bd = Convert.ToString(oReader[121]);
                        //objReporteLab.muestra_b_5tolav_ac = Convert.ToString(oReader[122]);
                        //objReporteLab.muestra_b_5tolav_bd = Convert.ToString(oReader[123]);

                        objReporteLab.revirado = Convert.ToString(oReader[42]);//124
                        //objReporteLab.status_revirado = Convert.ToString(oReader[125]);

                        /* Estabilidad Dimensional Drycleaning in PerchLoroethylene - Tela */
                        //objReporteLab.muestra_a_ancho_1erlav_1_ep = Convert.ToString(oReader[126]);
                        //objReporteLab.muestra_a_ancho_3erlav_1_ep = Convert.ToString(oReader[127]);
                        //objReporteLab.muestra_a_ancho_1erlav_2_ep = Convert.ToString(oReader[128]);
                        //objReporteLab.muestra_a_ancho_3erlav_2_ep = Convert.ToString(oReader[129]);
                        //objReporteLab.muestra_a_ancho_1erlav_3_ep = Convert.ToString(oReader[130]);
                        //objReporteLab.muestra_a_ancho_3erlav_3_ep = Convert.ToString(oReader[131]);

                        //objReporteLab.muestra_a_largo_1erlav_1_ep = Convert.ToString(oReader[132]);
                        //objReporteLab.muestra_a_largo_3erlav_1_ep = Convert.ToString(oReader[133]);
                        //objReporteLab.muestra_a_largo_1erlav_2_ep = Convert.ToString(oReader[134]);
                        //objReporteLab.muestra_a_largo_3erlav_2_ep = Convert.ToString(oReader[135]);
                        //objReporteLab.muestra_a_largo_1erlav_3_ep = Convert.ToString(oReader[136]);
                        //objReporteLab.muestra_a_largo_3erlav_3_ep = Convert.ToString(oReader[137]);

                        //objReporteLab.muestra_b_ancho_1erlav_1_ep = Convert.ToString(oReader[138]);
                        //objReporteLab.muestra_b_ancho_3erlav_1_ep = Convert.ToString(oReader[139]);
                        //objReporteLab.muestra_b_ancho_1erlav_2_ep = Convert.ToString(oReader[140]);
                        //objReporteLab.muestra_b_ancho_3erlav_2_ep = Convert.ToString(oReader[141]);
                        //objReporteLab.muestra_b_ancho_1erlav_3_ep = Convert.ToString(oReader[142]);
                        //objReporteLab.muestra_b_ancho_3erlav_3_ep = Convert.ToString(oReader[143]);
                        //objReporteLab.muestra_b_largo_1erlav_1_ep = Convert.ToString(oReader[144]);
                        //objReporteLab.muestra_b_largo_3erlav_1_ep = Convert.ToString(oReader[145]);
                        //objReporteLab.muestra_b_largo_1erlav_2_ep = Convert.ToString(oReader[146]);
                        //objReporteLab.muestra_b_largo_3erlav_2_ep = Convert.ToString(oReader[147]);
                        //objReporteLab.muestra_b_largo_1erlav_3_ep = Convert.ToString(oReader[148]);
                        //objReporteLab.muestra_b_largo_3erlav_3_ep = Convert.ToString(oReader[149]);

                        objReporteLab.encogimientolargo_ep = Convert.ToString(oReader[43]);//150
                        objReporteLab.encogimientoancho_ep = Convert.ToString(oReader[44]);//151
                        //objReporteLab.Status_Encogimiento_EP = Convert.ToString(oReader[152]);

                        /* Estabilidad Dimensional Hand Wash Laundering - Tela */
                        //objReporteLab.muestra_a_ancho_1erlav_1_hw = Convert.ToString(oReader[153]);
                        //objReporteLab.muestra_a_ancho_3erlav_1_hw = Convert.ToString(oReader[154]);
                        //objReporteLab.muestra_a_ancho_1erlav_2_hw = Convert.ToString(oReader[155]);
                        //objReporteLab.muestra_a_ancho_3erlav_2_hw = Convert.ToString(oReader[156]);
                        //objReporteLab.muestra_a_ancho_1erlav_3_hw = Convert.ToString(oReader[157]);
                        //objReporteLab.muestra_a_ancho_3erlav_3_hw = Convert.ToString(oReader[158]);
                        //objReporteLab.muestra_a_largo_1erlav_1_hw = Convert.ToString(oReader[159]);
                        //objReporteLab.muestra_a_largo_3erlav_1_hw = Convert.ToString(oReader[160]);
                        //objReporteLab.muestra_a_largo_1erlav_2_hw = Convert.ToString(oReader[161]);
                        //objReporteLab.muestra_a_largo_3erlav_2_hw = Convert.ToString(oReader[162]);
                        //objReporteLab.muestra_a_largo_1erlav_3_hw = Convert.ToString(oReader[163]);
                        //objReporteLab.muestra_a_largo_3erlav_3_hw = Convert.ToString(oReader[164]);

                        //objReporteLab.muestra_b_ancho_1erlav_1_hw = Convert.ToString(oReader[165]);
                        //objReporteLab.muestra_b_ancho_3erlav_1_hw = Convert.ToString(oReader[166]);
                        //objReporteLab.muestra_b_ancho_1erlav_2_hw = Convert.ToString(oReader[167]);
                        //objReporteLab.muestra_b_ancho_3erlav_2_hw = Convert.ToString(oReader[168]);
                        //objReporteLab.muestra_b_ancho_1erlav_3_hw = Convert.ToString(oReader[169]);
                        //objReporteLab.muestra_b_ancho_3erlav_3_hw = Convert.ToString(oReader[170]);
                        //objReporteLab.muestra_b_largo_1erlav_1_hw = Convert.ToString(oReader[171]);
                        //objReporteLab.muestra_b_largo_3erlav_1_hw = Convert.ToString(oReader[172]);
                        //objReporteLab.muestra_b_largo_1erlav_2_hw = Convert.ToString(oReader[173]);
                        //objReporteLab.muestra_b_largo_3erlav_2_hw = Convert.ToString(oReader[174]);
                        //objReporteLab.muestra_b_largo_1erlav_3_hw = Convert.ToString(oReader[175]);
                        //objReporteLab.muestra_b_largo_3erlav_3_hw = Convert.ToString(oReader[176]);

                        objReporteLab.encogimientolargo_hw = Convert.ToString(oReader[45]);//177
                        objReporteLab.encogimientoancho_hw = Convert.ToString(oReader[46]);//178
                        //objReporteLab.status_encogimiento_hw = Convert.ToString(oReader[179]);

                        /* Apariencia */
                        objReporteLab.color_change = Convert.ToString(oReader[47]);//180
                        objReporteLab.grado_pilling = Convert.ToString(oReader[48]);//181
                        objReporteLab.grade_sa = Convert.ToString(oReader[49]);//182
                        //objReporteLab.evaluacion_apariencia = Convert.ToString(oReader[183]);
                        //objReporteLab.status_apariencia = Convert.ToString(oReader[184]);

                        /* Seam twist in garment before and after home laundering */
                        //objReporteLab.seamtwist_beforeaa = Convert.ToString(oReader[185]);
                        //objReporteLab.seamtwist_beforeab = Convert.ToString(oReader[186]);
                        //objReporteLab.seamtwist_before_resultado = Convert.ToString(oReader[187]);
                        //objReporteLab.seamtwist_afteraa = Convert.ToString(oReader[188]);
                        //objReporteLab.seamtwist_afterab = Convert.ToString(oReader[189]);
                        //objReporteLab.seamtwist_after_resultado = Convert.ToString(oReader[190]);
                        objReporteLab.seamtwistchange = Convert.ToString(oReader[50]);//191
                        //objReporteLab.status_seamtwist = Convert.ToString(oReader[192]);

                        /* Densidad de Tela */
                        //objReporteLab.muestra1_densidad = Convert.ToString(oReader[193]);
                        //objReporteLab.muestra2_densidad = Convert.ToString(oReader[194]);
                        //objReporteLab.muestra3_densidad = Convert.ToString(oReader[195]);
                        objReporteLab.densidad = Convert.ToString(oReader[51]);//196
                        //objReporteLab.muestra1_ancho = Convert.ToString(oReader[197]);
                        //objReporteLab.muestra2_ancho = Convert.ToString(oReader[198]);
                        //objReporteLab.muestra3_ancho = Convert.ToString(oReader[199]);
                        objReporteLab.ancho_acabado = Convert.ToString(oReader[52]);//200
                        objReporteLab.desviacion = Convert.ToString(oReader[53]);//201
                        //objReporteLab.status_densidad = Convert.ToString(oReader[202]);

                        /* Solidez al Frote */
                        objReporteLab.seco = Convert.ToString(oReader[54]);//204
                        objReporteLab.humedo = Convert.ToString(oReader[55]);//205
                        //objReporteLab.status_solidezfrote = Convert.ToString(oReader[206]);

                        /* Solidez al Lavado */
                        objReporteLab.cambiocolor_sl = Convert.ToString(oReader[56]);//207
                        objReporteLab.acetato_sl = Convert.ToString(oReader[57]);//208
                        objReporteLab.algodon_sl = Convert.ToString(oReader[58]);//209
                        objReporteLab.nylon_sl = Convert.ToString(oReader[59]);//210
                        objReporteLab.silk_sl = Convert.ToString(oReader[60]);//211
                        objReporteLab.poliester_sl = Convert.ToString(oReader[61]);//212
                        objReporteLab.acrilico_sl = Convert.ToString(oReader[62]);//213
                        objReporteLab.lana_sl = Convert.ToString(oReader[63]);//214
                        objReporteLab.viscosa_sl = Convert.ToString(oReader[64]);//215
                        //objReporteLab.status_solidezlavado = Convert.ToString(oReader[216]);

                        /* Resistencia Pilling */
                        objReporteLab.pilling_resultado = Convert.ToString(oReader[65]);//217
                        //objReporteLab.pilling_min = Convert.ToString(oReader[218]);
                        //objReporteLab.status_resistenciapilling = Convert.ToString(oReader[219]);

                        /* Bursting */
                        objReporteLab.bursting_resultado = Convert.ToString(oReader[66]);//220
                        //objReporteLab.bursting_min = Convert.ToString(oReader[221]);
                        //objReporteLab.status_bursting = Convert.ToString(oReader[222]);

                        /* Solidez a la Transpiración */
                        objReporteLab.cambiocolor_st = Convert.ToString(oReader[67]);//223
                        objReporteLab.acetato_st = Convert.ToString(oReader[68]);//224
                        objReporteLab.algodon_st = Convert.ToString(oReader[69]);//225
                        objReporteLab.nylon_st = Convert.ToString(oReader[70]);//226
                        objReporteLab.silk_st = Convert.ToString(oReader[71]);//227
                        objReporteLab.poliester_st = Convert.ToString(oReader[72]);//228
                        objReporteLab.acrilico_st = Convert.ToString(oReader[73]);//229
                        objReporteLab.lana_st = Convert.ToString(oReader[74]);//230
                        objReporteLab.viscosa_st = Convert.ToString(oReader[75]);//231
                        //objReporteLab.status_solideztranspiracion = Convert.ToString(oReader[232]);

                        /* Solidez al Agua */
                        objReporteLab.cambiocolor_sa = Convert.ToString(oReader[76]);//233
                        objReporteLab.acetato_sa = Convert.ToString(oReader[77]);//234
                        objReporteLab.algodon_sa = Convert.ToString(oReader[78]);//235
                        objReporteLab.nylon_sa = Convert.ToString(oReader[79]);//236
                        objReporteLab.silk_sa = Convert.ToString(oReader[80]);//237
                        objReporteLab.poliester_sa = Convert.ToString(oReader[81]);//238
                        objReporteLab.acrilico_sa = Convert.ToString(oReader[82]);//239
                        objReporteLab.lana_sa = Convert.ToString(oReader[83]);//240
                        objReporteLab.viscosa_sa = Convert.ToString(oReader[84]);//241
                        //objReporteLab.status_solidezagua = Convert.ToString(oReader[242]);

                        /* Almacenamiento */
                        objReporteLab.cambiocolor_al = Convert.ToString(oReader[85]);//243
                        objReporteLab.acetato_al = Convert.ToString(oReader[86]);//244
                        objReporteLab.algodon_al = Convert.ToString(oReader[87]);//245
                        objReporteLab.nylon_al = Convert.ToString(oReader[88]);//246
                        objReporteLab.silk_al = Convert.ToString(oReader[89]);//247
                        objReporteLab.poliester_al = Convert.ToString(oReader[90]);//248
                        objReporteLab.acrilico_al = Convert.ToString(oReader[91]);//249
                        objReporteLab.lana_al = Convert.ToString(oReader[92]);//250
                        objReporteLab.viscose_al = Convert.ToString(oReader[93]);//251
                        objReporteLab.stainingwhitecloth_al = Convert.ToString(oReader[94]);//252
                        //objReporteLab.status_almacenamiento = Convert.ToString(oReader[253]);

                        /* Blanqueador sin Cloro */
                        objReporteLab.cambiocolor_bsc_sodiumperborate = Convert.ToString(oReader[95]);//254
                        objReporteLab.cambiocolor_bsc_hydrogenperoxide = Convert.ToString(oReader[96]);//255
                        //objReporteLab.status_blanqueadorsincloro = Convert.ToString(oReader[256]);

                        /* Blanqueador con Cloro */
                        objReporteLab.cambiocolor_bc_cloro = Convert.ToString(oReader[97]);//257
                        //objReporteLab.status_blanqueadorconcloro = Convert.ToString(oReader[258]);

                        /* PH Value */
                        objReporteLab.resultado_ph = Convert.ToString(oReader[98]);//259
                        //objReporteLab.requerido_ph = Convert.ToString(oReader[260]);
                        //objReporteLab.status_phvalue = Convert.ToString(oReader[261]);

                        /* Wicking */
                        //objReporteLab.wiking_pulgadas = Convert.ToString(oReader[262]);
                        //objReporteLab.wiking_minutos = Convert.ToString(oReader[263]);
                        objReporteLab.wiking_wales30 = Convert.ToString(oReader[99]);//264
                        objReporteLab.wiking_courses30 = Convert.ToString(oReader[100]);//265
                        //objReporteLab.status_wiking = Convert.ToString(oReader[266]);

                        objReporteLab.mesanio = Convert.ToString(oReader[101]);
                        objReporteLab.fecha_ingreso = Convert.ToString(oReader[102]);
                        objReporteLab.fecha_recibido = Convert.ToString(oReader[103]);
                        objReporteLab.fecha_entrega = Convert.ToString(oReader[104]);


                        listReporteLab.Add(objReporteLab);
                    }
                }
            }

            return listReporteLab;

        }

        public List<ReporteLab> Reporte_Export_LeadTime(SqlConnection con, string fabrica, string cliente, string fechadesde, string fechahasta, string statusfinal, string tipoprueba, string reportetecnico, string numeropartida)
        {
            ReporteLab objReporteLab = new ReporteLab();
            List<ReporteLab> listReporteLab = new List<ReporteLab>();

            SqlCommand cmd = new SqlCommand("usp_Laboratorio_Reportes_LeadTime", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@fabrica", Convert.ToString(fabrica));
            cmd.Parameters.AddWithValue("@cliente", Convert.ToString(cliente));
            cmd.Parameters.AddWithValue("@fechadesde", Convert.ToString(fechadesde));
            cmd.Parameters.AddWithValue("@fechahasta", Convert.ToString(fechahasta));
            cmd.Parameters.AddWithValue("@statusfinal", Convert.ToString(statusfinal));
            cmd.Parameters.AddWithValue("@tipoprueba", Convert.ToString(tipoprueba));
            cmd.Parameters.AddWithValue("@reportetecnico", Convert.ToString(reportetecnico));
            cmd.Parameters.AddWithValue("@numeropartida", Convert.ToString(numeropartida));

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    while (oReader.Read())
                    {
                        objReporteLab = new ReporteLab();

                        objReporteLab.reporte_tecnico = Convert.ToString(oReader[0]);
                        objReporteLab.numero_partida = Convert.ToString(oReader[1]);
                        objReporteLab.fabrica = Convert.ToString(oReader[2]);
                        objReporteLab.tintoreria = Convert.ToString(oReader[3]);
                        objReporteLab.cliente = Convert.ToString(oReader[4]);
                        objReporteLab.color = Convert.ToString(oReader[5]);
                        objReporteLab.codigo_tela = Convert.ToString(oReader[6]);
                        objReporteLab.tela = Convert.ToString(oReader[7]);
                        objReporteLab.tipo_prueba = Convert.ToString(oReader[8]);
                        objReporteLab.status_final = Convert.ToString(oReader[9]);
                        objReporteLab.status_lab = Convert.ToString(oReader[10]);
                        objReporteLab.status_tono = Convert.ToString(oReader[11]);
                        objReporteLab.creadopor = Convert.ToString(oReader[12]);
                        objReporteLab.fecha_ingreso = Convert.ToString(oReader[13]);
                        objReporteLab.fecha_recibido = Convert.ToString(oReader[14]);
                        objReporteLab.fecha_entrega = Convert.ToString(oReader[15]);
                        objReporteLab.leadtime_proveedor = Convert.ToInt32(oReader[16]);
                        objReporteLab.leadtime_laboratorio = Convert.ToInt32(oReader[17]);


                        listReporteLab.Add(objReporteLab);
                    }
                }
            }

            return listReporteLab;

        }

        public List<ReporteLab> Reporte_Export_TestSummay(SqlConnection con, string fabrica, string cliente, string fechadesde, string fechahasta, string statusfinal, string tipoprueba, string reportetecnico, string numeropartida)
        {
            ReporteLab objReporteLab = new ReporteLab();
            List<ReporteLab> listReporteLab = new List<ReporteLab>();

            SqlCommand cmd = new SqlCommand("usp_Laboratorio_Reportes_TestingSummary", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@fabrica", Convert.ToString(fabrica));
            cmd.Parameters.AddWithValue("@cliente", Convert.ToString(cliente));
            cmd.Parameters.AddWithValue("@fechadesde", Convert.ToString(fechadesde));
            cmd.Parameters.AddWithValue("@fechahasta", Convert.ToString(fechahasta));
            cmd.Parameters.AddWithValue("@statusfinal", Convert.ToString(statusfinal));
            cmd.Parameters.AddWithValue("@tipoprueba", Convert.ToString(tipoprueba));
            cmd.Parameters.AddWithValue("@reportetecnico", Convert.ToString(reportetecnico));
            cmd.Parameters.AddWithValue("@numeropartida", Convert.ToString(numeropartida));

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    while (oReader.Read())
                    {
                        objReporteLab = new ReporteLab();

                        objReporteLab.reporte_tecnico = Convert.ToString(oReader[0]);
                        objReporteLab.numero_partida = Convert.ToString(oReader[1]);
                        objReporteLab.fabrica = Convert.ToString(oReader[2]);
                        objReporteLab.tintoreria = Convert.ToString(oReader[3]);
                        objReporteLab.cliente = Convert.ToString(oReader[4]);
                        objReporteLab.color = Convert.ToString(oReader[5]);
                        objReporteLab.codigo_tela = Convert.ToString(oReader[6]);
                        objReporteLab.tela = Convert.ToString(oReader[7]);
                        objReporteLab.tipo_prueba = Convert.ToString(oReader[8]);
                        objReporteLab.status_final = Convert.ToString(oReader[9]);
                        objReporteLab.status_lab = Convert.ToString(oReader[10]);
                        objReporteLab.status_tono = Convert.ToString(oReader[11]);
                        objReporteLab.dim_changes_home_laundering = Convert.ToString(oReader[12]);
                        objReporteLab.dim_changes_garments_after_home_laundering = Convert.ToString(oReader[13]);
                        objReporteLab.dimen_changes_dry_perchloroethylene = Convert.ToString(oReader[14]);
                        objReporteLab.dimen_changes_hand_wash_laundering = Convert.ToString(oReader[15]);
                        objReporteLab.skewness_after_home_laundering = Convert.ToString(oReader[16]);
                        objReporteLab.appearance_after_home_laundering = Convert.ToString(oReader[17]);
                        objReporteLab.seam_twist_garment_before_after_home_laundering = Convert.ToString(oReader[18]);
                        objReporteLab.fabric_weight = Convert.ToString(oReader[19]);
                        objReporteLab.pilling_resistance = Convert.ToString(oReader[20]);
                        objReporteLab.bursting_stregth = Convert.ToString(oReader[21]);
                        objReporteLab.colorfastness_crocking = Convert.ToString(oReader[22]);
                        objReporteLab.colorfastness_accelerated = Convert.ToString(oReader[23]);
                        objReporteLab.colorfastness_perspiration = Convert.ToString(oReader[24]);
                        objReporteLab.colorfastness_water = Convert.ToString(oReader[25]);
                        objReporteLab.colorfastness_dry_transfer = Convert.ToString(oReader[26]);
                        objReporteLab.colornonchlorine = Convert.ToString(oReader[27]);
                        objReporteLab.colorChlorine = Convert.ToString(oReader[28]);
                        objReporteLab.phwater = Convert.ToString(oReader[29]);
                        objReporteLab.wicking = Convert.ToString(oReader[30]);
                        objReporteLab.mesanio = Convert.ToString(oReader[31]);
                        objReporteLab.fecha_ingreso = Convert.ToString(oReader[32]);
                        objReporteLab.fecha_recibido = Convert.ToString(oReader[33]);
                        objReporteLab.fecha_entrega = Convert.ToString(oReader[34]);


                        listReporteLab.Add(objReporteLab);
                    }
                }
            }

            return listReporteLab;

        }

        public List<ReporteLab> Laboratorio_Reporte_Export_LeadTimeKPI(SqlConnection con, int mes, int anio)
        {
            ReporteLab objReporteLab = new ReporteLab();
            List<ReporteLab> listReporteLab = new List<ReporteLab>();

            SqlCommand cmd = new SqlCommand("usp_Laboratorio_Reporte_DataLeadTimeKPI", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@mes", Convert.ToInt32(mes));
            cmd.Parameters.AddWithValue("@anio", Convert.ToInt32(anio));

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    while (oReader.Read())
                    {
                        objReporteLab = new ReporteLab();

                        objReporteLab.reporte_tecnico = Convert.ToString(oReader[0]);
                        objReporteLab.cliente = Convert.ToString(oReader[1]);
                        objReporteLab.fabrica = Convert.ToString(oReader[2]);
                        objReporteLab.tipo_prueba = Convert.ToString(oReader[3]);
                        objReporteLab.status_final = Convert.ToString(oReader[4]);
                        objReporteLab.fecha_ingreso = Convert.ToString(oReader[5]);
                        objReporteLab.fecha_recibido = Convert.ToString(oReader[6]);
                        objReporteLab.fecha_entrega = Convert.ToString(oReader[7]);
                        objReporteLab.leadtime_total = Convert.ToInt32(oReader[8]);

                        listReporteLab.Add(objReporteLab);
                    }
                }
            }

            return listReporteLab;

        }

    }
}
