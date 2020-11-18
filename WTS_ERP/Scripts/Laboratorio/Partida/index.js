var __opartida = {
    urlbase: _('urlBase').value,
    arules: [],
    arules_secundarios: [],
    abandejapartida: [],
    perfil: '',
    rol:'',
    estados_partida: { 1: 'Approved', 2: 'Reject', 3: 'Pending' },
    parametro: {
        idpartida: '',
        idsolicitud: '',
        estado: ''
    }
}

function load() {
    [..._('submenuestado').getElementsByClassName('_submenu')].forEach(x=> { x.addEventListener("click", function (e) { req_load_menu_filter(e) }); })
    _('span_filtrobandeja_partida').addEventListener('click', filtro_partida_index);
    _('span_refresh_partidaindex').addEventListener('click', refrescarpartida_index);
    _('txtfiltrobandeja_partida').addEventListener('keypress', function (e) {
        if (e.keyCode === 13) { filtro_partida_index() }
    });
}

function fn_asignarfiltro(arr) {
    arr.forEach(x=> x.filtro = `${x.proveedor}${x.batch}${x.fecha}${x.cliente}${x.reportetecnico}${x.po}${x.estilo}${x.color}${x.familia}${x.tela}${x.tipopartida}${x.tiporeporte}${x.estado}`);
    return arr;
}


function req_ini() {
    let url = 'Laboratorio/Partida/getDataPartida',
        par = { estado: 'pending', esindex: 'si' },
        url_par = `${url}?par=${JSON.stringify(par)}`,
        _err = function (__error) { console.log("error", __error) };

    _Get(url_par)
    .then((vista) => {
        let odata = JSON.parse(vista)[0];
        let amenu = CSVtoJSON(odata.menu);
        let amenu_filtro = fn_asignarfiltro(amenu);
        __opartida.abandejapartida = amenu_filtro;
        __opartida.arules = JSON.parse(odata.rules) || [];  // :? :pendiente
        __opartida.arules_secundarios = JSON.parse(odata.rules_secundarios) || [];  // :? :pendiente        
        __opartida.perfil = odata.perfil;
        __opartida.rol = odata.rol;

        _('_menu').innerHTML = fn_load_menu_partida(amenu, 'pending');
        _('hf_estadoactualbusqueda_partida_index').value = 'pending';
    }, (p) => { _err(p) })
    .then(() => {
        _Getjs('Laboratorio/Partida/funciones_partida');
        let menu = document.getElementById('_menu');
        let aitem = [...menu.getElementsByClassName('_item')];
        aitem.forEach(x=> {
            x.addEventListener('click', function (y) {
                let id = x.getAttribute('data-id');
                req_load_content_partida(id);   // :?
            })
        });
    })

}


// :2
function req_load_menu_filter(_submenu) {
    let submenu = _submenu.target || _submenu;
    _('divmenu_breadcrum').classList.remove('hide');
    _('divdetalle_breadcrum').classList.remove('hide');

    let _bodyanterior = document.querySelector('._body');
    if (!_isEmpty(_bodyanterior)) { _('divcontenedor_breadcrum').removeChild(_bodyanterior); }

    let estado = submenu.getAttribute('data-estado'),
        url = 'Laboratorio/Partida/getDataPartida',
        par = { estado: estado, esindex: 'si' },
        url_par = `${url}?par=${JSON.stringify(par)}`;

    _('hf_estadoactualbusqueda_partida_index').value = estado;
    if (estado !== 'advanced') {
        _Get(url_par).then(function (respuesta) {
            let odata = JSON.parse(respuesta)[0];
            let amenu = CSVtoJSON(odata.menu);
            let amenu_filtro = fn_asignarfiltro(amenu);
            __opartida.abandejapartida = amenu_filtro;
            __opartida.arules = JSON.parse(odata.rules) || [];
            __opartida.arules_secundarios = JSON.parse(odata.rules_secundarios) || [];
            __opartida.perfil = odata.perfil;
            __opartida.rol = odata.rol;

            _('_menu').innerHTML = fn_load_menu_partida(amenu, estado);
            _('hf_estadoactualbusqueda_partida_index').value = estado;
        }, function (reason) { console.log("error 1 ", reason); })
        .then(function () {
            //fn_clear_content();
            _('tab-1').innerHTML = '';
            let menu = document.getElementById('_menu');
            let aitem = [...menu.getElementsByClassName('_item')];
            aitem.forEach(x=> {
                x.addEventListener('click', function (y) {
                    let id = x.getAttribute('data-id');
                    req_load_content_partida(id);
                })
            });
        })
    } else {
        _('div_filtro_bandeja_partida').classList.remove('hide');
        fn_busquedaavanzadaestados_partida();
    }
}

