function aviso(icone, mensagem) {
    const aviso = document.querySelector(".aviso");
    const iconeAviso = document.querySelector(".icone-erro");
    const mensagemAviso = document.querySelector(".mensagem-erro");

    const iconeErro = '/img/erradobranco.png';
    const iconeSucesso = '/img/certinhobranco.png';

    if (icone === 'erro') {
        iconeAviso.setAttribute('src', iconeErro);
        aviso.style.backgroundColor = '#f44336';
    } else if (icone === 'sucesso') {
        iconeAviso.setAttribute('src', iconeSucesso);
        aviso.style.backgroundColor = '#65b307';
    }

    mensagemAviso.textContent = mensagem;

    aviso.style.display = 'block';

    setTimeout(() => {
        aviso.style.display = 'none';
    }, 3000); 
}
