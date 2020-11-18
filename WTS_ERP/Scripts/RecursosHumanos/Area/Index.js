var app_Area_Index = (
    function (d, idpadre) {

        var ovariables = {
            arr_area: [],
            idarea: 0
        }

        function load() {
            fn_load_estado();

            _('txt_area').addEventListener('keyup', event_load_area);
            $('#cbo_estado').on('change', req_change_estado);

            _('btn_editar').addEventListener('click', req_edit);
            _('btn_nuevo').addEventListener('click', req_new);
        }

        /* General */
        function fn_load_estado() {
            let cbo_estado = `<option value=0>Activo</option><option value=1>Inactivo</option>`;
            _('cbo_estado').innerHTML = cbo_estado;
            $('#cbo_estado').select2();
        }

        function event_load_area() {
            event.preventDefault();
            if (event.keyCode === 13) {
                req_load_area();
            }
        }

        function req_change_estado() {
            let estado = _('cbo_estado').value;
            if (estado == '0') { _('btn_editar').classList.remove('hide'); }
            else { _('btn_editar').classList.add('hide'); }
            req_ini();
        }
        
        function req_new() {
            _modalBody_Opacity({
                url: 'RecursosHumanos/Area/_NewArea',
                idmodal: 'NewArea',
                paremeter: '',
                title: 'Nuevo',
                width: '',
                height: '',
                backgroundtitle: 'bg-success',
                animation: 'none',
                responsive: 'modal-lg',
                bloquearpantallaprincipal: true
            });
        }

        function req_edit() {
            if (ovariables.idarea != 0) {
                let par = `idarea:${ovariables.idarea}`;
                let urlaccion = 'RecursosHumanos/Area/_EditArea';
                _modalBody_Opacity({
                    url: urlaccion,
                    idmodal: 'EditArea',
                    paremeter: par,
                    title: 'Editar',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-success',
                    animation: 'none',
                    responsive: 'modal-lg',
                    bloquearpantallaprincipal: true
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe seleccionar un registro", type: "warning" }); }
        }

        /* Inicial */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let estado = _('cbo_estado').value;
            let parametro = { estado: estado };
            let urlaccion = 'RecursosHumanos/Area/Area_List?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.arr_area = rpta[0].area != '' ? JSON.parse(rpta[0].area) : [];
                    }
                    req_load_area();
                }, (p) => { err(p); });
        }

        function req_load_area() {
            let arr_area = ovariables.arr_area, resultado_area = [],
                 area = _('txt_area').value;
            resultado_area = arr_area.filter(x=>(x.area.toLowerCase().indexOf(area.toLowerCase) > -1 || x.area.toLowerCase().indexOf(area.toLowerCase()) > -1));            
            fn_load_area(resultado_area);
        }

        function fn_load_area(_resultado_area) {
            let resultado_area = _resultado_area,
               html = '', htmlheader = '', htmlbody = '';

            htmlheader = `
                <table id="tbl_area" class ="stripe row-border order-column" style="width: 100%; max-width: 100%;  padding-right: 0px;">
                    <thead>
                        <tr>                            
                            <th style="width:45%">Área</th>
                            <th style="width:10%">Sub Área</th>
                            <th style="width:45%">Responsable</th>
                        </tr>
                    </thead>
                    <tbody>
                `
            ;

            resultado_area.forEach(x=> {
                let chksubarea = '';
                if (x.idpadre !== 0) {
                    chksubarea = `<div class='infont col-md-3 col-sm-4 text-center'><a href='#'><i class='fa fa-check'><span Style='Display: none;'>Si</span> </i></a></div>`;
                }

                htmlbody += `
                    <tr data-par='idarea:${x.idarea}'>
                        <td>${x.area}</td>
                        <td class ='text-center'>${chksubarea}</td>
                        <td>${x.nombrepersonal}</td>
                    </tr>
                `;
            });

            html += htmlheader + htmlbody + '</tbody></table>';
            _('div_tabla_area').innerHTML = html;

            let tbl = _('tbl_area').tBodies[0], total = tbl.rows.length;
            handler_table(total);
            format_table();
        }

        function handler_table(indice) {
            let tbl = _('tbl_area').tBodies[0], rows = tbl.rows, row = rows[indice];
            let array = Array.from(rows);
            array.forEach(x=> { x.addEventListener('click', event_rows); });
        }

        function event_rows(e) {
            let o = e.currentTarget, row = o, tbl = _('tbl_area'), rows = tbl.rows;
            fn_clean_rows(rows);
            row.classList.add('row-selected');
            let par = row.getAttribute('data-par')
            ovariables.idarea = parseInt(_getPar(par, 'idarea'));
        }

        function fn_clean_rows(rows) {
            ovariables.idarea = 0;
            let array = Array.from(rows);
            array.some(x=> { if (x.classList.contains('row-selected')) { x.classList.remove('row-selected'); return true; } });
        }

        function format_table() {
            $('#tbl_area').DataTable({
                scrollY: "455px",
                scrollX: true,
                scrollCollapse: true,
                ordering: false,
                searching: false,
                info: false,
                bPaginate: false
                //"pageLength": 50
            });
        }

        /* Funcion Modal */
        function _modalBody_Opacity(oparametro) {
            let url = oparametro.url,
                idmodal = oparametro.idmodal,
                paremeter = oparametro.paremeter || '',
                title = oparametro.title,
                width = oparametro.width || '',
                height = oparametro.height || '',
                backgroundtitle = oparametro.backgroundtitle || '',
                classanimation = oparametro.animation || '',
                claseresponsive = oparametro.responsive || '',
                disabledmainscreen = oparametro.bloquearpantallaprincipal || '';
            if (!_isEmpty(idmodal)) {
                _promise().then(function () {
                    _modal_Opacity(idmodal, width, height, backgroundtitle, classanimation, claseresponsive, disabledmainscreen);
                }).then(function () {
                    let urlJS = (!_isEmpty(oparametro.urljs)) ? oparametro.urljs : url,
                        modal_header = _(`modal_header_${idmodal}`),
                        modal_title = _(`modal_title_${idmodal}`),
                        modal_body = _(`modal_body_${idmodal}`),
                        _err = function (error) { console.log("error", error) }

                    //modal_header.classList.add(backgroundtitle);
                    modal_title.innerHTML = !_isEmpty(title) ? title : 'Titulo';
                    $(`#modal_${idmodal}`).modal({ show: true });

                    /*Para que sea arrastable*/
                    //$(`#modal_dialog_${idmodal}`).draggable({
                    //    handle: '.modal-content'
                    //});

                    _Get(url)
                        .then((vista) => {
                            let contenido = (paremeter !== '') ? vista.replace('DATA-PARAMETRO', paremeter) : vista;
                            modal_body.innerHTML = contenido;
                        }, (p) => { _err(p) })
                        .then(() => { _Getjs(urlJS) }, (p) => { _err(p) })
                })
            }
        }

        function _modal_Opacity(_idmodal, _width, _height, _backgroundtitle, _classanimation, _claseresponsive, _disabledmainscreen) {
            let classbackgroundtitle = _backgroundtitle || 'bg-primary';
            let html = '',
                classmodal = 'class' + _idmodal,
                width = !_isEmpty(_claseresponsive) ? '' : (!_isEmpty(_width) ? `width:${_width}px` : 'width:900px'), // ??
                claseresponsive = _claseresponsive || '',
                height = (!_isEmpty(_height)) ? _height.toString() + 'px;' : 'auto;', // ??
                heightbody = (!_isEmpty(_height)) ? (parseInt(_height) - 80) + 'px' : 'auto', // ??
                max_heightbody = heightbody,
                classtittle = classbackgroundtitle,
                classanimation = !_isEmpty(_classanimation) ? (_classanimation.trim() === 'none' ? '' : ' ' + ` animated ${_classanimation.trim()}`) : '';

            let modalinbody = document.getElementById(`modal_${_idmodal}`);
            if (modalinbody != null) {
                document.body.removeChild(modalinbody);
            }
            let defaulttitle = 'New';

            html += `<div id='modal_${_idmodal}' class='modal fade ${classmodal}' role='dialog' data-dismiss='modal' data-backdrop='static'>`;
            html += `   <div id='modal_dialog_${_idmodal}' class='modal-dialog ${claseresponsive}'>`; //falta clase responsiva
            html += `       <div id='modal_content_${_idmodal}' class='modal-content' style='height:${height}'>`; //falta estilo height            
            html += `           <div id='modal_header_${_idmodal}' class='modal-header ${classtittle}'>`;
            html += `               <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span class='fa fa-close' aria-hidden='true'></span></button>`;
            //html += `           <div id='modal_header_${_idmodal}' class='modal-header ${classtittle}'>`;
            //html += `               <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span class='fa fa-close' aria-hidden='true'></span></button>`;
            html += `               <h4 id='modal_title_${_idmodal}' class='modal-title'>${defaulttitle}</h4>`;
            html += `           </div>`;
            html += `           <div id='modal_body_${_idmodal}' class='modal-body wrapper wrapper-content gray-bg'>`; //falta agregar class wrapper
            html += `           </div>`;
            html += `       </div>`;
            html += `   </div>`;
            html += `</div>`;

            $('body').append(html);
        }


        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_area_index');

(function ini() {
    app_Area_Index.load();
    app_Area_Index.req_ini();
})();