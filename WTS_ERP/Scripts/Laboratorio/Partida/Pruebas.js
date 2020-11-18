var oVariables = {
    Codigo_Partida: 0,
    arrCategoriaInstruccionCuidado: [],
    arrInstruccionCuidado: [],
    arrInstruccionCuidadoChk: []
}

Ini();

function Ini() {    
    var par = parseInt($("#txtpar").val());
    oVariables.Codigo_Partida = par;

    req_InstruccionCuidado();

    if (par > 0) {

        $("#spnPageStatus").text("");
        $("#spnPageStatus").text("Editing");
        $("#txtFabrica").show();
        $("#txtCliente").show();
        var urlaccion = 'Laboratorio/Partida/GetTest?par=' + par;
        Get(urlaccion, LoadTestPartida);

    } else {
        $("#cboFabrica").show();
        $("#cboCliente").show();
        LoadInitialData();
    }

    //$("#btnSave").click(function () { req_guardar(); });

    $("#btnEnviar").click(function () { req_enviar(); });

    $("#btnReturn").click(function () {
        let url = 'Laboratorio/Partida/Consulta';
        _Go_Url(url, url, "");
    });

    //$('._retroceder_accion').click(function () { fn_ocultar_acciones(); });

    _initializeIboxTools();
    //$('.collapse-link').click();
}

