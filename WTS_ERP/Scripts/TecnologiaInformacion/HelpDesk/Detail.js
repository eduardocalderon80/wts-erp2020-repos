var ovariables_detail = {
    infopersonal: '',
    infopersonalidpersonal: '',
    infopersonalidarea:'',
    infohelpdesk: '',
    infohelpdeskejecutor: '',
    infohelpdeskequipotic:'',
    infoaprobadorxmodulo: '',
    infoaprobadorxarea: '',
    idsolicitud: '',
    idestado: '',
    idaccion: '',
    idequipotic: '',
    idtiposolicitud: '',
    idusuariosolicitante: '',
    idareasolicitante: '',
    idresponsable: '',
    idtipoatencion:'',
    arrequipotic: '',
    arrtiposolicitud: '',
    arrprioridad: '',
    arrmodulo: '',
    arraprobadorxmodulo:'',
    arrcategoria:'',
    arraprobadorxarea: '',
    arrtipoatencion:'',
    arrresponsible:'',
    accion:'',
    infsolicitud: '',
    detsolicitud: '',
    estsolicitud: '',
    aprsolicitud: '',
    filsolicitud:'',
    estadofirmado: '',
    result: '',
    par_filter:'',
}

function load() {
    let par = _('txtpar').value;

    if (!_isEmpty(par)) {        
        ovariables_detail.idsolicitud = _par(par, 'idsolicitud');
        ovariables_detail.par_filter = _par(par, 'par_filter');
    }

    fn_getDate();

    $('#div_grupo_fechatentativa .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    });

    _modal('finish', 'auto', '', null, 'bg-success');
    $('#modal_finish').on('show.bs.modal', fn_executemodalfinish);

    _modal('cancel', 'auto', '', null, 'bg-danger');
    $('#modal_cancel').on('show.bs.modal', fn_executemodalcancel);

    _modal('reject', 'auto', '', null, 'bg-danger');
    $('#modal_reject').on('show.bs.modal', fn_executemodalreject);

    _('cboEquipoTIC').addEventListener('change', fn_load_detxequi);
    _('cboTipoSolicitud').addEventListener('change', fn_load_detxsol);
    _('cboSistema').addEventListener('change', fn_load_modulo_change);
    _('cboModulo').addEventListener('change', fn_load_aprobadorxmodulo);

    _('filetic').addEventListener('change', fn_change_file_tic);

    _('cboResponsable').addEventListener('change', fn_accept_responsable);
    _('cboCategoria').addEventListener('change', fn_change_categoria);
}

function fn_change_responsable() {
    if ((ovariables_detail.infohelpdeskejecutor == 2 || (ovariables_detail.infohelpdeskejecutor == 1 && ovariables_detail.infohelpdeskequipotic == 1) || ovariables_detail.infohelpdeskejecutor == 4) && ovariables_detail.idestado == 2) {
        let arrresponsible = ovariables_detail.arrresponsible;
        let cboresponsable = '';
        let result = '';

        let datasolicitud = ovariables_detail.infsolicitud;
        let idequipotic = datasolicitud[0].IdEquipoTIC;
        let idtipoatencion = datasolicitud[0].IdTipoAtencion;


        if (ovariables_detail.infohelpdeskejecutor == 1 && ovariables_detail.infohelpdeskequipotic == 1) {
            result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === idequipotic.toString() && x.IdGrupoEjecutor.toString() !== '1' && x.IdGrupoEjecutor.toString() !== '2' && x.IdGrupoEjecutor.toString() !== '4');
        }
        else if (ovariables_detail.infohelpdeskejecutor == 2) {
            result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === idequipotic.toString() && x.IdEquipoTIC.toString() !== '2' && x.IdGrupoEjecutor.toString() !== '1' && x.IdGrupoEjecutor.toString() !== '4');

        }
        else if (ovariables_detail.infohelpdeskejecutor == 4) {
            if (idequipotic == 1) {
                result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === idequipotic.toString() && x.IdEquipoTIC.toString() !== '2' && x.IdGrupoEjecutor.toString() !== '1' && x.IdGrupoEjecutor.toString() !== '4');
            }
            else {
                result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === idequipotic.toString() && x.IdEquipoTIC.toString() !== '1' && x.IdGrupoEjecutor.toString() !== '1' && x.IdGrupoEjecutor.toString() !== '4');
            }
        }
        result.forEach(x=> { cboresponsable += `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`; });

        if (result.length > 0) {

            _('cboResponsable').innerHTML = cboresponsable;

            let x = Array.from(_('cboResponsable'));
            if (datasolicitud[0].UsuarioResponsable != 0) { _('cboResponsable').value = datasolicitud[0].UsuarioResponsable; }
            else {
                x.forEach(y=> {
                    if (y.value == ovariables_detail.infopersonalidpersonal)
                    { _('cboResponsable').value = ovariables_detail.infopersonalidpersonal }
                })
            }
            _('cboResponsable').disabled = false;
        }
        else {
            swal({ title: "Alert", text: "No hay personal que usted pueda asignar como responsable", type: "warning" }); return;
        }
    }
}

function fn_return_responsable() {
    if ((ovariables_detail.infohelpdeskejecutor == 2 || (ovariables_detail.infohelpdeskejecutor == 1 && ovariables_detail.infohelpdeskequipotic == 1) || ovariables_detail.infohelpdeskejecutor == 4) && ovariables_detail.idestado == 2) {
        let arrresponsible = ovariables_detail.arrresponsible;
        let cboresponsable = '';
        arrresponsible.forEach(x=> { cboresponsable += `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`; });
        _('cboResponsable').innerHTML = cboresponsable;
        let datasolicitud = ovariables_detail.infsolicitud;
        let x = Array.from(_('cboResponsable'));
        if (datasolicitud[0].UsuarioResponsable != 0) { _('cboResponsable').value = datasolicitud[0].UsuarioResponsable; }
        else {
            x.forEach(y=> {
                if (y.value == ovariables_detail.infopersonalidpersonal)
                { _('cboResponsable').value = ovariables_detail.infopersonalidpersonal }
            })
        }
        fn_accept_responsable();
    }
}


function fn_accept_responsable() {
    _('cboResponsable').disabled = true;
}

// General
function fn_getDate() {
    let odate = new Date();
    let mes = odate.getMonth() + 1;
    let day = odate.getDate();
    let anio = odate.getFullYear();

    if (day < 10) { day = '0' + day }
    if (mes < 10) { mes = '0' + mes }
    resultado = `${mes}/${day}/${anio}`;
    _('txtFechaTentativa').value = resultado;
}

function fn_clean_required() {
    var arr2 = [...document.getElementsByClassName('has-error')]
    arr2.forEach(x=>x.classList.remove('has-error'));
}

function fn_return() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/Inicio';
    _Go_Url(urlaccion, urlaccion);
}

function fn_return_filter() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/Inicio';
    _Go_Url(urlaccion, urlaccion);
    //_ruteo_masgeneral('TecnologiaInformacion/HelpDesk/Index')
    //       .then((rpta) => {
    //           // nada
    //       }).catch(function (e) {
    //           console.log(e);
    //       });
}

