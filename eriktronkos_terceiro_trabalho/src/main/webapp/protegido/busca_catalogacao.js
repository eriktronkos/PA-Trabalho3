/*
 Funcoes: 
    Pagina Busca Servidor:          1. BUSCAR+dadosDaBusca,
                                    2. PAGINA_ANTERIOR+nroPagina,
                                    3. PROXIMA_PAGINA+nroPagina,
                                    4. ABRIR_ITEM_OUTRA_ABA+patrimonio,
    Pagina busca local:             5. LIMPAR_BUSCA,
                                    6. MOSTRAR_ITEM_NA_CATALOGACAO+indice,
                                    7. MUDAR_PARA_CATALOGACAO,
    Pagina Catalogacao Servidor:    8. SALVAR_MODIFICACOES+dadosItem,
                                    9. SALVAR_COMO_NOVO+dadosItem,
                                    10. DOWNLOAD_ITEM+patrimonio,
                                    11. EXCLUIR_ITEM+patrimonio,
    Pagina catalogacao local:       12. ITEM_ANTERIOR+indice,
                                    13. PROXIMO_ITEM+patrimonio,
                                    14. EDITAR_ITEM,
                                    15. LIMPAR_CATALOGACAO,
                                    16. MUDAR_PARA_BUSCAS.
 */
//=============== INICIALIZAÇÃO DAS VARIÁVEIS ==================================
window.onload = main;
var TAMANHO_DA_PAGINA_DE_RESULTADOS = 5;
var janelaAtual = 1;
var controleDeChecks;
var controleDoMenu;
var estadoEditando = false;
var itemAtual;
var respJsonAtual;
var paginaAtual = 0;
var dialogoBusca;
var dialogoCatalogacao;

//=============== FUNÇÃO main() ================================================
function main() {
    dialogoBusca = new ObjDialogo('idMsgDialogo2');
    dialogoCatalogacao = new ObjDialogo('idMsgDialogo3');
    controleDoMenu = new ControleDoMenu();
    controleDeChecks = new ControleDeChecks();
    limparPaginaDeBuscas();
    limparPaginaDeCatalogacao();

    document.getElementById('tabelaCatalogacao2').style.display = "none";

    //  1. BUSCAR+dadosDaBusca
    document.getElementById('idBuscar').addEventListener("click",fazerPedidoBusca);
//  2. PAGINA_ANTERIOR+nroPagina
    document.getElementById('idPagAnterior').addEventListener("click",mostrarPaginaAnterior);
//  3. PROXIMA_PAGINA+nroPagina
    document.getElementById('idPagProxima').addEventListener("click",mostrarProximaPagina);
//  5. LIMPAR_BUSCA
    document.getElementById('idLimparBusca').addEventListener("click",limparPaginaDeBuscas);
//  7. MUDAR_PARA_CATALOGACAO
    // VER OBJETO MENU 
//  8. SALVAR_MODIFICACOES+dadosItem
    document.getElementById('idSalvarModif').addEventListener("click",salvarModifsItemAtual);
//  9. SALVAR_COMO_NOVO+dadosItem
    document.getElementById('idSalvarNovo').addEventListener("click",salvarNovoItem);
//  10. DOWNLOAD_ITEM+patrimonio
    document.getElementById('idDownload').addEventListener("click",fazerDownload);
//  11. EXCLUIR_ITEM+patrimonio    
    document.getElementById('idExcluir').addEventListener("click",excluirItemAtual);
//  12. ITEM_ANTERIOR+indice    
    document.getElementById('idItemAnterior').addEventListener("click",mostrarItemAnterior);
//  13. PROXIMO_ITEM+indice
    document.getElementById('idItemProximo').addEventListener("click",mostrarProximoItem);
//  14. EDITAR_ITEM
    document.getElementById('idEditar').addEventListener("click",controleDeEditar);
//  15. LIMPAR_CATALOGACAO
    document.getElementById('idLimparCat').addEventListener("click", limparPaginaDeCatalogacao);
//  16. MUDAR_PARA_BUSCAS    
    // VER OBJETO MENU
    //UPLOAD
    document.getElementById("idSubirArquivo").addEventListener("click",fazerUpload);
    //DOWNLOAD
    document.getElementById("idDownload").addEventListener("click",fazerDownload);
    document.getElementById("idDownloadView").addEventListener("click",fazerDownloadView);
}