//Obtener Informacion de la Solicitud Partida y resultado de pruebas
function LoadTestPartida(data) {

    if (data !== "") {

        var Data = JSON.parse(data)[0];

        //Instruccion Cuidado
        if (Data.InstruccionCuidado != '') {
            oVariables.arrInstruccionCuidadoChk = JSON.parse(Data.InstruccionCuidado);
        }

        //Mostrar Instrucciones de Cuidado
        fn_CargarInstrucionCuidado();

        //Informacion General
        if (Data.SolicitudPartida != "") {
            var Partida = JSON.parse(Data.SolicitudPartida)[0];

            $("#hfCodigoPartida").val(Partida.CodigoPartida);
            $("#hfTipoPrueba").val(Partida.TipoPrueba);
            $("#hfIdClienteERP").val(Partida.IdClienteERP);
            $("#hfIdProveedor").val(Partida.IdProveedor);

            $("#txtReporteTecnico").val(Partida.ReporteTecnico);
            $("#txtFabrica").val(Partida.NombreFabrica);
            $("#txtCliente").val(Partida.NombreCliente);
            $("#cboPartidaStatus").val(Partida.StatusPartida);
            $("#txtPartida").val(Partida.NumeroPartida);
            $("#txtColor").val(Partida.NombreColor);
            $("#txtCodigoTela").val(Partida.CodigoTela);
            $("#cboAprobadoComercial").val(Partida.AprobadoComercial);
            $("#txtDescripcionTela").val(Partida.DescripcionTela);
            $("#txtTintoreria").val(Partida.NombreTintoreria);
            $("#txtInstruccionCuidadoSolicitud").val(Partida.InstruccionCuidadoSolicitud);
            $("#txtComentarioColorExterno").val(Partida.ComentarioColorExterno);


            $("#txtComentarioColor").val(Partida.ComentarioColor);
            $("#cboStatusTono").val(Partida.StatusTono);
            $("#txt_InstruccionesCuidado").val(Partida.InstruccionCuidado);
            //$("#txt_InstruccionesCuidadoLaboratorio").val(Partida.InstruccionCuidado);

            $("#txtComentarioTesting").val(Partida.ComentarioTesting);

            if (Partida.TipoPrueba == "f" || Partida.TipoPrueba == "p" || Partida.TipoPrueba == "d" || Partida.TipoPrueba == "m" || Partida.TipoPrueba == "pp" || Partida.TipoPrueba == "a") {
                $("#divEstabilidadDimensional").show();
                $("#divEstabilidadDimensionalGarment").hide();
            }
            else {
                $("#divEstabilidadDimensional").hide();
                $("#divEstabilidadDimensional_EP").hide();
                $("#divEstabilidadDimensional_HW").hide();
            }

            // Ocultando Pruebas segun Tipo de Prueba

            if (Partida.TipoPrueba == "p" || Partida.TipoPrueba == "gp") { // Produccion Tela o Produccion Prenda
                //$("#divResistenciaPilling").remove();
                //$("#divSolidezTranspiracion").remove();
                //$("#divSolidezAgua").remove();
                //$("#divAlmacenamiento").remove();
                //$("#divBlanqueadorSinCloro").remove();
                //$("#divBlanqueadorConCloro").remove();
                //$("#divPHValue").remove();
                //$("#divWicking").remove();
            }

            if (Partida.TipoPrueba == "m") {  // Muestra Tela              
                //$("#divSolidezTranspiracion").remove();
                //$("#divSolidezAgua").remove();
                //$("#divAlmacenamiento").remove();
                //$("#divBlanqueadorSinCloro").remove();
                //$("#divBlanqueadorConCloro").remove();
                //$("#divPHValue").remove();
                //$("#divWicking").remove();
            }

            if (Partida.TipoPrueba == "d") { // Desarrollo Tela  
                //$("#divSolidezFrote").remove();
                //$("#divSolidezLavado").remove();
                //$("#divSolidezTranspiracion").remove();
                //$("#divSolidezAgua").remove();
                //$("#divAlmacenamiento").remove();
                //$("#divBlanqueadorSinCloro").remove();
                //$("#divBlanqueadorConCloro").remove();
                //$("#divPHValue").remove();
                //$("#divWicking").remove();
            }


            if (Partida.TipoPrueba == "pp") {
                //$("#divSolidezTranspiracion").remove();
                //$("#divSolidezAgua").remove();
                //$("#divAlmacenamiento").remove();
                //$("#divBlanqueadorSinCloro").remove();
                //$("#divBlanqueadorConCloro").remove();
                //$("#divPHValue").remove();
                //$("#divWicking").remove();
            }


            /* Estabilidad Dimensional - Tela */
            $("#txtMuestraA_Ancho_1erLav_1").val(Partida.MuestraA_Ancho_1erLav_1);
            $("#txtMuestraA_Ancho_3erLav_1").val(Partida.MuestraA_Ancho_3erLav_1);
            _('txtMuestraA_Ancho_5toLav_1').value = Partida.MuestraA_Ancho_5toLav_1;
            $("#txtMuestraA_Largo_1erLav_1").val(Partida.MuestraA_Largo_1erLav_1);
            $("#txtMuestraA_Largo_3erLav_1").val(Partida.MuestraA_Largo_3erLav_1);
            _('txtMuestraA_Largo_5toLav_1').value = Partida.MuestraA_Largo_5toLav_1;
            $("#txtMuestraB_Ancho_1erLav_1").val(Partida.MuestraB_Ancho_1erLav_1);
            $("#txtMuestraB_Ancho_3erLav_1").val(Partida.MuestraB_Ancho_3erLav_1);
            _('txtMuestraB_Ancho_5toLav_1').value = Partida.MuestraB_Ancho_5toLav_1;
            $("#txtMuestraB_Largo_1erLav_1").val(Partida.MuestraB_Largo_1erLav_1);
            $("#txtMuestraB_Largo_3erLav_1").val(Partida.MuestraB_Largo_3erLav_1);
            _('txtMuestraB_Largo_5toLav_1').value = Partida.MuestraB_Largo_5toLav_1;

            $("#txtMuestraA_Ancho_1erLav_2").val(Partida.MuestraA_Ancho_1erLav_2);
            $("#txtMuestraA_Ancho_3erLav_2").val(Partida.MuestraA_Ancho_3erLav_2);
            _('txtMuestraA_Ancho_5toLav_2').value = Partida.MuestraA_Ancho_5toLav_2;
            $("#txtMuestraA_Largo_1erLav_2").val(Partida.MuestraA_Largo_1erLav_2);
            $("#txtMuestraA_Largo_3erLav_2").val(Partida.MuestraA_Largo_3erLav_2);
            _('txtMuestraA_Largo_5toLav_2').value = Partida.MuestraA_Largo_5toLav_2;
            $("#txtMuestraB_Ancho_1erLav_2").val(Partida.MuestraB_Ancho_1erLav_2);
            $("#txtMuestraB_Ancho_3erLav_2").val(Partida.MuestraB_Ancho_3erLav_2);
            _('txtMuestraB_Ancho_5toLav_2').value = Partida.MuestraB_Ancho_5toLav_2;
            $("#txtMuestraB_Largo_1erLav_2").val(Partida.MuestraB_Largo_1erLav_2);
            $("#txtMuestraB_Largo_3erLav_2").val(Partida.MuestraB_Largo_3erLav_2);
            _('txtMuestraB_Largo_5toLav_2').value = Partida.MuestraB_Largo_5toLav_2;

            $("#txtMuestraA_Ancho_1erLav_3").val(Partida.MuestraA_Ancho_1erLav_3);
            $("#txtMuestraA_Ancho_3erLav_3").val(Partida.MuestraA_Ancho_3erLav_3);
            _('txtMuestraA_Ancho_5toLav_3').value = Partida.MuestraA_Ancho_5toLav_3;
            $("#txtMuestraA_Largo_1erLav_3").val(Partida.MuestraA_Largo_1erLav_3);
            $("#txtMuestraA_Largo_3erLav_3").val(Partida.MuestraA_Largo_3erLav_3);
            _('txtMuestraA_Largo_5toLav_3').value = Partida.MuestraA_Largo_5toLav_3;
            $("#txtMuestraB_Ancho_1erLav_3").val(Partida.MuestraB_Ancho_1erLav_3);
            $("#txtMuestraB_Ancho_3erLav_3").val(Partida.MuestraB_Ancho_3erLav_3);
            _('txtMuestraB_Ancho_5toLav_3').value = Partida.MuestraB_Ancho_5toLav_3;
            $("#txtMuestraB_Largo_1erLav_3").val(Partida.MuestraB_Largo_1erLav_3);
            $("#txtMuestraB_Largo_3erLav_3").val(Partida.MuestraB_Largo_3erLav_3);
            _('txtMuestraB_Largo_5toLav_3').value = Partida.MuestraB_Largo_5toLav_3;

            $("#txtEncogimientoLargo").val(Partida.EncogimientoLargo);
            $("#txtEncogimientoAncho").val(Partida.EncogimientoAncho);
            $("#cboEncogimientoStatus").val(Partida.EncogimientoStatus.toString());

            /* Estabilidad Dimensional - Prenda */
            $("#txtAcrossChestOriginal").val(Partida.AcrossChestOriginal);
            $("#txtAcrossChestOneCyle").val(Partida.AcrossChestOneCyle);
            $("#txtAcrossChestOneCyleChange").val(Partida.AcrossChestOneCycleChange);
            $("#txtAcrossChestThreeCyles").val(Partida.AcrossChestThreeCyles);
            $("#txtAcrossChestThreeCylesChange").val(Partida.AcrossChestThreeCycleChange);
            _('txtAcrossChestFiveCycle').value = Partida.AcrossChestFiveCycle;
            _('txtAcrossChestFiveCycleChange').value = Partida.AcrossChestFiveCycleChange;

            $("#txtBottomWidthOriginal").val(Partida.BottomWidthOriginal);
            $("#txtBottomWidthOneCyle").val(Partida.BottomWidthOneCyle);            
            $("#txtBottomWidthOneCyleChange").val(Partida.BottomWidthtOneCycleChange);
            $("#txtBottomWidthThreeCyles").val(Partida.BottomWidthThreeCyles);            
            $("#txtBottomWidthThreeCylesChange").val(Partida.BottomWidthThreeCycleChange);
            _('txtBottomWidthFiveCycle').value = Partida.BottomWidthFiveCycle;
            _('txtBottomWidthFiveCycleChange').value = Partida.BottomWidthtFiveCycleChange;

            $("#txtBodyFromLenOriginal").val(Partida.BodyFromLenOriginal);
            $("#txtBodyFromLeOneCyle").val(Partida.BodyFromLeOneCyle);
            $("#txtBodyFromLeOneCyleChange").val(Partida.BodyFromLenOneCycleChange);
            $("#txtBodyFromLeThreeCyles").val(Partida.BodyFromLeThreeCyles);
            $("#txtBodyFromLeThreeCylesChange").val(Partida.BodyFromLenThreeCycleChange);
            _('txtBodyFromLeFiveCycle').value = Partida.BodyFromLeFiveCycle;
            _('txtBodyFromLeFiveCycleChange').value = Partida.BodyFromLenFiveCycleChange;

            $("#txtSleeveLenOriginal").val(Partida.SleeveLenOriginal);
            $("#txtSleeveLenOneCyle").val(Partida.SleeveLenOneCyle);
            $("#txtSleeveLenOneCyleChange").val(Partida.SleeveLenOneCycleChange);
            $("#txtSleeveLenThreeCyles").val(Partida.SleeveLenThreeCyles);
            $("#txtSleeveLenThreeCylesChange").val(Partida.SleeveLenThreeCycleChange);
            _('txtSleeveLenFiveCycle').value = Partida.SleeveLenFiveCycle;
            _('txtSleeveLenFiveCycleChange').value = Partida.SleeveLenFiveCycleChange;

            // Luis - Nuevo
            _('txtCenterBlackLenOriginal').value = Partida.CenterBlackLenOriginal;
            _('txtCenterBlackLenOneCycle').value = Partida.CenterBlackLenOneCycle;
            _('txtCenterBlackLenOneCycleChange').value = Partida.CenterBlackLenOneCycleChange;
            _('txtCenterBlackLenThreeCycle').value = Partida.CenterBlackLenThreeCycle;
            _('txtCenterBlackLenThreeCycleChange').value = Partida.CenterBlackLenThreeCycleChange;
            _('txtCenterBlackLenFiveCycle').value = Partida.CenterBlackLenFiveCycle;
            _('txtCenterBlackLenFiveCycleChange').value = Partida.CenterBlackLenFiveCycleChange;

            _('txtAcrossShoulderOriginal').value = Partida.AcrossShoulderOriginal;
            _('txtAcrossShoulderOneCycle').value = Partida.AcrossShoulderOneCycle;
            _('txtAcrossShoulderOneCycleChange').value = Partida.AcrossShoulderOneCycleChange;
            _('txtAcrossShoulderThreeCycle').value = Partida.AcrossShoulderThreeCycle;
            _('txtAcrossShoulderThreeCycleChange').value = Partida.AcrossShoulderThreeCycleChange;
            _('txtAcrossShoulderFiveCycle').value = Partida.AcrossShoulderFiveCycle;
            _('txtAcrossShoulderFiveCycleChange').value = Partida.AcrossShoulderFiveCycleChange;

            _('txtArmholeOriginal').value = Partida.ArmholeOriginal;
            _('txtArmholeOneCycle').value = Partida.ArmholeOneCycle;
            _('txtArmholeOneCycleChange').value = Partida.ArmholeOneCycleChange;
            _('txtArmholeThreeCycle').value = Partida.ArmholeThreeCycle;
            _('txtArmholeThreeCycleChange').value = Partida.ArmholeThreeCycleChange;
            _('txtArmholeFiveCycle').value = Partida.ArmholeFiveCycle;
            _('txtArmholeFiveCycleChange').value = Partida.ArmholeFiveCycleChange;

            _('txtArmholeIIOriginal').value = Partida.ArmholeIIOriginal;
            _('txtArmholeIIOneCycle').value = Partida.ArmholeIIOneCycle;
            _('txtArmholeIIOneCycleChange').value = Partida.ArmholeIIOneCycleChange;
            _('txtArmholeIIThreeCycle').value = Partida.ArmholeIIThreeCycle;
            _('txtArmholeIIThreeCycleChange').value = Partida.ArmholeIIThreeCycleChange;
            _('txtArmholeIIFiveCycle').value = Partida.ArmholeIIFiveCycle;
            _('txtArmholeIIFiveCycleChange').value = Partida.ArmholeIIFiveCycleChange;

            _('txtHemOriginal').value = Partida.HemOriginal;
            _('txtHemOneCycle').value = Partida.HemOneCycle;
            _('txtHemOneCycleChange').value = Partida.HemOneCycleChange;
            _('txtHemThreeCycle').value = Partida.HemThreeCycle;
            _('txtHemThreeCycleChange').value = Partida.HemThreeCycleChange;
            _('txtHemFiveCycle').value = Partida.HemFiveCycle;
            _('txtHemFiveCycleChange').value = Partida.HemFiveCycleChange;

            _('txtCollarOriginal').value = Partida.CollarOriginal;
            _('txtCollarOneCycle').value = Partida.CollarOneCycle;
            _('txtCollarOneCycleChange').value = Partida.CollarOneCycleChange;
            _('txtCollarThreeCycle').value = Partida.CollarThreeCycle;
            _('txtCollarThreeCycleChange').value = Partida.CollarThreeCycleChange;
            _('txtCollarFiveCycle').value = Partida.CollarFiveCycle;
            _('txtCollarFiveCycleChange').value = Partida.CollarFiveCycleChange;

            _('txtCollarBandOriginal').value = Partida.CollarBandOriginal;
            _('txtCollarBandOneCycle').value = Partida.CollarBandOneCycle;
            _('txtCollarBandOneCycleChange').value = Partida.CollarBandOneCycleChange;
            _('txtCollarBandThreeCycle').value = Partida.CollarBandThreeCycle;
            _('txtCollarBandThreeCycleChange').value = Partida.CollarBandThreeCycleChange;
            _('txtCollarBandFiveCycle').value = Partida.CollarBandFiveCycle;
            _('txtCollarBandFiveCycleChange').value = Partida.CollarBandFiveCycleChange;

            _('txtCuffsOriginal').value = Partida.CuffsOriginal;
            _('txtCuffsOneCycle').value = Partida.CuffsOneCycle;
            _('txtCuffsOneCycleChange').value = Partida.CuffsOneCycleChange;
            _('txtCuffsThreeCycle').value = Partida.CuffsThreeCycle;
            _('txtCuffsThreeCycleChange').value = Partida.CuffsThreeCycleChange;
            _('txtCuffsFiveCycle').value = Partida.CuffsFiveCycle;
            _('txtCuffsFiveCycleChange').value = Partida.CuffsFiveCycleChange;

            _('txtNeckOpeningOriginal').value = Partida.NeckOpeningOriginal;
            _('txtNeckOpeningOneCycle').value = Partida.NeckOpeningOneCycle;
            _('txtNeckOpeningOneCycleChange').value = Partida.NeckOpeningOneCycleChange;
            _('txtNeckOpeningThreeCycle').value = Partida.NeckOpeningThreeCycle;
            _('txtNeckOpeningThreeCycleChange').value = Partida.NeckOpeningThreeCycleChange;
            _('txtNeckOpeningFiveCycle').value = Partida.NeckOpeningFiveCycle;
            _('txtNeckOpeningFiveCycleChange').value = Partida.NeckOpeningFiveCycleChange;

            $("#txtWaistbandWidthHalfOriginal").val(Partida.WaistbandWidthHalfOriginal);
            $("#txtWaistbandWidthHalfOneCyle").val(Partida.WaistbandWidthHalfOneCyle);
            $("#txtWaistbandWidthHalfOneCyleChange").val(Partida.WaistbandWidthHalfOneCycleChange);
            $("#txtWaistbandWidthHalfThreeCyles").val(Partida.WaistbandWidthHalfThreeCyles);
            $("#txtWaistbandWidthHalfThreeCylesChange").val(Partida.WaistbandWidthHalfThreeCycleChange);
            _('txtWaistbandWidthHalfFiveCycle').value = Partida.WaistbandWidthHalfFiveCycle;
            _('txtWaistbandWidthHalfFiveCycleChange').value = Partida.WaistbandWidthHalfFiveCycleChange;

            $("#txtLegOpeningHalfOriginal").val(Partida.LegOpeningHalfOriginal);
            $("#txtLegOpeningHalfOneCyle").val(Partida.LegOpeningHalfOneCyle);
            $("#txtLegOpeningHalfOneCyleChange").val(Partida.LegOpeningHalfOneCycleChange);
            $("#txtLegOpeningHalfThreeCyles").val(Partida.LegOpeningHalfThreeCyles);
            $("#txtLegOpeningHalfThreeCylesChange").val(Partida.LegOpeningHalfThreeCycleChange);
            _('txtLegOpeningHalfFiveCycle').value = Partida.LegOpeningHalfFiveCycle;
            _('txtLegOpeningHalfFiveCycleChange').value = Partida.LegOpeningHalfFiveCycleChange;

            $("#txtOutseambelowOriginal").val(Partida.OutseambelowOriginal);
            $("#txtOutseambelowOneCyle").val(Partida.OutseambelowOneCyle);
            $("#txtOutseambelowOneCyleChange").val(Partida.OutseambelowOneCycleChange);
            $("#txtOutseambelowThreeCyles").val(Partida.OutseambelowThreeCyles);
            $("#txtOutseambelowThreeCylesChange").val(Partida.OutseambelowThreeCycleChange);
            _('txtOutseambelowFiveCycle').value = Partida.OutseambelowFiveCycle;
            _('txtOutseambelowFiveCycleChange').value = Partida.OutseambelowFiveCycleChange;

            $("#txtInseamLenOriginal").val(Partida.InseamLenOriginal);
            $("#txtInseamLenOneCyle").val(Partida.InseamLenOneCyle);
            $("#txtInseamLenOneCyleChange").val(Partida.InseamLenOneCycleChange);
            $("#txtInseamLenThreeCyles").val(Partida.InseamLenThreeCyles);
            $("#txtInseamLenThreeCylesChange").val(Partida.InseamLenThreeCycleChange);
            _('txtInseamLenFiveCycle').value = Partida.InseamLenFiveCycle;
            _('txtInseamLenFiveCycleChange').value = Partida.InseamLenFiveCycleChange;

            $("#cboEncogimientoGarmentStatus").val(Partida.EncogimientoStatusGarment.toString());
            $("#cboUOM").val(Partida.UOM);

            /* Revirado */
            $("#txtMuestraA_1erLav_AC").val(Partida.MuestraA_1erLav_AC);
            $("#txtMuestraA_1erLav_BD").val(Partida.MuestraA_1erLav_BD);
            $("#txtMuestraA_3erLav_AC").val(Partida.MuestraA_3erLav_AC);
            $("#txtMuestraA_3erLav_BD").val(Partida.MuestraA_3erLav_BD);
            $("#txtMuestraA_5toLav_AC").val(Partida.MuestraA_5toLav_AC);
            $("#txtMuestraA_5toLav_BD").val(Partida.MuestraA_5toLav_BD);

            $("#txtMuestraB_1erLav_AC").val(Partida.MuestraB_1erLav_AC);
            $("#txtMuestraB_1erLav_BD").val(Partida.MuestraB_1erLav_BD);
            $("#txtMuestraB_3erLav_AC").val(Partida.MuestraB_3erLav_AC);
            $("#txtMuestraB_3erLav_BD").val(Partida.MuestraB_3erLav_BD);
            $("#txtMuestraB_5toLav_AC").val(Partida.MuestraB_5toLav_AC);
            $("#txtMuestraB_5toLav_BD").val(Partida.MuestraB_5toLav_BD);

            $("#txtRevirado").val(Partida.Revirado);
            $("#cboReviradoStatus").val(Partida.ReviradoStatus.toString());

            /* Estabilidad Dimensional - Tela - DryCleaning */
            $("#txtMuestraA_Ancho_1erLav_1_EP").val(Partida.MuestraA_Ancho_1erLav_1_EP);
            $("#txtMuestraA_Ancho_3erLav_1_EP").val(Partida.MuestraA_Ancho_3erLav_1_EP);
            $("#txtMuestraA_Ancho_1erLav_2_EP").val(Partida.MuestraA_Ancho_1erLav_2_EP);
            $("#txtMuestraA_Ancho_3erLav_2_EP").val(Partida.MuestraA_Ancho_3erLav_2_EP);
            $("#txtMuestraA_Ancho_1erLav_3_EP").val(Partida.MuestraA_Ancho_1erLav_3_EP);
            $("#txtMuestraA_Ancho_3erLav_3_EP").val(Partida.MuestraA_Ancho_3erLav_3_EP);
            $("#txtMuestraA_Largo_1erLav_1_EP").val(Partida.MuestraA_Largo_1erLav_1_EP);
            $("#txtMuestraA_Largo_3erLav_1_EP").val(Partida.MuestraA_Largo_3erLav_1_EP);
            $("#txtMuestraA_Largo_1erLav_2_EP").val(Partida.MuestraA_Largo_1erLav_2_EP);
            $("#txtMuestraA_Largo_3erLav_2_EP").val(Partida.MuestraA_Largo_3erLav_2_EP);
            $("#txtMuestraA_Largo_1erLav_3_EP").val(Partida.MuestraA_Largo_1erLav_3_EP);
            $("#txtMuestraA_Largo_3erLav_3_EP").val(Partida.MuestraA_Largo_3erLav_3_EP);

            $("#txtMuestraA_1erLav_AC_EP").val(Partida.MuestraA_1erLav_AC_EP);
            $("#txtMuestraA_1erLav_BD_EP").val(Partida.MuestraA_1erLav_BD_EP);
            $("#txtMuestraA_3erLav_AC_EP").val(Partida.MuestraA_3erLav_AC_EP);
            $("#txtMuestraA_3erLav_BD_EP").val(Partida.MuestraA_3erLav_BD_EP);

            $("#txtMuestraB_Ancho_1erLav_1_EP").val(Partida.MuestraB_Ancho_1erLav_1_EP);
            $("#txtMuestraB_Ancho_3erLav_1_EP").val(Partida.MuestraB_Ancho_3erLav_1_EP);
            $("#txtMuestraB_Ancho_1erLav_2_EP").val(Partida.MuestraB_Ancho_1erLav_2_EP);
            $("#txtMuestraB_Ancho_3erLav_2_EP").val(Partida.MuestraB_Ancho_3erLav_2_EP);
            $("#txtMuestraB_Ancho_1erLav_3_EP").val(Partida.MuestraB_Ancho_1erLav_3_EP);
            $("#txtMuestraB_Ancho_3erLav_3_EP").val(Partida.MuestraB_Ancho_3erLav_3_EP);
            $("#txtMuestraB_Largo_1erLav_1_EP").val(Partida.MuestraB_Largo_1erLav_1_EP);
            $("#txtMuestraB_Largo_3erLav_1_EP").val(Partida.MuestraB_Largo_3erLav_1_EP);
            $("#txtMuestraB_Largo_1erLav_2_EP").val(Partida.MuestraB_Largo_1erLav_2_EP);
            $("#txtMuestraB_Largo_3erLav_2_EP").val(Partida.MuestraB_Largo_3erLav_2_EP);
            $("#txtMuestraB_Largo_1erLav_3_EP").val(Partida.MuestraB_Largo_1erLav_3_EP);
            $("#txtMuestraB_Largo_3erLav_3_EP").val(Partida.MuestraB_Largo_3erLav_3_EP);

            $("#txtMuestraB_1erLav_AC_EP").val(Partida.MuestraB_1erLav_AC_EP);
            $("#txtMuestraB_1erLav_BD_EP").val(Partida.MuestraB_1erLav_BD_EP);
            $("#txtMuestraB_3erLav_AC_EP").val(Partida.MuestraB_3erLav_AC_EP);
            $("#txtMuestraB_3erLav_BD_EP").val(Partida.MuestraB_3erLav_BD_EP);

            $("#txtEncogimientoLargo_EP").val(Partida.EncogimientoLargo_EP);
            $("#txtEncogimientoAncho_EP").val(Partida.EncogimientoAncho_EP);
            $("#cboEncogimientoStatus_EP").val(Partida.EncogimientoStatus_EP.toString());

            /* Estabilidad Dimensional - Tela - Han Wash */
            $("#txtMuestraA_Ancho_1erLav_1_HW").val(Partida.MuestraA_Ancho_1erLav_1_HW);
            $("#txtMuestraA_Ancho_3erLav_1_HW").val(Partida.MuestraA_Ancho_3erLav_1_HW);
            $("#txtMuestraA_Ancho_1erLav_2_HW").val(Partida.MuestraA_Ancho_1erLav_2_HW);
            $("#txtMuestraA_Ancho_3erLav_2_HW").val(Partida.MuestraA_Ancho_3erLav_2_HW);
            $("#txtMuestraA_Ancho_1erLav_3_HW").val(Partida.MuestraA_Ancho_1erLav_3_HW);
            $("#txtMuestraA_Ancho_3erLav_3_HW").val(Partida.MuestraA_Ancho_3erLav_3_HW);
            $("#txtMuestraA_Largo_1erLav_1_HW").val(Partida.MuestraA_Largo_1erLav_1_HW);
            $("#txtMuestraA_Largo_3erLav_1_HW").val(Partida.MuestraA_Largo_3erLav_1_HW);
            $("#txtMuestraA_Largo_1erLav_2_HW").val(Partida.MuestraA_Largo_1erLav_2_HW);
            $("#txtMuestraA_Largo_3erLav_2_HW").val(Partida.MuestraA_Largo_3erLav_2_HW);
            $("#txtMuestraA_Largo_1erLav_3_HW").val(Partida.MuestraA_Largo_1erLav_3_HW);
            $("#txtMuestraA_Largo_3erLav_3_HW").val(Partida.MuestraA_Largo_3erLav_3_HW);

            $("#txtMuestraA_1erLav_AC_HW").val(Partida.MuestraA_1erLav_AC_HW);
            $("#txtMuestraA_1erLav_BD_HW").val(Partida.MuestraA_1erLav_BD_HW);
            $("#txtMuestraA_3erLav_AC_HW").val(Partida.MuestraA_3erLav_AC_HW);
            $("#txtMuestraA_3erLav_BD_HW").val(Partida.MuestraA_3erLav_BD_HW);

            $("#txtMuestraB_Ancho_1erLav_1_HW").val(Partida.MuestraB_Ancho_1erLav_1_HW);
            $("#txtMuestraB_Ancho_3erLav_1_HW").val(Partida.MuestraB_Ancho_3erLav_1_HW);
            $("#txtMuestraB_Ancho_1erLav_2_HW").val(Partida.MuestraB_Ancho_1erLav_2_HW);
            $("#txtMuestraB_Ancho_3erLav_2_HW").val(Partida.MuestraB_Ancho_3erLav_2_HW);
            $("#txtMuestraB_Ancho_1erLav_3_HW").val(Partida.MuestraB_Ancho_1erLav_3_HW);
            $("#txtMuestraB_Ancho_3erLav_3_HW").val(Partida.MuestraB_Ancho_3erLav_3_HW);
            $("#txtMuestraB_Largo_1erLav_1_HW").val(Partida.MuestraB_Largo_1erLav_1_HW);
            $("#txtMuestraB_Largo_3erLav_1_HW").val(Partida.MuestraB_Largo_3erLav_1_HW);
            $("#txtMuestraB_Largo_1erLav_2_HW").val(Partida.MuestraB_Largo_1erLav_2_HW);
            $("#txtMuestraB_Largo_3erLav_2_HW").val(Partida.MuestraB_Largo_3erLav_2_HW);
            $("#txtMuestraB_Largo_1erLav_3_HW").val(Partida.MuestraB_Largo_1erLav_3_HW);
            $("#txtMuestraB_Largo_3erLav_3_HW").val(Partida.MuestraB_Largo_3erLav_3_HW);

            $("#txtMuestraB_1erLav_AC_HW").val(Partida.MuestraB_1erLav_AC_HW);
            $("#txtMuestraB_1erLav_BD_HW").val(Partida.MuestraB_1erLav_BD_HW);
            $("#txtMuestraB_3erLav_AC_HW").val(Partida.MuestraB_3erLav_AC_HW);
            $("#txtMuestraB_3erLav_BD_HW").val(Partida.MuestraB_3erLav_BD_HW);

            $("#txtEncogimientoLargo_HW").val(Partida.EncogimientoLargo_HW);
            $("#txtEncogimientoAncho_HW").val(Partida.EncogimientoAncho_HW);
            $("#cboReviradoStatus_HW").val(Partida.ReviradoStatus_HW.toString());

            /* Apariencia */
            $("#txtApariencia").val(Partida.Apariencia);
            $("#txtPilling").val(Partida.GradoPilling);
            $("#txtGradoSA").val(Partida.GradeSA);
            $("#txtColorChangeWithSuppressorUV").val(Partida.ColorChangeWithSuppressorUV);
            $("#cboAparienciaStatus").val(Partida.AparienciaStatus.toString());
            $("#cboEvaluacionApariencia").val(Partida.EvaluacionAparienciaSL);

            /* Revirado en Prenda */
            $("#txtAABefore").val(Partida.SeamTwistAA);
            $("#txtABBefore").val(Partida.SeamTwistAB);
            $("#txtSeamResultadoBefore").val(Partida.SeamTwistResultado);
            $("#txtAAAfter").val(Partida.SeamTwistAAAfter);
            $("#txtABAfter").val(Partida.SeamTwistABAfter);
            $("#txtSeamResultadoAfter").val(Partida.SeamTwistResultadoAfter);
            $("#txtSeamChange").val(Partida.SeamTwistChange);

            _('txtReviradoPrendaBeforeAADer').value = Partida.ReviradoPrendaBeforeAADer;
            _('txtReviradoPrendaBeforeABDer').value = Partida.ReviradoPrendaBeforeABDer;
            _('txtReviradoPrendaBeforeResultadoDer').value = Partida.ReviradoPrendaBeforeResultadoDer;
            _('txtReviradoPrendaAfterAADer').value = Partida.ReviradoPrendaAfterAADer;
            _('txtReviradoPrendaAfterABDer').value = Partida.ReviradoPrendaAfterABDer;
            _('txtReviradoPrendaAfterResultadoDer').value = Partida.ReviradoPrendaAfterResultadoDer;
            _('txtReviradoPrendaChangeDer').value = Partida.ReviradoPrendaChangeDer;

            _('txtReviradoPrendaChange').value = Partida.ReviradoPrendaChange;
            $("#cboSeamTwistStatus").val(Partida.SeamTwistStatus.toString());

            /* Densidad de Tela */
            $("#txtMuestra1Densidad").val(Partida.Muestra1Densidad);
            $("#txtMuestra2Densidad").val(Partida.Muestra2Densidad);
            $("#txtMuestra3Densidad").val(Partida.Muestra3Densidad);
            $("#txtDensidad").val(Partida.Densidad);

            $("#txtMuestra1Ancho").val(Partida.Muestra1Ancho);
            $("#txtMuestra2Ancho").val(Partida.Muestra2Ancho);
            $("#txtMuestra3Ancho").val(Partida.Muestra3Ancho);

            $("#txtAnchoAcabado").val(Partida.AnchoAcabado);
            $("#cboDensidadStatus").val(Partida.DensidadStatus.toString());

            /* Solidez al Frote */
            $("#txtSeco").val(Partida.Seco);
            $("#txtHumedo").val(Partida.Humedo);
            $("#cboSolidezFroteStatus").val(Partida.SolidezFroteStatus.toString());

            /* Solidez al Lavado */
            $("#txtCambioColorSL").val(Partida.CambioColorSL);
            $("#txtAcetatoSL").val(Partida.AcetatoSL);
            $("#txtAlgodonSL").val(Partida.AlgodonSL);
            $("#txtNylonSL").val(Partida.NylonSL);
            $("#txtSilkSL").val(Partida.SilkSL);
            $("#txtPoliesterSL").val(Partida.PoliesterSL);
            $("#txtAcrilicoSL").val(Partida.AcrilicoSL);
            $("#txtLanaSL").val(Partida.LanaSL);
            $("#txtViscosaSL").val(Partida.ViscosaSL);
            $("#cboSolidezLavadoStatus").val(Partida.SolidezLavadoStatus.toString());

            /* Solidez al Lavado Modificado*/
            $("#txtCambioColorSLM").val(Partida.CambioColorSLM);
            $("#txtAcetatoSLM").val(Partida.AcetatoSLM);
            $("#txtAlgodonSLM").val(Partida.AlgodonSLM);
            $("#txtNylonSLM").val(Partida.NylonSLM);
            $("#txtSilkSLM").val(Partida.SilkSLM);
            $("#txtPoliesterSLM").val(Partida.PoliesterSLM);
            $("#txtAcrilicoSLM").val(Partida.AcrilicoSLM);
            $("#txtLanaSLM").val(Partida.LanaSLM);            
            $("#txtViscosaSLM").val(Partida.ViscosaSLM);
            $("#cboSolidezLavadoModificadoStatus").val(Partida.SolidezLavadoModificado.toString());

            /* Resistencia Pilling */
            $("#txtPillingResultado").val(Partida.PillingResultado);
            $("#txtPillingMin").val(Partida.PillingMin);
            $("#cboPillingStatus").val(Partida.ResistenciaPillingStatus.toString());

            /* Bursting */
            $("#txtBurstingResultado").val(Partida.BurstingResultado);
            $("#txtBurstingMin").val(Partida.BurstingMin);
            $("#cboBurstingStatus").val(Partida.BurstingStatus.toString());

            /* Solidez a la Transpiración */
            $("#txtCambioColorST").val(Partida.CambioColorST);
            $("#txtAcetatoST").val(Partida.AcetatoST);
            $("#txtAlgodonST").val(Partida.AlgodonST);
            $("#txtNylonST").val(Partida.NylonST);
            $("#txtSilkST").val(Partida.SilkST);
            $("#txtPoliesterST").val(Partida.PoliesterST);
            $("#txtAcrilicoST").val(Partida.AcrilicoST);
            $("#txtLanaST").val(Partida.LanaST);
            $("#txtViscosaST").val(Partida.ViscosaST);
            $("#cboSolidezTranspiracionStatus").val(Partida.SolidezTranspiracionStatus.toString());

            /* Solidez al Agua */
            $("#txtCambioColorSA").val(Partida.CambioColorSA);
            $("#txtAcetatoSA").val(Partida.AcetatoSA);
            $("#txtAlgodonSA").val(Partida.AlgodonSA);
            $("#txtNylonSA").val(Partida.NylonSA);
            $("#txtSilkSA").val(Partida.SilkSA);
            $("#txtPoliesterSA").val(Partida.PoliesterSA);
            $("#txtAcrilicoSA").val(Partida.AcrilicoSA);
            $("#txtLanaSA").val(Partida.LanaSA);
            $("#txtViscosaSA").val(Partida.ViscosaSA);
            $("#cboSolidezAguaStatus").val(Partida.SolidezAguaStatus.toString());

            /* Almacenamiento */
            $("#txtCambioColorAlmacenamiento").val(Partida.CambioColorAlmacenamiento);
            $("#txtAcetatoAlmacenamiento").val(Partida.AcetatoAlmacenamiento);
            $("#txtAlgodonAlmacenamiento").val(Partida.AlgodonAlmacenamiento);
            $("#txtNylonAlmacenamiento").val(Partida.NylonAlmacenamiento);
            $("#txtSilkAlmacenamiento").val(Partida.SilkAlmacenamiento);
            $("#txtPoliesterAlmacenamiento").val(Partida.PoliesterAlmacenamiento);
            $("#txtAcrilicoAlmacenamiento").val(Partida.AcrilicoAlmacenamiento);
            $("#txtLanaAlmacenamiento").val(Partida.LanaAlmacenamiento);
            $("#txtViscosaAlmacenamiento").val(Partida.ViscoseAlmacenamiento);
            $("#txtStainingWhiteCloth").val(Partida.StainingWhiteCloth);
            $("#cboAlmacenamientoStatus").val(Partida.AlmacenamientoStatus.toString());

            /* Blanqueador Sin Cloro */
            $("#txtCambioColorBlanqueadorSinCloroSodiumPerborate").val(Partida.CambioColorBlanqueadorSinCloroSodiumPerborate);
            $("#txtCambioColorBlanqueadorSinCloroHydrogenPeroxide").val(Partida.CambioColorBlanqueadorSinCloroHydrogenPeroxide);
            $("#cboBlanqueadorSinClaroStatus").val(Partida.BlanqueadorSinClaroStatus.toString());

            /* Blanqueador con Cloro */
            $("#txtCambioColorBlanqueadorConCloro").val(Partida.CambioColorBlanqueadorConCloro);
            $("#cboBlanqueadorConCloroStatus").val(Partida.BlanqueadorConCloroStatus.toString());

            /* PH Value */
            $("#txtResultadoPH").val(Partida.ResultadoPH);
            $("#txtRequeridoPH").val(Partida.RequeridoPH);
            $("#cboPHStatus").val(Partida.PHStatus.toString());

            /* Wicking */
            $("#txtWikingPulgadas").val(Partida.WikingPulgadas);
            $("#txtWikingMin30Wales").val(Partida.Wales30Wiking);
            $("#txtWikingMinutes").val(Partida.WikingMinutos);
            $("#txtWikingMin30Courses").val(Partida.Courses30Wiking);
            $("#cboWikingStatus").val(Partida.WikingStatus.toString());

            /* Apariencia BV */
            $("#txtApariencia_BV").val(Partida.Apariencia_BV);
            $("#txtPilling_BV").val(Partida.Pilling_BV);
            $("#txtGradeSA_BV").val(Partida.GradeSA_BV);
            $("#txtColorChangeWithSuppressorUV_BV").val(Partida.ColorChangeWithSuppressorUV_BV);
            $("#txtAnyDefects_BV").val(Partida.AnyDefects_BV);
            $("#txtIroning_BV").val(Partida.Ironing_BV);
            $("#cboAparienciaStatus_BV").val(Partida.AparienciaStatus_BV.toString());
            $("#cboEvaluacionApariencia_BV").val(Partida.EvaluacionApariencia_BV);

            /* Revirado BV */
            _('txtReviradoBeforeAAIzq_BV').value = Partida.ReviradoBeforeAAIzq_BV;
            _('txtReviradoBeforeABIzq_BV').value = Partida.ReviradoBeforeABIzq_BV;
            _('txtReviradoBeforeResultadoIzq_BV').value = Partida.ReviradoBeforeResultadoIzq_BV;
            _('txtReviradoAfterAAIzq_BV').value = Partida.ReviradoAfterAAIzq_BV;
            _('txtReviradoAfterABIzq_BV').value = Partida.ReviradoAfterABIzq_BV;
            _('txtReviradoAfterResultadoIzq_BV').value = Partida.ReviradoAfterResultadoIzq_BV;
            _('txtReviradoChangeIzq_BV').value = Partida.ReviradoChangeIzq_BV;

            _('txtReviradoBeforeAADer_BV').value = Partida.ReviradoBeforeAADer_BV;
            _('txtReviradoBeforeABDer_BV').value = Partida.ReviradoBeforeABDer_BV;
            _('txtReviradoBeforeResultadoDer_BV').value = Partida.ReviradoBeforeResultadoDer_BV;
            _('txtReviradoAfterAADer_BV').value = Partida.ReviradoAfterAADer_BV;
            _('txtReviradoAfterABDer_BV').value = Partida.ReviradoAfterABDer_BV;
            _('txtReviradoAfterResultadoDer_BV').value = Partida.ReviradoAfterResultadoDer_BV;
            _('txtReviradoChangeDer_BV').value = Partida.ReviradoChangeDer_BV;

            _('txtReviradoChange_BV').value = Partida.ReviradoChange_BV;
            $("#cboReviradoStatus_BV").val(Partida.ReviradoStatus_BV.toString());

            /* Solidez al Lavado BV */
            _('txtCambioColor_SL_BV').value = Partida.CambioColor_SL_BV;
            _('txtAcetato_SL_BV').value = Partida.Acetato_SL_BV;
            _('txtAlgodon_SL_BV').value = Partida.Algodon_SL_BV;
            _('txtNylon_SL_BV').value = Partida.Nylon_SL_BV;
            _('txtSilk_SL_BV').value = Partida.Silk_SL_BV;
            _('txtPoliester_SL_BV').value = Partida.Poliester_SL_BV;
            _('txtAcrilico_SL_BV').value = Partida.Acrilico_SL_BV;
            _('txtLana_SL_BV').value = Partida.Lana_SL_BV;
            _('txtViscosa_SL_BV').value = Partida.Viscosa_SL_BV;
            $("#cboSolidezLavadoStatus_BV").val(Partida.SolidezLavadoStatus_BV.toString());

            /* Apariencia Despues de Lavado en Seco */
            _('txtCambioColor_AD_LS').value = Partida.CambioColor_AD_LS;
            _('txtPilling_AD_LS').value = Partida.Pilling_AD_LS;
            _('txtAcetato_AD_LS').value = Partida.Acetato_AD_LS;
            _('txtAlgodon_AD_LS').value = Partida.Algodon_AD_LS;
            _('txtNylon_AD_LS').value = Partida.Nylon_AD_LS;
            _('txtSilk_AD_LS').value = Partida.Silk_AD_LS;
            _('txtPoliester_AD_LS').value = Partida.Poliester_AD_LS;
            _('txtAcrilico_AD_LS').value = Partida.Acrilico_AD_LS;
            _('txtLana_AD_LS').value = Partida.Lana_AD_LS;
            _('txtViscosa_AD_LS').value = Partida.Viscosa_AD_LS;
            $("#cboAparienciaDespuesStatus_LS").val(Partida.AparienciaDespuesStatus_LS.toString());
            
            /* Apariencia General de Tejidos */
            _('txtCambioColor_AG').value = Partida.CambioColor_AG;
            _('txtPilling_AG').value = Partida.Pilling_AG;
            _('txtGradoSA_AG').value = Partida.GradoSA_AG;
            _('txtAcetato_AG').value = Partida.Acetato_AG;
            _('txtAlgodon_AG').value = Partida.Algodon_AG;
            _('txtNylon_AG').value = Partida.Nylon_AG;
            _('txtSilk_AG').value = Partida.Silk_AG;
            _('txtPoliester_AG').value = Partida.Poliester_AG;
            _('txtAcrilico_AG').value = Partida.Acrilico_AG;
            _('txtLana_AG').value = Partida.Lana_AG;
            _('txtViscosa_AG').value = Partida.Viscosa_AG;
            _('txtColorChangeUV_AG').value = Partida.ColorChangeUV_AG;
            _('cboEvaluacionApariencia_AG').value = Partida.EvaluacionApariencia_AG;

            _('txtReviradoBeforeAA_AG').value = Partida.ReviradoBeforeAA_AG;
            _('txtReviradoBeforeAB_AG').value = Partida.ReviradoBeforeAB_AG;
            _('txtReviradoBeforeResultado_AG').value = Partida.ReviradoBeforeResultado_AG;
            _('txtReviradoAfterAA_AG').value = Partida.ReviradoAfterAA_AG;
            _('txtReviradoAfterAB_AG').value = Partida.ReviradoAfterAB_AG;
            _('txtReviradoAfterResultado_AG').value = Partida.ReviradoAfterResultado_AG;
            _('txtReviradoChange_AG').value = Partida.ReviradoChange_AG;

            $("#cboAparienciaGeneralStatus").val(Partida.AparienciaGeneralStatus.toString());


            /* Solidez al Lavado BV*/

            /* Modal - Estabilidad Dimensional */
            $("input:radio[name ='radCicloLavadora']").each(function () {
                if ($(this).val() == Partida.CicloLavadora) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTemperaturaLavado']").each(function () {
                if ($(this).val() == Partida.TemperaturaLavado) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecado']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecado) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecadoA']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecadoTipo) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTipoLastre']").each(function () {
                if ($(this).val() == Partida.TipoLastre) {
                    this.checked = true;
                    return false;
                }
            });

            /* Modal -Revirado en Tela */
            $("input:radio[name ='radCicloLavadora_Revirado_Tela']").each(function () {
                if ($(this).val() == Partida.CicloLavadora_Revirado_Tela) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTemperaturaLavado_Revirado_Tela']").each(function () {
                if ($(this).val() == Partida.TemperaturaLavado_Revirado_Tela) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecado_Revirado_Tela']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecado_Revirado_Tela) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecadoA_Revirado_Tela']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecadoTipo_Revirado_Tela) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTipoLastre_Revirado_Tela']").each(function () {
                if ($(this).val() == Partida.TipoLastre_Revirado_Tela) {
                    this.checked = true;
                    return false;
                }
            });

            /* Modal -Revirado en Prenda */
            $("input:radio[name ='radCicloLavadora_Revirado_Prenda']").each(function () {
                if ($(this).val() == Partida.CicloLavadora_Revirado_Prenda) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTemperaturaLavado_Revirado_Prenda']").each(function () {
                if ($(this).val() == Partida.TemperaturaLavado_Revirado_Prenda) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecado_Revirado_Prenda']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecado_Revirado_Prenda) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecadoA_Revirado_Prenda']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecadoTipo_Revirado_Prenda) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTipoLastre_Revirado_Prenda']").each(function () {
                if ($(this).val() == Partida.TipoLastre_Revirado_Prenda) {
                    this.checked = true;
                    return false;
                }
            });

            /* Modal -Apariencia */
            $("input:radio[name ='radCicloLavadora_Apariencia']").each(function () {
                if ($(this).val() == Partida.CicloLavadora_Apariencia) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTemperaturaLavado_Apariencia']").each(function () {
                if ($(this).val() == Partida.TemperaturaLavado_Apariencia) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecado_Apariencia']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecado_Apariencia) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecadoA_Apariencia']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecadoTipo_Apariencia) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTipoLastre_Apariencia']").each(function () {
                if ($(this).val() == Partida.TipoLastre_Apariencia) {
                    this.checked = true;
                    return false;
                }
            });


            /* Modal - Solidez al Lavado */
            $("input:radio[name ='radSolidezLavadoMetodos']").each(function () {
                if ($(this).val() == Partida.SolidezLavadoCondiciones) {
                    this.checked = true;
                    return false;
                }
            });
            //$("input:radio[name ='radSolidezLavadoTipo']").each(function () {
            //    if ($(this).val() == Partida.SolidezLavadoTipoMultifibra) {
            //        this.checked = true;
            //        return false;
            //}
            //});
            var arr_tipo_multifibra_sl = Partida.SolidezLavadoTipoMultifibra.split('-');
            fn_load_modal_chk('mdSolidezLavadoMetodos', '_chk_tipo_multifibra_sl', arr_tipo_multifibra_sl);

            /* Modal -Apariencia BV */
            $("input:radio[name ='radCicloLavadora_Apariencia_BV']").each(function () {
                if ($(this).val() == Partida.CicloLavadora_Apariencia_BV) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTemperaturaLavado_Apariencia_BV']").each(function () {
                if ($(this).val() == Partida.TemperaturaLavado_Apariencia_BV) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecado_Apariencia_BV']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecado_Apariencia_BV) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecadoA_Apariencia_BV']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecadoTipo_Apariencia_BV) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTipoLastre_Apariencia_BV']").each(function () {
                if ($(this).val() == Partida.TipoLastre_Apariencia_BV) {
                    this.checked = true;
                    return false;
                }
            });

            /* Modal -Revirado BV */
            $("input:radio[name ='radCicloLavadora_Revirado_BV']").each(function () {
                if ($(this).val() == Partida.CicloLavadora_Revirado_BV) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTemperaturaLavado_Revirado_BV']").each(function () {
                if ($(this).val() == Partida.TemperaturaLavado_Revirado_BV) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecado_Revirado_BV']").each(function() {
                if ($(this).val() == Partida.ProcedimientoSecado_Revirado_BV) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radProcedimientoSecadoA_Revirado_BV']").each(function() {
                if ($(this).val() == Partida.ProcedimientoSecadoTipo_Revirado_BV) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTipoLastre_Revirado_BV']").each(function() {
                if ($(this).val() == Partida.TipoLastre_Revirado_BV) {
                    this.checked = true;
                    return false;
                }
            });

            /* Modal - Solidez Lavado BV */
            $("input:radio[name ='radCicloLavadora_SL_BV']").each(function () {
                if($(this).val() == Partida.CicloLavadora_SL_BV) {
                    this.checked = true;
                    return false;
                }
            });
            $("input:radio[name ='radTemperaturaLavado_SL_BV']").each(function () {
                if ($(this).val() == Partida.TemperaturaLavado_SL_BV) {
                    this.checked = true;
                    return false;
                }
                    });
            $("input:radio[name ='radProcedimientoSecado_SL_BV']").each(function() {
                if ($(this).val() == Partida.ProcedimientoSecado_SL_BV) {
                    this.checked = true;
                    return false;
                    }
                    });
            $("input:radio[name ='radProcedimientoSecadoA_SL_BV']").each(function() {
                if ($(this).val() == Partida.ProcedimientoSecadoTipo_SL_BV) {
                    this.checked = true;
                    return false;
                }
            });
                $("input:radio[name ='radTipoLastre_SL_BV']").each(function() {
                    if ($(this).val() == Partida.TipoLastre_SL_BV) {
                        this.checked = true;
                        return false;
                }
                });

            /* Modal - Apariencia General de Tejidos */
                $("input:radio[name ='radCicloLavadora_AG']").each(function () {
                    if ($(this).val() == Partida.CicloLavadora_AG) {
                        this.checked = true;
                        return false;
                    }
                });
                $("input:radio[name ='radTemperaturaLavado_AG']").each(function () {
                    if ($(this).val() == Partida.TemperaturaLavado_AG) {
                        this.checked = true;
                        return false;
                    }
                });
                $("input:radio[name ='radProcedimientoSecado_AG']").each(function () {
                    if ($(this).val() == Partida.ProcedimientoSecado_AG) {
                        this.checked = true;
                        return false;
                    }
                });
                $("input:radio[name ='radProcedimientoSecadoA_AG']").each(function () {
                    if ($(this).val() == Partida.ProcedimientoSecadoTipo_AG) {
                        this.checked = true;
                        return false;
                    }
                });
                $("input:radio[name ='radTipoLastre_AG']").each(function () {
                    if ($(this).val() == Partida.TipoLastre_AG) {
                        this.checked = true;
                        return false;
                    }
                });

            /* Modal - Solidez al la Transpiracion */
            //$("input:radio[name ='radSolidezTranspiracionTipo']").each(function () {
            //    if ($(this).val() == Partida.SolidezTranspiracionTipoMultifibra) {
            //        this.checked = true;
            //        return false;
            //    }
            //});
                var arr_tipo_multifibra_st = Partida.SolidezTranspiracionTipoMultifibra.split('-');
                fn_load_modal_chk('mdSolidezTranspiracionMetodos', '_chk_tipo_multifibra_st', arr_tipo_multifibra_st);


            /* Modal - Solidez al Agua */
            //$("input:radio[name ='radSolidezAguaTipo']").each(function() {
            //    if ($(this).val() == Partida.SolidezAguaTipoMultifibra) {
            //        this.checked = true;
            //        return false;
            //    }
            //});
                var arr_tipo_multifibra_sa = Partida.SolidezAguaTipoMultifibra.split('-');
                fn_load_modal_chk('mdSolidezAguaMetodos', '_chk_tipo_multifibra_sa', arr_tipo_multifibra_sa);

            /* Modal - Solidez al Almacenamiento */
            //$("input:radio[name ='radSolidezAlmacenamientoTipo']").each(function () {
            //    if ($(this).val() == Partida.SolidezAlmacenamientoTipoMultifibra) {
            //        this.checked = true;
            //        return false;
            //    }
            //});
                var arr_tipo_multifibra_sal = Partida.SolidezAlmacenamientoTipoMultifibra.split('-');
                fn_load_modal_chk('mdSolidezAlmacenamientoMetodos', '_chk_tipo_multifibra_sal', arr_tipo_multifibra_sal);



            /* No existe */
            $("#txtRevirado_EP").val(Partida.Revirado_EP);
            $("#txtApariencia_EP").val(Partida.Apariencia_EP);
            $("#txtPilling_EP").val(Partida.Pilling_EP);
            $("#cboReviradoStatus_EP").val(Partida.ReviradoStatus_EP.toString());
            $("#txtRevirado_HW").val(Partida.Revirado_HW);
            $("#txtApariencia_HW").val(Partida.Apariencia_HW);
            $("#txtPilling_HW").val(Partida.Pilling_HW);
            $("#cboEncogimientoStatus_HW").val(Partida.EncogimientoStatus_HW.toString());

            /* Calculados */
            if (Partida.GramajeAcabado != "") {
                $("#hdGramajeAcabado").val(Partida.GramajeAcabado);
            }

            if (Partida.Densidad != "") {
                var Densidad = parseFloat(Partida.Densidad);
                var GramajeAcabado = parseFloat(Partida.GramajeAcabado);
                var Desviacion = (((Densidad - GramajeAcabado) / GramajeAcabado) * 100).toFixed(1);

                if (Desviacion != "NaN") {
                    $("#txtDesviacion").val(Desviacion);
                }

            }

        }
    }

}


