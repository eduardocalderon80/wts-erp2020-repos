//funcion de solicitud partida => partida (estado,id)

// version 1
function ruteo_solicitudpartida_to_partida(_estadopartida, _id) {
    var alis = Array.from(_('side-menu').getElementsByTagName('li'));
    var indice = alis.findIndex(x=>x.dataset.nav === 'Laboratorio/Partida/Index');
    
    _promise()
    .then(function () {
        if (indice >= 0) alis[indice].getElementsByClassName('_menu_sub')[0].click();        
    }).then(function() {
        setTimeout(function () { view_partida(_id) }, 1000);
        clearTimeout(view_partida);
    })
}

function view_partida(id) {
    var asubmenu = Array.from(_('_menu').getElementsByClassName('_item'));
    var indicemenu = asubmenu.findIndex(x=>x.dataset.id == id);//pasar parametro
    if (indicemenu >= 0) {
        asubmenu[indicemenu].children[0].click();
    } 
}
// version 2
function _ruteo_masgeneral(url) {
    return new Promise(function (resolve, reject) {
        let alis = Array.from(_('side-menu').getElementsByTagName('li'));
        let indice = alis.findIndex(x=>x.dataset.nav === url);

        setTimeout(function () {
            if (indice >= 0) {
                alis[indice].getElementsByClassName('_menu_sub')[0].click();
                resolve(true);
            } else {
                resolve(false);
            }
        }, 100);
    });
}

function ruteo_bandejamodelo_correo(url, _id, iddivcontenedor_menubandeja) {
    var alis = Array.from(_('side-menu').getElementsByTagName('li'));
    var indice = alis.findIndex(x=>x.dataset.nav === url);

    _promise()
    .then(function () {
        if (indice >= 0) alis[indice].getElementsByClassName('_menu_sub')[0].click();
    }).then(function () {
        setTimeout(function () { view_partida(_id, iddivcontenedor_menubandeja) }, 1000);
        clearTimeout(view_partida);
    })
}

function view_partida(id, iddivcontenedor_menubandeja) {
    let div = _(iddivcontenedor_menubandeja), divmenu = div.getElementsByClassName('elements-list')[0]; // _menu
    var asubmenu = Array.from(divmenu.getElementsByClassName('_item'));
    var indicemenu = asubmenu.findIndex(x=>x.dataset.id == id);//pasar parametro
    if (indicemenu >= 0) {
        asubmenu[indicemenu].children[0].click();
    }
}

var fn_loadvista_index_bandeja = async (urlvista, par, iddivcontenedor_menubandeja) => {
    let idsolicitud = _par(par, 'idsolicitud');
    let rpta = await _Get(urlvista);
    let sub='';    
    let contenido = '';

    if (rpta !== ''){
        contenido = (par !== '') ? rpta.replace('DATA-PARAMETRO', par) : rpta;        
        let urlcomplete = urlvista;


        let a= await _promise(50)
                .then(()=>{
                    _('divContenido').innerHTML = contenido;
                    return 'a';
                })

        let b=  await _promise(500)
                .then(()=>{
                    _Getjs(urlcomplete);
                    return 'b';
                })
        
        let c= await _promise(510)
            .then(()=>{
                if (idsolicitud !== '') {
                    view_partida(idsolicitud, iddivcontenedor_menubandeja);
                }
                return 'c';
            })
                
            //alert(a+b+c);
            
    }
}