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
    arrresultado: '',
    item: '0'
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

    $('.input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });

    _('btnsave').addEventListener('click', req_save);
    _('btnreturn').addEventListener('click', fn_return);


    $('#cbotipo').on('change', load_nombre);



}


/* General */
function fn_getDate() {
    let odate = new Date();
    let mes = odate.getMonth() + 1;
    let day = odate.getDate();
    let anio = odate.getFullYear();
    if (day < 10) { day = '0' + day }
    if (mes < 10) { mes = '0' + mes }
    let envio = `${mes}/${day}/${anio}`;
    _('txtfechahasta').value = envio;
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

function event_rows(e) {
    let o = e.currentTarget, row = o;
    let par = o.getAttribute('data-par');
    let existe = _par(par, 'Existe');
    ovariables_guiacourier.item = _par(par, 'Item');
    _('idnumero').innerHTML = _par(par, 'NumeroGuia');
    fn_clean_rows();
    if (existe == '1') { row.classList.remove('text-danger'); }
    row.classList.add('row-selected');
}

function fn_clean_rows() {
    let array = Array.from(_('tableguiatemporal').tBodies[0].rows);

    array.some(x=> {
        let attribute = x.getAttribute('data-par');
        let existe = _par(attribute, 'Existe');
        if (existe == "1") { x.classList.add('text-danger'); }
        if (x.classList.contains('row-selected')) { x.classList.remove('row-selected'); return true }
    });
}

function req_delete() {
    if (ovariables_guiacourier.item != '0') {
        let item = ovariables_guiacourier.item;
        let fila = _('tableguiatemporal').rows[item];
        fila.classList.add('hide');
        ovariables_guiacourier.item = '0';
        _('idnumero').innerHTML = '';
    } else {
        swal({ title: "Alert", text: "You have select a register", type: "warning" });
    }
}

function req_clean(_false) {
    fn_disabled(_false);
}

function fn_disabled(_val) {
    if (_val == false) {
        _('fileSelected').value = '';
        _('inputFile').value = '';
        var tbl = document.getElementById('tablaguiatemporalcontent');
        tbl.children[0].remove(tbl);
        _('idnumero').innerHTML = '';
        req_ini();
    }
    _('inputFile').disabled = _val;
}

function fn_valid_exist(_table) {
    let resultado = false;
    let table = _(_table).tBodies[0], totalfilas = table.rows.length, row = null, arrayresult = [];
    for (let i = 0; i < totalfilas; i++) {
        row = table.rows[i];

        let par = row.getAttribute('data-par'), clsrow = row.classList;
        existe = _par(par, 'Existe');
        let hide = false;
        if (clsrow.contains('hide')) { hide = true }

        if (existe == '1' && hide == false) {
            resultado = true;
            return resultado;
        }
    }
    return resultado;
}

function fn_valid_data_completa(_table) {
    let resultado = false;
    let table = _(_table).tBodies[0], totalfilas = table.rows.length, row = null, arrayresult = [];
    for (let i = 0; i < totalfilas; i++) {
        row = table.rows[i];

        let par = row.getAttribute('data-par'), clsrow = row.classList;
        existe = _par(par, 'Existe'), idcourier = _par(par, 'IdCourier'),
         idtipoenvio = _par(par, 'IdTipoEnvio'), responsablewts = _par(par, 'ResponsableWTS'),
         idtipo = _par(par, 'IdTipo'), idtipodata = _par(par, 'IdTipoDato'),
         idasume = _par(par, 'IdAsume'), item = _par(par, 'Item');
        let hide = false;
        if (clsrow.contains('hide')) { hide = true }

        //if ((existe == '0' && hide == false) && (idcourier == '0' || idtipoenvio == '0' || responsablewts == '0' || idtipo == '0' || idtipodata == '0' || idasume == '0')) {

        //    resultado = true;
        //    //return resultado;
        //}
        if (existe == '0' && hide == false) {
            if (idcourier == '0' || idtipoenvio == '0' || responsablewts == '0' || idtipo == '0' || idtipodata == '0' || idasume == '0') {
                row.classList.add('text-success');
                resultado = true;
            }
            else {
                row.classList.remove('text-success');
            }
        }
    }
    return resultado;
}

function soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return (key >= 48 && key <= 57)
}