function Load() {
    //var par = _('txtpar').value;
    //var objPar = JSON.parse(par);
    GetLoadData();
}

function GetLoadData() {
    var urlaccion = 'PO/POSample/GetLoadData';
    Get(urlaccion, LoadData);
}

function LoadData(data) {

    if (data != "") {
        var Data = JSON.parse(data)[0];

        if (Data.Client != "") {
            var Client = JSON.parse(Data.Client);
            var selectClient = "<option value='0'>Select one</option>" + _comboFromJSON(Client, "IdCliente", "NombreCliente");
            $("#cboClient").append(selectClient);
        }
        if (Data.Supplier != "") {
            var Supplier = JSON.parse(Data.Supplier);
            var selectProveedor = "<option value='0'>Select one</option>" + _comboFromJSON(Supplier, "IdProveedor", "NombreProveedor");
            $("#cboSupplier").append(selectProveedor);
        }
    }

}

/* Luis */

function CalcularEncogimientoAncho(clase, target) {

    var Resultados = new Array();

    $("." + clase).each(function () {
        var Valor = $(this).val();
        Valor = parseFloat(Valor);
        var Lavado = $(this).attr("data-lavado");
        var Muestra = $(this).attr("data-muestra");
        if (!isNaN(Valor)) {
            if (Valor != 0) {
                var obj = {
                    Lavado: Lavado,
                    Muestra: Muestra,
                    Valor: Valor
                }
                Resultados.push(obj);
            }
        }
    });

    if (Resultados.length > 0) {
        var EncogimientoAncho = 0;
        var lavadofiltro = "";
        if (Resultados.some(x => x.Lavado === "5")) { lavadofiltro = "5"; }
        else if (Resultados.some(x => x.Lavado === "3")) { lavadofiltro = "3"; }
        else { lavadofiltro = "1"; }

        let filtro = Resultados.filter(x=>x.Lavado === lavadofiltro);
        let contador = 0, suma = 0;

        filtro.forEach(x => { suma += x.Valor; contador = contador + 1; });
        EncogimientoAncho = suma / contador;

        if (!isNaN(EncogimientoAncho)) {
            _(target).value = EncogimientoAncho.toFixed(1);
        }

    } else { _(target).value = 0; }
}