function req_load_menu_filteravanzado_partida(parametro) {
    _('divmenu_breadcrum').classList.remove('hide');
    _('divdetalle_breadcrum').classList.remove('hide');

    let _bodyanterior = document.querySelector('._body');
    if (!_isEmpty(_bodyanterior)) { _('divcontenedor_breadcrum').removeChild(_bodyanterior); }

    
    parametro['esindex'] = 'si';
    let estado = parametro['estado'],
        url = 'Laboratorio/Partida/getDataPartida',        
        url_par = `${url}?par=${JSON.stringify(parametro)}`;

    _('hf_estadoactualbusqueda_partida_index').value = estado;
    _Get(url_par).then(function (respuesta) {
        let odata = JSON.parse(respuesta)[0];
        let amenu = CSVtoJSON(odata.menu);
        if (odata.menu.length > 0) {
            let amenu_filtro = fn_asignarfiltro(amenu);
            __opartida.abandejapartida = amenu_filtro;
            __opartida.arules = JSON.parse(odata.rules) || [];
            __opartida.arules_secundarios = JSON.parse(odata.rules_secundarios) || [];
            __opartida.perfil = odata.perfil;
            __opartida.rol = odata.rol;

            _('_menu').innerHTML = fn_load_menu_partida(amenu, estado);
            _('hf_estadoactualbusqueda_partida_index').value = estado;
            $('#modal__BusquedaAvanzadaEstados_Partida').modal('hide');
        }

        return odata;
    }, function (reason) { console.log("error 1 ", reason); })
        .then(function (odata) {
            if (odata.menu.length > 0) {
                _('tab-1').innerHTML = '';
                let menu = document.getElementById('_menu');
                let aitem = [...menu.getElementsByClassName('_item')];
                aitem.forEach(x=> {
                    x.addEventListener('click', function (y) {
                        let id = x.getAttribute('data-id');
                        req_load_content_partida(id);
                    })
                });
            } else {
                _swal({ estado: 'error', mensaje: 'No data!' });
            }
        });
}

function req_load_menu_response(_estado, _idpartida) {    
    _('divmenu_breadcrum').classList.remove('hide');
    _('divdetalle_breadcrum').classList.remove('hide');

    let _bodyanterior = document.querySelector('._body');
    if (!_isEmpty(_bodyanterior)) { _('divcontenedor_breadcrum').removeChild(_bodyanterior); }

    let estado = _estado;
    url = 'Laboratorio/Partida/getDataPartida',
    par = { estado: estado, esindex: 'si' },
    url_par = `${url}?par=${JSON.stringify(par)}`;

    _('hf_estadoactualbusqueda_partida_index').value = estado;
    if (estado !== 'advanced') {
        _Get(url_par).then(function (respuesta) {
            let odata = JSON.parse(respuesta)[0];
            let amenu = CSVtoJSON(odata.menu);
            let amenu_filtro = fn_asignarfiltro(amenu);
            __opartida.abandejapartida = amenu_filtro;
            __opartida.arules = JSON.parse(odata.rules) || [];
            __opartida.arules_secundarios = JSON.parse(odata.rules_secundarios) || [];
            __opartida.perfil = odata.perfil;
            _('_menu').innerHTML = fn_load_menu_partida(amenu, estado);
            _('hf_estadoactualbusqueda_partida_index').value = estado;
        }, function (reason) { console.log("error 1 ", reason); })
        .then(function () {            
            _('tab-1').innerHTML = '';
            let menu = document.getElementById('_menu');
            let aitem = [...menu.getElementsByClassName('_item')];
            aitem.forEach(x=> {
                x.addEventListener('click', function (y) {
                    let id = x.getAttribute('data-id');
                    req_load_content_partida(id);
                })
            });
        }).then(function () {
            req_load_content_partida(_idpartida);
        });
    } else {
        _('div_filtro_bandeja_partida').classList.remove('hide');
        fn_busquedaavanzadaestados();
    }
}

