var app_NewEmail = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            idprograma: 0,
            accion: '',
            tipo: '',
            lstcombo: [],
            lstdetalle: [],
            lstarchivos: [],
            rutaFileServerTela: '',
            rutaFileServerAvio: '',
            rutaFileServerColor: '',
            rutaFileServerEstilo: '',
            rutaFileServerArte: '',
            arr_estilos_seleccionados: []
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Select2 multiple para combos
            //$("#cboCorreosEmail, #cboCCEmail").select2({
            //    width: '100%'
            //});
            $('.tagsinput').tagsinput({
                tagClass: 'label label-primary'
            });
            // Summernote
            $("#summernote_email").summernote({
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    //['table', ['table']],
                    //['insert', ['link', 'picture', 'hr']],
                    //['view', ['fullscreen', 'codeview']],
                    //['help', ['help']]
                ]
            });
            $(".feed-activity-list").slimScroll({
                height: '380px',
                width: '100%',
                railOpacity: 0.9
            });
            $('.email-scroll').slimScroll({
                height: '419px',
                width: '100%',
                railOpacity: 0.9
            });

            // Events
            _('btnSendEmail').addEventListener('click', fn_send);
            _('btnDiscardEmail').addEventListener('click', fn_discard);

            // Se obtiene parametro si tuviera
            const par = _('newemail_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.idprograma = _par(par, 'idprograma') !== '' ? _parseInt(_par(par, 'idprograma')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.tipo = _par(par, 'tipo');
            }

            // Asigna rutas de fileserver
            ovariables.rutaFileServerTela = _('rutaFileServerTelaEmail').value;
            ovariables.rutaFileServerAvio = _('rutaFileServerAvioEmail').value;
            ovariables.rutaFileServerColor = _('rutaFileServerColorEmail').value;
            ovariables.rutaFileServerEstilo = _('rutaFileServerEstiloEmail').value;
            ovariables.rutaFileServerArte = _('rutaFileServerArteEmail').value;

            $('#cboSelectReq').on('select2:selecting', function (e) {
                const id = e.params.args.data.id;
                fn_create_element(id);
            });
            $('#cboSelectReq').on('select2:unselecting', function (e) {
                const id = e.params.args.data.id;
                fn_delete_element(id);
            });
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { Tipo: ovariables.tipo, IdPrograma: ovariables.idprograma };
            _Get('Requerimiento/Programa/GetAllReqsDetails?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstcombo = rpta.lstcombo !== '' ? JSON.parse(rpta.lstcombo) : [];
                        ovariables.lstdetalle = rpta.lstdetalle !== '' ? JSON.parse(rpta.lstdetalle) : [];
                        ovariables.lstarchivos = rpta.lstarchivos !== '' ? JSON.parse(rpta.lstarchivos) : [];

                        _('cboSelectReq').innerHTML = _comboFromJSON(ovariables.lstcombo, 'codigo', 'descripcion');

                        $("#cboSelectReq").select2({
                            width: '100%'
                        });
                    }
                }, (p) => { err(p); });
        }

        function fn_delete_element(id) {
            let div_details_info = _('div_details_info');
            [...div_details_info.getElementsByClassName('feed-element')].filter(x => x.getAttribute('data-id') === id).forEach(x => {
                x.parentNode.removeChild(x);
            });
        }

        function fn_create_element(idrequerimiento) {
            if (ovariables.lstdetalle.length > 0) {
                if (ovariables.tipo === 'RC') {
                    _('lblSelectReq').innerHTML = 'Select Colors';
                    fn_color(idrequerimiento);
                } else if (ovariables.tipo === 'RT') {
                    _('lblSelectReq').innerHTML = 'Select Fabrics';
                    fn_fabric(idrequerimiento);
                } else if (ovariables.tipo === 'RO') {
                    _('lblSelectReq').innerHTML = 'Select Ornaments';
                    fn_art(idrequerimiento);
                } else if (ovariables.tipo === 'RE') {
                    _('lblSelectReq').innerHTML = 'Select Styles';
                    fn_style(idrequerimiento);
                } else if (ovariables.tipo === 'RA') {
                    _('lblSelectReq').innerHTML = 'Select Trims';
                    fn_trim(idrequerimiento);
                }
            }
        }

        function fn_send() {
            const req_enty = _required_arrayid({
                id: "#panelEncabezado_NewEmail",
                array: ['#cboSelectReq', '#cboCorreosEmail', '#txtSubjectEmail']
            });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Are you sure?",
                    text: "You will send the email",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            IdRequerimiento: $("#cboSelectReq").val() !== null ? $("#cboSelectReq").val().join(';') : '',
                            To: $("#cboCorreosEmail").val() !== null ? $("#cboCorreosEmail").val().split(",").join(";") : '',
                            CC: $("#cboCCEmail").val() !== null ? $("#cboCCEmail").val().split(",").join(";") : '',
                            Subject: $("#txtSubjectEmail").val(),
                            Body: $("#summernote_email").code(),
                            Files: fn_get_files()
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('Requerimiento/Programa/SendSamplesEstilo', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                $("#modal_NewEmail").modal("hide");
                                swal({ title: "Good job!", text: "The email was sended successfully", type: "success", timer: 5000 });
                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Warning", text: "Complete the red fields", type: "warning", timer: 5000 });
            }
        }

        function fn_get_files() {
            const html = [...document.querySelectorAll("input[name='check_file_email']:checked")];
            let array = [];
            if (html.length > 0) {
                html.forEach(x => {
                    array.push(x.value);
                });
            }
            return array.join(";")
        }

        function fn_style(IdRequerimiento) {
            const div_details_info = _('div_details_info');
            let array = ovariables.lstdetalle.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento))[0];
            let details_head = '';
            let html_archivos = '';

            if (array) {
                let archivos = ovariables.lstarchivos.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento));
                if (archivos) {
                    let details_foot = ``;
                    archivos.forEach((x, y) => {
                        details_foot += `<div class="checkbox checkbox-green">
                                            <input id="checkbox_email${y}" type="checkbox" name="check_file_email" value="${ovariables.rutaFileServerEstilo}${x.Archivo}">
                                            <label for="checkbox_email${y}">
                                                ${x.Nombre}
                                            </label>
                                        </div>`;
                    });
                    html_archivos = `<div class="feed-element" data-id="${array.IdRequerimiento}">
                                        <div class="media-body">
                                            <strong>Files:</strong> <br>
                                            ${details_foot}
                                        </div>
                                    </div>`
                }

                details_head = `<div class="feed-element" data-id="${array.IdRequerimiento}">
                                    <div class="media-body">
                                        <strong>Request Type:</strong> ${array.TipoSolicitud} <br>
                                        <strong>Client Style Number:</strong> ${array.CodigoEstilo} <br>
                                        <strong>Client Description:</strong> ${array.Descripcion} <br>
                                        <strong>Notes:</strong> ${array.Notas} <br>
                                        <strong>Supplier Type:</strong> ${_capitalizePhrase(array.NombreTipoProveedor)} <br>
                                        <strong>Supplier Name:</strong> ${_capitalizePhrase(array.NombreProveedor)} <br>
                                    </div>
                                </div>
                                ${html_archivos}`;
                div_details_info.insertAdjacentHTML('beforeend', details_head);
            }
        }

        function fn_color(IdRequerimiento) {
            const div_details_info = _('div_details_info');
            let array = ovariables.lstdetalle.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento))[0];
            let details_head = '';
            let html_archivos = '';

            if (array) {
                let archivos = ovariables.lstarchivos.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento));
                if (archivos) {
                    let details_foot = ``;
                    archivos.forEach((x, y) => {
                        details_foot += `<div class="checkbox checkbox-green">
                                            <input id="checkbox_email${y}" type="checkbox" name="check_file_email" value="${ovariables.rutaFileServerColor}${x.Archivo}">
                                            <label for="checkbox_email${y}">
                                                ${x.Nombre}
                                            </label>
                                        </div>`;
                    });
                    html_archivos = `<div class="feed-element" data-id="${array.IdRequerimiento}">
                                        <div class="media-body">
                                            <strong>Files:</strong> <br>
                                            ${details_foot}
                                        </div>
                                    </div>`
                }

                details_head = `<div class="feed-element" data-id="${array.IdRequerimiento}">
                                    <div class="media-body">
                                        <strong>RQ Status:</strong> ${_capitalizePhrase(array.estadoNombre)} <br>
                                        <strong>Client Requeriment Date:</strong> ${array.FechaRequerimientoCliente} <br>
                                        <strong>Notes:</strong> ${array.Notes} <br>
                                        <strong>Fabric Type:</strong> ${array.NombreTipoTela} <br>
                                        <strong>Fabric Description:</strong> ${array.DescripcionTela} <br>
                                    </div>
                                </div>
                                ${html_archivos}`;
                div_details_info.insertAdjacentHTML('beforeend', details_head);
            }
        }

        function fn_fabric(IdRequerimiento) {
            const div_details_info = _('div_details_info');
            let array = ovariables.lstdetalle.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento))[0];
            let details_head = '';
            let html_archivos = '';

            if (array) {
                let archivos = ovariables.lstarchivos.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento));
                if (archivos) {
                    let details_foot = ``;
                    archivos.forEach((x, y) => {
                        details_foot += `<div class="checkbox checkbox-green">
                                            <input id="checkbox_email${y}" type="checkbox" name="check_file_email" value="${ovariables.rutaFileServerTela}${x.Archivo}">
                                            <label for="checkbox_email${y}">
                                                ${x.Nombre}
                                            </label>
                                        </div>`;
                    });
                    html_archivos = `<div class="feed-element" data-id="${array.IdRequerimiento}">
                                        <div class="media-body">
                                            <strong>Files:</strong> <br>
                                            ${details_foot}
                                        </div>
                                    </div>`
                }

                details_head = `<div class="feed-element" data-id="${array.IdRequerimiento}">
                                    <div class="media-body">
                                        <strong>Request Type:</strong> ${array.TipoSolicitudNombre} <br>
                                        <strong>WTS Fabric Code:</strong> ${array.CodigoTelaWTS} <br>
                                        <strong>Fabric Description:</strong> ${array.DescripcionTela} <br>
                                        <strong>Notes:</strong> ${array.Nota} <br>
                                        <strong>Direct Supplier Name:</strong> ${_capitalizePhrase(array.NombreProveedorDirecto)} <br>
                                        <strong>Fabric Supplier Name:</strong> ${_capitalizePhrase(array.NombreProveedor)} <br>
                                    </div>
                                </div>
                                ${html_archivos}`;
                div_details_info.insertAdjacentHTML('beforeend', details_head);
            }
        }

        function fn_art(IdRequerimiento) {
            const div_details_info = _('div_details_info');
            let array = ovariables.lstdetalle.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento))[0];
            let details_head = '';
            let html_archivos = '';

            if (array) {
                let archivos = ovariables.lstarchivos.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento));
                if (archivos) {
                    let details_foot = ``;
                    archivos.forEach((x, y) => {
                        details_foot += `<div class="checkbox checkbox-green">
                                            <input id="checkbox_email${y}" type="checkbox" name="check_file_email" value="${ovariables.rutaFileServerArte}${x.Archivo}">
                                            <label for="checkbox_email${y}">
                                                ${x.Nombre}
                                            </label>
                                        </div>`;
                    });
                    html_archivos = `<div class="feed-element" data-id="${array.IdRequerimiento}">
                                        <div class="media-body">
                                            <strong>Files:</strong> <br>
                                            ${details_foot}
                                        </div>
                                    </div>`
                }

                details_head = `<div class="feed-element" data-id="${array.IdRequerimiento}">
                                    <div class="media-body">
                                        <strong>WTS Ornament Code:</strong> ${array.ArteCodigoWts} <br>
                                        <strong>Requeriment Type:</strong> ${array.NombreTipoSolicitud} <br>
                                        <strong>Notes:</strong> ${array.Notes} <br>
                                        <strong>Supplier Name:</strong> ${_capitalizePhrase(array.NombreProveedor)} <br>
                                        <strong>Ornament Type:</strong> ${array.ArteTipoWts} <br>
                                        <strong>Technique:</strong> ${array.ArteTecnica} <br>
                                        <strong>Fabric Type:</strong> ${array.TipoTela} <br>
                                        <strong>Fabric Description:</strong> ${array.DescripcionTela} <br>
                                    </div>
                                </div>
                                ${html_archivos}`;
                div_details_info.insertAdjacentHTML('beforeend', details_head);
            }
        }

        function fn_trim(IdRequerimiento) {
            const div_details_info = _('div_details_info');
            let array = ovariables.lstdetalle.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento))[0];
            let details_head = '';
            let html_archivos = '';

            if (array) {
                let archivos = ovariables.lstarchivos.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento));
                if (archivos) {
                    let details_foot = ``;
                    archivos.forEach((x, y) => {
                        details_foot += `<div class="checkbox checkbox-green">
                                            <input id="checkbox_email${y}" type="checkbox" name="check_file_email" value="${ovariables.rutaFileServerAvio}${x.Archivo}">
                                            <label for="checkbox_email${y}">
                                                ${x.Nombre}
                                            </label>
                                        </div>`;
                    });
                    html_archivos = `<div class="feed-element" data-id="${array.IdRequerimiento}">
                                        <div class="media-body">
                                            <strong>Files:</strong> <br>
                                            ${details_foot}
                                        </div>
                                    </div>`
                }

                details_head = `<div class="feed-element" data-id="${array.IdRequerimiento}">
                                    <div class="media-body">
                                        <strong>RQ Status:</strong> ${_capitalizePhrase(array.NombreEstado)} <br>
                                        <strong>Requeriment Type:</strong> ${array.TipoSolicitud} <br>
                                        <strong>Trim Type:</strong> ${array.NombreTipoAvio} <br>
                                        <strong>Supplier Type:</strong> ${array.NombreTipoProveedor} <br>
                                        <strong>Supplier Name:</strong> ${_capitalizePhrase(array.NombreProveedor)} <br>
                                        <strong>Notes:</strong> ${array.Notas} <br>
                                    </div>
                                </div>
                                ${html_archivos}`;
                div_details_info.insertAdjacentHTML('beforeend', details_head);
            }
        }

        function fn_discard() {
            $("#cboCorreosEmail").val("");
            $("#cboCCEmail").val("");
            $("txtSubjectEmail").val("");
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_get_files: fn_get_files
        }
    }
)(document, 'panelEncabezado_NewEmail');
(
    function ini() {
        app_NewEmail.load();
        app_NewEmail.req_ini();
    }
)();