function CalcularEncogimientoLargo(clase, target) {

    var Resultados = new Array();

    $("." + clase).each(function () {
        var Valor = $(this).val();
        Valor = parseFloat(Valor);
        var Lavado = $(this).attr("data-lavado");
        var Muestra = $(this).attr("data-muestra");
        if (!isNaN(Valor)) {
            if (Valor != 0) {
                var obj = {
                    Lavado: Lavado,
                    Muestra: Muestra,
                    Valor: Valor
                }
                Resultados.push(obj);
            }
        }
    });

    if (Resultados.length > 0) {
        var EncogimientoLargo = 0;
        if (Resultados.some(x => x.Lavado === "5")) { lavadofiltro = "5"; }
        else if (Resultados.some(x => x.Lavado === "3")) { lavadofiltro = "3"; }
        else {
            lavadofiltro = "1";
        }

        let filtro = Resultados.filter(x => x.Lavado === lavadofiltro);
        let contador = 0, suma = 0;
        filtro.forEach(x => { suma += x.Valor; contador = contador + 1; });
        EncogimientoLargo = suma / contador;

        if (!isNaN(EncogimientoLargo)) {
            _(target).value = EncogimientoLargo.toFixed(1);
        }

    } else {
        _(target).value = 0;
    }
}

function CalcularRevirado(contenedor, clase) {

    var Resultados = new Array();
    $("." + clase).each(function () {
        var Valor = $(this).val();
        var Muestra = $(this).attr("data-muestra");
        var Lavado = $(this).attr("data-lavado");
        var Campo = $(this).attr("data-par");

        if (Valor == "") {
            Valor = 0;
        }
        //if (Valor != 0) {
        var obj = {
            Lavado: Lavado,
            Campo: Campo,
            Valor: Valor,
            Muestra: Muestra
        }
        Resultados.push(obj);
        //}
    });

    if (Resultados.length > 0) {

        let Revirado = 0, lavadofiltro = '';

        if (Resultados.some(x => x.Lavado === '5' && x.Valor > 0)) { lavadofiltro = '5'; }
        else if (Resultados.some(x => x.Lavado === '3' && x.Valor > 0)) { lavadofiltro = '3'; }
        else {
            lavadofiltro = '1';
        }

        let filtrobusqueda = Resultados.filter(x => x.Lavado === lavadofiltro);

        // Muestra A
        let AC_MA = parseFloat(filtrobusqueda.filter(x=> x.Campo === 'AC' && x.Muestra === 'A')[0].Valor);
        let BD_MA = parseFloat(filtrobusqueda.filter(x=> x.Campo === 'BD' && x.Muestra === 'A')[0].Valor);
        let R1_MA = AC_MA - BD_MA, R2_MA = AC_MA + BD_MA, R3_MA = 0;

        if (R2_MA > 0) {
            R3_MA = (R1_MA / R2_MA) * 200;
        }

        // Muestra B
        let AC_MB = parseFloat(filtrobusqueda.filter(x=> x.Campo === 'AC' && x.Muestra === 'B')[0].Valor);
        let BD_MB = parseFloat(filtrobusqueda.filter(x=> x.Campo === 'BD' && x.Muestra === 'B')[0].Valor);
        let R1_MB = AC_MB - BD_MB, R2_MB = AC_MB + BD_MB, R3_MB = 0;

        if (R2_MB > 0) {
            R3_MB = (R1_MB / R2_MB) * 200;
        }

        if (R3_MA < 0 && R3_MB > 0) {
            Revirado = R3_MA.toFixed(1) + '/' + R3_MB.toFixed(1);
        }
        else if (R3_MA > 0 && R3_MB < 0) {
            Revirado = R3_MA.toFixed(1) + '/' + R3_MB.toFixed(1);
        }
        else {
            if (R3_MA != 0 && R3_MB == 0) {
                Revirado = R3_MA;
            }
            else if (R3_MA == 0 && R3_MB != 0) {
                Revirado = R3_MB;
            }
            else {
                Revirado = (R3_MA + R3_MB) / 2;
            }
        }

        if (!isNaN(Revirado)) { _(contenedor).value = Revirado.toFixed(1); }
        else {
            _(contenedor).value = Revirado;
        }

    } else {
        _(contenedor).value = 0;
    }
}

function required_tono(oenty) {
    var divformulario = _(oenty.id);
    var elementsselect2 = divformulario.getElementsByClassName(oenty.clase);
    var array = Array.prototype.slice.apply(elementsselect2); //elementsselect2
    array.forEach(x=> {
        valor = x.value, padre = x.parentNode.parentNode;
        if (valor == '' || valor == 'No Aplica') { padre.classList.add('has-error'); }
        else {
            padre.classList.remove('has-error');
        }
    })
}

function clean_required() {
    var arr2 = [...document.getElementsByClassName('has-error')]
    arr2.forEach(x=>x.classList.remove('has-error'));
}

function req_guardar(){
req_save('guardar');
}

function req_enviar(){
req_save('enviar');
}

function req_save(_accion) {
    let partidastatus = _('cboPartidaStatus').value, tonostatus = _('cboStatusTono').value,
        texto = 'Are you sure save these values?';

    if (partidastatus == 'A' || partidastatus == 'C' || partidastatus == 'Z') {
        if (tonostatus == 'No Aplica') {
            texto = 'Are you sure save with Status Tono "No Aplica"?';
        }
    }

    swal({
        title: "Save Data",
        text: texto,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        save(_accion);
    });
}

