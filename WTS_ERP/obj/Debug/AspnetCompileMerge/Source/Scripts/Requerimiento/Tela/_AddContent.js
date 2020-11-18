var app_AddContent = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            array_save: []
        }

        function load() {
            _('botonAddContent').addEventListener('click', fn_add);
            _('btnContentSaveModal').addEventListener('click', fn_save);

            // Se obtiene parametro si tuviera
            const par = _('addyarns_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
            }
        }

        function req_ini() {
            const data = app_NewFabric.ovariables.ArrayGuardarContenido;
            const tbody = _('tbl_add_content').children[1];
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<tr>
                                <td>
                                    <button type="button" class="btn btn-xs btn-danger" onclick="app_AddContent.fn_remove(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                                <td>
                                    <select class="form-control input-sm">
                                        ${fn_fiber(x.IdMateriaPrima)}
                                    </select>
                                </td>
                                <td>
                                    <input type="number" class="form-control input-sm" value="${_getCleanedString(x.PorcentajeComposicion)}" />
                                </td>
                            </tr>`;
                }).join('');
                tbody.innerHTML = html;
            }
        }

        function fn_fiber(id) {
            let options = ' <option value="0">Select</option>';
            if (app_NewFabric.ovariables.ListaMateriaPrimaCsv.length > 0) {
                options += app_NewFabric.ovariables.ListaMateriaPrimaCsv.map(x => {
                    return `<option value="${x.codigo}" ${x.codigo === id ? 'selected' : ''}>${x.descripcion}</option>`
                }).join('');
            }
            return options;
        }

        function fn_add() {
            const tbody = _('tbl_add_content').children[1];
            tbody.insertAdjacentHTML('beforeend', `<tr>
                                                        <td>
                                                            <button type="button" class="btn btn-xs btn-danger" onclick="app_AddContent.fn_remove(this)">
                                                                <i class="fa fa-trash"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <select class="form-control input-sm">
                                                                ${fn_fiber()}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input type="number" class="form-control input-sm" />
                                                        </td>
                                                    </tr>`);
        }

        function fn_create_array() {
            let array = [];
            ovariables.json_save = [];
            if (_('tbl_add_content').children[1].children.length > 0) {
                [..._('tbl_add_content').children[1].children].forEach(x => {
                    const idmateria = x.children[1].children[0].value;
                    const nombremateria = app_NewFabric.ovariables.ListaMateriaPrimaCsv.filter(y => y.codigo === x.children[1].children[0].value)[0].descripcion;
                    const porcentaje = x.children[2].children[0].value + '%';

                    let json = {};
                    json["IdMateriaPrima"] = idmateria;
                    json["NombreMateriaPrima"] = nombremateria;
                    json["PorcentajeComposicion"] = porcentaje;
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
                        texto += `, ${x.PorcentajeComposicion} ${x.NombreMateriaPrima}`;
                    } else {
                        texto += `${x.PorcentajeComposicion} ${x.NombreMateriaPrima}`;
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
            if (_('tbl_add_content').children[1].children.length > 0) {
                if (fn_val_table_field('#tbl_add_content')) {

                    let arraySave= fn_create_array();
                    ovariables.array_save = arraySave;
                    let cntOriginal = ovariables.array_save.length;
                    let cntUnicas = ([... new Set(arraySave.map(x => x.IdMateriaPrima))]).length;

                    if (cntOriginal === cntUnicas) {
                        app_NewFabric.ovariables.ArrayGuardarContenido = fn_create_array();
                        _('txtFabricContent').value = fn_get_array_text(ovariables.array_save);
                        $("#modal_AddContent").modal('hide');
                    } else {
                        swal({ title: "Warning", text: "Fiber must be unique", type: "warning", timer: 5000 });
                    }

                } else {
                    swal({ title: "Warning", text: "Complete the red fields", type: "warning", timer: 5000 });
                }
            } else {
                swal({ title: "Warning", text: "You have to add at least 1 content", type: "warning", timer: 5000 });
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_remove: fn_remove,
            fn_create_array: fn_create_array,
            fn_val_table_field: fn_val_table_field
        }
    }
)(document, 'panelEncabezado_AddContent');
(
    function ini() {
        app_AddContent.load();
        app_AddContent.req_ini();
    }
)();