const btnenviar = document.querySelector('#enviar')

btnenviar.addEventListener('click', function(e){
    const usuario = document.querySelector('#usuario').value
    const senha = document.querySelector('#senha').value

    if (usuario === "seuUsuario" && senha === "suaSenha"){
        window.location.href = "/tela-opcoes/opcoes.html"
        console.log("f")
    } else {
        alert("Credenciais inválidas. Tente novamente.")
        console.log("a")
    }
    e.preventDefault()
})