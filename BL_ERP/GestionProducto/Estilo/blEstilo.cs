using System;
using System.Data;
using System.Data.SqlClient;
using BE_ERP.GestionProducto;
using DAL_ERP.GestionProducto;
using System.Collections.Generic;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using OfficeOpenXml.Drawing;
using System.Configuration;
using System.Linq;

namespace BL_ERP.GestionProducto
{
    public class blEstilo : blLog
    {
        const string tituloscabecera_telacolor = "Color¬Type¬Approval by¬Dying house¬Season¬Status";

        public int Migrar(Estilo oEstilo)
        {
            int rpta = -1;
            string cnx = Util.Default;
            SqlTransaction trx = null;

            using (SqlConnection con = new SqlConnection(cnx))
            {
                con.Open();
                trx = con.BeginTransaction();

                try
                {
                    daEstilo odata = new daEstilo();
                    rpta = odata.Migrar(con, trx, oEstilo);
                }
                catch (Exception ex)
                {
                    trx.Rollback();
                    GrabarArchivoLog(ex);
                    rpta = -1;
                }
            }
            return rpta;
        }

        public int Save(Estilo oEstilo, string nombreBD = null)
        {
            int response = -1;
            string Conexion = nombreBD ?? Util.Default;
            SqlTransaction transaction = null;

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                con.Open();
                transaction = con.BeginTransaction();

                try
                {
                    daEstilo odata = new daEstilo();
                    response = odata.Save(con, transaction, oEstilo);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    GrabarArchivoLog(ex);
                    response = -1;
                }
            }
            return response;
        }