function save(_accion) {

    var objPartida = {
        /* Cabecera*/
        CodigoPartida: $("#hfCodigoPartida").val(),
        StatusPartida: $("#cboPartidaStatus").val(),
        AprobadoComercial: $("#cboAprobadoComercial").val(),

        StatusTono: $("#cboStatusTono").val(),
        ComentarioColor: $("#txtComentarioColor").val(),
        ComentarioTesting: $("#txtComentarioTesting").val(),
        InstruccionCuidado: $("#txt_InstruccionesCuidado").val(),

        /* Estabilidad Dimensional - Tela */
        MuestraA_Ancho_1erLav_1: $("#txtMuestraA_Ancho_1erLav_1").val() == '' ? 0 : $("#txtMuestraA_Ancho_1erLav_1").val(),
        MuestraA_Ancho_3erLav_1: $("#txtMuestraA_Ancho_3erLav_1").val() == '' ? 0 : $("#txtMuestraA_Ancho_3erLav_1").val(),
        MuestraA_Ancho_5toLav_1: $("#txtMuestraA_Ancho_5toLav_1").val() == '' ? 0 : $("#txtMuestraA_Ancho_5toLav_1").val(),
        MuestraA_Largo_1erLav_1: $("#txtMuestraA_Largo_1erLav_1").val() == '' ? 0 : $("#txtMuestraA_Largo_1erLav_1").val(),
        MuestraA_Largo_3erLav_1: $("#txtMuestraA_Largo_3erLav_1").val() == '' ? 0 : $("#txtMuestraA_Largo_3erLav_1").val(),
        MuestraA_Largo_5toLav_1: $("#txtMuestraA_Largo_5toLav_1").val() == '' ? 0 : $("#txtMuestraA_Largo_5toLav_1").val(),
        MuestraB_Ancho_1erLav_1: $("#txtMuestraB_Ancho_1erLav_1").val() == '' ? 0 : $("#txtMuestraB_Ancho_1erLav_1").val(),
        MuestraB_Ancho_3erLav_1: $("#txtMuestraB_Ancho_3erLav_1").val() == '' ? 0 : $("#txtMuestraB_Ancho_3erLav_1").val(),
        MuestraB_Ancho_5toLav_1: $("#txtMuestraB_Ancho_5toLav_1").val() == '' ? 0 : $("#txtMuestraB_Ancho_5toLav_1").val(),
        MuestraB_Largo_1erLav_1: $("#txtMuestraB_Largo_1erLav_1").val() == '' ? 0 : $("#txtMuestraB_Largo_1erLav_1").val(),
        MuestraB_Largo_3erLav_1: $("#txtMuestraB_Largo_3erLav_1").val() == '' ? 0 : $("#txtMuestraB_Largo_3erLav_1").val(),
        MuestraB_Largo_5toLav_1: $("#txtMuestraB_Largo_5toLav_1").val() == '' ? 0 : $("#txtMuestraB_Largo_5toLav_1").val(),

        MuestraA_Ancho_1erLav_2: $("#txtMuestraA_Ancho_1erLav_2").val() == '' ? 0 : $("#txtMuestraA_Ancho_1erLav_2").val(),
        MuestraA_Ancho_3erLav_2: $("#txtMuestraA_Ancho_3erLav_2").val() == '' ? 0 : $("#txtMuestraA_Ancho_3erLav_2").val(),
        MuestraA_Ancho_5toLav_2: $("#txtMuestraA_Ancho_5toLav_2").val() == '' ? 0 : $("#txtMuestraA_Ancho_5toLav_2").val(),
        MuestraA_Largo_1erLav_2: $("#txtMuestraA_Largo_1erLav_2").val() == '' ? 0 : $("#txtMuestraA_Largo_1erLav_2").val(),
        MuestraA_Largo_3erLav_2: $("#txtMuestraA_Largo_3erLav_2").val() == '' ? 0 : $("#txtMuestraA_Largo_3erLav_2").val(),
        MuestraA_Largo_5toLav_2: $("#txtMuestraA_Largo_5toLav_2").val() == '' ? 0 : $("#txtMuestraA_Largo_5toLav_2").val(),
        MuestraB_Ancho_1erLav_2: $("#txtMuestraB_Ancho_1erLav_2").val() == '' ? 0 : $("#txtMuestraB_Ancho_1erLav_2").val(),
        MuestraB_Ancho_3erLav_2: $("#txtMuestraB_Ancho_3erLav_2").val() == '' ? 0 : $("#txtMuestraB_Ancho_3erLav_2").val(),
        MuestraB_Ancho_5toLav_2: $("#txtMuestraB_Ancho_5toLav_2").val() == '' ? 0 : $("#txtMuestraB_Ancho_5toLav_2").val(),
        MuestraB_Largo_1erLav_2: $("#txtMuestraB_Largo_1erLav_2").val() == '' ? 0 : $("#txtMuestraB_Largo_1erLav_2").val(),
        MuestraB_Largo_3erLav_2: $("#txtMuestraB_Largo_3erLav_2").val() == '' ? 0 : $("#txtMuestraB_Largo_3erLav_2").val(),
        MuestraB_Largo_5toLav_2: $("#txtMuestraB_Largo_5toLav_2").val() == '' ? 0 : $("#txtMuestraB_Largo_5toLav_2").val(),

        MuestraA_Ancho_1erLav_3: $("#txtMuestraA_Ancho_1erLav_3").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_3").val(),
        MuestraA_Ancho_3erLav_3: $("#txtMuestraA_Ancho_3erLav_3").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_3").val(),
        MuestraA_Ancho_5toLav_3: $("#txtMuestraA_Ancho_5toLav_3").val() == "" ? 0 : $("#txtMuestraA_Ancho_5toLav_3").val(),
        MuestraA_Largo_1erLav_3: $("#txtMuestraA_Largo_1erLav_3").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_3").val(),
        MuestraA_Largo_3erLav_3: $("#txtMuestraA_Largo_3erLav_3").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_3").val(),
        MuestraA_Largo_5toLav_3: $("#txtMuestraA_Largo_5toLav_3").val() == "" ? 0 : $("#txtMuestraA_Largo_5toLav_3").val(),
        MuestraB_Ancho_1erLav_3: $("#txtMuestraB_Ancho_1erLav_3").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_3").val(),
        MuestraB_Ancho_3erLav_3: $("#txtMuestraB_Ancho_3erLav_3").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_3").val(),
        MuestraB_Ancho_5toLav_3: $("#txtMuestraB_Ancho_5toLav_3").val() == "" ? 0 : $("#txtMuestraB_Ancho_5toLav_3").val(),
        MuestraB_Largo_1erLav_3: $("#txtMuestraB_Largo_1erLav_3").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_3").val(),
        MuestraB_Largo_3erLav_3: $("#txtMuestraB_Largo_3erLav_3").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_3").val(),
        MuestraB_Largo_5toLav_3: $("#txtMuestraB_Largo_5toLav_3").val() == "" ? 0 : $("#txtMuestraB_Largo_5toLav_3").val(),

        EncogimientoLargo: $("#txtEncogimientoLargo").val(),
        EncogimientoAncho: $("#txtEncogimientoAncho").val(),
        EncogimientoStatus: $("#cboEncogimientoStatus").val(),

        /* Estabilidad Dimensional - Prenda */
        AcrossChestOriginal: $("#txtAcrossChestOriginal").val(),
        AcrossChestOneCyle: $("#txtAcrossChestOneCyle").val(),
        AcrossChestOneCycleChange: $("#txtAcrossChestOneCyleChange").val(),
        AcrossChestThreeCyles: $("#txtAcrossChestThreeCyles").val(),
        AcrossChestThreeCycleChange: $("#txtAcrossChestThreeCylesChange").val(),
        AcrossChestFiveCycle: $("#txtAcrossChestFiveCycle").val(),
        AcrossChestFiveCycleChange: $("#txtAcrossChestFiveCycleChange").val(),

        BottomWidthOriginal: $("#txtBottomWidthOriginal").val(),
        BottomWidthOneCyle: $("#txtBottomWidthOneCyle").val(),
        BottomWidthtOneCycleChange: $("#txtBottomWidthOneCyleChange").val(),
        BottomWidthThreeCyles: $("#txtBottomWidthThreeCyles").val(),
        BottomWidthThreeCycleChange: $("#txtBottomWidthThreeCylesChange").val(),
        BottomWidthFiveCycle: $("#txtBottomWidthFiveCycle").val(),
        BottomWidthtFiveCycleChange: $("#txtBottomWidthFiveCycleChange").val(),

        BodyFromLenOriginal: $("#txtBodyFromLenOriginal").val(),
        BodyFromLeOneCyle: $("#txtBodyFromLeOneCyle").val(),
        BodyFromLenOneCycleChange: $("#txtBodyFromLeOneCyleChange").val(),
        BodyFromLeThreeCyles: $("#txtBodyFromLeThreeCyles").val(),
        BodyFromLenThreeCycleChange: $("#txtBodyFromLeThreeCylesChange").val(),
        BodyFromLeFiveCycle: $("#txtBodyFromLeFiveCycle").val(),
        BodyFromLenFiveCycleChange: $("#txtBodyFromLeFiveCycleChange").val(),

        SleeveLenOriginal: $("#txtSleeveLenOriginal").val(),
        SleeveLenOneCyle: $("#txtSleeveLenOneCyle").val(),
        SleeveLenOneCycleChange: $("#txtSleeveLenOneCyleChange").val(),
        SleeveLenThreeCyles: $("#txtSleeveLenThreeCyles").val(),
        SleeveLenThreeCycleChange: $("#txtSleeveLenThreeCylesChange").val(),
        SleeveLenFiveCycle: $("#txtSleeveLenFiveCycle").val(),
        SleeveLenFiveCycleChange: $("#txtSleeveLenFiveCycleChange").val(),

        // Luis - Nuevo
        CenterBlackLenOriginal: $("#txtCenterBlackLenOriginal").val(),
        CenterBlackLenOneCycle: $("#txtCenterBlackLenOneCycle").val(),
        CenterBlackLenOneCycleChange: $("#txtCenterBlackLenOneCycleChange").val(),
        CenterBlackLenThreeCycle: $("#txtCenterBlackLenThreeCycle").val(),
        CenterBlackLenThreeCycleChange: $("#txtCenterBlackLenThreeCycleChange").val(),
        CenterBlackLenFiveCycle: $("#txtCenterBlackLenFiveCycle").val(),
        CenterBlackLenFiveCycleChange: $("#txtCenterBlackLenFiveCycleChange").val(),

        AcrossShoulderOriginal: $("#txtAcrossShoulderOriginal").val(),
        AcrossShoulderOneCycle: $("#txtAcrossShoulderOneCycle").val(),
        AcrossShoulderOneCycleChange: $("#txtAcrossShoulderOneCycleChange").val(),
        AcrossShoulderThreeCycle: $("#txtAcrossShoulderThreeCycle").val(),
        AcrossShoulderThreeCycleChange: $("#txtAcrossShoulderThreeCycleChange").val(),
        AcrossShoulderFiveCycle: $("#txtAcrossShoulderFiveCycle").val(),
        AcrossShoulderFiveCycleChange: $("#txtAcrossShoulderFiveCycleChange").val(),
        
        ArmholeOriginal: $("#txtArmholeOriginal").val(),
        ArmholeOneCycle: $("#txtArmholeOneCycle").val(),
        ArmholeOneCycleChange: $("#txtArmholeOneCycleChange").val(),
        ArmholeThreeCycle: $("#txtArmholeThreeCycle").val(),
        ArmholeThreeCycleChange: $("#txtArmholeThreeCycleChange").val(),
        ArmholeFiveCycle: $("#txtArmholeFiveCycle").val(),
        ArmholeFiveCycleChange: $("#txtArmholeFiveCycleChange").val(),

        ArmholeIIOriginal: $("#txtArmholeIIOriginal").val(),
        ArmholeIIOneCycle: $("#txtArmholeIIOneCycle").val(),
        ArmholeIIOneCycleChange: $("#txtArmholeIIOneCycleChange").val(),
        ArmholeIIThreeCycle: $("#txtArmholeIIThreeCycle").val(),
        ArmholeIIThreeCycleChange: $("#txtArmholeIIThreeCycleChange").val(),
        ArmholeIIFiveCycle: $("#txtArmholeIIFiveCycle").val(),
        ArmholeIIFiveCycleChange: $("#txtArmholeIIFiveCycleChange").val(),

        HemOriginal: $("#txtHemOriginal").val(),
        HemOneCycle: $("#txtHemOneCycle").val(),
        HemOneCycleChange: $("#txtHemOneCycleChange").val(),
        HemThreeCycle: $("#txtHemThreeCycle").val(),
        HemThreeCycleChange: $("#txtHemThreeCycleChange").val(),
        HemFiveCycle: $("#txtHemFiveCycle").val(),
        HemFiveCycleChange: $("#txtHemFiveCycleChange").val(),

        CollarOriginal: $("#txtCollarOriginal").val(),
        CollarOneCycle: $("#txtCollarOneCycle").val(),
        CollarOneCycleChange: $("#txtCollarOneCycleChange").val(),
        CollarThreeCycle: $("#txtCollarThreeCycle").val(),
        CollarThreeCycleChange: $("#txtCollarThreeCycleChange").val(),
        CollarFiveCycle: $("#txtCollarFiveCycle").val(),
        CollarFiveCycleChange: $("#txtCollarFiveCycleChange").val(),

        CollarBandOriginal: $("#txtCollarBandOriginal").val(),
        CollarBandOneCycle: $("#txtCollarBandOneCycle").val(),
        CollarBandOneCycleChange: $("#txtCollarBandOneCycleChange").val(),
        CollarBandThreeCycle: $("#txtCollarBandThreeCycle").val(),
        CollarBandThreeCycleChange: $("#txtCollarBandThreeCycleChange").val(),
        CollarBandFiveCycle: $("#txtCollarBandFiveCycle").val(),
        CollarBandFiveCycleChange: $("#txtCollarBandFiveCycleChange").val(),
        
        CuffsOriginal: $("#txtCuffsOriginal").val(),
        CuffsOneCycle: $("#txtCuffsOneCycle").val(),
        CuffsOneCycleChange: $("#txtCuffsOneCycleChange").val(),
        CuffsThreeCycle: $("#txtCuffsThreeCycle").val(),
        CuffsThreeCycleChange: $("#txtCuffsThreeCycleChange").val(),
        CuffsFiveCycle: $("#txtCuffsFiveCycle").val(),
        CuffsFiveCycleChange: $("#txtCuffsFiveCycleChange").val(),

        NeckOpeningOriginal: $("#txtNeckOpeningOriginal").val(),
        NeckOpeningOneCycle: $("#txtNeckOpeningOneCycle").val(),
        NeckOpeningOneCycleChange: $("#txtNeckOpeningOneCycleChange").val(),
        NeckOpeningThreeCycle: $("#txtNeckOpeningThreeCycle").val(),
        NeckOpeningThreeCycleChange: $("#txtNeckOpeningThreeCycleChange").val(),
        NeckOpeningFiveCycle: $("#txtNeckOpeningFiveCycle").val(),
        NeckOpeningFiveCycleChange: $("#txtNeckOpeningFiveCycleChange").val(),

        WaistbandWidthHalfOriginal: $("#txtWaistbandWidthHalfOriginal").val(),
        WaistbandWidthHalfOneCyle: $("#txtWaistbandWidthHalfOneCyle").val(),
        WaistbandWidthHalfOneCycleChange: $("#txtWaistbandWidthHalfOneCyleChange").val(),
        WaistbandWidthHalfThreeCyles: $("#txtWaistbandWidthHalfThreeCyles").val(),
        WaistbandWidthHalfThreeCycleChange: $("#txtWaistbandWidthHalfThreeCylesChange").val(),
        WaistbandWidthHalfFiveCycle: $("#txtWaistbandWidthHalfFiveCycle").val(),
        WaistbandWidthHalfFiveCycleChange: $("#txtWaistbandWidthHalfFiveCycleChange").val(),

        LegOpeningHalfOriginal: $("#txtLegOpeningHalfOriginal").val(),
        LegOpeningHalfOneCyle: $("#txtLegOpeningHalfOneCyle").val(),
        LegOpeningHalfOneCycleChange: $("#txtLegOpeningHalfOneCyleChange").val(),
        LegOpeningHalfThreeCyles: $("#txtLegOpeningHalfThreeCyles").val(),
        LegOpeningHalfThreeCycleChange: $("#txtLegOpeningHalfThreeCylesChange").val(),
        LegOpeningHalfFiveCycle: $("#txtLegOpeningHalfFiveCycle").val(),
        LegOpeningHalfFiveCycleChange: $("#txtLegOpeningHalfFiveCycleChange").val(),

        OutseambelowOriginal: $("#txtOutseambelowOriginal").val(),
        OutseambelowOneCyle: $("#txtOutseambelowOneCyle").val(),
        OutseambelowOneCycleChange: $("#txtOutseambelowOneCyleChange").val(),
        OutseambelowThreeCyles: $("#txtOutseambelowThreeCyles").val(),
        OutseambelowThreeCycleChange: $("#txtOutseambelowThreeCylesChange").val(),
        OutseambelowFiveCycle: $("#txtOutseambelowFiveCycle").val(),
        OutseambelowFiveCycleChange: $("#txtOutseambelowFiveCycleChange").val(),

        InseamLenOriginal: $("#txtInseamLenOriginal").val(),
        InseamLenOneCyle: $("#txtInseamLenOneCyle").val(),
        InseamLenOneCycleChange: $("#txtInseamLenOneCyleChange").val(),
        InseamLenThreeCyles: $("#txtInseamLenThreeCyles").val(),
        InseamLenThreeCycleChange: $("#txtInseamLenThreeCylesChange").val(),
        InseamLenFiveCycle: $("#txtInseamLenFiveCycle").val(),
        InseamLenFiveCycleChange: $("#txtInseamLenFiveCycleChange").val(),

        EncogimientoStatusGarment: $("#cboEncogimientoGarmentStatus").val(),
        UOM: $("#cboUOM").val(),

        /* Revirado */
        MuestraA_1erLav_AC: $("#txtMuestraA_1erLav_AC").val() == "" ? 0 : $("#txtMuestraA_1erLav_AC").val(),
        MuestraA_1erLav_BD: $("#txtMuestraA_1erLav_BD").val() == "" ? 0 : $("#txtMuestraA_1erLav_BD").val(),
        MuestraA_3erLav_AC: $("#txtMuestraA_3erLav_AC").val() == "" ? 0 : $("#txtMuestraA_3erLav_AC").val(),
        MuestraA_3erLav_BD: $("#txtMuestraA_3erLav_BD").val() == "" ? 0 : $("#txtMuestraA_3erLav_BD").val(),
        MuestraA_5toLav_AC: $("#txtMuestraA_5toLav_AC").val() == "" ? 0 : $("#txtMuestraA_5toLav_AC").val(),
        MuestraA_5toLav_BD: $("#txtMuestraA_5toLav_BD").val() == "" ? 0 : $("#txtMuestraA_5toLav_BD").val(),
        MuestraB_1erLav_AC: $("#txtMuestraB_1erLav_AC").val() == "" ? 0 : $("#txtMuestraB_1erLav_AC").val(),
        MuestraB_1erLav_BD: $("#txtMuestraB_1erLav_BD").val() == "" ? 0 : $("#txtMuestraB_1erLav_BD").val(),
        MuestraB_3erLav_AC: $("#txtMuestraB_3erLav_AC").val() == "" ? 0 : $("#txtMuestraB_3erLav_AC").val(),
        MuestraB_3erLav_BD: $("#txtMuestraB_3erLav_BD").val() == "" ? 0 : $("#txtMuestraB_3erLav_BD").val(),
        MuestraB_5toLav_AC: $("#txtMuestraB_5toLav_AC").val() == "" ? 0 : $("#txtMuestraB_5toLav_AC").val(),
        MuestraB_5toLav_BD: $("#txtMuestraB_5toLav_BD").val() == "" ? 0 : $("#txtMuestraB_5toLav_BD").val(),

        Revirado: $("#txtRevirado").val(),
        ReviradoStatus: $("#cboReviradoStatus").val(),

        /* Estabilidad Dimensional - Tela - DryCleaning */
        MuestraA_Ancho_1erLav_1_EP: $("#txtMuestraA_Ancho_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_1_EP").val(),
        MuestraA_Ancho_3erLav_1_EP: $("#txtMuestraA_Ancho_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_1_EP").val(),
        MuestraA_Ancho_1erLav_2_EP: $("#txtMuestraA_Ancho_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_2_EP").val(),
        MuestraA_Ancho_3erLav_2_EP: $("#txtMuestraA_Ancho_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_2_EP").val(),
        MuestraA_Ancho_1erLav_3_EP: $("#txtMuestraA_Ancho_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_3_EP").val(),
        MuestraA_Ancho_3erLav_3_EP: $("#txtMuestraA_Ancho_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_3_EP").val(),
        MuestraA_Largo_1erLav_1_EP: $("#txtMuestraA_Largo_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_1_EP").val(),
        MuestraA_Largo_3erLav_1_EP: $("#txtMuestraA_Largo_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_1_EP").val(),
        MuestraA_Largo_1erLav_2_EP: $("#txtMuestraA_Largo_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_2_EP").val(),
        MuestraA_Largo_3erLav_2_EP: $("#txtMuestraA_Largo_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_2_EP").val(),
        MuestraA_Largo_1erLav_3_EP: $("#txtMuestraA_Largo_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_3_EP").val(),
        MuestraA_Largo_3erLav_3_EP: $("#txtMuestraA_Largo_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_3_EP").val(),

        MuestraA_1erLav_AC_EP: $("#txtMuestraA_1erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraA_1erLav_AC_EP").val(),
        MuestraA_1erLav_BD_EP: $("#txtMuestraA_1erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraA_1erLav_BD_EP").val(),
        MuestraA_3erLav_AC_EP: $("#txtMuestraA_3erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraA_3erLav_AC_EP").val(),
        MuestraA_3erLav_BD_EP: $("#txtMuestraA_3erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraA_3erLav_BD_EP").val(),

        MuestraB_Ancho_1erLav_1_EP: $("#txtMuestraB_Ancho_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_1_EP").val(),
        MuestraB_Ancho_3erLav_1_EP: $("#txtMuestraB_Ancho_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_1_EP").val(),
        MuestraB_Ancho_1erLav_2_EP: $("#txtMuestraB_Ancho_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_2_EP").val(),
        MuestraB_Ancho_3erLav_2_EP: $("#txtMuestraB_Ancho_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_2_EP").val(),
        MuestraB_Ancho_1erLav_3_EP: $("#txtMuestraB_Ancho_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_3_EP").val(),
        MuestraB_Ancho_3erLav_3_EP: $("#txtMuestraB_Ancho_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_3_EP").val(),
        MuestraB_Largo_1erLav_1_EP: $("#txtMuestraB_Largo_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_1_EP").val(),
        MuestraB_Largo_3erLav_1_EP: $("#txtMuestraB_Largo_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_1_EP").val(),
        MuestraB_Largo_1erLav_2_EP: $("#txtMuestraB_Largo_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_2_EP").val(),
        MuestraB_Largo_3erLav_2_EP: $("#txtMuestraB_Largo_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_2_EP").val(),
        MuestraB_Largo_1erLav_3_EP: $("#txtMuestraB_Largo_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_3_EP").val(),
        MuestraB_Largo_3erLav_3_EP: $("#txtMuestraB_Largo_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_3_EP").val(),

        MuestraB_1erLav_AC_EP: $("#txtMuestraB_1erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraB_1erLav_AC_EP").val(),
        MuestraB_1erLav_BD_EP: $("#txtMuestraB_1erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraB_1erLav_BD_EP").val(),
        MuestraB_3erLav_AC_EP: $("#txtMuestraB_3erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraB_3erLav_AC_EP").val(),
        MuestraB_3erLav_BD_EP: $("#txtMuestraB_3erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraB_3erLav_BD_EP").val(),

        EncogimientoLargo_EP: $("#txtEncogimientoLargo_EP").val(),
        EncogimientoAncho_EP: $("#txtEncogimientoAncho_EP").val(),
        EncogimientoStatus_EP: $("#cboEncogimientoStatus_EP").val(),

        /* Estabilidad Dimensional - Tela - Han Wash */
        MuestraA_Ancho_1erLav_1_HW: $("#txtMuestraA_Ancho_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_1_HW").val(),
        MuestraA_Ancho_3erLav_1_HW: $("#txtMuestraA_Ancho_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_1_HW").val(),
        MuestraA_Ancho_1erLav_2_HW: $("#txtMuestraA_Ancho_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_2_HW").val(),
        MuestraA_Ancho_3erLav_2_HW: $("#txtMuestraA_Ancho_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_2_HW").val(),
        MuestraA_Ancho_1erLav_3_HW: $("#txtMuestraA_Ancho_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_3_HW").val(),
        MuestraA_Ancho_3erLav_3_HW: $("#txtMuestraA_Ancho_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_3_HW").val(),
        MuestraA_Largo_1erLav_1_HW: $("#txtMuestraA_Largo_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_1_HW").val(),
        MuestraA_Largo_3erLav_1_HW: $("#txtMuestraA_Largo_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_1_HW").val(),
        MuestraA_Largo_1erLav_2_HW: $("#txtMuestraA_Largo_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_2_HW").val(),
        MuestraA_Largo_3erLav_2_HW: $("#txtMuestraA_Largo_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_2_HW").val(),
        MuestraA_Largo_1erLav_3_HW: $("#txtMuestraA_Largo_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_3_HW").val(),
        MuestraA_Largo_3erLav_3_HW: $("#txtMuestraA_Largo_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_3_HW").val(),

        MuestraA_1erLav_AC_HW: $("#txtMuestraA_1erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraA_1erLav_AC_HW").val(),
        MuestraA_1erLav_BD_HW: $("#txtMuestraA_1erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraA_1erLav_BD_HW").val(),
        MuestraA_3erLav_AC_HW: $("#txtMuestraA_3erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraA_3erLav_AC_HW").val(),
        MuestraA_3erLav_BD_HW: $("#txtMuestraA_3erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraA_3erLav_BD_HW").val(),

        MuestraB_Ancho_1erLav_1_HW: $("#txtMuestraB_Ancho_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_1_HW").val(),
        MuestraB_Ancho_3erLav_1_HW: $("#txtMuestraB_Ancho_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_1_HW").val(),
        MuestraB_Ancho_1erLav_2_HW: $("#txtMuestraB_Ancho_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_2_HW").val(),
        MuestraB_Ancho_3erLav_2_HW: $("#txtMuestraB_Ancho_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_2_HW").val(),
        MuestraB_Ancho_1erLav_3_HW: $("#txtMuestraB_Ancho_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_3_HW").val(),
        MuestraB_Ancho_3erLav_3_HW: $("#txtMuestraB_Ancho_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_3_HW").val(),
        MuestraB_Largo_1erLav_1_HW: $("#txtMuestraB_Largo_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_1_HW").val(),
        MuestraB_Largo_3erLav_1_HW: $("#txtMuestraB_Largo_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_1_HW").val(),
        MuestraB_Largo_1erLav_2_HW: $("#txtMuestraB_Largo_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_2_HW").val(),
        MuestraB_Largo_3erLav_2_HW: $("#txtMuestraB_Largo_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_2_HW").val(),
        MuestraB_Largo_1erLav_3_HW: $("#txtMuestraB_Largo_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_3_HW").val(),
        MuestraB_Largo_3erLav_3_HW: $("#txtMuestraB_Largo_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_3_HW").val(),

        MuestraB_1erLav_AC_HW: $("#txtMuestraB_1erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraB_1erLav_AC_HW").val(),
        MuestraB_1erLav_BD_HW: $("#txtMuestraB_1erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraB_1erLav_BD_HW").val(),
        MuestraB_3erLav_AC_HW: $("#txtMuestraB_3erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraB_3erLav_AC_HW").val(),
        MuestraB_3erLav_BD_HW: $("#txtMuestraB_3erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraB_3erLav_BD_HW").val(),

        EncogimientoLargo_HW: $("#txtEncogimientoLargo_HW").val(),
        EncogimientoAncho_HW: $("#txtEncogimientoAncho_HW").val(),
        EncogimientoStatus_HW: $("#cboEncogimientoStatus_HW").val(),

        /* Apariencia */
        Apariencia: $("#txtApariencia").val(),
        Pilling: $("#txtPilling").val(),
        GradeSA: $("#txtGradoSA").val(),
        ColorChangeWithSuppressorUV: $("#txtColorChangeWithSuppressorUV").val(),
        AparienciaStatus: $("#cboAparienciaStatus").val(),
        EvaluacionAparienciaSL: $("#cboEvaluacionApariencia").val(),

        /* Revirado en Prenda */
        // Revirado en Prenda - Izquierdo
        SeamTwistAA: $("#txtAABefore").val(),
        SeamTwistAB: $("#txtABBefore").val(),
        SeamTwistResultado: $("#txtSeamResultadoBefore").val(),
        SeamTwistAAAfter: $("#txtAAAfter").val(),
        SeamTwistABAfter: $("#txtABAfter").val(),
        SeamTwistResultadoAfter: $("#txtSeamResultadoAfter").val(),
        SeamTwistChange: $("#txtSeamChange").val(),

        // Luis - Nuevo        
         // Revirado en Prenda - Derecho
        ReviradoPrendaBeforeAADer: $("#txtReviradoPrendaBeforeAADer").val(),
        ReviradoPrendaBeforeABDer: $("#txtReviradoPrendaBeforeABDer").val(),
        ReviradoPrendaBeforeResultadoDer: $("#txtReviradoPrendaBeforeResultadoDer").val(),

        ReviradoPrendaAfterAADer: $("#txtReviradoPrendaAfterAADer").val(),
        ReviradoPrendaAfterABDer: $("#txtReviradoPrendaAfterABDer").val(),
        ReviradoPrendaAfterResultadoDer: $("#txtReviradoPrendaAfterResultadoDer").val(),

        ReviradoPrendaChangeDer: $("#txtReviradoPrendaChangeDer").val(),

        //Resultado
        ReviradoPrendaChange: $("#txtReviradoPrendaChange").val(),
        SeamTwistStatus: $("#cboSeamTwistStatus").val(),

        /* Densidad de Tela */
        Muestra1Densidad: $("#txtMuestra1Densidad").val(),
        Muestra2Densidad: $("#txtMuestra2Densidad").val(),
        Muestra3Densidad: $("#txtMuestra3Densidad").val(),
        Densidad: $("#txtDensidad").val(),

        Muestra1Ancho: $("#txtMuestra1Ancho").val(),
        Muestra2Ancho: $("#txtMuestra2Ancho").val(),
        Muestra3Ancho: $("#txtMuestra3Ancho").val(),
        AnchoAcabado: $("#txtAnchoAcabado").val(),

        DensidadStatus: $("#cboDensidadStatus").val(),

        /* Solidez al Frote */
        Seco: $("#txtSeco").val(),
        Humedo: $("#txtHumedo").val(),
        SolidezFroteStatus: $("#cboSolidezFroteStatus").val(),

        /* Solidez al Lavado */
        CambioColorSL: $("#txtCambioColorSL").val(),
        AcetatoSL: $("#txtAcetatoSL").val(),
        AlgodonSL: $("#txtAlgodonSL").val(),
        NylonSL: $("#txtNylonSL").val(),
        SilkSL: $("#txtSilkSL").val(),
        PoliesterSL: $("#txtPoliesterSL").val(),
        AcrilicoSL: $("#txtAcrilicoSL").val(),
        LanaSL: $("#txtLanaSL").val(),
        ViscosaSL: $("#txtViscosaSL").val(),
        SolidezLavadoStatus: $("#cboSolidezLavadoStatus").val(),

        /* Solidez al Lavado Modifcado*/
        CambioColorSLM: $("#txtCambioColorSLM").val(),
        AcetatoSLM: $("#txtAcetatoSLM").val(),
        AlgodonSLM: $("#txtAlgodonSLM").val(),
        NylonSLM: $("#txtNylonSLM").val(),
        SilkSLM: $("#txtSilkSLM").val(),
        PoliesterSLM: $("#txtPoliesterSLM").val(),
        AcrilicoSLM: $("#txtAcrilicoSLM").val(),
        LanaSLM: $("#txtLanaSLM").val(),
        ViscosaSLM: $("#txtViscosaSLM").val(),
        SolidezLavadoModificado: $("#cboSolidezLavadoModificadoStatus").val(),

        /* Resistencia Pilling */
        PillingResultado: $("#txtPillingResultado").val(),
        PillingMin: $("#txtPillingMin").val(),
        ResumenTestingPilling: $("#cboPillingStatus").val(),

        /* Bursting */
        BurstingResultado: $("#txtBurstingResultado").val(),
        BurstingMin: $("#txtBurstingMin").val(),
        BurstingStatus: $("#cboBurstingStatus").val(),

        /* Solidez a la Transpiración */
        CambioColorST: $("#txtCambioColorST").val(),
        AcetatoST: $("#txtAcetatoST").val(),
        AlgodonST: $("#txtAlgodonST").val(),
        NylonST: $("#txtNylonST").val(),
        SilkST: $("#txtSilkST").val(),
        PoliesterST: $("#txtPoliesterST").val(),
        AcrilicoST: $("#txtAcrilicoST").val(),
        LanaST: $("#txtLanaST").val(),
        ViscosaST: $("#txtViscosaST").val(),
        SolidezTranspiracionStatus: $("#cboSolidezTranspiracionStatus").val(),

        /* Solidez al Agua */
        CambioColorSA: $("#txtCambioColorSA").val(),
        AcetatoSA: $("#txtAcetatoSA").val(),
        AlgodonSA: $("#txtAlgodonSA").val(),
        NylonSA: $("#txtNylonSA").val(),
        SilkSA: $("#txtSilkSA").val(),
        PoliesterSA: $("#txtPoliesterSA").val(),
        AcrilicoSA: $("#txtAcrilicoSA").val(),
        LanaSA: $("#txtLanaSA").val(),
        ViscosaSA: $("#txtViscosaSA").val(),
        SolidezAguaStatus: $("#cboSolidezAguaStatus").val(),

        /* Almacenamiento */
        CambioColorAlmacenamiento: $("#txtCambioColorAlmacenamiento").val(),
        AcetatoAlmacenamiento: $("#txtAcetatoAlmacenamiento").val(),
        AlgodonAlmacenamiento: $("#txtAlgodonAlmacenamiento").val(),
        NylonAlmacenamiento: $("#txtNylonAlmacenamiento").val(),
        SilkAlmacenamiento: $("#txtSilkAlmacenamiento").val(),
        PoliesterAlmacenamiento: $("#txtPoliesterAlmacenamiento").val(),
        AcrilicoAlmacenamiento: $("#txtAcrilicoAlmacenamiento").val(),
        LanaAlmacenamiento: $("#txtLanaAlmacenamiento").val(),
        ViscoseAlmacenamiento: $("#txtViscosaAlmacenamiento").val(),
        StainingWhiteCloth: $("#txtStainingWhiteCloth").val(),
        AlmacenamientoStatus: $("#cboAlmacenamientoStatus").val(),

        /* Blanqueador Sin Cloro */
        CambioColorBlanqueadorSinCloroSodiumPerborate: $("#txtCambioColorBlanqueadorSinCloroSodiumPerborate").val(),
        CambioColorBlanqueadorSinCloroHydrogenPeroxide: $("#txtCambioColorBlanqueadorSinCloroHydrogenPeroxide").val(),
        BlanqueadorSinClaroStatus: $("#cboBlanqueadorSinClaroStatus").val(),

        /* Blanqueador con Cloro */
        CambioColorBlanqueadorConCloro: $("#txtCambioColorBlanqueadorConCloro").val(),
        BlanqueadorConCloroStatus: $("#cboBlanqueadorConCloroStatus").val(),

        /* PH Value */
        ResultadoPH: $("#txtResultadoPH").val(),
        RequeridoPH: $("#txtRequeridoPH").val(),
        PHStatus: $("#cboPHStatus").val(),

        /* Wicking */
        WikingPulgadas: $("#txtWikingPulgadas").val(),
        WikingMinutes: $("#txtWikingMinutes").val(),
        WikingMin30Wales: $("#txtWikingMin30Wales").val(),
        WikingMin30Courses: $("#txtWikingMin30Courses").val(),
        WikingStatus: $("#cboWikingStatus").val(),

        /* Apariencia BV */
        Apariencia_BV: $("#txtApariencia_BV").val(),
        Pilling_BV: $("#txtPilling_BV").val(),
        GradeSA_BV: $("#txtGradeSA_BV").val(),
        ColorChangeWithSuppressorUV_BV: $("#txtColorChangeWithSuppressorUV_BV").val(),
        AnyDefects_BV: $("#txtAnyDefects_BV").val(),
        Ironing_BV: $("#txtIroning_BV").val(),
        AparienciaStatus_BV: $("#cboAparienciaStatus_BV").val(),
        EvaluacionApariencia_BV: $("#cboEvaluacionApariencia_BV").val(),
               
        /* Revirado BV */
        // Revirado BV - Izquierdo
        ReviradoBeforeAAIzq_BV: $("#txtReviradoBeforeAAIzq_BV").val(),
        ReviradoBeforeABIzq_BV: $("#txtReviradoBeforeABIzq_BV").val(),
        ReviradoBeforeResultadoIzq_BV: $("#txtReviradoBeforeResultadoIzq_BV").val(),

        ReviradoAfterAAIzq_BV: $("#txtReviradoAfterAAIzq_BV").val(),
        ReviradoAfterABIzq_BV: $("#txtReviradoAfterABIzq_BV").val(),
        ReviradoAfterResultadoIzq_BV: $("#txtReviradoAfterResultadoIzq_BV").val(),

        ReviradoChangeIzq_BV: $("#txtReviradoChangeIzq_BV").val(),                

        // Revirado BV - Derecho
        ReviradoBeforeAADer_BV: $("#txtReviradoBeforeAADer_BV").val(),
        ReviradoBeforeABDer_BV: $("#txtReviradoBeforeABDer_BV").val(),
        ReviradoBeforeResultadoDer_BV: $("#txtReviradoBeforeResultadoDer_BV").val(),

        ReviradoAfterAADer_BV: $("#txtReviradoAfterAADer_BV").val(),
        ReviradoAfterABDer_BV: $("#txtReviradoAfterABDer_BV").val(),
        ReviradoAfterResultadoDer_BV: $("#txtReviradoAfterResultadoDer_BV").val(),

        ReviradoChangeDer_BV: $("#txtReviradoChangeDer_BV").val(),

        //Resultado
        ReviradoChange_BV: $("#txtReviradoChange_BV").val(),
        ReviradoStatus_BV: $("#cboReviradoStatus_BV").val(),

        /* Solidez al Lavado BV */
        CambioColor_SL_BV: $("#txtCambioColor_SL_BV").val(),
        Acetato_SL_BV: $("#txtAcetato_SL_BV").val(),
        Algodon_SL_BV: $("#txtAlgodon_SL_BV").val(),
        Nylon_SL_BV: $("#txtNylon_SL_BV").val(),
        Silk_SL_BV: $("#txtSilk_SL_BV").val(),
        Poliester_SL_BV: $("#txtPoliester_SL_BV").val(),
        Acrilico_SL_BV: $("#txtAcrilico_SL_BV").val(),
        Lana_SL_BV: $("#txtLana_SL_BV").val(),
        Viscosa_SL_BV: $("#txtViscosa_SL_BV").val(),
        SolidezLavadoStatus_BV: $("#cboSolidezLavadoStatus_BV").val(),

        /* Apariencia Despues de Lavado en Seco */
        CambioColor_AD_LS: $("#txtCambioColor_AD_LS").val(),
        Pilling_AD_LS: $("#txtPilling_AD_LS").val(),
        Acetato_AD_LS: $("#txtAcetato_AD_LS").val(),
        Algodon_AD_LS: $("#txtAlgodon_AD_LS").val(),
        Nylon_AD_LS: $("#txtNylon_AD_LS").val(),
        Silk_AD_LS: $("#txtSilk_AD_LS").val(),
        Poliester_AD_LS: $("#txtPoliester_AD_LS").val(),
        Acrilico_AD_LS: $("#txtAcrilico_AD_LS").val(),
        Lana_AD_LS: $("#txtLana_AD_LS").val(),
        Viscosa_AD_LS: $("#txtViscosa_AD_LS").val(),
        AparienciaDespuesStatus_LS: $("#cboAparienciaDespuesStatus_LS").val(),

        /* Apariencia General de Tejidos */
        CambioColor_AG: $("#txtCambioColor_AG").val(),
        Pilling_AG: $("#txtPilling_AG").val(),
        GradoSA_AG: $("#txtGradoSA_AG").val(),
        Acetato_AG: $("#txtAcetato_AG").val(),
        Algodon_AG: $("#txtAlgodon_AG").val(),
        Nylon_AG: $("#txtNylon_AG").val(),
        Silk_AG: $("#txtSilk_AG").val(),
        Poliester_AG: $("#txtPoliester_AG").val(),
        Acrilico_AG: $("#txtAcrilico_AG").val(),
        Lana_AG: $("#txtLana_AG").val(),
        Viscosa_AG: $("#txtViscosa_AG").val(),
        ColorChangeUV_AG: $("#txtColorChangeUV_AG").val(),
        EvaluacionApariencia_AG: $("#cboEvaluacionApariencia_AG").val(),
        AparienciaGeneralStatus: $("#cboAparienciaGeneralStatus").val(),

        ReviradoBeforeAA_AG: $("#txtReviradoBeforeAA_AG").val(),
        ReviradoBeforeAB_AG: $("#txtReviradoBeforeAB_AG").val(),
        ReviradoBeforeResultado_AG: $("#txtReviradoBeforeResultado_AG").val(),
        ReviradoAfterAA_AG: $("#txtReviradoAfterAA_AG").val(),
        ReviradoAfterAB_AG: $("#txtReviradoAfterAB_AG").val(),
        ReviradoAfterResultado_AG: $("#txtReviradoAfterResultado_AG").val(),
        ReviradoChange_AG: $("#txtReviradoChange_AG").val(),

        /********* MODAL *********/

        /* Modal - Estabilidad Dimensional */
        CicloLavadora: $("input:radio[name ='radCicloLavadora']:checked").val(),
        TemperaturaLavado: $("input:radio[name ='radTemperaturaLavado']:checked").val(),
        ProcedimientoSecado: $("input:radio[name ='radProcedimientoSecado']:checked").val(),
        ProcedimientoSecadoTipo: $("input:radio[name ='radProcedimientoSecadoA']:checked").val(),
        TipoLastre: $("input:radio[name ='radTipoLastre']:checked").val(),

        /* Modal - Revirado Tela */
        CicloLavadora_Revirado_Tela: $("input:radio[name ='radCicloLavadora_Revirado_Tela']:checked").val(),
        TemperaturaLavado_Revirado_Tela: $("input:radio[name ='radTemperaturaLavado_Revirado_Tela']:checked").val(),
        ProcedimientoSecado_Revirado_Tela: $("input:radio[name ='radProcedimientoSecado_Revirado_Tela']:checked").val(),
        ProcedimientoSecadoTipo_Revirado_Tela: $("input:radio[name ='radProcedimientoSecadoA_Revirado_Tela']:checked").val(),
        TipoLastre_Revirado_Tela: $("input:radio[name ='radTipoLastre_Revirado_Tela']:checked").val(),

        /* Modal - Revirado Prenda */
        CicloLavadora_Revirado_Prenda: $("input:radio[name ='radCicloLavadora_Revirado_Prenda']:checked").val(),
        TemperaturaLavado_Revirado_Prenda: $("input:radio[name ='radTemperaturaLavado_Revirado_Prenda']:checked").val(),
        ProcedimientoSecado_Revirado_Prenda: $("input:radio[name ='radProcedimientoSecado_Revirado_Prenda']:checked").val(),
        ProcedimientoSecadoTipo_Revirado_Prenda: $("input:radio[name ='radProcedimientoSecadoA_Revirado_Prenda']:checked").val(),
        TipoLastre_Revirado_Prenda: $("input:radio[name ='radTipoLastre_Revirado_Prenda']:checked").val(),

        /* Modal - Apariencia */
        CicloLavadora_Apariencia: $("input:radio[name ='radCicloLavadora_Apariencia']:checked").val(),
        TemperaturaLavado_Apariencia: $("input:radio[name ='radTemperaturaLavado_Apariencia']:checked").val(),
        ProcedimientoSecado_Apariencia: $("input:radio[name ='radProcedimientoSecado_Apariencia']:checked").val(),
        ProcedimientoSecadoTipo_Apariencia: $("input:radio[name ='radProcedimientoSecadoA_Apariencia']:checked").val(),
        TipoLastre_Apariencia: $("input:radio[name ='radTipoLastre_Apariencia']:checked").val(),

        /* Modal - Apariencia BV */
        CicloLavadora_Apariencia_BV: $("input:radio[name ='radCicloLavadora_Apariencia_BV']:checked").val(),
        TemperaturaLavado_Apariencia_BV: $("input:radio[name ='radTemperaturaLavado_Apariencia_BV']:checked").val(),
        ProcedimientoSecado_Apariencia_BV: $("input:radio[name ='radProcedimientoSecado_Apariencia_BV']:checked").val(),
        ProcedimientoSecadoTipo_Apariencia_BV: $("input:radio[name ='radProcedimientoSecadoA_Apariencia_BV']:checked").val(),
        TipoLastre_Apariencia_BV: $("input:radio[name ='radTipoLastre_Apariencia_BV']:checked").val(),

        /* Modal - Revirado BV */
        CicloLavadora_Revirado_BV: $("input:radio[name ='radCicloLavadora_Revirado_BV']:checked").val(),
        TemperaturaLavado_Revirado_BV: $("input:radio[name ='radTemperaturaLavado_Revirado_BV']:checked").val(),
        ProcedimientoSecado_Revirado_BV: $("input:radio[name ='radProcedimientoSecado_Revirado_BV']:checked").val(),
        ProcedimientoSecadoTipo_Revirado_BV: $("input:radio[name ='radProcedimientoSecadoA_Revirado_BV']:checked").val(),
        TipoLastre_Revirado_BV: $("input:radio[name ='radTipoLastre_Revirado_BV']:checked").val(),

        /* Modal - Solidez al Lavado BV */
        CicloLavadora_SL_BV: $("input:radio[name ='radCicloLavadora_SL_BV']:checked").val(),
        TemperaturaLavado_SL_BV: $("input:radio[name ='radTemperaturaLavado_SL_BV']:checked").val(),
        ProcedimientoSecado_SL_BV: $("input:radio[name ='radProcedimientoSecado_SL_BV']:checked").val(),
        ProcedimientoSecadoTipo_SL_BV: $("input:radio[name ='radProcedimientoSecadoA_SL_BV']:checked").val(),
        TipoLastre_SL_BV: $("input:radio[name ='radTipoLastre_SL_BV']:checked").val(),

        /* Modal - Apariencia General de Tejidos */
        CicloLavadora_AG: $("input:radio[name ='radCicloLavadora_AG']:checked").val(),
        TemperaturaLavado_AG: $("input:radio[name ='radTemperaturaLavado_AG']:checked").val(),
        ProcedimientoSecado_AG: $("input:radio[name ='radProcedimientoSecado_AG']:checked").val(),
        ProcedimientoSecadoTipo_AG: $("input:radio[name ='radProcedimientoSecadoA_AG']:checked").val(),
        TipoLastre_AG: $("input:radio[name ='radTipoLastre_AG']:checked").val(),
        
        /* Modal - Solidez al Lavado */
        SolidezLavadoCondiciones: $("input:radio[name ='radSolidezLavadoMetodos']:checked").val(),
        //SolidezLavadoTipoMultifibra: $("input:radio[name ='radSolidezLavadoTipo']:checked").val(),
        SolidezLavadoTipoMultifibra: fn_obtener_modal_chk('mdSolidezLavadoMetodos', '_chk_tipo_multifibra_sl'),

        /* Modal - Solidez a la Transpiración */        
        SolidezTranspiracionTipoMultifibra: fn_obtener_modal_chk('mdSolidezTranspiracionMetodos', '_chk_tipo_multifibra_st'),

        /* Modal - Solidez a la Transpiración */
        //SolidezAguaTipoMultifibra: $("input:radio[name ='radSolidezAguaTipo']:checked").val(),
        SolidezAguaTipoMultifibra: fn_obtener_modal_chk('mdSolidezAguaMetodos', '_chk_tipo_multifibra_sa'),

        /* Modal - Solidez a la Transpiración */
        //SolidezAlmacenamientoTipoMultifibra: $("input:radio[name ='radSolidezAlmacenamientoTipo']:checked").val(),
        SolidezAlmacenamientoTipoMultifibra: fn_obtener_modal_chk('mdSolidezAlmacenamientoMetodos', '_chk_tipo_multifibra_sal'),
        
        /* No existe */
        Revirado_EP: $("#txtRevirado_EP").val(),
        Apariencia_EP: $("#txtApariencia_EP").val(),
        Pilling_EP: $("#txtPilling_EP").val(),
        ReviradoStatus_EP: $("#cboReviradoStatus_EP").val(),
        Revirado_HW: $("#txtRevirado_HW").val(),
        Apariencia_HW: $("#txtApariencia_HW").val(),
        Pilling_HW: $("#txtPilling_HW").val(),
        ReviradoStatus_HW: $("#cboReviradoStatus_HW").val()
        //WickingRequerido: $("#txtWickingRequerido").val(),

       
    };

    var frm = new FormData();
    var JsonString = JSON.stringify(objPartida).replace(/undefined/g, '');
    var ReporteTecnico = $("#txtReporteTecnico").val();
    var NumeroPartida = $("#txtPartida").val();
    var IdClienteERP = $("#hfIdClienteERP").val();
    var IdProveedor = $("#hfIdProveedor").val();
    var NombreEstado = $("#cboPartidaStatus option:selected").attr('name');
    var Cliente = $("#txtCliente").val();
    var Fabrica = $("#txtFabrica").val();
    var Tipoprueba = $("#hfTipoPrueba").val();
    var Accion = _accion;

    frm.append("par", JsonString);
    frm.append("status", objPartida.StatusPartida);
    frm.append("statustono", objPartida.StatusTono);
    frm.append("reportetecnico", ReporteTecnico);
    frm.append("partida", NumeroPartida);
    frm.append("idclienteerp", IdClienteERP);
    frm.append("idproveedor", IdProveedor);
    frm.append("idpartida", $("#hfCodigoPartida").val());
    frm.append("cliente", Cliente);
    frm.append("fabrica", Fabrica);
    frm.append("tipoprueba", Tipoprueba);
    frm.append("accion", Accion);

    if (oVariables.arrInstruccionCuidadoChk.length > 0) { frm.append('pardetail', JSON.stringify(oVariables.arrInstruccionCuidadoChk)); }
    else { frm.append('pardetail', ''); }

    Post('Laboratorio/Partida/SaveTest', frm, Alerta);

}

