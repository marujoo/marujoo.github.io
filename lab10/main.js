document.addEventListener('DOMContentLoaded', () => {
    // obter os produtos da API e carregar no DOM
    fetchProdutos();
    restaurarCesto();
});

// inicializar localStorage se não existir
if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

let produtosSelecionados = [];
let custoTotal = 0;

// func para dar fetch nos produtos da API
function fetchProdutos() {
    fetch('https://deisishop.pythonanywhere.com/products/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os produtos da API');
            }
            return response.json(); // converter para json
        })
        .then(produtos => {
            carregarProdutos(produtos); // carregar os produtos no DOM
        })
        .catch(erro => {
            console.error('Erro ao obter os produtos:', erro);
        });
}

// func para carregar os produtos no DOM
function carregarProdutos(produtos) {
    const produtosContainer = document.querySelector('.produtos');
    produtos.forEach(produto => {
        const artigoProduto = criarProduto(produto);
        produtosContainer.appendChild(artigoProduto);
    });
}

// func para criar um produto no DOM
function criarProduto(produto) {
    const artigo = document.createElement('article');
    artigo.className = 'produto-card';

    const titulo = document.createElement('h3');
    titulo.textContent = produto.title;

    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const preco = document.createElement('p');
    preco.className = 'preco';
    preco.textContent = `${produto.price.toFixed(2)} €`;

    const descricao = document.createElement('p');
    descricao.className = 'descricao';
    descricao.textContent = produto.description;

    const botaoAdicionar = document.createElement('button');
    botaoAdicionar.textContent = '+ Adicionar ao Cesto';
    botaoAdicionar.className = 'adicionar-btn';
    botaoAdicionar.addEventListener('click', () => {
        produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados'));
        produtosSelecionados.push(produto);
        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
        criaProdutoCesto(produto);
    });

    const conteinerDescricaoBotao = document.createElement('section');
    conteinerDescricaoBotao.className = 'conteiner-descricao-botao';
    conteinerDescricaoBotao.appendChild(descricao);
    conteinerDescricaoBotao.appendChild(botaoAdicionar);

    artigo.appendChild(titulo);
    artigo.appendChild(imagem);
    artigo.appendChild(preco);
    artigo.appendChild(conteinerDescricaoBotao);

    return artigo;
}

// func para criar um produto no cesto
function criaProdutoCesto(produto) {
    const cestoContainer = document.querySelector('.produtos-cesto');
    
    const itemCesto = document.createElement('article');
    itemCesto.className = 'produto-card';
    
    const titulo = document.createElement('h3');
    titulo.textContent = produto.title;
    
    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;
    
    const preco = document.createElement('p');
    preco.className = 'preco';
    preco.textContent = `${produto.price.toFixed(2)} €`;
    
    const botaoRemover = document.createElement('button');
    botaoRemover.textContent = '- Remover do Cesto';
    botaoRemover.className = 'remover-btn';
    botaoRemover.addEventListener('click', () => removerDoCesto(produto, itemCesto));
    
    itemCesto.appendChild(titulo);
    itemCesto.appendChild(imagem);
    itemCesto.appendChild(preco);
    itemCesto.appendChild(botaoRemover);
    
    cestoContainer.appendChild(itemCesto);
    atualizarCustoTotal();
}

// func para remover um produto do cesto
function removerDoCesto(produto, elementoCesto) {
    const index = produtosSelecionados.findIndex(p => p.id === produto.id);
    
    if (index !== -1) {
        produtosSelecionados.splice(index, 1);
        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    }

    elementoCesto.remove();
    atualizarCustoTotal();
}

// func para atualizar o custo total
function atualizarCustoTotal() {
    custoTotal = produtosSelecionados.reduce((total, produto) => total + produto.price, 0);
    document.getElementById('custo-total').textContent = `Custo total: ${custoTotal.toFixed(2)} €`;
}

// func para restaurar o cesto do localStorage
function restaurarCesto() {
    const produtosStorage = JSON.parse(localStorage.getItem('produtos-selecionados'));
    if (produtosStorage) {
        produtosSelecionados = produtosStorage;
        produtosStorage.forEach(produto => {
            criaProdutoCesto(produto);
        });
    }
}


function filtrarPorCategoria() {
    const categoria = document.getElementById('categoria-select').value;
    
    fetch('https://deisishop.pythonanywhere.com/products/')
        .then(response => response.json())
        .then(produtos => {
            const produtosFiltrados = categoria 
                ? produtos.filter(p => p.category === parseInt(categoria))
                : produtos;
                
            const produtosContainer = document.querySelector('.produtos');
            produtosContainer.innerHTML = '';
            produtosFiltrados.forEach(produto => {
                produtosContainer.appendChild(criarProduto(produto));
            });
        });
}

// Sort by price
function ordenarPorPreco() {
    const ordem = document.getElementById('ordem-select').value;
    
    fetch('https://deisishop.pythonanywhere.com/products/')
        .then(response => response.json())
        .then(produtos => {
            if (ordem === 'asc') {
                produtos.sort((a, b) => a.price - b.price);
            } else if (ordem === 'desc') {
                produtos.sort((a, b) => b.price - a.price);
            }
            
            const produtosContainer = document.querySelector('.produtos');
            produtosContainer.innerHTML = '';
            produtos.forEach(produto => {
                produtosContainer.appendChild(criarProduto(produto));
            });
        });
}

// Search by name
function procurarPorNome() {
    const termoPesquisa = document.getElementById('pesquisa-input').value.toLowerCase();
    
    fetch('https://deisishop.pythonanywhere.com/products/')
        .then(response => response.json())
        .then(produtos => {
            const produtosFiltrados = produtos.filter(produto => 
                produto.title.toLowerCase().includes(termoPesquisa)
            );
            
            const produtosContainer = document.querySelector('.produtos');
            produtosContainer.innerHTML = '';
            produtosFiltrados.forEach(produto => {
                produtosContainer.appendChild(criarProduto(produto));
            });
        });
}

document.getElementById('categoria-select').addEventListener('change', filtrarPorCategoria);
document.getElementById('ordem-select').addEventListener('change', ordenarPorPreco);
document.getElementById('pesquisa-input').addEventListener('input', procurarPorNome);
