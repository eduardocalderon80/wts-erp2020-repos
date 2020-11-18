function load() {    
    _('_btn_searchestilo').addEventListener('click', buscarEstilo_modal);
}

function buscarEstilo_modal() {
    
    _('_tbody_tbl_estilos').classList.remove('hide');
}

(
    function ini() {
        load();
        //req_ini();
    }
)();