        public int Save_edit_estilo(Estilo oEstilo, string nombreBD = null)
        {
            int response = -1;
            string Conexion = nombreBD ?? Util.Default;
            SqlTransaction transaction = null;

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                con.Open();
                transaction = con.BeginTransaction();

                try
                {
                    daEstilo odata = new daEstilo();
                    response = odata.Save_edit_estilo(con, transaction, oEstilo);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    GrabarArchivoLog(ex);
                    response = -1;
                }
            }
            return response;
        }


        public PdChart GetPdChart(string sp, string par, string nombreBD = null)
        {
            string Conexion = nombreBD ?? Util.Default;
            PdChart pdchart = null;

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                con.Open();

                try
                {
                    pdchart = new PdChart();
                    daEstilo odata = new daEstilo();
                    pdchart = odata.GetPdChart(con, sp, par);
                }
                catch (Exception ex)
                {
                    GrabarArchivoLog(ex);
                    pdchart = null;
                }
            }
            return pdchart;
        }

        public byte[] ExportarToExcelPdChart(string tituloprincipal, List<Estilo> listaEstilos, List<FichaTecnica> listaTelas, List<FichaTecnicaColor_LabDip> listaTelasColor,
            List<FichaTecnicaColor_LabDip> listaproyectotelacolor, List<ProyectoTela_Proceos> listaproyectotela_proceso,
            List<EstiloxProceso> listaProcesos, List<EstiloxProcesoColor> listaProcesoxColor, List<EstiloxArte> listaEstiloxArte, List<EstiloxArteColor> listaArtexColor,
            List<EstiloxTrim> listaEstiloxTrim, List<EstiloxTrimColor> listaTrimColor, List<Requerimiento_pdchart> listaRequerimiento, List<RequerimientoDetalle_pdchart> listaRequerimientoDetalle,
            List<RequerimientoComentario_pdchart> listrequerimientocomentario, List<Callout> listaCallout, List<EstiloxCombo> listaestiloxcombo, List<EstiloxComboColor> listaestiloxcombocolor, 
            List<EstiloxFabricCombo> listaestiloxfabriccombo, List<EstiloxFabricComboColor> listaestiloxfabriccombocolor,
            string titulos_cabecera_reporte, string nombrecliente, string nombredivision, string nombretemporada)
        {
            return CrearExcelPdChart(tituloprincipal, listaEstilos, listaTelas, listaTelasColor, listaproyectotelacolor, listaproyectotela_proceso,
            listaProcesos, listaProcesoxColor, listaEstiloxArte, listaArtexColor,
            listaEstiloxTrim, listaTrimColor, listaRequerimiento, listaRequerimientoDetalle, listrequerimientocomentario, listaCallout, listaestiloxcombo, listaestiloxcombocolor,
            listaestiloxfabriccombo, listaestiloxfabriccombocolor,
            titulos_cabecera_reporte, nombrecliente, nombredivision, nombretemporada);
        }

        private byte[] CrearExcelPdChart(string tituloprincipal, List<Estilo> listaEstilos, List<FichaTecnica> listaTelas, List<FichaTecnicaColor_LabDip> listaTelasColor,
            List<FichaTecnicaColor_LabDip> listaproyectotelacolor, List<ProyectoTela_Proceos> listaproyectotela_proceso,
            List<EstiloxProceso> listaProcesos, List<EstiloxProcesoColor> listaProcesoxColor, List<EstiloxArte> listaEstiloxArte, List<EstiloxArteColor> listaArtexColor,
            List<EstiloxTrim> listaEstiloxTrim, List<EstiloxTrimColor> listaTrimColor, List<Requerimiento_pdchart> listaRequerimiento, List<RequerimientoDetalle_pdchart> listaRequerimientoDetalle,
            List<RequerimientoComentario_pdchart> listarequerimientocomentario, List<Callout> listaCallout, List<EstiloxCombo> listaestiloxcombo, List<EstiloxComboColor> listaestiloxcombocolor,
            List<EstiloxFabricCombo> listaestiloxfabriccombo, List<EstiloxFabricComboColor> listaestiloxfabriccombocolor,
            string titulos_cabecera_reporte, string nombrecliente, string nombredivision, string nombretemporada)
        {
            byte[] byteexcel = null;

            try
            {
                using (ExcelPackage package = new ExcelPackage())
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(tituloprincipal);
                    // TAMAÑO DE LETRA POR DEFECTO EN TODA LA PAGINA DEL EXCEL
                    worksheet.Cells.Style.Font.Size = 8;

                    Image image = Image.FromFile(System.Web.HttpContext.Current.Server.MapPath("~/Content/img/logos/WTSLogo.png"));
                    ExcelPicture pic = worksheet.Drawings.AddPicture("logowts", image);
                    pic.SetPosition(1, 0, 0, 0);
                    pic.SetSize(200, 80);

                    // PINTAR DATOS DEL FILTRO
                    const int inicio_fila_datosfiltro = 6;
                    const int inicio_columna_datosfiltro = 1;
                    int inicio_fila_datosfiltro_dinamico = inicio_fila_datosfiltro;
                    // TITULOS - LABEL
                    worksheet.Cells[inicio_fila_datosfiltro_dinamico, inicio_columna_datosfiltro].Value = "CLIENT";
                    worksheet.Cells[inicio_fila_datosfiltro_dinamico + 1, inicio_columna_datosfiltro].Value = "DIVISION";
                    worksheet.Cells[inicio_fila_datosfiltro_dinamico + 2, inicio_columna_datosfiltro].Value = "SEASON";
                    // PINTAR EN NEGRITA LOS TITULOS - LABEL
                    worksheet.Cells[inicio_fila_datosfiltro_dinamico, inicio_columna_datosfiltro, inicio_fila_datosfiltro_dinamico + 2, inicio_columna_datosfiltro].Style.Font.Bold = true;


                    // VALORES
                    worksheet.Cells[inicio_fila_datosfiltro_dinamico, inicio_columna_datosfiltro + 1].Value = nombrecliente;
                    worksheet.Cells[inicio_fila_datosfiltro_dinamico + 1, inicio_columna_datosfiltro + 1].Value = nombredivision;
                    worksheet.Cells[inicio_fila_datosfiltro_dinamico + 2, inicio_columna_datosfiltro + 1].Value = nombretemporada;


                    string[] arrayTitulosCabeceras = titulos_cabecera_reporte.Split('¬');

                    const int filainicial_matriz = 10;
                    const int columnainicial_matriz = 1;
                    int calculo_ultima_fila_segun_maximafilaporestilo = 0;  // ESTA VARIABLE ES PARA SABER DONDE EMPIEZA EL 2DO, 3CERO ESTILO.
                    int filadinamica_cabecera = filainicial_matriz;
                    int columnadinamica_cabecera = columnainicial_matriz;
                    int totalcabeceras = arrayTitulosCabeceras.Length;
                    
                    List<ClsIndiceColumnasCampo> listSeteadosInicioColumnas = new List<ClsIndiceColumnasCampo>();

                    for (int i = 0; i < totalcabeceras; i++)
                    {
                        string[] arraytitulo = arrayTitulosCabeceras[i].Split('|');
                        worksheet.Cells[filadinamica_cabecera, columnadinamica_cabecera].Value = arraytitulo[0];
                        // LISTA SETEADA CON NOMBRE DE COLUMNAS Y SU INDICE DE COLUMMA DONDE EMPIEZA A PINTAR; ME SIRVIO PARA FABRIC COMBO 
                        listSeteadosInicioColumnas.Add(new ClsIndiceColumnasCampo() {
                                Campo = arraytitulo[0], IndiceColumna = columnadinamica_cabecera
                            }
                        );
                        if (Convert.ToInt32(arraytitulo[1]) > 1)
                        {  // CONBINAR CELDAS
                            int cantidad_combinacion = Convert.ToInt32(arraytitulo[1]), indice_ultimafilacombinacion = columnadinamica_cabecera + (cantidad_combinacion - 1);
                            worksheet.Cells[filadinamica_cabecera, columnadinamica_cabecera, filadinamica_cabecera, indice_ultimafilacombinacion].Merge = true;
                            worksheet.Cells[filadinamica_cabecera, columnadinamica_cabecera, filadinamica_cabecera, indice_ultimafilacombinacion].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            columnadinamica_cabecera = indice_ultimafilacombinacion;
                        }
                        
                        columnadinamica_cabecera++;
                    }
                    // BACKGROUNDCOLOR CABECERA
                    int indicecolumna_fin_cabecera_pintarfondo = columnadinamica_cabecera - 1;  // LO RESTO MENOS 1 POR QUE EN EL BUCLE CONTINUA Y NO ES EL VALOR REAL DEL ULTIMA COLUMNA

                    Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#305496");
                    worksheet.Cells[filainicial_matriz, columnainicial_matriz, filainicial_matriz, indicecolumna_fin_cabecera_pintarfondo].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[filainicial_matriz, columnainicial_matriz, filainicial_matriz, indicecolumna_fin_cabecera_pintarfondo].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                    worksheet.Cells[filainicial_matriz, columnainicial_matriz, filainicial_matriz, indicecolumna_fin_cabecera_pintarfondo].Style.Font.Color.SetColor(Color.White);
                    worksheet.Cells[filainicial_matriz, columnainicial_matriz, filainicial_matriz, indicecolumna_fin_cabecera_pintarfondo].Style.Font.Bold = true;

                    // LLENAR Y PINTAR EL DETALLE
                    int indicedinamico_inicio_fila_detalle = filainicial_matriz + 1, indicedinamico_inicio_columna_detalle = columnainicial_matriz;
                    // VARIABLES PARA SABER DONDE TERMINA Y DONDE FINALIZAR CADA TELA, PROCESO, TRIMS, SAMPLES
                    int indicedinamico_inicio_fila_detalle_telas = 0, indicedinamico_inicio_fila_detalle_procesos = 0, indicedinamico_inicio_fila_detalle_arte = 0,
                        indicedinamico_inicio_fila_detalle_trim = 0, indicedinamico_inicio_fila_detalle_req = 0, indicedinamico_inicio_fila_generalinfo = 0,
                        indicedinamico_inicio_fila_imagenestilo = 0, indicedinamico_inicio_fila_detalle_callout = 0, indicedinamico_inicio_fila_detalle_estiloxcombo = 0,
                        indicedinamico_inicio_fila_detalle_estiloxfabriccombo = 0;

                    if (listaEstilos != null)
                    {
                        int totalestilos = listaEstilos.Count, contador_filas_estilo = 0;

                        // PREDETERMINAR ANCHO DE COLUMNAS POR DEFECTO
                        worksheet.Column(1).Width = 13;  // ANCHO DE LA PRIMERA COLUMNA
                        worksheet.Column(2).Width = 22; // APLIAR ANCHO COLUMNA DE LA IMAGEN

                        foreach (var item_estilos in listaEstilos)
                        {  // ESTILOS
                            contador_filas_estilo++;

                            if (contador_filas_estilo == 1)
                            {
                                indicedinamico_inicio_fila_detalle = filainicial_matriz + 1;  // SOLO PARA LA PRIMERA VEZ USO EL VALOR FILA DE INICIO DE LA MATRIZ
                                indicedinamico_inicio_fila_detalle_telas = filainicial_matriz + 1;
                                indicedinamico_inicio_fila_detalle_procesos = filainicial_matriz + 1;
                                indicedinamico_inicio_fila_detalle_arte = filainicial_matriz + 1;
                                indicedinamico_inicio_fila_detalle_trim = filainicial_matriz + 1;
                                indicedinamico_inicio_fila_detalle_req = filainicial_matriz + 1;
                                indicedinamico_inicio_fila_generalinfo = filainicial_matriz + 1;
                                indicedinamico_inicio_fila_imagenestilo = filainicial_matriz + 1;
                                indicedinamico_inicio_fila_detalle_callout = filainicial_matriz + 1;
                                indicedinamico_inicio_fila_detalle_estiloxcombo = filainicial_matriz + 1;
                                indicedinamico_inicio_fila_detalle_estiloxfabriccombo = filainicial_matriz + 1;
                            }
                            else
                            {
                                indicedinamico_inicio_fila_detalle = calculo_ultima_fila_segun_maximafilaporestilo;
                                indicedinamico_inicio_fila_detalle_telas = indicedinamico_inicio_fila_detalle;
                                indicedinamico_inicio_fila_detalle_procesos = indicedinamico_inicio_fila_detalle;
                                indicedinamico_inicio_fila_detalle_arte = indicedinamico_inicio_fila_detalle;
                                indicedinamico_inicio_fila_detalle_trim = indicedinamico_inicio_fila_detalle;
                                indicedinamico_inicio_fila_detalle_req = indicedinamico_inicio_fila_detalle;
                                indicedinamico_inicio_fila_generalinfo = indicedinamico_inicio_fila_detalle;
                                indicedinamico_inicio_fila_imagenestilo = indicedinamico_inicio_fila_detalle;
                                indicedinamico_inicio_fila_detalle_callout = indicedinamico_inicio_fila_detalle;
                                indicedinamico_inicio_fila_detalle_estiloxcombo = indicedinamico_inicio_fila_detalle;
                                indicedinamico_inicio_fila_detalle_estiloxfabriccombo = indicedinamico_inicio_fila_detalle;
                            }
                            worksheet.Cells[indicedinamico_inicio_fila_detalle, indicedinamico_inicio_columna_detalle].Value = item_estilos.codigoestilo;

                            // AQUI PINTAR LA IMAGEN DEL ESTILO
                            // SE HACE ESTO PARA PODER HACER EL AUTOFIT DE COLUMNAS; PARA QUE LA COLUMNA DE IMAGEN TENGA DATO POR DEFECTO Y SE AUTOAJUSTE
                            if (contador_filas_estilo == 1)
                            {
                                worksheet.Cells[indicedinamico_inicio_fila_imagenestilo, 2].Value = "aaaaaaaaaaaaaaaaaaaaaaaaaaa";
                                worksheet.Cells[indicedinamico_inicio_fila_imagenestilo, 2].Style.Font.Color.SetColor(Color.White);
                            }
                            PintarImagenEstilo(indicedinamico_inicio_fila_imagenestilo, item_estilos, worksheet, contador_filas_estilo);

                            // AQUI GENERAL INFO
                            PintarGeneralInfo(indicedinamico_inicio_fila_generalinfo, item_estilos, worksheet);

                            int contadortelas = 0, contadoradditional_procesos = 0, contadorarte = 0, contadortrim = 0, contador_req = 0, contadorestiloxcombo = 0, contadorestiloxfabriccombo = 0;
                            if (listaTelas != null)
                            {
                                List<FichaTecnica> listatelas_pintar = listaTelas.FindAll(x => x.idestilo == item_estilos.idestilo);
                                foreach (var item_tela in listatelas_pintar)
                                {  // TELAS
                                    contadortelas++;
                                    List<FichaTecnicaColor_LabDip> listatelacolor_pintar = null;
                                    List<FichaTecnicaColor_LabDip> listaproyectotelacolor_pintar = null;
                                    List<ProyectoTela_Proceos> listaproyectotela_proceso_pintar = null;
                                    if (item_tela.origen == "fichatecnica")
                                    {
                                        if (listaTelasColor != null)
                                        {
                                            listatelacolor_pintar = listaTelasColor.FindAll(y => y.idtela == item_tela.idfichatecnica && y.idestilo == item_estilos.idestilo);
                                        }
                                    }
                                    else if (item_tela.origen == "proyecto")
                                    {
                                        if (listaproyectotela_proceso != null)
                                        {
                                            listaproyectotela_proceso_pintar = listaproyectotela_proceso.FindAll(y => y.idtela == item_tela.idfichatecnica && y.idestilo == item_estilos.idestilo);
                                        }

                                        if (listaproyectotelacolor != null)
                                        {
                                            listaproyectotelacolor_pintar = listaproyectotelacolor.FindAll(y => y.idtela == item_tela.idfichatecnica && y.idestilo == item_estilos.idestilo);
                                        }
                                    }

                                    PintarTelas(ref indicedinamico_inicio_fila_detalle_telas, worksheet, item_tela, listatelacolor_pintar, listaproyectotelacolor_pintar, listaproyectotela_proceso_pintar, contadortelas);
                                    indicedinamico_inicio_fila_detalle_telas = indicedinamico_inicio_fila_detalle_telas + 1;
                                }
                            }

                            // PINTAR FABRIC COMBO
                            if (listaestiloxfabriccombo != null)
                            {
                                List<EstiloxFabricCombo> listaestiloxfabriccombo_pintar = listaestiloxfabriccombo.FindAll(x => x.idestilo == item_estilos.idestilo);
                                foreach (var item_estiloxfabriccombo in listaestiloxfabriccombo_pintar)
                                {
                                    List<EstiloxFabricComboColor> listaestiloxfabriccombocolor_pintar = null;
                                    contadorestiloxfabriccombo++;
                                    if (listaestiloxfabriccombocolor != null)
                                    {
                                        listaestiloxfabriccombocolor_pintar = listaestiloxfabriccombocolor.FindAll(y => y.idestilo == item_estilos.idestilo && y.idestilofabriccombo == item_estiloxfabriccombo.idestilofabriccombo);
                                    }

                                    pintarestiloxfabriccombo(ref indicedinamico_inicio_fila_detalle_estiloxfabriccombo, worksheet, item_estiloxfabriccombo, listaestiloxfabriccombocolor_pintar, contadorestiloxfabriccombo);
                                    indicedinamico_inicio_fila_detalle_estiloxfabriccombo = indicedinamico_inicio_fila_detalle_estiloxfabriccombo + 1;
                                }
                            }
                            
                            int columnaestilofabriccombo = listSeteadosInicioColumnas.Find(x => x.Campo == "FABRIC COMBINATION").IndiceColumna;

                            // DATOS FABRIC COMBO
                            string datos_estilos_fabriccombo = item_estilos.datosfabriccombo;
                            //LABEL 
                            string[] arrDatosCombo = datos_estilos_fabriccombo.Split('|');
                            worksheet.Cells[indicedinamico_inicio_fila_detalle_estiloxfabriccombo, columnaestilofabriccombo].Value = arrDatosCombo[0];
                            worksheet.Cells[indicedinamico_inicio_fila_detalle_estiloxfabriccombo, columnaestilofabriccombo + 1].Value = arrDatosCombo[1];
                            indicedinamico_inicio_fila_detalle_estiloxfabriccombo++;
                            PintarImagenFabricCombo(indicedinamico_inicio_fila_detalle_estiloxfabriccombo, columnaestilofabriccombo - 1, item_estilos, worksheet, contador_filas_estilo);
                            

                            // PINTAR COMBINACION
                            if (listaestiloxcombo != null)
                            {
                                List<EstiloxCombo> listaestiloxcombo_pintar = listaestiloxcombo.FindAll(x => x.idestilo == item_estilos.idestilo);
                                foreach (var item_estiloxcombo in listaestiloxcombo_pintar)
                                {
                                    List<EstiloxComboColor> listaestiloxcombocolor_pintar = null;
                                    contadorestiloxcombo++;
                                    if (listaestiloxcombocolor != null)
                                    {
                                        listaestiloxcombocolor_pintar = listaestiloxcombocolor.FindAll(y => y.idestilo == item_estilos.idestilo && y.idestilocombo == item_estiloxcombo.idestilocombo);
                                    }

                                    pintarestiloxcombo(ref indicedinamico_inicio_fila_detalle_estiloxcombo, worksheet, item_estiloxcombo, listaestiloxcombocolor_pintar, contadorestiloxcombo);
                                    indicedinamico_inicio_fila_detalle_estiloxcombo = indicedinamico_inicio_fila_detalle_estiloxcombo + 1;
                                }
                            }

                            // ADDITIONAL PROCESS
                            if (listaProcesos != null)
                            {
                                List<EstiloxProceso> listaadditionaprocesos_pintar = listaProcesos.FindAll(x => x.idestilo == item_estilos.idestilo);
                                foreach (var item_additionalprocesos in listaadditionaprocesos_pintar)
                                {
                                    List<EstiloxProcesoColor> listaadditionalprocesocolor_pintar = null;
                                    contadoradditional_procesos++;
                                    if (listaProcesoxColor != null)
                                    {
                                        listaadditionalprocesocolor_pintar = listaProcesoxColor.FindAll(y => y.idestilo == item_estilos.idestilo && y.idestiloproceso == item_additionalprocesos.idestiloproceso);
                                    }

                                    pintaradditional_procesos(ref indicedinamico_inicio_fila_detalle_procesos, worksheet, item_additionalprocesos, listaadditionalprocesocolor_pintar, contadoradditional_procesos);
                                    indicedinamico_inicio_fila_detalle_procesos = indicedinamico_inicio_fila_detalle_procesos + 1;
                                }
                            }

                            // ARTWORK
                            if (listaEstiloxArte != null)
                            {
                                List<EstiloxArte> listaarte_pintar = listaEstiloxArte.FindAll(x => x.idestilo == item_estilos.idestilo);
                                foreach (var item_arte in listaarte_pintar)
                                {
                                    List<EstiloxArteColor> listaartecolor_pintar = null;
                                    contadorarte++;
                                    if (listaArtexColor != null)
                                    {
                                        listaartecolor_pintar = listaArtexColor.FindAll(y => y.idestilo == item_estilos.idestilo && y.idestiloarte == item_arte.idestiloarte);
                                    }

                                    pintarestilo_arte(ref indicedinamico_inicio_fila_detalle_arte, worksheet, item_arte, listaartecolor_pintar, contadorarte);
                                    indicedinamico_inicio_fila_detalle_arte = indicedinamico_inicio_fila_detalle_arte + 1;
                                }
                            }

                            // TRIM
                            if (listaEstiloxTrim != null)
                            {
                                List<EstiloxTrim> listatrim_pintar = listaEstiloxTrim.FindAll(x => x.idestilo == item_estilos.idestilo);
                                foreach (var item_trim in listatrim_pintar)
                                {
                                    List<EstiloxTrimColor> listatrimcolor_pintar = null;
                                    contadortrim++;
                                    if (listaTrimColor != null)
                                    {
                                        listatrimcolor_pintar = listaTrimColor.FindAll(y => y.idestilo == item_estilos.idestilo && y.idestilotrim == item_trim.idestilotrim);
                                    }

                                    pintarestilo_trim(ref indicedinamico_inicio_fila_detalle_trim, worksheet, item_trim, listatrimcolor_pintar, contadortrim);
                                    indicedinamico_inicio_fila_detalle_trim = indicedinamico_inicio_fila_detalle_trim + 1;
                                }
                            }

                            // REQUERIMIENTOS = SAMPLES
                            if (listaRequerimiento != null)
                            {
                                List<Requerimiento_pdchart> listareq_pintar = listaRequerimiento.FindAll(x => x.idestilo == item_estilos.idestilo);
                                foreach (var item_req in listareq_pintar)
                                {
                                    List<RequerimientoDetalle_pdchart> listarequerimientocolor_pintar = null;
                                    List<RequerimientoComentario_pdchart> listarequerimientocomentario_pintar = null;
                                    contador_req++;
                                    if (listaRequerimientoDetalle != null)
                                    {
                                        listarequerimientocolor_pintar = listaRequerimientoDetalle.FindAll(y => y.idestilo == item_estilos.idestilo && y.idrequerimiento == item_req.idrequerimiento);
                                    }

                                    if (listarequerimientocomentario != null) {
                                        listarequerimientocomentario_pintar = listarequerimientocomentario.FindAll(y => y.idestilo == item_estilos.idestilo && y.idrequerimiento == item_req.idrequerimiento);
                                    }

                                    pintarestilo_requerimiento(ref indicedinamico_inicio_fila_detalle_req, worksheet, item_req, listarequerimientocolor_pintar, listarequerimientocomentario_pintar, contador_req);
                                    indicedinamico_inicio_fila_detalle_req = indicedinamico_inicio_fila_detalle_req + 1;
                                }
                            }

                            // CALLOUT
                            if (listaCallout != null)
                            {
                                List<Callout> listacallout_pintar = listaCallout.FindAll(x => x.idestilo == item_estilos.idestilo);
                                PintarCallout(ref indicedinamico_inicio_fila_detalle_callout, worksheet, listacallout_pintar);
                            }


                            // PREGUNTAR SI SE VA A SEGUIR CONTANDO
                            if (contador_filas_estilo < totalestilos)
                            {
                                if (contador_filas_estilo == 1)
                                {
                                    calculo_ultima_fila_segun_maximafilaporestilo = (filainicial_matriz + 1) + item_estilos.totalfilas_x_estilo;  // PARA EL PROXIMO ESTILO COMIENZA EN ESTE VALOR CALCULADO
                                }
                                else
                                {
                                    calculo_ultima_fila_segun_maximafilaporestilo = calculo_ultima_fila_segun_maximafilaporestilo + item_estilos.totalfilas_x_estilo;
                                }
                            }
                            else if (contador_filas_estilo == totalestilos)
                            {  // ESTA CONDICION ME VA A SERVIR PARA PINTAR LAS LINEAS
                                if (calculo_ultima_fila_segun_maximafilaporestilo == 0)
                                {
                                    calculo_ultima_fila_segun_maximafilaporestilo = (filainicial_matriz + 1) + item_estilos.totalfilas_x_estilo;
                                }
                                else
                                {
                                    calculo_ultima_fila_segun_maximafilaporestilo = calculo_ultima_fila_segun_maximafilaporestilo + item_estilos.totalfilas_x_estilo;
                                }
                            }

                            // :NOTA: calculo_ultima_fila_segun_maximafilaporestilo ESTA VARIABLE ES DONDE EMPIEZA PINTANRSE EL DETALLE POR CADA ESTILO, LO CUAL ES DINAMICO
                            //          PERO NO DONDE SE DEBE PINTAR LAS LINEAS; POR LO TANTO SE DEBE RESTAR MENOS 1 PARA QUE SEA EXACTO LA PINTADA DE LINEA FINA POR CADA ESTILO
                            // border bottom
                            worksheet.Cells[calculo_ultima_fila_segun_maximafilaporestilo - 1, columnainicial_matriz, calculo_ultima_fila_segun_maximafilaporestilo - 1, indicecolumna_fin_cabecera_pintarfondo].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        }

                        calculo_ultima_fila_segun_maximafilaporestilo = calculo_ultima_fila_segun_maximafilaporestilo - 1;
                        PintarLineasMargenes_columnas(titulos_cabecera_reporte, filainicial_matriz, columnainicial_matriz, calculo_ultima_fila_segun_maximafilaporestilo, indicecolumna_fin_cabecera_pintarfondo, worksheet);
                    }
                    // AUTOFIT DE COLUMNAS PARA TODA LA PAGINA
                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
                    byteexcel = package.GetAsByteArray();
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }

            return byteexcel;
        }

        private void PintarTelas(ref int indicedinamico_inicio_fila_detalle, ExcelWorksheet pObjWorksheet, FichaTecnica pObjTela, List<FichaTecnicaColor_LabDip> listaTelasColor,
            List<FichaTecnicaColor_LabDip> listaProyectotelaColor, List<ProyectoTela_Proceos> listaProyectoTela_Proceso, int pNumeroTela)
        {
            string tituloscabecera = pObjTela.titulos_cabecera;
            string[] arraytitulos = tituloscabecera.Split('¬');
            int indicefila_inicio = indicedinamico_inicio_fila_detalle;
            int cons_indicecolumna_inicio = pObjTela.indicecolumna_dondeempieza_apintar;  // ESTE
            int indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
            int totallabel_cabecera_telas = pObjTela.total_label;
            int indicefila_proceso = 0, indicefila_proceso_detalle = 0, indicefila_tela_color = 0, indicefila_color_detalle = 0;

            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = "FABRIC " + pNumeroTela.ToString();
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
            // BACKGROUNDCOLOR CABECERA CELDA - SUBTITULO
            Color colorcabeceracelda = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.PatternType = ExcelFillStyle.Solid;
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.BackgroundColor.SetColor(colorcabeceracelda);

            for (int i = 0; i < arraytitulos.Length; i++)
            {
                indicefila_inicio++;
                string[] arraytitulo = arraytitulos[i].Split('|');
                // NOMBRE LABEL
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = arraytitulo[0];
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
                // VALOR
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico + 1].Value = arraytitulo[1];
            }

            // INDEX DE DONDE EMPIEZA A PINTAR LOS DATOS DEL DETALLE COMO EL DE PROCESO Y DE COLORES
            indicefila_tela_color = indicedinamico_inicio_fila_detalle + totallabel_cabecera_telas; // ESTE VA A SER UNA VARIABLE CONSTANTE INAMOVIBLE
            indicefila_color_detalle = indicedinamico_inicio_fila_detalle + totallabel_cabecera_telas;

            if (pObjTela.origen == "fichatecnica")
            {
                if (listaTelasColor != null)
                {
                    if (listaTelasColor.Count > 0)
                    {
                        // CALCULAR INDICE FILA TELA COLOR
                        indicefila_color_detalle = indicefila_tela_color + 1;

                        string[] arraycabecera_color = pObjTela.titulos_cabecera_telacolor.Split('¬');
                        int totalcabeceras_color = arraycabecera_color.Length;
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        int indice_ultima_columna_detallecolor = cons_indicecolumna_inicio + (totalcabeceras_color - 1);
                        for (int i = 0; i < totalcabeceras_color; i++)
                        {  // CABECERA DE COLOR
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = arraycabecera_color[i];
                            indicecolumna_inicio_dinamico++;
                        }
                        // BACKGROUNDCOLOR CABECERA TABLA PROCESO
                        Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                        pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                        pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Font.Bold = true;

                        // LLENAR DETALLE COLOR TELA
                        indicefila_color_detalle++;
                        foreach (var item_color in listaTelasColor)
                        {
                            indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.color;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.tipolabdip;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.aprobadopor;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = "";
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = "";
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.estadocolor;
                            indicefila_color_detalle++;
                        }
                    }
                }
            }
            else if (pObjTela.origen == "proyecto")
            {
                if (listaProyectoTela_Proceso != null)
                {  // PINTAR PROYECTO TELA PROCESO
                   // CALCULAR INDICE FILA PROCESO
                   //indicefila_proceso = indicedinamico_inicio_fila_detalle + totallabel_cabecera_telas + 1;
                    indicefila_color_detalle = indicefila_tela_color + 1;

                    if (listaProyectoTela_Proceso.Count > 0)
                    {
                        string[] arraycabecera_proceso = pObjTela.titulos_cabecera_proyectotela_proceso.Split('¬');
                        int totalcabeceras_procesos = arraycabecera_proceso.Length;
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        int indice_ultimacolumnacombinacion = 0;
                        for (int i = 0; i < totalcabeceras_procesos; i++)
                        {
                            string[] arraytitulo = arraycabecera_proceso[i].Split('|');
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = arraytitulo[0];
                            if (Convert.ToInt32(arraytitulo[1]) > 1)
                            {  // CONBINAR CELDAS
                                int cantidad_combinacion = Convert.ToInt32(arraytitulo[1]);
                                indice_ultimacolumnacombinacion = indicecolumna_inicio_dinamico + (cantidad_combinacion - 1);
                                pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico, indicefila_color_detalle, indice_ultimacolumnacombinacion].Merge = true;
                                pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico, indicefila_color_detalle, indice_ultimacolumnacombinacion].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                indicecolumna_inicio_dinamico = indice_ultimacolumnacombinacion;
                            }
                            indicecolumna_inicio_dinamico++;
                        }
                        // BACKGROUNDCOLOR CABECERA TABLA PROCESO
                        Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                        pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultimacolumnacombinacion].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultimacolumnacombinacion].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                        pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultimacolumnacombinacion].Style.Font.Bold = true;

                        // LLENAR DETALLE DEL PROCESO
                        //indicefila_proceso_detalle = indicefila_proceso + 1;
                        indicefila_color_detalle++;
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        foreach (var item_proceso in listaProyectoTela_Proceso)
                        {
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_proceso.nombreproceso;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico + 1].Value = item_proceso.comentario;
                            // COMBINAR CELDA
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico + 1, indicefila_color_detalle, indice_ultimacolumnacombinacion].Merge = true;
                            indicefila_color_detalle++;
                        }
                    }
                }

                if (listaProyectotelaColor != null)
                {
                    if (listaProyectotelaColor.Count > 0)
                    {
                        //indicefila_tela_color = indicefila_proceso_detalle + 1;
                        indicefila_color_detalle++;

                        string[] arraycabecera_color = pObjTela.titulos_cabecera_telacolor.Split('¬');
                        int totalcabeceras_color = arraycabecera_color.Length;
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        int indice_ultima_columna_detallecolor = cons_indicecolumna_inicio + (totalcabeceras_color - 1);
                        for (int i = 0; i < totalcabeceras_color; i++)
                        {  // CABECERA DE COLOR
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = arraycabecera_color[i];
                            indicecolumna_inicio_dinamico++;
                        }
                        // BACKGROUNDCOLOR CABECERA TABLA PROCESO
                        Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                        pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                        pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Font.Bold = true;

                        // LLENAR DETALLE COLOR TELA
                        //indicefila_color_detalle = indicefila_tela_color + 1;
                        indicefila_color_detalle++;

                        foreach (var item_color in listaProyectotelaColor)
                        {
                            indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.color;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.tipolabdip;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.standard;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.aprobadopor;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.nombreproveedor_dyeinghouse;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.codigoclientetemporada;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.alternativa;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.dyinghousecode;
                            indicecolumna_inicio_dinamico++;
                            pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.estadocolor;
                            indicefila_color_detalle++;
                        }
                    }
                }
            }

            //indicedinamico_inicio_fila_detalle = indicefila_inicio;
            indicedinamico_inicio_fila_detalle = indicefila_color_detalle;
        }

        private void pintaradditional_procesos(ref int indicedinamico_inicio_fila_detalle_procesos, ExcelWorksheet pObjWorksheet, EstiloxProceso pObjAdditionalProcesos, List<EstiloxProcesoColor> listaadditionalprocesocolor_pintar, int pContadoradditional_procesos)
        {
            string tituloscabecera = pObjAdditionalProcesos.titulos_cabecera;
            string[] arraytitulos = tituloscabecera.Split('¬');
            int indicefila_inicio = indicedinamico_inicio_fila_detalle_procesos;
            int cons_indicecolumna_inicio = pObjAdditionalProcesos.indicecolumna_dondeempieza_apintar;  // ESTE
            int indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
            int totallabel_cabecera_telas = pObjAdditionalProcesos.total_label;
            int indicefila_proceso_detalle = 0, indicefila_tela_color = 0, indicefila_color_detalle = 0;

            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = "PROCESS " + pContadoradditional_procesos.ToString();
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
            // BACKGROUNDCOLOR CABECERA CELDA - SUBTITULO
            Color colorcabeceracelda = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.PatternType = ExcelFillStyle.Solid;
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.BackgroundColor.SetColor(colorcabeceracelda);

            for (int i = 0; i < arraytitulos.Length; i++)
            {
                indicefila_inicio++;
                string[] arraytitulo = arraytitulos[i].Split('|');
                // NOMBRE LABEL
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = arraytitulo[0];
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
                // VALOR
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico + 1].Value = arraytitulo[1];
            }

            // CALCULAR INDICE FILA PROCESO
            //indicefila_proceso = indicedinamico_inicio_fila_detalle_procesos + totallabel_cabecera_telas + 1;
            //indicefila_proceso_detalle = indicefila_inicio + 1;
            indicefila_color_detalle = indicedinamico_inicio_fila_detalle_procesos + totallabel_cabecera_telas;
            if (listaadditionalprocesocolor_pintar != null)
            {  // PINTAR LOS COLRES DEL PROCESO
                if (listaadditionalprocesocolor_pintar.Count > 0)
                {
                    //indicefila_tela_color = indicefila_proceso_detalle + 1;
                    indicefila_color_detalle++;
                    string[] arraycabecera_color = pObjAdditionalProcesos.titulos_cabecera_color.Split('¬');
                    int totalcabeceras_color = arraycabecera_color.Length;
                    indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                    int indice_ultima_columna_detallecolor = cons_indicecolumna_inicio + (totalcabeceras_color - 1);
                    // CABECERA DE COLOR
                    for (int i = 0; i < totalcabeceras_color; i++)
                    {
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = arraycabecera_color[i];
                        indicecolumna_inicio_dinamico++;
                    }
                    // BACKGROUNDCOLOR CABECERA TABLA PROCESO
                    Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Font.Bold = true;

                    // LLENAR DETALLE COLOR TELA
                    //indicefila_color_detalle = indicefila_tela_color + 1;
                    indicefila_color_detalle++;
                    foreach (var item_color in listaadditionalprocesocolor_pintar)
                    {
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.color;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.status;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.comentario;
                        indicecolumna_inicio_dinamico++;
                        indicefila_color_detalle++;
                    }
                }
            }
            indicedinamico_inicio_fila_detalle_procesos = indicefila_color_detalle;
        }

        private void pintarestilo_arte(ref int indicedinamico_inicio_fila_detalle_arte, ExcelWorksheet pObjWorksheet, EstiloxArte pObjEstiloxArte, List<EstiloxArteColor> listaartecolor_pintar, int pContadorarte)
        {
            string tituloscabecera = pObjEstiloxArte.titulos_cabecera;
            string[] arraytitulos = tituloscabecera.Split('¬');
            int indicefila_inicio = indicedinamico_inicio_fila_detalle_arte;
            int cons_indicecolumna_inicio = pObjEstiloxArte.indicecolumna_dondeempieza_apintar;  // ESTE
            int indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
            int totallabel_cabecera_telas = pObjEstiloxArte.total_label;
            int indicefila_proceso_detalle = 0, indicefila_tela_color = 0, indicefila_color_detalle = 0;

            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = "ARTWORK " + pContadorarte.ToString();
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
            // BACKGROUNDCOLOR CABECERA CELDA - SUBTITULO
            Color colorcabeceracelda = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.PatternType = ExcelFillStyle.Solid;
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.BackgroundColor.SetColor(colorcabeceracelda);

            for (int i = 0; i < arraytitulos.Length; i++)
            {
                indicefila_inicio++;
                string[] arraytitulo = arraytitulos[i].Split('|');
                // NOMBRE LABEL
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = arraytitulo[0];
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
                // VALOR
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico + 1].Value = arraytitulo[1];
            }

            // CALCULAR INDICE FILA ARTWORK
            //indicefila_proceso_detalle = indicefila_inicio + 1;
            indicefila_color_detalle = indicedinamico_inicio_fila_detalle_arte + totallabel_cabecera_telas;
            if (listaartecolor_pintar != null)
            {  // PINTAR LOS COLRES DEL PROCESO
                if (listaartecolor_pintar.Count > 0)
                {
                    //indicefila_tela_color = indicefila_proceso_detalle + 1;
                    indicefila_color_detalle++;
                    string[] arraycabecera_color = pObjEstiloxArte.titulos_cabecera_color.Split('¬');
                    int totalcabeceras_color = arraycabecera_color.Length;
                    indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                    int indice_ultima_columna_detallecolor = cons_indicecolumna_inicio + (totalcabeceras_color - 1);
                    // CABECERA DE COLOR
                    for (int i = 0; i < totalcabeceras_color; i++)
                    {
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = arraycabecera_color[i];
                        indicecolumna_inicio_dinamico++;
                    }
                    // BACKGROUNDCOLOR CABECERA TABLA PROCESO
                    Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Font.Bold = true;

                    // LLENAR DETALLE COLOR TELA
                    //indicefila_color_detalle = indicefila_tela_color + 1;
                    indicefila_color_detalle++;
                    foreach (var item_color in listaartecolor_pintar)
                    {
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.color;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.status;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.comentario;
                        indicecolumna_inicio_dinamico++;
                        indicefila_color_detalle++;
                    }
                }
            }
            indicedinamico_inicio_fila_detalle_arte = indicefila_color_detalle;
        }

        private void pintarestilo_trim(ref int indicedinamico_inicio_fila_detalle_trim, ExcelWorksheet pObjWorksheet, EstiloxTrim pObjEstiloxTrim, List<EstiloxTrimColor> listatrimcolor_pintar, int pContadortrim)
        {
            string tituloscabecera = pObjEstiloxTrim.titulos_cabecera;
            string[] arraytitulos = tituloscabecera.Split('¬');
            int indicefila_inicio = indicedinamico_inicio_fila_detalle_trim;
            int cons_indicecolumna_inicio = pObjEstiloxTrim.indicecolumna_dondeempieza_apintar;  // ESTE
            int indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
            int totallabel_cabecera_telas = pObjEstiloxTrim.total_label;
            int indicefila_proceso_detalle = 0, indicefila_tela_color = 0, indicefila_color_detalle = 0;

            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = "TRIMS " + pContadortrim.ToString();
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
            // BACKGROUNDCOLOR CABECERA CELDA - SUBTITULO
            Color colorcabeceracelda = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.PatternType = ExcelFillStyle.Solid;
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.BackgroundColor.SetColor(colorcabeceracelda);

            for (int i = 0; i < arraytitulos.Length; i++)
            {
                indicefila_inicio++;
                string[] arraytitulo = arraytitulos[i].Split('|');
                // NOMBRE LABEL
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = arraytitulo[0];
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
                // VALOR
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico + 1].Value = arraytitulo[1];
            }

            // CALCULAR INDICE FILA ARTWORK
            //indicefila_proceso_detalle = indicefila_inicio + 1;
            indicefila_color_detalle = indicedinamico_inicio_fila_detalle_trim + totallabel_cabecera_telas;
            if (listatrimcolor_pintar != null)
            {  // PINTAR LOS COLRES DEL PROCESO
                if (listatrimcolor_pintar.Count > 0)
                {
                    //indicefila_tela_color = indicefila_proceso_detalle + 1;
                    indicefila_color_detalle++;
                    string[] arraycabecera_color = pObjEstiloxTrim.titulos_cabecera_color.Split('¬');
                    int totalcabeceras_color = arraycabecera_color.Length;
                    indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                    int indice_ultima_columna_detallecolor = cons_indicecolumna_inicio + (totalcabeceras_color - 1);
                    // CABECERA DE COLOR
                    for (int i = 0; i < totalcabeceras_color; i++)
                    {
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = arraycabecera_color[i];
                        indicecolumna_inicio_dinamico++;
                    }
                    // BACKGROUNDCOLOR CABECERA TABLA PROCESO
                    Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Font.Bold = true;

                    // LLENAR DETALLE COLOR TELA
                    //indicefila_color_detalle = indicefila_tela_color + 1;
                    indicefila_color_detalle++;
                    foreach (var item_color in listatrimcolor_pintar)
                    {
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.color;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.status;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.comentario;
                        indicecolumna_inicio_dinamico++;
                        indicefila_color_detalle++;
                    }
                }
            }
            indicedinamico_inicio_fila_detalle_trim = indicefila_color_detalle;
        }

        private void pintarestilo_requerimiento(ref int indicedinamico_inicio_fila_detalle_req, ExcelWorksheet pObjWorksheet, Requerimiento_pdchart pObjReq, List<RequerimientoDetalle_pdchart> listarequerimientocolor_pintar, List<RequerimientoComentario_pdchart> listarequerimientocomentario_pintar, int pContador_req)
        {
            string tituloscabecera = pObjReq.titulos_cabecera;
            string[] arraytitulos = tituloscabecera.Split('¬');
            int totalArrayTitulos = arraytitulos.Length;
            int indicefila_inicio = indicedinamico_inicio_fila_detalle_req;
            int cons_indicecolumna_inicio = pObjReq.indicecolumna_dondeempieza_apintar;  // ESTE
            int indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
            int totallabel_cabecera_telas = pObjReq.total_label;  // ESTE INCLUYE LOS TITULOS MAS EL TITULO SAMPLE 1, SAMPLE 2 ETC
            int indicefila_proceso_detalle = 0, indicefila_tela_color = 0, indicefila_color_detalle = 0, indicefila_req_comentario = 0;

            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = pObjReq.nombretipomuestra.ToUpper();
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
            // BACKGROUNDCOLOR CABECERA CELDA - SUBTITULO
            Color colorcabeceracelda = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.PatternType = ExcelFillStyle.Solid;
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.BackgroundColor.SetColor(colorcabeceracelda);

            totalArrayTitulos = totalArrayTitulos + 1;  // MAS 1 PORQUE SE AGREGA EL TITULO SAPLE 1; SAMPLE 2 ETC
            for (int i = 0; i < arraytitulos.Length; i++)
            {
                indicefila_inicio++;
                string[] arraytitulo = arraytitulos[i].Split('|');
                // NOMBRE LABEL
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = arraytitulo[0];
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
                // VALOR
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico + 1].Value = arraytitulo[1];
            }
            if (totalArrayTitulos < totallabel_cabecera_telas)
            {
                indicefila_inicio = indicefila_inicio + (totallabel_cabecera_telas - totalArrayTitulos);
            }

            // BACKGROUNDCOLOR CABECERA TABLA PROCESO
            Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
            // PINTAR DATOS DE SAMPLES COMENTARIO
            indicefila_req_comentario = indicefila_inicio + 1;
            if (listarequerimientocomentario_pintar != null)
            {  // PINTAR COMENTARIO DE REQUERIMIENTO
                if (listarequerimientocomentario_pintar.Count > 0)
                {
                    indicefila_req_comentario++;
                    string[] arraycabecera_comentario = pObjReq.titulos_cabecera_comentario.Split('¬');
                    int totalcabeceras_comentario = arraycabecera_comentario.Length;
                    indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                    int indice_ultima_columna_detallecomentario = cons_indicecolumna_inicio + (totalcabeceras_comentario - 1);
                    // CABECERA SAMPLE - REQ COMENTARIO
                    for (int i = 0; i < totalcabeceras_comentario; i++)
                    {
                        pObjWorksheet.Cells[indicefila_req_comentario, indicecolumna_inicio_dinamico].Value = arraycabecera_comentario[i];
                        indicecolumna_inicio_dinamico++;
                    }
                    //// BACKGROUNDCOLOR CABECERA TABLA PROCESO
                    //Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                    pObjWorksheet.Cells[indicefila_req_comentario, cons_indicecolumna_inicio, indicefila_req_comentario, indice_ultima_columna_detallecomentario].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    pObjWorksheet.Cells[indicefila_req_comentario, cons_indicecolumna_inicio, indicefila_req_comentario, indice_ultima_columna_detallecomentario].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                    pObjWorksheet.Cells[indicefila_req_comentario, cons_indicecolumna_inicio, indicefila_req_comentario, indice_ultima_columna_detallecomentario].Style.Font.Bold = true;
                    // LLENAR DETALLE COMENTARIO DEL REQUERIMIENTO
                    indicefila_req_comentario++;
                    foreach (var item_comentario in listarequerimientocomentario_pintar)
                    {
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        pObjWorksheet.Cells[indicefila_req_comentario, indicecolumna_inicio_dinamico].Value = item_comentario.Comentario;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_req_comentario, indicecolumna_inicio_dinamico].Value = item_comentario.UsuarioRegistro;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_req_comentario, indicecolumna_inicio_dinamico].Value = item_comentario.FechaRegistro;
                        indicefila_req_comentario++;
                    }
                }
            }

            // CALCULAR INDICE FILA ARTWORK
            indicefila_color_detalle = indicefila_req_comentario + 1; //indicefila_inicio + 1;
            if (listarequerimientocolor_pintar != null)
            {  // PINTAR LOS COLRES DEL PROCESO
                if (listarequerimientocolor_pintar.Count > 0)
                {
                    //indicefila_tela_color = indicefila_proceso_detalle + 1;
                    indicefila_color_detalle++;
                    string[] arraycabecera_color = pObjReq.titulos_cabecera_color.Split('¬');
                    int totalcabeceras_color = arraycabecera_color.Length;
                    indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                    int indice_ultima_columna_detallecolor = cons_indicecolumna_inicio + (totalcabeceras_color - 1);
                    // CABECERA DE COLOR
                    for (int i = 0; i < totalcabeceras_color; i++)
                    {
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = arraycabecera_color[i];
                        indicecolumna_inicio_dinamico++;
                    }
                    //// BACKGROUNDCOLOR CABECERA TABLA PROCESO
                    //Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                    pObjWorksheet.Cells[indicefila_color_detalle, cons_indicecolumna_inicio, indicefila_color_detalle, indice_ultima_columna_detallecolor].Style.Font.Bold = true;

                    // LLENAR DETALLE COLOR TELA
                    //indicefila_color_detalle = indicefila_tela_color + 1;
                    indicefila_color_detalle++;
                    foreach (var item_color in listarequerimientocolor_pintar)
                    {
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.nombreclientecolor;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.nombreclientetalla;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.cantidad;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.cantidadcm;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.fechacliente;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.fechafty;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.fechaactual;
                        indicefila_color_detalle++;
                    }
                }
            }
            indicedinamico_inicio_fila_detalle_req = indicefila_color_detalle;
        }

        public void PintarGeneralInfo(int indicedinamico_inicio_fila_generalinfo, Estilo pObjEstilo, ExcelWorksheet pObjWorksheet)
        {
            string tituloscabecera = pObjEstilo.titulos_cabecera_generalinfo;
            string[] arraytitulos = tituloscabecera.Split('¬');
            int indicefila_inicio = indicedinamico_inicio_fila_generalinfo;
            int cons_indicecolumna_inicio = pObjEstilo.indicecolumna_generalinfo_dondeempieza_apintar;  // ESTE
            int indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;

            for (int i = 0; i < arraytitulos.Length; i++)
            {
                string[] arraytitulo = arraytitulos[i].Split('|');
                // NOMBRE LABEL
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = arraytitulo[0];
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
                // VALOR
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico + 1].Value = arraytitulo[1];
                indicefila_inicio++;
            }
        }

        public void PintarImagenEstilo(int indicedinamico_inicio_fila, Estilo pObjEstilo, ExcelWorksheet pObjWorksheet, int pContadorEstilo)
        {
            string fileserver = ConfigurationManager.AppSettings["FileServer"].ToString();
            string rutaestilo = "erp/style/thumbnail/" + pObjEstilo.imagenwebnombre;
            string rutacompleta_imagenestilo = fileserver + rutaestilo;
            Image image = (!string.IsNullOrEmpty(pObjEstilo.imagenwebnombre)) ?
                            Image.FromFile(rutacompleta_imagenestilo) :
                            Image.FromFile(System.Web.HttpContext.Current.Server.MapPath("~/Content/img/sinimagen.jpg"));
            ExcelPicture pic = pObjWorksheet.Drawings.AddPicture("imagenestilo" + pContadorEstilo.ToString(), image);
            pic.SetPosition(indicedinamico_inicio_fila, 5, 1, 10);
            pic.SetSize(130, 150);

        }

        private void PintarLineasMargenes_columnas(string titulos_cabecera_reporte, int inicio_fila_matriz, int inicio_columna_matriz, int final_fila_matriz, int final_columna_matriz, ExcelWorksheet pObjWorkSheet)
        {
            string[] arrayColumnas = titulos_cabecera_reporte.Split('¬');
            int totalColumnas = arrayColumnas.Length;
            int indice_inicio_columna_dinamico_siguientecolumna = inicio_columna_matriz;
            int valormerge_x_columna = 0;
            int indice_final_columna_dinamico_conmerge = 0;

            // DIBUJAR LINEAS TITULOS DE LA CABECERA MATRIZ
            pObjWorkSheet.Cells[inicio_fila_matriz, inicio_columna_matriz, inicio_fila_matriz, final_columna_matriz].Style.Border.Top.Style = ExcelBorderStyle.Thin;
            pObjWorkSheet.Cells[inicio_fila_matriz, inicio_columna_matriz, inicio_fila_matriz, final_columna_matriz].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            pObjWorkSheet.Cells[inicio_fila_matriz, inicio_columna_matriz, inicio_fila_matriz, final_columna_matriz].Style.Border.Left.Style = ExcelBorderStyle.Thin;
            pObjWorkSheet.Cells[inicio_fila_matriz, inicio_columna_matriz, inicio_fila_matriz, final_columna_matriz].Style.Border.Right.Style = ExcelBorderStyle.Thin;

            for (int i = 0; i < totalColumnas; i++)
            {
                string[] arraydato = arrayColumnas[i].Split('|');
                valormerge_x_columna = Convert.ToInt32(arraydato[1]);
                if (i == 0)
                {
                    if (valormerge_x_columna > 1)
                    {
                        indice_final_columna_dinamico_conmerge = indice_inicio_columna_dinamico_siguientecolumna + (valormerge_x_columna - 1);
                        pObjWorkSheet.Cells[inicio_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna, final_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        pObjWorkSheet.Cells[inicio_fila_matriz, indice_final_columna_dinamico_conmerge, final_fila_matriz, indice_final_columna_dinamico_conmerge].Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    }
                    else
                    {
                        pObjWorkSheet.Cells[inicio_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna, final_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        pObjWorkSheet.Cells[inicio_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna, final_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    }

                }
                else if ((i + 1) == totalColumnas)
                {
                    if (valormerge_x_columna > 1)
                    {
                        indice_final_columna_dinamico_conmerge = indice_inicio_columna_dinamico_siguientecolumna + (valormerge_x_columna - 1);
                        pObjWorkSheet.Cells[inicio_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna, final_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        pObjWorkSheet.Cells[inicio_fila_matriz, indice_final_columna_dinamico_conmerge, final_fila_matriz, indice_final_columna_dinamico_conmerge].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    }
                    else
                    {
                        pObjWorkSheet.Cells[inicio_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna, final_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        pObjWorkSheet.Cells[inicio_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna, final_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    }

                }
                else if (i < totalColumnas)
                {
                    pObjWorkSheet.Cells[inicio_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna, final_fila_matriz, indice_inicio_columna_dinamico_siguientecolumna].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                }

                indice_inicio_columna_dinamico_siguientecolumna = indice_inicio_columna_dinamico_siguientecolumna + valormerge_x_columna;
            }
        }

        private void PintarCallout(ref int indicedinamico_inicio_fila_callout, ExcelWorksheet pObjWorksheet, List<Callout> listacount_pintar)
        {

            if (listacount_pintar != null)
            {
                if (listacount_pintar.Count > 0)
                {
                    int indicefila_inicio = indicedinamico_inicio_fila_callout;
                    int cons_indicecolumna_inicio = listacount_pintar[0].indicecolumna_dondeempieza_apintar;  // ESTE
                    int indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                    int indicefila_proceso_detalle = 0, indicefila_tela_color = 0, indicefila_color_detalle = 0;

                    pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = "CALLOUT";
                    pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
                    // BACKGROUNDCOLOR CABECERA CELDA - SUBTITULO
                    Color colorcabeceracelda = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                    pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.BackgroundColor.SetColor(colorcabeceracelda);

                    indicefila_proceso_detalle = indicefila_inicio + 1;
                    ////

                    indicefila_tela_color = indicefila_proceso_detalle + 1;
                    string[] arraycabecera_color = listacount_pintar[0].titulos_cabecera_detallecallout.Split('¬');
                    int totalcabeceras_color = arraycabecera_color.Length;
                    indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                    int indice_ultima_columna_detallecolor = cons_indicecolumna_inicio + (totalcabeceras_color - 1);
                    // CABECERA DE COLOR
                    for (int i = 0; i < totalcabeceras_color; i++)
                    {
                        pObjWorksheet.Cells[indicefila_tela_color, indicecolumna_inicio_dinamico].Value = arraycabecera_color[i];
                        indicecolumna_inicio_dinamico++;
                    }
                    // BACKGROUNDCOLOR CABECERA TABLA PROCESO
                    Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                    pObjWorksheet.Cells[indicefila_tela_color, cons_indicecolumna_inicio, indicefila_tela_color, indice_ultima_columna_detallecolor].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    pObjWorksheet.Cells[indicefila_tela_color, cons_indicecolumna_inicio, indicefila_tela_color, indice_ultima_columna_detallecolor].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                    pObjWorksheet.Cells[indicefila_tela_color, cons_indicecolumna_inicio, indicefila_tela_color, indice_ultima_columna_detallecolor].Style.Font.Bold = true;
                    // LLENAR DETALLE COLOR TELA
                    indicefila_color_detalle = indicefila_tela_color + 1;
                    foreach (var item_color in listacount_pintar)
                    {
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.comentario;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.fecha;
                        indicecolumna_inicio_dinamico++;
                        pObjWorksheet.Cells[indicefila_color_detalle, indicecolumna_inicio_dinamico].Value = item_color.usuario;
                        indicecolumna_inicio_dinamico++;
                    }
                    indicedinamico_inicio_fila_callout = indicefila_color_detalle;
                }
            }
        }

        private void pintarestiloxcombo(ref int indicedinamico_inicio_fila_detalle_estiloxcombo, ExcelWorksheet pObjWorksheet, EstiloxCombo pObjEstiloxCombo, List<EstiloxComboColor> listaestiloxcombocolor_pintar, int pContadorestiloxcombo)
        {
            string tituloscabecera = pObjEstiloxCombo.titulos_cabecera;
            string[] arraytitulos = tituloscabecera.Split('¬');
            int indicefila_inicio = indicedinamico_inicio_fila_detalle_estiloxcombo;
            int cons_indicecolumna_inicio = pObjEstiloxCombo.indicecolumna_dondeempieza_apintar;  // ESTE
            int indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
            int totallabel_cabecera_telas = pObjEstiloxCombo.total_label;
            int indicefila_proceso_detalle = 0, indicefila_tela_color = 0, indicefila_color_detalle = 0;

            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = "COMBINATION " + pContadorestiloxcombo.ToString();
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
            // BACKGROUNDCOLOR CABECERA CELDA - SUBTITULO
            Color colorcabeceracelda = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.PatternType = ExcelFillStyle.Solid;
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.BackgroundColor.SetColor(colorcabeceracelda);

            for (int i = 0; i < arraytitulos.Length; i++)
            {
                indicefila_inicio++;
                string[] arraytitulo = arraytitulos[i].Split('|');
                // NOMBRE LABEL
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = arraytitulo[0];
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
                // VALOR
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico + 1].Value = arraytitulo[1];
            }

            // CALCULAR INDICE FILA ARTWORK
            indicefila_proceso_detalle = indicedinamico_inicio_fila_detalle_estiloxcombo + totallabel_cabecera_telas; //indicefila_inicio + 1;
            if (listaestiloxcombocolor_pintar != null)
            {  // PINTAR LOS COLRES DEL PROCESO
                if (listaestiloxcombocolor_pintar.Count > 0)
                {
                    //indicefila_tela_color = indicefila_proceso_detalle + 1;
                    indicefila_proceso_detalle++;
                    string[] arraycabecera_color = pObjEstiloxCombo.titulos_cabecera_color.Split('¬');
                    int totalcabeceras_color = arraycabecera_color.Length;
                    indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                    int indice_ultima_columna_detallecolor = cons_indicecolumna_inicio + (totalcabeceras_color - 1);
                    // CABECERA DE COLOR
                    for (int i = 0; i < totalcabeceras_color; i++)
                    {
                        pObjWorksheet.Cells[indicefila_proceso_detalle, indicecolumna_inicio_dinamico].Value = arraycabecera_color[i];
                        indicecolumna_inicio_dinamico++;
                    }
                    // BACKGROUNDCOLOR CABECERA TABLA PROCESO
                    Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                    pObjWorksheet.Cells[indicefila_proceso_detalle, cons_indicecolumna_inicio, indicefila_proceso_detalle, indice_ultima_columna_detallecolor].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    pObjWorksheet.Cells[indicefila_proceso_detalle, cons_indicecolumna_inicio, indicefila_proceso_detalle, indice_ultima_columna_detallecolor].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                    pObjWorksheet.Cells[indicefila_proceso_detalle, cons_indicecolumna_inicio, indicefila_proceso_detalle, indice_ultima_columna_detallecolor].Style.Font.Bold = true;

                    // LLENAR DETALLE COLOR TELA
                    //indicefila_color_detalle = indicefila_tela_color + 1;
                    indicefila_proceso_detalle++;

                    foreach (var item_color in listaestiloxcombocolor_pintar)
                    {
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        pObjWorksheet.Cells[indicefila_proceso_detalle, indicecolumna_inicio_dinamico].Value = item_color.color;
                        //indicecolumna_inicio_dinamico++;
                        indicefila_proceso_detalle++;
                    }
                }
            }
            indicedinamico_inicio_fila_detalle_estiloxcombo = indicefila_proceso_detalle;
        }

        private void pintarestiloxfabriccombo(ref int indicedinamico_inicio_fila_detalle_estiloxfabriccombo, ExcelWorksheet pObjWorksheet, EstiloxFabricCombo pObjEstiloxFabricCombo, List<EstiloxFabricComboColor> listaestiloxfabriccombocolor_pintar, int pContadorestiloxfabriccombo)
        {
            string tituloscabecera = pObjEstiloxFabricCombo.titulos_cabecera;
            string[] arraytitulos = tituloscabecera.Split('¬');
            int indicefila_inicio = indicedinamico_inicio_fila_detalle_estiloxfabriccombo;
            int cons_indicecolumna_inicio = pObjEstiloxFabricCombo.indicecolumna_dondeempieza_apintar;  // ESTE
            int indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
            int totallabel_cabecera_telas = pObjEstiloxFabricCombo.total_label;
            int indicefila_proceso_detalle = 0, indicefila_tela_color = 0, indicefila_color_detalle = 0;

            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = "COMBINATION " + pContadorestiloxfabriccombo.ToString();
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
            // BACKGROUNDCOLOR CABECERA CELDA - SUBTITULO
            Color colorcabeceracelda = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.PatternType = ExcelFillStyle.Solid;
            pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Fill.BackgroundColor.SetColor(colorcabeceracelda);

            for (int i = 0; i < arraytitulos.Length; i++)
            {
                indicefila_inicio++;
                string[] arraytitulo = arraytitulos[i].Split('|');
                // NOMBRE LABEL
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Value = arraytitulo[0];
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico].Style.Font.Bold = true;
                // VALOR
                pObjWorksheet.Cells[indicefila_inicio, indicecolumna_inicio_dinamico + 1].Value = arraytitulo[1];
            }

            // CALCULAR INDICE FILA ARTWORK
            indicefila_proceso_detalle = indicedinamico_inicio_fila_detalle_estiloxfabriccombo + totallabel_cabecera_telas; //indicefila_inicio + 1;
            if (listaestiloxfabriccombocolor_pintar != null)
            {  // PINTAR LOS COLRES DEL PROCESO
                if (listaestiloxfabriccombocolor_pintar.Count > 0)
                {
                    //indicefila_tela_color = indicefila_proceso_detalle + 1;
                    indicefila_proceso_detalle++;
                    string[] arraycabecera_color = pObjEstiloxFabricCombo.titulos_cabecera_color.Split('¬');
                    int totalcabeceras_color = arraycabecera_color.Length;
                    indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                    int indice_ultima_columna_detallecolor = cons_indicecolumna_inicio + (totalcabeceras_color - 1);
                    // CABECERA DE COLOR
                    for (int i = 0; i < totalcabeceras_color; i++)
                    {
                        pObjWorksheet.Cells[indicefila_proceso_detalle, indicecolumna_inicio_dinamico].Value = arraycabecera_color[i];
                        indicecolumna_inicio_dinamico++;
                    }
                    // BACKGROUNDCOLOR CABECERA TABLA PROCESO
                    Color colorcabeceratabladetalle = System.Drawing.ColorTranslator.FromHtml("#D0CECE");
                    pObjWorksheet.Cells[indicefila_proceso_detalle, cons_indicecolumna_inicio, indicefila_proceso_detalle, indice_ultima_columna_detallecolor].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    pObjWorksheet.Cells[indicefila_proceso_detalle, cons_indicecolumna_inicio, indicefila_proceso_detalle, indice_ultima_columna_detallecolor].Style.Fill.BackgroundColor.SetColor(colorcabeceratabladetalle);
                    pObjWorksheet.Cells[indicefila_proceso_detalle, cons_indicecolumna_inicio, indicefila_proceso_detalle, indice_ultima_columna_detallecolor].Style.Font.Bold = true;

                    // LLENAR DETALLE COLOR TELA
                    //indicefila_color_detalle = indicefila_tela_color + 1;
                    indicefila_proceso_detalle++;

                    foreach (var item_color in listaestiloxfabriccombocolor_pintar)
                    {
                        indicecolumna_inicio_dinamico = cons_indicecolumna_inicio;
                        pObjWorksheet.Cells[indicefila_proceso_detalle, indicecolumna_inicio_dinamico].Value = item_color.color;
                        //indicecolumna_inicio_dinamico++;
                        indicefila_proceso_detalle++;
                    }
                }
            }
            indicedinamico_inicio_fila_detalle_estiloxfabriccombo = indicefila_proceso_detalle;
        }

        private void PintarImagenFabricCombo(int indicedinamico_inicio_fila, int indicecolumna_pintarimagen, Estilo pObjEstilo, ExcelWorksheet pObjWorksheet, int pContadorEstilo)
        {
            string fileserver = ConfigurationManager.AppSettings["FileServer"].ToString();
            string rutaestilo = "erp/style/FabricCombo/" + pObjEstilo.imagenfabriccombo;
            string rutacompleta_imagenestilo = fileserver + rutaestilo;
            Image image = (!string.IsNullOrEmpty(pObjEstilo.imagenfabriccombo)) ?
                            Image.FromFile(rutacompleta_imagenestilo) :
                            Image.FromFile(System.Web.HttpContext.Current.Server.MapPath("~/Content/img/sinimagen.jpg"));
            ExcelPicture pic = pObjWorksheet.Drawings.AddPicture("imagen_fabriccombo_estilo" + pContadorEstilo.ToString(), image);
            pic.SetPosition(indicedinamico_inicio_fila, 5, indicecolumna_pintarimagen, 10);
            pic.SetSize(130, 150);
        }
    }

    class ClsIndiceColumnasCampo
    {
        public string Campo { get; set; }
        public int IndiceColumna { get; set; }
    }
     
}
