function load() {
   
}

function req_ini() {
    let urlaccion = 'GestionProducto/Estilo/GetColorxEstilo', idestilo = $('#hf_idestilo').val(), obj = { idestilo: idestilo };
    urlaccion += '?par=' + JSON.stringify(obj);
    Get(urlaccion, res_ini);
}

function res_ini(rpta) {
    $('#_tbody_tbl_color').html('');
    if (rpta != '') {
        let data = CSVtoJSON(rpta, '¬', '^');
        llenartabla(data);
    }
}

function llenartabla(data) {
    let tbody = $('#_tbody_tbl_color')[0], html = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {
            html += `<tr data-par='${data[i].IdClienteEstiloColor}'>
                <td><span class ='btn-group btn-group-md pull-center' ><button title='Delete' style='' type='button' onclick='_EliminarColorxEstilo(${data[i].IdClienteEstiloColor});' class ='btn btn-danger'><span class ='fa fa-trash-o'></span></button></span></td>
                <td>${data[i].NombreClienteColor}</td>
              </tr>`;
        }
        tbody.innerHTML = html;
    }
}

function _EliminarColorxEstilo(id) {
     
        swal({
            title: "Are you sure to delete?",
            text: "",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: false
        }, function () {
            EliminarColorxEstilo(id)
            return;
        });
  
}

function EliminarColorxEstilo(id) {
    let form = new FormData()
    let urlaccion = 'GestionProducto/Estilo/EliminarClienteEstiloColor', parametro = { id: id };
    form.append('par', JSON.stringify(parametro));
    Post(urlaccion, form, function (rpta) {
        if (rpta > 0) {
            _swal({ estado: 'success', mensaje: 'Color was deleted' });
            req_ini()
            return;
        }
        else {
            _swal({ estado: 'error', mensaje: 'Color could not delete' });
        }
    });
    return;
}

(
    function ini() {
        load();
        req_ini();
    }
)();


