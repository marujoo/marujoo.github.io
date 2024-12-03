document.addEventListener("DOMContentLoaded", function() {
    fetch("https://deisishop.pythonanywhere.com/products/")
        .then(response => response.json())
        .then(produtos => {
            carregarProdutos(produtos);
            configurarFiltros(produtos);
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
    
    carregarCategorias();
    carregarCesto();
    configurarBotaoComprar();
});

function carregarCategorias() {
    fetch("https://deisishop.pythonanywhere.com/categories/")
        .then(response => response.json())
        .then(categorias => {
            const filtroCategoria = document.querySelector("#categoria-select");
            filtroCategoria.innerHTML = '<option value="">Todas as categorias</option>';
            categorias.forEach(categoria => {
                const option = document.createElement("option");
                option.value = categoria;
                option.textContent = categoria;
                filtroCategoria.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar categorias:', error));
}

function configurarFiltros(produtos) {
    document.querySelector("#categoria-select").addEventListener("change", () => filtrarEAtualizarProdutos(produtos));
    document.querySelector("#ordem-select").addEventListener("change", () => filtrarEAtualizarProdutos(produtos));
    document.querySelector("#pesquisa-input").addEventListener("keyup", () => filtrarEAtualizarProdutos(produtos));
}

function filtrarEAtualizarProdutos(produtos) {
    const categoriaSelecionada = document.querySelector("#categoria-select").value;
    const ordenacao = document.querySelector("#ordem-select").value;
    const pesquisa = document.querySelector("#pesquisa-input").value.toLowerCase();

    let produtosFiltrados = produtos;

    if (categoriaSelecionada) {
        produtosFiltrados = produtosFiltrados.filter(produto => produto.category == categoriaSelecionada);
    }
    if (pesquisa) {
        produtosFiltrados = produtosFiltrados.filter(produto => 
            produto.title.toLowerCase().includes(pesquisa)
        );
    }
    if (ordenacao === "asc") {
        produtosFiltrados.sort((a, b) => a.price - b.price);
    } else if (ordenacao === "desc") {
        produtosFiltrados.sort((a, b) => b.price - a.price);
    }

    carregarProdutos(produtosFiltrados);
}

function carregarProdutos(produtos) {
    const produtosContainer = document.querySelector(".produtos");
    produtosContainer.innerHTML = '';
    produtos.forEach(produto => {
        const article = criarProduto(produto);
        produtosContainer.appendChild(article);
    });
}

function criarProduto(produto) {
    const article = document.createElement("article");
    article.className = 'produto-card';
    article.dataset.id = produto.id;

    const title = document.createElement("h3");
    title.textContent = produto.title;

    const image = document.createElement("img");
    image.src = produto.image;
    image.alt = produto.title;

    const price = document.createElement("p");
    price.textContent = `${produto.price.toFixed(2)} €`;
    price.className = 'preco';

    const description = document.createElement("p");
    description.textContent = produto.description;
    description.className = 'descricao';

    const button = document.createElement("button");
    button.textContent = "+ Adicionar ao Cesto";
    button.className = 'adicionar-btn';
    button.addEventListener("click", () => adicionarAoCesto(produto));

    article.appendChild(title);
    article.appendChild(image);
    article.appendChild(price);
    article.appendChild(description);
    article.appendChild(button);

    return article;
}

function adicionarAoCesto(produto) {
    let produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados') || '[]');
    produtosSelecionados.push(produto);
    localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    
    criaProdutoCesto(produto);
    atualizarCustoTotal();
}

function criaProdutoCesto(produto) {
    const cestoContainer = document.querySelector(".produtos-cesto");
    
    const article = document.createElement("article");
    article.className = 'produto-card';
    article.dataset.id = produto.id;

    const title = document.createElement("h3");
    title.textContent = produto.title;

    const image = document.createElement("img");
    image.src = produto.image;
    image.alt = produto.title;

    const price = document.createElement("p");
    price.textContent = `${produto.price.toFixed(2)} €`;
    price.className = 'preco';

    const button = document.createElement("button");
    button.textContent = "- Remover do Cesto";
    button.className = 'remover-btn';
    button.addEventListener("click", () => removerDoCesto(produto, article));

    article.appendChild(title);
    article.appendChild(image);
    article.appendChild(price);
    article.appendChild(button);

    cestoContainer.appendChild(article);
}

function removerDoCesto(produto, elementoCesto) {
    let produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados') || '[]');
    const index = produtosSelecionados.findIndex(p => p.id === produto.id);
    
    if (index !== -1) {
        produtosSelecionados.splice(index, 1);
        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    }

    elementoCesto.remove();
    atualizarCustoTotal();
}

function atualizarCustoTotal() {
    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados') || '[]');
    const custoTotal = produtosSelecionados.reduce((total, produto) => total + produto.price, 0);
    document.getElementById('custo-total').textContent = `Custo total: ${custoTotal.toFixed(2)} €`;
}

function configurarBotaoComprar() {
    document.getElementById('btn-comprar').addEventListener('click', function(e) {
        e.preventDefault();
        processaPagamento();
    });
}

function processaPagamento() {
    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados') || '[]');
    const estudante = document.getElementById('estudante-checkbox').checked;
    const cupao = document.getElementById('desconto-cupao').value;
    
    const dadosCompra = {
        products: produtosSelecionados.map(p => p.id),
        student: estudante,
        coupon: cupao
    };
    console.log(dadosCompra);
    fetch('https://deisishop.pythonanywhere.com/buy/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosCompra)
    })
    .then(response => response.json())
    .then(dados => {
        if (dados.error) {
            document.getElementById('precofinal').textContent = `Erro: ${dados.error}`;
            document.getElementById('referencia').textContent = '';
        } else {
            document.getElementById('precofinal').textContent = 
                `Valor final a pagar (com eventuais descontos): ${dados.totalCost}€`;
            document.getElementById('referencia').textContent = 
                `Referência de pagamento: ${dados.reference}`;
            
            localStorage.setItem('produtos-selecionados', '[]');
            document.querySelector('.produtos-cesto').innerHTML = '';
            atualizarCustoTotal();
        }
    })
    .catch(erro => {
        console.error('Erro ao processar pagamento:', erro);
        document.getElementById('precofinal').textContent = 'Erro ao processar o pagamento';
        document.getElementById('referencia').textContent = '';
    });
}

function carregarCesto() {
    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados') || '[]');
    document.querySelector('.produtos-cesto').innerHTML = '';
    produtosSelecionados.forEach(produto => criaProdutoCesto(produto));
    atualizarCustoTotal();
}