function fn_validform() {
    let htmltitulo = '';
    let datasolicitud = ovariables_detail.infsolicitud;
    ovariables_detail.idestado = datasolicitud[0].IdEstado;
    ovariables_detail.idaccion = datasolicitud[0].IdAccion;
    ovariables_detail.idequipotic = datasolicitud[0].IdEquipoTIC;
    ovariables_detail.idtiposolicitud = datasolicitud[0].IdTipoSolicitud;
    ovariables_detail.idusuariosolicitante = datasolicitud[0].UsuarioSolicitante;
    ovariables_detail.idareasolicitante = datasolicitud[0].AreaSolicitante;
    let idtipoatencion = datasolicitud[0].IdTipoAtencion;
    ovariables_detail.idresponsable = datasolicitud[0].UsuarioResponsable;

    let idgrupoejecutor = ovariables_detail.infohelpdeskejecutor;
    let idequipotic = ovariables_detail.infohelpdeskequipotic;
    let htmlbotonera = '';

    fn_disabled_register(true);
    fn_disabled_tic(true);

    if (idgrupoejecutor == 0) {
        _('divhabilitarresponsable').classList.add('hide');
        _('divdeshabilitarresponsable').classList.add('hide');
    }

    if (ovariables_detail.idestado == '1') {
        _('tabTic').style.display = 'none';
        htmltitulo = `<label class="form-control bg-info">SOLICITUD N ° ${ovariables_detail.idsolicitud} : POR APROBAR</label>`;

        htmlbotonera = `
                                <button type='button' class ='btn btn-danger' id='btnCancelar' onclick='fn_cancel()'>
                                <span class ='fa fa-close'></span>
                                Cancelar
                            </button>`;

        if (ovariables_detail.aprsolicitud != '') {
            let result = ovariables_detail.aprsolicitud.filter(x=>x.IdPersonal === ovariables_detail.infopersonalidpersonal);
            if (result != 0) {
                if (result[0].Estado != 1) {
                    htmlbotonera = `
                                      <button type='button' class ='btn btn-danger' id='btnCancelar' onclick='fn_reject()'>
                                        <span class ='fa fa-thumbs-down'></span>
                                        Rechazar
                                    </button>
                                    <button type='button' class ='btn btn-primary' id='btnAprobar' onclick='fn_request(2, "Aprobar")'>
                                        <span class ='fa fa-thumbs-up'></span>
                                        Aprobar
                                    </button>`;
                }
            }
        }
    }
    else if (ovariables_detail.idestado == '2') {
        _('tabTic').style.display = 'block';
        _('divfiletic_desactive').classList.remove('hide');
        htmltitulo = `<label class="form-control bg-warning">SOLICITUD N ° ${ovariables_detail.idsolicitud} : PENDIENTE</label>`;
        if (idgrupoejecutor != 0) {
            if (idtipoatencion != 3) {
                _('divfiletic_active').classList.remove('hide');
                fn_disabled_tic(false);

                htmlbotonera = `
                                <button type='button' class ='btn btn-danger' id='btnEditar' onclick="fn_edit('${ovariables_detail.idestado}')">
                                    <span class ='fa fa-edit'></span>
                                        Editar
                                </button>`;                
                
                if (idgrupoejecutor == 2 || idgrupoejecutor == 4) {
                    htmlbotonera += `
                                        <button type='button' class ='btn btn-warning' id='btnAsignar' onclick='fn_request(4, "Asignar")'>
                                            <span class ='fa fa-user'></span>
                                                Asignar
                                        </button>`;
                }
                else if (idgrupoejecutor == 1) {
                    if (idequipotic == 2) {
                        //_('cboResponsable').disabled = true;
                        htmlbotonera += `
                                        <button type='button' class ='btn btn-warning' id='btnEscalar' onclick='fn_request(3, "Escalar") '>
                                            <span class ='fa fa-arrow-circle-up'></span>
                                                Escalar
                                        </button>`;
                    }
                    else {
                        htmlbotonera += `
                                        <button type='button' class ='btn btn-warning' id='btnEscalar' onclick='fn_request(3, "Escalar") '>
                                            <span class ='fa fa-arrow-circle-up'></span>
                                                Escalar
                                        </button>
                                         <button type='button' class ='btn btn-warning' id='btnAsignar' onclick='fn_request(4, "Asignar")'>
                                            <span class ='fa fa-user'></span>
                                                Asignar
                                        </button>`;
                    }
                }

                htmlbotonera += `
                                    <button type='button' class ='btn btn-default' id='btnProcesar' onclick='fn_request(5, "Procesar")'>
                                        <span class ='fa fa-play-circle'></span>
                                            Procesar
                                    </button>
                                    <button type='button' class ='btn btn-primary' id='btnAtender' onclick='fn_request(6, "Atender")'>
                                        <span class ='fa fa-clipboard'></span>
                                            Atender
                                    </button>
                                    <button type='button' class ='btn btn-info' id='btnSave' onclick='fn_req_edit_date()'>
                                        <span class ='fa fa-save'></span>
                                            Guardar
                                    </button>
                                    <button type='button' class ='btn btn-danger' id='btnCancelar' onclick='fn_cancel()'>
                                        <span class ='fa fa-close'></span>
                                        Cancelar
                                    </button>`;
            }
            else
            {
                if (idgrupoejecutor == 1 && idequipotic == 1) {
                    //_('cboResponsable').disabled = false;
                    if (ovariables_detail.idaccion == 3) {
                        htmlbotonera = `
                                         <button type='button' class ='btn btn-warning' id='btnAsignar' onclick='fn_request(4, "Asignar") '>
                                                <span class ='fa fa-user'></span>
                                                    Asignar
                                            </button>`;
                    }
                    else if (ovariables_detail.idaccion == 4) {
                        htmlbotonera = `
                                        <button type='button' class ='btn btn-warning' id='btnCancelar' onclick='fn_request(9, "ReAsignar") '>
                                            <span class ='fa fa-refresh'></span>
                                                ReAsignar
                                        </button>`;
                    }
                    else {
                        if (ovariables_detail.infopersonalidpersonal == ovariables_detail.idresponsable) {
                            _('divfiletic_active').classList.remove('hide');
                            fn_disabled_tic(false);
                            htmlbotonera = `
                                             <button type='button' class ='btn btn-danger' id='btnEditar' onclick="fn_edit('${ovariables_detail.idestado}')">
                                                <span class ='fa fa-edit'></span>
                                                    Editar
                                            </button>
                                            <button type='button' class ='btn btn-warning' id='btnAsignar' onclick='fn_request(4, "Asignar") '>
                                                <span class ='fa fa-user'></span>
                                                    Asignar
                                            </button>
                                            <button type='button' class ='btn btn-default' id='btnProcesar' onclick='fn_request(5, "Procesar") '>
                                                <span class ='fa fa-play-circle'></span>
                                                    Procesar
                                            </button>
                                             <button type='button' class ='btn btn-primary' id='btnAtender' onclick='fn_request(6, "Atender") '>
                                                <span class ='fa fa-clipboard'></span>
                                                    Atender
                                            </button>
                                             <button type='button' class ='btn btn-info' id='btnSave' onclick='fn_req_edit_date()'>
                                                <span class ='fa fa-save'></span>
                                                    Guardar
                                            </button>
                                            <button type='button' class ='btn btn-danger' id='btnCancelar' onclick='fn_cancel()'>
                                                <span class ='fa fa-close'></span>
                                                Cancelar
                                            </button>`;
                        }
                        else {
                            htmlbotonera = `
                                            <button type='button' class ='btn btn-warning' id='btnCancelar' onclick='fn_request(9,"ReAsignar")'>
                                                <span class ='fa fa-refresh'></span>
                                                    ReAsignar
                                            </button>`;
                        }
                    }
                }

                if (idgrupoejecutor == 2 || idgrupoejecutor == 4) {
                    //_('cboResponsable').disabled = false;
                    if (ovariables_detail.idaccion == 4) {
                        htmlbotonera = `
                                        <button type='button' class ='btn btn-warning' id='btnCancelar' onclick='fn_request(9, "ReAsignar") '>
                                            <span class ='fa fa-refresh'></span>
                                                ReAsignar
                                        </button>`;
                    }
                    else {
                        if (ovariables_detail.infopersonalidpersonal == ovariables_detail.idresponsable || ovariables_detail.idresponsable == 0) {
                            _('divfiletic_active').classList.remove('hide');
                            fn_disabled_tic(false);
                            htmlbotonera = `
                                             <button type='button' class ='btn btn-danger' id='btnEditar' onclick="fn_edit('${ovariables_detail.idestado}')">
                                                <span class ='fa fa-edit'></span>
                                                    Editar
                                            </button>
                                            <button type='button' class ='btn btn-warning' id='btnAsignar' onclick='fn_request(4, "Asignar") '>
                                                <span class ='fa fa-user'></span>
                                                    Asignar
                                            </button>
                                            <button type='button' class ='btn btn-default' id='btnProcesar' onclick='fn_request(5, "Procesar") '>
                                                <span class ='fa fa-play-circle'></span>
                                                    Procesar
                                            </button>
                                             <button type='button' class ='btn btn-primary' id='btnAtender' onclick='fn_request(6, "Atender") '>
                                                <span class ='fa fa-clipboard'></span>
                                                    Atender
                                            </button>
                                             <button type='button' class ='btn btn-info' id='btnSave' onclick='fn_req_edit_date()'>
                                                <span class ='fa fa-save'></span>
                                                    Guardar
                                            </button>
                                            <button type='button' class ='btn btn-danger' id='btnCancelar' onclick='fn_cancel()'>
                                                <span class ='fa fa-close'></span>
                                                Cancelar
                                            </button>`;
                        }
                        else {
                            htmlbotonera = `
                                            <button type='button' class ='btn btn-warning' id='btnCancelar' onclick='fn_request(9,"ReAsignar")'>
                                                <span class ='fa fa-refresh'></span>
                                                    ReAsignar
                                            </button>`;
                        }
                    }
                }

                if (idgrupoejecutor == 3) {
                    if (ovariables_detail.infopersonalidpersonal == ovariables_detail.idresponsable) {
                        _('divfiletic_active').classList.remove('hide');
                        _('txtFechaTentativa').disabled = false;
                        _('txtInforme').disabled = false;
                        _('txtObservacion').disabled = false;
                        htmlbotonera = `
                                         <button type='button' class ='btn btn-danger' id='btnEditar' onclick="fn_edit('${ovariables_detail.idestado}')">
                                            <span class ='fa fa-edit'></span>
                                                Editar
                                        </button>
                                        <button type='button' class ='btn btn-default' id='btnProcesar' onclick='fn_request(5, "Procesar") '>
                                            <span class ='fa fa-play-circle'></span>
                                                Procesar
                                        </button>
                                        <button type='button' class ='btn btn-info' id='btnSave' onclick='fn_req_edit_date()'>
                                            <span class ='fa fa-save'></span>
                                                Guardar
                                        </button>
                                        <button type='button' class ='btn btn-danger' id='btnCancelar' onclick='fn_cancel()'>
                                            <span class ='fa fa-close'></span>
                                            Cancelar
                                        </button>`;
                    }
                }
               
                _('cboNivelAtencion').disabled = true;
            }
        }
        else {
            //fn_disabled_register(true);
            //_('tabTic').style.display = 'block';
            //_('divfiletic_desactive').classList.remove('hide');
            if (ovariables_detail.infopersonalidpersonal == ovariables_detail.idusuariosolicitante) {
                htmlbotonera += `
                                       <button type='button' class ='btn btn-danger' id='btnCancelar' onclick='fn_cancel()'>
                                        <span class ='fa fa-close'></span>
                                        Cancelar
                                    </button>`;
            }
        }
        _('cboResponsable').disabled = true;
    }
    else if (ovariables_detail.idestado == '3') {
        _('divfiletic_desactive').classList.remove('hide');
        htmltitulo = `<label class="form-control bg-default">SOLICITUD N ° ${ovariables_detail.idsolicitud} : EN PROCESO</label>`;
        if (ovariables_detail.infopersonalidpersonal == ovariables_detail.idresponsable) {
            _('txtFechaTentativa').disabled = false;
            _('txtInforme').disabled = false;
            _('txtObservacion').disabled = false;
            _('divfiletic_active').classList.remove('hide');
            htmlbotonera = `
                              <button type='button' class ='btn btn-danger' id='btnEditar' onclick="fn_edit('${ovariables_detail.idestado}')">
                                    <span class ='fa fa-edit'></span>
                                        Editar
                                </button>
                            <button type='button' class ='btn btn-primary' id='btnAtender' onclick='fn_request(6, "Atender")'>
                                <span class ='fa fa-clipboard'></span>
                                    Atender
                            </button>
                             <button type='button' class ='btn btn-info' id='btnSave' onclick='fn_req_edit_date()'>
                                <span class ='fa fa-save'></span>
                                Guardar
                            </button>
                             <button type='button' class ='btn btn-danger' id='btnCancelar' onclick='fn_cancel()'>
                                <span class ='fa fa-close'></span>
                                Cancelar
                            </button>`;
        }
    }
    else if (ovariables_detail.idestado == '4') {
        _('divfiletic_desactive').classList.remove('hide');
        htmltitulo = `<label class="form-control bg-primary">SOLICITUD N ° ${ovariables_detail.idsolicitud} : ATENDIDO</label>`;
        if (ovariables_detail.infopersonalidpersonal == ovariables_detail.idusuariosolicitante) {
            htmlbotonera = `
                            <button type='button' class ='btn btn-success' id='btnTerminar' onclick='fn_finish()'>
                                <span class ='fa fa-gavel'></span>
                                    Terminar
                            </button>`;
        }

        if (idgrupoejecutor == 2 && ovariables_detail.infohelpdeskequipotic == 2) {
            htmlbotonera += `
                            <button type='button' class ='btn btn-danger' id='btnEditar' onclick="fn_edit('${ovariables_detail.idestado}')">
                                <span class ='fa fa-edit'></span>
                                    Editar
                            </button>`;
        }
    }
    else if (ovariables_detail.idestado == '5') {
        _('divfiletic_desactive').classList.remove('hide');
        htmltitulo = `<label class="form-control bg-success">SOLICITUD N ° ${ovariables_detail.idsolicitud} : TERMINADO</label>`;
        if (idgrupoejecutor == 2 && ovariables_detail.infohelpdeskequipotic == 2) {
            htmlbotonera += `
                            <button type='button' class ='btn btn-danger' id='btnEditar' onclick="fn_edit('${ovariables_detail.idestado}')">
                                <span class ='fa fa-edit'></span>
                                    Editar
                            </button>`;
        }
    }
    else if (ovariables_detail.idestado == '6') {
        _('divfiletic_desactive').classList.remove('hide');
        htmltitulo = `<label class="form-control bg-danger">SOLICITUD N ° ${ovariables_detail.idsolicitud} : RECHAZADO</label>`;
        _('tabTic').style.display = 'none';
    }
    else if (ovariables_detail.idestado == '7') {
        _('divfiletic_desactive').classList.remove('hide');
        htmltitulo = `<label class="form-control bg-danger">SOLICITUD N ° ${ovariables_detail.idsolicitud} : CANCELADO</label>`;
        //_('tabTic').style.display = 'none';
    }

    htmlbotonera += `
                    <button type='button' class='btn btn-default' id='btnReturn' onclick='fn_return_filter()'>
                        <span class ='fa fa-reply-all'></span>
                            Retornar
                    </button>`;

    _('divTitulo').innerHTML = htmltitulo;
    _('divBotones').innerHTML = htmlbotonera;
}