//=============== FUNÇÕES ======================================================
function mudarCorItemMenu(idMenu, bg, col) {
    if(bg==='none'){
        document.getElementById(idMenu).style.setProperty('background', 'rgba(100, 100, 100, 0.0)');
    }else{
        document.getElementById(idMenu).style.setProperty('background-color', bg);
    }
    document.getElementById(idMenu).style.setProperty('color', col);
}
//------------------------------------------------------------------------------
function pegarMetadadosCatalogacao() {
    var resposta = {};
    resposta.patrimonio = {};
    resposta.patrimonio = document.getElementById('idpatrimonio3').value;
    resposta.titulo = {};
    resposta.titulo = document.getElementById('idtitulo3').value;
    resposta.autoria = {};
    resposta.autoria = document.getElementById('idautoria3').value;
    resposta.veiculo = {};
    resposta.veiculo = document.getElementById('idveiculo3').value;
    resposta.data_publicacao = {};
    resposta.data_publicacao = parseDate('iddata_publicacao3');
    resposta.palchave = {};
    resposta.palchave = document.getElementById('idpalchave3').value;
    resposta.tipoBusca = 'null';
//alert(JSON.stringify(resposta));    
    return resposta;
}
//------------------------------------------------------------------------------
function limparPaginaDeCatalogacao() {
    document.getElementById('idpatrimonio3').value = "";
    document.getElementById('idtitulo3').value = "";
    document.getElementById('idautoria3').value = "";
    document.getElementById('idveiculo3').value = "";
    document.getElementById('iddata_publicacao3').value = "";
    document.getElementById('idpalchave3').value = "";
    document.getElementById('idNomeArqUpload').value = "";
    document.getElementById('idMsgDialogo3').innerHTML = "";
    document.getElementById('idMsgDialogo3').removeAttribute('class');
}
//------------------------------------------------------------------------------
function limparPaginaDeBuscas() {
    controleDeChecks.limparTodos();
    document.getElementById('tabelaBusca2').style.display = 'none';
    document.getElementById('idpatrimonio2').value = "";
    document.getElementById('idtitulo2').value = "";
    document.getElementById('idautoria2').value = "";
    document.getElementById('idveiculo2').value = "";
    document.getElementById('iddata_publicacao21').value = "";
    document.getElementById('iddata_publicacao22').value = "";
    document.getElementById('idpalchave2').value = "";
    document.getElementById('idMsgDialogo2').innerHTML = "";
    document.getElementById('idTabelaResultados').innerHTML = "";
    document.getElementById('idNroRows').innerHTML = "0";
    document.getElementById('idPaginaDestino').value = "0";
    document.getElementById('idMsgDialogo2').innerHTML = "";
    document.getElementById('idMsgDialogo2').removeAttribute('class');
    itemAtual = null;
    respJsonAtual = null;
}
//------------------------------------------------------------------------------
function getCurrentDateTimeISO8601() {
    var currentdate = new Date();
    var datetime =
        currentdate.getFullYear() + "-" +
        leftZeroPadded2digits((currentdate.getMonth() + 1).toString()) + "-" +
        leftZeroPadded2digits(currentdate.getDate().toString()) + "T" +
        leftZeroPadded2digits(currentdate.getHours().toString()) + ":" +
        leftZeroPadded2digits(currentdate.getMinutes().toString()) + ":" +
        leftZeroPadded2digits(currentdate.getSeconds().toString());
    return datetime;
}
//------------------------------------------------------------------------------
function leftZeroPadded2digits(s) {
    if (s.length < 2)
        s = "0" + s;
    return s;
}
//------------------------------------------------------------------------------
function mudarAtributosEditando(estado) {
    var botao = document.getElementById('idEditar');
    if (estado) {
        botao.style = "background-color:red;font-weight:bold;color:white;";
        botao.value = "EDITANDO";

        document.getElementById('tabelaCatalogacao2').style.display = "inline";
        document.getElementById('idtitulo3').removeAttribute("readonly");
        document.getElementById('idautoria3').removeAttribute("readonly");
        document.getElementById('idveiculo3').removeAttribute("readonly");
        document.getElementById('iddata_publicacao3').removeAttribute("readonly");
        document.getElementById('idpalchave3').removeAttribute("readonly");
    } else {
        botao.style = "background-color:none;font-weight:normal;color:black;";
        botao.value = "EDITAR";

        document.getElementById('tabelaCatalogacao2').style.display = "none";
        document.getElementById('idtitulo3').setAttribute("readonly", true);
        document.getElementById('idautoria3').setAttribute("readonly", true);
        document.getElementById('idveiculo3').setAttribute("readonly", true);
        document.getElementById('iddata_publicacao3').setAttribute("readonly", true);
        document.getElementById('idpalchave3').setAttribute("readonly", true);
    }
}
//------------------------------------------------------------------------------
function parseDate(id){
    var strData = document.getElementById(id).value;
    if(strData!==undefined && strData!==null && strData!==""){
        var date = new Date(strData);
        return date.toISOString();
    }else{
        var date = '1970-01-01';
        return date.toISOString();
    }
}
//------------------------------------------------------------------------------
function camposEscolhidosDaBusca() {
    var campos = {};

    paginaAtual = document.getElementById("idPaginaDestino").value;
    var offset = paginaAtual;
    campos.offset = offset.toString();

    campos.resultadoOK = false;
    if (controleDeChecks.patrimonio.checked) {
        var valor = document.getElementById("idpatrimonio2").value;
        if (valor === "") {
        // Patrimônio em branco
            campos.tipoBusca = "all";
            campos.msg = "Busca por todos os registros";
            campos.cor = "mensagemDialogoVerde";
            campos.resultadoOK = true;
        } else if (!isNaN(valor)) {
            // É um número
            campos.tipoBusca = "patrimonio";
            campos.msg = "Busca por patrimonio";
            campos.cor = "mensagemDialogoVerde";
            campos.resultadoOK = true;
        } else {
            // Não é um número
            campos.tipoBusca = "NaN";
            campos.msg = "Campo patrimônio não é um número!";
            campos.cor = "mensagemDialogoAmarelo";
            campos.resultadoOK = false;
        }
        campos.patrimonio = valor;
        return campos;
    } else {
        if (controleDeChecks.titulo.checked) {
            var tit = document.getElementById('idtitulo2').value.trim();
            if(tit!==null && tit!==""){
                campos.titulo = {};
                campos.titulo = tit;
            }
        }
        if (controleDeChecks.autoria.checked) {
            var aut = document.getElementById('idautoria2').value.trim();
            if(aut!==null && aut!==""){
                campos.autoria = {};
                campos.autoria = aut;
            }
        }
        if (controleDeChecks.veiculo.checked) {
            var vei = document.getElementById('idveiculo2').value.trim();
            if(vei!==null && vei!==""){
                campos.veiculo = {};
                campos.veiculo = vei;
            }
        }
        if (controleDeChecks.data_publicacao.checked) {
            var dat1 = document.getElementById('iddata_publicacao21').value.trim();
            var dat2 = document.getElementById('iddata_publicacao22').value.trim();
            if(dat1!==null && dat1!=="" && dat2!==null && dat2!==""){
                campos.data_publicacao1 = {};
                campos.data_publicacao2 = {};
                campos.data_publicacao1 = parseDate('iddata_publicacao21');
                campos.data_publicacao2 = parseDate('iddata_publicacao22');
            }
        }
        if (controleDeChecks.palchave.checked) {
            var pal = document.getElementById('idpalchave2').value.trim();
            if(pal!==null && pal!==""){
                campos.palchave = {};
                campos.palchave = pal;
            }
        }
        
        if (Object.keys(campos).length === 2) {
            campos.tipoBusca = "";
            campos.msg = "Marque alguma opção de busca e preencha o campo!";
            campos.cor = "mensagemDialogoAmarelo";
            campos.resultadoOK = false;
        }else{
            campos.tipoBusca = "composta";
            campos.msg = "Realizou busca composta...";
            campos.cor = "mensagemDialogoVerde";
            campos.resultadoOK = true;
        }
    }
//alert(JSON.stringify(campos));
    return campos;
}
//------------------------------------------------------------------------------
function mostrarDiv(i) {
    if (i === 2) {
        janelaAtual = 2;
        document.getElementById('idDivBusca').style.display = "inline";
        document.getElementById('idDivCatalogacao').style.display = "none";
        document.getElementById('idMsgDialogo2').innerHTML = "";
        
        document.getElementById('menuSair').style.display = "inline";
        document.getElementById('menuBusca').style.display = "none";
        document.getElementById('menuCatalogacao').style.display = "inline";
        document.getElementById('idMsgDialogo2').removeAttribute('class');
    } else if (i === 3) {
        janelaAtual = 3;
        document.getElementById('idDivCatalogacao').style.display = "inline";
        document.getElementById('idDivBusca').style.display = "none";
        document.getElementById('idMsgDialogo3').innerHTML = "";
        
        document.getElementById('menuSair').style.display = "inline";
        document.getElementById('menuBusca').style.display = "inline";
        document.getElementById('menuCatalogacao').style.display = "none";
        document.getElementById('idMsgDialogo3').removeAttribute('class');
    }
}
//------------------------------------------------------------------------------
function toFloat(value, decimalPlaces) {
    value = window.parseFloat(value).toFixed(decimalPlaces) + '';

    var x = value.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? ',' + x[1] : '';

    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}
