var ovariables_guiacourier = {
    arrcourier: '',
    arrtipocourier: '',
    arrtipo: '',
    arrcliente: '',
    arrproveedor: '',
    arrotros: '',
    arrreponsable: '',
    arrasume: '',
    arrguiacourier: '',
}

function load() {
    $(".select2_courier").select2({
        placeholder: "Select Courier",
        allowClear: false
    });
    $(".select2_tipoenvio").select2({
        placeholder: "Select type Send",
        allowClear: false
    });
    $(".select2_tipo").select2({
        placeholder: "Select Tipo",
        allowClear: false
    });
    $(".select2_nombre").select2({
        placeholder: "Select Name",
        allowClear: false
    });
    $(".select2_responsable").select2({
        placeholder: "Select Responsible",
        allowClear: false
    });
    $(".select2_asume").select2({
        placeholder: "Select Assume",
        allowClear: false
    });

    formatTable();

    $('#cbotipo').on('change', load_nombre);
    _('btnsave').addEventListener('click', req_save);
    _('btnreturn').addEventListener('click', fn_return);
    _('btnagregar').addEventListener('click', req_add);

    _('btneditar').addEventListener('click', ver);
}

function req_add() {
    let req = _required({ id: 'divformulario', clase: '_enty' });
    let req2 = required_select2({ id: 'divformulario', clase: 'select2 _enty' });
    if (req || req2) {

    }
    else {
        swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" });
    }
}

function required_select2(oenty) {
    var divformulario = _(oenty.id);
    var elementsselect2 = divformulario.getElementsByClassName(oenty.clase);
    var array = Array.prototype.slice.apply(elementsselect2); //elementsselect2
    array.forEach(x=> {
        valor = x.value, padre = x.parentNode.parentNode;
        if (valor == '') { padre.classList.add('has-error'); }
        else { padre.classList.remove('has-error'); }
    })
}

function fn_validfile(sender) {
    fn_addrowdata();
}

function fn_addrowdata() {
    let url = 'Administration/GuiaCourier/GuiaCourier_Valid',
    file = _('inputFile').files[0];
    frm = new FormData();
    frm.append("archivo", file);
    Post(url, frm, res_data);
}

function ver() {
    var fila1 = document.getElementById('tableguiatemporal').tBodies[0].rows[1].children[5];
    var inputfila1 = document.getElementById('tableguiatemporal').tBodies[0].rows[1].children[5].innerHTML;

}

function res_data(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        let resultado = orpta, html = '', htmlbody = '';

        if (resultado.length > 0) {
            let oculto = _('tablaguiatemporalcontent').classList.contains('hide');
            if (oculto) { _('tablaguiatemporalcontent').classList.remove('hide'); }
        }

        //resultado.forEach(x=> {
        //    let data = x.IdTipoDato.split(',');
        //    let idtipo = data[0];
        //    let idtipodato = data[1];
        //    htmlbody += `
        //        <tr data-par='ReponsableWTS:${x.ResponsableWTS},IdTipo:${idtipo},IdTipoDato:${idtipodato}'>
        //            <td style='min-width: 5%; max-width: 5%;'>${x.NumeroGuia}</td>
        //            <td style='min-width: 5%; max-width: 5%;'>${x.Fecha}</td>
        //            <td style='min-width: 25%; max-width: 25%;'>${x.Descripcion}</td>
        //            <td style='min-width: 5%; max-width: 5%;'>${x.Peso}</td>
        //            <td style='min-width: 5%; max-width: 5%;'>${x.Neto}</td>
        //            <td style='min-width: 20%; max-width: 20%;'><input id='user' list='data' class='form-control' style='width:100%'></td>
        //            <td style='min-width: 15%; max-width: 15%;'><input id='user' list='data' class ='form-control' style='width:100%'></td>
        //            <td style='min-width: 20%; max-width: 20%;'><input id='user' list='data' class ='form-control' style='width:100%'></td>
        //            <td style='min-width: 15%; max-width: 15%;'><input id='user' list='data' class ='form-control' style='width:100%'></td>
        //        </tr>
        //    `
        //});

        resultado.forEach(x=> {
            let data = x.IdTipoDato.split(',');
            let idtipo = data[0];
            let idtipodato = data[1];
            htmlbody += `
                <tr data-par='ReponsableWTS:${x.ResponsableWTS},IdTipo:${idtipo},IdTipoDato:${idtipodato}'>
                    <td>${x.NumeroGuia}</td>
                    <td>${x.Fecha}</td>
                    <td>${x.Descripcion}</td>
                    <td>${x.Peso}</td>
                    <td>${x.Neto}</td>
                    <td><input id='user' list='data' class='form-control' style='width:100%'></td>
                    <td><input id='user' list='data' class ='form-control' style='width:100%'></td>
                    <td><input id='user' list='data' class ='form-control' style='width:100%'></td>
                    <td><input id='user' list='data' class ='form-control' style='width:100%'></td>
                </tr>
            `
        });



        _('tableguiatemporal').tBodies[0].innerHTML = htmlbody;
        //formatTable()
        load_info();
    }
}