//fecha tentativa
function fn_req_edit_date() {
    swal({
        title: "Esta seguro de Guardar los datos ingresados",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        req_update(20);
    });
}

function fn_disabled_register(bool) {
    _('cboEquipoTIC').disabled = bool;
    _('cboTipoSolicitud').disabled = bool;
    _('cboPrioridad').disabled = bool;
    _('cboCategoria').disabled = bool;
    _('cboSistema').disabled = bool;
    _('cboModulo').disabled = bool;
    _('txtDescripcion').disabled = bool;
}

function fn_disabled_tic(bool) {
    _('cboResponsable').disabled = bool;
    _('cboNivelAtencion').disabled = bool;
    _('txtFechaTentativa').disabled = bool;
    _('txtInforme').disabled = bool;
    _('txtObservacion').disabled = bool;
}

//Modales
function fn_executemodalfinish() {
    let modal = $(this);

    modal.find('.modal-title').text('Terminar Solicitud');

    let urlaccion = 'TecnologiaInformacion/HelpDesk/Finish';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodyfinish').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs(urlaccion);
    });
}

function fn_finish() {
    $('#modal_finish').modal('show');
}

function fn_executemodalcancel() {
    let modal = $(this);

    modal.find('.modal-title').text('Cancelar Solicitud');

    let urlaccion = 'TecnologiaInformacion/HelpDesk/Cancel';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodycancel').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs(urlaccion);
    });
}

function fn_cancel() {
    $('#modal_cancel').modal('show');
}

function fn_executemodalreject() {
    let modal = $(this);

    modal.find('.modal-title').text('Rechazar Solicitud');

    let urlaccion = 'TecnologiaInformacion/HelpDesk/Reject';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodyreject').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs(urlaccion);
    });
}

function fn_reject() {
    $('#modal_reject').modal('show');
}

//Informacion Usuario

function req_infouser() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Info';
    Get(urlaccion, res_infouser);
}

function res_infouser(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables_detail.infopersonal = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables_detail.infohelpdesk = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables_detail.infoaprobadorxmodulo = JSON.parse(orpta[2]); }
        if (JSON.parse(orpta[3] != '')) { ovariables_detail.infoaprobadorxarea = JSON.parse(orpta[3]); }
        fn_getinfopersonal(ovariables_detail.infopersonal, ovariables_detail.infohelpdesk, ovariables_detail.infoaprobadorxmodulo, ovariables_detail.infoaprobadorxarea);       
        req_ini();
    }
}