/* Tab Grupal */

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

function res_data(response) {
    let orpta = response != '' ? JSON.parse(response) : null;
    if (orpta != null) {
        ovariables_guiacourier.arrresultado = orpta;
        req_load_data();
    }
    else {
        swal({ title: "There are a problem!", text: "Please, verify the file to upload", type: "error" });
        _('fileSelected').value = '';
        _('inputFile').value = '';
    }
}

function req_load_data() {
    let arrresultado = ovariables_guiacourier.arrresultado;
    let guia = _('txtnumeroguia').value;
    let resultado = arrresultado.filter(x=>x.NumeroGuia.indexOf(guia) > -1);
    load_data(resultado);
}

function load_data(_resultado) {
    let resultadoguia = _resultado, html = '', htmlbody = '';
    let item = 0;
    html = `
        <table id="tableguiatemporal" class ="stripe row-border order-column" style="width:150%; max-width: 150%;">
        <thead>
            <tr>
                <th>AWB</th>
                <th>Date</th>
                <th>Description</th>
                <th class='hide'>Weigth</th>
                <th>Neto</th>
                <th>Courier</th>
                <th>Expo/Impo</th>
                <th>Ship by-  Courier</th>
                <th>Ship by - WTS</th>
                <th>Client/Supplier/Others - Courier</th>
                <th>Type</th>
                <th>Client/Supplier/Others - WTS</th>
                <th>Assume</th>
            </tr>
        </thead>
        <tbody>
    `;


    resultadoguia.forEach(x=> {
        item = item + 1;
        let data = x.IdTipoDato.split(','), idtipo = data[0], idtipodato = data[1];
        if (x.Existe.toString() == '1') {
            htmlbody += `<tr data-par='Item:${item},NumeroGuia:${x.NumeroGuia},Existe:${x.Existe},IdCourier:${x.IdCourier},IdTipoEnvio:${x.IdTipoEnvio},ResponsableWTS:${x.ResponsableWTS},IdTipo:${idtipo},IdTipoDato:${idtipodato},IdAsume:${x.IdAsume},Peso:${x.Peso}' class='text-danger font-bold' onclick='event_rows(event)'>`;
        }
        else {
            htmlbody += `<tr data-par='Item:${item},NumeroGuia:${x.NumeroGuia},Existe:${x.Existe},IdCourier:${x.IdCourier},IdTipoEnvio:${x.IdTipoEnvio},ResponsableWTS:${x.ResponsableWTS},IdTipo:${idtipo},IdTipoDato:${idtipodato},IdAsume:${x.IdAsume},Peso:${x.Peso}' onclick='event_rows(event)'>`;
        }


        htmlbody += `
                <td>${x.NumeroGuia}</td>
                <td>${x.Fecha}</td>
                <td>${x.Descripcion}</td>
                <td class ='hide'></td>
                <td>${x.Neto}</td>
                <td><input id='inputcourier' list='datacourier' onchange='change_cboDataTable(this)' class ='form-control' style='width:100%'></td>
                <td><input id='inputtipoenvio' list='datatipoenvio' onchange='change_cboDataTable(this)' class ='form-control' style='width:100%'></td>
                <td>${x.Responsable}</td>
                <td><input id='inputresponsable' list='dataresponsable' onchange='change_cboDataTable(this)' class ='form-control' style='width:100%'></td>
                <td>${x.Consignatario}</td>
                <td><input id='inputtipo' list='datatipo' onchange='change_cboDataTable(this)' class ='form-control' style='width:100%'></td>
                <td><input id='inputtipodata' list='datashipby' onchange='change_cboDataTable(this)' class ='form-control' style='width:100%'></td>
                <td><input id='inputasume' list='dataasume' onchange='change_cboDataTable(this)' class ='form-control' style='width:100%'></td>
            </tr>
        `
    });

    html += htmlbody + '</tbody></table>';
    _('tablaguiatemporalcontent').innerHTML = html;
    fn_disabled(true);
    formatTable()
    load_info();
}