function fn_obtener_modal_chk(_id, _class) {    
    let arr = Array.from(document.getElementsByClassName(_class)), resultado = '';
    arr.forEach(x=> { if (x.checked) { resultado = resultado == '' ? x.value : resultado + '-' + x.value; } });
    return resultado;
}

function fn_load_modal_chk(_id, _class, _arrvalue) {
    let arr = Array.from(document.getElementsByClassName(_class));
    arr.forEach(x=> { x.checked = _arrvalue.some(y=> { return (y === x.value) }) });
}

function fn_probar() {
    var y = fn_obtener_modal_chk('mdSolidezTranspiracionMetodos', '_chk_tipo_multifibra_st');

    var m = "";
}

function movilizartab(event, field) {
    move_right(event);
}

function DigitimosDecimalesConNegativo(e, field) {
    //event.preventDefault();
    var o = e.target;
    var celdaini = o.parentNode.cellIndex;
    var filaini = o.parentNode.parentNode.sectionRowIndex;
    var table = o.parentNode.parentNode.parentNode.parentNode;
    var clase = table.classList.contains('table');
    if (clase) {

        var filasmax = table.tBodies[0].rows.length - 1;
        var celdasmax = table.tBodies[0].rows[0].cells.length - 1;


        if (e.keyCode === 13 || e.keyCode === 9) {
            let body = table.tBodies[0];
            let filaresult, celdaresult;

            if (filaini < filasmax) {
                filaresult = filaini + 1;
                celdaresult = celdaini
            }
            else {
                filaresult = 0;
                if (celdaini < celdasmax) {
                    celdaresult = celdaini + 1;
                }
                else {
                    let revirado = table.parentNode.parentNode.parentNode.parentNode;
                    let x = revirado.id;
                    if (x == 'divRevirado') { celdaresult = 0; }
                    else { celdaresult = 1; }
                }
            }

            let input = body.rows[filaresult].cells[celdaresult].children[0];

            input.focus();
            input.select();
        }
    }
    else {
        let event = e;
        move_right(event);
    }

    key = e.keyCode ? e.keyCode : e.which

    // backspace
    if (key == 8) return true
    // 0-9 --> 3 decimales
    if (key > 47 && key < 58) {
        regexp = /.[0-9]{7}$/
        return !(regexp.test(field.value))
    }
    // .
    if (key == 46) {
        regexp = /^[0-9]+$/

        if (field.value.includes(".")) {
            return false;
        } else {
            return true;
        }
    }
    // -
    if (key == 45) {
        return true;
    }

    // other key
    return false;
}

