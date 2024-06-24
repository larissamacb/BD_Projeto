const btnenviar = document.querySelector('#enviar')

btnenviar.addEventListener('click', function(e){
    const usuario = document.querySelector('#usuario').value
    const senha = document.querySelector('#senha').value

    if (usuario === "Usuario" && senha === "senha"){
        window.location.href = "/tela-opcoes/opcoes.html"
    } else {
        aviso('erro', 'Usuário ou senha inválidos')
        document.querySelector('#usuario').value = '';
        document.querySelector('#senha').value = '';
    }
    e.preventDefault()
})