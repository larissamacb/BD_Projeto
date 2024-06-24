document.addEventListener('DOMContentLoaded', function () {
    const inputConsulta = document.querySelector('#input-consulta');
    const btnPesquisar = document.querySelector('#btn-pesquisar');
    const tabelaResultados = document.querySelector('#tabela-resultados tbody');
    const selectFiltros = document.querySelector('#filtros');
    let dadosEmpresas = [];

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
                dadosEmpresas = dados;
                aplicarFiltros(dadosEmpresas);
            })
            .catch(error => {
                console.error('Erro ao buscar empresas:', error);
                alert('Erro ao buscar empresas. Verifique o console para mais detalhes.');
            });
    }

    function renderizarResultados(empresas) {
        tabelaResultados.innerHTML = '';

        empresas.forEach(empresa => {
            const row = document.createElement('tr');

            const atributos = ['nome', 'nomePJ', 'cnpj', 'email', 'capDec', 'acervo'];
            atributos.forEach(atributo => {
                const cell = document.createElement('td');
                const valor = empresa[atributo] !== undefined && empresa[atributo] !== null ? empresa[atributo] : '';
                cell.textContent = valor;
                row.appendChild(cell);
            });

            tabelaResultados.appendChild(row);
        });

        document.querySelector('#resultados').style.display = 'block';
    }

    function aplicarFiltros(empresas) {
        const consulta = inputConsulta.value.toLowerCase().trim();
        const filtroSelecionado = selectFiltros.value;

        let resultadosFiltrados = empresas;

        if (consulta) {
            resultadosFiltrados = resultadosFiltrados.filter(empresa => {
                return (
                    empresa.nome.includes(consulta) ||
                    empresa.nomePJ.includes(consulta) ||
                    empresa.cnpj.includes(consulta)
                );
            });
        }

        if (filtroSelecionado === 'ordem-alfabetica') {
            resultadosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
        } else if (filtroSelecionado === 'maior-capital') {
            resultadosFiltrados.sort((a, b) => b.capDec - a.capDec);
        }

        if (resultadosFiltrados.length === 0) {
            aviso('erro', 'Empresa não encontrada');
        }

        renderizarResultados(resultadosFiltrados);
    }

    btnPesquisar.addEventListener('click', function () {
        aplicarFiltros(dadosEmpresas);
    });

    selectFiltros.addEventListener('change', function () {
        aplicarFiltros(dadosEmpresas);
    });

    carregarDados();
});