function DigitosFracciones(e, field) {

    var o = e.target;
    var celdaini = o.parentNode.cellIndex;
    var filaini = o.parentNode.parentNode.sectionRowIndex;
    var table = o.parentNode.parentNode.parentNode.parentNode;
    var filasmax = table.tBodies[0].rows.length - 1;
    var celdasmax = table.tBodies[0].rows[0].cells.length - 1;

    if (e.keyCode === 13 || e.keyCode === 9) {
        let body = table.tBodies[0];
        let filaresult, celdaresult;

        if (filaini < filasmax) {
            filaresult = filaini + 1;
            celdaresult = celdaini
        }
        else {
            filaresult = 0;
            if (celdaini < celdasmax) {
                celdaresult = celdaini + 1;
            }
            else {
                celdaresult = 1;
            }
        }
        let input = body.rows[filaresult].cells[celdaresult].children[0];

        if (input.readOnly) {
            if (celdaresult == celdasmax) {
                input = body.rows[filaresult].cells[1].children[0];
            } else {
                celdanew = celdaresult + 1;
                input = body.rows[filaresult].cells[celdanew].children[0];
            }
        }
        input.focus();
        input.select();
    }

    key = e.keyCode ? e.keyCode : e.which;
    //alert(key);
    // backspace
    if (key == 8) return true;
    // 0-9 --> 3 decimales
    if (key > 47 && key < 58) {
        regexp = /.[0-9]{7}$/
        return !(regexp.test(field.value));
    }
    // .
    if (key == 46) {
        regexp = /^[0-9]+$/
        return regexp.test(field.value);
    }
    // -
    if (key == 45) {
        return true;
    }

    // space 
    if (key == 32) {
        return true;
    }

    // slash /
    if (key == 47) {
        return true;
    }

    return false;
}

function move_right(event) {
    let o = event.target;
    if (event.keyCode === 13) {
        let tabini = o.tabIndex, tabnext = o.tabIndex + 1;
        let div = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

        if (div.classList.contains('_doble')) {
            div = div.parentNode;
        }

        let array = Array.from(div.getElementsByClassName('_move'));
        let arrlength = array.length;
        let tabtot = 5000 + arrlength - 1;

        if (tabini == tabtot) {
            tabnext = tabtot - arrlength + 1;
        }

        array.forEach(x=> {
            if (x.tabIndex == tabnext) {
                x.focus();
                x.select();
            }
        });
    }
}


/********* MODAL *********/

/* Modal - Estabilidad Dimensional */
function ShowEstabilidadDimensionalMetodos() {
    $("#mdEstabilidadMetodos").modal("show");
}

/* Modal - Revirado en Tela */
function ShowReviradoTelaMetodos() {
    $("#mdReviradoTela").modal("show");
}

/* Modal - Apariencia BV */
function ShowApariencia() {
    $("#mdApariencia").modal("show");
}

/* Modal - Revirado en Prenda */
function ShowReviradoPrendaMetodos() {
    $("#mdReviradoPrenda").modal("show");
}

/* Modal - Apariencia BV */
function ShowApariencia_BV() {
    $("#mdApariencia_BV").modal("show");
}

/* Modal - Revirado BV */
function ShowRevirado_BV() {
    $("#mdRevirado_BV").modal("show");
}

/* Modal - Solidez Lavado BV */
function ShowSolidezLavado_BV() {
    $("#mdSolidezLavado_BV").modal("show");
}

/* Modal - Apariencia General de Tejidos */
function ShowSolidezLavado_BV() {
    $("#mdApariencia_General").modal("show");
}

/* Modal - Solidez al Lavado */
function ShowSolidezLavadoMetodos() {
    $("#mdSolidezLavadoMetodos").modal("show");
}

/* Modal - Solidez a la Transpiracion */
function ShowSolidezTranspiracionMetodos() {
    $("#mdSolidezTranspiracionMetodos").modal("show");
}

/* Modal - Solidez al Agua */
function ShowSolidezAguaMetodos() {
    $("#mdSolidezAguaMetodos").modal("show");
}

/* Modal - Revirado BV */
function ShowSolidezAlmacenamientoMetodos() {
    $("#mdSolidezAlmacenamientoMetodos").modal("show");
}


/********* CALCULOS *********/

/* Revirado - Prenda - IZQ */
function CalcularReviradoPrendaIZQ(event, flg) {
    var resultado = 0;

    if (flg == "Before") {
        var AA = parseFloat($("#txtAABefore").val());
        var AB = parseFloat($("#txtABBefore").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtSeamResultadoBefore").val(resultado.toFixed(1));
        } else {
            $("#txtSeamResultadoBefore").val("0");
        }
    } else {
        var AA = parseFloat($("#txtAAAfter").val());
        var AB = parseFloat($("#txtABAfter").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtSeamResultadoAfter").val(resultado.toFixed(1));
        } else {
            $("#txtSeamResultadoAfter").val("0");
        }
    }

    var txtSeamResultadoBefore = parseFloat($("#txtSeamResultadoBefore").val());
    var txtSeamResultadoAfter = parseFloat($("#txtSeamResultadoAfter").val());

    if (!isNaN(txtSeamResultadoBefore) && !isNaN(txtSeamResultadoAfter)) {
        resultado = txtSeamResultadoAfter - txtSeamResultadoBefore;
        $("#txtSeamChange").val(resultado.toFixed(1));
    }

    var changeRevirado_izq = parseFloat($("#txtSeamChange").val());
    var changeRevirado_der = parseFloat($("#txtReviradoPrendaChangeDer").val());
    var resultadoRevirado = 0;
    var changeRevirado_izq_res = 0;
    var changeRevirado_der_res = 0;
    var signo = '';

    if (isNaN(changeRevirado_izq)) { changeRevirado_izq = 0; }
    if (isNaN(changeRevirado_der)) { changeRevirado_der = 0; }


    if (changeRevirado_izq < 0) { changeRevirado_izq_res = changeRevirado_izq * -1; } else { changeRevirado_izq_res = changeRevirado_izq; }
    if (changeRevirado_der < 0) { changeRevirado_der_res = changeRevirado_der * -1; } else { changeRevirado_der_res = changeRevirado_der; }


    if (changeRevirado_izq_res > changeRevirado_der_res) {
        if (changeRevirado_izq < 0) { signo = '-'; }
    }
    else {
        if (changeRevirado_der < 0) { signo = '-'; }
    }


    //if (changeRevirado_izq > 0 && changeRevirado_der == 0) {
    //    resultadoRevirado = changeRevirado_izq;
    //}
    //else if (changeRevirado_izq == 0 && changeRevirado_der > 0) {
    //    resultadoRevirado = changeRevirado_der;
    //}
    //else {
    resultadoRevirado = (changeRevirado_izq_res + changeRevirado_der_res) / 2;
    //}   

    _('txtReviradoPrendaChange').value = signo + resultadoRevirado.toFixed(2);

    move_right(event);

}

/* Revirado - Prenda - DER */
function CalcularReviradoPrendaDER(event, flg) {
    var resultado = 0;

    if (flg == "Before") {
        var AA = parseFloat($("#txtReviradoPrendaBeforeAADer").val());
        var AB = parseFloat($("#txtReviradoPrendaBeforeABDer").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtReviradoPrendaBeforeResultadoDer").val(resultado.toFixed(1));
        } else {
            $("#txtReviradoPrendaBeforeResultadoDer").val("0");
        }
    } else {
        var AA = parseFloat($("#txtReviradoPrendaAfterAADer").val());
        var AB = parseFloat($("#txtReviradoPrendaAfterABDer").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtReviradoPrendaAfterResultadoDer").val(resultado.toFixed(1));
        } else {
            $("#txtReviradoPrendaAfterResultadoDer").val("0");
        }
    }

    var txtSeamResultadoBefore = parseFloat($("#txtReviradoPrendaBeforeResultadoDer").val());
    var txtSeamResultadoAfter = parseFloat($("#txtReviradoPrendaAfterResultadoDer").val());

    if (!isNaN(txtSeamResultadoBefore) && !isNaN(txtSeamResultadoAfter)) {
        resultado = txtSeamResultadoAfter - txtSeamResultadoBefore;
        $("#txtReviradoPrendaChangeDer").val(resultado.toFixed(1));
    }

    var changeRevirado_izq = parseFloat($("#txtSeamChange").val());
    var changeRevirado_der = parseFloat($("#txtReviradoPrendaChangeDer").val());
    var resultadoRevirado = 0;
    var changeRevirado_izq_res = 0;
    var changeRevirado_der_res = 0;
    var signo = '';

    if (isNaN(changeRevirado_izq)) { changeRevirado_izq = 0; }
    if (isNaN(changeRevirado_der)) { changeRevirado_der = 0; }


    if (changeRevirado_izq < 0) { changeRevirado_izq_res = changeRevirado_izq * -1; } else { changeRevirado_izq_res = changeRevirado_izq; }
    if (changeRevirado_der < 0) { changeRevirado_der_res = changeRevirado_der * -1; } else { changeRevirado_der_res = changeRevirado_der; }

    if (changeRevirado_izq_res > changeRevirado_der_res) {
        if (changeRevirado_izq < 0) { signo = '-'; }
    }
    else {
        if (changeRevirado_der < 0) { signo = '-'; }
    }

    //if (changeRevirado_izq > 0 && changeRevirado_der == 0) {
    //    resultadoRevirado = changeRevirado_izq;
    //}
    //else if (changeRevirado_izq == 0 && changeRevirado_der > 0) {
    //    resultadoRevirado = changeRevirado_der;
    //}
    //else {
    resultadoRevirado = (changeRevirado_izq_res + changeRevirado_der_res) / 2;
    //}

    _('txtReviradoPrendaChange').value = signo + resultadoRevirado.toFixed(2);


    move_right(event);

}

