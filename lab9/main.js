// add um event listener que sera exec apos o dom estar carregado
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos(produtos); // chama a funcao com a lista de produtos
});

// funcao para carregar produtos no dom
function carregarProdutos(produtos) {
    const produtosContainer = document.querySelector('.produtos-grid'); // seleciona o container onde os produtos vao ser inseridos

    produtos.forEach(produto => {
        console.log(`ID: ${produto.id}, Title: ${produto.title}`); // imprime o ID e titulo no console

        const artigoProduto = criarProduto(produto); // cria o elemento article para o produto
        produtosContainer.appendChild(artigoProduto); // add o artigo ao container
    });
}

// funcao para criar o article de cada produto
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

// func para adicionar um produto ao cesto
function adicionarAoCesto(produtoId) {
    console.log(`Produto com ID ${produtoId} adicionado ao cesto!`);
}
