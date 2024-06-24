document.addEventListener('DOMContentLoaded', function () {
    const inputConsulta = document.querySelector('#inputConsulta');
    const btnPesquisar = document.querySelector('#btnPesquisar');
    const tabelaResultados = document.querySelector('#tabela-resultados tbody');
    const btnExcluir = document.querySelector('#btnExcluir');
    const modalExcluir = document.querySelector('#modalExcluir');
    const btnConfirmarExclusao = document.querySelector('#btnConfirmarExclusao');
    const btnCancelarExclusao = document.querySelector('#btnCancelarExclusao');
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
                        btnExcluir.style.display = 'none';
                    }
                } else {
                    const linhasSelecionadas = tabelaResultados.querySelectorAll('tr.selected');
                    linhasSelecionadas.forEach(linha => linha.classList.remove('selected'));

                    this.classList.add('selected');
                    linhaSelecionada = this;
                    btnExcluir.style.display = 'block';
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

    btnExcluir.addEventListener('click', function () {
        if (linhaSelecionada) {
            modalExcluir.style.display = 'block';
        } else {
            aviso('erro', 'Selecione um registro');
        }
    });

    btnCancelarExclusao.addEventListener('click', function () {
        modalExcluir.style.display = 'none';
    });

    btnConfirmarExclusao.addEventListener('click', function () {
        const idRegistro = linhaSelecionada.getAttribute('data-id');

        fetch(`http://localhost:8080/empresas/${idRegistro}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                aviso('sucesso', 'Empresa excluída com sucesso');
                linhaSelecionada.remove();
                linhaSelecionada = null;
                btnExcluir.style.display = 'none';
                modalExcluir.style.display = 'none';
            } else {
                throw new Error('Erro ao excluir empresa.');
            }
        })
        .catch(error => {
            console.error('Erro ao excluir empresa:', error);
            aviso('erro', 'Erro ao excluir empresa. Tente novamente');
            modalExcluir.style.display = 'none';
        });
    });

    carregarDados();
});
