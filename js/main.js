let livros = [];
const API = 'https://guilhermeonrails.github.io/casadocodigo/livros.json';

buscaLivro();

const inserirLivros = document.getElementById('livros');
const exibirValorTotal = document.getElementById('valor_total_livros_disponiveis');

//*********************Funcao principal ********************/

async function buscaLivro(){
    const resp = await fetch(API);
    livros = await resp.json();
    console.table(livros);
    const livrosDesconto = aplicaDesconto(livros);
    exibeLivros(livrosDesconto);
}


//*************Funcao de consultar livros e exibir eles *******************/
function exibeLivros(listadeLivro){
    inserirLivros.innerHTML = '';
    exibirValorTotal.innerHTML = '';
    listadeLivro.forEach(livro => {
        let disponiblidade = livro.quantidade > 0 ? 'livro__imagens' : 'livro__imagens indisponivel';
        inserirLivros.innerHTML += `<div class="livro">
        <img class="${disponiblidade}" src="${livro.imagem}" alt="Capa do livro ${livro.alt}" />
        <h2 class="livro__titulo">
          ${livro.titulo}
        </h2>
        <p class="livro__descricao">${livro.autor}</p>
        <p class="livro__preco" id="preco">R$${livro.preco.toFixed(2)}</p>
        <div class="tags">
          <span class="tag">${livro.categoria}</span>
        </div>
      </div>`
    });
}

//**********************Função de aplicar descontos nos livros *****************/

function aplicaDesconto(livros){
    const desconto = 0.25;
    livrosDesconto = livros.map(livro =>{
        return {...livro, preco: livro.preco - (livro.preco*desconto)}
    })
    return livrosDesconto;
}


//*****************************Funcao de filtragem *******************************/

const botoes = document.querySelectorAll(".btn");

botoes.forEach(btn => btn.addEventListener('click', filtrarLivros));

function filtrarLivros(){

    const btn = document.getElementById(this.id)
    const categoria = btn.value;
    let livrosFiltrados = categoria == 'disponivel' ? filtroDisponibilidade() : filtroCategoria(categoria);
    exibeLivros(livrosFiltrados);
    if(categoria=='disponivel'){
        const valorTotal = calculaValorTotal(livrosFiltrados);
        exibeValorTotal(valorTotal);
    }
}

function filtroCategoria(categoria) {
    return livros.filter(livro => livro.categoria == categoria);
}

function filtroDisponibilidade() {
    return livros.filter(livro => livro.quantidade > 0);
}


//**********************************Funcao de ordenar livros **************************/

let botaoOrdenaPreco = document.getElementById('btnOrdenarPorPreco');

botaoOrdenaPreco.addEventListener('click', ordenaPreco);

function ordenaPreco(){
    let livrosOrdenado = livros.sort((a,b) => a.preco - b.preco);
    exibeLivros(livrosOrdenado);
}

//****************Funcao de valor total *****************************/

function exibeValorTotal(valorTotal){
    exibirValorTotal.innerHTML = `
    <div class="livros__disponiveis">
      <p>Todos os livros disponíveis por R$ <span id="valor">${valorTotal}</span></p>
    </div>
    `
}

function calculaValorTotal(livros){
    return livros.reduce((acc,livro)=>acc+livro.preco,0).toFixed(2);
};