function load_info() {
    let table = _('tableguiatemporal').tBodies[0], total = table.rows.length;
    for (var i = 0; i < total; i++) {
        row = table.rows[i], par = row.getAttribute('data-par'),
        idresponsable = _par(par, 'ReponsableWTS'),
        idtipo = _par(par, 'IdTipo'),
        idtipodato = _par(par, 'IdTipoDato');

        var arrayresponsable = Array.from(document.getElementById('data').options)
        let resultado = arrayresponsable.filter(x=>  x.getAttribute('data-value').toString() === idresponsable.toString());
        if (resultado.length > 0) { let name = resultado[0].value; row.children[5].children[0].value = name; }

    }
}

function formatTable() {
    $('#tableguiatemporal').DataTable({
        scrollY: "455px",
        scrollX: true,
        scrollCollapse: true,
        ordering: false,
        lengthChange: false,
        searching: false,
        info: false,
        bPaginate: false
        //fixedColumns: {
        //    leftColumns: 1,
        //}
    });
}


function load_responsablewts() {
    let arrreponsable = ovariables_guiacourier.arrreponsable,
        arrtipo = ovariables_guiacourier.arrtipo,
        arrasume = ovariables_guiacourier.arrasume;
    let table = _('tableguiatemporal').tBodies[0], total = table.rows.length;

    //let cboresponsablewts = `<option value='0'>Select</option>`,
    //       cboconsignatariowts = `<option value='0'>Select</option>`,
    //       cbonombrewts = `<option value='0'>Select</option>`,
    //       cboasumewts = ``;

    //let cboresponsablewtstotal = `<select id='cboresponsablewts' class='form-control' style='width:100%'>`;
    //if (arrreponsable.length > 0) {
    //    arrreponsable.forEach(x=> {
    //        cboresponsablewts += `<option value='${x.IdResponsable}'>${x.NombrePersonal}</option>`
    //    });
    //}

    //cboresponsablewtstotal = cboresponsablewtstotal + cboresponsablewts + `</select>`;

    for (var i = 0; i < total; i++) {
        row = table.rows[i], par = row.getAttribute('data-par'),
        idresponsable = _par(par, 'ReponsableWTS'),
        idtipo = _par(par, 'IdTipo'),
        idtipodato = _par(par, 'IdTipoDato');

        /*
        let cboresponsablewtstotal = `<select id='cboresponsablewts' class='form-control' style='width:100%'>`;
        if (arrreponsable.length > 0) {
            arrreponsable.forEach(x=> {
                cboresponsablewts += `<option value='${x.IdResponsable}'>${x.NombrePersonal}</option>`
            });
        }
        cboresponsablewtstotal = cboresponsablewtstotal + cboresponsablewts + `</select>`;
        */

        //row.children[6].innerHTML = cboresponsablewtstotal;
        //row.children[6].children[0].value = idresponsable;
        row.children[5].innerHTML = cboresponsablewtstotal;
        //row.children[5].children[0].value = idresponsable;

        /*
        let cboconsignatariowtstotal = `<select id='cboconsignatariowts' class='form-control _enty' style='width:100%' name='idtipowts' data-id='idtipowts' data-required='true'>`;
        if (arrtipo.length > 0) { arrtipo.forEach(x=> { cboconsignatariowts += `<option value ='${x.IdTipo}'>${x.Nombre}</option>`; }); }
        cboconsignatariowtstotal += cboconsignatariowts + `</select>`;
        //row.children[8].innerHTML = cboconsignatariowtstotal;
        //row.children[8].children[0].value = idtipo;
        row.children[6].innerHTML = cboconsignatariowtstotal;
        row.children[6].children[0].value = idtipo;
        
        let cbonombrewtstotal = `<select id='cbonombrewts' class='form-control _enty' style='width:100%' name='idtipodatawts' data-id='idtipodatawts' data-required='true'>`;        
        if (idtipo != '0') {
            if (idtipo == '1') { arrnombre = ovariables_guiacourier.arrproveedor; }
            else if (idtipo == '2') { arrnombre = ovariables_guiacourier.arrcliente; }
            else if (idtipo == '3') { arrnombre = ovariables_guiacourier.arrotros; }
            if (arrnombre.length > 0) { arrnombre.forEach(x=> { cbonombrewts += `<option value ='${x.IdTipoDato}'>${x.Descripcion}</option>`; }); }
        }
        cbonombrewtstotal += cbonombrewts + `</select>`;
        //row.children[9].innerHTML = cbonombrewtstotal;
        //row.children[9].children[0].value = idtipodato;
        row.children[7].innerHTML = cbonombrewtstotal;
        row.children[7].children[0].value = idtipodato;

        let cboasumewtstotal = `<select id='cboasumewts' class='form-control _enty' style='width:100%' name='idasumewts' data-id='idasumewts' data-required='true'>`;
        if (arrasume.length > 0) { arrasume.forEach(x=> { cboasumewts += `<option value ='${x.IdAsume}'>${x.Nombre}</option>`; }); }
        cboasumewtstotal += cboasumewts + `</select>`;
        //row.children[10].innerHTML = cboasumewtstotal;
        //row.children[10].children[0].value = 2;
        row.children[8].innerHTML = cboasumewtstotal;
        row.children[8].children[0].value = 1;
        */
    }
}

