var appQuestionsIndex = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            ruta: '',
            lstpreguntas: [],
            lstmodulos: [],
            lstventana: []
        }

        function load() {
            // Events
            _('btnRefresh').addEventListener('click', req_ini);
            _('btnAddModal').addEventListener('click', fn_save);
            _('txtSearch').addEventListener('keyup', fn_search);

            // Remove btn new
            //_('btnNew').remove();
        }

        function req_ini() {
            const err = function (__err) { console.log('err', __err) },
                parametro = { x: 1 };
            _Get('FAQ/Questions/GetAllData_Questions?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    const rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        // Guarda ovariables
                        ovariables.lstpreguntas = rpta.Preguntas !== '' ? JSON.parse(rpta.Preguntas) : [];
                        ovariables.lstmodulos = rpta.Modulos !== '' ? JSON.parse(rpta.Modulos) : [];
                        ovariables.lstventana = rpta.Ventana !== '' ? JSON.parse(rpta.Ventana) : [];

                        // Combos
                        _('cboModule').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lstmodulos, 'IdModulo', 'Nombre');
                        _('cboModuloModal').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lstmodulos, 'IdModulo', 'Nombre');
                        _('cboVentana').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lstventana, 'IdVentana', 'Nombre');
                        _('cboVentanaModal').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lstventana, 'IdVentana', 'Nombre');

                        // Select2
                        $("#cboModule").select2({ width: '100%' });
                        $("#cboVentana").select2({ width: '100%' });

                        $("#cboModuloModal").select2({ width: '100%' });
                        $("#cboVentanaModal").select2({ width: '100%' });

                        // Crear
                        fn_crear_preguntas(ovariables.lstpreguntas);
                    }
                }, (p) => { err(p); });
        }

        function fn_crear_preguntas(data) {
            if (data.length > 0) {

            }
        }

        function fn_search() { 
            const questions = [...document.getElementsByClassName('faq-question')];
            const input = this.value.toUpperCase();
            if (input !== '') {
                questions.forEach(x => {
                    let item = x.textContent
                    if (item.toUpperCase().indexOf(input) > -1) {
                        x.parentElement.parentElement.parentElement.style.display = "";
                    } else {
                        x.parentElement.parentElement.parentElement.style.display = "none";
                    }
                });
            } else {
                questions.forEach(x => {
                    x.parentElement.parentElement.parentElement.style.display = "";
                });
            }
        }

        function fn_save() {
            const req_enty = _required({ clase: '_enty_faq', id: 'panelEncabezado_QuestionsIndex' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Guardar Pregunta",
                    text: "¿Estas seguro/a que deseas guardar la pregunta?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = _getParameter({ clase: '_enty_faq', id: 'panelEncabezado_QuestionsIndex' }),
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('FAQ/Questions/SaveData_Questions', frm)
                        .then((resultado) => {
                            const rpta = resultado !== '' ? JSON.parse(resultado) : [];
                            if (rpta !== null) {
                                swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success", timer: 5000 });
                                $("#modal_nuevo").modal('hide');
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_QuestionsIndex');
(
    function ini() {
        appQuestionsIndex.load();
        appQuestionsIndex.req_ini();
    }
)();