//------------------------------------------------------------------------------
function fazerDownload(){
    var patrimonio = document.getElementById('idpatrimonio3').value;
    window.open(
        '../arquivos/146.pdf',
        'Download'
    );
}
//------------------------------------------------------------------------------
function viewFile(patrimonio){
    // read patrimonio -> write to original name (temp folder)
    window.open(
        "../arquivos/"+patrimonio+".pdf",
        '_blank'
    );
}
//------------------------------------------------------------------------------
function popularTabelaDeResultados() {
    if (respJsonAtual.sucesso) {
        document.getElementById('tabelaBusca2').style.display = 'inline';
        if (respJsonAtual.arrayDeRespostas.length > 0) {
            document.getElementById('idTabelaResultados').innerHTML = "";
            document.getElementById("idNroRows").innerHTML = respJsonAtual.nroRows;
            document.getElementById("idPaginaDestino").value = paginaAtual;
            for (i = 0; i < respJsonAtual.arrayDeRespostas.length; i++) {
                var elementoAimagem = document.createElement('a');
                var elementoAtexto = document.createElement('a');
                elementoAimagem.setAttribute('href', '#');
                elementoAtexto.setAttribute('href', '#');
                elementoAimagem.setAttribute('onclick', 'mostrarItem(' + i + ');');
//                elementoAtexto.setAttribute('onclick', 'alert("DOWNLOAD");');
                var patrimonio = respJsonAtual.arrayDeRespostas[i].patrimonio;
                elementoAtexto.setAttribute('onclick', 'viewFile('+patrimonio+');');
                var texto =
                        respJsonAtual.arrayDeRespostas[i].patrimonio + '. ' +
                        respJsonAtual.arrayDeRespostas[i].titulo + ' - ' +
                        respJsonAtual.arrayDeRespostas[i].autoria + ' (' +
                        respJsonAtual.arrayDeRespostas[i].nrohits + ')';
//                        respJsonAtual.arrayDeRespostas[i].data_publicacao + ' ';
                var elementoTexto = document.createTextNode(texto);
                elementoAtexto.appendChild(elementoTexto);

                var imagem = document.createElement("img");
//                imagem.setAttribute("src", "./images/Pencil_striped_symbol_for_interface_edit_buttons_24.png");
                imagem.setAttribute("src", "./Pencil_striped_symbol_for_interface_edit_buttons_24.png");
                imagem.setAttribute("width", "20");
                elementoAimagem.appendChild(imagem);

                document.getElementById('idTabelaResultados').appendChild(elementoAtexto);
                document.getElementById('idTabelaResultados').appendChild(elementoAimagem);
                var elementoBR1 = document.createElement('br');
                document.getElementById('idTabelaResultados').appendChild(elementoBR1);
            }

        } else {
            paginaAtual--;
            document.getElementById("idPaginaDestino").value = paginaAtual;
            document.getElementById('idMsgDialogo2').innerHTML = "Não há próxima página";
            document.getElementById('idMsgDialogo2').setAttribute('class', 'mensagemDialogoAmarelo');
        }

    } else {
        document.getElementById('tabelaBusca2').style.display = 'none';
        document.getElementById('idMsgDialogo2').innerHTML = "Falhou na busca";
        document.getElementById('idMsgDialogo2').setAttribute('class', 'mensagemDialogoVermelho');
    }
}
//------------------------------------------------------------------------------
function tirarPrimeiraEUltimasAspas(texto){
    return texto.replace(/^"(.+(?="$))"$/, '$1');
}
//------------------------------------------------------------------------------
function mostrarItem(i) {
    estadoEditando = false;
    mudarAtributosEditando(estadoEditando);
    mostrarDiv(3);
    itemAtual = i;
    document.getElementById('idpatrimonio3').value = respJsonAtual.arrayDeRespostas[i].patrimonio;
    document.getElementById('idtitulo3').value = tirarPrimeiraEUltimasAspas(respJsonAtual.arrayDeRespostas[i].titulo);
    document.getElementById('idautoria3').value = tirarPrimeiraEUltimasAspas(respJsonAtual.arrayDeRespostas[i].autoria);
    document.getElementById('idveiculo3').value = tirarPrimeiraEUltimasAspas(respJsonAtual.arrayDeRespostas[i].veiculo);
    document.getElementById('iddata_publicacao3').value = tirarPrimeiraEUltimasAspas(respJsonAtual.arrayDeRespostas[i].data_publicacao);
    //document.getElementById('idpalchave3').value = tirarPrimeiraEUltimasAspas(respJsonAtual.arrayDeRespostas[i].palchave);
}
//------------------------------------------------------------------------------

