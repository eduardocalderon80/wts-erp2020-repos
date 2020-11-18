
/* '[{"mes":"enero","datos":{"dato1":"100.00","dato2":"200.00","dato3":"700.00","dato4":"950.00"}},' +
    '{"mes":"febrero","datos":{"dato1":"200.00","dato2":"300.00","dato3":"600.00","dato4":"850.00"}},' +
    '{"mes":"marzo","datos":{"dato1":"300.00","dato2":"200.00","dato3":"0.00","dato4":"0.00"}}]'*/


function _createGraph(valores) {

    let datosObj = JSON.parse(valores);
    let mes1 = datosObj[0]['mes'];
    let semana1mes1 = datosObj[0]['datos']['dato1'];
    let semana2mes1 = datosObj[0]['datos']['dato2'];
    let semana3mes1 = datosObj[0]['datos']['dato3'];
    let semana4mes1 = datosObj[0]['datos']['dato4'];
    let mes2 = datosObj[1]['mes'];
    let semana1mes2 = datosObj[1]['datos']['dato1'];
    let semana2mes2 = datosObj[1]['datos']['dato2'];
    let semana3mes2 = datosObj[1]['datos']['dato3'];
    let semana4mes2 = datosObj[1]['datos']['dato4'];
    let mes3 = datosObj[2]['mes'];
    let semana1mes3 = datosObj[2]['datos']['dato1'];
    let semana2mes3 = datosObj[2]['datos']['dato2'];
    let semana3mes3 = datosObj[2]['datos']['dato3'];
    let semana4mes3 = datosObj[2]['datos']['dato4'];


    c3.generate({
        bindto: '#lineChart',
        data: {
            columns: [
                [mes1, '0.00', semana1mes1, semana2mes1, semana3mes1, semana4mes1],
                [mes2, '0.00', semana1mes2, semana2mes2, semana3mes2, semana4mes2],
                [mes3, '0.00', semana1mes3, semana2mes3, semana3mes3, semana4mes3]
            ],
            colors: {
                data1: '#1ab394',
                data2: '#BABABA',
                data3: '#BABABA'
            }
        }
    });

}
