var appFiltroBuscadorAtx = (
    function (d, idpadre) {
        var ovariables = {

        }

        function load() {
            let par = _('hf_filtro_buscadoratx').value, fechainicio = _par(par, 'fechainicio'), fechafin = _par(par, 'fechafin'),
                idcliente = _par(par, 'idcliente'), idproveedor = _par(par, 'idproveedor');

            $('#div_grupofechainicio .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true }).on('change', function (e) {
                let fecha = e.target.value;
                $('#txtfechainicio_buscadoratx').val(fecha).datepicker('update');
            });

            $('#div_grupofechafin .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true }).on('change', function (e) {
                let fecha = e.target.value;
                $('#txtfechafin_buscadoratx').val(fecha).datepicker('update');
            });

            _('_btnAceptar_filtrobuscadoratx').addEventListener('click', fn_aceptar_buscadoratx, false);

            fechainicio = fechainicio !== '' ? _convertANSItoMMDDYYYY(fechainicio) : '';
            fechafin = fechafin !== '' ? _convertANSItoMMDDYYYY(fechafin) : '';

            if (fechainicio !== '') {
                $('#div_grupofechainicio .input-group.date').datepicker('update', fechainicio);
            }
            if (fechafin !== '') {
                $('#div_grupofechafin .input-group.date').datepicker('update', fechafin);
            }
        }

        function fn_aceptar_buscadoratx(e) {
            let fechainicio = _convertDate_ANSI(_('txtfechainicio_buscadoratx').value), fechafin = _convertDate_ANSI(_('txtfechafin_buscadoratx').value),
                cboproveedor = _('_cboproveedor_filtrobuscador'), cbocliente = _('_cbocliente_filtrobuscador'),
                idproveedor = cboproveedor.value, idcliente = cbocliente.value, proveedor = cboproveedor.selectedIndex > 0 ? cboproveedor.options[cboproveedor.selectedIndex].text : '',
                cliente = cbocliente.selectedIndex > 0 ? cbocliente.options[cbocliente.selectedIndex].text : '';
            let parametro = { idproveedor: idproveedor, idcliente: idcliente, fechainicio: fechainicio, fechafin: fechafin, conrangofecha: 'si', proveedor: proveedor, cliente: cliente,
                label_fechainicio: _convertANSItoMMDDYYYY(fechainicio), label_fechafin: _convertANSItoMMDDYYYY(fechafin) };
            _('hf_filtro_buscadoratx').value = `idproveedor:${idproveedor},idcliente:${idcliente},fechainicio:${fechainicio},fechafin:${fechafin}`;

            let req = _required({ clase: '_enty', id: 'panelencabezado_filtrobuscadoratx' });

            if (req) {
                $('#modal__FiltroBuscadorAtx').modal('hide');
                appBuscadorAtx.filtrar_busqueda(parametro);
            }
        }

        var err = (p) => {
            console.log('err', p);
        }

        function res_ini(odata) {
            let par = _('hf_filtro_buscadoratx').value, fechainicio = _par(par, 'fechainicio'), fechafin = _par(par, 'fechafin'),
                idcliente = _par(par, 'idcliente'), idproveedor = _par(par, 'idproveedor');

            if (odata !== null) {
                let proveedor = CSVtoJSON(odata[0].proveedor), cliente = CSVtoJSON(odata[0].cliente);
                _('_cboproveedor_filtrobuscador').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(proveedor, 'idproveedor', 'nombreproveedor');
                _('_cbocliente_filtrobuscador').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(cliente, 'idcliente', 'nombrecliente');

                _('_cboproveedor_filtrobuscador').value = idproveedor !== '' ? idproveedor : '';
                _('_cbocliente_filtrobuscador').value = idcliente !== '' ? idcliente : '';
            }
        }

        function req_ini() {
            _Get('DesarrolloTextil/Atx/GetData_LoadIni_BuscadorAtx')
                .then((odata) => {
                    let data = odata !== '' ? JSON.parse(odata) : null ;
                    res_ini(data);
                })
                .catch((e) => {
                    err(e);
                });
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)();

(
    function init() {
        appFiltroBuscadorAtx.load();
        appFiltroBuscadorAtx.req_ini();
    }
)();