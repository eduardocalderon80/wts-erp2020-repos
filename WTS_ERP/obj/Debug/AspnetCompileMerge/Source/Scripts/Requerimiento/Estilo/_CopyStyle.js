var app_CopyStyle = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: '',
            idprograma: 0,
            lstcarryover: [],
            datatable: ''
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnCopyStyleSave').addEventListener('click', fn_save);

            let par = _('copystyle_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.idcliente = _par(par, 'idcliente');
                ovariables.idprograma = _par(par, 'idprograma') !== '' ? _parseInt(_par(par, 'idprograma')) : 0;
            }

            $('.treeview_container').slimScroll({
                height: '375px',
                width: '100%',
                railOpacity: 0.9
            });
        }

        function _initTreeView() {
            $(".treeview_container span").unbind();
            $(".treeview_container span").click(function () {
                $(this).toggleClass('fa-plus fa-minus');
                $(this).next().slideToggle(200);
            });
        }

        function req_ini() {
            const err = function (__err) { console.log('err', __err) };
            const parametro = { IdRequerimiento: ovariables.id };
            _Get('Requerimiento/Estilo/GetStyleCarryOverNew?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstcarryover = rpta;

                        const Json_Tela = rpta.ListaEnlacesTela !== '' ? JSON.parse(rpta.ListaEnlacesTela) : [];
                        const Json_Avio = rpta.ListaEnlacesAvio !== '' ? JSON.parse(rpta.ListaEnlacesAvio) : [];
                        fn_createtreeview('div_style_fabric', 'checkbox_style_fabric', Json_Tela, true);
                        fn_createtreeview('div_style_avio', 'checkbox_style_avio', Json_Avio);

                        _('txtCopyStyleCode').value = rpta.CodigoEstilo;
                        _('txtCopyStyleSupplierName').value = rpta.NombreProveedor;
                    }
                }, (p) => { err(p); });
        }

        function fn_createtreeview(parent, id, data, children = false) {
            const div = _(parent);
            if (data.length > 0) {
                const html = data.map((x, y) => {
                    let children_html = ``;
                    if (children) {
                        const JsonColor = x.EnlacesColor !== '' ? JSON.parse(x.EnlacesColor) : [];
                        const JsonArte = x.EnlacesArte !== '' ? JSON.parse(x.EnlacesArte) : [];
                        children_html = `<div class="pl-20 pt-5">
                                            <span class="fa fa-minus"></span> Colors
                                            <div class="pl-20" id="div_style_color">
                                                ${fn_createtreeview_children('checkbox' + y + '_style_color', JsonColor, 'checkbox_style_general', x.IdRequerimiento)}
                                            </div>
                                        </div>
                                        <div class="pl-20 pt-5">
                                            <span class="fa fa-minus"></span> Ornaments
                                            <div class="pl-20" id="div_style_art">
                                                ${fn_createtreeview_children('checkbox' + y + '_style_art', JsonArte, 'checkbox_style_general', x.IdRequerimiento)}
                                            </div>
                                        </div>`;
                    }
                    return `<div class="checkbox checkbox-green" data-id="${x.IdRequerimiento}">
                                <input id="${id}${y}" type="checkbox" name="${id}" data-id="${x.IdRequerimiento}">
                                <label for="${id}${y}">
                                    ${x.Descripcion}
                                </label>
                            </div>
                            ${children_html}`;
                }).join('');
                const selectall = `<div class="checkbox checkbox-green">
                                        <input id="${id}_select_all" type="checkbox" name="${id}" onclick="app_CopyStyle.fn_check_all_parent(this, '${parent}')">
                                        <label for="${id}_select_all">
                                            All Items
                                        </label>
                                    </div>`
                div.innerHTML = `${selectall}${html}`;
                _initTreeView();
            }
        }

        function fn_createtreeview_children(id, data, name, parentid) {
            if (data.length > 0) {
                const html = data.map((x, y) => {
                    return `<div class="checkbox checkbox-green" data-id="${x.IdRequerimiento}">
                                <input id="${id}${y}" type="checkbox" name="${id}" data-id="${x.IdRequerimiento}" data-check="${name}" data-parent="${parentid}">
                                <label for="${id}${y}">
                                    ${x.Descripcion}
                                </label>
                            </div>`;
                }).join('');
                const selectall = `<div class="checkbox checkbox-green">
                                        <input id="${id}_select_all" type="checkbox" name="${id}" onclick="app_CopyStyle.fn_check_all(this, '${id}')">
                                        <label for="${id}_select_all">
                                            All Items
                                        </label>
                                    </div>`
                return `${selectall}${html}`;
            } else {
                return '';
            }
        }

        function fn_check_all_parent(button, id) {
            const checked = $(button).prop("checked");
            if (checked) {
                $(`#${id} input`).prop("checked", true);
            } else {
                $(`#${id} input`).prop("checked", false);
            }
        }

        function fn_check_all(button, name) {
            const checked = $(button).prop("checked");
            if (checked) {
                $(`input[name="${name}"]`).prop("checked", true);
            } else {
                $(`input[name="${name}"]`).prop("checked", false);
            }
        }

        function fn_get_tela() {
            let array = [];
            const html = [...document.querySelectorAll('#treeview_style input[name="checkbox_style_fabric"]:checked')];
            if (html.length > 0) {
                html.forEach(x => {
                    let json = {};
                    if (x.getAttribute("data-id") !== '' && x.getAttribute("data-id") !== null) {
                        json["IdRequerimiento"] = x.getAttribute("data-id");
                        let enlaces = [];
                        [...document.querySelectorAll('#treeview_style input[data-check="checkbox_style_general"]:checked')].forEach(z => {
                            let obj = {};
                            if (z.getAttribute("data-parent") === x.getAttribute("data-id")) {
                                obj["IdRequerimientoEnlace"] = z.getAttribute("data-id");
                                enlaces.push(obj);
                            }
                        });
                        json["Enlaces"] = JSON.stringify(enlaces);
                        array.push(json);
                    }
                });
            }
            return array;
        }

        function fn_get_avio() {
            let array = [];
            const html = [...document.querySelectorAll('#treeview_style input[name="checkbox_style_avio"]:checked')];
            if (html.length > 0) {
                html.forEach(x => {
                    let json = {};
                    if (x.getAttribute("data-id") !== '' && x.getAttribute("data-id") !== null) {
                        json["IdRequerimiento"] = x.getAttribute("data-id");
                        array.push(json);
                    }
                });
            }
            return array;
        }

        function fn_save() {
            //const checked = $("#treeview_style input:checked").length;
            //if (checked > 0) {
                
            //} else {
            //    swal({ title: "Warning", text: "You have to select at least 1 link", type: "warning", timer: 5000 });
            //}
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will create a requirement with the selected items",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                let parametro = {
                    IdRequerimiento: ovariables.id,
                    IdCliente: ovariables.idcliente,
                    IdPrograma: ovariables.idprograma,
                    JSONTela: fn_get_tela(),
                    JSONAvio: fn_get_avio()
                }
                frm.append('par', JSON.stringify(parametro));
                _Post('Requerimiento/Estilo/SaveStylesCarryOverNew', frm, true)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            swal({ title: "Good job!", text: "The requirement was created successfully", type: "success", timer: 5000 });
                            $("#modal_SearchStyle").modal("hide");
                            $("#modal_CopyStyle").modal("hide");
                            // Update main stage
                            _('btnUpdate').click();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_check_all: fn_check_all,
            fn_check_all_parent: fn_check_all_parent,
            fn_get_tela: fn_get_tela,
            fn_get_avio: fn_get_avio
        }
    }
)(document, 'panelEncabezado_CopyStyle');
(
    function ini() {
        app_CopyStyle.load();
        app_CopyStyle.req_ini();
    }
)();