/*
function event_rows(e) {
    let o = e.currentTarget, row = o;
    fn_clean_rows();
    row.classList.add('row-selected');
}

function fn_clean_rows() {
    let array = Array.from(_('tableguiatemporal').tBodies[0].rows);
    array.some(x=> {
        if (x.classList.contains('row-selected'))
        { x.classList.remove('row-selected'); return true }
    });
}
*/

function fn_return() {
    let urlaccion = 'Administration/GuiaCourier/Index',
       urljs = 'Administration/GuiaCourier/Index';
    _Go_Url(urlaccion, urljs);
}

function req_save() {

}

function req_ini() {
    let urlaccion = 'Administration/GuiaCourier/GuiaCourier_List';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables_guiacourier.arrcourier = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables_guiacourier.arrtipocourier = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables_guiacourier.arrtipo = JSON.parse(orpta[2]); }
        if (JSON.parse(orpta[3] != '')) { ovariables_guiacourier.arrcliente = JSON.parse(orpta[3]); }
        if (JSON.parse(orpta[4] != '')) { ovariables_guiacourier.arrproveedor = JSON.parse(orpta[4]); }
        if (JSON.parse(orpta[5] != '')) { ovariables_guiacourier.arrotros = JSON.parse(orpta[5]); }
        if (JSON.parse(orpta[6] != '')) { ovariables_guiacourier.arrreponsable = JSON.parse(orpta[6]); }
        if (JSON.parse(orpta[7] != '')) { ovariables_guiacourier.arrasume = JSON.parse(orpta[7]); }
        if (JSON.parse(orpta[8] != '')) { ovariables_guiacourier.arrguiacourier = JSON.parse(orpta[8]); }

        load_courier();
        load_tipoenvio();
        load_tipo();
        load_nombre();
        load_responsable();
        load_asume();
        load_datalistResponsable();
    }
}

