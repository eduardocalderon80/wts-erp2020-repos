var app_CopyFabric = (
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
            // Events
            _('btnCopyFabricSave').addEventListener('click', fn_save);

            let par = _('copyfabric_txtpar').value;
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

            _initTreeView();
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
            _Get('Requerimiento/Tela/GetTelaCarryOverNew?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstcarryover = rpta;

                        const Json_Color = rpta.ListaEnlaceColor !== '' ? JSON.parse(rpta.ListaEnlaceColor) : [];
                        const Json_Arte = rpta.ListaEnlacesArte !== '' ? JSON.parse(rpta.ListaEnlacesArte) : [];
                        fn_createtreeview('div_fabric_color', 'checkbox_copy_color', Json_Color);
                        fn_createtreeview('div_fabric_art', 'checkbox_copy_art', Json_Arte);

                        _('txtCopyFabricCode').value = rpta.CodigoTelaWTS;
                        _('txtCopyFabricSupplierName').value = rpta.NombreProveedor;
                    }
                }, (p) => { err(p); });
        }

        function fn_createtreeview(parent, id, data) {
            const div = _(parent);
            if (data.length > 0) {
                const html = data.map((x, y) => {
                    return `<div class="checkbox checkbox-green" data-id="${x.IdRequerimiento}">
                                <input id="${id}${y}" type="checkbox" name="${id}" data-id="${x.IdRequerimiento}">
                                <label for="${id}${y}">
                                    ${x.Descripcion}
                                </label>
                            </div>`;
                }).join('');
                const selectall = `<div class="checkbox checkbox-green">
                                        <input id="${id}_select_all" type="checkbox" name="${id}" onclick="app_CopyFabric.fn_check_all(this, '${id}')">
                                        <label for="${id}_select_all">
                                            All Items
                                        </label>
                                    </div>`
                div.innerHTML = `${selectall}${html}`;
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

        function fn_get_ids() {
            let array = [];
            const html = [...document.querySelectorAll('#treeview_fabric input[type="checkbox"]:checked')];
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
            //const checked = $("#treeview_fabric input:checked").length;
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
                    JSONInfo: fn_get_ids()
                }
                frm.append('par', JSON.stringify(parametro));
                _Post('Requerimiento/Tela/SaveTelasCarryOverNew', frm, true)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            swal({ title: "Good job!", text: "The requirement was created successfully", type: "success", timer: 5000 });
                            $("#modal_SearchFabric").modal("hide");
                            $("#modal_CopyFabric").modal("hide");
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
            fn_get_ids: fn_get_ids
        }
    }
)(document, 'panelEncabezado_CopyFabric');
(
    function ini() {
        app_CopyFabric.load();
        app_CopyFabric.req_ini();
    }
)();