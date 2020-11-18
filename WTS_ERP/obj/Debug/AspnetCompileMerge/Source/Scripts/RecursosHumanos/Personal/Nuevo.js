﻿var app_Personal_Nuevo = (
    function (d, idpadre) {
        var ovariables = {
            idpersonal: 0
            , accion: ''
            , ruta: ''
            , imagen: 0

            , lst_area: []
            , lst_subarea: []
            , lst_equipo: []
            , lst_cargo: []
            , lst_genero: []
            , lst_region: []
            , lst_provincia: []
            , lst_distrito: []
            , lst_institucioneducativa: []
            , lst_regimeninstitucion: []
            , lst_pension: []
            , lst_estadocivil: []
            , lst_tipovivienda: []
            , lst_gruposanguineo: []
            , lst_licenciaconducir: []
            , lst_gradoinstruccion: []
            , lst_respuesta: []
            , lst_personal: []
        }

        function load() {
            _initializeIboxTools();
            _initializeDatepicker();
            //let par = _('txt_par').value;
            //if (!_isEmpty(par)) { ovariables.idpersonal = _par(par, 'idpersonal'); }

            _('btnSave').addEventListener('click', fn_save);
            _('btn_retornar').addEventListener('click', fn_return);
            _('btnAddModal').addEventListener('click', fn_agregar);

            $('#_Region').on('change', fn_load_provincia);
            $('#_Provincia').on('change', fn_load_distrito);
            $('#_TienePasaporte').on('change', fn_change_pasaporte);
            $('#_Vivienda').on('change', fn_change_tipo_vivienda);

            $('#cbo_edit_area').on('change', req_change_area);
            $('#cbo_edit_sub_area').on('change', req_change_sub_area);

             let elem = document.querySelector('.js-switch');
            let init = new Switchery(elem);
            _('lusuarioasistencia').click();

            // Llena años
            const currentYear = (new Date()).getFullYear();
            const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
            const cboRegion = range(currentYear, currentYear - 50, -1).map(x => {
                return `<option value="${x}">${x}</option>`
            }).join('');
            _('_AnioEgreso').innerHTML = `<option value=''>Seleccione Año</option><option value='0'>En Curso</option>${cboRegion}`;
        }



        function req_ini() {
            const err = function (__err) { console.log('err', __err) },
                parametro = { idpersonal: ovariables.idpersonal };
            _Get('RecursosHumanos/Personal/Personal_GetData?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    const rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {

                        ovariables.lst_area = rpta[0].area !== '' ? JSON.parse(rpta[0].area) : [];
                        ovariables.lst_subarea = rpta[0].subarea !== '' ? JSON.parse(rpta[0].subarea) : [];
                        ovariables.lst_equipo = rpta[0].equipo !== '' ? JSON.parse(rpta[0].equipo) : [];
                        ovariables.lst_cargo = rpta[0].cargo !== '' ? JSON.parse(rpta[0].cargo) : [];
                        ovariables.lst_genero = rpta[0].genero !== '' ? JSON.parse(rpta[0].genero) : [];
                        ovariables.lst_region = rpta[0].region !== '' ? JSON.parse(rpta[0].region) : [];
                        ovariables.lst_provincia = rpta[0].provincia !== '' ? JSON.parse(rpta[0].provincia) : [];
                        ovariables.lst_distrito = rpta[0].distrito !== '' ? JSON.parse(rpta[0].distrito) : [];
                        ovariables.lst_institucioneducativa = rpta[0].institucioneducativa !== '' ? JSON.parse(rpta[0].institucioneducativa) : [];
                        ovariables.lst_regimeninstitucion = rpta[0].regimeninstitucion !== '' ? JSON.parse(rpta[0].regimeninstitucion) : [];
                        ovariables.lst_pension = rpta[0].pension !== '' ? JSON.parse(rpta[0].pension) : [];
                        ovariables.lst_estadocivil = rpta[0].estadocivil !== '' ? JSON.parse(rpta[0].estadocivil) : [];
                        ovariables.lst_tipovivienda = rpta[0].tipovivienda !== '' ? JSON.parse(rpta[0].tipovivienda) : [];
                        ovariables.lst_gruposanguineo = rpta[0].gruposanguineo !== '' ? JSON.parse(rpta[0].gruposanguineo) : [];
                        ovariables.lst_licenciaconducir = rpta[0].licenciaconducir !== '' ? JSON.parse(rpta[0].licenciaconducir) : [];
                        ovariables.lst_gradoinstruccion = rpta[0].gradoinstruccion !== '' ? JSON.parse(rpta[0].gradoinstruccion) : [];
                        ovariables.lst_respuesta = rpta[0].respuesta !== '' ? JSON.parse(rpta[0].respuesta) : [];
                        ovariables.lst_personal = rpta[0].personal !== '' ? JSON.parse(rpta[0].personal) : [];

                        fn_load_respuesta();
                        fn_load_genero();
                        fn_load_region();
                        fn_load_provincia();
                        fn_load_distrito();
                        fn_load_licencia_conducir();
                        fn_load_institucion_educativa();
                        fn_load_regimen_institucion();
                        fn_load_area();
                        fn_load_sub_area();
                        fn_load_cargo();
                        fn_load_equipo();
                        fn_load_pension();
                        fn_load_estado_civil();
                        fn_load_tipo_vivienda();
                        fn_load_estado_civil_modal();
                        fn_load_grado_instruccion_modal();
                        fn_load_grupo_sanguineo();
                        fn_crearfoto();
                    }

                    //fn_load_personal();

                    //_rules({ clase: '_enty_grabar', id: 'app_Personal_Nuevo' });
                }, (p) => { err(p); });
        }

        function fn_load_genero() {
            let lst_genero = ovariables.lst_genero,
               cbo_genero = `<option value=''>Seleccione Género</option>`;

            if (lst_genero.length > 0) { lst_genero.forEach(x=> { cbo_genero += `<option value='${x.codigo}'>${x.catalogo}</option>`; }); }

            _('_Genero').innerHTML = cbo_genero;
        }

        function fn_load_region() {
            let lst_region = ovariables.lst_region
                , cbo_region = `<option value=''>Seleccione Departamento</option>`;

            if (lst_region.length > 0) { lst_region.forEach(x=> { cbo_region += `<option value='${x.idregion}'>${x.region}</option>`; }); }

            _('_Region').innerHTML = cbo_region;

        }

        function fn_load_provincia() {
            let lst_provincia = ovariables.lst_provincia
                , idregion = _('_Region').value
                , cbo_provincia = `<option value=''>Seleccione Provincia</option>`;

            if (lst_provincia.length > 0) {
                cbo_provincia += lst_provincia.filter(x=>x.idregion === idregion).map(x=> { return `<option value='${x.idprovincia}'>${x.provincia}</option>` }).join('');
            }

            _('_Provincia').innerHTML = cbo_provincia;
        }

        function fn_load_distrito() {
            let lst_distrito = ovariables.lst_distrito
                , idregion = _('_Region').value, idprovincia = _('_Provincia').value
                , cbo_distrito = `<option value=''>Seleccione Distrito</option>`;

            if (lst_distrito.length > 0) {
                cbo_distrito += lst_distrito.filter(x=>x.idregion === idregion && x.idprovincia === idprovincia).map(x=> { return `<option value='${x.iddistrito}'>${x.distrito}</option>` }).join('');
            }

            _('_Distrito').innerHTML = cbo_distrito;
        }

        function fn_load_licencia_conducir() {
            let lst_licenciaconducir = ovariables.lst_licenciaconducir
                , cbo_licenciaconducir = ``;
            lst_licenciaconducir.forEach(x=> { cbo_licenciaconducir += `<option value='${x.codigolicencia}'>${x.licencia}</option>`; });
            _('_Brevete').innerHTML = cbo_licenciaconducir;
        }

        function fn_load_respuesta() {
            let lst_respuesta = ovariables.lst_respuesta
                , cbo_pasaporte = ``;
            lst_respuesta.forEach(x=> { cbo_pasaporte += `<option value='${x.codigo}'>${x.catalogo}</option>`; });
            _('_TienePasaporte').innerHTML = cbo_pasaporte;
            _('_EstudiosPeru').innerHTML = cbo_pasaporte;
        }

        function fn_load_institucion_educativa() {
            let lst_institucioneducativa = ovariables.lst_institucioneducativa
                , cbo_institucioneducativa = `<option value=''>Seleccione Tipo</option>`;
            lst_institucioneducativa.forEach(x=> { cbo_institucioneducativa += `<option value='${x.codigoinstitucioneducativa}'>${x.institucioneducativa}</option>`; });
            _('_TipoInstitucionEducativa').innerHTML = cbo_institucioneducativa;
        }

        function fn_load_regimen_institucion() {
            let lst_regimeninstitucion = ovariables.lst_regimeninstitucion
                , cbo_regimeninstitucion = `<option value=''>Seleccione Regimen</option>`;
            lst_regimeninstitucion.forEach(x=> { cbo_regimeninstitucion += `<option value='${x.codigoregimeninstitucion}'>${x.regimeninstitucion}</option>`; });
            _('_RegimenInstitucion').innerHTML = cbo_regimeninstitucion;
        }

        function fn_load_area() {
            let arr_area = ovariables.lst_area
                , cbo_edit_area = `<option value='0'>Seleccione Área</option>`;
            //, cbo_edit_area = ``;

            if (arr_area.length > 0) { arr_area.forEach(x=> { cbo_edit_area += `<option value='${x.idarea}'>${x.area}</option>`; }); }

            _('cbo_edit_area').innerHTML = cbo_edit_area;
            //$('#cbo_edit_area').select2();
        }

        function fn_load_sub_area() {
            let arr_sub_area = ovariables.lst_subarea, idarea = _('cbo_edit_area').value,
                resultado_sub_area = []
                , cbo_edit_sub_area = `<option value='0'>Seleccione Sub Área</option>`
            //, cbo_edit_sub_area = ``;

            resultado_sub_area = arr_sub_area.filter(x=> x.idarea.toString() === idarea);

            if (resultado_sub_area.length > 0) { resultado_sub_area.forEach(x=> { cbo_edit_sub_area += `<option value='${x.idsubarea}'>${x.subarea}</option>`; }); }

            _('cbo_edit_sub_area').innerHTML = cbo_edit_sub_area;
            //$('#cbo_edit_sub_area').select2();
        }

        function fn_load_cargo() {
            let arr_cargo = ovariables.lst_cargo, idarea = _('cbo_edit_area').value
                , idsubarea = _('cbo_edit_sub_area').value
                , resultado_cargo = []
                , cbo_edit_cargo = `<option value='0'>Seleccione Cargo</option>`
            //, cbo_edit_cargo = ``;

            resultado_cargo = arr_cargo.filter(x =>
                (x.idarea.toString() === idarea) &&
                (x.idsubarea.toString() === idsubarea)
            );

            if (resultado_cargo.length > 0) { resultado_cargo.forEach(x=> { cbo_edit_cargo += `<option value='${x.idcargo}'>${x.cargo}</option>`; }); }

            _('cbo_edit_cargo').innerHTML = cbo_edit_cargo;
            //$('#cbo_edit_cargo').select2();
        }

        function fn_load_equipo() {
            let arr_equipo = ovariables.lst_equipo, idarea = _('cbo_edit_area').value
                , idsubarea = _('cbo_edit_sub_area').value
                , resultado_equipo = []
                , cbo_edit_equipo = `<option value='0'>Seleccione Equipo</option>`;
            //, cbo_edit_equipo = ``;

            resultado_equipo = arr_equipo.filter(x =>
                (x.idarea.toString() === idarea) &&
                (x.idsubarea.toString() === idsubarea)
            );

            if (resultado_equipo.length > 0) { resultado_equipo.forEach(x=> { cbo_edit_equipo += `<option value='${x.idequipo}'>${x.equipo}</option>`; }); }

            _('cbo_edit_equipo').innerHTML = cbo_edit_equipo;
            //$('#cbo_edit_equipo').select2();
        }

        function fn_load_pension() {
            let lst_pension = ovariables.lst_pension
                , cbo_pension = `<option value=''>Seleccione Pensión</option>`;
            lst_pension.forEach(x=> { cbo_pension += `<option value='${x.codigopension}'>${x.pension}</option>`; });
            _('_Pension').innerHTML = cbo_pension;
        }

        function fn_load_estado_civil() {
            let lst_estadocivil = ovariables.lst_estadocivil
                           , cbo_estadocivil = `<option value=''>Seleccione Estado Civil</option>`;
            lst_estadocivil.forEach(x=> { cbo_estadocivil += `<option value='${x.codigoestadocivil}'>${x.estadocivil}</option>`; });
            _('_EstadoCivil').innerHTML = cbo_estadocivil;
        }

        function fn_load_tipo_vivienda() {
            let lst_tipovivienda = ovariables.lst_tipovivienda
                           , cbo_tipovivienda = `<option value=''>Seleccione Tipo Vivienda</option>`;
            lst_tipovivienda.forEach(x=> { cbo_tipovivienda += `<option value='${x.codigovivienda}'>${x.vivienda}</option>`; });
            _('_Vivienda').innerHTML = cbo_tipovivienda;
        }

        function fn_load_estado_civil_modal() {
            let lst_estadocivil = ovariables.lst_estadocivil
                           , cbo_estadocivil = ``;
            lst_estadocivil.forEach(x=> { cbo_estadocivil += `<option value='${x.codigoestadocivil}'>${x.estadocivil}</option>`; });
            _('_EstadoCivilModal').innerHTML = cbo_estadocivil;
        }

        function fn_load_grado_instruccion_modal() {
            let lst_gradoinstruccion = ovariables.lst_gradoinstruccion
                           , cbo_gradoinstruccion = ``;
            lst_gradoinstruccion.forEach(x=> { cbo_gradoinstruccion += `<option value='${x.codigogradoinstruccion}'>${x.gradoinstruccion}</option>`; });
            _('_GradoModal').innerHTML = cbo_gradoinstruccion;
        }

        function fn_load_grupo_sanguineo() {
            let lst_gruposanguineo = ovariables.lst_gruposanguineo
                           , cbo_gruposanguineo = `<option value=''>Seleccione Grupo Sanguineo</option>`;
            lst_gruposanguineo.forEach(x=> { cbo_gruposanguineo += `<option value='${x.codigogruposanguineo}'>${x.gruposanguineo}</option>`; });
            _('_GrupoSanguineo').innerHTML = cbo_gruposanguineo;
        }

        /* Modal */
        function required_item(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let item_clase = divformulario.getElementsByClassName(oenty.clase);
            let arr_item = Array.prototype.slice.apply(item_clase);
            arr_item.forEach(x=> {
                valor = x.value, att = x.getAttribute('data-required'),
                cls_select2 = x.classList.contains('_select2'),
                padre = cls_select2 ? x.parentNode : x.parentNode;
                if (att) {
                    if ((valor == '') || (valor == '0' && cls_select2 == true))
                    { padre.classList.add('has-error'); resultado = false; }
                    else { padre.classList.remove('has-error'); }
                }
            })
            return resultado;
        }

        function fn_agregar() {
            let nombremodal = _('_NombreModal').value
                , parentescomodal = _('_ParentescoModal').value;

            let req = required_item({ id: 'div_parientes', clase: '_enty' });
            if (req) {
                let html = `<tr>
                            <td>
                                <button type="button" class ="btn btn-xs btn-danger" onclick="app_Personal_Update.fn_remove(this)">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                            <td>${_('_NombreModal').value}</td>
                            <td>${_('_ParentescoModal').value}</td>
                            <td>${_('_EdadModal').value}</td>
                            <td>${_('_DNIModal').value}</td>
                            <td>${_('_EstadoCivilModal').options[_('_EstadoCivilModal').selectedIndex].text}</td>
                            <td>${_('_GradoModal').options[_('_GradoModal').selectedIndex].text}</td>
                            <td>${_('_OcupacionModal').value}</td>
                            <td>${_('_NombreEmpresaModal').value}</td>
                        </tr>`;
                _('tbl_familiares').children[1].innerHTML += html;
                $("#moda_familiar").modal('hide');
                $("#moda_familiar input").val("");
                //<td class ='hide'>${_('_EstadoCivilModal').value}</td>
                //<td class ='hide'>${_('_GradoModal').value}</td>
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function fn_remove(button) {
            var i = button.parentNode.parentNode.rowIndex;
            _('tbl_familiares').deleteRow(i);
        }

        /* Eventos */
        function fn_change_pasaporte() {
            if (this.value === 'SI') {
                _('div_passport').classList.remove('hide');
            } else {
                _('div_passport').classList.add('hide');
            }
        }

        function fn_change_tipo_vivienda() {
            if (this.value === 'TV004') {
                _('div_otros').classList.remove('hide');
            } else {
                _('div_otros').classList.add('hide');
            }
        }

        function req_change_area() {
            fn_load_sub_area();
            fn_load_cargo();
            fn_load_equipo();
        }

        function req_change_sub_area() {
            fn_load_cargo();
            fn_load_equipo();
        }

        function required_item(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let item_clase = divformulario.getElementsByClassName(oenty.clase);
            let arr_item = Array.prototype.slice.apply(item_clase);
            arr_item.forEach(x=> {
                valor = x.value, att = x.getAttribute('data-required'),
                cls_select2 = x.classList.contains('_select2'),
                padre = cls_select2 ? x.parentNode : x.parentNode;
                if (att) {
                    if ((valor == '') || (valor == '0' && cls_select2 == true))
                    { padre.classList.add('has-error'); resultado = false; }
                    else { padre.classList.remove('has-error'); }
                }
            })
            return resultado;
        }

        /* Guardar */
        function fn_save() {
            //const req_enty = _required({ clase: '_enty_grabar', id: 'app_Personal_Nuevo' });
            let req_enty = required_item({ id: 'pnl_Personal_Nuevo', clase: '_enty_data' });
            if (req_enty) {
                //if (_isEmail(_('_CorreoPersonal').value)) {
                    swal({
                        html: true,
                        title: "Guardar Datos",
                        text: "¿Estas seguro/a que deseas guardar tus datos?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = _getParameter({ clase: '_enty_data', id: 'pnl_Personal_Nuevo' }),
                            frm = new FormData();
                        parametro['familiares'] = fn_crearfamiliares();
                        parametro['contactos'] = fn_crearcontacto();
                        parametro['lusuarioasistencia'] = _('lusuarioasistencia').checked;
                        parametro['idpersonal'] = ovariables.idpersonal;
                        parametro['imagen'] = ovariables.imagen;
                        frm.append('par', JSON.stringify(parametro));
                        frm.append('parimg', $("#inputImage")[0].files[0]);

                        Post('RecursosHumanos/Personal/Personal_Guardar', frm, res_save);

                        //_Post('RecursosHumanos/PerfilUsuario/Personal_Guardar', frm)
                        //    .then((resultado) => {
                        //        let orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        //        if (orpta !== null) {
                        //            swal({
                        //                title: "¡Buen Trabajo!",
                        //                text: "Se guardo correctamente",
                        //                type: "success",
                        //                timer: 1000,
                        //                showCancelButton: false,
                        //                showConfirmButton: false
                        //            }, function () {
                        //                swal.close()
                        //                window.location.reload(false);
                        //                const redirect = { Modulo: "RecursosHumanos", Controlador: "PerfilUsuario", Vista: "Index", Accion: "", Parametro: "" };
                        //                localStorage.setItem('redirect', JSON.stringify(redirect));
                        //            });
                        //            //req_ini();
                        //        } else {
                        //            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        //        }
                        //    }, (p) => { err(p); });
                    });
                //} else {
                //    swal({ title: "Advertencia", text: "Por favor, ingresa un email valido", type: "error" });
                //}
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function res_save(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        function fn_crearfamiliares() {
            let arr = []
            const cols = [..._('tbl_familiares').children[1].children].forEach(x => {
                const json = {
                    Nombre: x.children[1].textContent,
                    Parentesco: x.children[2].textContent,
                    Edad: x.children[3].textContent,
                    DNI: x.children[4].textContent,
                    EstadoCivil: x.children[5].textContent,
                    GradoInstruccion: x.children[6].textContent,
                    Ocupacion: x.children[7].textContent,
                    NombreEmpresa: x.children[8].textContent
                }
                arr.push(json)
            });
            return arr;
        }

        function fn_crearcontacto() {
            let arr = []
            for (let i = 1; i <= 2; i++) {
                const json = { contacto: _('_Contacto' + i).value, parentesco: _('_Parentesco' + i).value, celular: _('_Celular' + i).value };
                arr.push(json);
            }
            return arr;
        }

        function fn_crearfoto() {
            //if (ovariables.lst_personal[0].imagenwebnombre !== '') {
            //    _('_FotoPerfil_Nuevo').src = `${urlBase()}Content/img/RRHH/personal/${ovariables.lst_personal[0].imagenwebnombre}`;
            //} else {
            //    _('_FotoPerfil_Nuevo').src = `${urlBase()}Content/img/RRHH/personal/default.jpg`;
            //}

            _('inputImage').onchange = function () {
                const archivo = this.value;
                const ultimopunto = archivo.lastIndexOf(".");
                let ext = archivo.substring(ultimopunto + 1);
                ext = ext.toLowerCase();
                switch (ext) {
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                        fn_mostrarfoto(this);
                        break;
                    default:
                        alert('Images Allowed (png, jpg, jpeg).');
                        this.value = '';
                }
            }

            _('btnDeleteUpload').onclick = function () {
                const img = `${urlBase()}Content/img/RRHH/personal/default.jpg`;
                _('_FotoPerfil').src = img;
                _('inputImage').value = '';
            }
        }

        function fn_mostrarfoto(input) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    _('_FotoPerfil').src = e.target.result
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function fn_return() {
            let urlaccion = 'RecursosHumanos/Personal/Index',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        return {
            load: load
            , req_ini: req_ini
            , ovariables: ovariables
            , fn_remove: fn_remove
        }
    }
)(document, 'pnl_Personal_Nuevo');
(
    function ini() {
        app_Personal_Nuevo.load();
        app_Personal_Nuevo.req_ini();
    }
)();