function load_info() {
    let table = _('tableguiatemporal').tBodies[0], total = table.rows.length;
    for (var i = 0; i < total; i++) {
        row = table.rows[i], par = row.getAttribute('data-par'),
        existe = _par(par, 'Existe'),
        idcourier = _par(par, 'IdCourier'),
        idtipoenvio = _par(par, 'IdTipoEnvio'),
        idresponsable = _par(par, 'ResponsableWTS'),
        idtipo = _par(par, 'IdTipo'),
        idtipodato = _par(par, 'IdTipoDato');
        idasume = _par(par, 'IdAsume');

        if (existe == '0') {

            var arraycourier = Array.from(document.getElementById('datacourier').options)
            let resultadocourier = arraycourier.filter(z=> z.getAttribute('data-value').toString() === idcourier.toString());
            if (resultadocourier.length > 0) {
                let name = resultadocourier[0].value; row.children[5].children[0].value = name;
            }

            var arraytipoenvio = Array.from(document.getElementById('datatipoenvio').options)
            let resultadotipoenvio = arraytipoenvio.filter(z=> z.getAttribute('data-value').toString() === idtipoenvio.toString());
            if (resultadotipoenvio.length > 0) {
                let name = resultadotipoenvio[0].value; row.children[6].children[0].value = name;
            }

            var arrayresponsable = Array.from(document.getElementById('dataresponsable').options)
            let resultadoresponsable = arrayresponsable.filter(v=>  v.getAttribute('data-value').toString() === idresponsable.toString());
            if (resultadoresponsable.length > 0) {
                let name = resultadoresponsable[0].value; row.children[8].children[0].value = name;
            }

            var arraytipo = Array.from(document.getElementById('datatipo').options)
            let resultadotipo = arraytipo.filter(x=>  x.getAttribute('data-value').toString() === idtipo.toString());
            if (resultadotipo.length > 0) {
                let name = resultadotipo[0].value; row.children[10].children[0].value = name;
            }

            if (idtipo != '0') {
                if (idtipo == '1') {
                    var arrayproveedor = Array.from(document.getElementById('dataproveedor').options)
                    let resultadoproveedor = arrayproveedor.filter(y=>  y.getAttribute('data-value').toString() === idtipodato.toString());
                    if (resultadoproveedor.length > 0) {
                        let name = resultadoproveedor[0].value;
                        row.children[11].innerHTML = `<input id='inputtipodata' list='dataproveedor' class ='form-control' style='width:100%'>`;
                        row.children[11].children[0].value = name;
                    }
                }
                else if (idtipo == '2') {
                    var arraycliente = Array.from(document.getElementById('datacliente').options)
                    let resultadocliente = arraycliente.filter(y=>  y.getAttribute('data-value').toString() === idtipodato.toString());
                    if (resultadocliente.length > 0) {
                        let name = resultadocliente[0].value;
                        row.children[11].innerHTML = `<input id='inputtipodata' list='datacliente' class ='form-control' style='width:100%'>`;
                        row.children[11].children[0].value = name;
                    }
                }
                else if (idtipo == '3') {
                    var arrayotros = Array.from(document.getElementById('dataotros').options)
                    let resultadootros = arrayotros.filter(y=>  y.getAttribute('data-value').toString() === idtipodato.toString());
                    if (resultadootros.length > 0) {
                        let name = resultadootros[0].value;
                        row.children[11].innerHTML = `<input id='inputtipodata' list='dataotros' class ='form-control' style='width:100%'>`;
                        row.children[11].children[0].value = name;
                    }
                }
            }

            var arrayasume = Array.from(document.getElementById('dataasume').options)
            let resultadoasume = arrayasume.filter(z=>  z.getAttribute('data-value').toString() === idasume.toString());
            if (resultadoasume.length > 0) {
                let name = resultadoasume[0].value; row.children[12].children[0].value = name;
            }
        }
    }
}

function formatTable() {

    $('#tableguiatemporal').DataTable({
        scrollY: "325px",
        scrollX: true,
        scrollCollapse: true,
        ordering: false,
        lengthChange: false,
        searching: false,
        info: false,
        bPaginate: false
    });
}