//:retorno
function req_load_menu_filter_byid(_submenu, _idpartida) {
    let submenu = _submenu;
    _('divmenu_breadcrum').classList.remove('hide');
    _('divdetalle_breadcrum').classList.remove('hide');

    let _bodyanterior = document.querySelector('._body');
    if (!_isEmpty(_bodyanterior)) { _('divcontenedor_breadcrum').removeChild(_bodyanterior); }

    let estado = submenu.getAttribute('data-estado'),
        url = 'Laboratorio/Partida/getDataPartida',
        par = { estado: estado, esindex: 'si' },
        url_par = `${url}?par=${JSON.stringify(par)}`;

    _('hf_estadoactualbusqueda_partida_index').value = estado;
    if (estado !== 'advanced') {
        _Get(url_par).then(function (respuesta) {
            let odata = JSON.parse(respuesta)[0];
            let amenu = CSVtoJSON(odata.menu);
            let amenu_filtro = fn_asignarfiltro(amenu);
            __opartida.abandejapartida = amenu_filtro;
            __opartida.arules = JSON.parse(odata.rules) || [];
            __opartida.arules_secundarios = JSON.parse(odata.rules_secundarios) || [];
            __opartida.perfil = odata.perfil;
            _('_menu').innerHTML = fn_load_menu_partida(amenu, estado);
            _('hf_estadoactualbusqueda_partida_index').value = estado;
        }, function (reason) { console.log("error 1 ", reason); })
        .then(function () {
            //fn_clear_content();
            _('tab-1').innerHTML = '';
            let menu = document.getElementById('_menu');
            let aitem = [...menu.getElementsByClassName('_item')];
            aitem.forEach(x=> {
                x.addEventListener('click', function (y) {
                    let id = x.getAttribute('data-id');
                    req_load_content_partida(id);
                })
            });
        })
        .then(() => {

            var asubmenu = Array.from(_('_menu').getElementsByClassName('_item'));
            var indicemenu = asubmenu.findIndex(x=>x.dataset.id === _idpartida);
            if (indicemenu >= 0) asubmenu[indicemenu].click();

        })
    } else {
        _('div_filtro_bandeja_partida').classList.remove('hide');
        fn_busquedaavanzadaestados();
    }
}

function req_load_content_partida(_id) {
    let url = 'Laboratorio/Partida/getDataPartidabyId',
        par = { idpartida: _id },
        url_par = `${url}?par=${JSON.stringify(par)}`;
    Get(url_par, res_load_content_partida, true);
}


// :validando
function fn_load_menu_partida(adata, estado) {
    let items = '',
        oestado = {
            pending: 'warning',
            rejected: 'danger',
            approved: 'primary',
            defecto: 'info'
        },
        clase = oestado[estado] || oestado.defecto,
        titulo = estado !== '' ? estado.toUpperCase() : '';

    adata.forEach(x=> {
        items += `<li class="list-group-item _item" data-id="${x.idpartida}" data-idsolicitud="${x.idsolicitud}" data-codigosolicitud="${x.code}">
                    <a data-toggle="tab" href="#tab-1">
                        <small class="pull-right text-muted">${x.fecha}</small>
                        <strong># ${x.batch}</strong>

                        <div class="small m-t-xs">
                            <strong>${x.proveedor}</strong>
                            <div><strong>${x.cliente} - ${x.code}</strong></div>
                            <p>
                            <div><strong>PO: </strong> ${x.po !== '' ? x.po : 'none'}</div>
                            <div><strong>Style: </strong> ${x.estilo !== '' ? x.estilo : 'none'}</div>
                            </p>
                        </div>
                        <div class="small m-t-xs">
                            <div><strong>Color:</strong> ${x.color}</div>
                            <p><strong>Fabric:</strong> ${x.familia} - ${x.tela}</p>
                            <p class="m-b-none">
                                <span class='medium label pull-right label-${clase}' style='font-size:10px'>${x.estado}</span>
                                <i class="fa fa-tag"></i>
                                ${x.tipopartida}
                                <i class="fa fa-tags"></i>
                                ${x.tiporeporte}
                            </p>
                        </div>
                    </a>
                </li>`;
    });
    return items;
}



