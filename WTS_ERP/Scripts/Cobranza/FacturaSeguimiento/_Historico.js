var Historico = (
    function (d, idpadre) {

        function load() {  
        }  
             
        function _ini() {
            listarHistorico();           
        }

        function listarHistorico() {
            let cliente = _('valorParamsHistorico').value; 
            let aData = cliente.split('|');
            let codCliente = aData[0];            
            let url = 'Cobranza/FacturaSeguimiento/Get_Historico?par=' + codCliente;
            document.getElementById("titulohistorio").innerHTML = aData[1];

            _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? CSVtoJSON(rpta) : null;                  
                    llenartabla(odata);
                });
        }
      
        function llenartabla(odata, indice) {

            let html = '';
            let tbody = _('tbody_Historico');

            if (indice == undefined) { indice = 0; }
           
            if (odata !== null && odata != '') {
                
                let fin = odata.length, i = 0, x = odata.length;

                for (let i = 0; i <= fin; i++) {
                    if (i < x) {

                        html += `<tr> 
                                <td align="left">${odata[i].descripcion}</td>
                                <td align="right">${odata[i].monto}</td>
                                <td align="right">${odata[i].ayuda}</td>
                                <td align="right">${odata[i].ayudafactor}</td></tr>`;
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
)(document, 'panelPopup_Historico');
(
    function ini() {
        Historico.load();  
        Historico._ini();    
    }
)();