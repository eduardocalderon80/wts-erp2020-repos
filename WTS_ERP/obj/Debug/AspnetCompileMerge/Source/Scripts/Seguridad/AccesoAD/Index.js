function load() {

    _('btnaccess').addEventListener('click', req_access);

}

function req_access() {
   
    let usuario = _('txtusuariologin').value, password = _('txtpasswordlogin').value;
    let par = JSON.stringify({ usuario: usuario, password: password });
    let urlaccion = 'Seguridad/AccesoAD/Acceso_Ini?par=' + par;
    _Get(urlaccion);
}

(function ini() {
    load();
})()
