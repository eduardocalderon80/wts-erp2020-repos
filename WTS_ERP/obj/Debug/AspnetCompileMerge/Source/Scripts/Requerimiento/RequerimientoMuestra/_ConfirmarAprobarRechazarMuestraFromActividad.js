var appConfirmarApruebaRechazaMuestra = (
    function (d, idpadre) {

        function load(){
            let arraprobado = app_RequerimientoDetalleDDP.ovariables.ListaEstadosMuestra.filter(x => x.NombreEstado === 'APPROVED' || x.NombreEstado === 'REJECTED');
            _('cboestado_swal').innerHTML = _comboFromJSON(arraprobado, 'ValorEstado', 'NombreEstado');
            let inputfecha = _('fechaaprobada_rechazada_swal');

            $(inputfecha).datepicker({
                autoclose: true,
                clearBtn: true,
                todayHighlight: true
            }).next().on('click', function (e) {
                $(this).prev().focus();
            });

            _('_btnAceptar_confirmarapruebarechazamuestra').addEventListener('click', fn_save_aprobar_rechazar_muestra, false);
        }

        function fn_save_aprobar_rechazar_muestra() {
            let required = _required({ clase: '_enty_modal', id: 'panelencabezado_confirmarapruebarechazamuestra' });
            if (!required) {
                return false;
            }

            let txtpar_modal = _('txtpar_confirmarapruebarechazamuestra').value;
            let rowindex = _par(txtpar_modal, 'rowindex');
            let url = _par(txtpar_modal, 'url');
            let obj_parametros_form_padre = { rowindex: rowindex, url: _parameterUncodeJSON(url) };
            let fechaaprobada_rechazada = _convertDate_ANSI(_('fechaaprobada_rechazada_swal').value,'DD/MM/YYYY');
            let cboestado = _('cboestado_swal');
            let idestado = cboestado.value;
            let nombreestado = cboestado.options[cboestado.selectedIndex].text;
            let obj_datos_apruebarechaza = {
                fecha_aprueba_rechaza_ansi: fechaaprobada_rechazada,
                valorestado: idestado,
                nombreestado: nombreestado

            };

            app_RequerimientoDetalleDDP.fn_save_actividadmuestra_from_confirmar_aprueba_rechaza_muestra(obj_parametros_form_padre, obj_datos_apruebarechaza);
        }

        function res_ini(){
            
        }

        function req_ini(){
            
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelencabezado_confirmarapruebarechazamuestra');

(
    function init(){
        appConfirmarApruebaRechazaMuestra.load();
        appConfirmarApruebaRechazaMuestra.req_ini();
    }
)();