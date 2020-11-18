function load() {

}

function req_ini() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Master';
    Get(urlaccion, res_ini);
}

(function ini() {
    load();
    req_ini();
})();