function change_cboDataTable(_dato) {
    var id = _dato.getAttribute('id')
    let nombretipo = _dato.value;
    let row = _dato.parentNode.parentNode.rowIndex - 1;
    let column = _dato.parentNode.cellIndex;
    let tabla = _('tableguiatemporal').tBodies[0];
    let attribute = _dato.parentNode.parentNode.getAttribute('data-par');
    let numeroguia = _par(attribute, 'NumeroGuia'),
        existe = _par(attribute, 'Existe'), idcourier = _par(attribute, 'IdCourier'),
        idtipoenvio = _par(attribute, 'IdTipoEnvio'), responsablewts = _par(attribute, 'ResponsableWTS'),
        idtipo = _par(attribute, 'IdTipo'), idtipodata = _par(attribute, 'IdTipoDato'),
        idasume = _par(attribute, 'IdAsume'), item = _par(attribute, 'Item'),
        peso = _par(attribute, 'Peso');

    if (existe == '0') {

        if (id == 'inputcourier') {
            let arraycourier = Array.from(document.getElementById('datacourier').options);
            let resultadocourier = arraycourier.filter(x=>  x.value === nombretipo);
            if (resultadocourier.length > 0) {
                idcourier = resultadocourier[0].getAttribute('data-value');
                tabla.rows[row].classList.remove('text-success');
            }
            else {
                idcourier = '0';
                tabla.rows[row].classList.add('text-success');
            }
        }
        else if (id == 'inputtipoenvio') {
            let arraytipoenvio = Array.from(document.getElementById('datatipoenvio').options);
            let resultadotipoenvio = arraytipoenvio.filter(x=>  x.value === nombretipo);
            if (resultadotipoenvio.length > 0) {
                idtipoenvio = resultadotipoenvio[0].getAttribute('data-value');
                tabla.rows[row].classList.remove('text-success');
            }
            else {
                idtipoenvio = '0';
                tabla.rows[row].classList.add('text-success');
            }
        }
        else if (id == 'inputresponsable') {
            let arrayresponsable = Array.from(document.getElementById('dataresponsable').options);
            let resultadoresponsable = arrayresponsable.filter(x=>  x.value === nombretipo);

            if (resultadoresponsable.length > 0) {
                responsablewts = resultadoresponsable[0].getAttribute('data-value');
                tabla.rows[row].classList.remove('text-success');
            }
            else {
                responsablewts = '0';
                tabla.rows[row].classList.add('text-success');
            }
        }
        else if (id == 'inputtipo') {
            let arraytipo = Array.from(document.getElementById('datatipo').options)
            let resultadotipo = arraytipo.filter(x=>  x.value === nombretipo);
            if (resultadotipo.length > 0) {
                idtipo = resultadotipo[0].getAttribute('data-value');
                if (idtipo == '1') {
                    tabla.rows[row].children[11].innerHTML = `<input id='inputtipodata' list='dataproveedor' onchange='change_cboDataTable(this)' class ='form-control' style='width:100%'>`;
                    tabla.rows[row].classList.add('text-success');
                }
                else if (idtipo == '2') {
                    tabla.rows[row].children[11].innerHTML = `<input id='inputtipodata' list='datacliente' onchange='change_cboDataTable(this)' class ='form-control' style='width:100%'>`;
                    tabla.rows[row].classList.add('text-success');
                }
                else if (idtipo == '3') {
                    tabla.rows[row].children[11].innerHTML = `<input id='inputtipodata' list='dataotros' onchange='change_cboDataTable(this)' class ='form-control' style='width:100%'>`;
                    tabla.rows[row].classList.add('text-success');
                }
            }
            else {
                tabla.rows[row].children[11].innerHTML = `<input id='inputtipodata' list='datashipby' class ='form-control' style='width:100%'>`;
                tabla.rows[row].classList.add('text-success');
                idtipo = '0';
            }
            idtipodata = '0';

        }
        else if (id == 'inputtipodata') {
            if (idtipo != '0') {
                if (idtipo == '1') {
                    let arrayproveedor = Array.from(document.getElementById('dataproveedor').options)
                    let resultadoproveedor = arrayproveedor.filter(x=>  x.value === nombretipo);
                    if (resultadoproveedor.length > 0) {
                        idtipodata = resultadoproveedor[0].getAttribute('data-value');
                        tabla.rows[row].classList.remove('text-success');
                    }
                    else {
                        idtipodata = '0';
                        tabla.rows[row].classList.add('text-success');
                    }
                }
                else if (idtipo == '2') {
                    let arraycliente = Array.from(document.getElementById('datacliente').options)
                    let resultadocliente = arraycliente.filter(x=>  x.value === nombretipo);
                    if (resultadocliente.length > 0) {
                        idtipodata = resultadocliente[0].getAttribute('data-value');
                        tabla.rows[row].classList.remove('text-success');
                    }
                    else {
                        idtipodata = '0';
                        tabla.rows[row].classList.add('text-success');
                    }
                }
                else if (idtipo == '3') {
                    var arrayotros = Array.from(document.getElementById('dataotros').options)
                    let resultadootros = arrayotros.filter(x=>  x.value === nombretipo);
                    if (resultadootros.length > 0) {
                        idtipodata = resultadootros[0].getAttribute('data-value');
                        tabla.rows[row].classList.remove('text-success');
                    }
                    else {
                        idtipodata = '0';
                        tabla.rows[row].classList.add('text-success');
                    }
                }
            }
            else {
                idtipodata = '0';
                tabla.rows[row].classList.add('text-success');
            }
        }
        else if (id == 'inputasume') {
            let arrayasume = Array.from(document.getElementById('dataasume').options);
            let resultadoasume = arrayasume.filter(x=>  x.value === nombretipo);

            if (resultadoasume.length > 0) {
                idasume = resultadoasume[0].getAttribute('data-value');
                tabla.rows[row].classList.remove('text-success');
            }
            else {
                idasume = '0';
                tabla.rows[row].classList.add('text-success');
            }
        }
    }
    let parresultado = `Item:${item},NumeroGuia:${numeroguia},Existe:${existe},IdCourier:${idcourier},IdTipoEnvio:${idtipoenvio},ResponsableWTS:${responsablewts},IdTipo:${idtipo},IdTipoDato:${idtipodata},IdAsume:${idasume},Peso:${peso}`;
    _dato.parentNode.parentNode.setAttribute('data-par', parresultado);

}


