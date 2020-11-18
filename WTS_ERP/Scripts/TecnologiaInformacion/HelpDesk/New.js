//Luis
var ovariables = {
    dataini: '',
    estadoinitial: '',
    idequipotic: '',
    idtiposolicitud: '',
    infopersonal: '',
    idestado:'',
    infopersonalidpersonal: '',
    infopersonalidarea: '',
    infohelpdesk: '',
    infohelpdeskejecutor:'',
    infoaprobadorxmodulo:'',
    infoaprobadorxarea: '',
    arrequipotic: '',
    arrtiposolicitud: '',
    arrprioridad: '',
    arrmodulo: '',
    arraprobadorxmodulo:'',
    arrcategoria:'',
    arraprobadorxarea: '',
    contador: 0,
    arrpersonal:'',
}

function load(){
    var txtpar = _('txtpar'), par = txtpar.value;
    var valores = txtpar.value.split('¬');

    var param = { Estado: valores[0], IdEquipoTIC: valores[1], IdTipoSolicitud: valores[2] };
    ovariables.dataini = JSON.stringify(param);
    let data = JSON.parse(ovariables.dataini);
    ovariables.estadoinitial = data.Estado;
    ovariables.idequipotic = data.IdEquipoTIC;
    ovariables.idtiposolicitud = data.IdTipoSolicitud;

    fn_getDate();

    _('cboEquipoTIC').addEventListener('change', fn_load_detxequi);
    _('cboTipoSolicitud').addEventListener('change', fn_load_detxsol);

    _('cboSistema').addEventListener('change', fn_load_modulo);
    _('cboModulo').addEventListener('change', fn_load_aprobadorxmodulo);
    _('fileUser').addEventListener('change', fn_change_file_user);
    _('cboCategoria').addEventListener('change', fn_change_categoria);

    _('cboSolicitante').addEventListener('change', fn_change_personal);
}

function fn_change_personal() {
    let id = _('cboSolicitante').value;

    let result = ovariables.arrpersonal.filter(x=>  x.IdPersonal.toString() === id);

    ovariables.infopersonalidpersonal = result[0].IdPersonal;
    ovariables.infopersonalidarea = result[0].IdArea;
    _('txtArea').value = result[0].NombreArea;
    fn_load_detxsol();
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
    _('txtFechaSolicitud').value = resultado;
}

function fn_return() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/Index';
    _Go_Url(urlaccion, urlaccion);
}

function fn_valid_cabecera() {
    let htmltitulo = '';
    let htmlbotonera = '';
    if (ovariables.estadoinitial == '0') {
        htmltitulo = `<h3 id="_title" class="text-navy bold">Nuevo</h3>`;
        htmlbotonera = `<button type='button' class='btn btn-primary' id='btnSave' onclick='fn_save()'>
                        <span class="fa fa-save"></span>
                        Guardar
                    </button>
                    <button type='button' class='btn btn-default' id='btnReturn' onclick='fn_return()'>
                        <span class='fa fa-reply-all'></span>
                        Retornar
                    </button>`;
        _('tabTic').style.display = 'none';
        _('tabHistorial').style.display = 'none';
    }
    _('divTitulo').innerHTML = htmltitulo;
    _('divBotones').innerHTML = htmlbotonera;
}

