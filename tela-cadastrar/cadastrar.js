window.onload = () => {
    get_all_users();

    document.querySelector('#enviar').addEventListener('click', () => {
        let nome = document.querySelector('#nome').value;
        let cnpj = parseInt(document.querySelector('#cnpj').value);
        let nomepj = document.querySelector('#nomepj').value;
        let email = document.querySelector('#email').value;
        let capdeclarado = parseInt(document.querySelector('#capdeclarado').value);
        let acervotec = document.querySelector('#acervotec').value;

        alert('Enviando dados...');
        add_new_user(nome, cnpj, nomepj, email, capdeclarado, acervotec);
    });
};

function get_all_users() {
    fetch("http://localhost:8080/empresas")
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert('Erro ao obter dados');
                console.log('Erro ao obter dados:', response.statusText);
                throw new Error('Erro ao obter dados');
            }
        })
        .then(dados => {
            console.log('Empresas recebidas:', dados);
            alert('Empresas recebidas: veja o console');
            if (dados.length === 0) {
                console.log('Não há empresas cadastradas');
            } else {
                dados.forEach(empresa => {
                    console.log(empresa.nome); 
                });
            }
        })
        .catch(error => {
            alert('Erro ao obter empresa');
            console.error('Erro:', error); 
        });
}

function add_new_user(nome, cnpj, nomepj, email, capdeclarado, acervotec) {
    fetch("http://localhost:8080/empresas", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            nome, cnpj, nomepj, email, capdeclarado, acervotec
        })
    })
    .then(response => {
        if (response.status === 201) {
            return response.json();
        } else {
            alert('Erro ao cadastrar empresa');
            throw Error('Erro ao cadastrar empresa');
        }
    })
    .then(data => {
        console.log('Empresa cadastrada:', data);
        alert('Empresa cadastrada: veja o console');
        get_all_users();
    })
    .catch(error => {
        alert('Erro ao cadastrar empresa');
        console.error('Erro ao cadastrar empresa:', error);
    });
}