// :filter basico
function filtro_partida_index() {
    let txtfilter = _('txtfiltrobandeja_partida').value,
        estado = _('hf_estadoactualbusqueda_partida_index').value,
        amenu = __opartida.abandejapartida.filter(x => x.filtro.toLowerCase().indexOf(txtfilter) >= 0);

    _('_menu').innerHTML = fn_load_menu_partida(amenu, estado);
    let menu = document.getElementById('_menu'),
        aitem = [...menu.getElementsByClassName('_item')];

    aitem.forEach(x=> {
        x.addEventListener('click', function (y) {
            let id = x.getAttribute('data-id');
            req_load_content_partida(id); // :?
        })
    });
}

/* :botonera */
// :rol=> el campo rol para el area de laboratorio esta pendiente por definir los roles, provicionalmente se asigna vacio si es perfil laboratorio
/*Rules buttons*/
function fn_rules_buttons(_odata) {
    let arr_botonera_detalle = CSVtoJSON(_odata.botonescsv),
        estado_partida = _odata.estado_partida || '',
        estado_solicitud = _odata.estado_solicitud.toUpperCase() || '',
        rol = _odata.rol||'',
        perfil = (!_isEmpty(_odata.perfil))
                  ? (_odata.perfil.indexOf(',') > 0 ? _odata.perfil.split(',')[0].toUpperCase() : _odata.perfil.toUpperCase())
                  : '';

    oestados = {
        PE: 'pending',
        SE: 'send',
        RE: 'received',
        RJ: 'reject',
        AP: 'approved',
        IP: 'inprocess',
        FI: 'finished'
    },
    operfiles = {
        FABRICA: 'fabrica',
        LABORATORIO: 'laboratorio',
        COMERCIAL: 'comercial',
    },
    arr = [];

    estado_solicitud = oestados[estado_solicitud] || '';
    perfil = operfiles[perfil] || '';
    rol = rol !== '' && rol.indexOf('laboratorio') >= 0 ? '' : rol; // :rol

    if (perfil !== '' && estado_partida !== '' && estado_solicitud !== '') {
        const arules_botones = __opartida.arules;
        

        if (arules_botones.length > 0) {
            let afunciones = arules_botones.filter(x=>x.perfil === perfil && x.rol.indexOf(rol)>=0 && x.estadosolicitud.toLowerCase() === estado_solicitud && x.estadopartida.toLowerCase() === estado_partida)
                            .map(x=>x.funciones.toLowerCase());

            arr = arr_botonera_detalle.filter(x=> {
                return afunciones.some(y=>x.metodo.toLowerCase() === y)
            });
        }
    }
    return arr;
}

function fn_botonera_detalle(_odata) {
    let arr = fn_rules_buttons(_odata);
    let abotones = (arrbotones) => {
        return (
        arrbotones.map((x) => {
            return (`<button class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="left" data-estado="${x.estado_partida}"  data-idpartida="${x.idpartida}" title="${x.titulo}" onclick="fn_${x.metodo.toLowerCase()}(event)"><span class="${x.icon}" data-idpartida="${x.idpartida}"  data-estado="${x.estado_partida}"></span> </button>`);
        })).join('')
    }
    let botones = abotones(arr) || '';

    if ((_odata.estado_partida.toLowerCase() === 'approved' || _odata.estado_partida.toLowerCase() === 'rejected') && (_odata.estado_solicitud.toLowerCase() === 'finished' || _odata.estado_solicitud.toLowerCase() === 'fi')) {
        botones += `<button class='btn btn-white btn-sm' data-toggle="tooltip" data-placement="left" data-par='DOWNLOADPDF' title='Download technical report' onclick='fn_downloadreportetecnico_partida(event);'>
                <span class='fa fa-download'></span>
            </button>`;
    }

    return botones;
}