function fn_getinfopersonal(_infopersonal, _infohelpdesk, _infoapromodulo, _infoaproarea) {
    let infopersonal = _infopersonal[0];
    ovariables_detail.infopersonalidpersonal = infopersonal.IdPersonal;
    ovariables_detail.infopersonalidarea = infopersonal.IdArea;
    _("hf_IdSolicitud").value = ovariables_detail.idsolicitud;
    _("hf_IdPersonal").value = ovariables_detail.infopersonalidpersonal;

    let infohelpdesk = _infohelpdesk[0] != null ? _infohelpdesk[0] : 0;
    ovariables_detail.infohelpdeskejecutor = infohelpdesk.IdGrupoEjecutor != null ? infohelpdesk.IdGrupoEjecutor : infohelpdesk;
    ovariables_detail.infohelpdeskequipotic = infohelpdesk.IdEquipoTIC != null ? infohelpdesk.IdEquipoTIC : infohelpdesk;
}

//Informacion Maestras
function req_ini() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Master';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables_detail.arrequipotic = JSON.parse(orpta[0]);  }
        if (JSON.parse(orpta[1] != '')) { ovariables_detail.arrtiposolicitud = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables_detail.arrprioridad = JSON.parse(orpta[2]); }
        if (JSON.parse(orpta[3] != '')) { ovariables_detail.arrmodulo = JSON.parse(orpta[3]); }
        if (JSON.parse(orpta[4] != '')) { ovariables_detail.arraprobadorxmodulo = JSON.parse(orpta[4]); }
        if (JSON.parse(orpta[5] != '')) { ovariables_detail.arrcategoria = JSON.parse(orpta[5]); }
        if (JSON.parse(orpta[6] != '')) { ovariables_detail.arraprobadorxarea = JSON.parse(orpta[6]); }
        if (JSON.parse(orpta[7] != '')) { ovariables_detail.arrtipoatencion = JSON.parse(orpta[7]); }
        if (JSON.parse(orpta[8] != '')) { ovariables_detail.arrresponsible = JSON.parse(orpta[8]); }

        req_detail();
    }
}

//Informacion Solicitud
function req_detail() {
    let par = JSON.stringify({ IdSolicitud: ovariables_detail.idsolicitud });
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Get?par=' + par;
    Get(urlaccion, res_detail);
}

function res_detail(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables_detail.infsolicitud = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables_detail.detsolicitud = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables_detail.estsolicitud = JSON.parse(orpta[2]); }
        if (JSON.parse(orpta[3] != '')) { ovariables_detail.aprsolicitud = JSON.parse(orpta[3]); }
        if (JSON.parse(orpta[4] != '')) { ovariables_detail.filsolicitud = JSON.parse(orpta[4]); }

        fn_load_file_user();
        fn_load_file_tic();
        fn_validform();
        fn_load_equipotic();
        fn_load_tiposolicitud();
        fn_load_prioridad();
        fn_load_detxequi();
        fn_load_tipoatencion();
        fn_load_responsable();
        fn_load_info_user();
        fn_load_history();        
    }
}

//Archivo Solicitud
function fn_load_file_user() {
    let array = ovariables_detail.filsolicitud;
    let tabla = _('tblfileuser').tBodies[0], html = '';
    if (array.length > 0) {
        let result = array.filter(x=>x.TipoArchivo === 1);
        if (result.length > 0) {
            _('divfiluser_desactive').classList.remove('hide');
            _('tblfileuser').classList.remove('hide');
            result.forEach(x=> {
                html += `<tr data-par='idarchivo:${x.IdArchivo},tipoarchivo:${x.TipoArchivo},modificado:0,nombrearchivo:${x.NombreArchivo}'>
                    <td class ='text-center'>
                        <div class ='btn-group'>
                            <button class ='btn btn-outline btn-warning btn-sm _download'>
                                <span class ='fa fa-download'></span>
                            </button>
                        </div>
                    </td>
                    <td>${x.NombreArchivoOriginal}</td>
                    <td class ='text-center'></td>
                    <td class ='hide'></td>
                </tr>`;
            });

            tabla.innerHTML = html;
            handlerTblFileUser_edit();
        }        
    }
} 

function handlerTblFileUser_edit() {
    let tbl = _('tblfileuser'), //arrayDelete = _Array(tbl.getElementsByClassName('_delete')),
        arrayDownload = _Array(tbl.getElementsByClassName('_download'));
    arrayDownload.forEach(x => x.addEventListener('click', e => { controladortblfileuser(e, 'download'); }));
    //arrayDelete.forEach(x => x.addEventListener('click', e => { controladortblfileuser(e, 'delete'); }));
}

function controladortblfileuser(event, accion) {
    let o = event.target, tag = o.tagName, fila = null, par = '';

    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (fila != null) {
        par = fila.getAttribute('data-par');
        eventtblfileuser(par, accion, fila);
    }
}

function eventtblfileuser(par, accion, fila) {
    switch (accion) {
        case 'delete':
            deletefileuser(fila);            
            break;
        case 'download':
            downloadfileuser(fila);
            break;
    }
}

function downloadfileuser(_fila) {
    let par = _fila.getAttribute('data-par');
    let nombrearchivooriginal = _fila.cells[1].innerText, nombrearchivo = _par(par, 'nombrearchivo');

    let urlaccion = '../TecnologiaInformacion/HelpDesk/HelpDesk_Download?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivo=' + nombrearchivo;

    var link = document.createElement('a');
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

function deletefileuser(_fila) {
    swal({
        title: "Esta seguro de eliminar este archivo?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: true
    }, function () {
        _fila.classList.add('hide');
        return;
    });
}

function fn_load_file_tic() {
    let array = ovariables_detail.filsolicitud;

    let datasolicitud = ovariables_detail.infsolicitud;
    let idtipoatencion = datasolicitud[0].IdTipoAtencion;
    let idresponsable =  datasolicitud[0].UsuarioResponsable;
    let idestado =  datasolicitud[0].IdEstado;

    let tabla = _('tblfiletic').tBodies[0], html = '';    
    if (array.length > 0) {
        let result = array.filter(x=>x.TipoArchivo === 2);
        if (result.length > 0) {
           
            result.forEach(x=> {
                html += `<tr data-par='idarchivo:${x.IdArchivo},tipoarchivo:${x.TipoArchivo},modificado:0,nombrearchivo:${x.NombreArchivo}'>
                        <td class ='text-center'>`;

                if (ovariables_detail.infohelpdeskejecutor != 0) {
                    if (idestado < 4)
                    if (idtipoatencion != 3) {
                        if (idresponsable == 0) {
                            html += `
                                       <div class ='btn-group'>
                                        <button class ='btn btn-outline btn-danger btn-sm _drop'>
                                            <span class ='fa fa-trash-o'></span>
                                        </button>
                                    </div>
                                `;
                        }
                        else {
                            if (idresponsable == ovariables_detail.infopersonalidpersonal) {
                                html += `
                                       <div class ='btn-group'>
                                        <button class ='btn btn-outline btn-danger btn-sm _drop'>
                                            <span class ='fa fa-trash-o'></span>
                                        </button>
                                    </div>
                                `;
                            }
                        }                           
                    }
                    else {                       
                        if (ovariables_detail.infohelpdeskejecutor == 2) {
                            if (idresponsable == 0 || idresponsable == ovariables_detail.infopersonalidpersonal) {
                                html += `
                                       <div class ='btn-group'>
                                        <button class ='btn btn-outline btn-danger btn-sm _drop'>
                                            <span class ='fa fa-trash-o'></span>
                                        </button>
                                    </div>
                                `;
                            }
                        }
                        if (ovariables_detail.infohelpdeskejecutor == 3) {
                            if (idresponsable == ovariables_detail.infopersonalidpersonal) {
                                html += `
                                       <div class ='btn-group'>
                                        <button class ='btn btn-outline btn-danger btn-sm _drop'>
                                            <span class ='fa fa-trash-o'></span>
                                        </button>
                                    </div>
                                `;
                            }
                        }
                    }
                }
                        

                html += `</td>
                        <td>${x.NombreArchivoOriginal}</td>
                        <td class ='text-center'>
                            <div class ='btn-group'>
                                <button class ='btn btn-outline btn-warning btn-sm _download'>
                                    <span class ='fa fa-download'></span>
                                </button>
                            </div>
                        </td>
                        <td class ='hide'></td>
                    </tr>`;
            }); 
            tabla.innerHTML = html;
            handlerTblFileTic_edit();
        }
    }
}

function handlerTblFileTic_edit() {
    let tbl = _('tblfiletic'), arrayDrop = _Array(tbl.getElementsByClassName('_drop')),
        arrayDownload = _Array(tbl.getElementsByClassName('_download'));
    arrayDownload.forEach(x => x.addEventListener('click', e => { controladortblfiletic(e, 'download'); }));
    arrayDrop.forEach(x => x.addEventListener('click', e => { controladortblfiletic(e, 'drop'); }));
    //arrayDelete.forEach(x => x.addEventListener('click', e => { controladortblfiletic(e, 'delete'); }));
}

function fn_change_file_tic(e) {
    let archivo = this.value;
    if (archivo != '') {
        let contador = fn_valid_file_tic('tblfiletic');
        if (contador.length < 2) {
            let ultimopunto = archivo.lastIndexOf(".");
            let ext = archivo.substring(ultimopunto + 1);
            ext = ext.toLowerCase();
            let nombre = e.target.files[0].name, html = '';
            let file = e.target.files;

            html = `<tr data-par='idarchivo:0,tipoarchivo:1,modificado:1'>
                        <td class='text-center'>
                            <div class ='btn-group'>
                                <button class ='btn btn-outline btn-danger btn-sm _deletefile'>
                                    <span class ='fa fa-trash-o'></span>
                                </button>
                            </div>
                        </td>
                        <td>${nombre}</td>
                        <td class ='text-center'>
                            <div class='btn-group'>
                                <button type='button' class ='btn btn-link _download hide'>Downlad</button>
                            </div>
                        </td>
                        <td class='hide'></td>
                    </tr>`;

            _('tblfiletic').tBodies[0].insertAdjacentHTML('beforeend', html);

            let tbl = _('tblfiletic').tBodies[0], total = tbl.rows.length;
            let filexd = _('filetic').cloneNode(true);
            filexd.setAttribute('id', 'file' + (total - 1));
            tbl.rows[total - 1].cells[3].appendChild(filexd);
            handlerTblFileTic_add(total);
        }
        else {
            swal({
                title: 'Alert', text: 'Usted puede cargar como máximo 2 archivos', type: 'warning'
            });
        }
    }
}

function handlerTblFileTic_add(indice) {
    let tbl = _('tblfiletic'), rows = tbl.rows[indice];
    rows.getElementsByClassName('_deletefile')[0].addEventListener('click', e => { controladortblfiletic(e, 'delete'); });
    rows.getElementsByClassName('_download')[0].addEventListener('click', e => { controladortblfiletic(e, 'download'); });
}

function controladortblfiletic(event, accion) {
    let o = event.target, tag = o.tagName, fila = null, par = '';
    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode.parentNode;
            break;
    }
    if (fila != null) {
        par = fila.getAttribute('data-par');
        eventtblfiletic(par, accion, fila);
    }
}

