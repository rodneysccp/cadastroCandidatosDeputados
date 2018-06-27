var jsObjectEstados;
var jsObject;
var siglaEstados;
var success;


$(document).ready(function(){
  $("#cadastrar").show();
  listarCandidatos();
  $("#listar").hide();
  
  /********DEFININDO DATA MÁXIMA VÁLIDA*******/
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  
  if(dd<10){
    dd='0'+dd
  } 
  
  if(mm<10){
    mm='0'+mm
  } 

  today = yyyy+'-'+mm+'-'+dd;
  $("#dataNascimento").attr("max", today);
  /***************************************/

  /**********CONTROLE MENU****************/
  $("#menucadastrar").click(function(){
    if($('#cadastrar').is(':hidden')){
      $("#cadastrar").show();
      $("#listar").hide();
    } 
  });

  $("#menulistar").click(function(){
    if($('#listar').is(':hidden')){
      $('#listar').empty();
      listarCandidatos();
      $("#listar").show();
      $("#cadastrar").hide();
    }
  });
  /*************************************/

  /*********** VALIDAÇÕES *************/
  $("#verifNome").hide();
  $("#nome").blur(function(){
    if(this.value !== ""){
      $("#verifNomeVazio").hide();
      if(this.value.length > 255){
        $("#verifNome").show();
      } else {
        $("#verifNome").hide();
      }
    } else {
      $("#verifNomeVazio").show();
    }
  });

  $('#cpf').mask('000.000.000-00', {reverse: true});
  $("#cpf").blur(function(){
    if(this.value !== ""){
      $("#verifCpfVazio").hide();
      if(this.value.length !== 14){
        $("#verifCpf").show();
      } else {
        $("#verifCpf").hide();
      }
    } else {
      $("#verifCpfVazio").show();
    }
  });

  $("#estado").blur(function(){
    if(this.selectedIndex !== 0){
      $("#verifEstadoVazio").hide();
    } else {
      $("#verifEstadoVazio").show();
    }
  });

  $("#sexo").blur(function(){
    if(this.selectedIndex !== 0){
      $("#verifSexoVazio").hide();
    } else {
      $("#verifSexoVazio").show();
    }
  });

  $("#cadjus").blur(function(){
    if(this.value !== ""){
      $("#verifCadjusVazio").hide();
      if(this.value > 0 && this.value <= 5000){
        $("#verifCadjus").hide();
      } else {
        $("#verifCadjus").show();
      }
    } else {
      $("#verifCadjusVazio").show();
    }
  });

  $("#dataNascimento").blur(function(){
    maiorDezoito();
    if(success === false){
      $("#verifMaiorIdade").show();
    } else {
      $("#verifMaiorIdade").hide();
    }
  });

  $("#senha").blur(function(){
    if(this.value !== ""){
      $("#verifSenhaVazia").hide();
      if(this.value !== document.getElementById("confirmarSenha").value){
        $("#verifSenha").show();
        $("#verifConfirmarSenha").show();
      } else {
        $("#verifSenha").hide();
        $("#verifConfirmarSenha").hide();
      }
    } else {
      $("#verifSenhaVazia").show();
    }
  });

  $("#confirmarSenha").blur(function(){
    if(this.value !== ""){
      $("#verifConfirmarSenhaVazia").hide();
      if(this.value !== document.getElementById("senha").value){
        $("#verifSenha").show();
        $("#verifConfirmarSenha").show();
      } else {
        $("#verifSenha").hide();
        $("#verifConfirmarSenha").hide();
      } 
    } else {
      $("#verifConfirmarSenha").show();
    }
  });
  /*****************************************/

  /******** CARREGAR SELECT ESTADOS E CIDADES ********/
  loadEstados();
  $("#estado").on('change', function() {
    siglaEstados = $('#estado option:selected').text();
    for (var i = 0; i < jsObjectEstados.estados.length; i++){
      if(siglaEstados === jsObjectEstados.estados[i].sigla){
        var indice = i;
        var nomesCidades = document.getElementById("cidade");
        nomesCidades.options.length = 0;
        for(i = 0; i < jsObjectEstados.estados[indice].cidades.length; i++){
          var option = document.createElement("option");
          option.text = jsObjectEstados.estados[indice].cidades[i];
          nomesCidades.add(option);
        }
      }
    }
  });
  /*********************************************/

  /**************** SUBMIT ****************/
  $("#btnEnviar").click(function(){
    /****** VERIFICAÇÃO CAMPOS VALIDADOS *******/
    if($('#verifNome').is(':hidden')){
      var nome = document.getElementById("nome").value;
    } else {
      alert("não cadastrado!");
      return null;
    }

    if($('#verifSexoVazio').is(':hidden')){
      var sexo = document.getElementById("sexo").value;
    } else {
      alert("não cadastrado!");
      return null;
    }

    if($('#verifMaiorIdade').is(':hidden')){
      var dataNasc = document.getElementById("dataNascimento").value;
    } else {
      alert("não cadastrado!");
      return null;
    }

    var email = document.getElementById("email").value;

    if($('#verifCpf').is(':hidden') || $('#verifCpfVazio').is(':hidden')){
      var cpf = document.getElementById("cpf").value;
    } else {
      alert("não cadastrado!");
      return null;
    }

    if($('#verifCadjus').is(':hidden')){
      var cadjus = document.getElementById("cadjus").value;
      alert(cadjus);
    } else {
      alert("não cadastrado!");
      return null;
    }

    var rua = document.getElementById("rua").value;   
    var numero = document.getElementById("numero").value;

    if($('#verifEstadoVazio').is(':hidden')){
      var estado = document.getElementById("estado").value;
      var cidade = document.getElementById("cidade").value;
    } else {
      alert("não cadastrado!");
      return null;
    }

    if($('#verifSenha').is(':hidden') || $('#verifSenhaVazia').is(':hidden')){
      var senha = document.getElementById("senha").value;
    } else {
      alert("não cadastrado!");
      return null;
    }
    /*******************/

    $.ajax({
      type: "POST",
      url: "http://andrebordignon.esy.es/php/incluicandidato.php",
      data: {
        nome:nome,
        sexo:sexo,
        dataNasc:dataNasc,
        email:email,
        rua:rua,
        numero:numero,
        estado:estado,
        cidade:cidade,
        cpf:cpf,
        cadjus:cadjus,
        senha:senha
      },
      success: function(data) {
        alert("cadastrado com sucesso!");
        location.reload();
      },
    });
  });
  /******************************************/

  /********** LISTANDO CANDIDATOS ***********/
  
});

