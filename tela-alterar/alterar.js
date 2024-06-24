document.addEventListener('DOMContentLoaded', function () {
    const inputConsulta = document.querySelector('#inputConsulta');
    const btnPesquisar = document.querySelector('#btnPesquisar');
    const tabelaResultados = document.querySelector('#tabela-resultados tbody');
    const btnAlterar = document.querySelector('#btnAlterar');
    const btnConfirmar = document.querySelector('#btnConfirmar');
    const btnCancelar = document.querySelector('#btnCancelar');
    let linhaSelecionada;

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
                renderizarResultados(dados);
            })
            .catch(error => {
                console.error('Erro ao buscar empresas:', error);
                aviso('erro', 'Erro ao buscar empresas. Recarregue a página e tente novamente');
            });
    }

    function renderizarResultados(empresas) {
        tabelaResultados.innerHTML = '';

        empresas.forEach(empresa => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', empresa.id);

            const atributos = ['nome', 'nomePJ', 'cnpj', 'email', 'capDec', 'acervo'];
            atributos.forEach(atributo => {
                const cell = document.createElement('td');
                const valor = empresa[atributo] !== undefined && empresa[atributo] !== null ? empresa[atributo] : '';
                cell.textContent = valor;
                row.appendChild(cell);
            });

            row.addEventListener('click', function () {
                if (this.classList.contains('selected')) {
                    if (linhaSelecionada !== this) {
                        this.classList.remove('selected');
                        linhaSelecionada = null;
                        btnAlterar.style.display = 'none';
                    }
                } else {
                    const linhasSelecionadas = tabelaResultados.querySelectorAll('tr.selected');
                    linhasSelecionadas.forEach(linha => linha.classList.remove('selected'));

                    this.classList.add('selected');
                    linhaSelecionada = this;
                    btnAlterar.style.display = 'block';
                }
            });

            tabelaResultados.appendChild(row);
        });

        document.querySelector('#resultados').style.display = 'block';
    }

    btnPesquisar.addEventListener('click', function () {
        const consulta = inputConsulta.value.trim();

        fetch('http://localhost:8080/empresas')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro ao obter dados da API.');
                }
            })
            .then(dados => {
                let resultadosFiltrados = dados;

                if (consulta) {
                    resultadosFiltrados = resultadosFiltrados.filter(empresa => {
                        return (
                            empresa.nome.includes(consulta) ||
                            empresa.nomePJ.includes(consulta) ||
                            empresa.cnpj.includes(consulta)
                        );
                    });
                }

                renderizarResultados(resultadosFiltrados);
            })
            .catch(error => {
                console.error('Erro ao buscar empresas:', error);
                aviso('erro', 'Erro ao buscar empresas. Recarregue a página e tente novamente');
            });
    });

    btnAlterar.addEventListener('click', function () {
        if (linhaSelecionada) {
            linhaSelecionada.querySelectorAll('td').forEach(td => {
                if (td.querySelector('input')) {
                    const conteudoOriginal = td.querySelector('input').defaultValue;
                    td.textContent = conteudoOriginal;
                } else {
                    const conteudoOriginal = td.textContent.trim();
                    td.innerHTML = `<input type="text" value="${conteudoOriginal}">`;
                }
            });

            btnAlterar.style.display = 'none';
            btnConfirmar.style.display = 'inline';
            btnCancelar.style.display = 'inline';
        } else {
            aviso('erro', 'Selecione um registro');
        }
    });

    btnConfirmar.addEventListener('click', function () {
        if (linhaSelecionada) {
            const inputs = linhaSelecionada.querySelectorAll('input[type="text"]');
            const novoRegistro = {};

            const atributos = ['nome', 'nomePJ', 'cnpj', 'email', 'capDec', 'acervo'];
            atributos.forEach((atributo, index) => {
                novoRegistro[atributo] = inputs[index].value.trim();
            });

            const idRegistro = linhaSelecionada.getAttribute('data-id');

            fetch(`http://localhost:8080/empresas/${idRegistro}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoRegistro)
            })
            .then(response => {
                if (response.ok) {
                    aviso('sucesso', 'Dados atualizados com sucesso');
                    linhaSelecionada.querySelectorAll('td').forEach((td, index) => {
                        td.textContent = novoRegistro[atributos[index]];
                    });
                } else {
                    throw new Error('Erro ao atualizar empresa');
                }
            })
            .catch(error => {
                console.error('Erro ao enviar dados atualizados:', error);
                aviso('erro', 'Dados inválidos');
                linhaSelecionada.querySelectorAll('td').forEach((td, index) => {
                    if (td.querySelector('input')) {
                        const conteudoOriginal = td.querySelector('input').defaultValue;
                        td.textContent = conteudoOriginal;
                    }
                });
            })
            .finally(() => {
                btnConfirmar.style.display = 'none';
                btnCancelar.style.display = 'none';
                btnAlterar.style.display = 'block';
                linhaSelecionada.classList.remove('selected');
                linhaSelecionada = null;
            });
        }
    });

    btnCancelar.addEventListener('click', function () {
        if (linhaSelecionada) {
            linhaSelecionada.querySelectorAll('td').forEach((td) => {
                if (td.querySelector('input')) {
                    const valorOriginal = td.querySelector('input').defaultValue;
                    td.textContent = valorOriginal;
                }
            });

            btnConfirmar.style.display = 'none';
            btnCancelar.style.display = 'none';
            btnAlterar.style.display = 'block';
            linhaSelecionada.classList.remove('selected');
            linhaSelecionada = null;
        }
    });

    carregarDados();
});