function load_courier() {
    let arrcourier = ovariables_guiacourier.arrcourier;
    let cbocourier = `<option></option>`;

    if (arrcourier.length > 0) {
        arrcourier.forEach(x=> { cbocourier += `<option value ='${x.IdCourier}'>${x.NombreCourier}</option>`; });
    }
    _('cbocourier').innerHTML = cbocourier;
    $("#cbocourier").select2("val", "0");
}

function load_tipoenvio() {
    let arrtipoenvio = ovariables_guiacourier.arrtipocourier;
    let cbotipoenvio = `<option></option>`;

    if (arrtipoenvio.length > 0) {
        arrtipoenvio.forEach(x=> { cbotipoenvio += `<option value ='${x.IdTipoEnvio}'>${x.NombreEnvio}</option>`; });
    }
    _('cbotipoenvio').innerHTML = cbotipoenvio;
    $("#cbotipoenvio").select2("val", "0");
}

function load_tipo() {
    let arrtipo = ovariables_guiacourier.arrtipo;
    let cbotipo = `<option></option>`;

    if (arrtipo.length > 0) {
        arrtipo.forEach(x=> { cbotipo += `<option value ='${x.IdTipo}'>${x.Nombre}</option>`; });
    }
    _('cbotipo').innerHTML = cbotipo;
    $("#cbotipo").select2("val", "0");
}

function load_nombre() {
    let tipo = _('cbotipo').value;
    let cbonombre = `<option></option>`;
    let arrnombre = '';

    if (tipo != '0') {
        if (tipo == '1') {
            arrnombre = ovariables_guiacourier.arrproveedor;
        }
        else if (tipo == '2') {
            arrnombre = ovariables_guiacourier.arrcliente;
        }
        else if (tipo == '3') {
            arrnombre = ovariables_guiacourier.arrotros;
        }

        if (arrnombre.length > 0) {
            arrnombre.forEach(x=> { cbonombre += `<option value ='${x.IdTipoDato}'>${x.Descripcion}</option>`; });
        }
    }

    _('cbonombre').innerHTML = cbonombre;
    $("#cbonombre").select2("val", "0");
}

function load_responsable() {
    let arrreponsable = ovariables_guiacourier.arrreponsable;
    let cboresponsable = `<option></option>`;

    if (arrreponsable.length > 0) {
        arrreponsable.forEach(x=> {
            cboresponsable += `<option value='${x.IdResponsable}'>${x.NombrePersonal}</option>`;
        });
    }
    _('cboresponsable').innerHTML = cboresponsable;
    $("#cboresponsable").select2("val", "0");
}

function load_asume() {
    let arrasume = ovariables_guiacourier.arrasume;
    let cboasume = `<option></option>`;

    if (arrasume.length > 0) {
        arrasume.forEach(x=> { cboasume += `<option value ='${x.IdAsume}'>${x.Nombre}</option>`; });
    }
    _('cboasume').innerHTML = cboasume;
    $("#cboasume").select2("val", "0");
}

function load_datalistResponsable() {
    let arrreponsable = ovariables_guiacourier.arrreponsable;
    let cboresponsablewts = '';
    let datalist = `<datalist id='data'>`
    if (arrreponsable.length > 0) {
        arrreponsable.forEach(x=> {
            cboresponsablewts += `<option data-value='${x.IdResponsable}' value='${x.NombrePersonal}'>`
        });
    }
    datalist = datalist + cboresponsablewts + `</datalist>`

    _('inforesponsable').innerHTML = datalist;
}

(function ini() {
    load();
    req_ini();
})()