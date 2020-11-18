var app_Concession = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            const par = _('concessionColor_param').value;
            _('IdReportListConcesion').value = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
            $("#cboConParaColor").select2({
                width: '100%'
            });
            
            _('btnConcesionColor').addEventListener('click', ConcesionarColor);
        }

        function req_ini() {
            ConsecionColorCargaInicial();
        }

        function ConcesionarColor() {

            if (ValidarConcesionColor()) {

                app_NewColor.GenerarConcesion();

            }
        }

        function ValidarConcesionColor() {
            let bValidacion = true;

            if (_('cboConParaColor').value == '0') {

                swal({ title: "Alert", text: "You must choose a contact.", type: "warning" });
                bValidacion = false;
            }

            return bValidacion;

        }

        function ConsecionColorCargaInicial() {

            let err = function (__err) { console.log('err', __err) };
            let IdRequerimientoDetalle = _('IdRequerimientoDetalle').value;
            let parametro = {
                IdCliente: ovariables.idcliente,
                IdRequerimientoDetalle: IdRequerimientoDetalle
            };

            _Get('Requerimiento/Color/GetColorConcessionLoadNew_JSON?par=' + JSON.stringify(parametro))
                .then((resultado) => {

                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        llenarControles(rpta);
                    }

                }, (p) => { err(p); });
        }

        function llenarControles(rpta) {

            let ListaContactoConsecionCsv = rpta.ListaContactoConsecionCsv !== '' ? CSVtoJSON(rpta.ListaContactoConsecionCsv) : [];
            llenarComboCsv('cboConParaColor', ListaContactoConsecionCsv,'0');
            _('cboConParaColor').value = '0';
            forzarOnchange('cboConParaColor'); 

        }

        function llenarComboCsv(control, listCsv, vDefecto) {

            const cbolist = listCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
            _(control).innerHTML = cbolist;

            if (vDefecto != '')
                _(control).value = vDefecto;
        }

        function forzarOnchange(controlId) {

            var element = document.getElementById(controlId);
            var event = new Event('change');
            element.dispatchEvent(event);
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_Concession');
(
    function ini() {
        app_Concession.load();
        app_Concession.req_ini();
    }
)();