// Archivo
function fn_change_file_user(e) {
    let archivo = this.value;
    if (archivo != '') {
        let contador = fn_getfileuser('tblfileuser');
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
                                <button type='button' class ='btn btn-link _download hide'>Download</button>
                            </div>
                        </td>
                        <td class='hide'></td>
                    </tr>`;

            _('tblfileuser').tBodies[0].insertAdjacentHTML('beforeend', html);

            let tbl = _('tblfileuser').tBodies[0], total = tbl.rows.length;
            let filexd = _('fileUser').cloneNode(true);
            filexd.setAttribute('id', 'file' + (total - 1));
            tbl.rows[total - 1].cells[3].appendChild(filexd);
            handlerTblFileUser_add(total);
        }
        else { swal({ title: 'Alert', text: 'Usted puede cargar como máximo 2 archivos', type: 'warning' }); }
    }
}

function handlerTblFileUser_add(indice) {
    let tbl = _('tblfileuser'), rows = tbl.rows[indice]; 
    rows.getElementsByClassName('_deletefile')[0].addEventListener('click', e => {
        controladortblfileuser(e, 'drop');
    });
    rows.getElementsByClassName('_download')[0].addEventListener('click', e => {
        controladortblfileuser(e, 'download');
    });
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
        case 'drop':
            fila.classList.add('hide');
            break;
        case 'download':
            downloadfileuser(fila);
            break;
    }
}

function downloadfileuser(fila) {
    /*
    let par = fila.getAttribute('data-par');
    let nombrearchivooriginal = fila.cells[1].innerText, nombrearchivogenerado = _par(par, 'nombrearchivogenerado');
    let urlaccion = '../GestionProducto/Requerimiento/DescargaArchivo?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivoGenerado=' + nombrearchivogenerado;

    var link = document.createElement('a');
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;*/
}

// Obtener Data
function req_infouser() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Info';
    Get(urlaccion, res_infouser);
}

function res_infouser(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) {ovariables.infopersonal = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables.infohelpdesk = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables.infoaprobadorxmodulo = JSON.parse(orpta[2]); }
        if (JSON.parse(orpta[3] != '')) { ovariables.infoaprobadorxarea = JSON.parse(orpta[3]); }
        fn_getinfopersonal(ovariables.infopersonal, ovariables.infohelpdesk, ovariables.infoaprobadorxmodulo, ovariables.infoaprobadorxarea);
        fn_valid_cabecera();
        req_ini();
    }
}

function fn_getinfopersonal(_infopersonal, _infohelpdesk, _infoapromodulo, _infoaproarea) {
    let infopersonal = _infopersonal[0];

    if (ovariables.infohelpdesk == '') {
        ovariables.infopersonalidpersonal = infopersonal.IdPersonal;
        ovariables.infopersonalidarea = infopersonal.IdArea;
        _('txtSolicitante').classList.remove('hide');
        _('txtSolicitante').value = infopersonal.NombrePersonal;
        _('txtArea').value = infopersonal.NombreArea;
    }
    else {
        _('cboSolicitante').classList.remove('hide');
        ovariables.infopersonalidpersonal = infopersonal.IdPersonal;
        ovariables.infopersonalidarea = infopersonal.IdArea;
        _('txtArea').value = infopersonal.NombreArea;
    }

    let infohelpdesk = _infohelpdesk[0] != null ? _infohelpdesk[0] : '0';
    ovariables.infohelpdeskejecutor = infohelpdesk.IdGrupoEjecutor != null ? infohelpdesk.IdGrupoEjecutor : infohelpdesk;
}

function req_ini() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Master';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables.arrequipotic = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables.arrtiposolicitud = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables.arrprioridad = JSON.parse(orpta[2]); }
        if (JSON.parse(orpta[3] != '')) { ovariables.arrmodulo = JSON.parse(orpta[3]); }
        if (JSON.parse(orpta[4] != '')) { ovariables.arraprobadorxmodulo = JSON.parse(orpta[4]); }
        if (JSON.parse(orpta[5] != '')) { ovariables.arrcategoria = JSON.parse(orpta[5]); }
        if (JSON.parse(orpta[6] != '')) { ovariables.arraprobadorxarea = JSON.parse(orpta[6]); }
        if (JSON.parse(orpta[10] != '')) { ovariables.arrpersonal = JSON.parse(orpta[10]); }
        fn_load_equipotic(ovariables.arrequipotic);
        fn_load_tiposolicitud(ovariables.arrtiposolicitud);
        fn_load_prioridad(ovariables.arrprioridad);       
        fn_load_detxequi();
        fn_load_personal();
    }
}

// Mostrar Data
function fn_load_equipotic(_arrequipotic) {
    let cboequipotic = '';
    if (_arrequipotic.length > 0) {
        _arrequipotic.forEach(x=> { cboequipotic += `<option value='${x.IdEquipoTIC}'>${x.EquipoTIC}</option>`; });
        _('cboEquipoTIC').innerHTML = cboequipotic;
        _('cboEquipoTIC').value = ovariables.idequipotic;
    }
    else {
        cboequipotic = '<option value="0"> -- Seleccione Equipo TIC -- </option>';
        _('cboEquipoTIC').innerHTML = cboequipotic;
    }
}

function fn_load_tiposolicitud(_arrtiposolicitud) {
    let cbotiposolicitud = '';
    if (_arrtiposolicitud.length > 0) {       
        _arrtiposolicitud.forEach(y=> { cbotiposolicitud += `<option value='${y.IdTipoSolicitud}'>${y.TipoSolicitud}</option>`; });
        _('cboTipoSolicitud').innerHTML = cbotiposolicitud;
        _('cboTipoSolicitud').value = ovariables.idtiposolicitud;
    }
    else {
        cbotiposolicitud = '<option value="0"> -- Seleccione Tipo Solicitud -- </option>';
        _('cboTipoSolicitud').innerHTML = cbotiposolicitud;
    }
}

function fn_load_prioridad(_arrprioridad) {
    let cboprioridad = '';
    if (_arrprioridad.length > 0) {
        _arrprioridad.forEach(w=> { cboprioridad += `<option value='${w.IdPrioridad}'>${w.Prioridad}</option>`; })
        _('cboPrioridad').innerHTML = cboprioridad;
    } else {
        cboprioridad = `<option value='0'> -- Seleccione Tipo Prioridad -- </option>`;
        _('cboPrioridad').innerHTML = cboprioridad;
    }
}

function fn_load_categoria() {
    let arrcategoria = [];
    if (ovariables.infohelpdesk == '') { arrcategoria = ovariables.arrcategoria.filter(x=>x.Visualizacion === 0); }
    else { arrcategoria = ovariables.arrcategoria; }

    let idequipotic = _('cboEquipoTIC').value;
    let idtiposolicitud = _('cboTipoSolicitud').value;
    let cbocategoria = `<option value> -- Seleccione Categoria -- </option>`;
    if (arrcategoria.length > 0) {
        let result = arrcategoria.filter(x=>x.IdEquipoTIC.toString() === idequipotic && x.IdTipoSolicitud.toString() === idtiposolicitud && x.Estado === 0);
        result.forEach(x=> { cbocategoria += `<option value='${x.IdCategoria}'>${x.Categoria}</option>`; });
    }
    _('cboCategoria').innerHTML = cbocategoria;    
}

function fn_view_descripcion() {
    let idcategoria = _('cboCategoria').value;
    if (idcategoria != '0') {
        let result = ovariables.arrcategoria.filter(z=>z.IdCategoria.toString() === idcategoria);
        let categoria = _('cboCategoria').options[_('cboCategoria').selectedIndex].text;
        let descripcion = result[0].Descripcion;
        swal({ title: categoria, text: descripcion });
    }
}

function fn_load_detxequi() {
    let idequipotic = _('cboEquipoTIC').value;
    let idtiposolicitud = _('cboTipoSolicitud').value;
    fn_load_categoria();
    if (idequipotic == '1') {
        _('rowSistema').style.display = 'block';
        _('rowModulo').style.display = 'block';
        fn_load_sistema();

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

function fn_load_detxsol() {
    let idequipotic = _('cboEquipoTIC').value;
    let idtiposolicitud = _('cboTipoSolicitud').value;
    ovariables.idtiposolicitud = idtiposolicitud;
    fn_load_categoria();
    if (idequipotic == '1') {
        fn_load_aprobadorxmodulo();
    }
    else if (idequipotic == '2') {
        fn_load_aprobadorxarea();
    }
}

function fn_load_sistema() {
    let htmlsistema = `<option value='1' selected>ERP</option><option value='2'>Intranet</option><option value='3'>Página Web WTS</option>`;
    _('cboSistema').innerHTML = htmlsistema;
    fn_load_modulo();
}

function fn_load_modulo() {
    let cbomodulo = `<option value> -- Seleccione Módulo -- </option>`;
    if (ovariables.arrmodulo.length > 0) {
        let idsistema = _('cboSistema').value;
        let result = ovariables.arrmodulo.filter(x=>x.IdSistema.toString() === idsistema);
        result.forEach(x=> { cbomodulo += `<option value='${x.IdModulo}'>${x.Nombre}</option>`; });
        _('cboModulo').innerHTML = cbomodulo;
    } else { cbomodulo = `<option value='0'> -- Seleccione Módulo -- </option>`; }
    fn_load_aprobadorxmodulo();

}

function fn_load_aprobadorxmodulo() {
    let idtiposolicitud = _('cboTipoSolicitud').value;
    let array = '';
    if (idtiposolicitud == '2') {
        let idsistema = _('cboSistema').value;
        let idmodulo = _('cboModulo').value;
        //let array = ovariables.arraprobadorxmodulo;
        array = ovariables.arraprobadorxmodulo.filter(x=>x.EstadoAprobador === 0 && x.Estado === 0);
        let idcategoria = _('cboCategoria').value, categoriafirmada = '';
        categoriafirmada = idcategoria !== '' ? (ovariables.arrcategoria.filter(x=> x.IdCategoria.toString() === idcategoria && x.IdTipoSolicitud.toString() === idtiposolicitud))[0].Aprobacion : 2;

        if (array.length > 0) {
            _('tablaAprobador').style.display = 'block';
            let firmado = '';
            let estadofirma = 0;
            let html = '';
            let result = array.filter(y=> y.IdSistema.toString() === idsistema && y.IdModulo.toString() === idmodulo);

            result.forEach(x=> {
                if (x.IdPersonal.toString() == ovariables.infopersonalidpersonal.toString() || categoriafirmada == 1) {
                    estadofirma = 1;
                    firmado = '<button class="btn btn-outline btn-primary"><span class ="fa fa-check-circle"></span></button>';
                } else {
                    estadofirma = 0;
                    firmado = '<button class="btn btn-outline btn-danger"><span class ="fa fa-clock-o"></span></button>';
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
        array = ovariables.arraprobadorxarea.filter(x=>x.EstadoAprobador === 0 && x.Estado === 0);       
        if (array.length > 0) {
            _('tablaAprobador').style.display = 'block';
            let firmado = '', html = '', categoriafirmada = '';
            let result = array.filter(y=>y.IdArea.toString() === ovariables.infopersonalidarea.toString());

            categoriafirmada = idcategoria !== '' ? (ovariables.arrcategoria.filter(x=> x.IdCategoria.toString() === idcategoria))[0].Aprobacion : 2;
                        
            result.forEach(x=> {
                if (x.IdPersonal.toString() == ovariables.infopersonalidpersonal.toString() || categoriafirmada == 1) {
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

function fn_change_categoria() {
    let idequipotic = _('cboEquipoTIC').value;
    //if (idequipotic == '2') {
    //    fn_load_aprobadorxarea();
    //}
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

function fn_load_personal() {
    let arrpersonal = ovariables.arrpersonal;
    let cbopersonal = ``;
    if (arrpersonal.length > 0) {
        arrpersonal.forEach(x=> { cbopersonal += `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`; });
    }
    _('cboSolicitante').innerHTML = cbopersonal;
    _('cboSolicitante').value = ovariables.infopersonalidpersonal;
}

// Ejecucion 
function fn_save() {

    var arr2 = [...document.getElementsByClassName('has-error')]
    arr2.forEach(x=>x.classList.remove('has-error'));

    let idequipotic = _('cboEquipoTIC').value;
    if (idequipotic == "2") { _('cboModulo').classList.remove('_enty'); } else { _('cboModulo').classList.add('_enty'); }

    let req = _required({ id: 'tab-registro', clase: '_enty' });
    if (req) {
        swal({
            title: "Esta seguro de guardar los datos ingresados?",
            text: "",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            req_new();
        });
    } else {
        swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" });
    }
}

function req_new() {
    ovariables.contador = 1;
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Insert';
    ovariables.idestado = '2';
    let idaccion = '1';
    var tablaaprobador = [];

    if (ovariables.idtiposolicitud == '2') {
        ovariables.idestado = '1';
        tablaaprobador = fn_get_aprobador('detalleTablaAprobador');
    }

    let oSolicitud = _getParameter({ id: 'tab-registro', clase: '_enty' })
    , arrAprobador = JSON.stringify(tablaaprobador)
    arrfileUser = JSON.stringify(fn_getfileuser('tblfileuser'));
    tabla = _('tblfileuser').tBodies[0];
    form = new FormData();
    oSolicitud['IdEstado'] = ovariables.idestado;
    oSolicitud['IdAccion'] = idaccion;
    oSolicitud['UsuarioSolicitante'] = ovariables.infopersonalidpersonal;
    oSolicitud['AreaSolicitante'] = ovariables.infopersonalidarea;
    form.append('par', JSON.stringify(oSolicitud));
    form.append('pararraprobador', arrAprobador);
    form.append('pararrfileuser', arrfileUser);

    let totalarchivos = tabla.rows.length, arrFile = [];
    for (let i = 0; i < totalarchivos; i++) {
        let row = tabla.rows[i];
        let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];
        if (estamodificado == 1 && clsrow == undefined) {
            let archivo = tabla.rows[i].cells[3].children[0].files[0];
            archivo.modificado = 1;
            form.append('file' + i, archivo);
        }
    }  

    Post(urlaccion, form, res_new);
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
        if (x) { ovariables.idestado = 2 } else { ovariables.idestado = 1; }
    }
    return arrayresult;
}

function fn_getfileuser(table) {
    let tbl = _(table).tBodies[0], totalfilas = tbl.rows.length, row = null, arr = [];

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

function res_new(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Buen Trabajo!", text: "Usted ha registrado una nueva solicitud correctamente", type: "success" });
            fn_return();
        };
        if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }        
    }
}

(function ini() {
    load();
    req_infouser();
})();