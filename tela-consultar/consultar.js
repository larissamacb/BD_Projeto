window.addEventListener("load", (event) => {
    fetch('http://localhost:8080/empresas')
    .then(response => {
        if(response.status === 200){
            return response.json()
        } else {
            throw Error('Dados indisponíveis')
        }
    })
    .then(dados => {
        let empresas = dados.results;
        let lista = document.querySelector('tbody')

        empresas.forEach(empresa => {
            console.log(empresa.getNome)
        
        })
    })