function eventtblfiletic(par, accion, fila) {
    switch (accion) {
        case 'delete':
            fila.classList.add('hide');
            break;
        case 'download':
            downloadfiletic(fila);
            break;
        case 'drop':
            dropfiletic(fila);
            break;
    }
}

function downloadfiletic(_fila) {
    let par = _fila.getAttribute('data-par');
    let nombrearchivooriginal = _fila.cells[1].innerText, nombrearchivo = _par(par, 'nombrearchivo');

    let urlaccion = '../TecnologiaInformacion/HelpDesk/HelpDesk_Download?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivo=' + nombrearchivo;

    var link = document.createElement('a');
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

function dropfiletic(_fila) {
    swal({
        title: "Esta seguro de eliminar este archivo?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: true
    }, function () {
        _fila.classList.add('hide');
        return;
    });
}

//Cargar Formulario
function fn_load_equipotic() {
    let _arrequipotic = ovariables_detail.arrequipotic;
    let cboequipotic = '';
    if (_arrequipotic.length > 0) {
        _arrequipotic.forEach(x=> { cboequipotic += `<option value='${x.IdEquipoTIC}'>${x.EquipoTIC}</option>`; });
        _('cboEquipoTIC').innerHTML = cboequipotic;
        _('cboEquipoTIC').value = ovariables_detail.idequipotic;
    }
    else {
        cboequipotic = '<option value="0"> -- Seleccione Equipo TIC -- </option>';
        _('cboEquipoTIC').innerHTML = cboequipotic;
    }
}

function fn_load_tiposolicitud() {
    let _arrtiposolicitud = ovariables_detail.arrtiposolicitud;
    let cbotiposolicitud = '';
    if (_arrtiposolicitud.length > 0) {
        _arrtiposolicitud.forEach(y=> { cbotiposolicitud += `<option value='${y.IdTipoSolicitud}'>${y.TipoSolicitud}</option>`; });
        _('cboTipoSolicitud').innerHTML = cbotiposolicitud;
        _('cboTipoSolicitud').value = ovariables_detail.idtiposolicitud;
    }
    else {
        cbotiposolicitud = '<option value="0"> -- Seleccione Tipo Solicitud -- </option>';
        _('cboTipoSolicitud').innerHTML = cbotiposolicitud;
    }
}

function fn_load_prioridad() {
    let _arrprioridad = ovariables_detail.arrprioridad;
    let cboprioridad = '';
    if (_arrprioridad.length > 0) {
        _arrprioridad.forEach(w=> { cboprioridad += `<option value='${w.IdPrioridad}'>${w.Prioridad}</option>`; });
        _('cboPrioridad').innerHTML = cboprioridad;
    } else {
        cboprioridad = `<option value='0'> -- Seleccione Tipo Prioridad -- </option>`;
        _('cboPrioridad').innerHTML = cboprioridad;
    }
}

function fn_load_detxequi() {
    let idequipotic = _('cboEquipoTIC').value;
    let idtiposolicitud = _('cboTipoSolicitud').value;
    fn_load_categoria();

    if (idequipotic == 1) {
        _('rowSistema').style.display = 'block';
        _('rowModulo').style.display = 'block';
        fn_load_sistema();
    } else {
        _('rowSistema').style.display = 'none';
        _('rowModulo').style.display = 'none';
        _('tablaAprobador').style.display = 'none';
        _('cboSistema').innerHTML = '';
        _('cboModulo').innerHTML = '';
        _('detalleTablaAprobador').tBodies[0].innerHTML = '';
        if (ovariables_detail.accion != '') { fn_load_aprobadorxarea(); }
    }
}

function fn_load_detxsol() {
    let idequipotic = _('cboEquipoTIC').value;
    let idtiposolicitud = _('cboTipoSolicitud').value;
    ovariables_detail.idtiposolicitud = idtiposolicitud;
    fn_load_categoria();
    if (idequipotic == '1') { fn_load_aprobadorxmodulo(); }
    else if (idequipotic == '2') { fn_load_aprobadorxarea(); }
}

function fn_load_categoria() {
    let arrcategoria = ovariables_detail.arrcategoria;
    let idequipotic = _('cboEquipoTIC').value;
    let idtiposolicitud = _('cboTipoSolicitud').value;
    let cbocategoria = `<option value=''> -- Seleccione Categoria -- </option>`;
    if (arrcategoria.length > 0) {
        if (ovariables_detail.accion == '2') {
            let result = arrcategoria.filter(x=>x.IdEquipoTIC.toString() === idequipotic && x.IdTipoSolicitud.toString() === idtiposolicitud && x.Estado === 0);
            result.forEach(x=> { cbocategoria += `<option value='${x.IdCategoria}'>${x.Categoria}</option>`; });
            _('cboCategoria').innerHTML = cbocategoria;
            _('cboCategoria').value = ovariables_detail.infsolicitud[0].IdCategoria;
            let x = result.some(x=>x.IdCategoria === ovariables_detail.infsolicitud[0].IdCategoria)
            if (x) { _('cboCategoria').value = ovariables_detail.infsolicitud[0].IdCategoria; }
            else { _('cboCategoria').value = ''; }           
        }
        else {
            let result = arrcategoria.filter(x=>x.IdEquipoTIC.toString() === idequipotic && x.IdTipoSolicitud.toString() === idtiposolicitud);
            result.forEach(x=> { cbocategoria += `<option value='${x.IdCategoria}'>${x.Categoria}</option>`; });
            _('cboCategoria').innerHTML = cbocategoria;
        }
    }
   
}

function fn_load_sistema() {
    let htmlsistema = `<option value='1'>ERP</option><option value='2'>Intranet</option><option value='3'>Página Web WTS</option>`;
    _('cboSistema').innerHTML = htmlsistema;
    // fn_load_modulo();
    fn_load_modulo_change();

}

function fn_load_modulo() {
    let cbomodulo = '';
    let result = [];
    if (ovariables_detail.arrmodulo.length > 0) {
        result = ovariables_detail.arrmodulo;        
        result.forEach(x=> { cbomodulo += `<option value='${x.IdModulo}'>${x.Nombre}</option>`; });
        _('cboModulo').innerHTML = cbomodulo;
    } else { cbomodulo = `<option value='0'> -- Seleccione Modulo -- </option>`; }
    if (ovariables_detail.accion != '') { fn_load_aprobadorxmodulo(); }
}

function fn_load_modulo_change() {
    let cbomodulo = '';
    let result = [];
    if (ovariables_detail.arrmodulo.length > 0) {
        let idsistema = _('cboSistema').value;
        let result = ovariables_detail.arrmodulo.filter(x=>x.IdSistema.toString() === idsistema);
        result.forEach(x=> { cbomodulo += `<option value='${x.IdModulo}'>${x.Nombre}</option>`; });
        _('cboModulo').innerHTML = cbomodulo;
    } else { cbomodulo = `<option value='0'> -- Seleccione Modulo -- </option>`; }
    if (ovariables_detail.accion != '') { fn_load_aprobadorxmodulo(); }
}

function fn_load_aprobadorxmodulo() {
    let idtiposolicitud = _('cboTipoSolicitud').value;

    if (idtiposolicitud == '2') {
        let idsistema = _('cboSistema').value;
        let idmodulo = _('cboModulo').value;

        if (ovariables_detail.accion == '2') {
            array = ovariables_detail.arraprobadorxmodulo.filter(x=>x.EstadoAprobador === 0 && x.Estado === 0);
        } else { let array = ovariables_detail.arraprobadorxmodulo; }

        let idcategoria = _('cboCategoria').value, categoriafirmada = '';
        categoriafirmada = idcategoria !== '' ? (ovariables_detail.arrcategoria.filter(x=> x.IdCategoria.toString() === idcategoria))[0].Aprobacion : 2;

        if (array.length > 0) {
            _('tablaAprobador').style.display = 'block';
            let firmado = '';
            let estadofirma = 0;
            let html = '';
            let result = array.filter(y=> y.IdSistema.toString() === idsistema && y.IdModulo.toString() === idmodulo);

            result.forEach(x=> {
                //if (x.IdPersonal.toString() == ovariables_detail.infopersonalidpersonal.toString()) {
                if (x.IdPersonal.toString() == ovariables_detail.idusuariosolicitante.toString() || categoriafirmada == 1) {
                    estadofirma = 1;
                    firmado = '<button class="btn btn-outline btn-primary"><span class ="fa fa-check-circle"></span></button>';
                } else {
                    estadofirma = 0; firmado = '<button class="btn btn-outline btn-danger"><span class ="fa fa-clock-o"></span></button>';
                }
                html += `<tr data-par='IdAprobador:${x.IdAprobador},EstadoFirma:${estadofirma}'>
                    <td class ='cols-sm-2 text-center'>${firmado}</td>
                    <td class ='cols-sm-5'>${x.NombrePersonal}</td>
                    <td class ='cols-sm-4'>${x.Correo}</td>
                <tr>`
            });
            _('detalleTablaAprobador').tBodies[0].innerHTML = html;
        }
        else {
            _('tablaAprobador').style.display = 'none';
            _('detalleTablaAprobador').tBodies[0].innerHTML = '';
        }
    }
    else {

        _('tablaAprobador').style.display = 'none';
        _('detalleTablaAprobador').tBodies[0].innerHTML = '';
    }
}

function fn_load_aprobadorxarea() {
    let idtiposolicitud = _('cboTipoSolicitud').value;
    let array = '', idcategoria = _('cboCategoria').value;
    if (idtiposolicitud == '2') {
        if (ovariables_detail.accion == '2') {
            array = ovariables_detail.arraprobadorxarea.filter(x=>x.EstadoAprobador === 0 && x.Estado === 0);
        } else { let array = ovariables_detail.arraprobadorxarea; }
       
        if (array.length > 0) {
            _('tablaAprobador').style.display = 'block';
            let firmado = '', html = '', categoriafirmada = '';
            //let idarea = ovariables_detail.idareasolicitante.toString();
            //let idpersonal = ovariables_detail.idusuariosolicitante.toString();
            let result = array.filter(y=>y.IdArea.toString() === ovariables_detail.idareasolicitante.toString());
            categoriafirmada = idcategoria !== '' ? (ovariables_detail.arrcategoria.filter(x=> x.IdCategoria.toString() === idcategoria))[0].Aprobacion : 2;
            result.forEach(x=> {
                if (x.IdPersonal.toString() == ovariables_detail.idusuariosolicitante.toString()
                    || categoriafirmada == 1) {
                    estadofirma = 1;
                    firmado = '<button class="btn btn-outline btn-primary"><span class ="fa fa-check-circle"></span></button>';
                } else {
                    estadofirma = 0; firmado = '<button class="btn btn-outline btn-danger"><span class ="fa fa-clock-o"></span></button>';
                }
                html += `<tr data-par='IdAprobador:${x.IdAprobador},EstadoFirma:${estadofirma}'>
                    <td class ='cols-sm-2 text-center'>${firmado}</td>
                    <td class ='cols-sm-5'>${x.NombrePersonal}</td>
                    <td class ='cols-sm-4'>${x.Correo}</td>
                <tr>`
            });
            _('detalleTablaAprobador').tBodies[0].innerHTML = html;
        }
        else {
            _('tablaAprobador').style.display = 'none';
            _('detalleTablaAprobador').tBodies[0].innerHTML = '';
        }
    }
    else {

        _('tablaAprobador').style.display = 'none';
        _('detalleTablaAprobador').tBodies[0].innerHTML = '';
    }
}

function fn_load_tipoatencion() {
    let arrtipoatencion = ovariables_detail.arrtipoatencion;
    let cbotipoatencion = '';

    if ((ovariables_detail.idaccion >= 3 && ovariables_detail.idaccion != 10) || ovariables_detail.infohelpdeskejecutor == 0) {
        //if (ovariables_detail.idaccion >= 3) {
        arrtipoatencion.forEach(x=> {
            cbotipoatencion += `<option value='${x.IdTipoAtencion}'>${x.TipoAtencion}</option>`;
        });
    }
    else {
        let result = '';
        if (ovariables_detail.infohelpdeskejecutor == 2 || ovariables_detail.infohelpdeskejecutor == 3 || ovariables_detail.infohelpdeskejecutor == 4) {
            result = arrtipoatencion.filter(x=>x.IdTipoAtencion === 3);
        } else {
            if (_('cboNivelAtencion').disabled) {
                result = arrtipoatencion.filter(x=>x.IdTipoAtencion === 3);
            }
            else {
                result = arrtipoatencion.filter(x=>x.IdTipoAtencion != 3);
            }
        }
        result.forEach(x=> {
            cbotipoatencion += `<option value='${x.IdTipoAtencion}'>${x.TipoAtencion}</option>`;
        });
    }
    _('cboNivelAtencion').innerHTML = cbotipoatencion;
}

function fn_load_responsable() {
    let arrresponsible = ovariables_detail.arrresponsible;
    let cboresponsable = '';
    let result = '';
    
    let datasolicitud = ovariables_detail.infsolicitud;
    let idequipotic = datasolicitud[0].IdEquipoTIC;
    let idtipoatencion = datasolicitud[0].IdTipoAtencion;


/*
    if (ovariables_detail.infohelpdeskejecutor == 2 || (ovariables_detail.infohelpdeskejecutor == 1 && ovariables_detail.infohelpdeskequipotic==1) || ovariables_detail.infohelpdeskejecutor == 4) {

        if (ovariables_detail.idaccion == '5' || ovariables_detail.idaccion == '6' || ovariables_detail.idaccion == '7' || ovariables_detail.idaccion == '8') {
            arrresponsible.forEach(x=> { cboresponsable += `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`; });
        }
        else //if (ovariables_detail.idaccion == '10') 
        {
            let datasolicitud = ovariables_detail.infsolicitud;
            let idtipoatencion = datasolicitud[0].IdTipoAtencion;
            let disabled = _('cboResponsable').disabled;

            if (disabled) {
                arrresponsible.forEach(x=> { cboresponsable += `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`; });
            } else {
                if (ovariables_detail.infohelpdeskejecutor == 2) {                    
                    result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === ovariables_detail.infohelpdeskequipotic.toString() && x.IdGrupoEjecutor.toString() !== '1' && x.IdGrupoEjecutor.toString() !== '4');
                }
                else if (ovariables_detail.infohelpdeskejecutor == 4) {
                    result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === idequipotic.toString() && x.IdGrupoEjecutor.toString() !== '1' && x.IdGrupoEjecutor.toString() !== '2');
                }
                else if (ovariables_detail.infohelpdeskejecutor == 1 && ovariables_detail.infohelpdeskequipotic == 1) {
                    if (idtipoatencion == 3) {
                        result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === ovariables_detail.infohelpdeskequipotic.toString() && x.IdGrupoEjecutor.toString() !== '1' && x.IdGrupoEjecutor.toString() !== '4' && x.IdGrupoEjecutor.toString() !== '2');
                    }
                    else {
                        result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === ovariables_detail.infohelpdeskequipotic.toString() && x.IdGrupoEjecutor.toString() !== '4' && x.IdGrupoEjecutor.toString() !== '2');
                    }
                    //result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === ovariables_detail.infohelpdeskequipotic.toString() && x.IdGrupoEjecutor.toString() !== '4' && x.IdGrupoEjecutor.toString() !== '2');
                }
                result.forEach(x=> { cboresponsable += `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`; });
                
                //let result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === ovariables_detail.infohelpdeskequipotic.toString() && x.IdGrupoEjecutor.toString() !== '1' && x.IdGrupoEjecutor.toString() !== '4');
                //result.forEach(x=> { cboresponsable += `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`; });
                
            }
        }

    }
    //else if (ovariables_detail.infohelpdeskejecutor == 4) {
    //    if (idtipoatencion == 1) {
    //        result = arrresponsible.filter(x=>x.IdEquipoTIC.toString() === ovariables_detail.infohelpdeskequipotic.toString() && x.IdGrupoEjecutor.toString() !== '1' && x.IdGrupoEjecutor.toString() !== '4');
    //    }

    //}
    else {*/
        arrresponsible.forEach(x=> { cboresponsable += `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`; });
    /*}*/
    _('cboResponsable').innerHTML = cboresponsable;
}

function fn_load_info_user() {
    let odata = ovariables_detail.infsolicitud;

    _('txtSolicitante').value = odata[0].NombreSolicitante;
    _('txtArea').value = odata[0].NombreArea;
    _('cboPrioridad').value = odata[0].IdPrioridad;
    _('txtFechaSolicitud').value = odata[0].FechaInicio;
    _('cboCategoria').value = odata[0].IdCategoria;
    _('cboSistema').value = odata[0].IdSistema;
    fn_load_modulo_change();
    _('cboModulo').value = odata[0].IdModulo;
    _('txtDescripcion').value = odata[0].Motivo;
    if (odata[0].FechaPropuesta != '') { _('txtFechaTentativa').value = odata[0].FechaPropuesta; }
    if (odata[0].FechaFin != '') { _('txtFechaFinal').value = odata[0].FechaFin; }
    if (odata[0].UsuarioResponsable != 0) { _('cboResponsable').value = odata[0].UsuarioResponsable; }
    else { _('cboResponsable').value = ovariables_detail.infopersonalidpersonal }
    /*
    else {
        let x = Array.from(_('cboResponsable'));
        x.forEach(y=> {
            if (y.value == ovariables_detail.infopersonalidpersonal)
            { _('cboResponsable').value = ovariables_detail.infopersonalidpersonal }
        })
    }*/

    if (odata[0].IdTipoAtencion != 0) { _('cboNivelAtencion').value = odata[0].IdTipoAtencion; }

    let odatatic = ovariables_detail.detsolicitud;
    if (odatatic != '') {
        _('txtInforme').value = odatatic[0].Informe;
        _('txtObservacion').value = odatatic[0].Observacion;
    }
    //aprobadores
    if (ovariables_detail.aprsolicitud.length > 0) { fn_load_aprob_solicitud(); }
}

function fn_change_categoria() {
    let idequipotic = _('cboEquipoTIC').value;
    if (idequipotic == '1') {
        _('rowSistema').style.display = 'block';
        _('rowModulo').style.display = 'block';
        fn_load_aprobadorxmodulo();

    } else if (idequipotic == '2') {
        _('rowSistema').style.display = 'none';
        _('rowModulo').style.display = 'none';
        _('tablaAprobador').style.display = 'none';
        _('cboSistema').innerHTML = '';
        _('cboModulo').innerHTML = '';
        _('detalleTablaAprobador').tBodies[0].innerHTML = '';
        fn_load_aprobadorxarea();
    }
}

function fn_load_aprob_solicitud() {
    let data = ovariables_detail.aprsolicitud;
    let firmado = '';
    let html = '';
    _('tablaAprobador').style.display = 'block';
    data.forEach(x=> {
        if (x.Estado == 1) { firmado = '<button class="btn btn-outline btn-primary"><span class ="fa fa-check-circle"></span></button>'; }
        else { firmado = '<button class="btn btn-outline btn-danger"><span class ="fa fa-clock-o"></span></button>'; }
        html += `<tr data-par='IdAprobador:${x.IdAprobador},EstadoFirma:${x.Estado}'>
                    <td class ='cols-sm-2 text-center'>${firmado}</td>
                    <td class ='cols-sm-5'>${x.NombrePersonal}</td>
                    <td class ='cols-sm-4'>${x.Correo}</td>
                <tr>`
    });
    _('detalleTablaAprobador').tBodies[0].innerHTML = html;
}

function fn_load_history() {
    let array = ovariables_detail.estsolicitud;
    let html = array.map(x=> {
        return `
        <tr>
            <td>${x.FechaCreacion}</td>
            <td>${x.Hora}</td>
            <td>${x.NombreEstado}</td>
            <td>${x.NombreAutor}</td>
            <td>${x.Accion}</td>
            <td>${x.Descripcion}</td>
        </tr>
        `
    }).join('');

    _('contenTableHistory').tBodies[0].innerHTML = html;
}

function fn_view_descripcion() {
    let idcategoria = _('cboCategoria').value;
    if (idcategoria != '0') {
        let result = ovariables_detail.arrcategoria.filter(z=>z.IdCategoria.toString() === idcategoria);
        let categoria = _('cboCategoria').options[_('cboCategoria').selectedIndex].text;
        let descripcion = result[0].Descripcion;
        swal({ title: categoria, text: descripcion });
    }
}

//Editar
function fn_edit(_estado) {
    if (_estado == 4 || _estado == 5) {
        _('cboCategoria').disabled = false;
    }
    else {
        _('cboTipoSolicitud').disabled = false;
        _('cboCategoria').disabled = false;
        _('cboEquipoTIC').disabled = false;
        _('cboSistema').disabled = false;
        _('cboModulo').disabled = false;
    }
  
    ovariables_detail.accion = '2';

    fn_load_categoria();

    fn_disabled_tic(true);
    _('divBotones').style.display = 'none';
    _('divBotoneseditar').style.display = 'block';
    _('divfiletic_active').classList.add('hide');
    let htmlbotoneraedit = `<button type='button' class='btn btn-info' id='btnSave' onclick='req_request_edit()'>
                        <span class="fa fa-save"></span>
                        Guardar
                    </button>
                    <button type='button' class='btn btn-default' id='btnReturn' onclick='fn_returnedit()'>
                        <span class='fa fa-reply-all'></span>
                        Retornar
                    </button>`;
    _('divBotoneseditar').innerHTML = htmlbotoneraedit;
}

function fn_returnedit() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/Detail';
    _Go_Url(urlaccion, urlaccion, 'idsolicitud:' + ovariables_detail.idsolicitud);
}

