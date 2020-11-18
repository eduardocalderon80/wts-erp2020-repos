$(document).ready(function () {
    const PCP = {
        CargarDatos: () => {
            //console.log();
            $("#myModalSpinner").modal("show");
            const promesa = _Post('PO/ConfirmacionPendientesPCP/CargarPendientes?gc=' + document.getElementById("hdnIdGrupoComercial").value, false);
            promesa.then(resultado => PCP.CrearTabla(resultado));
        },
        CrearTabla: (resultado) => {
            let arrData = CSVtoJSON(resultado, '¬', '^');
            if (arrData !== null && arrData.length > 0) {
                //let UltimoUsuario = arrData[0].ultimo_usuario_modificacion;
                //let FechaModificacion = arrData[0].fecha_modificacion;
                let contador = 0;
                //'<i class="fa fa-check checked"></i>'
                const result = arrData.map((item) => {
                    let ColoresCheck = (item["ColoresCheck"] === 'si') ? '<input id="chkcol" checked name="chkcol" checked type="checkbox" class ="i-checks _chkMarca">' : ((item["ColoresCheck"] === undefined) ? '' : '<input id="chkcol" name="chkcol" type="checkbox" class ="i-checks _chkMarca">');
                    let ArticuloAprobadoFabricaCheck = (item["ArticuloAprobadoFabricaCheck"] === 'si') ? '<input id="chkart" name="chkart" checked type="checkbox" class ="i-checks _chkMarca">' : ((item["ArticuloAprobadoFabricaCheck"] === undefined) ? '' : '<input id="chkart" name="chkart" type="checkbox" class ="i-checks _chkMarca">');
                    //let EstiloCheck = (item["EstiloCheck"] === 'si') ? '<input id="chkest" name="chkest" checked type="checkbox" class ="i-checks _chkMarca">' : ((item["EstiloCheck"] === undefined) ? '' : '<input id="chkest" name="chkest"  type="checkbox" class ="i-checks _chkMarca">');
                    let PrecioAprobadoCheck = (item["PrecioAprobadoCheck"] === 'si') ? '<input id="chkpre" name="chkpre" checked type="checkbox" class ="i-checks _chkMarca">' : ((item["PrecioAprobadoCheck"] === undefined) ? '' : '<input id="chkpre" name="chkpre" type="checkbox" class ="i-checks _chkMarca">');
                    let FechaDeDespachoCheck = (item["FechaDeDespachoCheck"] === 'si') ? '<input id="chkfec" name="chkfec" checked type="checkbox" class ="i-checks _chkMarca">' : ((item["FechaDeDespachoCheck"] === undefined) ? '' : '<input id="chkfec" name="chkfec" type="checkbox" class ="i-checks _chkMarca">');
                    let RutaDeProcesosReferencialCheck = (item["RutaDeProcesosReferencialCheck"] === 'si') ? '<input id="chkruts" checked name="chkruts" type="checkbox" class ="i-checks _chkMarca">' : ((item["RutaDeProcesosReferencialCheck"] === undefined) ? '' : '<input id="chkruts" name="chkruts" type="checkbox" class ="i-checks _chkMarca">');
                    let diasretraso = ((parseInt(item["NumeroDiasDeRetraso"], 10) >= 2) ? 'style="color:red;font-wight:bolder"' : "");
                    contador += 1;
                    return `<tr id='${contador}' class='trcambios' data-cc='${item["CodCliente"]}' data-cf='${item["CodFabrica"]}'>
                           <td  class ="td-1 td1">${(item["Cliente"] === undefined) ? '' : item["Cliente"]}</td>
                           <td  class ="td-2 td1">${(item["Fabrica"]) === undefined ? '' : item["Fabrica"]}</td>
                           <td  class ="td-3 td1alvt">${(item["TipoPO"]) === undefined ? '' : item["TipoPO"]}</td>
                           <td  class ="td-4 td1alvt">${(item["PO"]) === undefined ? '' : item["PO"]}</td>
                           <td  class ="td-5 td1">${(item["Estilo"]) === undefined ? '' : item["Estilo"]}</td>
                           <td  class ="td-6 td1alvt">${(item["Lot"]) === undefined ? '' : item["Lot"]}</td>
                           <td  class ="td-7 td1">${(item["Colores"]) === undefined ? '' : item["Colores"]}</td>
                           <td  class ="td-8 td1alhr">${(item["Cantidad"]) === undefined ? '' : item["Cantidad"]}</td>
                           <td  class ="td-9 td1alvt">${(item["Via"]) === undefined ? '' : item["Via"]}</td>
                           <td  class ="td-10 td1alvt">${(item["FechaDespachoFabrica"]) === undefined ? '' : item["FechaDespachoFabrica"]}</td>
                           <td  class ="td-11 td1alhr">${(item["PrecioFabrica"]) === undefined ? '' : item["PrecioFabrica"]}</td>
                           <td  class ="td-12 td1alvt">${(item["FechaInicio"]) === undefined ? '' : item["FechaInicio"]}</td>
                           <td  class ="td-13 td1"></td>
                           <td  class ="td-14 td1alhr" ${diasretraso}>${(item["NumeroDiasDeRetraso"]) === undefined ? '' : item["NumeroDiasDeRetraso"]}</td>
                           <td  class ="td-15 td11porc">${ColoresCheck}</td>
                           <td  class ="td-16 td11porc">${ArticuloAprobadoFabricaCheck}</td>
                           <td  class ="td-18 td11porc">${PrecioAprobadoCheck}</td>
                            <td  class ="td-18 td11porc">${FechaDeDespachoCheck}</td>
                           <td  class ="td-20 td11porc">${RutaDeProcesosReferencialCheck}</td>
                           </tr>`;
                }).join('').replace(undefined, '');
                $("#tableConfirmacionPendientesPCP > tbody").append(result);

                $('table').on('scroll', function () {
                    $("table > *").width($("table").width() + $("table").scrollLeft());
                });

                $("._chkMarca").iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'
                }).on("ifChanged", function (e) {
                    var target = e.target;
                    var idcheck = $(target).attr("id");
                    var id = $(target).parent().parent().parent().attr("id");

                    //console.log(id);
                    if (idcheck === "chkcol") {
                        if (e.target.checked) {
                            $("#" + id).removeClass('nochkcol');
                            $("#" + id).addClass('chkcol');
                        } else {
                            $('#' + id).removeClass('chkcol');
                            $('#' + id).addClass('nochkcol');
                        }
                    }
                    if (idcheck === "chkart") {
                        if (e.target.checked) {
                            $("#" + id).removeClass("nochkart");
                            $("#" + id).addClass("chkart");
                        } else {
                            $("#" + id).removeClass("chkart");
                            $("#" + id).addClass("nochkart");
                        }
                    }
                    if (idcheck === "chkest") {
                        if (e.target.checked) {
                            $("#" + id).removeClass("nochkest");
                            $("#" + id).addClass("chkest");
                        } else {
                            $("#" + id).removeClass("chkest");
                            $("#" + id).addClass("nochkest");
                        }
                    }
                    if (idcheck === "chkpre") {
                        if (e.target.checked) {
                            $("#" + id).removeClass("nochkpre");
                            $("#" + id).addClass("chkpre");
                        } else {
                            $("#" + id).removeClass("chkpre");
                            $("#" + id).addClass("nochkpre");
                        }
                    }
                    if (idcheck === "chkfec") {
                        if (e.target.checked) {
                            $("#" + id).removeClass("nochkfec");
                            $("#" + id).addClass("chkfec");
                        } else {
                            $("#" + id).removeClass("chkfec");
                            $("#" + id).addClass("nochkfec");
                        }
                    }
                    if (idcheck === "chkruts") {
                        if (e.target.checked) {
                            $("#" + id).removeClass("nochkruts");
                            $("#" + id).addClass("chkruts");
                        } else {
                            $("#" + id).removeClass("chkruts");
                            $("#" + id).addClass("nochkruts");
                        }
                    }
                });

                $("#myModalSpinner").modal("hide");
            } else {
                $("#myModalSpinner").modal("hide");
                PCP.swalAlert('warning', 'Mensaje', "No se encontraron datos!.", '');
                let tr = `<tr class="td1">
                        <td colspan="20" class ="td1" style="text-align:center; font-size:9pt;width:1630px">No se encontraron datos</td>
                        </tr>`;
                $("#tableConfirmacionPendientesPCP > tbody").append(tr);
            }
        },
        Save: () => {
            var arr = Array.from($("#tableConfirmacionPendientesPCP > tbody > tr[class*='chk']"));
            if (arr.length === 0) {
                PCP.swalAlert('error', 'Mensaje', "No ha seleccionado ningun dato, favor de verificar!.", '');
                return false;
            }
            var resultado = new Array();
            arr.forEach((item) => {
                let objPCP = {
                    idgrupocomercial: null, cod_cliente: null, cod_fabrica: null, tipo: null, po: null, nom_estilo: null, lot: null,
                    //nom_colores: "", qty: "", via: "", fecha_Despacho_Fabrica: "", precio_fabrica: "", fecha_inicio: "", fecha_fin: "", numero_dias_retraso: "",
                    colores: null,
                    articulo_aprobado_fabrica_cliente: null,
                    //estilo: null, 
                    precio_aprobado: null,
                    fecha_despacho_fabrica_aprobada: null,
                    ruta_procesos_referencial: null
                }
                objPCP.idgrupocomercial = $("#hdnIdGrupoComercial").val();
                objPCP.cod_cliente = $(item).attr("data-cc");
                objPCP.cod_fabrica = $(item).attr("data-cf");
                objPCP.po = $(item).children("td:eq(3)").text();
                objPCP.nom_estilo = $(item).children("td:eq(4)").text();
                objPCP.lot = $(item).children("td:eq(5)").text();
                objPCP.colores = ($($(item).children("td:eq(14)").children("div").children("input")).is(":checked")) ? "si" : null;
                objPCP.articulo_aprobado_fabrica_cliente = ($($(item).children("td:eq(15)").children("div").children("input")).is(":checked")) ? "si" : null;
                //objPCP.estilo = ($($(item).children("td:eq(16)").children("div").children("input")).is(":checked")) ? "si" : null;
                objPCP.precio_aprobado = ($($(item).children("td:eq(16)").children("div").children("input")).is(":checked")) ? "si" : null;
                objPCP.fecha_despacho_fabrica_aprobada = ($($(item).children("td:eq(17)").children("div").children("input")).is(":checked")) ? "si" : null;
                objPCP.ruta_procesos_referencial = ($($(item).children("td:eq(18)").children("div").children("input")).is(":checked")) ? "si" : null;
                resultado.push(objPCP);
            });


            var names = resultado.map(function (item) {
                return JSON.stringify(item);
            });
            document.getElementById("txtjsonvalue").innerHTML = '[' + names.toString() + ']';
            var frm = new FormData();
            frm.append("data", '[' + names.toString() + ']');
            PCP.swalConfirm('question', 'Mensaje', "Desea Actualizar los datos?", frm);
        },
        ResultadoGrabar: (resultado) => {
            $("#myModalSpinner").modal("hide");
            var accion = "window.location='" + appURL.erpnew + 'PO/ConfirmacionPendientesPCP/PCP?gc=' + $("#hdnIdGrupoComercialBase64").val() + "'";
            if (resultado) {
                PCP.swalAlert('success', 'Mensaje', "Se actualizaron los datos!.", accion);
            } else {
                PCP.swalAlert('error', 'Mensaje', "Error al actualizar los datos, comuniquese con el 'area de TIC!.", accion);
            }
        },
        swalAlert: (tipo, titulo, mensaje, accion) => {
            Swal.fire({
                type: tipo,
                title: titulo,
                html: mensaje,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (accion !== '') {
                    eval(accion);
                    return;
                }
            });
        },
        swalConfirm: (tipo, titulo, mensaje, frm) => {
            Swal.fire({
                type: tipo,
                title: titulo,
                html: mensaje,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    $("#myModalSpinner").modal("show");
                    const promesa = _Post("PO/ConfirmacionPendientesPCP/SavePCP", frm, false)
                    promesa.then((resultado) => {
                        PCP.ResultadoGrabar(resultado);
                    });
                    return;
                } else {
                    return false;
                }
            });
        }
    }

    $("#btnSave").on("click", () => {
        PCP.Save();
    });

    $("#txtBuscar").keyup(function () {
        _this = this;
        // Show only matching TR, hide rest of them
        $.each($("#tableConfirmacionPendientesPCP tbody tr"), function () {
            if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
                $(this).hide();
            else
                $(this).show();
        });
    });


    if (($(window).height() - 320) >= 300) {
        document.querySelector("#tableConfirmacionPendientesPCP > tbody").setAttribute("style", "height:" + ($(window).height() - 350) + 'px;');
    } else {
        document.querySelector("#tableConfirmacionPendientesPCP > tbody").setAttribute("style", "height:" + ($(window).height() - 350) + 'px;');
    }

    $(window).resize(() => {
        if (($(window).height() - 320) >= 300) {
            document.querySelector("#tableConfirmacionPendientesPCP > tbody").setAttribute("style", "height:" + ($(window).height() - 350) + 'px;');
        } else {
            document.querySelector("#tableConfirmacionPendientesPCP > tbody").setAttribute("style", "height:" + ($(window).height() - 350) + 'px;');
        }
        //console.log(($(window).height()));
        //console.log(document.querySelector("#tableConfirmacionPendientesPCP > tbody").getAttribute("style"));
    });

    PCP.CargarDatos();



});
