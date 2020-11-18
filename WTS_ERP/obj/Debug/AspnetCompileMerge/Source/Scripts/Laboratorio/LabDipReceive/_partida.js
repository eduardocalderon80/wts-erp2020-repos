var ovariables = {
    par: '',
    idlabdip: ''
}

function load() {
    ovariables.par = _('txtpar_codigolabdip').value;
    ovariables.idlabdip = _par(ovariables.par, 'idlabdip');
    _('txtcodigotintoreria').value = _par(ovariables.par, 'codtinto');
    _('txtcolor').value = _par(ovariables.par, 'color');
    
    _('btnsave').addEventListener('click', req_save);
}


function req_save() {
    let numeropartida = _('_txtpartida').value;
    //if (numeropartida != '') {
        swal({
            title: 'Save Data',
            text: 'Are you sure save data?',
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            closeOnConfirm: false
        }, function () {
            req_insert_partida(numeropartida);
        });
    //}
    //else { swal({ title: "Alert!", text: "Tienes que ingresar un numero de partida", type: "warning" }); }
}

function req_insert_partida(_numeropartida) {
   
    let url = 'Laboratorio/LabDipReceive/grabarNumeroPartida';
    let numeropartida = _('_txtpartida').value;
    let form = new FormData();
    let par = {
        idlabdip: ovariables.idlabdip,
        numeropartida: numeropartida
    }
    form.append('par', JSON.stringify(par));

    _Post(url, form)
    .then((respuesta) => {
        let orespuesta = JSON.parse(respuesta);
        let estado = orespuesta[0].estado === "success";
        swal({ title: orespuesta[0].mensaje, text: '', type: orespuesta[0].estado }, function () {

            if (estado) {
                //let urlaccion = 'Laboratorio/LabDipReceive/Index',
                //       urljs = 'Laboratorio/LabDipReceive/Index';
                //_Go_Url(urlaccion, urljs);
                req_ini();
                $('#modal__partida').modal('hide');
            }
            
        })
    })
}

(function ini() {
    load();
})()

