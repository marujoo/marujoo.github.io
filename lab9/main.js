// init quando o DOM carrega
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos(produtos);
    restaurarCesto();
});


// nicializar localStorage se nao existir
if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

let produtosSelecionados = [];
let custoTotal = 0;


// func para carregar produtos no DOM
function carregarProdutos(produtos) {
    const produtosContainer = document.querySelector('.produtos');
    produtos.forEach(produto => {
        console.log(`ID: ${produto.id}, Title: ${produto.title}`);
        const artigoProduto = criarProduto(produto);
        produtosContainer.appendChild(artigoProduto);
    });
}

// func para criar um produto
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
        // Obter lista atual do localStorage
        produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados'));
        // add novo produto a lista
        produtosSelecionados.push(produto);
        // guardar lista atualizada no localStorage
        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
        // atualizar a visualizacao do cesto
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

// func para criar produto no cesto
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

// func para remover produto do cesto
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