function listarCandidatos(){
  var xhr = new XMLHttpRequest();
  
  xhr.open("GET", "http://andrebordignon.esy.es/php/consultacandidatos.php", true); 
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      jsObject = JSON.parse(xhr.responseText);
      for (var i = 0; i < jsObject.length; i++){
        var div1 = document.createElement("div");
        div1.setAttribute("class", "col-md-2");
        document.getElementById("listar").appendChild(div1);
        
        var div2 = document.createElement("div");
        div2.setAttribute("class", "body col-md-8 col-sm-12 col-xs-12");
        div2.innerHTML = "<p>ID: " + jsObject[i].idcandidato + 
        "</p><p>Nome: "+ jsObject[i].nome + 
        "</p><p>Sexo: " +jsObject[i].sexo+ 
        "</p><p>Data Nascimento: " +jsObject[i].datanasc+ 
        "</p><p>E-mail: " +jsObject[i].email+  
        "</p><p>CPF: " +jsObject[i].cpf+ 
        "</p><p>Cadjus: " +jsObject[i].cadjus+ 
        "</p><p>Rua: " +jsObject[i].rua+ " - Nº " +jsObject[i].numero+   
        "</p><p>Cidade: " +jsObject[i].cidade+ " - " +jsObject[i].estado+"</p>";

        var excluir = document.createElement("input");

        excluir.setAttribute("type", "button");
        excluir.setAttribute("value", "Excluir");
        excluir.setAttribute("class", "btn btn-danger");
        excluir.setAttribute("style", "margin: 10px;");
        excluir.setAttribute("id", "btnExcluir"+i);
        excluir.onclick = function() { 
          for(var j = 0; j < jsObject.length; j++){
            if(this.id === "btnExcluir"+j){
              alert("Excluir: "+jsObject[j].idcandidato);

              var idcandidato = jsObject[j].idcandidato;
              $.ajax({
                type: 'POST',
                url: 'http://andrebordignon.esy.es/php/deletacandidato.php',
                data:{
                  idcandidato:idcandidato
                },
                success: function(result) {
                  $('#listar').empty();
                  listarCandidatos();
                  alert("deletado com sucesso");
                  console.log(result);
                },
                error: function(request, status, error){
                  alert("Error: Could not delete");
                }
              });
            }
          }
        }

        var editar = document.createElement("input");

        editar.setAttribute("type", "button");
        editar.setAttribute("value", "Editar");
        editar.setAttribute("class", "btn btn-primary");
        editar.setAttribute("id", "btnEditar"+i);
        editar.onclick = function() { 
          for(var j = 0; j < jsObject.length; j++){
            if(this.id === "btnEditar"+j){
              var idcandidato = jsObject[j].idcandidato;
              $.ajax({
                type: 'GET',
                url: 'http://andrebordignon.esy.es/php/atualizacandidato.php',
                data:{
                  idcandidato:idcandidato
                },
                success: function(result) {
                  atualizaCandidato(idcandidato);
                  alert("não está editando");
                  console.log(result);
                },
                error: function(request, status, error){
                  alert("Error: Could not delete");
                }
              });
            }
          }
        }
        
        var divBotoes = document.createElement('div');
        divBotoes.appendChild(editar);
        divBotoes.appendChild(excluir);

        div2.appendChild(divBotoes);

        document.getElementById("listar").appendChild(div2);

        var div3 = document.createElement("div");
        div3.setAttribute("class", "col-md-2");
        document.getElementById("listar").appendChild(div3);
      }
    }
  }
}