// :samuel
function res_load_content_partida(respuesta) {
    let orespuesta = JSON.parse(respuesta)[0];
    let csvBotoneras = orespuesta.botoneras;
    let x = JSON.parse(orespuesta.vista)[0];
    let oclase = {
        pending: 'warning',
        rejected: 'danger',
        approved: 'primary'
    };
    //let par_inicial = _('txtpar_partida_index').value, paradicional = par_inicial + `,idpartida:${x.idpartida}`;
    //_('txtpar_partida_index').value = paradicional;
    _('hf_idpartida_index').value = x.idpartida;

    let botonera = fn_botonera_detalle({
        botonescsv: csvBotoneras,
        perfil: __opartida.perfil,
        estado_partida: x.estado_partida.toLowerCase(),
        estado_solicitud: x.estado_solicitud.toLowerCase(),
        idpartida: x.idpartida,
        rol: __opartida.rol
    });

    /* :parametros */
    __opartida.parametro.idpartida = x.idpartida;
    __opartida.parametro.idsolicitud = '';
    __opartida.parametro.estado = x.estado_partida;
    // :pendiente

    let valoraprobacioncomercial = '';
    if (x.aprobadocomercial_str == '0') {
        valoraprobacioncomercial = `<strong class='text-danger'>Rejected <a class="fa fa-thumbs-o-down" style='color:red;'></a></strong>`;
    } else if (x.aprobadocomercial_str == '1') {
        valoraprobacioncomercial = `<strong style='color: #FFA746;'>Approved <a class="fa fa-thumbs-o-up" style='color:#FFA746;'></a></strong>`;
    } else {
        valoraprobacioncomercial = `none <i class='fa fa-minus-square-o'></i>`;
    }

    let r = `
        <div class ="pull-right">
            <div class ="tooltip-demo" id="divbotonera">
                ${botonera}
            </div>
         </div>

    <div class="small text-muted"><strong>Created:</strong>  <i class="fa fa-clock-o"></i>${x.fecha}</div>
    <div class="small text-muted"><strong>Edited:</strong>       <i class="fa fa-clock-o"></i>${x.fechaedicion}</div>
    <h1 class ="text-navy"><strong> ${x.reportetecnico}  ${x.partida !== '' ? ' -  #' + x.partida : '  '}  <h2 class ='medium label label-${oclase[x.estado.toLowerCase()]}'>${x.estado} </h2></strong></h1>


<div class="m-t-lg">

	<div class="row" data-id="1">
		<div class="col-sm-6 text-left" data-col="1">
            <table class="table table-borderless table-condensed">
				<tbody>
                    <tr><td class ="col-sm-4">Commercial approval</td><td>${valoraprobacioncomercial} </td></tr>
					<tr><td class="col-sm-4">#Technical Report </td><td>${x.reportetecnico} </td></tr>
                    <tr><td>Cliente </td><td>${x.cliente} </td></tr>
                    <tr><td>Factory</td><td>${x.fabrica} </td></tr>
                    <tr><td># Batch</td><td>${x.partida} </td></tr>
                    <tr><td># Yarn</td><td>${x.tela} </td></tr>
                    <tr><td>Color Comment </td><td>${x.comentariocolor} </td></tr>
				</tbody>
			</table>
        </div>

		<div class="col-sm-6 text-left"  data-col="2">
            <table class="table table-borderless table-condensed">
				<tbody>
					<tr><td class="col-sm-4">Test Method </td><td>${x.testmetodo} </td></tr>
                    <tr><td>Composition </td><td>${x.telacomposicion} </td></tr>
                    <tr><td>Dyeing Type </td><td> </td></tr>
                    <tr><td>Color</td><td>${x.color} </td></tr>
                    <tr><td>Request Departure Date</td><td>${x.fechasolicitud} </td></tr>
                    <tr><td>Testing Comment</td><td>${x.comentariotesting} </td></tr>
				</tbody>
			</table>
        </div>
    </div>
    <br/>
    <div class="row" data-id="2">
		<h4 class="text-navy"><strong>Dimensional stability</strong></h4>

		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed" data-col="1">
				<tbody>
					<tr><td class="col-sm-4">Long shrink </td><td>${x.edencogimientolargo} </td></tr>
                    <tr><td>Reversed </td><td>${x.edrevirado} </td></tr>
                    <tr><td>Appearance -Color change</td><td>${x.edaparienciacambiocolor} </td></tr>
				</tbody>
			</table>
        </div>

		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed"  data-col="2">
				<tbody>
					<tr><td class="col-sm-4">Shrink width </td><td>${x.edencogimientoancho} </td></tr>
                    <tr><td>Pilling </td><td>${x.edpilling} </td></tr>
                    <tr><td>Appearence Evaluation</td><td> ${x.edevaluacionapariencia}</td></tr>
				</tbody>
			</table>
        </div>
    </div>
    <br/>
    <div class="row" data-id="3">
		<h4 class="text-navy"><strong>Fabric Density</strong></h4>
		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed" data-col="1">
				<tbody>
					<tr><td class="col-sm-4">Density</td><td>${x.dtdensidad} </td></tr>
                    <tr><td>Deviation</td><td>${x.dtdesviacion} </td></tr>
				</tbody>
			</table>
        </div>

		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed" data-col="2">
				<tbody>
					<tr><td class="col-sm-4">Finished width</td><td>${x.dtanchoacabado}</td></tr>
				</tbody>
			</table>
        </div>
    </div>
    <br/>
    <div class="row" data-id="4">
		<h4 class="text-navy"><strong>Fastness to rub</strong></h4>
		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed" data-col="1">
				<tbody>
					<tr><td class="col-sm-4">Dry</td><td>${x.sfseco} </td></tr>
				</tbody>
			</table>
        </div>

		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed" data-col="2">
				<tbody>
					<tr><td class="col-sm-4">Wet</td><td>${x.sfhumedo}</td></tr>
				</tbody>
			</table>
        </div>
    </div>
    <br/>
    <div class="row" data-id="5">
		<h4 class ="text-navy"><strong>Washability</strong></h4>

		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed" data-col="1">
				<tbody>
					<tr><td class="col-sm-4">Color Change</td><td>${x.slcambiocolor} </td></tr>
                    <tr><td>Acetate</td><td>${x.slacetato} </td></tr>
                    <tr><td>Cotton</td><td>${x.slalgodon} </td></tr>
                    <tr><td>Nylon</td><td>${x.slnylon} </td></tr>
                    <tr><td>Viscoset</td><td>${x.slviscosa} </td></tr>
				</tbody>
			</table>
        </div>

		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed" data-col="2">
				<tbody>
					<tr><td class="col-sm-4">Polyester</td><td>${x.slpoliester}</td></tr>
                    <tr><td>Acrylic</td><td>${x.slacrilico}</td></tr>
                    <tr><td>Wool</td><td>${x.sllana}</td></tr>
                    <tr><td>Silk</td><td>${x.slsilk}</td></tr>
				</tbody>
			</table>
        </div>
    </div>
    <br/>
    <div class="row" data-id="6">
		<h4 class="text-navy"><strong>Resistance to pilling</strong></h4>

		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed" data-col="1">
				<tbody>
					<tr><td class="col-sm-4">Result </td><td>${x.rpresultado} </td></tr>
				</tbody>
			</table>
        </div>


		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed" data-col="2">
				<tbody>
					<tr><td class="col-sm-4">Min</td><td>${x.rpmin}</td></tr>
				</tbody>
			</table>
        </div>
    </div>

    <br/>
    <div class="row"  data-id="7">
		<h4 class="text-navy"><strong>Summary</strong></h4>

		<div class="col-sm-6 text-left">
            <table class="table table-borderless table-condensed" data-col="1">
				<tbody>
					<tr><td class="col-sm-4">Shrinkage </td><td>${x.encongimientoestado} </td></tr>
                    <tr><td>Reversed </td><td>${x.reviradoestado} </td></tr>
                    <tr><td>Appearence </td><td>${x.aparienciaestado} </td></tr>
                    <tr><td>Density </td><td>${x.densidadestado} </td></tr>
                    <tr><td>Fastness to rub </td><td>${x.solidezfroteestado} </td></tr>
                    <tr><td>Washability </td><td>${x.solidezlavadoestado} </td></tr>
                    <tr><td>Resistance to pilling </td><td>${x.resistenciapillingestado} </td></tr>
				</tbody>
			</table>
        </div>
    </div>


</div>
`
    _('tab-1').innerHTML = r;

}



