var app_verligamentos = (
    function (d, idpadre) {
        var ovariables = {
            lstobjarrastrar: [],
            bool_ctrl_seleccionado: false,
            contador_seleccionados: 0
        }

        function load() {
            document.addEventListener('keydown', handlerkeydown, false);
            document.addEventListener('keyup', handlerkeyup, false);
        }

        function req_ini() {
            let html = '';
            appAtxView.ovariables.lstligamentos.forEach(x => {
                let urlimg = urlBase() + x.rutaimagen + x.imagenwebnombre;
                html += `
                    <div style='display: inline-block'>
                        <div class ='_cls_elemento img text-center'>
                            <img src='${urlimg}' class ='img-thumbnail cls_ligamentodraggable' data-idelementoestructura='${x.idelementoestructura}' draggable='true'/>
                        </div>
                        <div class ='_cls_nombreelemento text-center'>
                            ${x.nombreelementoestructura}
                        </div>
                    </div>
                `;
            });
            _('div_hijoligamentos').innerHTML = html;
            handlerligamentos();
        }

        function handlerligamentos() {
            let arr = Array.from(_('panelencabezado_verligamentos').getElementsByClassName('cls_ligamentodraggable'));

            arr.forEach(x => {
                x.addEventListener('dragstart', handleDragStart, false);
                x.addEventListener('dragover', handleDragOver, false);
                x.addEventListener('dragenter', handleDragEnter, false);
                x.addEventListener('dragleave', handleDragLeave, false);
                //x.addEventListener('keydown', handlerkeydown, false);
                //x.addEventListener('keyup', handlerkeyup, false);
                x.addEventListener('mousedown', handlermousedown, false);
                x.addEventListener('dblclick', handlerdobleclickimg, false);
            });
        }

        function handlerdobleclickimg(e) {
            let o = e.currentTarget, content_padre = o.parentNode;
            if (ovariables.bool_ctrl_seleccionado === false) {
                let estaseleccionado = content_padre.classList.value.indexOf('seleccionado_ctrl_mousedown');
                if (estaseleccionado !== -1){
                    content_padre.classList.remove('seleccionado_ctrl_mousedown');
                    o.classList.remove('bg-primary');
                    if (ovariables.lstobjarrastrar.length > 0) {
                        let id = o.getAttribute('data-idelementoestructura');
                        let filter = ovariables.lstobjarrastrar.filter(x => x.idelementoestructura === id);
                        if (filter.length > 0){
                            ovariables.lstobjarrastrar = ovariables.lstobjarrastrar.filter(x => x.idelementoestructura !== id);
                        }
                    }
                }
            }
        }

        function handlermousedown(e) {
            let o = e.currentTarget, content_padre = o.parentNode;
            if (e.button === 0 && ovariables.bool_ctrl_seleccionado) {
                content_padre.classList.add("seleccionado_ctrl_mousedown");
                ovariables.contador_seleccionados++;

                //// SE PINTA DE COLOR VERDE PARA INDICAR CUAL ES EL PRIMERO SELECCIONADO
                if (ovariables.contador_seleccionados === 1){
                    o.classList.add('bg-primary');
                }

                let idelementoestructura = o.getAttribute('data-idelementoestructura');
                let obj = { tipo: 'text/html', html: o.outerHTML, idelementoestructura: idelementoestructura }
                ovariables.lstobjarrastrar.push(obj);
            }
        }

        function handlerkeydown(e){
            if (e.keyCode === 17) {
                ovariables.bool_ctrl_seleccionado = true;
            }
        }

        function handlerkeyup(e){
            ovariables.bool_ctrl_seleccionado = false;
        }

        function handleDragStart(e) {
            // Target (this) element is the source node.
            //this.style.opacity = '0.4';

            appAtxView.ovariables.dragSrcEl = this;

            e.dataTransfer.effectAllowed = 'move';
            if (ovariables.lstobjarrastrar.lenth <= 0) {
                e.dataTransfer.setData('text/html', this.outerHTML);
            } 
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault(); // Necessary. Allows us to drop.
            }

            e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

            return false;
        }

        function handleDragEnter(e) {
            // this / e.target is the current hover target.
            this.classList.add('over');
        }

        function handleDragLeave(e) {
            this.classList.remove('over');  // this / e.target is previous target element.
        }

        function handleDrop(e) {
            // this/e.target is current target element.
            
            if (e.stopPropagation) {
                e.stopPropagation(); // Stops some browsers from redirecting.
            }

            // Don't do anything if dropping the same column we're dragging.
            if (appAtxView.ovariables.dragSrcEl != this) {
                // Set the source column's HTML to the HTML of the columnwe dropped on.
                //dragSrcEl.innerHTML = this.innerHTML;  // ESTO NO ES NECESARIO
                this.innerHTML = e.dataTransfer.getData('text/html');
            }

            return false;
        }

        function handleDragEnd(e) {
            // this/e.target is the source node.

            //[].forEach.call(cols, function (col) {
            //    col.classList.remove('over');
            //});

            let arr = Array.from(_('panelencabezado_verligamentos').getElementsByClassName('cls_ligamentodraggable'));
            arr.forEach(x => {
                x.classList.remove('over');
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_atx');

(
    function init() {
        app_verligamentos.load();
        app_verligamentos.req_ini();
    }
)();