function req_request_edit() {
    let req = _required({ id: 'tab-registro', clase: '_enty' });
    if (req) {
        swal({
            title: "Esta seguro de editar esta solicitud?",
            text: "",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            req_edit();
        });
    } else { swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" }); }
}

function req_edit() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Edit';
    ovariables_detail.estadofirmado = '2';
    let idaccion = '10';
    if (ovariables_detail.idtiposolicitud == '2') { ovariables_detail.estadofirmado = '1'; }
    let tablaaprobador = fn_get_aprobador('detalleTablaAprobador');
    let oSolicitud = _getParameter({ id: 'tab-registro', clase: '_enty' }), arrAprobador = JSON.stringify(tablaaprobador);
    form = new FormData();
    oSolicitud['IdSolicitud'] = parseInt(ovariables_detail.idsolicitud);
    oSolicitud['IdPersonal'] = ovariables_detail.infopersonalidpersonal;
    //oSolicitud['IdEstado'] = ovariables_detail.estadofirmado;
    oSolicitud['IdAccion'] = idaccion;
    
    form.append('par', JSON.stringify(oSolicitud));
    form.append('pararray', arrAprobador)
    Post(urlaccion, form, res_edit);
}

function res_edit(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Buen Trabajo!", text: "Usted ha editado esta solicitud correctamente", type: "success" });
            fn_returnedit();
        };
        if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
    }
}