function refrescarpartida_index() {
    let par = _('txtpar_partida_index').value,
        url = 'Laboratorio/Partida/Index';
    _Go_Url(url, url, par);
}

function fn_editarpartida() {
    let idpartida = _('hf_idpartida_index').value;

    _Body({
        url: 'Laboratorio/Partida/Editar_Partida',
        ventana: '_EditarPartida',
        titulo: 'Edit Departure',
        parametro: `accion:editar,idpartida:${idpartida}`,
        fn: function () {
            _('divmenu_breadcrum').classList.add('hide');
            _('divdetalle_breadcrum').classList.add('hide');
        }
    });
}

function res_getDataPartida_Parafinalizar(respuesta, parametroreproceso) {
    let orpta = respuesta !== '' ? JSON.parse(respuesta) : null;

    if (orpta !== null) {
        let parametro = {
            idsolicitudpartida: orpta[0].idsolicitudpartida, idpartida: orpta[0].idpartida, reportetecnico: orpta[0].reportetecnico, partidaestado: orpta[0].partidaestado,
            codigotela: orpta[0].codigotela, estadoenviosolicitudgenerarcodgotela: orpta[0].estadoenviosolicitudgenerarcodgotela, aprobadocomercial: orpta[0].aprobadocomercial,
            comentariofinalizacionpartida: parametroreproceso['ComentarioFinalizacionPartida']
        };

        //if (orpta[0].partidaestado == 2) {
        //    parametro['tiporeproceso'] = parametroreproceso['tiporeproceso'];
        //    parametro['comentarioreproceso'] = parametroreproceso['comentarioreproceso'];
        //}

        let enviar_correo_codigotelapo = false;
        //// EN ESTA REGLA PARA FINALIZAR LA PARTIDA SIN CODIGO DE TELA; SI HAY APROBACION DE COMERCIAL ENTONCES SE MANDARA CORREO A DESARROLLOTEXTIL
        //// PARA SOLICITAR EL CODIGO DE TELA PO; DE LO CONTRARIO NO SE CUMPLE ESTA REGLA SE FINALIZARA LA PARTIDA CON RECHAZO PERO 
        //// SIN MANDAR EL CORREO A DESARROLLO TEXTIL; EN ESTE CASO QUEDARIA PENDIENTE EL CODIGO DE TELA
        if ((orpta[0].partidaestado == 1 && orpta[0].codigotela.trim() === '') || (orpta[0].partidaestado == 2 && orpta[0].codigotela.trim() === '' && orpta[0].aprobadocomercial == true)) {
            // FINALIZAR SIN CODIGO DE TELA
            enviar_correo_codigotelapo = true;
            parametro['estadoenviosolicitudgenerarcodgotela'] = 1;
            let frmdata = new FormData();
            frmdata.append('par', JSON.stringify(parametro));

            let _err = function (error) { console.log("error", error) }
            _Post('Laboratorio/SolicitudPartida/FinalizarSinCodigoTela', frmdata)
           .then((respuesta) => {
               let orpta_finalizar = respuesta !== '' ? JSON.parse(respuesta) : null;
               res_finalizarpartida_sincodigotela(orpta_finalizar, orpta[0], enviar_correo_codigotelapo);
           }, (p) => { _err(p) });

        } else if (orpta[0].partidaestado == 1 || orpta[0].partidaestado == 2) {  // PARA LOS ESTADOS APROVADOS O RECHAZADOS
            //// FINALIZAR CON CODIGO DE TELA O SIN CODIGO DE TELA
            let frmdata = new FormData();
            frmdata.append('par', JSON.stringify(parametro));

            let _err = function (error) { console.log("error", error) }
            _Post('Laboratorio/SolicitudPartida/FinalizarConCodigoTela', frmdata)
           .then((respuesta) => {
               let orpta_finalizar = respuesta !== '' ? JSON.parse(respuesta) : null;
               res_finalizarpartida_concodigotela(orpta_finalizar);
           }, (p) => { _err(p) });
        } else if (orpta[0].partidaestado == 3) {  // PARA LOS ESTADOS PENDIENTES
            //// FINALIZAR CON CODIGO DE TELA O SIN CODIGO DE TELA
            parametro['estadofinalizadopendiente'] = 'si';
            let frmdata = new FormData();
            frmdata.append('par', JSON.stringify(parametro));

            let _err = function (error) { console.log("error", error) }
            _Post('Laboratorio/SolicitudPartida/FinalizarEnEstadoPendiente', frmdata)
           .then((respuesta) => {
               let orpta_finalizar = respuesta !== '' ? JSON.parse(respuesta) : null;
               res_finalizarpartida_concodigotela(orpta_finalizar);
           }, (p) => { _err(p) });
        }
    }
}

