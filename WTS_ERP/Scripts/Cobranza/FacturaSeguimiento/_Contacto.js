var Historico = (
    function (d, idpadre) {

        function load() {  
        }  
             
        function _ini() {
            listarContacto();           
        }

        function listarContacto() {
            let cliente = _('valorParamsContacto').value; 
            let aData = cliente.split('|');
            let codCliente = aData[0];            
            let url = 'Cobranza/FacturaSeguimiento/Get_Contacto?par=' + codCliente;
            document.getElementById("titulocontacto").innerHTML = aData[1];

            _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? CSVtoJSON(rpta) : null;                  
                    llenartabla(odata);
                });
        }
      
        function llenartabla(odata, indice) {

            let html = '';
            let tbody = _('tbody_Contacto');

            if (indice == undefined) { indice = 0; }
           
            if (odata !== null && odata != '') {
                
                let fin = odata.length, i = 0, x = odata.length;

                for (let i = 0; i <= fin; i++) {
                    if (i < x) {

                        html += `<tr> 
                                <td align="left">${odata[i].contacto}</td>
                                <td align="left">${odata[i].cargo}</td>
                                <td align="left">${odata[i].telefono}</td>
                                <td align="left">${odata[i].correo}</td></tr>`;
                    }
                }
                tbody.innerHTML = html;            
               
            } else {
                tbody.innerHTML = '';               
            }
        }

        return {
            load: load,           
            _ini: _ini        
        }
    }
)(document, 'panelPopup_Contacto');
(
    function ini() {
        Historico.load();  
        Historico._ini();    
    }
)();