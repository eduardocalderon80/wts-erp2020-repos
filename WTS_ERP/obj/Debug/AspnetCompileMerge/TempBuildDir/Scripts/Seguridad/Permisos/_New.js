var appPermisosNew = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            lstpersonal: [],
            lstgrupopersonal: [],
            lstrol: [],
            lstfuncion: [],
            lstaccion: [],
            lsttipo: [],
            lstseleccion: [],
            lstpermisos: []
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Se añade focus para evitar abrir nuevo modal con enter
            $("#divContenido").focus();

            // Collapse Menu
            _collapseMenu();

            _initializeIboxTools();

            // Events
            _('btnNewPermisoCreate').addEventListener('click', fn_save);
            _('cboModalTipo').addEventListener('change', fn_change_type);
            
            // Se obtiene parametro si tuviera
            const par = _('newpermission_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                if (ovariables.accion === 'edit') {
                    _('modal_title_NewPermission').innerHTML = 'Edit Permission';
                    _('btnNewPermisoCreate').innerHTML = `<span class="fa fa-save"></span> Update`;
                } else {
                    _('modal_title_NewPermission').innerHTML = 'New Permission';
                    _('btnNewPermisoCreate').innerHTML = `<span class="fa fa-save"></span> Save`;
                }
            }

            // Checkbox usuario
            fn_icheck_usuario();
        }

        function fn_change_type(e) {
            const val = e.target.value;
            const div = _('div_group');
            if (val === 'OTHERGROUP') {
                div.innerHTML = `<div class="col-sm-12">
                                    <div class="has-float-label">
                                        <select class="form-control _enty_modal" id="cboModalGrupoPersonal" data-required="true" data-min="1" data-max="254" data-id="IdGrupoPersonal"></select>
                                        <label class="select2-label" for="cboModalGrupoPersonal">Group</label>
                                    </div>
                                </div>`;
                _('cboModalGrupoPersonal').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lstgrupopersonal, 'IdGrupoPersonal', 'Codigo');
                $("#cboModalGrupoPersonal").select2({ width: '100%', dropdownParent: $("#modal_NewPermission") });
            } else {
                div.innerHTML = ``;
            }
        }

        function fn_icheck_usuario() {
            $('.i-check-user').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                const div = _('div_checkbox_usuario');
                const id = $(this).data('id');
                if (id > 0) {
                    div.innerHTML = `<div class="has-float-label">
                                        <select class="form-control _enty_modal" id="cboModalPersonal" data-required="true" data-min="1" data-max="254" data-id="IdPersonal"></select>
                                        <label class="select2-label" for="cboModalPersonal">Person</label>
                                    </div>`;
                    _('cboModalPersonal').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lstpersonal, 'IdPersonal', 'NombrePersonal');
                    $("#cboModalPersonal").select2({ width: '100%', dropdownParent: $("#modal_NewPermission") });
                    //const filter = ovariables.lsttipo.filter(x => x.codcatalogo !== 'OWNGROUP');
                    _('cboModalTipo').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lsttipo, 'codcatalogo', 'nombre');
                } else {
                    div.innerHTML = `<div class="has-float-label">
                                        <select class="form-control _enty_modal" id="cboModalRol" data-required="true" data-min="1" data-max="254" data-id="IdRol"></select>
                                        <label class="select2-label" for="cboModalRol">Rol</label>
                                    </div>`;
                    _('cboModalRol').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lstrol, 'IdRol', 'Nombre');
                    $("#cboModalRol").select2({ width: '100%', dropdownParent: $("#modal_NewPermission") });
                    //const filter = ovariables.lsttipo.filter(x => x.codcatalogo !== 'OWNUSER');
                    _('cboModalTipo').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lsttipo, 'codcatalogo', 'nombre');
                }
            });
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { Id: ovariables.id };
            _Get('Seguridad/Permisos/Get_Combos?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstpersonal = rpta.lstpersonal !== '' ? JSON.parse(rpta.lstpersonal) : [];
                        ovariables.lstgrupopersonal = rpta.lstgrupopersonal !== '' ? JSON.parse(rpta.lstgrupopersonal) : [];
                        ovariables.lstrol = rpta.lstrol !== '' ? JSON.parse(rpta.lstrol) : [];
                        ovariables.lstfuncion = rpta.lstfuncion !== '' ? JSON.parse(rpta.lstfuncion) : [];
                        ovariables.lstaccion = rpta.lstaccion !== '' ? JSON.parse(rpta.lstaccion) : [];
                        ovariables.lsttipo = rpta.lsttipo !== '' ? JSON.parse(rpta.lsttipo) : [];
                        ovariables.lstpermisos = rpta.lstpermisos !== '' ? JSON.parse(rpta.lstpermisos) : [];

                        // Crear checkbox
                        fn_create_checkbox(ovariables.lstaccion);

                        // Crear combos
                        _('cboModalFuncion').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lstfuncion, 'IdFuncion', 'Funcion');

                        // Select2
                        $("#cboColors, #cboModalFuncion").select2({
                            width: '100%',
                            dropdownParent: $("#modal_NewPermission")
                        });

                        // Seleccionar primer tipo usuario
                        if (!_oisEmpty(ovariables.lstpermisos)) {
                            const rol = ovariables.lstpermisos.IdRol;
                            rol > 0 ? $('.i-check-user').eq(0).iCheck('check') : $('.i-check-user').eq(1).iCheck('check');
                        } else {
                            $('.i-check-user').eq(0).iCheck('check');
                        }

                        // Edit
                        fn_edit_list(ovariables.lstpermisos);
                    }
                }, (p) => { err(p); });
        }

        function fn_edit_list(data) {
            if (!_oisEmpty(data)) {
                ovariables.id = data.IdPermiso;
                ovariables.lstseleccion = data.Accion !== '' ? JSON.parse(data.Accion) : [];
                data.IdPersonal > 0 ? $("#cboModalPersonal").select2("val", data.IdPersonal) : null;
                data.IdRol > 0 ? $("#cboModalRol").select2("val", data.IdRol) : null;
                $("#cboModalFuncion").select2("val", data.IdFuncion);
                _('txtDescription').value = data.Descripcion;
                _('cboModalTipo').value = data.CodCatalogo_Tipo;
                _dispatchEvent('cboModalTipo', 'change');
                data.IdGrupoPersonal > 0 ? $("#cboModalGrupoPersonal").select2("val", data.IdGrupoPersonal) : null;
                fn_mark_checkbox(data.Accion !== '' ? JSON.parse(data.Accion) : []);
            }
        }

        function fn_mark_checkbox(data) {
            if (data.length > 0) {
                data.forEach(x => {
                    $(`input[data-id="${x.codigo}"]`).prop("checked", true);
                });
                $('.i-check').iCheck('update');
            }
        }

        function fn_create_checkbox(data) {
            if (data.length > 0) {
                const div = _('div_checkbox_permiso');
                const html = data.map(x => {
                    //return `<div class="${x.codcatalogo === 'DOWN' ? 'col-sm-3' : 'col-sm-2'}" style="padding-right: 0;">
                    //            <div class="form-control no-padding-sides" style="border: 0;">
                    //                <input class="i-check" type="checkbox" name="permisos_checkbox" data-id="${x.codcatalogo}">
                    //                <label style="font-size: 12px;">${x.nombre}</label>
                    //            </div>
                    //        </div>`;
                    return `<div class="col-sm-2" style="padding-right: 0;">
                                <div class="form-control no-padding-sides" style="border: 0;">
                                    <input class="i-check" type="checkbox" name="permisos_checkbox" data-id="${x.codcatalogo}">
                                    <label style="font-size: 12px;">${x.nombre}</label>
                                </div>
                            </div>`;
                }).join("");
                div.innerHTML = html;
                // iCheck
                fn_icheck_select();
            }
        }

        function fn_icheck_select() {
            $('.i-check').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                let bool = ovariables.lstseleccion.filter(x => x.codigo === $(this).data('id')).length;
                if (bool === 0) {
                    let IdHidden = { codigo: $(this).data('id') };
                    ovariables.lstseleccion.push(IdHidden);
                } else {
                    let filter = ovariables.lstseleccion.filter(x => x.codigo !== $(this).data('id'));
                    ovariables.lstseleccion = filter;
                }
            });
        }

        function fn_save() {
            const req_enty = _required({ id: 'panelEncabezado_NewPermission', clase: '_enty_modal' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Are you sure?",
                    text: "You will save this permission",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) };
                    let parametro = _getParameter({ id: 'panelEncabezado_NewPermission', clase: '_enty_modal' });
                    parametro["IdPermiso"] = ovariables.id;
                    parametro["Tipo"] = ovariables.accion;
                    parametro["Accion"] = JSON.stringify(ovariables.lstseleccion);
                    let frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('Seguridad/Permisos/Insert_Permisos', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                _('btnPermisoRefresh').click();
                                $("#modal_NewPermission").modal("hide");
                                swal({ title: "Good job!", text: "The permission was saved successfully", type: "success", timer: 5000 });
                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
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
)(document, 'panelEncabezado_NewPermission');
(
    function ini() {
        appPermisosNew.load();
        appPermisosNew.req_ini();
    }
)();