function res_finalizarpartida_sincodigotela(respuesta, parametros_antesdegrabar, enviar_correo_codigotelapo) {
    // ENVIAR CORREO DE SOLICITUD DE CODIGO TELA PO
    let mensaje = respuesta.mensaje, estadopartida = parametros_antesdegrabar.partidaestado;
    if (enviar_correo_codigotelapo === true && parametros_antesdegrabar.estadoenviosolicitudgenerarcodgotela == 0) {
        let par = parametros_antesdegrabar.idsolicitudpartida;
        
        let _err = function (__error) { console.log("error", __error) };
        _Get('Laboratorio/SolicitudPartida/Get_solicitudCodigoTela_workflow?par=' + par)
           .then((odata_respuesta) => {
               let orpta = odata_respuesta !== '' ? JSON.parse(odata_respuesta) : null;
               if (orpta !== null) {
                   let idsolicitud = orpta[0].idsolicitud, idservicio = orpta[0].idservicio;
                   if (idsolicitud != 0) {
                       let parametro_enviocorreo = { idsolicitud: idsolicitud, idservicio: idservicio, origen: 1 }
                       _Get('Laboratorio/SolicitudPartida/EnviarCorreo_SolicitudCodigoTelaPo?par=' + JSON.stringify(parametro_enviocorreo))
                           .then(function (oresponse) {
                               let orespuesta = JSON.parse(oresponse);
                               if (orespuesta.Success) {
                                   
                                   if (estadopartida == 1) {
                                       __opartida.parametro.estado = 'approved';
                                   } else if (estadopartida == 2) {
                                       __opartida.parametro.estado = 'rejected';
                                   }
                                   recargabandeja_partidaxid();
                               }
                               return orespuesta;
                           }, function (reason) { console.log("error 1 ", reason); })
                           .then(function (oresponse) {
                               let tipo = oresponse.Success ? 'success' : 'error';
                               swal({
                                   title: "Message",
                                   text: mensaje,
                                   type: tipo
                               }, function (accion) {
                                   //oculta mensaje
                                   if (accion) {
                                       if (estadopartida == 2) {  // PARATIDA RECHAZADA
                                           $('#modal__FinalizarConReproceso').modal('hide');
                                       } else {
                                           $('#modalConfirm').modal('hide');
                                       }

                                   }
                               });
                           });
                   }
               }
           }, (p) => { _err(p) });
    } else {
        let tipo = respuesta.estado === 'success' ? 'success' : 'error';
        swal({
            title: "Message",
            text: mensaje,
            type: tipo
        }, function (accion) {
            //oculta mensaje
            if (accion) {
                if (estadopartida == 2) {  // PARATIDA RECHAZADA
                    $('#modal__FinalizarConReproceso').modal('hide');
                } else {
                    $('#modalConfirm').modal('hide');
                }

            }
        });
    }
}

