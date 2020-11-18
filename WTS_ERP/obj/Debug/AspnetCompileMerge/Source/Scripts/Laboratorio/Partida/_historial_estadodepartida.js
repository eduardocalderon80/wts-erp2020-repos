/*
<!-- icono por estado -->
<!-- color por estado -->
<!-- botones por estado "Send" -->

-- finalizado_aprobado (finalizado aprobado)
<i class="fa fa-check-circle-o" aria-hidden="true"></i>
	--color: navy-bg

-- finalizado_rechazado  (finalizado rechazado)
<i class="fa fa-ban" aria-hidden="true"></i>
	--color: red-bg

-- aprobado_comercial
<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
	--color: lazur-bg

-- rechazado_comercial
<i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
	--color: red-bg


-- nueva_partida
<i class="fa fa-file-text"></i>
	--color: blue-bg
	--btn: <a href="#" class="btn btn-sm btn-success"> Download document </a>

-- enviar_partida
<i class="fa fa-envelope-o" aria-hidden="true"></i>
	--color: yellow-bg

-- iniciar_solicitud
<i class="fa fa-play-circle" aria-hidden="true"></i>
	--color: dark-bg



<div class="ibox-content" id="ibox-content">

   <div id="vertical-timeline" class="vertical-container dark-timeline center-orientation">


    estado      =>  [
                finalizado_aprobado
		        finalizado_rechazado
                    aprobado_comercial
                    rechazado_comercial
                    pendiente_comercial
                nueva_partida   : iniciar partida
                enviar_partida  :fabrica envia  correo
                iniciar_solicitud   :iniciar solicitud  "Start"
            ]
    titulo      => [Start, Send, Approved, Rejected, Pending  ]
    partidafabrica  => [batch]
    numerosolicitud => [SP18-0001]
    usuario         => [hsopla]
    rol             => [rol solo para la aprobación comercial]

    descripcion => (es Rechazado? comentarios del xq fue rechazado : 'none' )

    dialiteral  => Thursday 
    mesdia      => "Dec 23"
*/

	

let _ohistoralpartida = (() => {
    const oicon = {
        finalizado_aprobado: {
            icon: 'fa fa-check-circle-o',
            fondoicon: 'vertical-timeline-icon navy-bg',
            btn: ''
        },
        finalizado_rechazado: {
            icon: 'fa fa-ban',
            fondoicon: 'vertical-timeline-icon red-bg',
            btn: ''
        },
        aprobado_comercial: {
            icon: 'fa fa-thumbs-o-up',
            fondoicon: 'vertical-timeline-icon lazur-bg',
            btn: ''
        },
        rechazado_comercial: {
            icon: 'fa fa-thumbs-o-down',
            fondoicon: 'vertical-timeline-icon red-bg',
            btn: ''
        },
        pendiente_comercial: {
            icon: 'fa fa-hand-paper-o',
            fondoicon: 'vertical-timeline-icon red-bg',
            btn: ''
        },
        nueva_partida: {
            icon: 'fa fa-file-text',
            fondoicon: 'blue-bg',
            btn: '<a href="#" class="btn btn-sm btn-success"> Download document </a>'
        },
        enviar_partida: {
            icon: 'fa fa-envelope-o',
            fondoicon: 'vertical-timeline-icon yellow-bg',
            btn: ''
        },
        iniciar_solicitud: {
            icon: 'fa fa-play-circle',
            fondoicon: 'vertical-timeline-icon dark-bg',
            btn: ''
        },
        xdefecto: {
            icon: 'fa fa-tag',
            fondoicon: 'vertical-timeline-icon dark-bg',
            btn: ''
        }
    }

    let timeline_block = (arr) => {
        return (
            arr.map(x => {
                let obj = oicon[x.estado] || oicon.xdefecto;
                return (`<div class="vertical-timeline-block">
                   <div class ="vertical-timeline-icon ${obj.fondoicon}">
                       <i class ="${obj.icon}"></i>
                   </div>
                   <div class="vertical-timeline-content">
                       <h2>${x.titulo_estado}</h2>
                       <p>${x.descripcion}</p>
                       ${obj.btn}
                       <span class="vertical-date">
                           ${x.dialiteral} <br>
                           <small>${x.mesdia}</small>
                       </span>
                   </div>
                </div>`);
            }).join('')
        )
    }

    return {
        timeline_block: timeline_block(arrTimeLine)

    }


})();



function req_ini() {

    //let url = 'Laboratorio/Partida/getHistorialEstadoPartida',
    //    par = { estado: 'pending', esindex: 'si' },
    //    url_par = `${url}?par=${JSON.stringify(par)}`,
    //    _err = function (__error) { console.log("error", __error) };

    //_Get(url_par)
    //.then((vista) => {
        
    //}, (p) => { _err(p) })
    //.then(() => {
        
    //})

}




(function ini() {    
    //req_ini();
})();