var app_ConcessionArte = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            const par = _('concessionArte_param').value;
            _('IdReportListConcesion').value = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
            $("#cboConParaArte").select2({
                width: '100%'
            });

            _('btnConcesionArte').addEventListener('click', ConcesionarColor);
        }

        function req_ini() {
            ConsecionColorCargaInicial();
        }

        function ConcesionarColor() {

            if (ValidarConcesionColor()) {

                app_NewOrnament.GenerarConcesion();

            }
        }

        function ValidarConcesionColor() {
            let bValidacion = true;

            if (_('cboConParaArte').value == '0') {

                swal({ title: "Alert", text: "You must choose a contact.", type: "warning" });
                bValidacion = false;
            }

            return bValidacion;

        }

        function ConsecionColorCargaInicial() {

            let err = function (__err) { console.log('err', __err) };
            let IdRequerimientoDetalle = _('IdRequerimientoDetalleAr').value;
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
            llenarComboCsv('cboConParaArte', ListaContactoConsecionCsv, '0');
            _('cboConParaArte').value = '0';
            forzarOnchange('cboConParaArte');

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
)(document, 'panelEncabezado_ConcessionArte');
(
    function ini() {
        app_ConcessionArte.load();
        app_ConcessionArte.req_ini();
    }
)();