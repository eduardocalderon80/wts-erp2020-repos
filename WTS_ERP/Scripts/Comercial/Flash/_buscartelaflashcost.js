var appBuscarTelaFlashCost = (
    function (d, idpadre) {
        var ovariables = {
            lstmateriaprima: []
        }

        function load() {
            _('_btn_agregar_materiaprima').addEventListener('click', fn_add_materiaprima, false);
            _('_btnAceptar_buscartelaflashcost').addEventListener('click', fn_aceptar, false);
            _('_txt_dl_familia').addEventListener('click', limpiarfamilia, false); 
            _('_txt_dl_familia').addEventListener('blur', setearfamilia, false); 

            //let disabled_all = true, disabled = false;
            //disbled_habilitar_inputs('_cls_input', disabled_all);
            //disbled_habilitar_inputs('_cls_disabled_1', disabled);

            // RADIO BUTTON
            //$('.i-checks._group_check').iCheck({
            //    checkboxClass: 'icheckbox_square-green',
            //    radioClass: 'iradio_square-green',
            //}).on('ifChanged', function (e) {
            //    let dom = e.currentTarget, valor_cls_accion = dom.getAttribute('data-valorbuscar'),
            //        valor = dom.value;

            //    let disabled_all = true, disabled = false;
            //    disbled_habilitar_inputs('_cls_input', disabled_all);
            //    disbled_habilitar_inputs(valor_cls_accion, disabled);

            //    limpiar_inputs(valor);
            //});
           
        }

        function limpiarfamilia(e) {

            if (_('_dl_familia').value == '0') {            
                _('_txt_dl_familia').value = '';
            }           

        }

        function cambioMateriaPrima(e) {
            let o = e.currentTarget;
            o.value = '';
        }

        function setearfamilia(e) {

            let valor = _('_dl_familia').value
            if (valor == '') {
                _('_dl_familia').value = '0';
                _('_txt_dl_familia').value = '----Seleccione----';
            }

        }

        function fn_aceptar(e) {

            if (validacionBuscar()) {
                let tipobusqueda = '', arr_materiaprima = [], idmateriaprima = '',
                    txtanio = _('txtanio'), txtnumeroatx = _('txtCorrelativo'), url = 'Comercial/Flash/GetFiltroTelaFlashCost', par = '', anio = '',
                    contador = '', idfamilia = '', parametro = '';
                let idfabric = _('_txt_idFabric').value;


                txtfamilia = _('_txt_dl_familia'), dl_familia = _('_dl_familia'), idfamilia = _getValueDataList(txtfamilia.value, dl_familia);
                arr_materiaprima = getArray_estructura();
                anio = txtanio.value;
                contador = txtnumeroatx.value;


                par = { tipobusqueda: tipobusqueda, idfabric: idfabric, materiaprima: arr_materiaprima, idfamilia: idfamilia, anio: anio, contador: contador };
                parametro = JSON.stringify(par);
                url += '?par=' + parametro, parJSON = _parameterEncodeJSON(parametro);

                _Get(url)
                    .then((data) => {
                        let odata = data !== '' ? JSON.parse(data) : null;
                        //let odata = data !== '' ? CSVtoJSON(data) : null;
                        if (odata !== null) {
                            //// PINTAR TABLA 
                            let atx = odata[0].atx !== '' ? CSVtoJSON(odata[0].atx) : null;
                            if (atx !== null) {
                                $("#modal__BuscarTelaFlashCost").modal('hide');
                                _modalBody({
                                    url: 'Comercial/Flash/_BuscarBusquedaInteligente',
                                    ventana: '_BuscarBusquedaInteligente',
                                    titulo: 'Fabric Search',
                                    parametro: `${parJSON}`,
                                    ancho: '',
                                    alto: '',
                                    responsive: 'modal-lg'
                                });
                            } else {
                                swal({
                                    type: 'error',
                                    title: 'Oops...',
                                    text: 'Tela no encontrada.'
                                });
                            }
                        }
                    });
            } else {

                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Debe elegir una fibra de composición.'
                });
            }
        }
        //validar_tArray_estructura

        function validacionBuscar() {
            bValidacion = true;

            bValidacion = validar_tArray_estructura();

            return bValidacion;
        }


        function getArray_estructura() {
            let tbody = _('tbody_buscartelaflashcost'), arr_rows = Array.from(tbody.rows),
                arr_return = [];

            arr_rows.forEach(x => {
                let txtmateriaprima = x.getElementsByClassName('_cls_materiaprima')[0], dl_materiaprima = x.getElementsByClassName('cls_dl_materiaprima')[0],
                    txtporcentaje = x.getElementsByClassName('_cls_porcentaje')[0],
                    obj = {}, idmateriaprima = '';
                idmateriaprima = _getValueDataList(txtmateriaprima.value, dl_materiaprima);
                obj.idmateriaprima = idmateriaprima;
                obj.porcentaje = txtporcentaje.value == '' ? '0' : txtporcentaje.value ;

                arr_return.push(obj);
            });

            return arr_return;
        }

        function validar_tArray_estructura() {

            let bvalidacion = true;
            let tbody = _('tbody_buscartelaflashcost'), arr_rows = Array.from(tbody.rows),
                arr_return = [];

            arr_rows.forEach(x => {
                let txtmateriaprima = x.getElementsByClassName('_cls_materiaprima')[0], dl_materiaprima = x.getElementsByClassName('cls_dl_materiaprima')[0],
                    txtporcentaje = x.getElementsByClassName('_cls_porcentaje')[0],
                    obj = {}, idmateriaprima = '';
                idmateriaprima = _getValueDataList(txtmateriaprima.value, dl_materiaprima);
                obj.idmateriaprima = idmateriaprima;
                obj.porcentaje = txtporcentaje.value == '' ? '0' : txtporcentaje.value;

                if ((obj.idmateriaprima == '0' || obj.idmateriaprima == '') && (obj.porcentaje != '0' && obj.porcentaje != ''))
                    bvalidacion = false;

                arr_return.push(obj);
            });

            return bvalidacion;
        }

        function fn_getcheck_tipobusqueda() {
            let arr_chk = Array.from(_('panelencabezado_buscartelaflashcost').getElementsByClassName('_clschk_buscar')), tipobusqueda = '';
            arr_chk.forEach(x => {
                if (x.checked) {
                    if (x.value === '1') {
                        tipobusqueda = 'estructura';
                    } else if (x.value === '2') {
                        tipobusqueda = 'codigoatx';
                    }
                }
            });

            return tipobusqueda;
        }

        function limpiar_inputs(valor) {
            if (valor === '1') {
                let arr_inputs = Array.from(_('panelencabezado_buscartelaflashcost').getElementsByClassName('_cls_disabled_2'));
                arr_inputs.forEach(x => {
                    if (x.getAttribute('type') === 'text') {
                        x.value = '';
                    }
                });
            } else if (valor === '2') {
                let arr_inputs = Array.from(_('panelencabezado_buscartelaflashcost').getElementsByClassName('_cls_disabled_1'));
                arr_inputs.forEach(x => {
                    if (x.getAttribute('type') === 'text') {
                        x.value = '';
                    }
                });
                
                let tbody = _('tbody_buscartelaflashcost');
                tbody.innerHTML = '';
            }
        }

        function disbled_habilitar_inputs(cls, estado) {
            let arr_inputs = Array.from(_('panelencabezado_buscartelaflashcost').getElementsByClassName(cls));

            arr_inputs.forEach(x => {
                x.disabled = estado;
            });
        }

        function fn_add_materiaprima() {
            let tbody = _('tbody_buscartelaflashcost'), totalfilas = tbody.rows.length;
            let html = `
                <tr>
                    <td>
                        <button type='button' class='btn btn-xs btn-danger _cls_btn_delete'>
                            <span class='fa fa-trash'></span>
                        </button>
                    </td>
                    <td class='text-center' style='vertical-align: middle;'>
                        Composition  (%)
                    </td>
                    <td>
                        <div class="col-sm-12">
                            <input type="text" class="form-control _cls_materiaprima" list="_dl_materiprima_${totalfilas}"  value="----Seleccione----">
                            <datalist id="_dl_materiprima_${totalfilas}"  class='cls_dl_materiaprima'>
                            </datalist>
                        </div>
                    </td>
                    <td>
                        <input type="text" class="form-control _cls_porcentaje" />
                    </td>
                </tr>
            `;

            tbody.insertAdjacentHTML('beforeend', html);
            llenar_tbl_add(totalfilas);
            handler_tbl_add(totalfilas);

            _('_dl_materiprima_'+totalfilas).value = '0';
        }        

        function handler_tbl_add(indice) {
            let tbody = _('tbody_buscartelaflashcost'), fila = tbody.rows[indice],
                btndelete = fila.getElementsByClassName('_cls_btn_delete')[0];

            btndelete.addEventListener('click', fn_delete_materiaprima, false);
        }

        function fn_delete_materiaprima(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
        }

        function llenar_tbl_add(indice) {
            let tbody = _('tbody_buscartelaflashcost'), fila = tbody.rows[indice],
                options_materiaprima = ovariables.lstmateriaprima.length > 0 ? _comboDataListFromJSON(ovariables.lstmateriaprima, 'idmateriaprima', 'nombremateriaprima') : '',
                dl_materiaprima = fila.getElementsByClassName('cls_dl_materiaprima')[0],
                txt_materiaprima = fila.getElementsByClassName('_cls_materiaprima')[0],
                txtporcentaje = fila.getElementsByClassName('_cls_porcentaje')[0];

            dl_materiaprima.addEventListener('click', cambioMateriaPrima, false);
            txt_materiaprima.addEventListener('click', cambioMateriaPrima, false);

            dl_materiaprima.innerHTML = options_materiaprima;
            $(txtporcentaje).autoNumeric('init', { nDec: 2 });
        }

        function res_ini(odata) {
            if (odata !== null) {
                let olstfamilia = odata[0].familia !== '' ? CSVtoJSON(odata[0].familia) : null,
                    optionfamilia = odata[0].familia !== '' ? _comboDataListFromJSON(olstfamilia, 'idfamilia', 'nombrefamilia') : '',
                    dlfamilia = _('_dl_familia');

                ovariables.lstmateriaprima = odata[0].materiaprima !== '' ? CSVtoJSON(odata[0].materiaprima) : [];

                dlfamilia.innerHTML = optionfamilia;
            }

            _('_dl_familia').value = '0'
            _('_txt_dl_familia').value ='----Seleccione----'
            fn_add_materiaprima();
            fn_add_materiaprima();
        }

        function req_ini() {
            let url = 'Comercial/Flash/BuscarTelaFlashCostLoad';
            _Get(url)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;

                    res_ini(odata);
                });
        }

        return {
            load: load,
          
            req_ini: req_ini
        }
    }   
)(document, 'panelencabezado_buscartelaflashcost');