function loadEstados() {
  var xhr = new XMLHttpRequest();
  
  xhr.open("GET", "http://andrebordignon.esy.es/data/estados-cidades.json", true); 
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      jsObjectEstados = JSON.parse(this.responseText);
      for (var i = 0; i < jsObjectEstados.estados.length; i++){
        siglaEstados = document.getElementById("estado");
        var option = document.createElement("option");
        option.text = jsObjectEstados.estados[i].sigla;
        siglaEstados.add(option);
      }
    }  
  }
}

function maiorDezoito(){
  success = false;
  var hoje = new Date();
  var dd_hoje = hoje.getDate();
  var mm_hoje = hoje.getMonth()+1;
  var yyyy_hoje = hoje.getFullYear();

  var dataNascimento = document.getElementById("dataNascimento").value;
  var dataNasc = new Date(dataNascimento);
  var dd_dataNasc = dataNasc.getDate()+1;
  var mm_dataNasc = dataNasc.getMonth()+1;
  var yyyy_dataNasc = dataNasc.getFullYear();

  if(yyyy_hoje - 18 === yyyy_dataNasc) {
    if(mm_hoje === mm_dataNasc) {
      if(dd_hoje >= dd_dataNasc){
        success = true;
      } else {
        success = false;
      }
    } else if (mm_hoje > mm_dataNasc) {
      success = true;
    }
  } else if (yyyy_hoje - 18 > yyyy_dataNasc) {
    success = true;
  } else {
    success = false;
  }
  
  return success;
}

function atualizaCandidato(idcandidato){

}