/* Tab Individual */




/* Botones - Primarios*/
function fn_return() {
    let urlaccion = 'Administration/GuiaCourier/Index',
        urljs = 'Administration/GuiaCourier/Index';
    _Go_Url(urlaccion, urljs);
}

function req_save() {

    let idtab = (_('informacion')).getElementsByClassName('active');
    let tab = idtab[0].id;

    if (tab == 'tab-individual') {
        let req = _required({ id: 'divformulario', clase: '_enty' });
        let req2 = required_select2({ id: 'divformulario', clase: 'select2 _enty' });
        if (req || req2) {
            swal({
                title: "Save Data",
                text: "Are you sure save these values?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                req_insert_individual();
                return;
            });
        }
        else {
            swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" });
        }
    }
    else {
        let existetabla = _('tableguiatemporal');
        if (existetabla == null) {
            swal({ title: "Alert", text: "You have insert data in this Tab", type: "warning" });
        } else {
            let rows = fn_get_table_info('tableguiatemporal');
            if (rows.length <= 0) { swal({ title: "Alert", text: "You have insert data in this Tab", type: "warning" }); }
            else {
                let val = fn_valid_exist('tableguiatemporal');
                if (val) { swal({ title: "Alert", text: "You have existing records", type: "warning" }); }
                else {
                    let rowsdataincomplete = fn_valid_data_completa('tableguiatemporal');

                    if (rowsdataincomplete) {
                        swal({ title: "Alert", text: "You have complete information", type: "warning" });
                    }
                    else {
                        swal({
                            title: "Save Data",
                            text: "Are you sure save these values?",
                            type: "info",
                            showCancelButton: true,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            cancelButtonText: "Cancelar",
                            closeOnConfirm: false
                        }, function () {
                            req_insert_group();
                            return;
                        });
                    }
                }
            }
        }
    }
}


/* Insert Group */

function req_insert_group() {
    let urlaccion = 'Administration/GuiaCourier/GuiaCourier_Insert_Group';
    let obotones = { Id: 1 },
        arrdata = JSON.stringify(fn_get_table_info('tableguiatemporal')),
        form = new FormData();
    form.append('parhead', JSON.stringify(obotones));
    form.append('pardetail', arrdata);
    Post(urlaccion, form, res_insert_group);
}