(
    function init() {
        appBuscarTelaFlashCost.load();
        appBuscarTelaFlashCost.req_ini();
        
    }    
)();


//var appBuscarTelaFlashCost = (
//    function (d, idpadre) {

//        var ovariables = {
//            lstmateriaprima: []
//        }

//        function load() {
            
//        }

//        function res_ini(odata) {
//            if (odata !== null) {
//                let olstfamilia = odata[0].familia !== '' ? CSVtoJSON(odata[0].familia) : null,
//                    optionfamilia = odata[0].familia !== '' ? _comboDataListFromJSON(olstfamilia, 'idfamilia', 'nombrefamilia') : '',
//                    dlfamilia = _('_dl_familia');

//                ovariables.lstmateriaprima = odata[0].materiaprima !== '' ? CSVtoJSON(odata[0].materiaprima) : []

//                dlfamilia.innerHTML = optionfamilia;
//            }
//        }

//        function req_ini() {
//            let url = 'Comercial/Flash/BuscarTelaFlashCostLoad';
//            _Get(url)
//                .then((data) => {
//                    let odata = data !== '' ? JSON.parse(data) : null;

//                    res_ini(odata);
//                });
//        }

//        return {
//            load: load,
//            req_ini: req_ini
//        }
//    }
//)(document, 'panelencabezado_buscartelaflashcost');

//(
//    function init() {
//        appBuscarTelaFlashCost.load();
//        appBuscarTelaFlashCost.req_ini();
//    }
//)();