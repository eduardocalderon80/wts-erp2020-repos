var appNewFlash = (
    function (d, idpadre) {
        var ovariables = {
            idFlash: '',
            listFabric: '',
            disable: '',
            FechaGeneral:'',
            strIdBuscartela:'',
            nroRowFabric: 1,
            comboCosto: '',
            comboPeso: '',
            comboAncho: '',
            comboEfici: '',
            comboWash: '',
            comboDye: '',
            comboTconsumo: '',
            listCampos: '',
            listCamposPerso: '',
            listCamposPersoocult: '',
            htmlRow: '',
            htmlRowText: '',
            htmlRowTextText: '',
            unidadCosto: '$/Garment',
            ComplementMax: 0,
            DefaultTrim: 0,
            DefaultManu: 0,
            DefaultServi: 0,
            MaxTrim: 24,
            MaxManu: 2,
            MaxServi: 2,
            MaxGermanFabric: 8,
            MaxGermanComple: 5,
            marginGarment: 0,
            marginGarmentCompl: 0,
            marginSummaryCostFact: 0,
            marginSummaryCostWts: 0,
            MaxCost: 6,
            sumTotalTrim: 0.00,
            sumTotalManu: 0.00,
            sumTotalServ: 0.00,
            flgbloqueoMargin: false,
            ErrorMinimo: '',
            link_video: '',
            msg_tmp: '',
            flg_mantMensaje: '',
            regresar: false,
            idcliente_req: 0,
            par_req: '',
        }

        /*VALIDACION Y REGLAS DE NEGOCIO*/
        var oReglas = {
                    ReglaComplemento: {
                        CantidadDeFilas: function (par) {

                            let rpta = par <= ovariables.ComplementMax ? true : false;
                            return rpta;
                        },
                        DependenciaSeccion: function (par) {
                          
                        }
                    },
                    ReglaTrim: {
                        CantidadDeFilas: function (par) {

                            let rpta = par <= (ovariables.MaxTrim + ovariables.DefaultTrim) ? true : false;
                            return rpta;
                        },
                        DependenciaSeccion: function (par) {
                            //return true;
                            //void
                        }
                    },   
                    ReglaManu: {
                        CantidadDeFilas: function (par) {

                            let rpta = par <= (ovariables.MaxManu + ovariables.DefaultManu) ? true : false;
                            return rpta;
                        },
                        DependenciaSeccion: function (par) {
                            //return true;
                            //void
                        }
                    },
                    ReglaServi: {
                        CantidadDeFilas: function (par) {

                            let rpta = par <= (ovariables.MaxServi + ovariables.DefaultServi)? true : false;
                            return rpta;
                        },
                        DependenciaSeccion: function (par) {
                            //return true;
                            //void
                        }
                    },
                    ReglaGermanFabric: {
                        CantidadDeFilas: function (par) {

                            let rpta = par < (ovariables.MaxGermanFabric) ? true : false;
                            return rpta;
                        },
                        DependenciaSeccion: function (par) {
                            //return true;
                            //void
                        }
                    },
                    ReglaGermanCompl: {
                        CantidadDeFilas: function (par) {

                            let rpta = par < (ovariables.MaxGermanComple) ? true : false;
                            return rpta;
                        },
                        DependenciaSeccion: function (par) {
                            //return true;
                            //void
                        }
                    },
                    ReglaCost: {
                            CantidadDeFilas: function (par) {

                            let rpta = par < (ovariables.MaxCost) ? true : false;
                                return rpta;
                            },
                            DependenciaSeccion: function (par) {
                                //return true;
                                //void
                            }
                        },
            ReglaResumenTotal: {
                EliminarComplemento2: function (par) {
                    //void
                }
            }

        }

    /*FIN VALIDACION Y REGLAS DE NEGOCIO*/
        
        function load() {
           
            _('btnPersonalizarFabric').addEventListener('click', customizarPantalla);
            _('btnPersonalizarMargin').addEventListener('click', customizarMargin);
            _('btnAddcomplement').addEventListener('click', agregarComplemento);
            _('btnAddcomplementIcon').addEventListener('click', agregarComplemento);
            _('btnAddLen').addEventListener('click', agregarFilaTexto);
            _('btnAddLenDes').addEventListener('click', agregarFilaTexto);

            _('btnAddtrim').addEventListener('click', agregarFilaCosto);
            _('btnAddtrim_Desc').addEventListener('click', agregarFilaCosto);
            _('btnAddmanu').addEventListener('click', agregarFilaCosto);
            _('btnAddmanu_Desc').addEventListener('click', agregarFilaCosto);
            _('btnAddservi').addEventListener('click', agregarFilaCosto);
            _('btnAddservi_Desc').addEventListener('click', agregarFilaCosto);

            _('btnAddcost_compl').addEventListener('click', agregarFilaCosto);
            _('btnAddcost_compl_Desc').addEventListener('click', agregarFilaCosto);

            _('btnAddcost_cost').addEventListener('click', agregarFilaCosto);
            _('btnAddcost_cost_Desc').addEventListener('click', agregarFilaCosto);
            _('btn_save').addEventListener('click', guardarFlash);   
            _('btnTutorial').addEventListener('click', vervideoTutorial); 

            _('btnUI01').addEventListener('click', customizarMensaje);
            _('btnUI02').addEventListener('click', customizarMensaje);
            _('btnUI03').addEventListener('click', customizarMensaje);

            _('btnUI12').addEventListener('click', customizarMensaje);
            _('btnUI14').addEventListener('click', customizarMensaje);
            _('btnUI15').addEventListener('click', customizarMensaje);
            _('btnUI16').addEventListener('click', customizarMensaje);
            //_('btnUI17').addEventListener('click', customizarMensaje);
            _('btnUI18').addEventListener('click', customizarMensaje);

            let _sufijo = 'mf';
            //asignando evento para los campos que calcular eficiencia
            asignarEventoEficiencia(_sufijo);    
            //asignando evento para los campos que calcular eficiencia FIN
            
            asignarEventoTotalConsump(_sufijo);
            fn_colapsardivs_circle('panelencabezado_Flash');//se le asigna eventos para que despliegue y oculte contenedores.

        }

        function vervideoTutorial() {

            let params = '';

            _modalBody_new({
                url: 'Comercial/Flash/_videotutorialA',
                ventana: '_videotutorialA',
                titulo: 'Flash Cost A',
                parametro: '',
                alto: '500',
                ancho: '500',
                responsive: 'modal-lg'
            });
        }

        function llenarDatosFabric(objTela) {

            let _sufijo = ovariables.strIdBuscartela;

            _('txtstruc_' + _sufijo).value = objTela.estructura;
            _('txtcostdk_' + _sufijo).value = objTela.costo;
            _('txtwht_' + _sufijo).value = objTela.peso;
            _('txtwith_' + _sufijo).value = objTela.ancho;
            _('txtcontent_' + _sufijo).value = objTela.content;
            _('txtstock_' + _sufijo).value = objTela.stock;
            _('txtatx_' + _sufijo).value = objTela.atx;
            _('txtcode_' + _sufijo).value = objTela.cod_tela;
            _('txtobserva_' + _sufijo).value = objTela.observa;
            _('cbowash_' + _sufijo).value = objTela.wash;
            setearEficiencia(_sufijo);

            document.getElementById('btnbusqueda_' + _sufijo).style.display = "none";
            document.getElementById('btncandado_' + _sufijo).style.display = "";
            ovariables.flgbloqueoMargin = true;
            bloquearCamposGarmentWith(_sufijo)
        } 

        function AsignartransformarTotalconsumption(_idControl) {

            _(_idControl).addEventListener('change', calcularTotalconsumption);
        }

        function calcularTotalconsumption(e) {

            let o = e.currentTarget;    
            let strId = o.getAttribute('id');
            let sufijo = strId.substr(-2);
            let margin = 0.00;
            let valor = _('cbow_tcs_' + sufijo).value;
            let strtabla = sufijo == 'mf' ? 'tbody_ttlength_Garmentfabric' : 'tbody_ttlength_' + sufijo;
            if (sufijo == 'mf') { margin = ovariables.marginGarment } else { margin = ovariables.marginGarmentCompl }

            let tbl = _(strtabla);
            let _lenconsumption = getLenconsumption(sufijo);
            if (valor == 1) {
                let totalAncho = _('td' + sufijo + '_tta').innerHTML
                let total = (_lenconsumption * totalAncho) * (1 - (margin / 100))
                tbl.rows[3].cells[1].innerHTML = _formatnumber(total, 2)
            } else {
                let totalAncho = _('td' + sufijo + '_tta').innerHTML
                let total = (_lenconsumption * totalAncho) * (1 - (margin / 100))
                total = 1 / total;
                tbl.rows[3].cells[1].innerHTML = _formatnumber(total, 2)
            }
        }

        function AsignartransformarLenconsumption(_idControl) {

            _(_idControl).addEventListener('change', calcularLenconsumption);
        }

        function calcularLenconsumption(e) {
            let o = e.currentTarget;
            let strId = o.getAttribute('id');
            let sufijo = strId.substr(-2)
            let valor = _('cbow_cs_' + sufijo).value;
            let strtabla = sufijo == 'mf' ? 'tbody_ttlength_Garmentfabric' : 'tbody_ttlength_' + sufijo;
            let tbl = _(strtabla);
            let lenconsumption = getLenconsumption(sufijo);

            if (valor == 1) {
                tbl.rows[1].cells[1].innerHTML = _formatnumber(lenconsumption, 2)
            } else {
                let valornew = 1 / lenconsumption
                tbl.rows[1].cells[1].innerHTML = _formatnumber(valornew, 2)
            }
        }       


        function getLenconsumption(sufijo) {

            let strtablalength = sufijo == 'mf' ? 'tbody_length_Garmentfabric' : 'tbody_length_' + sufijo;
            let eficiencia = parseFloat(_('txtefi_' + sufijo).value);
            let suma = retornarsumaLengthInch(strtablalength);
                 suma = (suma * 2.54) / 100;
            let Lenconsumption = (eficiencia / suma);
            return Lenconsumption;

        }

        function AsignartransformarMetroswidth(_idControl) {

            _(_idControl).addEventListener('change', transformarMetroswidth);
        }

        function transformarMetroswidth(e) {

            let o = e.currentTarget;
            let strId = o.getAttribute('id');
            let valor = o.value;
            let sufijo = remplazartodo(strId, 'b_tw', '');
                sufijo = remplazartodo(sufijo, 'cbow_', '');

            let strtabla = sufijo == 'mf' ? 'tbody_Garment_mf_tt' : 'tbody_ttwidth_' + sufijo;
            let strtablawidth = 'tbody_Garment_'+ sufijo;
            let tbl = _(strtabla);
            let numero = tbl.rows[0].cells[1].innerHTML;
            let final = 0.00;
            if (numero != '') {
                if (valor == 'mt') {
                    
                    final = totalwidth(strtablawidth);
                    final = (final * 2.54) / 100
                } else {
                    final = totalwidth(strtablawidth);
                }
                tbl.rows[0].cells[1].innerHTML = _formatnumber(final, 2)
            } else {
                tbl.rows[0].cells[1].innerHTML = ''
            }
        }

        function AsignartransformarMetrosleng(_idControl) {

            _(_idControl).addEventListener('change', transformarMetros);
        }

        function transformarMetros(e) {

            let o = e.currentTarget;
            let strId = o.getAttribute('id');
            let valor = o.value;
            let sufijo = strId.substr(-2);
            let strtabla = sufijo == 'mf' ? 'tbody_ttlength_Garmentfabric' : 'tbody_ttlength_' + sufijo;
            let strtablalength = sufijo == 'mf' ? 'tbody_length_Garmentfabric' : 'tbody_length_' + sufijo;
            let tbl = _(strtabla);
            let numero = tbl.rows[0].cells[1].innerHTML;
            let final = 0.00;
            if (numero != '') {
                if (valor == 'mt') {
                    final = retornarsumaLengthInch(strtablalength);
                    final = (final * 2.54) / 100
                } else {
                    final = retornarsumaLengthInch(strtablalength)
                }
                tbl.rows[0].cells[1].innerHTML = _formatnumber(final, 2) 
            } else {
                tbl.rows[0].cells[1].innerHTML = ''
            }          
        }

        function agregarFilaCosto(e) {

            let o = e.currentTarget;
            let Tabla = o.getAttribute('tabla')
            agregarFilaCostoTabla(Tabla)
                     
        }

        function agregarFilaCostoTabla(Tabla) {

            let bInsertar = true;
            let bInsertar2 = true;
            let htmlRowTextText = ovariables.htmlRowTextText;

            if (Tabla === 'tbody_costFabric') {

                var lenrows = document.getElementById('tbody_fabric').getElementsByTagName("tr").length;
                var lenrowsCom = document.getElementById('tbody_costFabric').getElementsByTagName("tr").length;
                bInsertar = oReglas.ReglaComplemento.CantidadDeFilas(lenrows);
                bInsertar2 = oReglas.ReglaComplemento.CantidadDeFilas(lenrowsCom);

                if (!(bInsertar) || !(bInsertar2)) {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Numero maximo de complementos es ' + ovariables.ComplementMax + '.'
                    });
                }
            }


            if (Tabla === 'tbody_trim' || Tabla === 'tbody_manu' || Tabla === 'tbody_servi' || Tabla === 'tbody_costAdic' || Tabla === 'tbody_costFabric') {

                let nroRows = document.getElementById(Tabla).getElementsByTagName("tr").length;
                let mensaje = '';

                switch (Tabla) {
                    case 'tbody_trim':
                        bInsertar = oReglas.ReglaTrim.CantidadDeFilas(nroRows);
                        mensaje = 'Trims';
                        break;
                    case 'tbody_manu':
                        bInsertar = oReglas.ReglaManu.CantidadDeFilas(nroRows);
                        mensaje = 'Manufacturing';
                        break;
                    case 'tbody_servi':
                        bInsertar = oReglas.ReglaServi.CantidadDeFilas(nroRows);
                        mensaje = 'Additional Services';
                        break;
                    case 'tbody_costAdic':
                        bInsertar = oReglas.ReglaCost.CantidadDeFilas(nroRows);
                        mensaje = 'Cost';
                        htmlRowTextText = remplazartodo(htmlRowTextText, '_nametabla', '_cost_total')

                        break;
                    case 'tbody_costFabric':
                        htmlRowTextText = remplazartodo(htmlRowTextText, '_nametabla', '_cost_total')

                        break;
                }

                if (!(bInsertar) || !(bInsertar2)) {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Numero maximo de concepto para  ' + mensaje + '.'
                    });
                }
            }

            htmlRowTextText = remplazartodo(htmlRowTextText, 'nametabla', Tabla);

            if (bInsertar == true && bInsertar2 == true) {
                let htmlrow = remplazartodo(htmlRowTextText, 'unidad', ovariables.unidadCosto);
                agregarRowTable(Tabla, htmlrow, 1);

                if (Tabla === 'tbody_trim' || Tabla === 'tbody_manu' || Tabla === 'tbody_servi') {
                    asignarTotalCostDetail(Tabla);
                }

                if (Tabla === 'tbody_costFabric' || Tabla === 'tbody_costAdic') {

                    asignarSumTotal(Tabla);

                }
            }  

        }

        function asignarSumTotal(Tabla) {

            let elementos = Array.from(_(Tabla).getElementsByClassName('cls_cost_total'))
            elementos.forEach(x => {
                x.addEventListener('change', sumarTotalProdCost1);
            });
        }
       
        function agregarFilaCostoTablaComplemento(Tabla, Descripcion, nro_id) {

            let htmlrow = remplazartodo(ovariables.htmlRowTextText, 'unidad', ovariables.unidadCosto);         
            htmlrow = remplazartodo(htmlrow, 'mf', 'cost_' + nro_id);
            htmlrow = remplazartodo(htmlrow, 'idremplazo', 'cost_' + nro_id);
            htmlrow = remplazartodo(htmlrow, '<input type="text" maxlength="20" autocomplete="off" value="" class="form-control"> </span>', Descripcion);
            htmlrow = remplazartodo(htmlrow, 'nametabla', 'cost_total');
            htmlrow = remplazartodo(htmlrow, 'value=""', 'disabled');

            agregarRowTable(Tabla, htmlrow, 0);
        }

        function btnBuscarTela(e) {

            let o = e.currentTarget;
            let strId = o.getAttribute('id');
            ovariables.strIdBuscartela = remplazartodo(strId, 'btnbusqueda_', '');

            _modalBody({
                url: 'Comercial/Flash/_BuscarTelaFlashCost',
                ventana: '_BuscarTelaFlashCost',
                titulo: 'Initial Filter',
                parametro: ``,
                ancho: '',
                alto: '',
                responsive: 'modal-lg'
            });
        }

        function agregarComplemento() {

            let idrow = ovariables.nroRowFabric + 1;
            let tbody = _('tbody_fabric');
            var lenrows = document.getElementById('tbody_fabric').getElementsByTagName("tr").length;
            var lenrowsCostCom = document.getElementById('tbody_costFabric').getElementsByTagName("tr").length;

            let vbutton = "<span class='fa fa-remove _eliminarComplent' style='font-size:14px;color:red' ></span>";


            if (oReglas.ReglaComplemento.CantidadDeFilas(lenrows) && oReglas.ReglaComplemento.CantidadDeFilas(lenrowsCostCom)) {

                let strstrIdrow = 'C' + idrow
                let strBoton = '<button id="btnbusqueda_' + strstrIdrow + '" type="button" class="btn btn-success btn-circle _Findfabric" data-toggle="tooltip" data-placement="top" title="Find fabric"><i class="fa fa-search"></i></button>'
                let strBotonCandado = '<button id="btncandado_' + strstrIdrow + '" type="button" style="display:none" class="btn btn-warning btn-circle _borrarfabric" data-toggle="tooltip" data-placement="top" title="Delete main data"><i class="fa fa-lock"></i></button>'

                let html = `<tr id="` + strstrIdrow + `" name="Complement ` + lenrows + `">
                            <td >` + vbutton + `</td>
                            <td id="tdf_` + strstrIdrow + `"> ` + strBotonCandado + strBoton + `&nbsp;&nbsp;Complement ` + lenrows + ` </td>
                            <td > <input id="txtstruc_` + strstrIdrow + `" name="status"  maxlength="30" type="text" autocomplete="off" value="" class="form-control"> </td>
                            <td > <input id="txtcostdk_` + strstrIdrow + `" name="` + strstrIdrow + `" type="text"  onkeypress="return DigitimosDosDecimales(event,this)"  autocomplete="off" value="" class="form-control" style="text-align:right;background-color:#F8ECE0;"> </td>
                            <td id="costdy_` + strstrIdrow + `"  style="display:none;" > <input id="txtcostdy_` + strstrIdrow + `" name="status" type="text" autocomplete="off"  disabled class="form-control" style="text-align:right;"></td>
                            <td > <input id="txtwht_` + strstrIdrow + `" name="` + strstrIdrow + `" type="text" onkeypress="return DigitimosDosDecimales(event,this)"  autocomplete="off" value="" class="form-control" style="text-align:right;background-color:#F8ECE0;" > </td>
                            <td > <select id="cbowht_` + strstrIdrow + `" name="cbo" data-required="true" class="form-control _enty"></select> </td>
                            <td > <input id="txtwith_` + strstrIdrow + `" name="` + strstrIdrow + `" type="text" onkeypress="return DigitimosDosDecimales(event,this)"  autocomplete="off" value="" class="form-control" style="text-align:right;background-color:#F8ECE0;"> </td>
                            <td > <select id="cbowith_` + strstrIdrow + `" name="` + strstrIdrow + `" data-required="true" class="form-control _enty"></select> </td>
                            <td > <input id="txtefi_` + strstrIdrow + `" name="` + strstrIdrow + `" type="number" onkeypress="return DigitimosDosDecimales(event,this)"  autocomplete="off" value="" class="form-control" style="text-align:right;" disabled> </td>
                            <td style="text-align:center;vertical-align:middle" > <select id="cboefi_` + strstrIdrow + `" name="cbo" data-required="true" class="form-control _enty"></select> </td>
                            <td id="code_` + strstrIdrow + `"  style="display:none;"> <input id="txtcode_` + strstrIdrow + `" name="status" type="text" autocomplete="off" disabled value="" class="form-control"></td>
                            <td id="content_` + strstrIdrow + `" style="display:none;">  <textarea  id="txtcontent_` + strstrIdrow + `" name="" rows="4" cols="15" class="form-control"></textarea> </td>
                            <td id="wash_` + strstrIdrow + `"    style="text-align:center;vertical-align:middle;display:none;" > <select id="cbowash_` + strstrIdrow + `" name="cbo" data-required="true" class="form-control _enty"></select> </td>
                            <td id="stock_` + strstrIdrow + `"   style="display:none;"> <input id="txtstock_` + strstrIdrow + `" name="status" type="number" autocomplete="off" disabled value="" class="form-control"> </td>
                            <td id="atx_` + strstrIdrow + `" style="display:none;"> <input id="txtatx_` + strstrIdrow + `" name="status" type="text" autocomplete="off" disabled value="" class="form-control"></td>
                            <td id="dye_` + strstrIdrow + `"     style="text-align:center;vertical-align:middle;display:none;" > <select id="cbodye_` + strstrIdrow + `" name="cbo" data-required="true" class="form-control _enty"></select> </td>
                            <td id="obs_` + strstrIdrow + `"     style="display:none;"> <textarea id="txtobserva_` + strstrIdrow + `"  name="" rows="4" cols="37" class="form-control"></textarea></td>
                        </tr>`;

                tbody.insertAdjacentHTML('beforeend', html);
                llenarCombostblFabric('C' + idrow);
                ovariables.nroRowFabric = idrow;
                ocultarColumnaRow(ovariables.listCamposPersoocult, ovariables.listCamposPerso);
                setearEliminarComplemento();       

                /*sacamos el molde a duplicar*/

                let divTemplate = document.getElementById("div_modelo");
                let Template = divTemplate.innerHTML;
                Template = remplazartodo(Template, 'Cm', 'C' + idrow);
                Template = remplazartodo(Template, 'idremplazo', 'C' + idrow);
                Template = remplazartodo(Template, 'mf', 'C' + idrow);
                Template = remplazartodo(Template, 'ttC', lenrows);                 
                let listDiv = _('listComplements');
                listDiv.insertAdjacentHTML('beforeend', Template);

                _('btnAddLen_C' + idrow).addEventListener('click', agregarFilaTexto);
                _('btnAddLenDes_C' + idrow).addEventListener('click', agregarFilaTexto);

                _('btnocultar_C' + idrow).addEventListener('click', ocultarDivComplemento);
                _('btnver_C' + idrow).addEventListener('click', verDivComplemento);

                //agregamos eventos para calcular el total with
                let strId = 'C' + idrow + 'b';
                asignarEventoTotalWidth('txw_' + strId);
                asignarEventoTotalWidth('cbow_' + strId);
                strId = 'C' + idrow + 's';
                asignarEventoTotalWidth('txw_' + strId);
                asignarEventoTotalWidth('cbow_' + strId);

                //agregamos evento para calcular consumption
                asignarEventoTotalConsump('C' + idrow)

                //seteamos combo de total with
                _('cbow_C' + idrow+'b_tw').value = 'mt';

                //agregamos evento para el lenght
                let strNameTable = 'tbody_length_C' + idrow;
                asignarTotalLengthTable(strNameTable);

                //asignar evento para calcular eficiencuia 
                asignarEventoEficiencia('C' + idrow);

                //asignar evento para buscar y bloquear tela 
                asignarEventoBuscarTela('C' + idrow);
                asignarEventoLimpiarDato('C' + idrow);

                //agregamos un costo en el sumary
                agregarFilaCostoTablaComplemento('tbody_costFabric', 'Complement ' + lenrows, 'C' + idrow);
                asignarMargin('C' + idrow);

                AsignartransformarMetrosleng('cbow_tl_C' + idrow);
                AsignartransformarMetroswidth('cbow_C' + idrow + 'b_tw');
                AsignartransformarLenconsumption('cbow_cs_C' + idrow)
                AsignartransformarTotalconsumption('cbow_tcs_C' + idrow)
                
                //bloqueamos los campos width del Garment
                bloquearCamposGarmentWith('C' + idrow)
                //bloqueamos los campos width del length
                bloquearCamposGarmentLength('C' + idrow);

            } else {

                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Numero maximo de complementos es ' + ovariables.ComplementMax + '.'
                });
            }
        }

        function ocultarDivComplemento(e) {
            let o = e.currentTarget;
            let sufijo = o.getAttribute('nombrediv')
            document.getElementById('div_ocultar_' + sufijo).style.display = "none";
            document.getElementById('btnocultar_' + sufijo).style.display = "none";
            document.getElementById('btnver_' + sufijo).style.display = "";
        }

        function verDivComplemento(e) {
            let o = e.currentTarget;
            let sufijo = o.getAttribute('nombrediv')
            document.getElementById('div_ocultar_' + sufijo).style.display = "";
            document.getElementById('btnocultar_' + sufijo).style.display = "";
            document.getElementById('btnver_' + sufijo).style.display = "none";
        }

        function setearEliminarComplemento() {
            let tbl = _('tbody_fabric');
            let arrayDelete = _Array(tbl.getElementsByClassName('_eliminarComplent'));
            arrayDelete.forEach(x => x.addEventListener('click', e => { eliminarComplemento(e); }));
        }

        function eliminarComplemento(event) {

            let o = event.target;
            let fila = o.parentNode.parentNode;
            let id = fila.id;
            //fila = o.parentNode.parentNode.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
            //eliminar la lista de los garment
            var div = document.getElementById('div_' + id)
            var parent = div.parentElement;
            parent.removeChild(div);
            // fin eliminar la lista de los garment
            // eliminar costos
            var row = document.getElementById('cost_' + id)
            var parentRow = row.parentElement;
            parentRow.removeChild(row);
            
            renombrarComplementos();

            let tbl = _('tbody_fabric');
            let idrow = tbl.rows.length
            ovariables.nroRowFabric = idrow > 1 ? ovariables.nroRowFabric : 1;

            sumarTotalProdCost1();//se suma los datos denuevo

        }

        function renombrarComplementos() {

            let tbl = _('tbody_fabric');
            let totalFilas = tbl.rows.length;

            for (i = 1; i < totalFilas; i++) {

                let row = tbl.rows[i];
                let id = row.getAttribute('id');
                let name = row.getAttribute('name')
                let _td = _('tdf_' + id);
                let _lbl = _('lbl_' + id);
                let _tdCost = _('td_cost_' + id);
                let strTd = _td.innerHTML;
                let strLbl = _lbl.innerHTML;

                _td.innerHTML = remplazartodo(strTd, name, 'Complement ' + i);
                _tdCost.innerHTML = 'Complement ' + i;
                //row.getAttribute('name') = 'Complement ' + i;
                row.setAttribute("name", 'Complement ' + i);
                _lbl.innerHTML = 'COMPLEMENT ' + i;

                //asignar evento para buscar y bloquear tela 
                asignarEventoBuscarTela(id);
                asignarEventoLimpiarDato(id);
                

            }
        }

        function llenarCombostblFabric(idRow) {

            //_('cbocost_' + idRow).innerHTML = ovariables.comboCosto;
            _('cbowht_' + idRow).innerHTML = ovariables.comboPeso;
            _('cbowith_' + idRow).innerHTML = ovariables.comboAncho;
            _('cboefi_' + idRow).innerHTML = ovariables.comboEfici;
            _('cbowash_' + idRow).innerHTML = ovariables.comboWash;
            _('cbodye_' + idRow).innerHTML = ovariables.comboDye;

        }

        function customizarPantalla() {

            let params = '';

            _modalBody_new({
                url: 'Comercial/Flash/_personalizarFabric',
                ventana: '_personalizarFabric',
                titulo: 'Customize View',
                parametro: params,
                alto: '500',
                ancho: '500',
                responsive: 'modal-lg'
            });
        }

        function customizarMargin() {

            let params = '';

            _modalBody_new({
                url: 'Comercial/Flash/_personalizarMargin',
                ventana: '_personalizarMargin',
                titulo: 'Customize Percentages',
                parametro: params,
                alto: '500',
                ancho: '500',
                responsive: 'modal-lg'
            });
        }        

        function ocultarColumnaRow(listClOcu, listClVer) {

            let tbody = _('tbl_fabric');
            let lisRow = tbody.rows;
            let arr = Array.from(tbody.rows);

            arr.forEach(x => {

                let id = x.id;

                if (id !== "") {

                    if (listClOcu !== '') { ocultarColumna(id, listClOcu, "none"); }
                    if (listClVer !== '') { ocultarColumna(id, listClVer, ""); }
                }
            });
        }

        function ocultarColumna(idRow, listCampos, strver) {

            let aData = listCampos.split(',');
            let reg = aData.length;

            for (x = 0; x < reg; x++) {
                let campo = aData[x];

                if (campo != '')
                    document.getElementById(campo + "_" + idRow).style.display = strver;
            }
        }

        function req_ini() {
            obtenerFiltros();
          

            //obtenerFlashCliente();
            _('txt_tt_tbody_trim').addEventListener('change', limpiarCostosDetails);
            _('txt_tt_tbody_manu').addEventListener('change', limpiarCostosDetails);
            _('txt_tt_tbody_servi').addEventListener('change', limpiarCostosDetails);
            _('txt_tt_freight').addEventListener('change', sumarTotalProdCost1);
            _('txt_nom_marginal').addEventListener('change', sumarTotalProdCost1);

            //asignamos evento de suma
            asignarSumTotal('tbody_costAdic');

            //inicio asignacion de fecha
            var fecha = new Date(); //Fecha actual
            var mes = fecha.getMonth() + 1; //obteniendo mes
            var dia = fecha.getDate(); //obteniendo dia
            var ano = fecha.getFullYear(); //obteniendo año
            if (dia < 10)
                dia = '0' + dia; //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes //agrega cero si el menor de 10
            _('txtdate').value = mes + "/" + dia + "/" + ano;
            ovariables.FechaGeneral = ano.toString() + mes.toString() + dia.toString();
            //document.getElementById("txtdate").readOnly = true;
            //fin asignacion de fecha
            obtenerFlash();           
        }

        function obtenerFlash() {
            
            const par = _('txtpar_new').value;
            if (!_isEmpty(par)) {
                /* Flash Cost */
                let id = _par(par, 'id') !== '' ? parseInt(_par(par, 'id')) : 0;
                /* Requerimiento */
                let idprograma = parseInt(_par(par, 'idprograma'));
                let nombre = _par(par, 'nombre');
                let idcliente = _par(par, 'idcliente');
                let cliente = _par(par, 'cliente');
                let temporada = _par(par, 'temporada');
                let division = _par(par, 'division');
                let idgrupopersonal = _par(par, 'idgrupopersonal');

                if (idprograma > 0) {
                    // Set return
                    ovariables.regresar = true;
                    ovariables.idcliente_req = idcliente;
                    ovariables.par_req = `regresar:true,accion:edit,id:${idprograma},nombre:${nombre},idcliente:${idcliente},cliente:${cliente},temporada:${temporada},division:${division},idgrupopersonal:${idgrupopersonal}`;

                    _('btnReturnRequerimiento').style.display = '';
                    _('btnReturnRequerimiento').onclick = function () {
                        const urlAccion = 'Requerimiento/Programa/Stages';
                        const par = `regresar:true,accion:edit,id:${idprograma},nombre:${nombre},idcliente:${idcliente},cliente:${cliente},temporada:${temporada},division:${division},idgrupopersonal:${idgrupopersonal}`;
                        _Go_Url(urlAccion, urlAccion, par);
                    }
                }

                if (id > 0) {
                    var urlaccion = 'Comercial/Flash/obtenerFlash?par=' + id;
                    Get(urlaccion, llenardatosFormulario)
                }
            }           
        }


        function llenardatosFormulario(data) {

            let rpta = data != null ? JSON.parse(data) : null;
            if (rpta != null) {

                ovariables.marginGarment = rpta[0].margingarment;
                ovariables.marginGarmentCompl  = rpta[0].margingarmentCompl;
                ovariables.marginSummaryCostFact  = rpta[0].marginsummarycostfact;
                ovariables.marginSummaryCostWts = rpta[0].marginsummarycostwts;

                //datos de Cabecera
                _('cboCli').value = rpta[0].IdCliente;
                _('txtstyle').value = rpta[0].Style;
                _('txtdescripcion').value = rpta[0].Descripcion;
                _('txtnroFabric').value = rpta[0].MinFabric;
                _('txtnroColor').value = rpta[0].MinColor;
                _('txtnroStyle').value = rpta[0].MinStyle;
                //fin datos cabecera

                //datos de fabric
                let odata = CSVtoJSON(rpta[0].fabric_csv);
                recorrerFabric(odata);
                //fin datos FAbric

                let odatagarment = CSVtoJSON_B(rpta[0].garment_csv);
                recorrergarment(odatagarment);

                //mostrar  columnas
                let campooculto = rpta[0].campooculto;
                let campovisible = rpta[0].campovisible;

                ocultarColumnaRow(campooculto, campovisible) 

                //fin mostrar columnas

                //costDetails

                let trims = rpta[0].trim_csv;
                dibujarcostDetails('tbody_trim', trims)
                calcularTotalCostDetail('tbody_trim');

                let manu = rpta[0].manu_csv;
                dibujarcostDetails('tbody_manu', manu);
                calcularTotalCostDetail('tbody_manu');

                let adit = rpta[0].adit_csv;
                dibujarcostDetails('tbody_servi', adit);
                calcularTotalCostDetail('tbody_servi');

                //fin costDetails

                //summary fabric

                let csvfabric = rpta[0].csvfabric;
                recorrertablaCost('tbody_costFabric', csvfabric)

                let costcsv = rpta[0].costcsv;
                recorrertablaCost('tbody_costAdic', costcsv)

                //fin Summary fabric

                //sumary otros
                let productioncost = rpta[0].productioncost;
                let factorymargin = rpta[0].factorymargin;
                let pricefactoryfob = rpta[0].pricefactoryfob;
                let estimatedfreight = rpta[0].estimatedfreight;
                let totalcostwts = rpta[0].totalcostwts;
                let netmargin = rpta[0].netmargin;
                let nonmargincost = rpta[0].nonmargincost;
                let pricewtsddp = rpta[0].pricewtsddp;
                let adjustment = rpta[0].adjustment;

                _('txt_tt_PrdCost').value = _formatnumber(productioncost, 2);
                _('txt_tt_PrdCost_2').value = _formatnumber(productioncost, 2);
                _('td_facMargin').innerHTML = 'Factory margin (' + factorymargin + '%)';
                _('txt_tt_PrcFob').value = _formatnumber(pricefactoryfob, 2);
                _('txt_tt_freight').value = _formatnumber(estimatedfreight, 2);
                _('txt_tt_prcwts').value = _formatnumber(totalcostwts, 2);
                _('txt_tt_Marginprcwts').value = _formatnumber(netmargin, 2);
                _('txt_nom_marginal').value = _formatnumber(nonmargincost, 2);
                _('txt_tt_prcddp').value = _formatnumber(pricewtsddp, 2);
                _('txt_adjust').value = _formatnumber(adjustment, 2);

                let margingarment = rpta[0].margingarment;
                let margingarmentCompl = rpta[0].margingarmentCompl;
                let marginsummarycostfact = rpta[0].marginsummarycostfact;
                let marginsummarycostwts = rpta[0].marginsummarycostwts;

                _('td_facMargin').innerHTML = 'Factory margin (' + marginsummarycostfact + '%)';
                _('td_netMargin').innerHTML = 'Net margin (' + marginsummarycostwts + '%)';

                //fin otro 
            }
        }

        function recorrertablaCost(nametabla, datacsv) {
            let body = _(nametabla)
            let listFilasIni = Array.from(body.rows);
            let filasini = listFilasIni.length
            let odata = CSVtoJSON(datacsv);
            let filasdata = odata.length;

            if (filasdata > filasini) {

                for (let i = filasini; i < filasdata; i++) {

                    let label = odata[i].label;
                    let valor = odata[i].valor
                    setearCostDetails(nametabla, label, valor, listFilasIni.length);
                }
            }
        }

        function recorrerFabric(odata) {

            let x = odata.length;
           
            for (let i = 0; i < x; i++) {

                let j = i + 1;
                let sufijo = i == 0 ? 'mf' : 'C' + j;

                if (i > 0) {
                    agregarComplemento();
                }

                _('txtstruc_' + sufijo).value = odata[i].struture;
                _('txtcostdk_' + sufijo).value = _formatnumber(odata[i].costdk, 2);
                _('txtcostdy_' + sufijo).value = _formatnumber(odata[i].costdy, 2);
                _('txtwht_' + sufijo).value = _formatnumber(odata[i].peso, 2);
                _('cbowht_' + sufijo).value = odata[i].unitweightid;
                _('txtwith_' + sufijo).value = _formatnumber(odata[i].ancho, 2) ;
                _('cbowith_' + sufijo).value = odata[i].anchounidad;
                _('txtefi_' + sufijo).value = _formatnumber(odata[i].eficiencia, 2);
                _('cboefi_' + sufijo).value = odata[i].unitefficiencyid;
                _('txtcode_' + sufijo).value = odata[i].codigo;
                _('txtcontent_' + sufijo).value = odata[i].content;
                _('cbowash_' + sufijo).value = odata[i].wash;
                _('txtstock_' + sufijo).value = odata[i].stock;
                _('txtatx_' + sufijo).value = odata[i].atx;
                _('cbodye_' + sufijo).value = odata[i].dyeid;
                _('txtobserva_' + sufijo).value = odata[i].obs;
                setearEficiencia(sufijo);              

            }

        }

        function recorrergarment(odata) {

            let x = odata.length;
            let html = '';

            for (let i = 0; i < x; i++) {

                let idFlashCostFabric = odata[i].idFlashCostFabric;
                let tipoGarment = odata[i].tipoGarment;
                let widthcsv = odata[i].widthcsv;
                let lengthcsv = odata[i].lengthcsv;
                dibujarGarmentwidth(idFlashCostFabric, tipoGarment, widthcsv)
                dibujarGarmentlength(idFlashCostFabric, tipoGarment, lengthcsv)
            }

        }

        function dibujarGarmentwidth(idFlashCostFabric, tipoGarment, widthcsv) {
            let sufijo = tipoGarment == '0' ? 'mf' : 'C' + (parseInt(tipoGarment) +1);
            let strtabla = 'tbody_Garment_' + sufijo
            let odatawidth = CSVtoJSON(widthcsv);
            let x = odatawidth.length;
            let tdinputs = _('td_' + sufijo+'b').getElementsByTagName('input');          

            for (let i = 0; i < x; i++) {

                if (i == 0) {

                    if (tdinputs.length > 0) { tdinputs[0].value = odatawidth[i].label;}                       

                    _('txw_' + sufijo + 'b').value = _formatnumber(odatawidth[i].valor, 2);
                    _('cbow_' + sufijo + 'b').value = odatawidth[i].uni;
                }

                if (i == 1) {
                    _('txw_' + sufijo + 's').value = _formatnumber(odatawidth[i].valor, 2);
                    _('cbow_' + sufijo + 's').value = odatawidth[i].uni;
                }                
            }
            calcularTotalWidthTabla(strtabla);
        }

        function dibujarGarmentlength(idFlashCostFabric, tipoGarment, lengthcsv) {

            let sufijo = tipoGarment == '0' ? 'Garmentfabric' : 'C' + (parseInt(tipoGarment) + 1);
            let tablename = 'tbody_length_' + sufijo;
            let tbody = _(tablename);
            let listFilasIni = Array.from(tbody.rows);
            let odatalength = CSVtoJSON(lengthcsv);
            let nroTotalizadores = 4;
            let x = odatalength.length - nroTotalizadores;


            for (let i = 0; i < x; i++) {

                let label = odatalength[i].label;
                let valor    = odatalength[i].valor;
                let unidad = odatalength[i].uni;

                setearGarmentlength(tablename, label, valor, unidad, listFilasIni.length);

            }

            calcularTotalLength(tablename);
            
        }

        function setearGarmentlength(tablename, label, valor, unidad, listFilasIni) {

            let bEncontrado = false;
            let tbody = _(tablename);
            let listFilasActual = Array.from(tbody.rows);

            if (listFilasActual.length === listFilasIni) {

                listFilasActual.forEach(x => {
                    let lblTbl = x.cells[1].innerHTML;
                    let inputs = x.getElementsByTagName('input');
                    let selects = x.getElementsByTagName('select');
                    let bAsignar = false;
                    let nroin = 0;

                    if (inputs.length > 1) {
                        nroin = 1;
                        if (inputs[0].value == '') {
                            inputs[0].value = label;
                            bAsignar = true;
                        };
                    }

                    if ((lblTbl.trim() === label.trim())||(bAsignar)) {

                        bEncontrado = true;                    
                        inputs[nroin].value = valor;
                        selects[0].value = unidad;
                        return false;
                    }                    
                });
            }

            if (!(bEncontrado)) {

                agregarFilaTextoTabla(tablename);

                let inputsAdic = document.getElementById(tablename).rows[listFilasActual.length].getElementsByTagName('input');
                let selectsAdic = document.getElementById(tablename).rows[listFilasActual.length].getElementsByTagName('select');

                inputsAdic[0].value = label;
                inputsAdic[1].value = valor;
                selectsAdic[0].value = unidad;

            }
        }

        function dibujarcostDetails(nametabla, datacsv) {

            let odata = CSVtoJSON(datacsv);
            let body = _(nametabla)
            let listFilasIni = Array.from(body.rows);
            let x = odata.length;
            let html = '';

            for (let i = 0; i < x; i++) {

                let label = odata[i].label;
                let valor = odata[i].valor;              
                setearCostDetails(nametabla, label, valor, listFilasIni.length);
            }
          
        }

        function setearCostDetails(tablename, label, valor, listFilasIni) {

            let bEncontrado = false;
            let tbody = _(tablename);
            let listFilasActual = Array.from(tbody.rows);

            if (listFilasActual.length === listFilasIni) {

                listFilasActual.forEach(x => {
                    let lblTbl = x.cells[1].innerHTML;
                    let inputs = x.getElementsByTagName('input');                            
                   
                    if (lblTbl.trim() === label.trim()) {
                        bEncontrado = true;
                        inputs[0].value = valor;                      
                    }
                });
            }

            if (!(bEncontrado)) {

                agregarFilaCostoTabla(tablename);
                let inputsAdic = document.getElementById(tablename).rows[listFilasActual.length].getElementsByTagName('input');             
                inputsAdic[0].value = label;
                inputsAdic[1].value = valor;               
            }
        }

        function limpiarCostosDetails(e) {

            let tablename = e.target.name;
            let total_P = _('txt_tt_' + tablename).value;
            let total_M = 0.00;
            let strSecccion = '';

            switch (tablename) {
                case 'tbody_trim':
                    total_M = ovariables.sumTotalTrim;
                    strSecccion = 'TRIMS'
                    break;
                case 'tbody_manu':
                    total_M = ovariables.sumTotalManu;
                    strSecccion = 'MANUFACTURING'
                    break;
                case 'tbody_servi':
                    total_M = ovariables.sumTotalServ;
                    strSecccion = 'SERVICES'
                    break;
            }

            if (total_P != total_M && parseFloat(total_M)>0) {

                swal({
                    title: "The fields that identify the costs section will be cleaned " + strSecccion + ". do you wish to continue?",
                    text: '',
                    type: "warning",
                    //html: '<p>Mensaje de texto con <strong>formato</strong>.</p>',
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                }, function (rpta_confirmacion) {
                        if (rpta_confirmacion) {
                            limpiarTotalCostDetail(tablename);
                            sumarTotalProdCost1();
                        } else {
                            _('txt_tt_' + tablename).value = total_M;
                            sumarTotalProdCost1();
                        }
                    return;
                });
            }         

        }

        
        function asignarMargin(strTabla) {

            let margin = strTabla === 'Garmentfabric' ? ovariables.marginGarment : ovariables.marginGarmentCompl; 
            let nameTable = 'tbody_ttlength_' + strTabla;
            document.getElementById(nameTable).rows[2].cells[0].innerHTML = 'Waste (' + margin + '%)';
        }

        function asignarMarginGeneral() {
            document.getElementById('td_facMargin').innerHTML = 'Factory margin (' + ovariables.marginSummaryCostFact + '%)';
            document.getElementById('td_netMargin').innerHTML = 'Net margin (' + ovariables.marginSummaryCostWts + '%)';
            asignarMargin('Garmentfabric');
            sumarTotalProdCost1();
        }

        function guardarFlash() {          

            let bValidacion = validarFlash();

            if (bValidacion) {
                //guardarmos datos cabecera
                limpiarMensajes();

                let objGeneral = {
                    idFlash: 0,
                    cliente: _('cboCli').value,
                    clienteDesc: _('cboCli').options[_('cboCli').selectedIndex].innerText,
                    fecha: ovariables.FechaGeneral,
                    estilo: _('txtstyle').value,
                    descripcion: _('txtdescripcion').value,
                    minColor: _('txtnroColor').value == '' ? 0 : _('txtnroColor').value,
                    unidadColor: _('cboNroColor').options[_('cboNroColor').selectedIndex].innerText,
                    minFabric: _('txtnroFabric').value == '' ? 0 : _('txtnroFabric').value,
                    unidadFabric: _('cboNroFabric').options[_('cboNroFabric').selectedIndex].innerText,
                    minStyle: _('txtnroStyle').value == '' ? 0 : _('txtnroStyle').value, 
                    unidadStyle: _('cboNroFabric').options[_('cboNroFabric').selectedIndex].innerText,
                    marginGarment: ovariables.marginGarment,
                    marginGarmentCompl: ovariables.marginGarmentCompl,
                    marginSummaryCostFact: ovariables.marginSummaryCostFact,
                    marginSummaryCostWts: ovariables.marginSummaryCostWts,
                    listCamposPersoocult: ovariables.listCamposPersoocult,
                    listCamposPersoVer: ovariables.listCamposPerso
                }

                //guardamos Fabric Detail
                let listFabric = obtenerFabricDetails();              
               
                //guardamos Garment
                let listGarment = obtenerGarmentDetails();               

                //guardamos CostDetails
                let costDetails = obtenerCostDetails();

                 //guardamos Summary
                let summary = obtenerSummary();

                //guardando la informacion 
                
                let urlaccion = 'Comercial/Flash/GuardarFlash';
                let form = new FormData();                

                let par = JSON.stringify(objGeneral);
                let pardetalle = JSON.stringify(listFabric);
                let parsubdetail = JSON.stringify(listGarment);
                let parfoot = JSON.stringify(costDetails);
                let parsubfoot = JSON.stringify(summary);

                pardetalle = remplazartodo(pardetalle, '<b>', '')
                pardetalle = remplazartodo(pardetalle, '</b>', '')

                parsubdetail = remplazartodo(parsubdetail, '<b>', '')
                parsubdetail = remplazartodo(parsubdetail, '</b>', '')

                parfoot = remplazartodo(parfoot, '<b>', '')
                parfoot = remplazartodo(parfoot, '</b>', '')

                parsubfoot = remplazartodo(parsubfoot, '<b>', '')
                parsubfoot = remplazartodo(parsubfoot, '</b>', '')

                form.append('par', par);
                form.append('pardetalle', pardetalle);
                form.append('parsubdetail', parsubdetail);
                form.append('parfoot', parfoot);
                form.append('parsubfoot', parsubfoot);

                //Post(urlaccion, form, function (rpta) {
                //    alert('guardando');
                //});

                _Post(urlaccion, form, true)
                    .then((rpta) => {

                        let idFlash = rpta;
                        let mensaje = 'The quote was created successfully';

                        swal({
                            title: 'Message',
                            text: mensaje,
                            type: 'success'
                        })

                        // Para regresar de forma automatica
                        if (ovariables.par_req) {
                            const par = _('txtpar_new').value;
                            if (!_isEmpty(par)) {
                                let id = _par(par, 'id') !== '' ? parseInt(_par(par, 'id')) : 0;
                                let idprograma = parseInt(_par(par, 'idprograma'));
                                let nombre = _par(par, 'nombre');
                                let idcliente = _par(par, 'idcliente');
                                let cliente = _par(par, 'cliente');
                                let temporada = _par(par, 'temporada');
                                let division = _par(par, 'division');
                                let idgrupopersonal = _par(par, 'idgrupopersonal');

                                if (idprograma > 0) {
                                    ovariables.regresar = true;
                                    ovariables.idcliente_req = idcliente;
                                    ovariables.par_req = `regresar:true,accion:edit,id:${idprograma},nombre:${nombre},idcliente:${idcliente},cliente:${cliente},temporada:${temporada},division:${division},idgrupopersonal:${idgrupopersonal}`;

                                    const urlAccion = 'Requerimiento/Programa/Stages';
                                    const par = ovariables.par_req;
                                    _Go_Url(urlAccion, urlAccion, par);
                                }
                            }
                        } else {
                            fn_index_flash(idFlash, ovariables.par_req);
                        }

                    }, (p) => {
                        err(p);
                    });


            }
            
        }

        function fn_edit_flash(idFlash) {
            let parametro = `${idFlash}`,
                url = 'Comercial/Flash/_View';
            _Go_Url(url, url, parametro);
        }

        function fn_index_flash(idFlash, regresar) {
            let parametro = `${regresar}`,
                url = 'Comercial/Flash/Index';
            _Go_Url(url, url, parametro);
        }

        function obtenerFabricDetails() {

            let listFabric = [];
            let tbody = _('tbody_fabric');
            let listFilas = Array.from(tbody.rows);
            let i = 0;
            listFilas.forEach(x => {

                let sufijo = x.id;
                let location = 'Complement ' + i;
                    location = sufijo == 'mf' ? 'Main Fabric' : location;

                let objFabric = {
                    orden : i,
                    location: location,
                    structure: _('txtstruc_' + sufijo).value,
                    costoDk: _('txtcostdk_' + sufijo).value,
                    costoDy: _('costdy_' + sufijo).value,
                    peso: _('txtwht_' + sufijo).value,
                    unidadpeso: _('cbowht_' + sufijo).value,
                    unidadpesoDesc: _('cbowht_' + sufijo).options[_('cbowht_' + sufijo).selectedIndex].innerText,
                    ancho: _('txtwith_' + sufijo).value,
                    unidadancho: _('cbowith_' + sufijo).value,
                    unidadanchoDesc: _('cbowith_' + sufijo).options[_('cbowith_' + sufijo).selectedIndex].innerText,
                    eficiencia: _('txtefi_' + sufijo).value,
                    unidadeficiencia: _('cboefi_' + sufijo).value,
                    unidadeficienciaDesc: _('cboefi_' + sufijo).options[_('cboefi_' + sufijo).selectedIndex].innerText,
                    code: _('txtcode_' + sufijo).value,
                    content: _('txtcontent_' + sufijo).value,
                    wash: _('cbowash_' + sufijo).value,
                    washDesc: _('cbowash_' + sufijo).options[_('cbowash_' + sufijo).selectedIndex].innerText,
                    stock: _('txtstock_' + sufijo).value,
                    atx_: _('txtatx_' + sufijo).value,
                    dye: _('cbodye_' + sufijo).value,
                    dyeDesc: _('cbodye_' + sufijo).options[_('cbodye_' + sufijo).selectedIndex].innerText,
                    obs: _('txtobserva_' + sufijo).value
                }

                listFabric.push(objFabric);
               
                i++;
            });

            return listFabric;

        }

        function obtenerGarmentDetails() {

            let bValidacion = true;
            let tbody = _('tbody_fabric');
            let listFilas = Array.from(tbody.rows);
            let listErrorTotal = '';
            let listGarment = [];
            let i = 0;
            listFilas.forEach(x => {

                let objGarment = {
                    orden: i,
                    tipoGarment: '',
                    widthCsv: '',
                    labelTotalWidth: '',
                    totalWidth: '',
                    unidadTotalWidth: '',
                    labelTotalConsumptionWidth: '',
                    totalConsumptionWidth: '',
                    unidadConsumptionWidth: '',
                    labelAdjustmentWidth:'',
                    adjustmentWidth: '',
                    unidadAdjustmentWith: '',
                    LengthCSV: '',
                    LabelTotalLength: '',
                    TotalLength: '',
                    UnidadTotalLength: '',
                    LabelTotalConsumptionLength: '',
                    TotalConsumptionLength: '',
                    UnidadTotalConsumptionLength: '',
                    LabelMargin: '',
                    Margin: '',
                    LabelTotalConsumptionTotal: '',
                    TotalConsumptionTotal: '',
                    UnidadTotalConsumptionTotal:''
                }

                let sufijo = x.id;  
                
                //RECOLECTAR INFORMACION ANCHO
                               
                let _tbodyWidth = _('tbody_Garment_' + sufijo);
                let listFilasWidth = Array.from(_tbodyWidth.rows);
                let listConcepAncho = ''

                listFilasWidth.forEach(x => {
                    let inputs = x.getElementsByTagName('input');
                    let selects = x.getElementsByTagName('select');
                    let concepto = inputs.length > 1 ? inputs[0].value : x.cells[1].innerHTML;
                    let valor = inputs.length > 1 ? inputs[1].value : inputs[0].value;
                    let unidadHtml = selects[0].options[selects[0].selectedIndex].text;
                    let unidadCod = selects[0].value;
                    listConcepAncho += '^' + concepto + '¬' + valor + '¬' + unidadHtml + '¬' + unidadCod;
                });

                let _tbodyWidthTotal_desc = sufijo == 'mf' ? 'tbody_Garment_mf_tt':'tbody_ttwidth_' + sufijo;             
                let _tbodyWidthTotal = _(_tbodyWidthTotal_desc);
                let listFilasWidthTotal = Array.from(_tbodyWidthTotal.rows);
                let listConcepAnchoTotal = '';
                let contador = 1;
                listFilasWidthTotal.forEach(x => {

                    let concepto = x.cells[0].innerHTML;
                    let valor = x.cells[1].innerHTML;
                    let selects = x.getElementsByTagName('select')
                    let unidadHtml = selects.length > 0 ? selects[0].options[selects[0].selectedIndex].text : x.cells[2].innerHTML;
                    let unidadCod = selects.length > 0 ? selects[0].value : x.cells[2].innerHTML; 
                   
                    listConcepAnchoTotal += '^' + concepto + '¬' + valor + '¬' + unidadHtml + '¬' + unidadCod;

                    switch (contador) {
                        case 1:
                            objGarment.labelTotalWidth = concepto;
                            objGarment.totalWidth = valor;
                            objGarment.unidadTotalWidth = unidadHtml;
                            break;
                        case 2:
                            objGarment.labelTotalConsumptionWidth = concepto;
                            objGarment.totalConsumptionWidth = valor;
                            objGarment.unidadConsumptionWidth = unidadHtml;
                            break;
                        case 3:
                            objGarment.labelAdjustmentWidth = concepto;
                            objGarment.adjustmentWidth = valor;
                            objGarment.unidadAdjustmentWith = unidadHtml;
                            break;
                        default:
                            break;
                    }
                    contador++;
                });

                let csvTotal = listConcepAncho + listConcepAnchoTotal;
                csvTotal= remplazartodo(csvTotal, '<b>', '')
                csvTotal = remplazartodo(csvTotal, '</b>', '')
                csvTotal = remplazartodo(csvTotal, '<span id="btnUI16" class="fa fa-info-circle" style="color:darkblue" title=""></span>', '')
                csvTotal = remplazartodo(csvTotal, '<span id="btnUI17" class="fa fa-info-circle" style="color:darkblue" title=""></span>', '')

                objGarment.tipoGarment = sufijo == 'mf' ? 'MAIN FABRIC' : 'COMPLEMENT ' + sufijo;
                objGarment.widthCsv = csvTotal;

                 //FIN RECOLECTAR INFORMACION ANCHO

                 //RECOLECTAR INFORMACION LENGTH

                let _tbodyLength_desc = sufijo == 'mf' ? 'tbody_length_Garmentfabric':'tbody_length_' + sufijo;             
                let _tbodyLength = _(_tbodyLength_desc);
                let listFilasLength = Array.from(_tbodyLength.rows);
                let listConceptoAlto = '';

                listFilasLength.forEach(x => {

                    let inputs = x.getElementsByTagName('input');
                    let selects = x.getElementsByTagName('select');
                    let concepto = inputs.length > 1 ? inputs[0].value : x.cells[1].innerHTML;
                    let valor    = inputs.length > 1 ? inputs[1].value : inputs[0].value;
                    let unidadHtml = selects[0].options[selects[0].selectedIndex].text;
                    let unidadCod = selects[0].value;
                    
                    listConceptoAlto += '^' + concepto + '¬' + valor + '¬' + unidadHtml + '¬' + unidadCod;
                });

                let _tbodyLengthTotal_desc = sufijo == 'mf' ? 'tbody_ttlength_Garmentfabric' : 'tbody_ttlength_' + sufijo;
                let _tbodyLengthTotal = _(_tbodyLengthTotal_desc);
                let listFilasLengthTotal = Array.from(_tbodyLengthTotal.rows);
                let listConcepAltoTotal = '';
                let margin = sufijo == 'mf' ? ovariables.marginGarment : ovariables.marginGarmentCompl;
                contador = 1;

                listFilasLengthTotal.forEach(x => {

                    let concepto = x.cells[0].innerHTML;
                    let valor = x.cells[1].innerHTML;
                    let selects = x.getElementsByTagName('select')
                    let unidadHtml = selects.length > 0 ? selects[0].options[selects[0].selectedIndex].text : x.cells[2].innerHTML;
                    let unidadCod = selects.length > 0 ? selects[0].value : x.cells[2].innerHTML; 

                    listConcepAltoTotal += '^' + concepto + '¬' + valor + '¬' + unidadHtml + '¬' + unidadCod;

                    switch (contador) {
                        case 1:
                            objGarment.LabelTotalLength = concepto;
                            objGarment.TotalLength = valor;
                            objGarment.UnidadTotalLength = unidadHtml;
                            break;
                        case 2:
                            objGarment.LabelTotalConsumptionLength = concepto;
                            objGarment.TotalConsumptionLength = remplazartodo(valor,',','');
                            objGarment.UnidadTotalConsumptionLength = unidadHtml;
                            break;
                        case 3:
                            objGarment.LabelMargin = concepto;
                            objGarment.Margin = ovariables.margin;
                          
                            break;
                        case 4:
                            objGarment.LabelTotalConsumptionTotal = concepto;
                            objGarment.TotalConsumptionTotal = remplazartodo(valor, ',', '');
                            objGarment.UnidadTotalConsumptionTotal = unidadHtml;
                            break;
                        default:
                            break;
                    }
                    contador++;

                });

                let csvTotalLength = listConceptoAlto + listConcepAltoTotal;
                csvTotalLength=remplazartodo(csvTotalLength, '<b>', '')
                csvTotalLength = remplazartodo(csvTotalLength, '</b>', '')

                objGarment.tipoGarment = sufijo == 'mf' ? 'MAIN FABRIC' : 'COMPLEMENT ' + sufijo;
                objGarment.LengthCSV = csvTotalLength;


                //FIN RECOLECTAR INFORMACION LENGTH

                listGarment.push(objGarment);
                i++;
            });


            return listGarment;
        }

        function obtenerCostDetails() {            

            //OBTENEMOS LOS COSTOS TRIMS
            let tbodyTrims = _('tbody_trim');
            let listFilasTrims = Array.from(tbodyTrims.rows);
            let cadenaTrims = '';

            listFilasTrims.forEach(x => {

                let inputs = x.getElementsByTagName('input');
                let concepto = inputs.length > 1 ? inputs[0].value : x.cells[1].innerHTML; ;
                let valor = inputs.length > 1 ? inputs[1].value : inputs[0].value;
                let unidad = x.cells[3].innerHTML;
                cadenaTrims += '^' + concepto + '¬' + valor + '¬' + unidad 
            });
            let totalTrim = _('td_tbody_trim').innerHTML;
            
            //OBTENEMOS LOS COSTOS MANU
            let tbodyManu = _('tbody_manu');
            let listFilasManu = Array.from(tbodyManu.rows);
            let cadenaManu = '';

            listFilasManu.forEach(x => {

                let inputs = x.getElementsByTagName('input');
                let concepto = inputs.length > 1 ? inputs[0].value : x.cells[1].innerHTML;;
                let valor = inputs.length > 1 ? inputs[1].value : inputs[0].value;
                let unidad = x.cells[3].innerHTML;
                cadenaManu += '^' + concepto + '¬' + valor + '¬' + unidad
            });
            let totalManu = _('td_tbody_manu').innerHTML;

            //OBTENEMOS LOS COSTOS SERVI
            let tbodyServi = _('tbody_servi');
            let listFilasServi = Array.from(tbodyServi.rows);
            let cadenaServi = '';

            listFilasServi.forEach(x => {

                let inputs = x.getElementsByTagName('input');
                let concepto = inputs.length > 1 ? inputs[0].value : x.cells[1].innerHTML;;
                let valor = inputs.length > 1 ? inputs[1].value : inputs[0].value;
                let unidad = x.cells[3].innerHTML;
                cadenaServi += '^' + concepto + '¬' + valor + '¬' + unidad
            });
            let totalServi = _('td_tbody_servi').innerHTML;

            let objCostDetail = {

                TrimCSV: cadenaTrims,
                LabelTotalTrim: 'Total Cost',
                TotalTrim: totalTrim == '' ? 0 : parseFloat(totalTrim),
                UnidadTotalTrim: '$/Garment',
                ManufactoringCSV: cadenaManu,
                LabelTotalManufactoring: 'Total Cost',
                TotalManufactoring: totalManu == '' ? 0 : parseFloat(totalManu),
                UnidadTotalManufactoring: '$/Garment',
                AdditionalServicesCSV: cadenaServi,
                LabelTotalCostService: 'Total Cost',
                TotalCostService: totalServi == '' ? 0 : parseFloat(totalServi),
                UnidadTotalCostService: '$/Garment'
            }

            return objCostDetail;
        }

        function obtenerSummary() {

            //costos de telas
          
            let _costMain = parseFloat(_('txw_cost_mf').value);
            let listFilasFabric = Array.from(_('tbody_costFabric').rows);
            let _others = 0.00
            let csvCostFabric = '';

            listFilasFabric.forEach(x => {

                let inputs = x.getElementsByTagName('input');
                let concepto = inputs.length > 1 ? inputs[0].value : x.cells[1].innerHTML;;
                let valor = inputs.length > 1 ? inputs[1].value : inputs[0].value;
                let unidad = x.cells[3].innerHTML;

                csvCostFabric += '^' + concepto + '¬' + valor + '¬' + unidad
                _others += parseFloat(valor);
            });
            _others = _others - _costMain;
            _others = (_others) < 0 ? 0 : _others;
            //fin de costos telas

            //costos detalles

            let costTrims = parseFloat(_('txt_tt_tbody_trim').value);
            let costManu = parseFloat(_('txt_tt_tbody_manu').value);
            let strcostAdic = _('txt_tt_tbody_servi').value;
            let costAdic = strcostAdic != '' ? parseFloat(strcostAdic) : 0;
            let listFilasAdic = Array.from(_('tbody_costAdic').rows);
            let csvCostAdic = '';
            let _othersCost = 0.00

            listFilasAdic.forEach(x => {

                let inputs = x.getElementsByTagName('input');
                let concepto = inputs.length > 1 ? inputs[0].value : x.cells[1].innerHTML;;
                let valor = inputs.length > 1 ? inputs[1].value : inputs[0].value;
                let unidad = x.cells[3].innerHTML;

                csvCostAdic += '^' + concepto + '¬' + valor + '¬' + unidad
                _othersCost += parseFloat(valor).toFixed(4);
            });

            _othersCost = parseFloat(_othersCost).toFixed(4) - parseFloat(costTrims).toFixed(4) - parseFloat(costManu).toFixed(4) - parseFloat(costAdic).toFixed(4);
            _others = (_othersCost) < 0 ? 0 : _othersCost;
            //fin costos detalles

            //costos totales
            let listFilasCost = Array.from(_('tbody_cost').rows);
            let csvCost = '';
            listFilasAdic.forEach(x => {

                let inputs = x.getElementsByTagName('input');
                let concepto = inputs.length > 1 ? inputs[0].value : x.cells[1].innerHTML;;
                let valor = inputs.length > 1 ? inputs[1].value : inputs[0].value;
                let unidad = x.cells[3].innerHTML;

                csvCost += '^' + concepto + '¬' + valor + '¬' + unidad
               
            });

            let estimatedFreight = _('txt_tt_freight').value == '' ? 0 : parseFloat(_('txt_tt_freight').value);
            let nonMarginCost = _('txt_nom_marginal').value == '' ? 0 : parseFloat(_('txt_nom_marginal').value);
            let productionCost = _('txt_tt_PrdCost').value == '' ? 0 : parseFloat(_('txt_tt_PrdCost').value);
            let priceFactoryFOB = _('txt_tt_PrcFob').value == '' ? 0 : parseFloat(_('txt_tt_PrcFob').value);
            let totalCostWts = _('txt_tt_prcwts').value == '' ? 0 : parseFloat(_('txt_tt_prcwts').value);
            let netMargin = _('txt_tt_Marginprcwts').value == '' ? 0 : parseFloat(_('txt_tt_Marginprcwts').value);
            let priceWTSDDP = _('txt_tt_prcddp').value == '' ? 0 : parseFloat(_('txt_tt_prcddp').value);
            let adjustment = _('txt_adjust').value == '' ? 0 : parseFloat(_('txt_adjust').value);

            // fin costos totales

            let objSummary = {
                mainFabric: _costMain,
                others: _others,
                csvFabric: csvCostFabric,

                trims: costTrims,
                manufacturing: costManu,
                aditionalservices: costAdic,
                othersCost: _othersCost,

                productionCost: productionCost,
                factoryMargin: 0,
                priceFactoryFOB: priceFactoryFOB,
                estimatedFreight: estimatedFreight,
                totalCostWts: totalCostWts,
                netMargin: netMargin,
                nonMarginCost: nonMarginCost,
                priceWTSDDP: priceWTSDDP,
                adjustment: adjustment,
                costCsv: csvCost
            }

            return objSummary;            
        }

        function validarFlash() {

            let bValidacion = true;
           
            let msg = '';

            if (!(validacionCabecera())) { msg += ' General Data ' + ovariables.ErrorMinimo+', ' }
            if (!(validacionFabric())) { msg += '  Fabric Details, ' }
            if (!(validacionGarment())) { msg += ' Garment Details, ' }
            if (!(validacionCostDetails())) { msg += ' Cost Details, ' }
            if (!(validacionSumary())) { msg += 'Summary of costs, ' }

            if (msg!=''){

                bValidacion = false;
                msg = 'Check the marked fields in the section: ' + msg;


                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: msg
                });
            }

            return bValidacion;
        }

        function validacionCabecera() {
            let bValidacion = true;
            let arrGeneral = [];           

            let objGeneral = { nombre: 'cboCli', valor: '', descripcion: 'Cliente', obligatorio: 1 };  arrGeneral.push(objGeneral);
            objGeneral = { nombre: 'txtdate', valor: '', descripcion: 'Fecha', obligatorio: 0 };      arrGeneral.push(objGeneral);
            objGeneral = { nombre: 'txtstyle', valor: '', descripcion: 'Estilo', obligatorio: 1 }; arrGeneral.push(objGeneral);
            objGeneral = { nombre: 'txtdescripcion', valor: '', descripcion: 'Descripcion', obligatorio: 1 }; arrGeneral.push(objGeneral);
            objGeneral = { nombre: 'txtnroColor', valor: '', descripcion: 'Min Color', obligatorio: 1 }; arrGeneral.push(objGeneral);
            objGeneral = { nombre: 'txtnroFabric', valor: '', descripcion: 'Min Fabric', obligatorio: 0 }; arrGeneral.push(objGeneral);
            objGeneral = { nombre: 'txtnroStyle', valor: '', descripcion: 'Min Style', obligatorio: 0 }; arrGeneral.push(objGeneral);

            let listError = '';

            arrGeneral.forEach(function (general) {
               
                var inputVal = document.getElementById(general.nombre);
                let valor = _(general.nombre).value;
                let tipo = _(general.nombre).type;
                    general.valor = valor;

                if (((valor === '' || valor === '0') && general.obligatorio === 1) || (tipo == 'number' && valor.substr(0, 1)=='-')) {
                    listError += general.descripcion + ',';
                    marcarError(inputVal);
                } else { marcarNoError(inputVal);}

            });

            let strfabric = _('txtnroFabric').value;
            let strstyle = _('txtnroStyle').value;
                ovariables.ErrorMinimo = '';

            if ((strfabric == '' || strfabric == '0')&&(strstyle == '' || strstyle == '0')) {
                listError += 'Error minimo';
                ovariables.ErrorMinimo = ' (You must enter minimum Per Fabric or Per Style)'
            }

            if (listError !== '') {
                bValidacion = false

                //swal({
                //    type: 'error',
                //    title: 'Oops...',
                //    text: 'Verificar los campos marcados en la seccion General Data.'
                //});
            } 

            return bValidacion ;
        }

        function validacionFabric() {

            let bValidacion = true;
            let tbody = _('tbody_fabric');
            let listFilas = Array.from(tbody.rows);
            let arrGeneral = [];
            let listErrorTotal = '';

            let objGeneral = { nombre: 'txtstruc_', valor: '', descripcion: 'Structure', obligatorio: 1 }; arrGeneral.push(objGeneral);
            objGeneral = { nombre: 'txtcostdk_', valor: '', descripcion: 'Cost', obligatorio: 1 }; arrGeneral.push(objGeneral);
            objGeneral = { nombre: 'txtwht_', valor: '', descripcion: 'Weight', obligatorio: 1 }; arrGeneral.push(objGeneral);
            objGeneral = { nombre: 'txtwith_', valor: '', descripcion: 'Width', obligatorio: 1 }; arrGeneral.push(objGeneral);           

            listFilas.forEach(x => {

                let sufijo = x.id;
                let listError = '';
                arrGeneral.forEach(function (general) {

                    let strId = general.nombre + sufijo;
                    let inputVal = document.getElementById(strId);
                    let valor = _(strId).value;
                    let tipo = _(strId).type;
                  
                    if (((valor === '' || valor === '0') && general.obligatorio === 1) || (tipo == 'number' && valor.substr(0, 1) == '-')) {
                        listError += general.descripcion + ',';
                        marcarError(inputVal);
                        //inputVal.style.borderColor = "#feccc1";
                 
                    } else { marcarNoError(inputVal) /*inputVal.style.backgroundColor = ""*/; }

                }); 

                if (listError !== '') { listErrorTotal = listErrorTotal + listError }

            });           

            if (listErrorTotal !== '') {
                bValidacion = false

                //swal({
                //    type: 'error',
                //    title: 'Oops...',
                //    text: 'Verificar los campos marcados en la seccion Fabric Details.' 
                //});
            }

            return bValidacion;
        }
        
        function validacionGarment() {

            let bValidacion = true;
            let tbody = _('tbody_fabric');
            let listFilas = Array.from(tbody.rows);           
            let listErrorTotal = '';

            listFilas.forEach(x => {

                let sufijo = x.id;
                let sufijoLen = sufijo;
                if (sufijo == 'mf') {sufijoLen = 'Garmentfabric'}
                    
                let _tbodyWidth = 'tbody_Garment_' + sufijo;
                let _tbodyLength = 'tbody_length_' + sufijoLen;
                //validamos ancho              

                let inputs = document.getElementById(_tbodyWidth).getElementsByTagName('input');
                for (var z = 0; z < inputs.length; z++) {

                    let imput = inputs[z];
                    let valor = imput.value;
                    let tipo = imput.type;
                    if ((valor == '') || (tipo == 'number' && valor.substr(0, 1) == '-')) { listErrorTotal = listErrorTotal + 'Error'; marcarError(imput); }
                    else { marcarNoError(imput); }
                } 

                //inputs = document.getElementById(_tbodyLength).getElementsByTagName('input');
                //for (var z = 0; z < inputs.length; z++) {

                //    let imput = inputs[z];
                //    let valor = imput.value;
                //    let tipo = imput.type;
                //    if ((valor == '') || (tipo == 'number' && valor.substr(0, 1) == '-')) { listErrorTotal = listErrorTotal + 'Error'; marcarError(imput); }
                //    else { marcarNoError(imput); }
                //} 

                let tbody = _(_tbodyLength);
                let listFilas = Array.from(tbody.rows); 

                listFilas.forEach(x => {

                    let encontrados = (x.getElementsByClassName('_eliminarComplent')).length;                   
                    if (encontrados > 0) {

                        inputs = (x).getElementsByTagName('input');

                        for (var z = 0; z < inputs.length; z++) {

                            let imput = inputs[z];
                            let valor = imput.value;
                            let tipo = imput.type;
                            if ((valor == '') || (tipo == 'number' && valor.substr(0, 1) == '-')) { listErrorTotal = listErrorTotal + 'Error'; marcarError(imput); }
                            else { marcarNoError(imput); }
                        }
                    }
                   
                });


            });

            if (listErrorTotal !== '') {
                bValidacion = false

                //swal({
                //    type: 'error',
                //    title: 'Oops...',
                //    text: 'Verificar los campos marcados en la seccion Garment Details.'
                //});
            }

            return bValidacion;
        }

        function validacionCostDetails() {

            let bValidacion = true;
            let listErrorTotal = '';
            //let tbodyTrims = 'tbody_trim';
            //let tbodyManu =  'tbody_manu' ;
            let tbodyService = 'tbody_servi';

            //OBTENEMOS LOS COSTOS TRIMS
            let tbodyTrims = _('tbody_trim');
            let listFilasTrims = Array.from(tbodyTrims.rows);
            let valortrim = _('txt_tt_tbody_trim').value;

            listFilasTrims.forEach(x => {

                let inputs = x.getElementsByTagName('input');
                let concepto = inputs.length > 1 ? inputs[0].value : x.cells[1].innerHTML;;
                let tipo = inputs.length > 1 ? inputs[1].type : inputs[0].type ;
                let valor = inputs.length > 1 ? inputs[1].value : inputs[0].value;
                let inpunInter = inputs.length > 1 ? inputs[1] : inputs[0];

                if (concepto == '') { listErrorTotal = listErrorTotal + 'Error'; marcarError(inputs[0]); } else { marcarNoError(inputs[0]); };

                if ((valor == '' && valortrim == '') || (inputs.length == 2 && valor == '')) {

                    listErrorTotal = listErrorTotal + 'Error';
                    marcarError(inpunInter);

                } else {
                    if (tipo == 'number' && valor.substr(0, 1) == '-') { listErrorTotal = listErrorTotal + 'Error'; marcarError(inpunInter); }
                    else { marcarNoError(inpunInter); }
                }             

            });         
            
            //manu
            let tbodyManu = _('tbody_manu');
            let listFilasManu = Array.from(tbodyManu.rows);
            let valormanu = _('txt_tt_tbody_manu').value;

            listFilasManu.forEach(x => {

                let inputs = x.getElementsByTagName('input');
                let concepto = inputs.length > 1 ? inputs[0].value : x.cells[1].innerHTML;;
                let tipo = inputs.length > 1 ? inputs[1].type : inputs[0].type;
                let valor = inputs.length > 1 ? inputs[1].value : inputs[0].value;
                let inpunInter = inputs.length > 1 ? inputs[1] : inputs[0];

                if (concepto == '') { listErrorTotal = listErrorTotal + 'Error'; marcarError(inputs[0]); } else { marcarNoError(inputs[0]); };

                if ((valor == '' && valormanu == '') || (inputs.length == 2 && valor == '')) {

                    listErrorTotal = listErrorTotal + 'Error';
                    marcarError(inpunInter);

                } else {
                    if (tipo == 'number' && valor.substr(0, 1) == '-') { listErrorTotal = listErrorTotal + 'Error'; marcarError(inpunInter); }
                    else { marcarNoError(inpunInter); }
                }

            });


            //inputs = document.getElementById(tbodyManu).getElementsByTagName('input');
            //let valormanu = _('txt_tt_tbody_manu').value;
            //for (var z = 0; z < inputs.length; z++) {

            //    let imput = inputs[z];
            //    let valor = imput.value;
            //    let tipo = imput.type;
            //    if ((valor == '' && valormanu == '') || (tipo == 'number' && valor.substr(0, 1) == '-')) { listErrorTotal = listErrorTotal + 'Error'; marcarError(imput); }
            //    else { marcarNoError(imput); }
            //}

            ////service
            //   inputs = document.getElementById(tbodyService).getElementsByTagName('input');
            //for (var z = 0; z < inputs.length; z++) {

            //    let imput = inputs[z];
            //    let valor = imput.value;
            //    if (valor == '') { listErrorTotal = listErrorTotal + 'Error'; marcarError(imput); }
            //    else { marcarNoError(imput); }
            //}

            if (listErrorTotal !== '') {
                bValidacion = false

                //swal({
                //    type: 'error',
                //    title: 'Oops...',
                //    text: 'Verificar los campos marcados en la seccion Cost Details.'
                //});
            }

            return bValidacion;
        }
        
        function validacionSumary() {

            let bValidacion = true;
            let listErrorTotal = '';
            let tbodyCostFabric = 'tbody_costFabric';
            let tbodyCostAdic = 'tbody_costAdic';       


            //tbodyCostFabric
            let inputs = document.getElementById(tbodyCostFabric).getElementsByTagName('input');
            for (var z = 0; z < inputs.length; z++) {

                let imput = inputs[z];
                let valor = imput.value;
                let tipo = imput.type;
                if ((valor == '') || (tipo == 'number' && valor.substr(0, 1) == '-')) { listErrorTotal = listErrorTotal + 'Error'; marcarError(imput); }
                else { marcarNoError(imput); }
            }

            //tbodyCostAdic
            inputs = document.getElementById(tbodyCostAdic).getElementsByTagName('input');
            for (var z = 0; z < inputs.length; z++) {

                let imput = inputs[z];
                let valor = imput.value;
                let tipo = imput.type;
                if ((valor == '' && imput.id != 'txt_tt_tbody_servi') || (tipo == 'number' && valor.substr(0, 1) == '-')) { listErrorTotal = listErrorTotal + 'Error'; marcarError(imput); }
                else { marcarNoError(imput); }
            }

            if (listErrorTotal !== '') {
                bValidacion = false

                //swal({
                //    type: 'error',
                //    title: 'Oops...',
                //    text: 'Verificar los campos marcados en la seccion Summary of costs.'
                //});
            }

            return bValidacion;
        }

        function marcarError(inputVal) {
            inputVal.style.borderColor = "#ff0000";
            //inputVal.style.borderColor = "#feccc1";
        }

        function marcarNoError(inputVal) {
            inputVal.style.borderColor = "";
        }

        function obtenerFlashCliente() {

            let codCliente = _('cboCli').value;
            let par = { idCliente: codCliente };
            var urlaccion = 'Comercial/Flash/listFlashClienteComercial?par=' + JSON.stringify(par);
            Get(urlaccion, configurarFlashCliente)
        }

        function configurarFlashCliente(data) {

            let rpta = data != null ? JSON.parse(data) : null;
            if (rpta != null) {

                document.getElementById("div_datosFabric").style.display = "";
                let txtCliente = _('cboCli').options[_('cboCli').selectedIndex].innerText;
                visualizarCampos(rpta[0].listCampos);

            }
        }

        function visualizarCampos(listCampos) {

            let aData = listCampos.split(',');
            reg = aData.length;
            for (x = 0; x < reg; x++) {
                let campo = aData[x];
            }
        }

        function obtenerFiltros() {

            let par = { valor: 1 };
            var urlaccion = 'Comercial/Flash/listFiltroInicial?par=' + JSON.stringify(par);
            Get(urlaccion, llenarComboInicial)
        }

        function llenarComboInicial(data) {
            let rpta = data != null ? JSON.parse(data) : null;
            if (rpta != null) {

                ovariables.comboCosto = _comboFromCSV(rpta[0].listCosto);
                ovariables.comboPeso = _comboFromCSV(rpta[0].listPeso);
                ovariables.comboAncho = _comboFromCSV(rpta[0].listAncho);
                ovariables.comboWash = _comboFromCSV(rpta[0].listWash);
                ovariables.comboDye = _comboFromCSV(rpta[0].listDye);
                ovariables.comboTconsumo = _comboFromCSV(rpta[0].TotalConsumo);
                ovariables.comboEfici = _comboFromCSV(rpta[0].listEfici);
                ovariables.listCampos = rpta[0].listCampos;
                ovariables.listCamposPerso = rpta[0].listCamposPerso;
                ovariables.listCamposocult = rpta[0].listCamposOculto;
                ovariables.ComplementMax = parseInt(rpta[0].ComplementMax);

                ocultarColumnaRow(ovariables.listCamposocult, ovariables.listCamposPerso)

                _('cboNroFabric').innerHTML = _comboFromCSV(rpta[0].listMimimos);
                _('cboNroColor').innerHTML = _comboFromCSV(rpta[0].listMimimos);
                _('cboNroStyle').innerHTML = _comboFromCSV(rpta[0].listMimimos);
                _('cboCli').innerHTML = _comboFromCSV(rpta[0].listCliente);

                _('cboCli').value = ovariables.idcliente_req !== '' ? ovariables.idcliente_req : 0;

                ovariables.link_video = rpta[0].videoflash; 
                ovariables.flg_mantMensaje = rpta[0].flg_mantMensaje; 

                let htmlrowTexText = (document.getElementById('tbody_Garment_mf').innerHTML).trim();

                _('cbow_mfb').innerHTML = ovariables.comboAncho;
                llenarCombostblFabric('mf');//llena otros combos
                _('cbow_mfb_tw').innerHTML = ovariables.comboAncho;
                _('cbow_Cmb_tw').innerHTML = ovariables.comboAncho;

                _('cbow_mfb_tw').value = 'mt';                
               
                _('cbow_tl_mf').innerHTML = ovariables.comboAncho;
                _('cbow_cs_mf').innerHTML = ovariables.comboTconsumo;
                _('cbow_tcs_mf').innerHTML = ovariables.comboTconsumo;

                _('cbow_tl_Cm').innerHTML = ovariables.comboAncho;
                _('cbow_cs_Cm').innerHTML = ovariables.comboTconsumo;
                _('cbow_tcs_Cm').innerHTML = ovariables.comboTconsumo;

                let htmlrow = (document.getElementById('tbody_Garment_mf').innerHTML).trim();
                htmlrow = remplazartodo(htmlrow, 'mfb', 'idremplazo');
                htmlrow = remplazartodo(htmlrow, 'Body', 'descripcion');
                htmlrow = remplazartodo(htmlrow, '<span id="btnUI16" class="fa fa-info-circle" style="color:darkblue">', '');
                ovariables.htmlRow = htmlrow.trim();

                htmlrowTexText = remplazartodo(htmlrowTexText, '<select id="cbow_mfb" name="tbody_Garment_mf" data-required="true" class="form-control _enty cls_tbody_Garment_mf"></select>', 'unidad')

                htmlrowTexText = remplazartodo(htmlrowTexText, 'mfb', 'idremplazo');
                htmlrowTexText = remplazartodo(htmlrowTexText, 'Body', 'descripcion');
                htmlrowTexText = remplazartodo(htmlrowTexText, '<span id="btnUI16" class="fa fa-info-circle" style="color:darkblue">', '');  
                htmlrowTexText = remplazartodo(htmlrowTexText, 'tbody_Garment_mf', 'nametabla');
                ovariables.htmlRowTextText = remplazartodo(htmlrowTexText, 'descripcion', '<input type="text" maxlength="20" autocomplete="off" value="" class="form-control">');
                ovariables.htmlRowTextText = ovariables.htmlRowTextText.trim();
                htmlrowTexText = htmlrowTexText.trim();

                agregarCostotable('tbody_trim', rpta[0].TotalTrim, htmlrowTexText, ovariables.unidadCosto)
                agregarCostotable('tbody_manu', rpta[0].TotalManu, htmlrowTexText, ovariables.unidadCosto)
                agregarCostotable('tbody_servi', rpta[0].TotalService, htmlrowTexText, ovariables.unidadCosto)

                ovariables.DefaultTrim = document.getElementById("tbody_trim").rows.length;
                ovariables.DefaultManu = document.getElementById("tbody_manu").rows.length;
                ovariables.DefaultServi = document.getElementById("tbody_servi").rows.length;

                //carga los margenes
                ovariables.marginGarment = rpta[0].marginGarment;
                ovariables.marginGarmentCompl = rpta[0].marginGarmentCompl;
                ovariables.marginSummaryCostFact = rpta[0].marginSummaryCostFact;
                ovariables.marginSummaryCostWts = rpta[0].marginSummaryCostWts;

                asignarMarginGeneral();

                //fin de carga de margenes

                asignarTotalCostDetail('tbody_trim');
                asignarTotalCostDetail('tbody_manu');
                asignarTotalCostDetail('tbody_servi');

                let tmphtmlrow = '';
                tmphtmlrow = remplazartodo(htmlrow, 'descripcion', '<input type="text" maxlength="20" autocomplete="off"  value="" class="form-control">');
                ovariables.htmlRowText = tmphtmlrow;

                let strId = 'mfb';

                asignarEventoTotalWidth('txw_' + strId);
                asignarEventoTotalWidth('cbow_' + strId);

                strId = 'mfs';
                let strDescripcion = 'Seams';
                let strTabla = 'tbody_Garment_mf'

                tmphtmlrow = remplazartodo(htmlrow, 'idremplazo', strId);
                tmphtmlrow = remplazartodo(tmphtmlrow, 'descripcion', strDescripcion);
                tmphtmlrow = remplazartodo(tmphtmlrow, 'nametabla', strTabla);
                agregarRowTable(strTabla, tmphtmlrow);
                asignarEventoTotalWidth('txw_' + strId);
                asignarEventoTotalWidth('cbow_' + strId);



                tmphtmlrow = remplazartodo(htmlrow, 'descripcion', 'Body');
                tmphtmlrow = remplazartodo(tmphtmlrow, 'tbody_Garment_mf', 'tbody_length_Garmentfabric');
                agregarRowTable('tbody_length_Garmentfabric', tmphtmlrow);

                tmphtmlrow = remplazartodo(htmlrow, 'descripcion', 'Body hem');
                tmphtmlrow = remplazartodo(tmphtmlrow, 'tbody_Garment_mf', 'tbody_length_Garmentfabric');
                agregarRowTable('tbody_length_Garmentfabric', tmphtmlrow);

                tmphtmlrow = remplazartodo(htmlrow, 'descripcion', 'Sleeve');
                tmphtmlrow = remplazartodo(tmphtmlrow, 'tbody_Garment_mf', 'tbody_length_Garmentfabric');
                agregarRowTable('tbody_length_Garmentfabric', tmphtmlrow, 1);

                tmphtmlrow = remplazartodo(htmlrow, 'descripcion', 'Sleeve hem');
                tmphtmlrow = remplazartodo(tmphtmlrow, 'tbody_Garment_mf', 'tbody_length_Garmentfabric');
                agregarRowTable('tbody_length_Garmentfabric', tmphtmlrow, 1);

                tmphtmlrow = remplazartodo(htmlrow, 'descripcion', 'Seams');
                tmphtmlrow = remplazartodo(tmphtmlrow, 'tbody_Garment_mf', 'tbody_length_Garmentfabric');
                agregarRowTable('tbody_length_Garmentfabric', tmphtmlrow);

                asignarTotalLengthTable('tbody_length_Garmentfabric');//asignamos el evento

                let tmphtmlcom = remplazartodo(ovariables.htmlRowText, 'idremplazo', 'idremplazob');
                agregarRowTable('tbody_Garment_Cm', tmphtmlcom);

                tmphtmlrow = remplazartodo(tmphtmlrow, 'idremplazo', 'idremplazos');
                tmphtmlrow = remplazartodo(tmphtmlrow, 'tbody_length_Garmentfabric', 'tbody_Garment_Cm');
                agregarRowTable('tbody_Garment_Cm', tmphtmlrow)

                let strrow = remplazartodo(ovariables.htmlRowText, 'tbody_Garment', 'tbody_length');
                agregarRowTable('tbody_length_Cm', strrow);

                tmphtmlrow = remplazartodo(tmphtmlrow, 'tbody_Garment_Cm', 'tbody_length_Cm')
                agregarRowTable('tbody_length_Cm', tmphtmlrow)

                //asignar evento para buscar y bloquear tela 
                let sufijo = 'mf'
                asignarEventoBuscarTela('mf');
                asignarEventoLimpiarDato('mf');
                AsignartransformarMetrosleng('cbow_tl_mf');
                AsignartransformarMetroswidth('cbow_mfb_tw');
                AsignartransformarLenconsumption('cbow_cs_mf')
                AsignartransformarTotalconsumption('cbow_tcs_mf')

                //bloqueamos los campos width del garment
                bloquearCamposGarmentWith(sufijo)
                //bloqueamos los campos width del length
                bloquearCamposGarmentLength(sufijo);

                //icono de complemento
                document.getElementById('tbody_Garment_Cm').rows[0].cells[0].innerHTML = '<span id="btnUI17" class="fa fa-info-circle" style="color:darkblue"></span>'
                
                cargartoltip(rpta);
            }
        }

        //dibujo y asignacion de eventos para Garment detalles
               
        //fin dibujo y asignacion de eventos para Garment detalles

        function agregarCostotable(tabla, lista, htmlrowTexText, unidaddes) {

            let aData = lista.split('^');
            let reg = aData.length;
            let htmlrowTexText_new = remplazartodo(htmlrowTexText, 'nametabla', tabla);

            for (x = 0; x < reg; x++) {

                let elemento = aData[x];
                let aDatauni = elemento.split('¬');
                let descripcion = aDatauni[1];
                let htmlrow = remplazartodo(htmlrowTexText_new, 'descripcion', descripcion);
                htmlrow = remplazartodo(htmlrow, 'unidad', unidaddes);
                agregarRowTable(tabla, htmlrow, parseInt(aDatauni[2]));
            }
        }

        function remplazartodo(cadena, buscar, reemplazar) {

            var replace = buscar;
            var re = new RegExp(replace, "g");
            cadena = cadena.replace(re, reemplazar);
            return cadena;
        }

        function agregarRowTable(destbody, html, btnEliminar = 0) {

            let vbutton = "<span class='fa fa-remove _eliminarComplent' name='" + destbody+"' style='font-size:14px;color:red' ></span>";

            if (btnEliminar === 1) {
                let ctrl = '<td style="padding:0px;text-align:center;vertical-align:middle;">' + vbutton + '</td>'
                html = remplazartodo(html, '<td></td>', ctrl);

            }

            let tbody = _(destbody);
            tbody.insertAdjacentHTML('beforeend', html);

            if (btnEliminar === 1) {
                setearEliminarRowTable(destbody);
            }
        }

        function setearEliminarRowTable(nombreTabla) {

            let tbl = _(nombreTabla);
            let arrayDelete = _Array(tbl.getElementsByClassName('_eliminarComplent'));
            arrayDelete.forEach(x => x.addEventListener('click', e => { eliminarrow(e); }));
         
        }

        function eliminarrow(event) {

            let o = event.target;
            let fila = o.parentNode.parentNode;
            let nombreTabla = o.parentNode.parentNode.parentNode.id
            //fila = o.parentNode.parentNode.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
            renombrarComplementos();
            if (nombreTabla === 'tbody_trim' || nombreTabla === 'tbody_manu' || nombreTabla === 'tbody_servi') {
                calcularTotalCostDetail(nombreTabla)
                sumarTotalProdCost1();
            } 
            if (nombreTabla === 'tbody_costFabric' || nombreTabla === 'tbody_costAdic') {               
                sumarTotalProdCost1();
            }
            if (nombreTabla.substring(0, 13) == 'tbody_length_') {
                calcularTotalLength(nombreTabla)
            }
        }
        //LOGICAS DE NAVEGACION Y  VALIDACIONES
        function asignarEventoEficiencia(sufijo) {

            _('txtcostdk_' + sufijo).addEventListener('change', calcularEficiencia);
            _('txtwht_' + sufijo).addEventListener('change', calcularEficiencia);
            _('cbowht_' + sufijo).addEventListener('change', calcularEficiencia);
            _('txtwith_' + sufijo).addEventListener('change', calcularEficiencia);
            _('cbowith_' + sufijo).addEventListener('change', calcularEficiencia);
        }


        function calcularEficiencia(e) {

            let _sufijo = e.target.name;
            setearEficiencia(_sufijo);
            ovariables.flgbloqueoMargin = true;
        }

        function asignarEventoBuscarTela(sufijo) {

            _('btnbusqueda_' + sufijo).addEventListener('click', btnBuscarTela);        
        }

        function asignarEventoLimpiarDato(sufijo) {

            _('btncandado_' + sufijo).addEventListener('click', fn_ConfirmLimpiar);
        }

        function limpiarDato(strId) {

            let sufijo = remplazartodo(strId, 'btncandado_', '');

            _('txtcode_' + sufijo).value = '';
            _('txtstock_' + sufijo).value = '';
            _('txtatx_' + sufijo).value = '';
            _('txtcode_' + sufijo).value = '';

            document.getElementById('btnbusqueda_' + sufijo).style.display = "";
            document.getElementById('btncandado_' + sufijo).style.display = "none";

        }

        function fn_ConfirmLimpiar(e) {

            let o = e.currentTarget;
            let strId = o.getAttribute('id');

            swal({
                title: "The fields that identify the fabric will be cleaned. Do you want to continue?",
                text: '',
                type: "warning",
                //html: '<p>Mensaje de texto con <strong>formato</strong>.</p>',
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: true
            }, function (rpta_confirmacion) {
                if (rpta_confirmacion) {
                    limpiarDato(strId);
                }
                return;
            });

        }

        function setearEficiencia(_sufijo) {

            let valorPeso = _('txtwht_' + _sufijo).value;
            let valorUnidadPeso = _('cbowht_' + _sufijo).value;
            let valorAncho = _('txtwith_' + _sufijo).value;
            let valorUnidadAncho = _('cbowith_' + _sufijo).value;

            if (valorPeso !== '' && valorAncho !== '') {

                let peso = parseFloat(valorPeso);
                let ancho = parseFloat(valorAncho);
                let _eficiencia;

                if (valorUnidadAncho == 'mt') { ancho = ancho / 0.0254 };

                _eficiencia = (100000 / (peso * ancho * 2.54));
                _('txtefi_' + _sufijo).value = _formatnumber(_eficiencia, 2);
            } else {
                _('txtefi_' + _sufijo).value = '';
            }

            bloquearCamposGarmentWith(_sufijo);
            bloquearCamposGarmentLength(_sufijo);
            TotalSumariFabric(_sufijo);

            let strtabla = 'tbody_Garment_'+_sufijo;
            calcularTotalWidthTabla(strtabla);
        }

        function bloquearCamposGarmentWith(sufijo) {
            let bBloqueo = false;
            let valorAncho = _('txtwith_' + sufijo).value;
            let valorPeso = _('txtwht_' + sufijo).value;
            let valorDolar = _('txtcostdk_' + sufijo).value;
            let tbl = _('tbody_Garment_' + sufijo);
            let totalFilas = tbl.rows.length;
            let valorDefecto = 1;

            if (valorAncho === '' || valorPeso === '' || valorDolar === '') { bBloqueo = true };

            for (i = 0; i < totalFilas; i++) {

                let row = tbl.rows[i];
                let id = row.getAttribute('id');
                let strId = 'txw_' + id;
                _(strId).value='';               
                document.getElementById(strId).disabled = bBloqueo;
                if (!(bBloqueo) && i == 1) { document.getElementById(strId).value = valorDefecto};
            }

        }

        function bloquearCamposGarmentLength(sufijo) {

            let bBloqueo = _('txtefi_' + sufijo).value == '' ? true : false;
            let valorAncho = _('txtwith_' + sufijo).value;
            let valorPeso = _('txtwht_' + sufijo).value;
            let valorDolar = _('txtcostdk_' + sufijo).value;            
                sufijo   = sufijo == 'mf' ? 'Garmentfabric' : sufijo;
            let tablename = 'tbody_length_' + sufijo
            let tbody = _(tablename);
            let listFilas = Array.from(tbody.rows);
            let valorDefecto = 1;
            let i = 0;
            if (valorAncho === '' || valorPeso === '' || valorDolar === '') { bBloqueo = true };

            listFilas.forEach(x => {

                x.getElementsByClassName('cls_' + tablename)[0].value = ''
                x.getElementsByClassName('cls_' + tablename)[0].disabled = bBloqueo;
                if (!(bBloqueo) && (i == 1 || i == 3 || i == 4)) { x.getElementsByClassName('cls_' + tablename)[0].value = valorDefecto };
                i++;
            });

            let tablenameTotal = remplazartodo(tablename, 'length', 'ttlength');
            let tbodytotal = _(tablenameTotal);
            let listFilasTotal = Array.from(tbodytotal.rows);

            listFilasTotal.forEach(x => {
                x.cells[1].innerHTML = ''
            });
        }

        function asignarEventoTotalWidth(_idControl) {

            _(_idControl).addEventListener('change', calcularTotalWidth);
        }

        function asignarEventoTotalConsump(_sufijo) {

            let strIdWidth = 'txtwith_' + _sufijo;
            let strIdttWidth = 'td' + _sufijo + '_ttw';

            _(strIdWidth).addEventListener('change', calcularTotalComsump);
            _(strIdttWidth).addEventListener('change', calcularTotalComsump);

        }

        function calcularTotalWidth(e) {
            let strtabla = e.currentTarget.name;
            calcularTotalWidthTabla(strtabla);
        }

        function calcularTotalWidthTabla(strtabla) {

            //let strtabla = e.currentTarget.name;
            let tbl = _(strtabla);
            let prefijo = strtabla.substr(-2)
            let totalFilas = tbl.rows.length;
            let body = 0.00;
            let seams = 0.00;

            for (i = 0; i < totalFilas; i++) {

                let row = tbl.rows[i];
                let id = row.getAttribute('id');
                let valor = _('txw_' + id).value;

                if (valor !== "") {

                    let fltValor = parseFloat(valor);
                    let unidad = _('cbow_' + id).value;
                    if (unidad === 'mt') { fltValor = (fltValor/0.0254) };
                    if (i == 0) { body = fltValor }
                    if (i == 1) { seams = fltValor }
                }
            }

            let total = ((body + seams) * 2.54) / 100;

            if (body !== 0.00 && seams !== 0.00) {
                _('td' + prefijo + '_ttw').innerHTML = _formatnumber(total, 2);
                _('cbow_' + prefijo+'b_tw').value = 'mt';
                setearTotalComsump(prefijo);             
                
            } else {
                _('td' + prefijo + '_ttw').innerHTML = '';
                setearTotalComsump(prefijo);
            }

            let tablename = prefijo == 'mf' ? 'tbody_length_Garmentfabric' : 'tbody_length_' + prefijo;
            calcularTotalLength(tablename);
           
        }

        function totalwidth(strtabla) {

            let tbl = _(strtabla);
            let prefijo = strtabla.substr(-2)
            let totalFilas = tbl.rows.length;
            let suma = 0.00

            for (i = 0; i < totalFilas; i++) {

                let row = tbl.rows[i];
                let id = row.getAttribute('id');
                let valor = _('txw_' + id).value;
                if (valor !== "") {

                    let fltValor = parseFloat(valor);
                    let unidad = _('cbow_' + id).value;
                    if (unidad === 'mt') { fltValor = (fltValor / 0.0254) };
                    suma = suma + fltValor;
                }
            }
            return suma
        }

        function calcularTotalComsump(e) {
            
            let prefijo = e.target.name;
            setearTotalComsump(prefijo);
        }

        function setearTotalComsump(prefijo) {

            //let totalWidth = _('td' + prefijo + '_ttw').innerHTML;
            let strtablawidth = 'tbody_Garment_' + prefijo;
            let totalWidth = totalwidth(strtablawidth)
            totalWidth = (totalWidth * 2.54) / 100

            let totalWidthFabric = _('txtwith_' + prefijo).value;
            let unidWidthFabric = _('cbowith_' + prefijo).value;
            if (unidWidthFabric == 'mt') { totalWidthFabric = totalWidthFabric/0.0254}

            if (totalWidth !== '' && totalWidthFabric !== '' && totalWidthFabric !== 0) {

                let floatTotalWidth = parseFloat(totalWidth);
                let floattotalWidthFabric = parseFloat(totalWidthFabric);

                let TotalComsump = (floattotalWidthFabric * 2.54) / (floatTotalWidth * 200)
                _('td' + prefijo + '_ttc').innerHTML = _formatnumber(TotalComsump, 2);

                let entero = Math.floor(_formatnumber(TotalComsump, 2));
                let decimal = _formatnumber(TotalComsump, 2) - entero;
                if (decimal < 0.5) { decimal = 0 } else { decimal = 0.5 };
                let totalAjust = entero + decimal;

                _('td' + prefijo + '_tta').innerHTML = _formatnumber(totalAjust, 2);
         
            } else {

                _('td' + prefijo + '_ttw').innerHTML = '';
                _('td' + prefijo + '_tta').innerHTML = '';
                _('td' + prefijo + '_ttc').innerHTML = ''
                
            }
        }

        function agregarFilaTexto(e) {

            let o = e.currentTarget;
            let Tabla = o.getAttribute('tabla');
            agregarFilaTextoTabla(Tabla);
        }

        function agregarFilaTextoTabla(Tabla) {

            let bInsert = true;
            let htmlrow = ovariables.htmlRowText;
            htmlrow = remplazartodo(htmlrow, 'tbody_Garment_mf', Tabla);
            let strIdentificador = Tabla.substring(0, 13);
            let sufijo = remplazartodo(Tabla, strIdentificador, '');
            let nroRow = document.getElementById(Tabla).getElementsByTagName("tr").length;

            if (strIdentificador == 'tbody_length_') {
                let mensaje = '';

                if (strIdentificador == 'tbody_length_' && sufijo == 'Garmentfabric') {

                    bInsert = oReglas.ReglaGermanFabric.CantidadDeFilas(nroRow);
                    mensaje = 'Main Fabric'
                }

                if (strIdentificador == 'tbody_length_' && sufijo != 'Garmentfabric') {

                    bInsert = oReglas.ReglaGermanCompl.CantidadDeFilas(nroRow);
                    mensaje = 'Complemento.'
                }

                if (!(bInsert)) {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Numero maximo de concepto para el ' + mensaje + ' ha sido alcanzado.'
                    });
                }
            }

            if (bInsert) { agregarRowTable(Tabla, htmlrow, 1); }

            switch (strIdentificador) {
                case 'tbody_length_':
                    asignarTotalLengthTable(Tabla);
                    break;
                case 'tbody_cost':
                    asignarTotalLengthTable(Tabla);
                    break;
                default:
            }
        }

        function asignarTotalCostDetail(strTable) {

            let elementos = Array.from(_(strTable).getElementsByClassName('cls_' + strTable))
            elementos.forEach(x => {
                x.addEventListener('change', onchangeCostDetail);
            });
        }

        function onchangeCostDetail(e) {

            let tablename = e.target.name;
            calcularTotalCostDetail(tablename);
        }

        function calcularTotalCostDetail(tablename) {

            let tbody = _(tablename);
            let listFilas = Array.from(tbody.rows);
            let sumTotal = 0.00;

            listFilas.forEach(x => {

                let valor1 = x.cells[2].getElementsByClassName('cls_' + tablename)[0].value;
                let fvalor1 = valor1 === '' ? 0 : parseFloat(valor1);
                sumTotal = sumTotal + fvalor1

            });

            _('td_' + tablename).innerHTML = parseFloat(sumTotal).toFixed(2)
            _('txt_tt_' + tablename).value = parseFloat(sumTotal).toFixed(2)
            let floatSumTotal = parseFloat(sumTotal).toFixed(2);

            switch (tablename) {
                case 'tbody_trim':
                        ovariables.sumTotalTrim = floatSumTotal;
                    break;
                case 'tbody_manu':
                        ovariables.sumTotalManu = floatSumTotal;
                    break;
                case 'tbody_servi':
                        ovariables.sumTotalServ = floatSumTotal;
                    break;
            }

            sumarTotalProdCost1();//sumaTotal
        }

        function limpiarTotalCostDetail(tablename) {

            let tbody = _(tablename);
            let listFilas = Array.from(tbody.rows);

            listFilas.forEach(x => {
                x.cells[2].getElementsByClassName('cls_' + tablename)[0].value = '';
            });

            _('td_' + tablename).innerHTML = ''

            let floatSumTotal = '';

            switch (tablename) {
                case 'tbody_trim':
                    ovariables.sumTotalTrim = floatSumTotal;
                    break;
                case 'tbody_manu':
                    ovariables.sumTotalManu = floatSumTotal;
                    break;
                case 'tbody_servi':
                    ovariables.sumTotalServ = floatSumTotal;
                    break;
            }
        }

        function asignarTotalLengthTable(strTable) {
            
            let elementos = Array.from(_(strTable).getElementsByClassName('cls_' + strTable))
            elementos.forEach(x => {
                x.addEventListener('change', onchangeTotalLength);
            });

        }

        function onchangeTotalLength(e) {

            let tablename = e.target.name;
            calcularTotalLength(tablename);
        }

        function retornarsumaLengthInch(tablename) {

            let tbody = _(tablename);
            let listFilas = Array.from(tbody.rows);
            let sumTotal = 0.00;

            listFilas.forEach(x => {
                let fila = x;
                let td1 = x.cells[1].innerHTML;
                let valor1 = x.getElementsByClassName('cls_' + tablename)[0].value;
                let valor2 = x.getElementsByClassName('cls_' + tablename)[1].value;
                let fvalor1 = valor1 === '' ? 0 : parseFloat(valor1);
                fvalor1 = valor2 === 'mt' ? fvalor1 / 0.0254 : fvalor1;
                sumTotal = sumTotal + fvalor1
            });           

            return sumTotal;
        }

        function calcularTotalLength(tablename) {

            let tbody = _(tablename);
            let listFilas = Array.from(tbody.rows);
            let sumTotal = 0.00;

            listFilas.forEach(x => {
                let fila = x;
                let td1 = x.cells[1].innerHTML;
                let valor1 = x.getElementsByClassName('cls_' + tablename)[0].value;
                let valor2 = x.getElementsByClassName('cls_' + tablename)[1].value;
                let fvalor1 = valor1 === '' ? 0 : parseFloat(valor1);
                fvalor1 = valor2 === 'mt' ? fvalor1 / 0.0254 : fvalor1;
                sumTotal = sumTotal + fvalor1                
            });

            sumTotal = (sumTotal * 2.54) / 100;

            let tablenameTotal = remplazartodo(tablename, 'length', 'ttlength');
            let strTabla = remplazartodo(tablenameTotal, 'tbody_ttlength_', '');
         
            let sufijo = '';
            let margin = 0.00;
            if (strTabla == 'Garmentfabric') { sufijo = 'mf'; margin = ovariables.marginGarment } else { sufijo = tablename.substr(-2); margin = ovariables.marginGarmentCompl }
            let tbodytotal = _(tablenameTotal)
            let eficiencia = _('txtefi_' + sufijo).value;
            let listFilasTotal = Array.from(tbodytotal.rows);
            let i = 0;
            let Lenconsumption = 0.00;
            let strTotal =''
            listFilasTotal.forEach(x => {
                if (i == 0) { x.cells[1].innerHTML = _formatnumber(sumTotal, 2); _('cbow_tl_' + sufijo).value='mt'  }
                if (i == 1) {
                    //Lenconsumption = (eficiencia / _formatnumber(sumTotal, 2));
                    Lenconsumption = getLenconsumption(sufijo);
                    x.cells[1].innerHTML = _formatnumber(Lenconsumption, 2);
                    _('cbow_cs_' + sufijo).value = '1'
                }
                if (i == 3) {
                    let totalAncho = _('td' + sufijo +'_tta').innerHTML
                    let total = (Lenconsumption * totalAncho) * (1 - (margin/100))
                    x.cells[1].innerHTML = _formatnumber(total, 2);
                    strTotal = x.cells[1].innerHTML;
                    _('cbow_tcs_' + sufijo).value = '1'
                }
               
                i++;
            });

            if (strTotal !== '') {
                TotalSumariFabric(sufijo);
                sumarTotalProdCost1();
            }
        }


        function TotalSumariFabric(sufijo) {

            let strCosto = parseFloat(_('txtcostdk_' + sufijo).value);
            let prefijoTotal = sufijo == 'mf' ? 'Garmentfabric' : sufijo;
            let tbody = _('tbody_ttlength_' + prefijoTotal)
            let filas = Array.from(tbody.rows);
            let strTotalConsumo = filas[3].cells[1].innerHTML;

            if (strTotalConsumo !== '') {
                let costo = parseFloat(strCosto);
                let totalconsumo = parseFloat(strTotalConsumo);
                let cost_mf = (costo / totalconsumo);
                _('txw_cost_' + sufijo).value = _formatnumber(cost_mf, 2);
            } else { _('txw_cost_' + sufijo).value = ''; }
            
        }

        function sumarTotalProdCost1() {

            let claseName = 'cls_cost_total';
            let tableName1 = 'tbody_costFabric';
            let tableName2 = 'tbody_costAdic';
            let sumaCostFabric = 0.00;
            let sumaCostAdic = 0.00;
            let sumTotal = 0.00;

            sumaCostFabric = retornarSumaTabla(tableName1, claseName);
            sumaCostAdic = retornarSumaTabla(tableName2, claseName);
            sumTotal = sumaCostFabric + sumaCostAdic;
            _('txt_tt_PrdCost').value = _formatnumber(sumTotal, 2); 
            _('txt_tt_PrdCost_2').value = _formatnumber(sumTotal, 2); 

            sumarTotalProdCost2();
            sumarTotalProdCost3();
            sumarTotalProdCost4();
        }

        function sumarTotalProdCost2() {
            let sumPrdCost = parseFloat(_('txt_tt_PrdCost').value);
            let margin = (ovariables.marginSummaryCostFact / 100);
            let priceFob = sumPrdCost / (1 - margin);
            _('txt_tt_PrcFob').value = _formatnumber(priceFob, 2);  
            
        }

        function sumarTotalProdCost3() {

            let precioFob = _('txt_tt_PrcFob').value;            
            let valor1 = _('txt_tt_freight').value;
            let precioFreig = valor1 === '' ? 0 : parseFloat(valor1);
            let precioWts = parseFloat(precioFob) + parseFloat(precioFreig);
            _('txt_tt_prcwts').value = _formatnumber(precioWts, 2);   
        }

        function sumarTotalProdCost4() {

            let prcWts = _('txt_tt_prcwts').value;

            let valor1 = _('txt_nom_marginal').value;
            let nomMarginal = valor1 === '' ? 0 : parseFloat(valor1);

            let margin = ovariables.marginSummaryCostWts / 100;
            let precioDdp = (prcWts / (1 - margin)) + nomMarginal;
            _('txt_tt_prcddp').value = _formatnumber(precioDdp, 2);
             let marginprcwts = precioDdp - nomMarginal - prcWts
            _('txt_tt_Marginprcwts').value = _formatnumber(marginprcwts, 2);
        }

        function retornarSumaTabla(tablename,claseName) {

            let tbody = _(tablename);
            let listFilas = Array.from(tbody.rows);
            let sumTotal = 0.00;

            listFilas.forEach(x => {

                let valor1 = x.cells[2].getElementsByClassName(claseName)[0].value;
                let fvalor1 = valor1 === '' ? 0 : parseFloat(valor1);
                sumTotal = sumTotal + fvalor1

            });

            return sumTotal;
        }

        function customizarMensaje(e) {

            if (ovariables.flg_mantMensaje == 'S') {

                let o = e.currentTarget;
                let strId = o.getAttribute('id');
                let mensaje = document.getElementById(strId).title;
                ovariables.msg_tmp = mensaje
                let params = strId;

                _modalBody_new({
                    url: 'Comercial/Flash/_personalizarMensaje',
                    ventana: '_personalizarMensaje',
                    titulo: 'Customize Message',
                    parametro: params,
                    alto: '325',
                    ancho: '500',
                    responsive: 'modal-lg'
                });

            }
        }

        function cargartoltip(rpta) {

            cargarmensaje('btnUI01', rpta[0].UI01)
            cargarmensaje('btnUI02', rpta[0].UI02)
            cargarmensaje('btnUI03', rpta[0].UI03)
            cargarmensaje('btnUI12', rpta[0].UI12)
            //cargarmensaje('btnUI13', rpta[0].UI13)
            cargarmensaje('btnUI14', rpta[0].UI14)
            cargarmensaje('btnUI15', rpta[0].UI15)
            cargarmensaje('btnUI16', rpta[0].UI16)
            cargarmensaje('btnUI17', rpta[0].UI17)
            cargarmensaje('btnUI18', rpta[0].UI18)
            //cargarmensaje('btnUI04', rpta[0].UI04)
            //cargarmensaje('btnUI05', rpta[0].UI05)
            //cargarmensaje('btnUI06', rpta[0].UI06)
            ////cargarmensaje('btnUI07', rpta[0].UI07)
            //cargarmensaje('btnUI08', rpta[0].UI08)
            //cargarmensaje('btnUI09', rpta[0].UI09)
            //cargarmensaje('btnUI10', rpta[0].UI10)

        }

        function limpiarMensajes() {

            document.getElementById('btnUI01').title = '';
            document.getElementById('btnUI02').title = '';

            document.getElementById('btnUI03').title = '';
            document.getElementById('btnUI12').title = '';
            document.getElementById('btnUI14').title = '';
            document.getElementById('btnUI15').title = '';
            document.getElementById('btnUI16').title = '';
            document.getElementById('btnUI17').title = '';
            document.getElementById('btnUI18').title = '';
        }

        function cargarmensaje(control, mensaje) {

            var titulo = `linea1
linea2
linea3
linea4
linea5
linea6
linea7
linea8
linea9
`;

            let aData = mensaje.split('*');
            let reg = aData.length;

            for (x = 0; x < reg; x++) {
                let y = x + 1;
                let linea = aData[x];
                titulo = remplazartodo(titulo, 'linea' + y, linea);

            }

            for (x = reg; x < 9; x++) {
                let y = x + 1;
                titulo = remplazartodo(titulo, 'linea' + y, '');

            }

            document.getElementById(control).title = titulo
            //document.getElementById(control).title2 = titulo2

        }


        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            remplazartodo: remplazartodo,
            ocultarColumnaRow: ocultarColumnaRow,
            llenarDatosFabric: llenarDatosFabric,
            asignarMarginGeneral: asignarMarginGeneral,
            cargarmensaje: cargarmensaje
        }
    }
)(document, 'panelencabezado_Flash');

(
    function ini() {
        appNewFlash.load();
        appNewFlash.req_ini();

    }
)();