/* Revirado - IZQ - BV */
function CalcularReviradoIZQ_BV(event, flg) {
    var resultado = 0;

    if (flg == "Before") {
        var AA = parseFloat($("#txtReviradoBeforeAAIzq_BV").val());
        var AB = parseFloat($("#txtReviradoBeforeABIzq_BV").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtReviradoBeforeResultadoIzq_BV").val(resultado.toFixed(1));
        } else {
            $("#txtReviradoBeforeResultadoIzq_BV").val("0");
        }
    } else {
        var AA = parseFloat($("#txtReviradoAfterAAIzq_BV").val());
        var AB = parseFloat($("#txtReviradoAfterABIzq_BV").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtReviradoAfterResultadoIzq_BV").val(resultado.toFixed(1));
        } else {
            $("#txtReviradoAfterResultadoIzq_BV").val("0");
        }
    }

    var txtSeamResultadoBefore = parseFloat($("#txtReviradoBeforeResultadoIzq_BV").val());
    var txtSeamResultadoAfter = parseFloat($("#txtReviradoAfterResultadoIzq_BV").val());

    if (!isNaN(txtSeamResultadoBefore) && !isNaN(txtSeamResultadoAfter)) {
        resultado = txtSeamResultadoAfter - txtSeamResultadoBefore;
        $("#txtReviradoChangeIzq_BV").val(resultado.toFixed(1));
    }

    var changeRevirado_izq = parseFloat($("#txtReviradoChangeIzq_BV").val());
    var changeRevirado_der = parseFloat($("#txtReviradoChangeDer_BV").val());
    var resultadoRevirado = 0;
    var changeRevirado_izq_res = 0;
    var changeRevirado_der_res = 0;

    if (isNaN(changeRevirado_izq)) { changeRevirado_izq = 0; }
    if (isNaN(changeRevirado_der)) { changeRevirado_der = 0; }

    if (changeRevirado_izq < 0) { changeRevirado_izq_res = changeRevirado_izq * -1; } else { changeRevirado_izq_res = changeRevirado_izq; }
    if (changeRevirado_der < 0) { changeRevirado_der_res = changeRevirado_der * -1; } else { changeRevirado_der_res = changeRevirado_der; }


    if (changeRevirado_izq_res > changeRevirado_der_res) {
        resultadoRevirado = changeRevirado_izq;
    }
    else {
        resultadoRevirado = changeRevirado_der;
    }

    _('txtReviradoChange_BV').value = resultadoRevirado.toFixed(2);

    move_right(event);

}

/* Revirado - DER - BV */
function CalcularReviradoDER_BV(event, flg) {
    var resultado = 0;

    if (flg == "Before") {
        var AA = parseFloat($("#txtReviradoBeforeAADer_BV").val());
        var AB = parseFloat($("#txtReviradoBeforeABDer_BV").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtReviradoBeforeResultadoDer_BV").val(resultado.toFixed(1));
        } else {
            $("#txtReviradoBeforeResultadoDer_BV").val("0");
        }
    } else {
        var AA = parseFloat($("#txtReviradoAfterAADer_BV").val());
        var AB = parseFloat($("#txtReviradoAfterABDer_BV").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtReviradoAfterResultadoDer_BV").val(resultado.toFixed(1));
        } else {
            $("#txtReviradoAfterResultadoDer_BV").val("0");
        }
    }

    var txtSeamResultadoBefore = parseFloat($("#txtReviradoBeforeResultadoDer_BV").val());
    var txtSeamResultadoAfter = parseFloat($("#txtReviradoAfterResultadoDer_BV").val());

    if (!isNaN(txtSeamResultadoBefore) && !isNaN(txtSeamResultadoAfter)) {
        resultado = txtSeamResultadoAfter - txtSeamResultadoBefore;
        $("#txtReviradoChangeDer_BV").val(resultado.toFixed(1));
    }

    var changeRevirado_izq = parseFloat($("#txtReviradoChangeIzq_BV").val());
    var changeRevirado_der = parseFloat($("#txtReviradoChangeDer_BV").val());
    var resultadoRevirado = 0;
    var changeRevirado_izq_res = 0;
    var changeRevirado_der_res = 0;

    if (isNaN(changeRevirado_izq)) { changeRevirado_izq = 0; }
    if (isNaN(changeRevirado_der)) { changeRevirado_der = 0; }

    if (changeRevirado_izq < 0) { changeRevirado_izq_res = changeRevirado_izq * -1; } else { changeRevirado_izq_res = changeRevirado_izq; }
    if (changeRevirado_der < 0) { changeRevirado_der_res = changeRevirado_der * -1; } else { changeRevirado_der_res = changeRevirado_der; }


    if (changeRevirado_izq_res > changeRevirado_der_res) {
        resultadoRevirado = changeRevirado_izq;
    }
    else {
        resultadoRevirado = changeRevirado_der;
    }

    _('txtReviradoChange_BV').value = resultadoRevirado.toFixed(2);

    move_right(event);

}

/* Apariencia General de Tejidos */
function CalcularApariencia_General(event, flg) {
    var resultado = 0;

    if (flg == "Before") {
        var AA = parseFloat($("#txtReviradoBeforeAA_AG").val());
        var AB = parseFloat($("#txtReviradoBeforeAB_AG").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtReviradoBeforeResultado_AG").val(resultado.toFixed(1));
        } else {
            $("#txtReviradoBeforeResultado_AG").val("0");
        }
    } else {
        var AA = parseFloat($("#txtReviradoAfterAA_AG").val());
        var AB = parseFloat($("#txtReviradoAfterAB_AG").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtReviradoAfterResultado_AG").val(resultado.toFixed(1));
        } else {
            $("#txtReviradoAfterResultado_AG").val("0");
        }
    }

    var txtSeamResultadoBefore = parseFloat($("#txtReviradoBeforeResultado_AG").val());
    var txtSeamResultadoAfter = parseFloat($("#txtReviradoAfterResultado_AG").val());

    if (!isNaN(txtSeamResultadoBefore) && !isNaN(txtSeamResultadoAfter)) {
        resultado = txtSeamResultadoAfter - txtSeamResultadoBefore;
        $("#txtReviradoChange_AG").val(resultado.toFixed(1));
    }

    move_right(event);

}


function CalcularDensidad() {

    var Muestra1 = $("#txtMuestra1Densidad").val();
    var Muestra2 = $("#txtMuestra2Densidad").val();
    var Muestra3 = $("#txtMuestra3Densidad").val();

    var Densidad = (parseFloat(Muestra1) + parseFloat(Muestra2) + parseFloat(Muestra3)) / 3;

    if (!isNaN(Densidad)) {
        $("#txtDensidad").val(Densidad.toFixed(1));
        CalcularDesviacion();
    }
}

function CalcularAncho() {
    var Muestra1 = $("#txtMuestra1Ancho").val();
    var Muestra2 = $("#txtMuestra2Ancho").val();
    var Muestra3 = $("#txtMuestra3Ancho").val();

    var Ancho = (parseFloat(Muestra1) + parseFloat(Muestra2) + parseFloat(Muestra3)) / 3;

    if (!isNaN(Ancho)) {
        $("#txtAnchoAcabado").val(Ancho.toFixed(2));
    }    
}


function CalcularDesviacion() {

    var GramajeAcabado = $("#hdGramajeAcabado").val() == "" ? 0 : parseFloat($("#hdGramajeAcabado").val());
    var Densidad = $("#txtDensidad").val();

    if (Densidad != "") {
        Densidad = parseFloat(Densidad);
        var Desviacion = (((Densidad - GramajeAcabado) / GramajeAcabado) * 100).toFixed(1);

        if (!isNaN(Desviacion)) {
            $("#txtDesviacion").val(Desviacion);
        }

    } else {
        $("#txtDesviacion").val("");
    }

}

function CalcularPorcentajeCambioPrenda(target, id_valor1, id_valor2) {


    var valor1 = $("#" + id_valor1).val();
    var valor2 = $("#" + id_valor2).val();

    if (valor2 != '') {
        var valor1_number = 0.00;
        var valor2_number = 0.00;

        valor1_number = math.fraction(valor1);
        valor2_number = math.fraction(valor2);

        if (!isNaN(valor1_number) && !isNaN(valor2_number)) {
            valor1_number = ((valor2_number - valor1_number) / valor1_number) * 100;


            $("#" + target).val(valor1_number.toFixed(1));
        }
    } else {
        $("#" + target).val('');
    }
}

function DigitosEnteroBlur(obj) {
    var value = obj.value;
    if (isNaN(value)) {
        obj.value = "0";
        return;
    }
}

 

function Alerta(data) {
    var rpta = JSON.parse(data);
    if (rpta.estado == "success") {
        swal({
            title: "Good job!",
            text: rpta.mensaje,
            type: "success",
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Ok',
            closeOnConfirm: true,
            allowEscapeKey: false
        },
            function (isConfirm) {
                let url = 'Laboratorio/Partida/Consulta';
                _Go_Url(url, url, "");
            });
    } else {
        swal("Alert!", rpta.mensaje, "warning");
    }
}


function GroupBy(data, toGroup, toSum) {
    var cont = 1;
    var ArrayGroup = new Array();
    var ntoGroup = 0;
    var ntoSum = 0;
    var toGroupArr = null;
    var toSumArr = null;

    var result = data.reduce(function (res, obj) {

        if (toGroup != "") {
            toGroupArr = toGroup.split(',');
            ntoGroup = toGroupArr.length;
        }

        if (toSum != "") {
            toSumArr = toSum.split(',');
            ntoSum = toSumArr.length;
        }

        var objGroup = new Object();

        for (i = 0; i < ntoGroup; i++) {
            objGroup[toGroupArr[i]] = obj[toGroupArr[i]];
        }

        var index = ArrayGroup.findIndex(function (item, i) {
            return JSON.stringify(objGroup) == JSON.stringify(item);
        });

        var objGroupTotal = new Object();

        if (index < 0) {

            ArrayGroup.push(objGroup);

            for (i = 0; i < ntoGroup; i++) {
                objGroupTotal[toGroupArr[i]] = obj[toGroupArr[i]];
            }

            for (i = 0; i < ntoSum; i++) {
                objGroupTotal[toSumArr[i]] = obj[toSumArr[i]];
            }

            res.__array.push(objGroupTotal);
        } else {
            for (i = 0; i < ntoSum; i++) {
                res.__array[index][toSumArr[i]] += obj[toSumArr[i]];
            }
        }

        cont++;

        return res;

    }, { __array: [] })

    return result.__array;
}



//Obtener las Instrucciones de Cuidado
function req_InstruccionCuidado() {
    const parametroJSON = { flg_vista: 0 };
    const url = 'Laboratorio/Partida/Get_InstruccionCuidado?par=' + JSON.stringify(parametroJSON);
    Get(url, fn_ObtenerInstruccionCuidado);
}

//Obtener Instrucciones de Cuidado
function fn_ObtenerInstruccionCuidado(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta[0].categoriainstruccioncuidado != '') { oVariables.arrCategoriaInstruccionCuidado = orpta[0].categoriainstruccioncuidado; } else { oVariables.arrCategoriaInstruccionCuidado = []; }
        if (orpta[0].instruccioncuidado != '') { oVariables.arrInstruccionCuidado = orpta[0].instruccioncuidado; } else { oVariables.arrInstruccionCuidado = []; }
        if (oVariables.Codigo_Partida <= 0) { fn_CargarInstrucionCuidado(); }
    }
}

//Cargar Instruccones de Cuidado
function fn_CargarInstrucionCuidado() {
    let arrHeader = oVariables.arrCategoriaInstruccionCuidado.length > 0 ? JSON.parse(oVariables.arrCategoriaInstruccionCuidado) : [];
    let arrBody = oVariables.arrInstruccionCuidado.length > 0 ? JSON.parse(oVariables.arrInstruccionCuidado) : [];

    if (arrHeader.length > 0) {
        if (oVariables.Codigo_Partida <= 0) {
            arrHeader = arrHeader.filter(x=> x.estado === 0);
            arrBody = arrBody.filter(y=> y.estado === 0);
        }
        load_table(arrHeader, arrBody);
    }
}

//Mostrar Instrucciones de Cuidado
function load_table(_arrHeader, _arrBody) {
    let html = '', htmlini = '', htmlfin = '', htmlheader = '', htmlbody = '';
    let cont = 0, conttotal = 0;

    let cantidadmaxima = _arrHeader.length;

    _arrHeader.forEach(x=> {
        conttotal++, cont++;
        htmlheader += `
                     <div class ='col-sm-3'>
                            <table id='${x.categoriainstruccioncuidado}' class ='table table-bordered table-hover _enty'>
                                <thead>
                                    <th colspan='2'>${x.categoriainstruccioncuidado}</th>
                                </thead>
                                <tbody>
                    `;

        let arric = _arrBody.filter(y=> y.idcategoriainstruccioncuidado === x.idcategoriainstruccioncuidado);
        arric.forEach(y=> {
            htmlbody += `
                        <tr data-par='idinstruccioncuidado:${y.idinstruccioncuidado},idcategoriainstruccioncuidado:${y.idcategoriainstruccioncuidado},instruccioncuidadoingles:${y.instruccioncuidadoingles}'>
                            <td class='col-sm-1'>
                                <div  class ='i-checks _clsdivlabdip'>
                                    <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                                        <label>
                                            <input type='checkbox' class ='i-checks _clschklabdip' style='position: absolute; opacity: 0;'>
                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                        </label>
                                    </div>
                                </div>
                            </td>
                            <td class='col-sm-11'>${y.instruccioncuidadoingles}</td>
                        </tr>
                        `;
        });

        htmlheader += htmlbody + `</tbody></table></div>`;
        htmlbody = '';

        if (cont == 1) { htmlini = `<div class="form-group"><div class ="form-horizontal row"><div class="col-sm-12">`; }
        if (cont == 4 || cantidadmaxima == conttotal) {
            htmlfin = `</div></div></div>`;
            html += htmlini + htmlheader + htmlfin;
            cont = 0, htmlini = '', htmlheader = '', htmlfin = '';
        }
    });

    _('tabla_content_instruccioncuidado').innerHTML += html;

    let divtablas = _('tabla_content_instruccioncuidado');
    let arrchk = Array.from(divtablas.getElementsByClassName('_chkitem'));

    if (arrchk.length > 0) {
        arrchk.forEach(x=> {
            let m = x;
            let h = "";
            if (oVariables.arrInstruccionCuidadoChk.length > 0) {
                let fila = x.parentNode.parentNode.parentNode;
                let m = fila.getAttribute('data-par');
                let chk = x.children[0].children[0];
                if (chk != undefined) {
                    chk.checked = oVariables.arrInstruccionCuidadoChk.some(y=> {
                        return (y.idcategoriainstruccioncuidado.toString() === _par(m, 'idcategoriainstruccioncuidado') && y.idinstruccioncuidado.toString() === _par(m, 'idinstruccioncuidado'))
                    });
                }
            }
        });
    }

    handler_check();

}

//Obtener Instrucciones de Cuidado Seleccionadas
function handler_check() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let arrtemp = [], obj = {};
        let x = e.currentTarget;
        let chk = x.checked;
        let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        let par = fila.getAttribute('data-par');
        let idinstruccioncuidado = _par(par, 'idinstruccioncuidado');
        let idcategoriainstruccioncuidado = _par(par, 'idcategoriainstruccioncuidado');
        let instruccioncuidadoingles = _par(par, 'instruccioncuidadoingles');
        obj.idinstruccioncuidado = parseInt(idinstruccioncuidado);
        obj.idcategoriainstruccioncuidado = parseInt(idcategoriainstruccioncuidado);
        obj.instruccioncuidadoingles = instruccioncuidadoingles;
        if (chk) { oVariables.arrInstruccionCuidadoChk.push(obj); }
        else {
            arrchk = oVariables.arrInstruccionCuidadoChk.filter(y=>y.idinstruccioncuidado + '¬' + y.idcategoriainstruccioncuidado !== idinstruccioncuidado + '¬' + idcategoriainstruccioncuidado);
            oVariables.arrInstruccionCuidadoChk = arrchk;
        }

        let text = '';

        //oVariables.arrInstruccionCuidadoChk.sort(function (a, b) {
        //    if (a.idcategoriainstruccioncuidado > b.idcategoriainstruccioncuidado) { return 1; }
        //    if (a.idcategoriainstruccioncuidado < b.idcategoriainstruccioncuidado) { return -1; }
        //    if (a.instruccioncuidadoingles > b.instruccioncuidadoingles) return 1;
        //    if (a.instruccioncuidadoingles < b.instruccioncuidadoingles) return -1;
        //    return 0;
        //});

        oVariables.arrInstruccionCuidadoChk.forEach(h=> { text += h.instruccioncuidadoingles + ' / '; });
        _('txt_InstruccionesCuidado').value = text.slice(0, -3);
    });
}