function fn_get_table_info(_table) {
    let table = _(_table).tBodies[0], totalfilas = table.rows.length, row = null, arrayresult = [];
    for (let i = 0; i < totalfilas; i++) {
        row = table.rows[i];
        let par = row.getAttribute('data-par'), clsrow = row.classList;
        existe = _par(par, 'Existe');
        let hide = false;
        if (clsrow.contains('hide')) { hide = true }

        if (existe == '0' && hide == false) {
            let obj = {
                IdCourier: parseInt(_par(par, 'IdCourier')),
                IdTipoEnvio: parseInt(_par(par, 'IdTipoEnvio')),
                IdResponsable: parseInt(_par(par, 'ResponsableWTS')),
                IdTipo: parseInt(_par(par, 'IdTipo')),
                IdTipoDato: parseInt(_par(par, 'IdTipoDato')),
                IdAsume: parseInt(_par(par, 'IdAsume')),
                NumeroGuia: row.cells[0].innerText,
                FechaEnvioEntrega: row.cells[1].innerText,
                Descripcion: row.cells[2].innerText,
                Peso: _par(par, 'Peso'),
                Responsable: row.cells[7].innerText,
                Consignatario: row.cells[9].innerText,
            }

            arrayresult.push(obj);
        }
    }
    return arrayresult;
}

function res_insert_group(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Good Job!", text: "You have registered new Data", type: "success" });
            fn_return();
        };
        if (orpta.estado === 'error') {
            swal({ title: "There are a problem!", text: "You have comunicate with TIC Administrator", type: "error" });
        }
    }
}

/* Insert Individual */

function req_insert_individual() {
    let urlaccion = 'Administration/GuiaCourier/GuiaCourier_Insert_Individual';
    let opersonal = _getParameter({ id: 'divformulario', clase: '_enty' });
    form = new FormData();
    form.append('parhead', JSON.stringify(opersonal));
    Post(urlaccion, form, res_insert_individual);
}

function res_insert_individual(response) {
    let orpta = response !== '' ? response : null;
    if (orpta != null) {
        if (orpta == 'Nuevo') {
            swal({ title: "Good job!", text: "You have registered new Data", type: "success" });
            fn_return();
        }
        else if (orpta == 'Existe') {
            swal({ title: "Wait", text: "The Guide Number exists", type: "warning" });
        }
        else {
            swal({ title: "There are a problem!", text: "Please, comunicate with administrador TIC", type: "error" });
        }
    }
}


/* Load Initial */

function req_ini() {
    let urlaccion = 'Administration/GuiaCourier/GuiaCourier_List';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) {
            ovariables_guiacourier.arrcourier = JSON.parse(orpta[0]);
        }
        if (JSON.parse(orpta[1] != '')) {
            ovariables_guiacourier.arrtipocourier = JSON.parse(orpta[1]);
        }
        if (JSON.parse(orpta[2] != '')) {
            ovariables_guiacourier.arrtipo = JSON.parse(orpta[2]);
        }
        if (JSON.parse(orpta[3] != '')) {
            ovariables_guiacourier.arrcliente = JSON.parse(orpta[3]);
        }
        if (JSON.parse(orpta[4] != '')) {
            ovariables_guiacourier.arrproveedor = JSON.parse(orpta[4]);
        }
        if (JSON.parse(orpta[5] != '')) {
            ovariables_guiacourier.arrotros = JSON.parse(orpta[5]);
        }
        if (JSON.parse(orpta[6] != '')) {
            ovariables_guiacourier.arrreponsable = JSON.parse(orpta[6]);
        }
        if (JSON.parse(orpta[7] != '')) {
            ovariables_guiacourier.arrasume = JSON.parse(orpta[7]);
        }
        //if (JSON.parse(orpta[8] != '')) { ovariables_guiacourier.arrguiacourier = JSON.parse(orpta[8]); }

        load_courier();
        load_tipoenvio();
        load_tipo();
        load_nombre();
        load_responsable();
        load_asume();
        load_datalistcourier();
        load_datalisttipoenvio();
        load_datalistResponsable();
        load_datalistTipo();
        load_datalistOtros();
        load_datalistProveedor();
        load_datalistCliente();
        load_datalistAsume();
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