function res_finalizarpartida_concodigotela(respuesta) {
    let mensaje = respuesta.mensaje, tipo = respuesta.estado, data = respuesta.data !== '' ? JSON.parse(respuesta.data) : null;
    swal({
        title: "Message",
        text: mensaje,
        type: tipo
    }, function (accion) {
        //oculta mensaje
        if (accion) {
            if (data !== null) {
                let partidaestado = data[0].partidaestado, str_estadopartida = '';
                if (partidaestado == 1) {
                   str_estadopartida = 'approved';
                } else if (partidaestado == 2) {
                    str_estadopartida = 'rejected';
                } else {
                    str_estadopartida = 'pending';
                }

                if (data[0].partidaestado == 2) {  // PARTIDA RECHAZADO
                    $('#modal__FinalizarConReproceso').modal('hide');
                    __opartida.parametro.estado = 'rejected';
                    recargabandeja_partidaxid();
                } else {
                    //$('#modalConfirm').modal('hide');
                    $('#modal__FinalizarConReproceso').modal('hide');
                    __opartida.parametro.estado = str_estadopartida; //'approved';
                    recargabandeja_partidaxid();
                }
            } else {
                $('#modalConfirm').modal('hide');
            }
        }
    });
}

function recargabandeja_partidaxid() {
    const idpartida = __opartida.parametro.idpartida;
    const estadopartida = __opartida.parametro.estado.toLowerCase();
    const asubmenufiltro = Array.from(_('submenuestado').getElementsByTagName('a'));
    const indice = asubmenufiltro.findIndex(x=>x.dataset.estado === estadopartida);
    const item = (indice >= 0) ? asubmenufiltro[indice] : null;
    if (item !== null && idpartida !== '') { req_load_menu_filter_byid(item, idpartida.toString()) }
}

(function ini() {
    load();
    req_ini();
})();