function fn_get_aprobador(_idtable) {
    let table = _(_idtable), array = [...table.tBodies[0].rows], arrayresult = [], obj = {};
    if (array.length > 0) {
        array.forEach(x=> {
            obj = {};
            let par = x.getAttribute('data-par');
            if (par != null) {
                IdAprobador = _par(par, 'IdAprobador'),
                EstadoFirma = _par(par, 'EstadoFirma');
                obj.IdAprobador = IdAprobador;
                obj.EstadoFirma = EstadoFirma;
                arrayresult.push(obj);
            }
        });
    }

    if (arrayresult.length == 1) {
        let x = arrayresult.some(z=> { if (z.EstadoFirma.toString() === "1") { return true } });
        if (x) { ovariables_detail.estadofirmado = 2 } else { ovariables_detail.estadofirmado = 1; }
    }
    return arrayresult;
}


//Modificar
function fn_request(_IdAccion, _nombre) {
    let informe = _('txtInforme').value;
    let req = _required({ id: 'tab-registro', clase: '_enty' });
    let reqtic = _required({ id: 'tab-tic', clase: '_enty' });
    let responsable = _('cboResponsable').value;

    if (_IdAccion.toString() == '3' || _IdAccion.toString() == '5') { fn_clean_required(); }

    if (_IdAccion.toString() == '9') {
        fn_clean_required();
        if (responsable == '') { swal({ title: "Alert", text: "Debe seleccionar a un personal", type: "warning" }); return; }
    }

    if (_IdAccion.toString() == '4') {
        fn_clean_required();
        if (responsable == ovariables_detail.infopersonalidpersonal) {
            swal({ title: "Alert", text: "Usted no puede asignarse una solicitud", type: "warning" }); return;
        }
    }

    if (_IdAccion.toString() == '5') {
        if (responsable != ovariables_detail.infopersonalidpersonal) {
            swal({ title: "Alert", text: "Usted no puede procesar esta solicitud por otra persona", type: "warning" }); return;
        }
    }

    if (_IdAccion.toString() == '6') {
        if (responsable != ovariables_detail.infopersonalidpersonal) {
            swal({ title: "Alert", text: "Usted no puede atender una solicitud por otra persona", type: "warning" }); return;
        }
        else {
            if (reqtic == false) { swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" }); return; }
        }
    }

    if (req) {
        swal({
            title: "Esta seguro de " + _nombre + " esta solicitud?",
            text: "",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            req_update(_IdAccion);
        });
    } else {
        swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" });
    }
}

function req_update(_IdAccion) {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Update';
    let IdResponsable = 0;
    let IdNivelAtencion = 0;
    let comentario = '';
    let idtipovalorizacion = '';
    let arrfiletic = [];
    let arrfileticdelete = [];
    ovariables_detail.result = 'inicio';

    if (_IdAccion.toString() == '20') {
        ovariables_detail.result = 'actual';
        if (ovariables_detail.idresponsable.toString() != '0') { IdResponsable = _('cboResponsable').value }
    }

    if (_IdAccion.toString() == '6' || _IdAccion.toString() == '4' || _IdAccion.toString() == '9' || _IdAccion.toString() == '5') {
        IdResponsable = _('cboResponsable').value;
        IdNivelAtencion = _('cboNivelAtencion').value;
    }
    if (_IdAccion.toString() == '20' || _IdAccion.toString() == '6' || _IdAccion.toString() == '5' || _IdAccion.toString() == '3') {
        arrfiletic = fn_getfiletic('tblfiletic');
        arrfileticdelete = fn_getfiltic_delete('tblfiletic');
    }

    let par = JSON.stringify({ IdSolicitud: parseInt(ovariables_detail.idsolicitud), IdPersonal: ovariables_detail.infopersonalidpersonal, IdAccion: _IdAccion });
    let oRegister = _getParameter({ id: 'tab-registro', clase: '_enty' });
    oTic = _getParameter({ id: 'tab-tic', clase: '_enty' }),
    arrfileTic = JSON.stringify(arrfiletic),
    arrfileTicDelete = JSON.stringify(arrfileticdelete),
    tabla = _('tblfiletic').tBodies[0];
    form = new FormData();
    oTic['IdNivelAtencion'] = IdNivelAtencion;
    oTic['IdResponsable'] = IdResponsable;
    oTic['IdTipoValorizacion'] = idtipovalorizacion;
    oTic['Comentario'] = comentario;
    form.append('par', par);
    form.append('pardetail', JSON.stringify(oRegister));
    form.append('parsubdetail', JSON.stringify(oTic));
    form.append('pararrfiletic', arrfileTic);
    form.append('pararrfileticdelete', arrfileTicDelete);

    //let totalarchivos = tabla.rows.length, arrFile = [];
    //for (let i = 0; i < totalarchivos; i++) {
        //let archivo = tabla.rows[i].cells[3].children[0].files[0];
        //archivo.modificado = 1;
        //form.append('file' + i, archivo);
    //}
    
    let totalarchivos = tabla.rows.length, arrFile = [];
    for (let i = 0; i < totalarchivos; i++) {
        let row = tabla.rows[i];
        let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];
        if (estamodificado == 1 && clsrow == undefined) {
            let archivo = tabla.rows[i].cells[3].children[0].files[0];
            //archivo.modificado = 1;
            form.append('file' + i, archivo);
        }
    }  

    Post(urlaccion, form, res_update);
}

