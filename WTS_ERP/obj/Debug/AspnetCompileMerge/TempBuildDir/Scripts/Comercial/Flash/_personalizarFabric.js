var personalizarFabric = (
    function (d, idpadre) {

        var ovariables = {
            listCampos: '',
            listCamposPerso: ''
        }

        function load() {        
            _('btnsaveperso').addEventListener('click', guardarCamposPerso);
            _('btncloseperso').addEventListener('click', ocultarPantalla);
        }  
             
        function _ini() {

            ovariables.listCampos = appNewFlash.ovariables.listCampos;
            ovariables.listCamposPerso = appNewFlash.ovariables.listCamposPerso;
            dibujarLista();
            ajustarControlCkeck();
            marcarCampos();                
        }

        function marcarCampos() {

            let listCampos = ovariables.listCamposPerso;
            let aData = listCampos.split(',');
            let reg = aData.length;

            for (x = 0; x < reg; x++) {
                let campo = aData[x];

                if (campo != '') {
                    let chk = document.getElementById("chk_"+campo);
                    chk.checked = true;
                    chk.parentNode.classList.add('checked');
                }
            }
        }

        function ajustarControlCkeck() {

            $("#divTablaDetalle  .i-checks._cls_criterio_cabecera").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                //let dom = e.currentTarget, valor = dom.getAttribute('data-valor'), estado = dom.checked;
                //seleccionar_all_chk_criterio(estado);
                });  
        }

        function dibujarLista() {

            let listCampos = ovariables.listCampos ;
            let objRespuesta = CSVtoJSON(listCampos, '¬', '^');
            let html = '';
            let tbody = _('tbody_campo');
            let numero = 6;

            objRespuesta.forEach(x => {

                numero++;
                let ctrlCheck = `<input type="checkbox" id='chk_${x.codigo}'  class="i-checks _group_busqueda" value="1" name="name_chk_busqueda" data-valor="0" style="position: absolute; opacity: 0;">`

                html += `<tr Idcampo='${x.codigo}' campo='${x.valor}' >
                                    <td class ='text-center'>
                                        <div class="i-checks _divgroup_busqueda">
                                           `+ ctrlCheck + `
                                        </div>
                                    </td>
                                    <td>${x.data}</td>    
                                    <td>${x.valor}</td> 
                                    <td style="text-align:center"  >${x.orden}</td> 
                              </tr>`;
            });

            tbody.innerHTML = html;

            $('.i-checks._group_busqueda').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget;
            });
        }             

        function guardarCamposPerso() {

            let tbl = _('tbody_campo');
            let totalFilas = tbl.rows.length;
            let listPerso = '';
            let listoculto = '';

            for (i = 0; i < totalFilas; i++) {

                row = tbl.rows[i];
                let Idcampo = row.getAttribute('Idcampo');
                let Id = 'chk_' + Idcampo;

                if ($('#' + Id).is(':checked')) {
                    listPerso += Idcampo + ',';
                } else {
                    listoculto += Idcampo + ',';
                }
            }

            appNewFlash.ovariables.listCamposPerso = listPerso;
            appNewFlash.ovariables.listCamposPersoocult = listoculto;
            appNewFlash.ocultarColumnaRow(listoculto, listPerso)

            $("#modal__personalizarFabric").modal("hide");
            let mensaje = 'se modificó las columnas a mostrar.';
            swal({
                title: 'Message',
                text: mensaje,
                type: 'success'
            })

        }

        function ocultarPantalla() {
            $("#modal__personalizarFabric").modal("hide");
        }

        return {
            load: load,           
            _ini: _ini        
        }
    }
)(document, 'panelPopup_Campo');

(
    function ini() {
        personalizarFabric.load();  
        personalizarFabric._ini();    
    }
)();