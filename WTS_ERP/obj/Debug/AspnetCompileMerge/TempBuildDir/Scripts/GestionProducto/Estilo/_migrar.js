var ovariables_migrar = {
    idestilo_migrar:'',
    imagen: '',
    estilointranet: '',
    color:''
}
function load() {
    let par = _('txtpar_migrarestilo').value;
    if (!_isEmpty(par)) {
        ovariables_migrar.idestilo_migrar = $.trim(_par(par, 'idestilo'));
        ovariables_migrar.imagen = (_par(par, 'imagen'));
        ovariables_migrar.estilointranet = ovariables_estilo_new.estilointranet;
        ovariables_migrar.color = ovariables_estilo_new.colorintranet;
     }
    llenarCampos();
    LlenarTablaColorMigrar();
    _('_btnaceptar_migrar').addEventListener('click', aceptarmigrar);
}
function llenarCampos() {
    let data = ovariables_migrar.estilointranet !== "" ? ovariables_migrar.estilointranet : null, codigo = '', desc = '', tela = '', version = '',season = '',
    orpta = data != null ? data : null;
    let html = ''
   
    if (orpta != null) {
        $('#divCabMigrar').addClass('label label-primary');
        html += `<label>ESTILO EXISTE EN INTRANET</label>`
        orpta.forEach(x => {
            codigo = x.Cod_EstCli, desc = x.Des_EstCli, tela = x.Des_Tela, version = x.numverstl ,season =x.temp
        })
    } else {
        $('#divinfointra').addClass('hide');
        $('#divCabMigrar').addClass('label label-warning');
        html += `<label>ESTILO PENDIENTE DE MIGRAR A INTRANET</label>`
        codigo = _('txtCode_estilo').value, desc = _('txtStyleDescription').value, tela = _('txtCode_estilo').value, version = _('txtCode_estilo').value, tela = ovariables_estilo_new.telaprincipal
    }
    $('#divCabMigrar').empty()
    $('#divCabMigrar').append(html)

    _('txtstyle_migrar').value = codigo;
    _('txtdesc_migrar').value = desc;
    _('txtversion_migrar').value = version;
    _('txttela_migrar').value = tela;
    _('txtseason_migrar').value = season;
}
function LlenarTablaColorMigrar() {
    let tbl = _('tbody_migrarcolor'), html = '', data = ovariables_migrar.color;
    tbl.innerHTML = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (i = 0; i < totalfilas ; i++) {
            //let hide = data[i].idclientecolorerp == 0 ? 'hide' : '';
            let migrado = '',nomigrado= 'hide'
            if ( data[i].idclientecolorerp == 0 ){
                migrado = 'hide', nomigrado = ''
            }                      
            html += `<tr data-par='idclientecolorerp:${data[i].idclientecolorerp},idclientecolor:${data[i].idclientecolor}'>
                    <td>${data[i].nombrecolor}</td>
                    <td class =${nomigrado}><div class='text-center'><small class ='label label-warning'>  PENDIENTE MIGRAR A INTRANET</small></div></td>
                    <td class =${migrado}><div class='text-center'><small class ='label label-primary'>    EXISTE EN INTRANET</small></div></td>
                    </tr>`
        }
    }
    tbl.innerHTML = html;
}
function getColorMigrar() {
    let tbl = _('tbody_migrarcolor'), totalfilas = tbl.rows.length, row = null, arr = []

    for (let i = 0; i < totalfilas ; i++) {
        row = tbl.rows[i];
        let par = row.getAttribute('data-par');
        let obj = {
            flgmigrar: _par(par, 'idclientecolorerp'),
            idclientecolor: _par(par, 'idclientecolor')            
        }
        arr[i] = obj
    }
    return arr;
}
function validar() {
    let tbl = _('tbody_migrarcolor') , totalfilas = tbl.rows.length, row= null, bValida = true, cont=0;

    for( i= 0; i <totalfilas; i++){
        row = tbl.rows[i];
        let par = row.getAttribute('data-par')
        idclientecolorerp = _par(par,'idclientecolorerp');
        cont += idclientecolorerp > 0 ? 1:0;
    }

    if (ovariables_migrar.estilointranet.length > 0 && cont == totalfilas ) {
        bValida = false;
        swal({
            type: 'error',
            title: 'Oops...',
            text: 'El estilo y todos los colores ya existen en intranet!!'
        });
    }
    return bValida;
}
function aceptarmigrar() {

    if (validar()) {
        let idestilo = ovariables_migrar.idestilo_migrar,
        frm = new FormData(),
        oEstilo = { idestilo: idestilo, nombreimagen: ovariables_migrar.imagen };
        oColor = JSON.stringify(getColorMigrar());
        frm.append("Estilo", JSON.stringify(oEstilo));
        frm.append("Color", oColor);
        //frm.append("Imagen", JSON.stringify(ovariables_migrar.imagen));

        _Post('GestionProducto/Estilo/MigrarEstiloIntranet', frm)
            .then((rpta) => {
                if (rpta > 0) {

                    swal({
                        type: 'success',
                        title: 'Good Job!!',
                        text: ''
                    }, function (result) {
                        if (result) {
                            $('#modal__migrar').modal('hide');
                            let par = _('txtpar').value, urlaccion = 'GestionProducto/Estilo/New', urljs = 'GestionProducto/Estilo/New',
                            idestilo = _par(par, 'idestilo');
                            _Go_Url(urlaccion, urljs, 'accion:edit,idestilo:' + idestilo + ',idgrupocomercial:' + ovariables_estilo_new.idgrupocomercial);
                        }
                    });

                } else {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Error!!'
                    });
                }
            })
    }     
}
function req_ini() {
    //let par = { idestilo: ovariables.idestilo_migrar }, urlaccion = 'GestionProducto/Estilo/getEstiloIntranet?par=' + JSON.stringify(par);
    //_Get(urlaccion)
    //    .then((rpta) => {
    //        console.log(rpta)
    //    })
}
(
    function init() {
        load();
        req_ini();
    }
)();