//=============== FUNÇÕES DE PEDIDO E CALLBACK DE AJAX =========================
function fazerPedidoGetAJAX(sendData,destino,callBack) {
    
    dialogoCatalogacao.escreverMensagem(null,'');
    dialogoBusca.escreverMensagem(null,'');
    
    document.getElementById("idLoading1").setAttribute("class", "loading");
    document.getElementById("idLoading2").setAttribute("class", "loading");
    
    //alert(JSON.stringify(sendData));        
    var data = formatParams(sendData);
    var objPedidoAJAX = new XMLHttpRequest();
    objPedidoAJAX.open('GET', destino+data);
    console.log(destino+data);
    objPedidoAJAX.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//    objPedidoAJAX.timeout = 10000;
    objPedidoAJAX.responseType = 'json';
    objPedidoAJAX.onreadystatechange = function(){callBack(objPedidoAJAX);};
    objPedidoAJAX.send();
}

function formatParams( params ){
  return "?" + Object
        .keys(params)
        .map(function(key){
          return key+"="+params[key]
        })
        .join("&")
}
function fazerPedidoPostAJAX(sendData,destino,callBack) {
    
    dialogoCatalogacao.escreverMensagem(null,'');
    dialogoBusca.escreverMensagem(null,'');
    
    document.getElementById("idLoading1").setAttribute("class", "loading");
    document.getElementById("idLoading2").setAttribute("class", "loading");
    
//alert(JSON.stringify(sendData));        
    var data = JSON.stringify(sendData);
    var objPedidoAJAX = new XMLHttpRequest();
    objPedidoAJAX.open('POST', destino);
    objPedidoAJAX.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//    objPedidoAJAX.timeout = 10000;
    objPedidoAJAX.responseType = 'json';
    objPedidoAJAX.onreadystatechange = function(){callBack(objPedidoAJAX);};
    objPedidoAJAX.send(data);
}

