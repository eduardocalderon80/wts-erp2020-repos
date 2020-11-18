function load() {   
    _('_btn_aceptarcomentario').addEventListener('click', guardarComentario_modal);
    //fn_kendo();
}
 
function fn_kendo() {
    $("#_txtComentario_new").kendoEditor({
        resizable: {
            content: true,
        },
        tools: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "justifyFull",
            "insertUnorderedList",
            "insertOrderedList",
            "indent",
            "outdent",
            "subscript",
            "superscript",
            "formatting",
            "fontName",
            "fontSize",
            "foreColor",
            "backColor",
            "cleanFormatting"
        ]
    });
}

function guardarComentario_modal() {
    let idrequerimiento = _('hf_idrequerimiento').value, comment = _('_txtComentario_new').value, form = new FormData();

    let file = document.getElementById("inputFile").files[0];
    let nombrearchivo = '';
    if (file != undefined) {
        nombrearchivo = file.name;
    }

    let obj = { idrequerimiento: idrequerimiento, comment: comment, nombrearchivo: nombrearchivo };

    form.append("par", JSON.stringify(obj));
    form.append("archivo", file)

    //Post('GestionProducto/Requerimiento/GuardarComentario', form, function (rpt) {
    //    if (rpt > 0) {
    //        $('#modal_comentario').modal('hide');

    //        parametro = JSON.stringify({ idrequerimiento: _('hf_idrequerimiento').value });
    //        urlaccion = 'GestionProducto/Requerimiento/getData_requerimiento_foredit?par=' + parametro;
    //        Get(urlaccion, CargarComentario);
             
    //        MostrarConfCorreo(rpt)

    //    }
    //});
    let urlAccion = 'GestionProducto/Requerimiento/GuardarComentario';

    _Post(urlAccion, form).then(function (rpt) {
        if (rpt > 0) {
            $('#modal_comentario').modal('hide');

            parametro = JSON.stringify({ idrequerimiento: _('hf_idrequerimiento').value });
            urlaccion = 'GestionProducto/Requerimiento/getData_requerimiento_foredit?par=' + parametro;
            Get(urlaccion, CargarComentario);

            MostrarConfCorreo(rpt)
        }
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (e) {      
       
    });
 
}

function MostrarConfCorreo(Id) {
    swal({
        title: "Do you want send a mail?",
        text: "",
        html: true,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "Yes",
        cancelButtonText: "No"
        //closeOnConfirm: false
        //closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            MostrarCorreoCom(Id);
        } else {
            //swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
         
        return;
    });
}

function MostrarCorreoCom(Id) {
    $('#btnSendMailComment').trigger("click");
    return;
}

(
    function ini() {
        load();
        //req_ini();
    }
)();