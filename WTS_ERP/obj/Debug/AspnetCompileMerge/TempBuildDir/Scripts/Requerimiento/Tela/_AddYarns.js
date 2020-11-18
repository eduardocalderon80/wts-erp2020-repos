var app_AddYarns = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            array_save: []
        }

        function load() {
            _('botonAddYarn').addEventListener('click', fn_add);
            _('btnYarnSaveModal').addEventListener('click', fn_save);

            // Se obtiene parametro si tuviera
            const par = _('addyarns_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
            }
        }

        function req_ini() {
            const data = app_NewFabric.ovariables.ArrayGuardarTitulo;
            const tbody = _('tbl_add_yarn').children[1];
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<tr>
                                <td>
                                    <button type="button" class="btn btn-xs btn-danger" onclick="app_AddYarns.fn_remove(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                                <td>
                                    <select class="form-control input-sm" onchange="app_AddYarns.fn_change(this)">
                                        ${fn_size_type(x.IdSistemaTitulacion)}
                                    </select>
                                </td>
                                <td>
                                    <select class="form-control input-sm">
                                        ${fn_size(x.IdSistemaTitulacion, x.IdTituloHiladoTela)}
                                    </select>
                                </td>
                            </tr>`;
                }).join('');
                tbody.innerHTML = html;
            }
        }

        function fn_size_type(id) {
            let options = ' <option value="0">Select</option>';
            if (app_NewFabric.ovariables.ListaSistemasTitulosCsv.length > 0) {
                options += app_NewFabric.ovariables.ListaSistemasTitulosCsv.map(x => {
                    return `<option value="${x.codigo}" ${x.codigo === id ? 'selected' : ''}>${x.descripcion}</option>`
                }).join('');
            }
            return options;
        }

        function fn_size(filterid, id) {
            let options = ' <option value="0">Select</option>';
            if (app_NewFabric.ovariables.ListaTitulosCsv.length > 0) {
                const filter = app_NewFabric.ovariables.ListaTitulosCsv.filter(x => x.Tipo === filterid);
                options += filter.map(x => {
                    return `<option value="${x.codigo}" ${x.codigo === id ? 'selected' : ''}>${x.descripcion}</option>`
                }).join('');
            }
            return options
        }

        function fn_change(e) {
            let options = ' <option value="0">Select</option>';
            const select = e.parentElement.nextElementSibling.children[0];
            if (app_NewFabric.ovariables.ListaTitulosCsv.length > 0) {
                const filter = app_NewFabric.ovariables.ListaTitulosCsv.filter(x => x.Tipo === e.value);
                options += filter.map(x => {
                    return `<option value="${x.codigo}">${x.descripcion}</option>`
                }).join('');
            }
            select.innerHTML = options;
        }

        function fn_add() {
            const tbody = _('tbl_add_yarn').children[1];
            tbody.insertAdjacentHTML('beforeend', `<tr>
                                                        <td>
                                                            <button type="button" class="btn btn-xs btn-danger" onclick="app_AddYarns.fn_remove(this)">
                                                                <i class="fa fa-trash"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <select class="form-control input-sm" onchange="app_AddYarns.fn_change(this)">
                                                                ${fn_size_type()}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select class="form-control input-sm">
                                                                <option value="">Select</option>
                                                            </select>
                                                        </td>
                                                    </tr>`);
        }

        function fn_create_array() {
            let array = [];
            ovariables.json_save = [];
            if (_('tbl_add_yarn').children[1].children.length > 0) {
                [..._('tbl_add_yarn').children[1].children].forEach(x => {
                    const idsistema = x.children[1].children[0].value;
                    const nombresistemas = app_NewFabric.ovariables.ListaSistemasTitulosCsv.filter(y => y.codigo === x.children[1].children[0].value)[0].descripcion;
                    const idtitulo = x.children[2].children[0].value;
                    const nombretitulo = app_NewFabric.ovariables.ListaTitulosCsv.filter(y => y.codigo === x.children[2].children[0].value)[0].descripcion

                    let json = {};
                    json["IdSistemaTitulacion"] = idsistema;
                    json["NombreSistemaTitulacion"] = nombresistemas;
                    json["IdTituloHiladoTela"] = idtitulo;
                    json["NombreTituloHiladoTela"] = nombretitulo;
                    array.push(json);
                });
            }
            return array;
        }

        function fn_remove(e) {
            const tr = e.parentElement.parentElement;
            tr.remove();
        }

        function fn_get_array_text(array) {
            let texto = '';
            if (array.length > 0) {
                array.forEach(x => {
                    // Save text
                    if (texto !== '') {
                        texto += `, ${x.NombreTituloHiladoTela} ${x.NombreSistemaTitulacion}`;
                    } else {
                        texto += `${x.NombreTituloHiladoTela} ${x.NombreSistemaTitulacion}`;
                    }
                });
            }
            return texto;
        }

        function fn_val_table_field(id) {
            let bool = true;
            // SELECT
            [...document.querySelectorAll(`${id} select`)].forEach(x => {
                if (x.value === '0' || x.value === '') {
                    bool = false;
                    x.style = 'border-color: #ed5565!important;';
                } else {
                    x.style = '';
                }
            });
            // INPUT
            [...document.querySelectorAll(`${id} input`)].forEach(x => {
                if (x.value === '') {
                    bool = false;
                    x.style = 'border-color: #ed5565!important;';
                } else {
                    x.style = '';
                }
            });
            return bool;
        }

        function fn_save() {
            if (_('tbl_add_yarn').children[1].children.length > 0) {
                if (fn_val_table_field('#tbl_add_yarn')) {
                    let arraySave = fn_create_array();

                    ovariables.array_save = arraySave

                    let cntOriginal = ovariables.array_save.length;
                    let cntUnicas = ([... new Set(arraySave.map(x => x.IdSistemaTitulacion))]).length;

                    if (cntOriginal === cntUnicas) {

                        app_NewFabric.ovariables.ArrayGuardarTitulo = fn_create_array();
                        _('txtFabricTitle').value = fn_get_array_text(ovariables.array_save);
                        $("#modal_AddYarnsSize").modal('hide');

                    } else {
                        swal({ title: "Warning", text: "Size type Must be unique", type: "warning", timer: 5000 });
                    }


                } else {
                    swal({ title: "Warning", text: "Complete the red fields", type: "warning", timer: 5000 });
                }
            } else {
                swal({ title: "Warning", text: "You have to add at least 1 yarn size", type: "warning", timer: 5000 });
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_remove: fn_remove,
            fn_change: fn_change,
            fn_create_array: fn_create_array
        }
    }
)(document, 'panelEncabezado_AddYarns');
(
    function ini() {
        app_AddYarns.load();
        app_AddYarns.req_ini();
    }
)();