var app_SampleDetails = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            guid: '',
            accion: '',
            actualizararchivo: 0,
            idcliente: '',
            idestilo: '',
            sample: '',
            exfactory: '',
            indc: '',
            lstcolores: [],
            lsttallas: [],
            lstdestinos: [],
            lstsampledetails: [],
            lstarchivos: [],
            lsttipoarchivo: []
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnAddSampleDetails').addEventListener('click', fn_addsampledetails);
            _('inputFileSampleDetails').addEventListener('change', fn_uploadfile);
            _('btnSendComment').addEventListener('click', fn_createcomments);

            // Call Functions
            fn_createscroll();

            // Se obtiene parametro si tuviera
            const par = _('sampledetails_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.guid = _par(par, 'guid');
                ovariables.accion = _par(par, 'accion');
                ovariables.idcliente = _par(par, 'idcliente');
                ovariables.idestilo = _par(par, 'idestilo');
                ovariables.sample = _par(par, 'sample');
                ovariables.exfactory = _par(par, 'exfactory');
                ovariables.indc = _par(par, 'indc');

                // Setea titulo de programing
                _('title_programming').textContent = `${ovariables.sample} Programming`;

                if (ovariables.accion === 'edit') {
                    _('modal_title_SampleDetails').innerHTML = 'Edit Sample Details';

                    _('btnSaveSampleDetails').innerHTML = `<span class="fa fa-save"></span> Update`;
                    _('btnSaveSampleDetails').addEventListener('click', fn_editsampledetails);
                } else {
                    _('modal_title_SampleDetails').innerHTML = 'New Sample Details';

                    _('btnSaveSampleDetails').addEventListener('click', fn_savesampledetails);
                }
            }

            // :cierre
            $('#modal_SampleDetails').on("hidden.bs.modal", function () {
                app_NewStyle.req_ini();
            });


            //btnAddSampleDetails
            //$('#div_tbl_samplesdetails ._enty_sampledetails').autoNumeric('init', { mDec: 0 });

        }

        function fn_createscroll() {
            $('#div_tbl_samplesdetails').slimScroll({
                height: '320px',
                width: '100%',
                railOpacity: 0.9
            });
            $('#div_comments').slimScroll({
                height: '378px',
                width: '100%',
                railOpacity: 0.9
            });
        }

        function fn_uploadfile() {
            ovariables.actualizararchivo = 1;
            const archivo = this.value;
            const ultimopunto = archivo.lastIndexOf(".");
            let ext = archivo.substring(ultimopunto + 1);
            ext = ext.toLowerCase();
            switch (ext) {
                case 'csv':
                case 'xls':
                case 'xlsx':
                case 'pdf':
                case 'doc':
                case 'docx':
                case 'txt':
                    fn_savefile();
                    break;
                default:
                    swal({ title: "Warning", text: "Files Allowed (csv, xls, xlsx, pdf, doc, docx, txt)", type: "warning", timer: 5000 });
                    this.value = '';
            }
        }

        function req_ini() {
            if (ovariables.accion !== "edit") {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { IdCliente: ovariables.idcliente, IdPrograma: '0' };
                _Get('Requerimiento/RequerimientoMuestra/GetRequerimientoDetalleLoadNew_JSON?RequerimientoJSON=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            ovariables.lstcolores = rpta.ListaColoresxClienteCSV !== '' ? CSVtoJSON(rpta.ListaColoresxClienteCSV) : [];
                            ovariables.lsttallas = rpta.ListaTallaxClienteCSV !== '' ? CSVtoJSON(rpta.ListaTallaxClienteCSV) : [];
                            ovariables.lstdestinos = rpta.ListaClienteDireccionCSV !== '' ? CSVtoJSON(rpta.ListaClienteDireccionCSV) : [];
                            ovariables.lsttipoarchivo = rpta.ListaTipoArchivosCSV !== '' ? CSVtoJSON(rpta.ListaTipoArchivosCSV) : [];

                            // Crear combos
                            fn_createcolor(ovariables.lstcolores);
                            fn_createsize(ovariables.lsttallas);
                            fn_createdestination(ovariables.lstdestinos);
                        }
                    }, (p) => { err(p); });
            } else {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { IdRequerimiento: ovariables.id, IdCliente: ovariables.idcliente, IdPrograma: 0 };
                _Get('Requerimiento/RequerimientoMuestra/GetRequerimientoDetalleLoadEdit_JSON?RequerimientoJSON=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            ovariables.lstcolores = rpta.ListaColoresxClienteCSV !== '' ? CSVtoJSON(rpta.ListaColoresxClienteCSV) : [];
                            ovariables.lsttallas = rpta.ListaTallaxClienteCSV !== '' ? CSVtoJSON(rpta.ListaTallaxClienteCSV) : [];
                            ovariables.lstdestinos = rpta.ListaClienteDireccionCSV !== '' ? CSVtoJSON(rpta.ListaClienteDireccionCSV) : [];
                            ovariables.lstsampledetails = rpta.ListaRequerientoDetalleCSV !== '' ? CSVtoJSON(rpta.ListaRequerientoDetalleCSV) : [];
                            ovariables.lstarchivos = rpta.ListaArchivoRequerimientoCSV !== '' ? CSVtoJSON(rpta.ListaArchivoRequerimientoCSV) : [];
                            ovariables.lsttipoarchivo = rpta.ListaTipoArchivosCSV !== '' ? CSVtoJSON(rpta.ListaTipoArchivosCSV) : [];

                            // Crear combos
                            fn_createcolor(ovariables.lstcolores);
                            fn_createsize(ovariables.lsttallas);
                            fn_createdestination(ovariables.lstdestinos);
                            fn_loadsampledetails(ovariables.lstsampledetails);
                            fn_loadfilessampledetails(ovariables.lstarchivos);
                            _cargar_tabcomentarios_comentarios(ovariables.id);
                        }
                    }, (p) => { err(p); });
            }

            // Select2 multiple para combos
            $("#cboColors, #cboSizes, #cboDestination").select2({
                width: '100%'
            });
        }

        function fn_createcomments() {
            let txtparmodal = _("sampledetails_txtpar").value;
            let idrequerimiento = _par(txtparmodal, 'id');
            let comentario = _("txtcommentsend").value;

            let err = function (__err) { console.log('err', __err) },
                parametro = {
                    IdRequerimiento: idrequerimiento,
                    Comentario: comentario
                };
            let frm = new FormData();
            frm.append("RequerimientoComentarioJSON", JSON.stringify(parametro));

            _Post('Requerimiento/RequerimientoMuestra/SaveNewRequerimientoMuestraComentario_JSON', frm)
                .then((resultado) => {
                    let rpta = (resultado !== '') ? JSON.parse(resultado) : {};
                    let lstRequerimientoComentarios = (rpta.data !== '') ? CSVtoJSON(rpta.data) : [];
                    _cargarDetalle_ComentariosxIdRequerimiento(idrequerimiento, lstRequerimientoComentarios);

                    swal({ title: 'Alert', text: rpta.mensaje, type: 'success' });
                }, (p) => { err(p); });
            

            //// CODIGO DE EJEMPLO
            //const text = _('txtcommentsend').value;
            //if (text !== '') {
            //    const date = new Date().toString().split(' ', 5).join(' ');
            //    const user = _capitalizePhrase(utilindex.usuarioAD.split('.').join(' '));
            //    const html = `<div class="chat-message left">
            //                <img class="message-avatar" src="/Content/img/RRHH/personal/default.jpg" alt="">
            //                <div class="message">
            //                    <a class="message-author" href="#"> ${user} </a>
            //                    <span class="message-date"> ${date} </span>
            //                    <span class="message-content">
            //                        ${text}
            //                    </span>
            //                </div>
            //            </div>`;
            //    _('div_comments').innerHTML += html;
            //    _('txtcommentsend').value = "";
            //} else {
            //    swal({ title: "Warning", text: "You have to add a comment to send it", type: "warning", timer: 5000 });
            //}
        }

        function _cargarDetalle_ComentariosxIdRequerimiento(idrequerimiento, _obj) {
            let com;
            if (_obj.length === 0) {
                com = `<div class="chat-message right">
                        <img class="message-avatar" src="/Content/img/RRHH/personal/default.jpg" alt="">
                        <div class="message">
                            <a class="message-author" href="#">
                                ERP escribió: 
                                        </a>
                            <span class="message-date">
                                ${ moment(new Date()).format('dddd MMM YYYY HH:MM:SS')}
                                        </span>
                            <span class="message-content">
                                No se encontro ningún mensaje para la muestra seleccionada.
                                        </span>
                        </div>
                    </div>`;
            } else {
                com = _obj.map((x) => {
                    return `<div class="chat-message left">
                            <img class="message-avatar" src="/Content/img/RRHH/personal/${x.ImagenWebNombre}" alt="">
                            <div class="message">
                                <a class="message-author" href="#">
                                    ${x.UsuarioRegistro}
                                            </a>
                                <span class="message-date">
                                    ${moment(x.FechaRegistro).format('dddd MMM YYYY HH:MM:SS')}
                                            </span>
                                <span class="message-content">
                                    ${x.Comentario}
                                            </span>
                            </div>
                        </div>`;
                }).join('')
            }

            _('div_comments').innerHTML = com;
        }

        function fn_removefile(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const idreq = button.parentElement.parentElement.getAttribute("data-req");
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this file",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        IdArchivo: id,
                        IdRequerimiento: idreq,
                        IdEstilo: ovariables.id
                    }, frm = new FormData();
                frm.append('ArchivoJSON', JSON.stringify(parametro));
                _Post('Requerimiento/RequerimientoMuestra/DeleteArchivoRequerimientoById_JSON', frm)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            button.parentElement.parentElement.remove();
                            swal({ title: "Good job!", text: "The file was deleted successfully", type: "success", timer: 5000 });
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_downloadfile(nombrearchivo, nombrearchivooriginal) {
            var link = document.createElement("a");
            link.href = `../Requerimiento/RequerimientoMuestra/DownLoadFileTechkPack?NombreArchivo=${nombrearchivo}&NombreArchivoOriginal=${nombrearchivooriginal}`;
            link.click();
        }

        function fn_loadfilessampledetails(data) {
            const html = data.map(x => {
                return `<tr data-id="${x.IdArchivo}" data-req="${x.IdRequerimiento}">
                            <td>
                                <button type="button" class="btn btn-xs btn-danger" onclick="app_SampleDetails.fn_removefile(this)">
                                    <i class="fa fa-trash"></i>
                                </button>
                                <button type="button" class="btn btn-xs btn-info" onclick="app_NewStyle.fn_downloadfile('${x.NombreArchivo}', '${x.NombreArchivoOriginal}')">
                                    <i class="fa fa-download"></i>
                                </button>
                            </td>
                            <td>${x.NombreArchivoOriginal}</td>
                            <td>${x.UsuarioActualizacion.toLowerCase()}</td>
                            <td>${ovariables.sample}</td>
                            <td>
                                <select class="input-sm form-control no-borders">
                                    ${fn_createtipoarchivo(ovariables.lsttipoarchivo, x.IdTipoArchivo)}
                                </select>
                            </td>
                            <td>${x.FechaActualizacion}</td>
                        </tr>`;
            }).join('');
            _('tblfilessampledetails').children[1].innerHTML = html;
        }

        function fn_createtipoarchivo(data, id) {
            const cboData = data.map(x => {
                return `<option value="${x.IdTipoArchivo}" ${id === x.IdTipoArchivo ? 'selected' : ''}>${_capitalizePhrase(x.NombreTipoArchivo)}</option>`
            }).join('');
            return cboData;
        }

        function fn_loadsampledetails(data) {
            const html = data.map(x => {
                return `<tr data-id="${x.IdRequerimientoDetalle}">
                            <td>
                                <button type="button" class="btn btn-xs btn-danger" onclick="app_SampleDetails.fn_removesampledetail(this)">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                            <td data-id="${x.IdClienteColor}">${x.NombreClienteColor}</td>
                            <td data-id="${x.IdClienteTalla}">${x.NombreClienteTalla}</td>
                            <td data-id="${x.IdClienteDireccion}">${x.Linea1}</td>
                            <td><input type="text" class="input-sm form-control no-borders _enty_sampledetails _cls_txtcantidad_muestra" value="${x.Cantidad}" maxlength="2" onkeypress="return DigitosEnteros(event, this)"></td>
                            <td><input type="text" class="input-sm form-control no-borders _enty_sampledetails _cls_txtcantidadcontra_muestra" value="${x.CantidadCM}" maxlength="2" onkeypress="return DigitosEnteros(event, this)"></td>
                            <td><input type="text" class="input-sm form-control date no-borders _enty_sampledetails" value="${x.FechaFTY}"></td>
                            <td>${x.FechaFTYUpdate}</td>
                            <td></td>
                            <td><input type="text" class="input-sm form-control date no-borders _enty_sampledetails" value="${x.FechaCliente}"></td>
                            <td>${x.CantidadDespacho}</td>
                            <td>${x.CantidadCMDespacho}</td>
                            <td>${x.MaximaFechaDespacho}</td>
                            <td>${_capitalizePhrase(x.NombreEstadoMuestra)}</td>
                        </tr>`;
            }).join('');

            // Add to table
            _('tbl_samplesdetails').children[1].innerHTML = html;
            
            // Datepicker
            $('.date').datepicker({
                todayBtn: "linked",
                keyboardNavigation: false,
                forceParse: false,
                autoclose: true,
                clearBtn: true
            });
        }

        function fn_checksampledetailduplicates(color, size, destination) {
            let bool = false;
            [..._('tbl_samplesdetails').children[1].children].forEach(x => {
                let td_color = x.children[1].textContent;
                let td_size = x.children[2].textContent;
                let td_destination = x.children[3].textContent;
                if (color === td_color && size === td_size && destination === td_destination) {
                    bool = true;
                }
            });
            return bool;
        }

        function fn_addsampledetails() {
            if (_isnotEmpty($("#cboColors").val()) && _isnotEmpty($("#cboSizes").val()) && _isnotEmpty($("#cboDestination").val())) {
                const colors = $("#cboColors").val();
                const sizes = $("#cboSizes").val();
                const destination = $("#cboDestination").val();

                let html = '';

                // Genera calculo
                colors.forEach(x => {
                    sizes.forEach(y => {
                        destination.forEach(z => {
                            let nombreclientecolor = ovariables.lstcolores.filter(o => o.IdClienteColor === x.toString())[0].NombreClienteColor;
                            let nombreclientetalla = ovariables.lsttallas.filter(o => o.IdClienteTalla === y.toString())[0].NombreClienteTalla;
                            let linea1 = ovariables.lstdestinos.filter(o => o.IdClienteDireccion === z.toString())[0].Linea1;
                            if (!fn_checksampledetailduplicates(nombreclientecolor, nombreclientetalla, linea1)) {
                                html += `<tr>
                                            <td>
                                                <button type="button" class="btn btn-xs btn-danger" onclick="app_SampleDetails.fn_removesampledetail(this)">
                                                    <i class="fa fa-trash"></i>
                                                </button>
                                            </td>
                                            <td data-id="${x}">${nombreclientecolor}</td>
                                            <td data-id="${y}">${nombreclientetalla}</td>
                                            <td data-id="${z}">${linea1}</td>
                                            <td><input type="text" class="input-sm form-control no-borders _enty_sampledetails _cls_txtcantidad_muestra" value="" maxlength="2" onkeypress="return DigitosEnteros(event, this)"></td>
                                            <td><input type="text" class="input-sm form-control no-borders _enty_sampledetails _cls_txtcantidadcontra_muestra" value="" maxlength="2" onkeypress="return DigitosEnteros(event, this)"></td>
                                            <td><input type="text" class="input-sm form-control date no-borders _enty_sampledetails" value="${ovariables.exfactory}"></td>
                                            <td></td>
                                            <td></td>
                                            <td><input type="text" class="input-sm form-control date no-borders _enty_sampledetails" value="${ovariables.indc}"></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>`;
                            }
                        });
                    });
                });

                // Add to table
                _('tbl_samplesdetails').children[1].innerHTML += html;
                
                // Datepicker
                $('.date').datepicker({
                    todayBtn: "linked",
                    keyboardNavigation: false,
                    forceParse: false,
                    autoclose: true,
                    clearBtn: true
                });

            } else {
                swal({ title: "Warning", text: "You have to select at least 1 color, size and destination", type: "warning", timer: 5000 });
            }
        }

        function fn_removesampledetail(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this programming",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                if (id !== null) {
                    // Si no es nulo se va a la db
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            IdRequerimientoDetalle: id,
                            IdRequerimiento: ovariables.id
                        }, frm = new FormData();
                    frm.append('RequerimientoDetalleJSON', JSON.stringify(parametro));
                    _Post('Requerimiento/RequerimientoMuestra/DeleteRequerimientoMuestraDetalleById_JSON', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                button.parentElement.parentElement.remove();
                                swal({ title: "Good job!", text: "The programming was deleted successfully", type: "success", timer: 5000 });
                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });
                } else {
                    button.parentElement.parentElement.remove();
                    swal({ title: "Good job!", text: "The programming was deleted successfully", type: "success", timer: 5000 });
                }
            });
        }

        function fn_createcolor(data) {
            const cboData = data.map(x => {
                return `<option value="${x.IdClienteColor}">${x.NombreClienteColor}</option>`
            }).join('');
            _('cboColors').innerHTML = `${cboData}`;
        }

        function fn_createsize(data) {
            const cboData = data.map(x => {
                return `<option value="${x.IdClienteTalla}">${x.NombreClienteTalla}</option>`
            }).join('');
            _('cboSizes').innerHTML = `${cboData}`;
        }

        function fn_createdestination(data) {
            const cboData = data.map(x => {
                return `<option value="${x.IdClienteDireccion}">${x.Linea1}</option>`
            }).join('');
            _('cboDestination').innerHTML = `${cboData}`;
        }

        function fn_checktable() {
            let bool = true;
            [...document.getElementsByClassName('_enty_sampledetails')].forEach(x => {
                if (_isEmpty(x.value)) {
                    bool = false;
                    x.style = 'border: 1px solid red !important;color: red;';
                } else {
                    x.style = '';
                }
            });
            return bool;
        }

        function fn_savefile() {
            let err = function (__err) { console.log('err', __err) }, frm = new FormData();
            const row = document.querySelectorAll(`#tbl_samples tbody tr[${ovariables.id !== 0 ? 'data-id' : 'data-guid'}="${ovariables.id !== 0 ? ovariables.id : ovariables.guid}"]`)[0];
            const RequerimientoJSON = {
                IdRequerimiento: ovariables.id,
                IdTipoMuestraxCliente: row.children[2].children[0].value,
                Version: row.children[3].textContent,
                ExFactoryInicial: row.children[4].textContent,
                FechaInDC: row.children[5].textContent,
                IdCliente: ovariables.idcliente,
                IdEstilo: ovariables.idestilo,
                IdGrupoPersonal: utilindex.idgrupocomercial,
                Estado: 1,
                IdReqTemporalGuid: ovariables.guid
            };
            let RequerimientoDetalleJSON = [];
            let RequerimientoArchivoJSON = [{
                IdArchivo: 0,
                IdRequerimiento: ovariables.id,
                IdTipoArchivo: ovariables.lsttipoarchivo[0].IdTipoArchivo,
                IdEstilo: ovariables.idestilo,
                ActualizarArchivo: ovariables.actualizararchivo
            }];
            frm.append('RequerimientoJSON', JSON.stringify(RequerimientoJSON));
            frm.append('RequerimientoDetalleJSON', JSON.stringify(RequerimientoDetalleJSON));
            frm.append('RequerimientoArchivoJSON', JSON.stringify(RequerimientoArchivoJSON));
            frm.append('ArchivoTechPack', $("#inputFileSampleDetails")[0].files[0]);
            _Post('Requerimiento/RequerimientoMuestra/SaveRequerimientoWithDetalle', frm)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta.estado === 'success') {
                        swal({
                            title: "Good job!",
                            text: "The file was added successfully",
                            type: "success",
                            timer: 5000,
                            showCancelButton: false,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        });
                        // Carga tabla
                        fn_loadsampledetails(CSVtoJSON(JSON.parse(orpta.data).ListaRequerimientoDetalleCSV));
                        fn_loadfilessampledetails(CSVtoJSON(JSON.parse(orpta.data).ListaArchivosCSV));
                        app_NewStyle.req_ini();
                        // Actualiza archivo
                        ovariables.actualizararchivo = 0;
                        // Actualiza accion y id
                        ovariables.id = CSVtoJSON(JSON.parse(orpta.data).RequerimientoCSV)[0].IdRequerimiento;
                        ovariables.accion = 'edit';
                        ovariables.guid = '';
                        // Update event
                        _('modal_title_SampleDetails').innerHTML = 'Edit Sample Details';
                        _('btnSaveSampleDetails').innerHTML = `<span class="fa fa-save"></span> Update`;
                        _('btnSaveSampleDetails').removeEventListener('click', fn_savesampledetails);
                        _('btnSaveSampleDetails').addEventListener('click', fn_editsampledetails);
                    } else {
                        swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error", timer: 5000 });
                    }
                }, (p) => { err(p); });
        }

        function fn_get_datalabel_activo_tabs() {
            let datalabel_activo = Array.from(_('ul_tabs_det_req').getElementsByClassName('li_tab_det_req')).filter(x => x.classList.value.indexOf('active') >= 0).map(x => {
                return x.getAttribute('data-label');
            }).join('');

            return datalabel_activo;
        }

        function fn_savesampledetails() {
            //if (_('tbl_samplesdetails').children[1].children.length > 0) {
                const req_enty = fn_checktable();
                if (req_enty) {
                    let datalabel_tab_activo = fn_get_datalabel_activo_tabs();
                    if (datalabel_tab_activo === 'cantidad') {
                        let arr_filas = Array.from(_('tbody_detalle_requerimiento').rows);

                        if (arr_filas.length <= 0) {
                            swal({ title: "Warning", text: "You have to add at least add 1 programming", type: "warning", timer: 5000 });
                            return false;
                        }
                    }
                    swal({
                        html: true,
                        title: "Are you sure you want to create this programming?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                            const row = document.querySelectorAll(`#tbl_samples tbody tr[${ovariables.id !== 0 ? 'data-id' : 'data-guid'}="${ovariables.id !== 0 ? ovariables.id : ovariables.guid}"]`)[0];
                            let datapar = row.getAttribute('data-par');
                            let estado_muestra = _par(datapar, 'Estado');
                        const RequerimientoJSON = {
                            IdRequerimiento: ovariables.id,
                            IdTipoMuestraxCliente: row.children[2].children[0].value,
                            Version: row.children[3].textContent,
                            ExFactoryInicial: row.getElementsByClassName('cls_fecha_exfactoryinicial')[0].value, //row.children[4].textContent,
                            FechaInDC: row.getElementsByClassName('cls_fecha_indc')[0].value, //row.children[5].textContent,
                            IdCliente: ovariables.idcliente,
                            IdEstilo: ovariables.idestilo,
                            IdGrupoPersonal: utilindex.idgrupocomercial,
                            Estado: estado_muestra,
                            IdReqTemporalGuid: ovariables.guid
                        };
                        let RequerimientoDetalleJSON = [];
                        [...document.querySelectorAll('#tbl_samplesdetails tbody tr')].forEach(x => {
                            let json = {};
                            json["IdRequerimientoDetalle"] = x.getAttribute("data-id") !== null ? x.getAttribute("data-id") : 0;
                            json["IdRequerimiento"] = ovariables.id;
                            json["IdClienteColor"] = x.children[1].getAttribute("data-id");
                            json["IdClienteTalla"] = x.children[2].getAttribute("data-id");
                            json["IdClienteDireccion"] = x.children[3].getAttribute("data-id");
                            json["Cantidad"] = x.children[4].children[0].value;
                            json["CantidadCM"] = x.children[5].children[0].value;
                            json["FechaFTY"] = x.children[6].children[0].value;
                            json["FechaFTYUpdate"] = x.children[7].textContent;
                            json["FechaCliente"] = x.children[9].children[0].value;
                            RequerimientoDetalleJSON.push(json);
                        });
                        let RequerimientoArchivoJSON = [];
                        [...document.querySelectorAll('#tblfilessampledetails tbody tr')].forEach(x => {
                            let json = {};
                            json["IdArchivo"] = x.getAttribute("data-id");
                            json["IdRequerimiento"] = ovariables.id;
                            json["IdTipoArchivo"] = x.children[4].children[0].value !== "" ? x.children[4].children[0].value : ovariables.lsttipoarchivo[0].IdTipoArchivo;
                            json["IdEstilo"] = ovariables.idestilo;
                            json["ActualizarArchivo"] = 0;
                            RequerimientoArchivoJSON.push(json);
                        });
                        frm.append('RequerimientoJSON', JSON.stringify(RequerimientoJSON));
                        frm.append('RequerimientoDetalleJSON', JSON.stringify(RequerimientoDetalleJSON));
                        frm.append('RequerimientoArchivoJSON', JSON.stringify(RequerimientoArchivoJSON));
                        frm.append('ArchivoTechPack', '');
                        _Post('Requerimiento/RequerimientoMuestra/SaveRequerimientoWithDetalle', frm, true)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({
                                        title: "Good job!",
                                        text: "The programming was created successfully",
                                        type: "success",
                                        timer: 5000,
                                        showCancelButton: false,
                                        confirmButtonColor: "#1c84c6",
                                        confirmButtonText: "OK",
                                        closeOnConfirm: false
                                    });
                                    // Carga tabla
                                    fn_loadsampledetails(CSVtoJSON(JSON.parse(orpta.data).ListaRequerimientoDetalleCSV));
                                    fn_loadfilessampledetails(CSVtoJSON(JSON.parse(orpta.data).ListaArchivosCSV));
                                    app_NewStyle.req_ini();
                                    // Actualiza archivo
                                    ovariables.actualizararchivo = 0;
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error", timer: 5000 });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "Complete the required fields", text: "The fields in red", type: "error", timer: 5000 });
                }
            //} else {
            //    swal({ title: "Warning", text: "You have to add at least add 1 programming", type: "warning", timer: 5000 });
            //}
        }

        function fn_editsampledetails() {
            //if (_('tbl_samplesdetails').children[1].children.length > 0) {
                const req_enty = fn_checktable();
                if (req_enty) {
                    let datalabel_tab_activo = fn_get_datalabel_activo_tabs();
                    if (datalabel_tab_activo === 'cantidad') {
                        let arr_filas = Array.from(_('tbody_detalle_requerimiento').rows);

                        if (arr_filas.length <= 0) {
                            swal({ title: "Warning", text: "You have to add at least add 1 programming", type: "warning", timer: 5000 });
                            return false;
                        }
                    }
                    swal({
                        html: true,
                        title: "Are you sure you want to update this programming?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                            const row = document.querySelectorAll(`#tbl_samples tbody tr[${ovariables.id !== 0 ? 'data-id' : 'data-guid'}="${ovariables.id !== 0 ? ovariables.id : ovariables.guid}"]`)[0];
                            let datapar = row.getAttribute('data-par');
                            let estado_muestra = _par(datapar, 'Estado');
                        const RequerimientoJSON = {
                            IdRequerimiento: ovariables.id,
                            IdTipoMuestraxCliente: row.children[2].children[0].value,
                            Version: row.children[3].textContent,
                            ExFactoryInicial: row.getElementsByClassName('cls_fecha_exfactoryinicial')[0].value, //row.children[4].textContent,
                            FechaInDC: row.getElementsByClassName('cls_fecha_indc')[0].value, //row.children[5].textContent,
                            IdCliente: ovariables.idcliente,
                            IdEstilo: ovariables.idestilo,
                            IdGrupoPersonal: utilindex.idgrupocomercial,
                            Estado: estado_muestra,
                            IdReqTemporalGuid: ovariables.guid
                        };
                        let RequerimientoDetalleJSON = [];
                        [...document.querySelectorAll('#tbl_samplesdetails tbody tr')].forEach(x => {
                            let json = {};
                            json["IdRequerimientoDetalle"] = x.getAttribute("data-id") !== null ? x.getAttribute("data-id") : 0;
                            json["IdRequerimiento"] = ovariables.id;
                            json["IdClienteColor"] = x.children[1].getAttribute("data-id");
                            json["IdClienteTalla"] = x.children[2].getAttribute("data-id");;
                            json["IdClienteDireccion"] = x.children[3].getAttribute("data-id");
                            json["Cantidad"] = x.children[4].children[0].value;
                            json["CantidadCM"] = x.children[5].children[0].value;
                            json["FechaFTY"] = x.children[6].children[0].value;
                            json["FechaFTYUpdate"] = x.children[7].textContent;
                            json["FechaCliente"] = x.children[9].children[0].value;
                            RequerimientoDetalleJSON.push(json);
                        });
                        let RequerimientoArchivoJSON = [];
                        [...document.querySelectorAll('#tblfilessampledetails tbody tr')].forEach(x => {
                            let json = {};
                            json["IdArchivo"] = x.getAttribute("data-id");
                            json["IdRequerimiento"] = ovariables.id;
                            json["IdTipoArchivo"] = x.children[4].children[0].value !== "" ? x.children[4].children[0].value : 51;
                            json["IdEstilo"] = ovariables.idestilo;
                            json["ActualizarArchivo"] = 0;
                            RequerimientoArchivoJSON.push(json);
                        });
                        frm.append('RequerimientoJSON', JSON.stringify(RequerimientoJSON));
                        frm.append('RequerimientoDetalleJSON', JSON.stringify(RequerimientoDetalleJSON));
                        frm.append('RequerimientoArchivoJSON', JSON.stringify(RequerimientoArchivoJSON));
                        frm.append('ArchivoTechPack', '');
                        _Post('Requerimiento/RequerimientoMuestra/SaveRequerimientoWithDetalle', frm, true)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({
                                        title: "Good job!",
                                        text: "The programming was updated successfully",
                                        type: "success",
                                        timer: 5000,
                                        showCancelButton: false,
                                        confirmButtonColor: "#1c84c6",
                                        confirmButtonText: "OK",
                                        closeOnConfirm: false
                                    });
                                    // Carga tabla
                                    fn_loadsampledetails(CSVtoJSON(JSON.parse(orpta.data).ListaRequerimientoDetalleCSV));
                                    fn_loadfilessampledetails(CSVtoJSON(JSON.parse(orpta.data).ListaArchivosCSV));
                                    app_NewStyle.req_ini();
                                    // Actualiza archivo
                                    ovariables.actualizararchivo = 0;
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error", timer: 5000 });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "Complete the required fields", text: "The fields in red", type: "error", timer: 5000 });
                }
            //} else {
            //    swal({ title: "Warning", text: "You have to add at least add 1 programming", type: "warning", timer: 5000 });
            //}
        }

        function _cargar_tabcomentarios_comentarios(idrequerimiento) {
            //$('.iboxlistarequerimientos').children('.ibox-content').toggleClass('sk-loading');
            let err = function (__err) { console.log('err', __err) }
            let parametro = idrequerimiento;

            _Get('Requerimiento/RequerimientoMuestra/GetListaRequerimientoMuestraComentarioByIdRequerimiento_JSON?IdRequerimiento=' + parametro)
                .then((resultado) => {
                    let rpta = (resultado !== '') ? resultado : {};
                    if (rpta !== null) {
                        lstRequerimientoComentarios = (rpta !== '') ? CSVtoJSON(rpta) : [];
                        _cargarDetalle_ComentariosxIdRequerimiento(idrequerimiento, lstRequerimientoComentarios);
                    }
                }, (p) => { err(p); });
            //$('.iboxlistarequerimientos').children('.ibox-content').toggleClass('sk-loading');
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_removesampledetail: fn_removesampledetail,
            fn_removefile: fn_removefile,
            fn_downloadfile: fn_downloadfile
        }
    }
)(document, 'panelEncabezado_SampleDetails');
(
    function ini() {
        app_SampleDetails.load();
        app_SampleDetails.req_ini();
    }
)();