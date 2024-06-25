document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const inputs = document.querySelectorAll('input, textarea');
    let cnpjsExistents = [];
    let ultimasEmpresas = [];

    const tabelaUltimasEmpresas = document.querySelector('#ultimas-empresas tbody');

    function carregarDados() {
        fetch('http://localhost:8080/empresas')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro ao obter dados da API.');
                }
            })
            .then(dados => {
                cnpjsExistents = dados.map(empresa => empresa.cnpj);
                ultimasEmpresas = dados.slice(-5);
                renderizarUltimasEmpresas();
            })
            .catch(error => {
                console.error('Erro ao buscar empresas:', error);
                aviso('erro', 'Erro ao buscar empresas. Recarregue a página e tente novamente');
            });
    }

    function contemApenasNumeros(string) {
        return /^[0-9]+$/.test(string);
    }

    function validarCNPJ(cnpj) {
        return cnpj.length === 14 && contemApenasNumeros(cnpj);
    }

    function validarEmail(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }

    function validarCapDec(capDec) {
        return capDec.length >= 10 && contemApenasNumeros(capDec);
    }

    function validarTextarea(textarea) {
        return textarea.value.trim().length > 0;
    }

    function atualizarFeedback(input, isValid) {
        const article = input.parentElement;
        if (isValid) {
            article.classList.remove('erro');
            article.classList.add('sucesso');
        } else {
            article.classList.remove('sucesso');
            article.classList.add('erro');
        }
    }

    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const valor = input.value.trim();
            let isValid = false;

            switch (input.id) {
                case 'nome':
                case 'nomepj':
                    isValid = valor.length > 0;
                    break;
                case 'cnpj':
                    isValid = validarCNPJ(valor);
                    break;
                case 'email':
                    isValid = validarEmail(valor);
                    break;
                case 'capdeclarado':
                    isValid = validarCapDec(valor);
                    break;
                case 'acervotec':
                    isValid = validarTextarea(input);
                    break;
                default:
                    break;
            }

            atualizarFeedback(input, isValid);
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        let nome = document.querySelector('#nome').value.trim();
        let cnpj = document.querySelector('#cnpj').value.trim();
        let nomepj = document.querySelector('#nomepj').value.trim();
        let email = document.querySelector('#email').value.trim();
        let capdeclarado = document.querySelector('#capdeclarado').value.trim();
        let acervotec = document.querySelector('#acervotec').value.trim();

        if (!validarCNPJ(cnpj)) {
            aviso('erro', 'Campos vazios ou preenchidos incorretamente');
            return;
        }

        if (cnpjsExistents.includes(cnpj)) {
            aviso('erro', 'Este CNPJ já está cadastrado');
            return;
        }

        adicionarEmpresa(nome, cnpj, nomepj, email, capdeclarado, acervotec);

        form.reset();
        inputs.forEach(input => {
            const article = input.parentElement;
            article.classList.remove('sucesso', 'erro');
        });
    });

    function adicionarEmpresa(nome, cnpj, nomepj, email, capdeclarado, acervotec) {
        fetch("http://localhost:8080/empresas", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                cnpj: cnpj,
                nomePJ: nomepj,
                email: email,
                capDec: capdeclarado,
                acervo: acervotec
            })
        })
        .then(response => {
            if (response.status === 201) {
                return response.json();
            } else {
                aviso('erro', 'Erro ao cadastrar empresa. Tente novamente')
                console.log('Erro ao cadastrar empresa:', response.statusText);
                throw Error('Erro ao cadastrar empresa');
            }
        })
        .then(data => {
            aviso('sucesso', 'Empresa cadastrada')
            console.log('Empresa cadastrada:', data);
            ultimasEmpresas.push(data);
            if (ultimasEmpresas.length > 5) {
                ultimasEmpresas.shift();
            }
            renderizarUltimasEmpresas();
        })
        .catch(error => {
            aviso('erro', 'Erro ao cadastrar empresa. Tente novamente')
            console.error('Erro ao cadastrar empresa:', error);
        });
    }

    function renderizarUltimasEmpresas() {
        tabelaUltimasEmpresas.innerHTML = '';

        ultimasEmpresas.forEach(empresa => {
            const row = document.createElement('tr');
            const atributos = ['nome', 'nomePJ', 'cnpj', 'email', 'capDec', 'acervo'];

            atributos.forEach(atributo => {
                const cell = document.createElement('td');
                const valor = empresa[atributo] !== undefined && empresa[atributo] !== null ? empresa[atributo] : '';
                cell.textContent = valor;
                row.appendChild(cell);
            });

            tabelaUltimasEmpresas.appendChild(row);
        });
    }

    carregarDados();
});