function fazerPedidoPutAJAX(sendData,destino,callBack) {
    
    dialogoCatalogacao.escreverMensagem(null,'');
    dialogoBusca.escreverMensagem(null,'');
    
    document.getElementById("idLoading1").setAttribute("class", "loading");
    document.getElementById("idLoading2").setAttribute("class", "loading");
    
//alert(JSON.stringify(sendData));        
    var data = JSON.stringify(sendData);
    var objPedidoAJAX = new XMLHttpRequest();
    objPedidoAJAX.open('PUT', destino);
    objPedidoAJAX.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//    objPedidoAJAX.timeout = 10000;
    objPedidoAJAX.responseType = 'json';
    objPedidoAJAX.onreadystatechange = function(){callBack(objPedidoAJAX);};
    objPedidoAJAX.send(data);
}
//------------------------------------------------------------------------------
function callBack(objPedidoAJAX) { //--- MODELO DE CALLBACK
    var erro;
    if (objPedidoAJAX.readyState === 4 && objPedidoAJAX.status === 200) {
        document.getElementById("idLoading1").removeAttribute("class");
        document.getElementById("idLoading2").removeAttribute("class");
        try {
            popularTabelaDeResultados(objPedidoAJAX.response);
        } catch (erro) {
            //...        
        }
    }
}
//------------------------------------------------------------------------------
function fazerPedidoBusca(pagina) {
    var dados = camposEscolhidosDaBusca();
    if(dados.resultadoOK===false){
        dialogoBusca.escreverMensagem(dados.cor,dados.msg);
        return;
    }else{
        dados.operacao = 'buscar';
        dados.pagina = pagina;
        fazerPedidoGetAJAX(dados,'../rest/catalogo/busca',respostaDaBusca);
    }
}
//------------------------------------------------------------------------------
function enviarMetadados(metadados) {
    document.getElementById("idLoading1").setAttribute("class", "loading");
    document.getElementById("idLoading2").setAttribute("class", "loading");
    var data = JSON.stringify(metadados);
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("POST", "../catalogo");   
    ajaxRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //ajaxRequest.timeout = 1000;
    ajaxRequest.responseType = 'json';
    ajaxRequest.onreadystatechange =
            function () {
                var erro;
                if (ajaxRequest.readyState === 4 && ajaxRequest.status === 200) {
                    document.getElementById("idLoading1").removeAttribute("class");
                    document.getElementById("idLoading2").removeAttribute("class");
                    try {
                        var respJSON = ajaxRequest.response;
                        if (respJSON.sucesso === "true") {
                            dialogoCatalogacao.escreverMensagem(
                                    'mensagemDialogoVerde',
                                    'Salvou metadados!');
                            document.getElementById('idpatrimonio3').value = respJSON.patrimonio;
                        } else {
                            dialogoCatalogacao.escreverMensagem(
                                    'mensagemDialogoVermelho',
                                    'Não salvou metadados...');
                        }
                    } catch (erro) {
                        dialogoCatalogacao.escreverMensagem(
                                    'mensagemDialogoVermelho',
                                    "Erro no JSON: " + erro.message);
                    }
                }
            };
    ajaxRequest.send(data);
}
//------------------------------------------------------------------------------
function respostaDaBusca(ajaxRequest) {
    var erro;
    document.getElementById("idLoading1").removeAttribute("class");
    document.getElementById("idLoading2").removeAttribute("class");
    if (ajaxRequest.readyState === 4 && ajaxRequest.status === 200) {
        try {
            var respJSON = ajaxRequest.response;
//alert(JSON.stringify(respJSON));                                    
            //===========
            respJsonAtual = respJSON;
            //===========
            if (respJSON.sucesso) {
                dialogoBusca.escreverMensagem(
                                    'mensagemDialogoVerde',
                                    'Recebeu resposta...');
                popularTabelaDeResultados();
            } else {
                dialogoBusca.escreverMensagem(
                                    'mensagemDialogoVermelho',
                                    'Busca N.O.K. ...');
                document.getElementById('tabelaBusca2').style.display = 'none';
            }
        } catch (erro) {
            dialogoBusca.escreverMensagem(
                                    'mensagemDialogoVermelho',
                                    'Erro no JSON: ' + erro.message);
        }
    }
/*    
    else{
        dialogoBusca.escreverMensagem(
                    'mensagemDialogoVermelho',
                    "Time-out do AJAX ou ???");
    }
*/    
}
//------------------------------------------------------------------------------
function mostrarMsgConfirmacaoSalvar(objPedidoAJAX){
    var erro;
    if (objPedidoAJAX.readyState === 4 && objPedidoAJAX.status === 200) {
        document.getElementById("idLoading1").removeAttribute("class");
        document.getElementById("idLoading2").removeAttribute("class");
        try {
            var resposta = objPedidoAJAX.response;
//alert('Confirmação salvar: '+JSON.stringify(resposta));            
            dialogoCatalogacao.escreverMensagem(
                'mensagemDialogoVerde','Salvou o novo item.');
            document.getElementById('idpatrimonio3').value = resposta.arrayDeRespostas[0].patrimonio;
            document.getElementById('idtitulo3').value = resposta.arrayDeRespostas[0].titulo;
            document.getElementById('idautoria3').value = resposta.arrayDeRespostas[0].autoria;
            document.getElementById('idveiculo3').value = resposta.arrayDeRespostas[0].veiculo;
            document.getElementById('iddata_publicacao3').value = resposta.arrayDeRespostas[0].data_publicacao;
        } catch (erro) {
            dialogoCatalogacao.escreverMensagem(
                'mensagemDialogoVermelho','Não salvou o novo item.');
        }
    }
}
//------------------------------------------------------------------------------
function mostrarMsgConfirmacaoSalvarModif(objPedidoAJAX){
    var erro;
    if (objPedidoAJAX.readyState === 4 && objPedidoAJAX.status === 200) {
        document.getElementById("idLoading1").removeAttribute("class");
        document.getElementById("idLoading2").removeAttribute("class");
//alert(JSON.stringify(objPedidoAJAX.response));  
        var resposta = objPedidoAJAX.response;
//alert(resposta.arrayDeRespostas[0].patrimonio);        
        try {
            dialogoCatalogacao.escreverMensagem(
                'mensagemDialogoVerde','Salvou as modificações.');
            document.getElementById('idpatrimonio3').value = resposta.arrayDeRespostas[0].patrimonio;
            document.getElementById('idtitulo3').value = resposta.arrayDeRespostas[0].titulo;
            document.getElementById('idautoria3').value = resposta.arrayDeRespostas[0].autoria;
            document.getElementById('idveiculo3').value = resposta.arrayDeRespostas[0].veiculo;
            document.getElementById('iddata_publicacao3').value = resposta.arrayDeRespostas[0].data_publicacao;
        } catch (erro) {
            dialogoCatalogacao.escreverMensagem(
                'mensagemDialogoVermelho','Não salvou as modificações.');
        }
    }
}
//------------------------------------------------------------------------------
function mostrarMsgConfirmacaoExcluir(objPedidoAJAX){
    var erro;
    if (objPedidoAJAX.readyState === 4 && objPedidoAJAX.status === 200) {
        document.getElementById("idLoading1").removeAttribute("class");
        document.getElementById("idLoading2").removeAttribute("class");
        try {
//alert(JSON.stringify(objPedidoAJAX.response));            
            if(objPedidoAJAX.response.sucesso){
                dialogoCatalogacao.escreverMensagem(
                    'mensagemDialogoVerde','Excluiu o item.');
            }else{
                dialogoCatalogacao.escreverMensagem(
                    'mensagemDialogoVermelho','Não excluiu o item.');
            }    
        } catch (erro) {
            dialogoCatalogacao.escreverMensagem(
                'mensagemDialogoVermelho','Não excluiu o item.');
        }
    }
}
//------------------------------------------------------------------------------
function mostrarMsgConfirmacaoBuscar(objPedidoAJAX){
    var erro;
    if (objPedidoAJAX.readyState === 4 && objPedidoAJAX.status === 200) {
        document.getElementById("idLoading1").removeAttribute("class");
        document.getElementById("idLoading2").removeAttribute("class");
        var resposta = objPedidoAJAX.response;
        try {
            dialogoCatalogacao.escreverMensagem(
                'mensagemDialogoVerde','Recebeu a resposta: '+resposta.operacao);
            document.getElementById('idpatrimonio3').value = resposta.arrayDeRespostas[0].patrimonio;
        } catch (erro) {
            dialogoCatalogacao.escreverMensagem(
                'mensagemDialogoVermelho','Não recebeu a resposta: '+erro);
        }
    }
}
//------------------------------------------------------------------------------

