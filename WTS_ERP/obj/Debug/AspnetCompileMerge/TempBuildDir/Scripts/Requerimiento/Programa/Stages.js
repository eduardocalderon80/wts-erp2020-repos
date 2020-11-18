var appStages = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            nombre: '',
            idcliente: '',
            cliente: '',
            temporada: '',
            division: '',
            marca: '',
            idgrupopersonal: '',
            lstprecios: [],
            lstprecios: [],
            lsttelas: [],
            lstestilos: [],
            lstcolores: [],
            lsttelas: [],
            lstartes: [],
            lstavios: [],
            codfase:'DS'
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            _initializeIboxTools();

            // Events()
            _('btnReturn').addEventListener('click', fn_return);
            _('btnUpdate').addEventListener('click', fn_update);
            _('btn_buscar_trim').addEventListener('click', fn_buscar_trim, false);
            _('btn_buscar_color').addEventListener('click', fn_buscar_color, false);
            _('btn_buscar_arte').addEventListener('click', fn_buscar_arte, false);
          
            [...document.getElementsByClassName('txtsearch')].forEach(x => {
                x.addEventListener('keyup', fn_searchkeyup);
            });
            
            // Call Functions
            fn_createscroll();

            const par = _('txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');

                if (ovariables.accion === 'edit') {
                    ovariables.nombre = _par(par, 'nombre');
                    ovariables.idcliente = _par(par, 'idcliente');
                    ovariables.cliente = _par(par, 'cliente');
                    ovariables.temporada = _par(par, 'temporada');
                    ovariables.division = _par(par, 'division');
                    ovariables.marca = _par(par, 'marca');
                    ovariables.idgrupopersonal = _par(par, 'idgrupopersonal');

                    _('txtNombrePrograma').innerHTML = `${_capitalizePhrase(ovariables.nombre)} / ${_capitalizePhrase(ovariables.cliente)} / ${_capitalizePhrase(ovariables.marca)} / ${_capitalizePhrase(ovariables.temporada)} / ${_capitalizePhrase(ovariables.division)}`;
                }
            }

            $('#modal_NewColor,#modal_NewOrnament').on('hidden.bs.modal', function () {
                if ($('.modal.in').length > 0) {
                    $('body').addClass('modal-open');
                }
            });

            $(document).on('show.bs.modal','.modal', function (event) {
                if (event.namespace === 'bs.modal') {
                    let zIndex = 2050 + (10 * $('.modal:visible').length);
                    $(this).css('z-index', zIndex);
                    this.setAttribute('style', `z-index:${zIndex}!important; display: block;`);
                    setTimeout(function () {
                        $('.modal-backdrop').not('.modal-stack').attr('style', 'z-index:' + (zIndex - 1) + '!important').addClass('modal-stack');
                    }, 1);
                }                
            });

            [...document.querySelectorAll('#tabfases li ')].forEach((x) => {                
                    x.addEventListener('click', function(e) {
                        fn_setfases(x.getAttribute("data-id"));
                    });            
            });

            _('btn_viewmodal_facturacionsample').addEventListener('click', fn_viewmodal_facturacionsample, false);
        }

        function fn_viewmodal_facturacionsample() {
            let idprograma = ovariables.id;
            _modalBody_Backdrop({
                url: 'Requerimiento/FacturacionSample/_Inicio',
                idmodal: '_Inicio',
                title: 'Sample Billing',
                paremeter: `idprograma:${idprograma},idcliente:${ovariables.idcliente}`,
                width: '',
                height: '570',
                responsive: 'width-modal-req',
                backgroundtitle: 'bg-green',
                animation: 'none',
                bloquearteclado: false
            });
        }

        function fn_setfases(dataid) {
            ovariables.codfase = dataid;
        }

        function fn_createscroll() {
            $('.agile-list').slimScroll({
                height: '260px',
                width: '100%',
                railOpacity: 0.9
            });
        }

        function fn_createdrag() {
            const dragGen = [...document.getElementsByClassName('dragGen')];
            dragGen.forEach(x => {
                x.addEventListener('dragstart', dragstart);
                x.draggable = true;
            });
            const dropGen = [...document.getElementsByClassName('dropGen')];
            dropGen.forEach(x => {
                x.addEventListener('drop', drop);
                x.addEventListener('dragover', dragover);
            });
        }

        function dragstart(e) {
            const idrequerimiento = e.target.getAttribute('data-requerimiento');
            const tipo = e.target.getAttribute('data-tipo');
            const json = { IdRequerimiento: idrequerimiento, Tipo: tipo };
            e.dataTransfer.setData('text/plain', JSON.stringify(json));
        }

        function drop(e) {
            const o = e.currentTarget;
            const json_transfer = JSON.parse(e.dataTransfer.getData('text/plain'));
            const idrequerimiento_origen = json_transfer.IdRequerimiento;
            const idrequerimiento_destino = o.getAttribute('data-requerimiento'); //o.closest("li").getAttribute('data-requerimiento');
            const tipo_origen = json_transfer.Tipo;
            const tipo_destino = o.getAttribute('data-tipo');

            if (tipo_destino === 'RT' && tipo_origen !== 'RT') {
                if (tipo_origen === 'RC' || tipo_origen === 'RO') {
                    fn_link_reqs(idrequerimiento_origen, idrequerimiento_destino);
                } else {
                    swal({ title: "Error!", text: "You cannot link the selected requirement with this fabric", type: "error", timer: 5000 });
                }
            } else if (tipo_destino === 'RE' && tipo_origen !== 'RE') {
                if (tipo_origen === 'RT' || tipo_origen === 'RA') {
                    fn_link_reqs(idrequerimiento_origen, idrequerimiento_destino);
                } else {
                    swal({ title: "Error!", text: "You cannot link the selected requirement with this style", type: "error", timer: 5000 });
                }
            }
        }

        function fn_link_reqs(idrequerimiento_origen, idrequerimiento_destino) {
            swal({
                html: true,
                title: "Are you sure?",
                text: `You will link the selected requirement`,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                let parametro = {
                    IdRequerimientoOrigen: idrequerimiento_origen,
                    IdRequerimientoDestino: idrequerimiento_destino,
                    Observacion: ''
                };
                frm.append('par', JSON.stringify(parametro));
                _Post('Requerimiento/Programa/SaveEnlaceRequerimiento', frm, true)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            if (orpta.data !== "0") {
                                swal({ title: "Good job!", text: "The requirement was linked successfully", type: "success", timer: 5000 });
                                _('btnUpdate').click();
                                req_ini();
                            } else {
                                swal({ title: "Error!", text: "The requirement is already linked", type: "error", timer: 5000 });
                            }
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function dragover(e) {
            e.preventDefault();
        }

        function fn_fullscreen(e) {
            let element = $(e).closest('.row');
            let button = $(e).find('i');
            $('body').toggleClass('fullscreen-ibox-mode');
            button.toggleClass('fa-expand').toggleClass('fa-compress');
            element.toggleClass('div_fullscreen');
            setTimeout(function () {
                $(window).trigger('resize');
            }, 100);
        }

        function fn_minimizar(e) {
            let element = $(e).closest('li');
            let button = $(e).find('i');
            let details = element.find('div.details_content');
            details.slideToggle(200);
            button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        }

        function fn_searchkeyup(e) {
            const input = this.value.toUpperCase();
            const elements = e.currentTarget.parentElement.nextElementSibling.children[0].children;
            const arrelems = [...elements];

            //console.log(arrelems);

            if (input !== '' && arrelems.length > 0) {
                arrelems.forEach((x, indice) => {
                    const status = x.children[0].textContent;
                    const title = x.children[1].textContent;
                    const title2 = x.children[2].textContent;
                    const description = x.children[3].textContent;
                    const description2 = x.children[4] !== undefined ? x.children[4].textContent : '';
                    const description3 = x.children[5] !== undefined ? x.children[5].textContent : '';

                    //console.log('indice: ' + indice + '=>' + status + ' ' + title + ' ' + title2 + ' ' + description + ' ' + description2);

                    if (status.toUpperCase().indexOf(input) > -1 || title.toUpperCase().indexOf(input) > -1 || title2.toUpperCase().indexOf(input) > -1
                        || description.toUpperCase().indexOf(input) > -1 || description2.toUpperCase().indexOf(input) > -1 || description3.toUpperCase().indexOf(input) > -1) {
                        x.style.display = "";
                    } else {
                        x.style.display = "none";
                    }
                });
            } else {
                arrelems.forEach(x => {
                    x.style.display = "";
                });
            }
        }

        function req_ini() {
            fn_styles();
            fn_color();
            fn_tela();
            fn_arte();
            fn_trim();
            fn_prices();
        }

        /* Begin */
        /********************************************************************************************************************
        * Section: Prices
        *********************************************************************************************************************/

        function fn_prices() {
            let err = function (__err) { console.log('err', __err) },
                parametro = ovariables.id;
            _Get('Requerimiento/Precio/GetFlashCostByProgram?par=' + parametro)
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstprecios = rpta;
                        fn_createprices(ovariables.lstprecios);
                    }
                }, (p) => { err(p); });
        }

        function fn_createprices(data) {
            let html = ``;
            if (data.length > 0) {
                data.forEach(x => {
                    html += `<li class="${fn_labelstatus1(_capitalizePhrase(x.estadoNombre))}" data-tipo="RP" data-id="${x.idflashcost}" data-requerimiento="${x.IdRequerimiento}">
                                <span class="label ${fn_labelstatus2(_capitalizePhrase(x.estadoNombre))} label-status float-right">${_capitalizePhrase(x.estadoNombre)}</span>
                                <strong>${x.tipoflashcost}</strong><br>
                                <div class="agile-detail m-t-none">
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_deleteprice(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_viewresume(this)">
                                        <i class="fa fa-list-ul"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_viewflashcost(this)">
                                        <i class="fa fa-eye"></i>
                                    </button>
                                    <span class="cortar-label f-z-13">${x.fechacreacion}</span>
                                </div>                        
                            </li>`;
                });
            }

            $("#custom-tab-2 .div_prices .agile-list").html("");
            $("#custom-tab-2 .div_prices .agile-list").append(html);
        }

        function fn_deleteprice(button) {
            const id = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lstprecios.filter(x => x.IdRequerimiento === _parseInt(id))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'DELE');
            if (rules) {
                if (_isnotEmpty(id)) {
                    swal({
                        html: true,
                        title: "Are you sure you want to delete this price?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                IdRequerimiento: id,
                                IdPrograma: ovariables.id
                            },
                            frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Precio/DeletePrice', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({ title: "Good job!", text: "The style was deleted successfully", type: "success", timer: 5000 });
                                    // Refresh
                                    //_('btnUpdate').click();
                                    fn_prices();
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                }
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_viewflashcost(button) {
            const idflash = button.parentElement.parentElement.getAttribute("data-id");
            const urlAccion = 'Comercial/Flash/_View';
            _Go_Url(urlAccion, urlAccion, `id:${idflash},accion:edit,idprograma:${ovariables.id},nombre:${ovariables.nombre},idcliente:${ovariables.idcliente},cliente:${ovariables.cliente},temporada:${ovariables.temporada},division:${ovariables.division}`);
        }

        function fn_viewresume(button) {
            const idflash = button.parentElement.parentElement.getAttribute("data-id");
            _modalBody_Backdrop({
                url: 'Requerimiento/Precio/_Resume',
                idmodal: 'ResumePrice',
                paremeter: `id:${idflash},accion:edit,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                title: 'Resume Price',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'modal-lg',
                bloquearteclado: false,
            });
        }

        function fn_flash_costA() {
            const urlAccion = 'Comercial/Flash/New';
            _Go_Url(urlAccion, urlAccion, `id:0,accion:edit,idprograma:${ovariables.id},nombre:${ovariables.nombre},idcliente:${ovariables.idcliente},cliente:${ovariables.cliente},temporada:${ovariables.temporada},division:${ovariables.division},idgrupopersonal:${ovariables.idgrupopersonal}`);
        }

        function fn_prices_search() {
            _modalBody_Backdrop({
                url: 'Requerimiento/Precio/_Search',
                idmodal: 'SearchPrices',
                paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                title: 'Search',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'width-modal-req',
                bloquearteclado: false,
            });
        }

        function fn_prices_summary() {
            _modalBody_Backdrop({
                url: 'Requerimiento/Precio/_Summary',
                idmodal: 'SummaryPrices',
                paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                title: 'Summary',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'width-modal-req',
                bloquearteclado: false,
            });
        }

        /* End */

        /* Copiar */

        function fn_fabric_copy() {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'COPY', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Tela/_SearchFabric',
                    idmodal: 'SearchFabric',
                    paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                    title: 'Search Fabric',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_style_copy() {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'COPY', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Estilo/_SearchStyle',
                    idmodal: 'SearchStyle',
                    paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                    title: 'Search Style',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        /* End */

        function fn_styles() {
            let err = function (__err) { console.log('err', __err) },
                parametro = ovariables.id;
            _Get('Requerimiento/Estilo/GetListaEstiloByPrograma_JSON?par=' + parametro)
                .then((resultado) => {                   
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstestilos = rpta;
                        fn_createstyle(ovariables.lstestilos);
                    }
                }, (p) => { err(p); });
        }

        function fn_arte() {
            let err = function (__err) { console.log('err', __err) },
                parametro = ovariables.id;
            _Get('Requerimiento/Ornamento/GetListaArteByPrograma_JSON?par=' + parametro)
                .then((resultado) => {
                    //let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstartes = rpta;
                        fn_createarte(ovariables.lstartes);
                    }
                }, (p) => { err(p); });
        }

        function fn_createarte(data) {
            let html = ``;
            if (data.length > 0) {
                data.forEach(x => {
                    html += `<li class="${fn_labelstatus1(_capitalizePhrase(x.estadoNombre))} dragGen" data-tipo="RO" data-id="${x.IdRequerimientoDetalle}" data-requerimiento="${x.IdRequerimiento}">
                                <span class="label ${fn_labelstatus2(_capitalizePhrase(x.estadoNombre))} label-status float-right">${_capitalizePhrase(x.estadoNombre)}</span>
                                ${x.Enlazado === 1 ? '<span class="label label-primary label-status float-right" onclick="appStages.fn_deletelink(' + x.IdRequerimiento + ')"><i class="fa fa-link"></i></span>' : ''}
                                <strong>${x.TipoSolicitud !== '' ? _capitalizePhrase(x.TipoSolicitud) : '&nbsp'}</strong><br>
                                <div class="agile-detail m-t-none">
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_deleteArte(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_enlazarcorreo(this)">
                                        <i class="fa fa-envelope-o"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_editArte(this)">
                                        <i class="fa fa-pencil"></i>
                                    </button> 
                                    <button class="pull-right btn btn-xs btn-white"  onclick="appStages.fn_copiarArte(this)">
                                        <i class="fa fa-copy"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white">
                                        <i class="fa fa-thumbs-o-up"></i>
                                    </button>
                                    <span class="cortar-label f-z-13">${x.ArteTotal !== '' ? _capitalizePhrase(x.ArteTotal) : '&nbsp'}</span>
			                        <span class="cortar-label f-z-13">${x.Proveedor !== '' ? _capitalizePhrase(x.Proveedor) : '&nbsp'}</span>
                                </div>                      
                            </li>`;
                });
            }
            $("#custom-tab-2 .div_art .agile-list").html("");
            $("#custom-tab-2 .div_art .agile-list").append(html);

            // LUEGO DE QUE SE CARGUEN DRAG
            fn_createdrag();
        }

        function fn_deleteArte(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const req = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lstartes.filter(x => x.IdRequerimiento === _parseInt(req))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'DELE');
            if (rules) {
                if (_isnotEmpty(id)) {
                    swal({
                        html: true,
                        title: "Are you sure you want to delete this Ornament?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                IdRequerimientoDetalle: id,
                                IdPrograma: ovariables.id
                            },
                            frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Ornamento/DeleteArteById_JSON', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({ title: "Good job!", text: "The style was deleted successfully", type: "success", timer: 5000 });
                                    // Refresh
                                    _('btnUpdate').click();
                                } else {
                                    swal({ title: "Error", text: "You must delete the links to remove this ornament", type: "error", timer: 5000 });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                }
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_editArte(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const idRequerimiento = button.parentElement.parentElement.getAttribute("data-requerimiento");

            const obj = ovariables.lstartes.filter(x => x.IdRequerimiento === _parseInt(idRequerimiento))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'EDIT');

            if (rules) {
                fn_newart(id, idRequerimiento);
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }   

        function fn_copiarArte(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const idRequerimiento = button.parentElement.parentElement.getAttribute("data-requerimiento");

            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'COPY', false);

            if (rules) {
                fn_newart(-id, idRequerimiento);
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_newart(id, idRequerimiento) {
            if (id === 0) {
                const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'NEW', false);
                if (rules) {
                    _modalBody_Backdrop({
                        url: 'Requerimiento/Ornamento/_NewOrnament',
                        idmodal: 'NewOrnament',
                        paremeter: `id:` + id + `,Idrequerimiento:` + idRequerimiento + `,Idprograma:` + ovariables.id + `,Idcliente:${ovariables.idcliente}`,
                        title: 'New Ornament',
                        width: '',
                        height: '570',
                        backgroundtitle: 'bg-green',
                        animation: 'none',
                        responsive: 'width-modal-req',
                        bloquearteclado: false,
                    });
                } else {
                    swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
                }
            } else {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Ornamento/_NewOrnament',
                    idmodal: 'NewOrnament',
                    paremeter: `id:` + id + `,Idrequerimiento:` + idRequerimiento + `,Idprograma:` + ovariables.id + `,Idcliente:${ovariables.idcliente}`,
                    title: 'New Ornament',
                    width: '',
                    height: '570',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            }
        }

        function fn_color() {
            let err = function (__err) { console.log('err', __err) },
                parametro = ovariables.id;
            _Get('Requerimiento/Color/GetListaColorByPrograma_JSON?par=' + parametro)
                .then((resultado) => {
                    
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstcolores = rpta;
                        fn_createcolor(ovariables.lstcolores);
                    }
                }, (p) => { err(p); });
        }
      
        function fn_createcolor(data) {
            let html = ``;
            if (data.length > 0) {
                data.forEach(x => {
                    html += `<li class="${fn_labelstatus1(_capitalizePhrase(x.estadoNombre))} dragGen" data-tipo="RC" data-id="${x.IdRequerimientoDetalle}" data-requerimiento="${x.IdRequerimiento}">
                                <span class="label ${fn_labelstatus2(_capitalizePhrase(x.estadoNombre))} label-status float-right">${_capitalizePhrase(x.estadoNombre)}</span>
                                ${x.Enlazado === 1 ? '<span class="label label-primary label-status float-right" onclick="appStages.fn_deletelink(' + x.IdRequerimiento +')"><i class="fa fa-link"></i></span>' : ''}
                                <strong>${x.TelaTotal !== '' ? _capitalizePhrase(x.TelaTotal) : '&nbsp'}</strong><br>
                                <div class="agile-detail m-t-none">
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_deleteColor(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_enlazarcorreo(this)">
                                        <i class="fa fa-envelope-o"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_editColor(this)">
                                        <i class="fa fa-pencil"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_copiarColor(this)" btn-white">
                                        <i class="fa fa-copy"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white">
                                        <i class="fa fa-thumbs-o-up"></i>
                                    </button>
                                    <span class="cortar-label f-z-13">${x.DescripcionTela !== '' ? _capitalizePhrase(x.DescripcionTela) : '&nbsp'}</span>
                                    <span class="cortar-label f-z-13">${x.Proveedor !== '' ? _capitalizePhrase(x.Proveedor) : '&nbsp'}</span>
                                </div>                     
                            </li>`;
                });
            }
            $("#custom-tab-2 .div_color .agile-list").html("");
            $("#custom-tab-2 .div_color .agile-list").append(html);

            // LUEGO DE QUE SE CARGUEN DRAG
            fn_createdrag();
        }

        function fn_deleteColor(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const req = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lstcolores.filter(x => x.IdRequerimiento === _parseInt(req))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'DELE');
            if (rules) {
                if (_isnotEmpty(id)) {
                    swal({
                        html: true,
                        title: "Are you sure you want to delete this Color?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                IdRequerimientoDetalle: id,
                                IdPrograma: ovariables.id
                            },
                            frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Color/DeleteColorById_JSON', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({ title: "Good job!", text: "The style was deleted successfully", type: "success", timer: 5000 });
                                    // Refresh
                                    _('btnUpdate').click();
                                } else {
                                    swal({ title: "Error", text: "You must delete the links to remove this Color", type: "error", timer: 5000 });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                }
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_editColor(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const idRequerimiento = button.parentElement.parentElement.getAttribute("data-requerimiento");

            const obj = ovariables.lstcolores.filter(x => x.IdRequerimiento === _parseInt(idRequerimiento))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'EDIT');

            if (rules) {
                fn_newcolor(id, idRequerimiento);
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_copiarColor(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const idRequerimiento = button.parentElement.parentElement.getAttribute("data-requerimiento");

            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'COPY', false);

            if (rules) {
                fn_newcolor(-id, idRequerimiento);
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_newcolor(id, idRequerimiento) {
            if (id === 0) {
                const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'NEW', false);
                if (rules) {
                    _modalBody_Backdrop({
                        url: 'Requerimiento/Color/_NewColor',
                        idmodal: 'NewColor',
                        paremeter: `id:` + id + `,Idrequerimiento:` + idRequerimiento + `,Idprograma:` + ovariables.id + `,Idcliente:${ovariables.idcliente}`,
                        title: 'New Color',
                        width: '',
                        height: '570',
                        backgroundtitle: 'bg-green',
                        animation: 'none',
                        responsive: 'width-modal-req',
                        bloquearteclado: false,
                    });
                } else {
                    swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
                }
            } else {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Color/_NewColor',
                    idmodal: 'NewColor',
                    paremeter: `id:` + id + `,Idrequerimiento:` + idRequerimiento + `,Idprograma:` + ovariables.id + `,Idcliente:${ovariables.idcliente}`,
                    title: 'New Color',
                    width: '',
                    height: '570',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            }
        }
        
        function fn_tela() {
            let err = function (__err) { console.log('err', __err) },
                parametro = ovariables.id;
            _Get('Requerimiento/Tela/GetListaTelaByPrograma_JSON?par=' + parametro)
                .then((resultado) => {
                   
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lsttelas = rpta;
                        fn_createtela(ovariables.lsttelas);
                    }
                }, (p) => { err(p); });
        }

        function fn_createlinks(json, bool = false, parent) {
            let html = '';
            if (json.length > 0) {
                json.forEach(x => {
                    html += `<tr data-requerimiento-enlace="${x.IdRequerimiento}">
                                <td>
                                    <button type="button" class="btn btn-xs btn-danger" onclick="appStages.fn_deletelink(${x.IdRequerimiento})">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                                <td>${bool === true ? fn_create_radio_style(x.IdRequerimiento, parent, x.Principal) : x.Titulo1}</td>
                                <td>${x.Titulo2}</td>
                            </tr>`;
                });
            }
            return html;
        }

        function fn_create_radio_style(id, parent, mark) {
            return `<input class="icheck-main-fabric" type="radio" data-id="${id}" name="icheck-main-fabric-${parent}" ${mark === 1 ? 'checked' : ''} />`
        }

        function fn_icheck_radio_style() {
            $('.icheck-main-fabric').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                const id = $(this).data('id');

                swal({
                    html: true,
                    title: "Are you sure?",
                    text: "You will mark this style as main fabric",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = { IdRequerimiento: id },
                            frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Estilo/SaveMainFabric', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({ title: "Good job!", text: "The link was marked successfully", type: "success", timer: 5000 });
                                    // Refresh
                                    _('btnUpdate').click();
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    } else {
                        $('.icheck-main-fabric').prop('checked', false);
                        $('.icheck-main-fabric').iCheck('update');
                    }
                });
            });
        }

        function fn_deletelink(id) {
            swal({
                html: true,
                title: "Are you sure?",
                text: `You will delete the selected link`,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                swal({
                    title: "Enter an Observation",
                    type: "input",
                    confirmButtonColor: "#1c84c6",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    inputPlaceholder: "Observation"
                }, function (inputValue) {
                    if (inputValue !== false) {
                        let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                        let parametro = {
                            IdRequerimiento: id,
                            Observacion: inputValue
                        };
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Programa/DeleteEnlaceRequerimiento', frm, true)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    if (orpta.data !== '0') {
                                        swal({ title: "Good job!", text: "The link was deleted successfully", type: "success", timer: 5000 });
                                        _('btnUpdate').click();
                                    } else {
                                        swal({ title: "Error", text: "You must delete the fabric combination to remove this link", type: "error", timer: 5000 });
                                    }
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    } else {
                        return false;
                    }
                });
            });
        }

        function fn_createtela(data) {
            let html = ``;
            if (data.length > 0) {
                data.forEach(x => {
                    html += `<li class="${fn_labelstatus1(_capitalizePhrase(x.estadoNombre))} dragGen dropGen" data-tipo="RT" data-id="${x.IdRequerimientoDetalle}" data-requerimiento="${x.IdRequerimiento}">
                                <span class="label ${fn_labelstatus2(_capitalizePhrase(x.estadoNombre))} label-status float-right">${_capitalizePhrase(x.estadoNombre)}</span>
                                ${x.Enlazado === 1 ? '<span class="label label-primary label-status float-right" onclick="appStages.fn_deletelink(' + x.IdRequerimiento + ')"><i class="fa fa-link"></i></span>' : ''}
                                <strong>${x.Solicitud !== '' ? _capitalizePhrase(x.Solicitud) : '&nbsp'} - ${x.CodigoTelaWTS !== '' ? _capitalizePhrase(x.CodigoTelaWTS) : '&nbsp'}</strong><br>
                                <span>${x.DescripcionTela !== '' ? _capitalizePhrase(x.DescripcionTela) : '&nbsp'}</span><br>
                                <span>${x.NombreProveedorDirecto !== '' ? _capitalizePhrase(x.NombreProveedorDirecto) : '&nbsp'}</span>
                                <div class="agile-detail">
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_deletefabric(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_enlazarcorreo(this)">
                                        <i class="fa fa-envelope-o"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_editTela(this)">
                                        <i class="fa fa-pencil"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_copy_fabric_single(this)">
                                        <i class="fa fa-copy"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_fabric_price('${x.IdRequerimiento}')">
                                        <i class="fa fa-money"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white">
                                        <i class="fa fa-thumbs-o-up"></i>
                                    </button>
                                    <button class="btn btn-xs btn-success-outline btn-outline details_fire" onclick="appStages.fn_minimizar(this)">
                                        <i class="fa fa-chevron-up"></i> Details
                                    </button>
                                </div>
                                <div class="agile-detail details_content" style="display: none;">
                                    <div class="mt-15">
                                        <span class="label label-success">ASOCIATION FABRIC/COLOR</span>
                                        <table class="table table-center table-hover no-margins">
                                            <thead>
                                                <tr>
                                                    <th width="15%"></th>
                                                    <th>Color Combo</th>
                                                    <th>Client Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>${fn_createlinks(x.ListaEnlaceColor !== '' ? JSON.parse(x.ListaEnlaceColor) : [])}</tbody>
                                        </table>
                                    </div>
                                    <div class="mt-15">
                                        <span class="label label-success">ASOCIATION FABRIC/ORNAMENTS</span>
                                        <table class="table table-center table-hover no-margins">
                                            <thead>
                                                <tr>
                                                    <th width="15%"></th>
                                                    <th>Ornament Combo</th>
                                                    <th>Client Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>${fn_createlinks(x.ListaEnlacesArte !== '' ? JSON.parse(x.ListaEnlacesArte) : [])}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </li>`;
                });
            }
            $("#custom-tab-2 .div_fabric .agile-list").html("");
            $("#custom-tab-2 .div_fabric .agile-list").append(html);

            // LUEGO DE QUE SE CARGUEN DRAG
            fn_createdrag();
        }

        function fn_copy_fabric_single(button) {
            const id = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lsttelas.filter(x => x.IdRequerimiento === _parseInt(id))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'EDIT');
            if (rules) {
                if (_isnotEmpty(id)) {
                    _modalBody_Backdrop({
                        url: 'Requerimiento/Tela/_CopyFabric',
                        idmodal: 'CopyFabric',
                        paremeter: `id:${id},accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                        title: 'Copy Fabric',
                        width: '',
                        height: '',
                        backgroundtitle: 'bg-green',
                        animation: 'none',
                        responsive: '',
                        bloquearteclado: false,
                    });
                } else {
                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                }
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_deletefabric(button) {
            const id = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lsttelas.filter(x => x.IdRequerimiento === _parseInt(id))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'DELE');
            if (rules) {
                if (_isnotEmpty(id)) {
                    swal({
                        html: true,
                        title: "Are you sure you want to delete this fabric?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                IdRequerimiento: id,
                                IdPrograma: ovariables.id
                            },
                            frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Tela/DeleteTela', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    if (orpta.data !== '0') {
                                        swal({ title: "Good job!", text: "The trim was deleted successfully", type: "success", timer: 5000 });
                                        // Refresh
                                        _('btnUpdate').click();
                                    } else {
                                        swal({ title: "Error", text: "You must delete the links to remove this fabric", type: "error", timer: 5000 });
                                    }
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                }
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }
        
        function fn_editTela(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const idRequerimiento = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lsttelas.filter(x => x.IdRequerimiento === _parseInt(idRequerimiento))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'EDIT');
            if (rules) {
                fn_newfabric(id, idRequerimiento);
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }
        
        function fn_newfabric(id, idRequerimiento) {

            let strTitulo = id == 0 ?'New Fabric' :'Edit Fabric';

            if (id === 0) {
                const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'NEW', false);
                if (rules) {
                    _modalBody_Backdrop({
                        url: 'Requerimiento/Tela/_NewFabric',
                        idmodal: 'NewFabric',
                        paremeter: `id:` + id + `,Idrequerimiento:` + idRequerimiento + `,Idprograma:` + ovariables.id + `,Idcliente:${ovariables.idcliente}`,
                        title: strTitulo,
                        width: '',
                        height: '570',
                        backgroundtitle: 'bg-green',
                        animation: 'none',
                        responsive: 'width-modal-req',
                        bloquearteclado: false,
                    });
                } else {
                    swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
                }
            } else {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Tela/_NewFabric',
                    idmodal: 'NewFabric',
                    paremeter: `id:` + id + `,Idrequerimiento:` + idRequerimiento + `,Idprograma:` + ovariables.id + `,Idcliente:${ovariables.idcliente}`,
                    title: strTitulo,
                    width: '',
                    height: '570',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            }
        }
                      
        function fn_createstyle(data) {
            let html = ``;
            if (data.length > 0) {
                data.forEach(x => {
                    html += `<li class="${fn_labelstatus1(_capitalizePhrase(x.CatalogoEstadoEstilo))} dropGen" data-tipo="RE" data-id="${x.IdEstilo}" data-requerimiento="${x.IdRequerimiento}">
                                <span class="label ${fn_labelstatus2(_capitalizePhrase(x.CatalogoEstadoEstilo))} label-status float-right">${_capitalizePhrase(x.CatalogoEstadoEstilo)}</span>
                                <strong>${x.NombreTipoSolicitudEstilo}</strong><br>
                                <span>${x.CodigoEstilo} - ${x.UltimaMuestra}</span><br>
                                <span>${x.NombreProveedor}</span>
                                <div class="agile-detail">
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_deletestyle(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_enlazarcorreo(this)">
                                        <i class="fa fa-envelope-o"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_editstyle(this)">
                                        <i class="fa fa-pencil"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_copy_style_single(this)">
                                        <i class="fa fa-copy"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white">
                                        <i class="fa fa-thumbs-o-up"></i>
                                    </button>
                                    <button class="btn btn-xs btn-success-outline btn-outline details_fire" onclick="appStages.fn_minimizar(this)">
                                        <i class="fa fa-chevron-up"></i> Details
                                    </button>
                                </div>
                                <div class="agile-detail details_content" style="display: none;">
                                    <div class="mt-15">
                                        <span class="label label-success mt-15">ASOCIATION STYLE/FABRIC</span>
                                        <table class="table table-center table-hover no-margins">
                                            <thead>
                                                <tr>
                                                    <th width="15%"></th>
                                                    <th>Main</th>
                                                    <th>WTS Fabric Code</th>
                                                </tr>
                                            </thead>
                                            <tbody>${fn_createlinks(x.ListaEnlacesTela !== '' ? JSON.parse(x.ListaEnlacesTela) : [], true, x.IdRequerimiento)}</tbody>
                                        </table>
                                    </div>
                                    <div class="mt-15">
                                        <span class="label label-success">ASOCIATION STYLE/TRIMS</span>
                                        <table class="table table-center table-hover no-margins">
                                            <thead>
                                                <tr>
                                                    <th width="15%"></th>
                                                    <th>Type</th>
                                                    <th>Trim Code</th>
                                                </tr>
                                            </thead>
                                            <tbody>${fn_createlinks(x.ListaEnlacesAvio !== '' ? JSON.parse(x.ListaEnlacesAvio) : [])}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </li>`;
                });
            }
            $("#custom-tab-2 .div_style .agile-list").html("");
            $("#custom-tab-2 .div_style .agile-list").append(html);

            // LUEGO DE QUE SE CARGUEN DRAG
            fn_createdrag();
            fn_icheck_radio_style();
        }

        function fn_copy_style_single(button) {
            const id = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lstestilos.filter(x => x.IdRequerimiento === _parseInt(id))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'COPY');
            if (rules) {
                if (_isnotEmpty(id)) {
                    _modalBody_Backdrop({
                        url: 'Requerimiento/Estilo/_CopyStyle',
                        idmodal: 'CopyStyle',
                        paremeter: `id:${id},accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                        title: 'Copy Style',
                        width: '',
                        height: '',
                        backgroundtitle: 'bg-green',
                        animation: 'none',
                        responsive: '',
                        bloquearteclado: false,
                    });
                } else {
                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                }
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }
               
        function fn_newtrim() {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'NEW', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Avio/_NewTrim',
                    idmodal: 'NewTrim',
                    paremeter: `id:0,accion:new`,
                    title: 'New Trim',
                    width: '',
                    height: '570',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_newstyle() {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'NEW', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Estilo/_NewStyle',
                    idmodal: 'NewStyle',
                    paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente}`,
                    title: 'New Style',
                    width: '',
                    height: '570',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_editstyle(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const idrequerimiento = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lstestilos.filter(x => x.IdRequerimiento === _parseInt(idrequerimiento))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'EDIT');
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Estilo/_NewStyle',
                    idmodal: 'NewStyle',
                    paremeter: `id:${id},accion:edit,idcliente:${ovariables.idcliente},idrequerimiento:${idrequerimiento}`,
                    title: 'New Style',
                    width: '',
                    height: '570',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_deletestyle(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const req = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lstestilos.filter(x => x.IdRequerimiento === _parseInt(req))[0]
            obj.IdGrupoPersonal = appStages.ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'DELE');
            if (rules) {
                if (_isnotEmpty(id)) {
                    swal({
                        html: true,
                        title: "Are you sure you want to delete this style?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                IdEstilo: id,
                                IdPrograma: ovariables.id
                            },
                            frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Estilo/DeleteEstiloById_JSON', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({ title: "Good job!", text: "The style was deleted successfully", type: "success", timer: 5000 });
                                    // Refresh
                                    _('btnUpdate').click();
                                } else {
                                    swal({ title: "Error", text: "You must delete the links to remove this style", type: "error", timer: 5000 });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                }
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }


        function fn_createtrim(data) {
            let html = ``;
            if (data.length > 0) {
                data.forEach(x => {
                    html += `<li class="${fn_labelstatus1(_capitalizePhrase(x.NombreEstado))} dragGen" data-tipo="RA" data-id="${x.IdRequerimiento}" data-requerimiento="${x.IdRequerimiento}">
                                <span class="label ${fn_labelstatus2(_capitalizePhrase(x.NombreEstado))} label-status float-right">${_capitalizePhrase(x.NombreEstado)}</span>
                                ${x.Enlazado === 1 ? '<span class="label label-primary label-status float-right" onclick="appStages.fn_deletelink('+ x.IdRequerimiento +')"><i class="fa fa-link"></i></span>' : ''}
                                <strong>${x.NombreTipoSolicitud}, ${x.DesFlgDetalle}</strong><br>
                                <div class="agile-detail m-t-none">
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_deletetrim(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_enlazarcorreo(this)">
                                        <i class="fa fa-envelope-o"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white" onclick="appStages.fn_edittrim(${x.IdRequerimiento},this)">
                                        <i class="fa fa-pencil"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white cls_bnt_copiar_trim">
                                        <i class="fa fa-copy"></i>
                                    </button>
                                    <button class="pull-right btn btn-xs btn-white">
                                        <i class="fa fa-thumbs-o-up"></i>
                                    </button>
                                    <span class="cortar-label f-z-13" title="${x.DescripcionName}"> ${x.DescripcionName}</span>
                                    <span class="cortar-label f-z-13" title="${x.NombreProveedor}"> ${x.NombreProveedor}</span>
                                    <span class="cortar-label f-z-13" title="${x.NombreTipoAvio}"> ${x.NombreTipoAvio}</span>
                                </div>
                            </li>`;
                });
            }
            $("#custom-tab-2 .div_trim .agile-list").html("");
            $("#custom-tab-2 .div_trim .agile-list").append(html);

            // LUEGO DE QUE SE CARGUEN DRAG
            handler_ini_trim();
            fn_createdrag();
        }

        function handler_ini_trim() {
            Array.from(_('id_div_trim').getElementsByClassName('cls_bnt_copiar_trim')).forEach(x => x.addEventListener('click', e => {
                let o = e.currentTarget;
                let obj_li = o.parentNode.parentNode;
                let idrequerimiento = obj_li.getAttribute('data-id');
                fn_copiartrim(idrequerimiento);
            }, false));
        }

        function fn_copiartrim(idrequerimiento) {
            //let obj_li = o.parentNode.parentNode.parentNode;
            //let idtrim = obj_li.getAttribute('data-id');

            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'COPY', false);

            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Avio/_NewTrim',
                    idmodal: 'NewTrim',
                    paremeter: `id:${idrequerimiento},accion:copy`,
                    title: 'Copy Trim',
                    width: '',
                    height: '570',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_trim() {
            let err = function (__err) { console.log('err', __err) },
                parametro = ovariables.id;
            _Get('Requerimiento/Avio/GetListaAvioByPrograma_JSON?par=' + parametro)
                .then((resultado) => {
                    //let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstavios = rpta;
                        fn_createtrim(ovariables.lstavios);
                    }
                }, (p) => { err(p); });
        }

        function fn_deletetrim(button) {
            const id = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lstavios.filter(x => x.IdRequerimiento === _parseInt(id))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'DELE');
            if (rules) {
                if (_isnotEmpty(id)) {
                    swal({
                        html: true,
                        title: "Are you sure you want to delete this trim?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                IdRequerimiento: id,
                                IdPrograma: ovariables.id
                            },
                            frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Avio/DeleteAvio', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({ title: "Good job!", text: "The trim was deleted successfully", type: "success", timer: 5000 });
                                    // Refresh
                                    _('btnUpdate').click();
                                } else {
                                    swal({ title: "Error", text: "You must delete the links to remove this trim", type: "error", timer: 5000 });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                }
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_edittrim(idtrim, button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");

            const req = button.parentElement.parentElement.getAttribute("data-requerimiento");
            const obj = ovariables.lstavios.filter(x => x.IdRequerimiento === _parseInt(req))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'EDIT');

            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Avio/_NewTrim',
                    idmodal: 'NewTrim',
                    paremeter: `id:${idtrim},accion:edit`,
                    title: 'Edit Trim',
                    width: '',
                    height: '570',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }


        function fn_labelstatus1(status) {
            let html = ``;
            if (status === 'On Hold') {
                html = `warning-element`;
            } else if (status === 'Active') {
                html = `success-element`;
            } else if (status === 'Created') {
                html = `info-element`;
            } else if (status === 'Dropped') {
                html = `danger-element`;
            } else if (status === 'Ordered') {
                html = `primary-element`;
            }
            return html;
        }

        function fn_labelstatus2(status) {
            let html = ``;
            if (status === 'On Hold') {
                html = `label-warning`;
            } else if (status === 'Active') {
                html = `label-primary`;
            } else if (status === 'Created') {
                html = `label-success`;
            } else if (status === 'Dropped') {
                html = `label-danger`;
            } else if (status === 'Ordered') {
                html = `label-info`;
            }
            return html;
        }

        function fn_update() {
            $('.ibox').children('.ibox-content').prepend(`<div class="sk-spinner sk-spinner-double-bounce">
                                                            <div class="sk-double-bounce1"></div>
                                                            <div class="sk-double-bounce2"></div>
                                                        </div>`);
            $('.ibox').children('.ibox-content').toggleClass('sk-loading');
            req_ini();
            $('.ibox').children('.ibox-content').toggleClass('sk-loading');
        }

        function fn_enviar_multiple(button) {
            let stage = $(".custom-tab-btn.active").children().eq(0).attr("href");
            let req = $(button).closest('.ibox').attr("class").split(' ')[1];
            let listas = $(stage + " ." + req + " li");
            let titulo = $(stage + " ." + req + " h3");
            let botones = $(stage + " ." + req + " .input-group-btn");
            let nombre_req = req.split('_')[1];
            let hayregistros = $("#custom-tab-2 .div_fabric .agile-list").children().length > 0 ? '' : 'disabled'; 
            botones.children().remove();
            botones.prepend(`<button type="button" class="btn btn-sm btn-white" onclick="appStages.fn_cancelar_checkbox('${stage}', '${req}')">
                                <i class="fa fa-ban"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-white" onclick="appStages.fn_enviar_${nombre_req}('${stage}', '${req}')">
                                <i class="fa fa-check"></i>
                            </button>`);
            listas.prepend(`<div class="checkbox checkbox-custom">
                                <input type="checkbox" name="req_fabric_icheck" class="i-check-req">
                                <label></label>
                            </div>`);
            titulo.prepend(`<div class="checkbox checkbox-custom" onclick="appStages.fn_click_checkboxall(this)">
                                <input type="checkbox" name="req_fabric_icheck" class="i-check-req" ${hayregistros}>
                                <label class="pdt-3"></label>
                            </div>`);
        }

        function fn_click_checkboxall(button) {
            let stage = $(".custom-tab-btn.active").children().eq(0).attr("href");
            let req = $(button).closest('.ibox').attr("class").split(' ')[1];
            let checked = $(button).children().eq(0).prop("checked");
            if (checked) {
                $(stage + " ." + req + " input").prop("checked", true);
            } else {
                $(stage + " ." + req + " input").prop("checked", false);
            }
        }

        function fn_cancelar_checkbox(stage, req) {
            let botones = $(stage + " ." + req + " .input-group-btn");
            botones.children().remove();
            botones.prepend(`<button type="button" class="btn btn-sm btn-white" onclick="appStages.fn_newfabric(0,0)">
                                <i class="fa fa-plus"></i>
                             </button>
                             <button type="button" class="btn btn-sm btn-white">
                                 <i class="fa fa-search"></i>
                             </button>
                             <button type="button" class="btn btn-sm btn-white" onclick="appStages.fn_enviar_multiple(this)">
                                 <i class="fa fa-send"></i>
                             </button>
                            <button type="button" class="btn btn-sm btn-white">
                                <i class="fa fa-envelope"></i>
                            </button>`);
            $(stage + " ." + req + " .checkbox").remove();
        }

        function fn_enviar_fabric() {
            const marcados = $(".i-check-req[name='req_fabric_icheck']:checked").length;
            if (marcados > 0) {
                if ($("#custom-tab-2 .div_fabric .agile-list").children().length > 0) {
                    fn_fabric_reqs_simple();
                } else {
                    swal({ title: "Warning", text: "You have to select at least 1 requirement", type: "warning", timer: 5000 });
                }
            } else {
                fn_fabric_reqs_advance();
            }
        }

        function fn_fabric_reqs_simple() {
            _modalBody_Backdrop({
                url: 'Requerimiento/Tela/_FabricReqSimple',
                idmodal: 'FabricReqSimple',
                paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente}`,
                title: 'Fabric Requeriments',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: '',
                bloquearteclado: false,
            });
        }

        function fn_fabric_reqs_advance() {
            _modalBody_Backdrop({
                url: 'Requerimiento/Tela/_FabricReqAdvance',
                idmodal: 'FabricReqAdvance',
                paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente}`,
                title: 'Fabric Requeriments',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: '',
                bloquearteclado: false,
            });
        }

        function fn_sendemail_req(tipo) {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'EDIT', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Programa/_NewEmail',
                    idmodal: 'NewEmail',
                    paremeter: `id:0,idprograma:${ovariables.id},accion:new,tipo:${tipo}`,
                    title: 'New Email',
                    width: '',
                    height: '570',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_return() {
            const urlAccion = 'Requerimiento/Programa/Index';
            _Go_Url(urlAccion, urlAccion);
        }

        /* MODALES DE PRECIOS PARA REQUERIMIENTOS */

        function fn_style_price() {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'NEW', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Precio/_PriceStyle',
                    idmodal: 'StylePrices',
                    paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                    title: 'Style Prices',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_art_price() {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'EDIT', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Precio/_PriceOrnament',
                    idmodal: 'OrnamentPrices',
                    paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                    title: 'Ornament Prices',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_trim_price() {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'EDIT', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Precio/_PriceTrim',
                    idmodal: 'TrimsPrices',
                    paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                    title: 'Trims Prices',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'modal-lg',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_fabric_price(id) {
            const obj = ovariables.lsttelas.filter(x => x.IdRequerimiento === _parseInt(id))[0];
            obj.IdGrupoPersonal = ovariables.idgrupopersonal;
            const rules = _checkRowInfo(id, obj, 'EDIT');
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Precio/_PriceFabric',
                    idmodal: 'FabricPrices',
                    paremeter: `id:${id},accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                    title: 'Fabric Prices',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'modal-lg',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_fabric_price_all() {
            _modalBody_Backdrop({
                url: 'Requerimiento/Precio/_PriceFabricAll',
                idmodal: 'FabricAllPrices',
                paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                title: 'Fabric Prices',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'width-modal-req',
                bloquearteclado: false,
            });
        }

        function fn_buscar_trim() {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'COPY', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Avio/_SearchTrim',
                    idmodal: 'SearchTrim',
                    paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                    title: 'Search',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }
        function fn_buscar_color() {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'COPY', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Color/_SearchColor',
                    idmodal: 'SearchColor',
                    paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                    title: 'Search',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        function fn_buscar_arte() {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'COPY', false);
            if (rules) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Ornamento/_SearchArte',
                    idmodal: 'SearchArte',
                    paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                    title: 'Search',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        /* PARA ENLAZAR CORREO */
        function fn_enlazarcorreo(button) {
            const rules = _checkRowInfo(ovariables.idgrupopersonal, '', 'EDIT', false);
            if (rules) {
                const id = button.parentElement.parentElement.getAttribute("data-requerimiento");
                _modalBody_Backdrop({
                    url: 'Mailbox/Inbox/_Mail',
                    idmodal: '_SelectMail',
                    paremeter: `id:${id},accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.id}`,
                    title: 'Select Mail',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'width-modal-req',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_minimizar: fn_minimizar,
            fn_fullscreen: fn_fullscreen,
            fn_newstyle: fn_newstyle,
            fn_editstyle: fn_editstyle,
            fn_deletestyle: fn_deletestyle,
            fn_newcolor: fn_newcolor,
            fn_newfabric: fn_newfabric,
            fn_deleteColor: fn_deleteColor,
            fn_editColor: fn_editColor,
            fn_copiarColor: fn_copiarColor,
            fn_editArte: fn_editArte,
            fn_copiarArte: fn_copiarArte,
            fn_deleteArte: fn_deleteArte,
            fn_editTela: fn_editTela,
            fn_newart: fn_newart,
            fn_newtrim: fn_newtrim,
            fn_edittrim: fn_edittrim,
            fn_color: fn_color,
            fn_arte: fn_arte,
            fn_style_price: fn_style_price,
            fn_createdrag: fn_createdrag,
            fn_deletelink: fn_deletelink,
            fn_sendemail_req: fn_sendemail_req,
            fn_cancelar_checkbox: fn_cancelar_checkbox,
            fn_enviar_fabric: fn_enviar_fabric,
            fn_click_checkboxall: fn_click_checkboxall,
            fn_enviar_multiple: fn_enviar_multiple,
            fn_fabric_price: fn_fabric_price,
            fn_art_price: fn_art_price,
            fn_trim_price: fn_trim_price,
            fn_fabric_price_all: fn_fabric_price_all,
            fn_flash_costA: fn_flash_costA,
            fn_prices_search: fn_prices_search,
            fn_prices_summary: fn_prices_summary,
            fn_deleteprice: fn_deleteprice,
            fn_viewflashcost: fn_viewflashcost,
            fn_viewresume: fn_viewresume,
            fn_deletetrim: fn_deletetrim,
            fn_deletefabric: fn_deletefabric,
            fn_fabric_copy: fn_fabric_copy,
            fn_style_copy: fn_style_copy,
            fn_copy_fabric_single: fn_copy_fabric_single,
            fn_copy_style_single: fn_copy_style_single,
            fn_copiartrim: fn_copiartrim,
            fn_enlazarcorreo: fn_enlazarcorreo
        }
    }
)(document, 'panelEncabezado_Stages');
(
    function ini() {
        appStages.load();
        appStages.req_ini();
    }
)();