function load_datalistcourier() {
    let arrcourier = ovariables_guiacourier.arrcourier, cbocourierwts = '';
    let datalist = `<datalist id='datacourier'>`
    if (arrcourier.length > 0) {
        arrcourier.forEach(x=> {
            cbocourierwts += `<option data-value ='${x.IdCourier}'>${x.NombreCourier}</option>`;
        });
    }
    datalist = datalist + cbocourierwts + `</datalist>`;
    _('infocourier').innerHTML = datalist;
}

function load_datalisttipoenvio() {
    let arrtipocourier = ovariables_guiacourier.arrtipocourier, cbotipoenviowts = '';
    let datalist = `<datalist id='datatipoenvio'>`
    if (arrtipocourier.length > 0) {
        arrtipocourier.forEach(x=> {
            cbotipoenviowts += `<option data-value ='${x.IdTipoEnvio}'>${x.NombreEnvio}</option>`;
        });
    }
    datalist = datalist + cbotipoenviowts + `</datalist>`;
    _('infotipoenvio').innerHTML = datalist;
}

function load_datalistResponsable() {
    let arrreponsable = ovariables_guiacourier.arrreponsable;
    let cboresponsablewts = '';
    let datalist = `<datalist id='dataresponsable'>`
    if (arrreponsable.length > 0) {
        arrreponsable.forEach(x=> {
            cboresponsablewts += `<option data-value='${x.IdResponsable}' value='${x.NombrePersonal}'>`
        });
    }
    datalist = datalist + cboresponsablewts + `</datalist>`;
    _('inforesponsable').innerHTML = datalist;
}

function load_datalistTipo() {
    let arrtipo = ovariables_guiacourier.arrtipo;
    let cbotipowts = '';
    let datalist = `<datalist id='datatipo'>`
    if (arrtipo.length > 0) {
        arrtipo.forEach(x=> {
            cbotipowts += `<option data-value ='${x.IdTipo}'>${x.Nombre}</option>`;
        });
    }
    datalist = datalist + cbotipowts + `</datalist>`

    _('infotipo').innerHTML = datalist;
}

function load_datalistOtros() {
    let arrotros = ovariables_guiacourier.arrotros;
    let cbootroswts = '';
    let datalist = `<datalist id='dataotros'>`
    if (arrotros.length > 0) {
        arrotros.forEach(x=> {
            cbootroswts += `<option data-value ='${x.IdTipoDato}'>${x.Descripcion}</option>`;
        });
    }
    datalist = datalist + cbootroswts + `</datalist>`;
    _('infootros').innerHTML = datalist;
}

function load_datalistProveedor() {
    let arrproveedor = ovariables_guiacourier.arrproveedor;
    let cboproveedorwts = '';
    let datalist = `<datalist id='dataproveedor'>`
    if (arrproveedor.length > 0) {
        arrproveedor.forEach(x=> {
            cboproveedorwts += `<option data-value ='${x.IdTipoDato}'>${x.Descripcion}</option>`;
        });
    }
    datalist = datalist + cboproveedorwts + `</datalist>`;
    _('infoproveedor').innerHTML = datalist;
}

function load_datalistCliente() {
    let arrcliente = ovariables_guiacourier.arrcliente;
    let cboclientewts = '';
    let datalist = `<datalist id='datacliente'>`
    if (arrcliente.length > 0) {
        arrcliente.forEach(x=> {
            cboclientewts += `<option data-value ='${x.IdTipoDato}'>${x.Descripcion}</option>`;
        });
    }
    datalist = datalist + cboclientewts + `</datalist>`;
    _('infocliente').innerHTML = datalist;
}

function load_datalistAsume() {
    let arrasume = ovariables_guiacourier.arrasume;
    let cboasumewts = '';
    let datalist = `<datalist id='dataasume'>`
    if (arrasume.length > 0) {
        arrasume.forEach(x=> {
            cboasumewts += `<option data-value ='${x.IdAsume}'>${x.Nombre}</option>`;
        });
    }
    datalist = datalist + cboasumewts + `</datalist>`

    _('infoasume').innerHTML = datalist;
}

(function ini() {
    load();
    req_ini();
})()