//=============== FUNÇÕES DE TRATADORES DE EVENTOS (EVENT LISTENERS) ===========
//------------------------------------------------------------------------------
function salvarNovoItem() {
    var metadados = pegarMetadadosCatalogacao();
    metadados.operacao = "salvar_novo";
    metadados.tipoBusca = "null";
    fazerPedidoPostAJAX(metadados,'../rest/catalogo',mostrarMsgConfirmacaoSalvar);
}
//------------------------------------------------------------------------------
function salvarModifsItemAtual() {
    var metadados = pegarMetadadosCatalogacao();
    metadados.operacao = "salvar_modif";
    metadados.tipoBusca = "null";
    fazerPedidoPutAJAX(metadados,'../rest/catalogo',mostrarMsgConfirmacaoSalvarModif);
}
//------------------------------------------------------------------------------
function mostrarItemAnterior() {
    if (respJsonAtual !== undefined &&
        respJsonAtual !== null &&
        respJsonAtual.arrayDeRespostas !== null &&
        respJsonAtual.arrayDeRespostas.length > 0 &&
        itemAtual !== undefined &&
        itemAtual !== null &&
        itemAtual > 0 ) {
        itemAtual--;
        mostrarItem(itemAtual);
    } else {
        dialogoCatalogacao.escreverMensagem(
                'mensagemDialogoVermelho','Não pode mostrar o anterior...');
    }
}
//------------------------------------------------------------------------------
function mostrarProximoItem() {
    if (respJsonAtual !== undefined &&
        respJsonAtual !== null &&
        respJsonAtual.arrayDeRespostas !== null &&
        respJsonAtual.arrayDeRespostas.length > 0 &&
        itemAtual !== undefined &&
        itemAtual !== null &&
        itemAtual < (respJsonAtual.arrayDeRespostas.length - 1)) {
        itemAtual++;
        mostrarItem(itemAtual);
    } else {
        dialogoCatalogacao.escreverMensagem(
                'mensagemDialogoVermelho','Não pode mostrar o próximo...');
    }
}
//------------------------------------------------------------------------------
function controleDeEditar() {
    // TESTAR SE EXISTE UM PATRIMONIO ATUAL
    
    if (estadoEditando) {
        estadoEditando = false;
    } else {
        estadoEditando = true;
    }
    mudarAtributosEditando(estadoEditando);
}
//------------------------------------------------------------------------------
function mostrarPaginaAnterior() {
    if (respJsonAtual !== null &&
        paginaAtual !== null &&
        paginaAtual > 0) {
    
        paginaAtual--;
        document.getElementById("idPaginaDestino").value = paginaAtual;
        fazerPedidoBusca(paginaAtual);
        dialogoBusca.escreverMensagem(
                'mensagemDialogoVerde','Mostrando página anterior...');
    } else {
        dialogoBusca.escreverMensagem(
                'mensagemDialogoVermelho','Não há pagina anterior.');
    }
}
//------------------------------------------------------------------------------
function mostrarProximaPagina() {
    if (respJsonAtual !== null &&
        paginaAtual !== null) {
    
        paginaAtual++;
        document.getElementById("idPaginaDestino").value = paginaAtual;
        fazerPedidoBusca(paginaAtual);
        dialogoBusca.escreverMensagem(
                'mensagemDialogoVerde','Mostrando próxima página...');
    } else {
        dialogoBusca.escreverMensagem(
                'mensagemDialogoVermelho','Não há próxima pagina.');
    }
}
//------------------------------------------------------------------------------
function excluirItemAtual(){
    var dadoPedido = {};
    dadoPedido.patrimonio = document.getElementById('idpatrimonio3').value;
    dadoPedido.operacao = "excluir";
    dadoPedido.tipoBusca = "null";
    fazerPedidoPostAJAX(dadoPedido,'../rest/catalogo',mostrarMsgConfirmacaoExcluir);
}
//------------------------------------------------------------------------------