function fn_getfiletic(_table) {
    let tbl = _(_table).tBodies[0], totalfilas = tbl.rows.length, row = null, arr = [];

    for (let i = 0; i < totalfilas; i++) {
        row = tbl.rows[i];
        let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];

        if (estamodificado == 1 && clsrow == undefined) {
            let obj = {
                idarchivo: parseInt(_par(par, 'idarchivo')),
                tipoarchivo: parseInt(_par(par, 'tipoarchivo')),
                nombrearchivooriginal: row.cells[1].innerText,
                modificado: parseInt(_par(par, 'modificado'))
            }
            arr.push(obj);
        }
    }
    return arr;
}

function fn_getfiltic_delete(_table) {
    let tbl = _(_table).tBodies[0], totalfilas = tbl.rows.length, row = null, arr = [];

    for (let i = 0; i < totalfilas; i++) {
        row = tbl.rows[i];
        let par = row.getAttribute('data-par'), clsrow = row.classList[0], idarchivo = parseInt(_par(par, 'idarchivo'));

        if (clsrow == 'hide' && idarchivo > 0) {
            let obj = {
                idarchivo: idarchivo,
                tipoarchivo: parseInt(_par(par, 'tipoarchivo')),
                nombrearchivooriginal: row.cells[1].innerText,
                modificado: parseInt(_par(par, 'modificado'))
            }
            arr.push(obj);
        }
    }
    return arr;
}

function fn_valid_file_tic(_table) {
    let tbl = _(_table).tBodies[0], totalfilas = tbl.rows.length, row = null, arr = [];

    for (let i = 0; i < totalfilas; i++) {
        row = tbl.rows[i];
        let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];

        if (clsrow == undefined) {
            let obj = {
                idarchivo: parseInt(_par(par, 'idarchivo')),
                tipoarchivo: parseInt(_par(par, 'tipoarchivo')),
                nombrearchivooriginal: row.cells[1].innerText,
                modificado: parseInt(_par(par, 'modificado'))
            }
            arr.push(obj);
        }
    }
    return arr;
}

function res_update(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Buen Trabajo!", text: "Usted ha actualizado esta solicitud correctamente", type: "success" });
            if (ovariables_detail.result != 'actual') {
                fn_return();
                //fn_returnedit();
            }
            else { fn_returnedit(); }
        };
        if (orpta.estado === 'error') {
            swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" });
        }
    }
}

(function ini() {
    load();
    req_infouser();
})();