var ovariables = {

}

function load() {
    fn_load_update();

    $('.iradio_square-green._clsDivAnalyst').iCheck({
        checkboxClass: 'iradio_square-green',
        radioClass: 'iradio_square-green',
    });

}
function fn_terminar() {
    swal({
        title: "Do you want to save the terminar values?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        req_terminar();
    });
}

function req_terminar() {
    let oRegister = _getParameter({ id: 'tab-registro', clase: '_enty' });
    let oTic = _getParameter({ id: 'tab-tic', clase: '_enty' });
}

function fn_load_update() {



    /*
    let html = `
        
            <div class ="ibox white-bg">
                <div class ="ibox-content">
                     <div class ="form-horizontal">
                        <div class ="form-group">
                            <label class ="control-label col-sm-3">Descripción: </label>

                            <div class ="col-sm-9">                            
                                    <div class ='iradio_square-green _clsDivAnalyst' style='position: relative;' >
                                        <label>
                                            <input type='radio'style='position: absolute; opacity: 0;' id='chkAnalyst' name="square-radio">
                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                        </label>
                                    </div>
                                 
                                    <div class ='iradio_square-green _clsDivAnalyst' style='position: relative;' >
                                        <label>
                                            <input type='radio'style='position: absolute; opacity: 0;' id='chkAnalyst' name="square-radio">
                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                        </label>
                                    </div>
                                
                            </div>
                        </div>
                    </div>
                    <div class ="form-horizontal">
                        <div class ="form-group">
                            <label class ="control-label col-sm-3">Descripción: </label>
                            <div class ="col-sm-9">
                                <textarea id="txtDescripcion" class ="form-control _enty" name="Descripcion" rows="6" style="resize:none" placeholder="Enter reason text" data-id="Observations" data-min="1" data-max="200" data-required="true" maxlength="200" disabled=""></textarea>
                            </div>
                        </div>
                    </div>
                    <div class ="form-horizontal">
                        <div class ="form-group">
                            <button type='button' class ='btn btn-primary' id='btnTerminar' onclick='fn_terminar()'>
                                <span class ='fa fa-thumbs-up'></span>
                                Aprobar
                            </button>
                            <button type='button' class ='btn btn-default' id='btnReturn' onclick='fn_terminar()'>
                                <span class ='fa fa-reply-all'></span>
                                Return
                            </button>
                        </div>
                    </div>
                 </div>
            </div>
        
        `;

    _('formUpdate').innerHTML = html;*/
}

(function ini() {
    load();
})();