//=============== OBJETOS ======================================================
function ControleDoMenu() {
    this.estado = 'busca'; // busca,catalogacao
    document.getElementById('menuSair').style.display = "inline";
    document.getElementById('menuBusca').style.display = "none";
    document.getElementById('menuCatalogacao').style.display = "inline";
/*
    this.menuSair = document.getElementById('menuSair');
    this.menuBusca = document.getElementById('menuBusca');
    this.menuCatalogacao = document.getElementById('menuCatalogacao');
*/
    var clicouItemMenu = function (idMenu) {
        if (idMenu === 'menuBusca') {
            this.estado = 'busca';
            document.getElementById('menuSair').style.display = "inline";
            document.getElementById('menuBusca').style.display = "none";
            document.getElementById('menuCatalogacao').style.display = "inline";
            document.getElementById('idMsgDialogo2').removeAttribute('class');
            mostrarDiv(2);
//            alert('busca: '+document.getElementById('menuBusca').style.display);
        } else if (idMenu === 'menuCatalogacao') {
            this.estado = 'catalogacao';
            document.getElementById('menuSair').style.display = "inline";
            document.getElementById('menuBusca').style.display = "inline";
            document.getElementById('menuCatalogacao').style.display = "none";
            document.getElementById('idMsgDialogo3').removeAttribute('class');
            mostrarDiv(3);
//            alert('catalogacao: '+document.getElementById('menuCatalogacao').style.display);
        }
    };

    document.getElementById('menuSair').addEventListener(
            'mouseover', function () {
                mudarCorItemMenu('menuSair', 'red', 'white');
            });
    document.getElementById('menuSair').addEventListener(
            'mouseout', function () {
                mudarCorItemMenu('menuSair', 'none', 'white');
            });
/*    document.getElementById('menuSair').addEventListener(
            'click', function () {
                document.getElementById('idForm').submit();
            }); */
    document.getElementById('menuBusca').addEventListener(
            'mouseover', function () {
                mudarCorItemMenu('menuBusca', 'green', 'white');
            });
    document.getElementById('menuBusca').addEventListener(
            'mouseout', function () {
                mudarCorItemMenu('menuBusca', 'none', 'white');
            });
    document.getElementById('menuBusca').addEventListener(
            'click', function () {
                clicouItemMenu('menuBusca');
            });
    document.getElementById('menuCatalogacao').addEventListener(
            'mouseover', function () {
                mudarCorItemMenu('menuCatalogacao', 'green', 'white');
            });
    document.getElementById('menuCatalogacao').addEventListener(
            'mouseout', function () {
                mudarCorItemMenu('menuCatalogacao', 'none', 'white');
            });
    document.getElementById('menuCatalogacao').addEventListener(
            'click', function () {
                clicouItemMenu('menuCatalogacao');
            });

    document.getElementById('idDivBusca').style.display = "inline";
    document.getElementById('idDivCatalogacao').style.display = "none";
}

var ControleDeChecks = function () {
    var ptrEste = this;

    this.patrimonio = document.getElementById('idcheckpatrimonio');
    this.titulo = document.getElementById('idchecktitulo');
    this.autoria = document.getElementById('idcheckautoria');
    this.veiculo = document.getElementById('idcheckveiculo');
    this.data_publicacao = document.getElementById('idcheckdata_publicacao');
    this.palchave = document.getElementById('idcheckpalchave');

    this.limparTodos = function () {
        this.patrimonio.checked = false;
        this.titulo.checked = false;
        this.autoria.checked = false;
        this.veiculo.checked = false;
        this.data_publicacao.checked = false;
        this.palchave.checked = false;
    };
    this.patrimonio.addEventListener("click",
            function () {
                ptrEste.patrimonio.checked = true;
                ptrEste.titulo.checked = false;
                ptrEste.autoria.checked = false;
                ptrEste.veiculo.checked = false;
                ptrEste.data_publicacao.checked = false;
                ptrEste.palchave.checked = false;
            });

    this.limparTodos();

    this.titulo.addEventListener("click",
            function () {
                ptrEste.patrimonio.checked = false;
            });

    this.autoria.addEventListener("click",
            function () {
                ptrEste.patrimonio.checked = false;
            });

    this.veiculo.addEventListener("click",
            function () {
                ptrEste.patrimonio.checked = false;
            });

    this.data_publicacao.addEventListener("click",
            function () {
                ptrEste.patrimonio.checked = false;
            });

    this.palchave.addEventListener("click",
            function () {
                ptrEste.patrimonio.checked = false;
            });

};

var ObjDialogo = function (id) {
    this.elementoDialogo = document.getElementById(id);
    this.escreverMensagem = function (classeDaCor, texto) {
        this.elementoDialogo.innerHTML = texto;
        if(classeDaCor===null){
            this.elementoDialogo.removeAttribute('class');
        }else{
            this.elementoDialogo.setAttribute('class', classeDaCor);
        }
    };
};
//UPLOAD E DOWNLOAD
//==============================================================================
function fazerUpload(){
    var formData = new FormData(document.getElementById("idFormUpload"));
    formData.append('patrimonio',document.getElementById('idpatrimonio3').value);
    var objPedidoAJAX = new XMLHttpRequest();
    objPedidoAJAX.open('POST','../rest/catalogo/pdf',true);
    // O próprio Browser deve preencher o cabeçalho!!!
    // objPedidoAJAX.setRequestHeader("Content-Type", "multipart/form-data");
    objPedidoAJAX.onreadystatechange = function(){
        if (objPedidoAJAX.readyState === 4 && objPedidoAJAX.status === 200) {
            alert('Enviou o arquivo.');
        }
    };
    objPedidoAJAX.send(formData);
}

function fazerDownload(){
    var patrimonio = document.getElementById('idpatrimonio3').value;
    window.open("https://"+window.location.hostname+":8443/bibliopdf/rest/catalogo/pdf/"+patrimonio, 'pdf');
    
}

function fazerDownloadView(){
    var patrimonio = document.getElementById('idpatrimonio3').value;
    window.open("https://"+window.location.hostname+":8443/bibliopdf/rest/catalogo/pdfread/"+patrimonio, 'pdf');
    
}
