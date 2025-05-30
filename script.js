fetch('json/produtos.json')
  .then(r => r.json())
  .then(produtos => {
    const container = document.querySelector('.produtos');
    let nomeSelecionado = '';
    const carrinhoQtde = {}; // armazena qtd de cada produto

    // Cria os produtos
    produtos.forEach(({classe, img, nome}) => {
      const div = document.createElement('div');
      div.className = 'produto';
      div.dataset.id = classe;
      div.innerHTML = `
        <img class="produto-img" src="${img}" alt="${nome}">
        <h2 class="nome-produto">${nome}</h2>
        <div class="btns">
          <button class="add">Adicionar</button>
          <span class="quantidade" style="margin-left:8px;">0</span>
        </div>
      `;
      container.appendChild(div);
    });

    const all = [...document.querySelectorAll('.produto')];
    const buttons = {
      doceBtn: document.querySelector('.doceBtn'),
      artesanalBtn: document.querySelector('.artesanalBtn'),
      queijoBtn: document.querySelector('.queijoBtn'),
      allBtn: document.querySelector('.allBtn')
    };
    const groups = {
      doces: all.filter(p => p.dataset.id === 'doces'),
      outros: all.filter(p => p.dataset.id === 'outros'),
      queijos: all.filter(p => p.dataset.id === 'queijos')
    };

    const filtrarGrupo = grupo => {
      all.forEach(p => p.style.display = 'none');
      (grupo || all).forEach(p => p.style.display = 'block');
    };

    buttons.doceBtn.onclick = () => filtrarGrupo(groups.doces);
    buttons.artesanalBtn.onclick = () => filtrarGrupo(groups.outros);
    buttons.queijoBtn.onclick = () => filtrarGrupo(groups.queijos);
    buttons.allBtn.onclick = () => filtrarGrupo(null);

    function atualizarQuantidadeProduto(nome) {
      const div = all.find(p => p.querySelector('.nome-produto').textContent === nome);
      if (!div) return;
      const qtdSpan = div.querySelector('.quantidade');
      const qtd = carrinhoQtde[nome] || 0;
      if (qtd >= 1) {
        qtdSpan.textContent = `(${qtd}x)`;
        qtdSpan.style.display = 'inline';
        qtdSpan.classList.add = 'formater';
      } else {
        qtdSpan.textContent = '';
        qtdSpan.style.display = 'none';
      }
    }
    
    // Depois de criar produtos e adicionar ao container:
    produtos.forEach(produto => {
      atualizarQuantidadeProduto(produto.nome);
    });
    

    container.onclick = e => {
      const produto = e.target.closest('.produto');
      if (!produto) return;

      const nome = produto.querySelector('.nome-produto').textContent;

      if (e.target.classList.contains('add')) {
        nomeSelecionado += nome + '\n';
        carrinhoQtde[nome] = (carrinhoQtde[nome] || 0) + 1;
        atualizarQuantidadeProduto(nome);
      }

      if (e.target.closest('.remove')) {
        if (carrinhoQtde[nome] > 0) {
          removerNome(nome);
          carrinhoQtde[nome]--;
          atualizarQuantidadeProduto(nome);
        }
      }
      
    };

    const modal = document.getElementById('modalOverlay');
    const modalMensagem = document.getElementById('modalMensagem');
    const btnFinalizar = document.getElementById('btnFinalizarPedido');
    const carrinho = document.getElementById('carrinho');
    const numeroWhats = '553597211199';

    function removerNome(nome) {
      const linhas = nomeSelecionado.trim().split('\n').filter(Boolean);
      const idx = linhas.indexOf(nome);
      if (idx > -1) {
        linhas.splice(idx, 1);
        nomeSelecionado = linhas.join('\n');
      }
    }

    function atualizarModal() {
      const linhas = nomeSelecionado.trim().split('\n').filter(Boolean);
      if (!linhas.length) {
        modalMensagem.innerHTML = '<p>Nenhum produto selecionado.</p>';
        return;
      }

      const contagem = linhas.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {});

      modalMensagem.innerHTML = Object.entries(contagem).map(([nome, qtd]) =>
        `<p>
          <strong>•</strong> ${nome} (${qtd}x)
          <button class="remove-modal" data-nome="${nome}" style="margin-left:8px; cursor:pointer; background:none; border:none;">
            <img class="remove-icon" src="img/remove.png" alt="Remover" style="width:16px; height:16px;">
          </button>
        </p>`
      ).join('');

      modalMensagem.querySelectorAll('.remove-modal').forEach(btn =>
        btn.onclick = () => {
          const nome = btn.dataset.nome;
          removerNome(nome);
          carrinhoQtde[nome]--;
          if (carrinhoQtde[nome] <= 0) delete carrinhoQtde[nome];
          atualizarQuantidadeProduto(nome);
          atualizarModal();
        }
      );
    }

    btnFinalizar.onclick = () => {
      if (Object.keys(carrinhoQtde).length === 0) {
        alert('Seu carrinho está vazio!');
        return;
      }
    
      const textoFixo = `Olá! Tudo bem? Estou interessado(a) em conferir os produtos que vocês oferecem. Poderia, por favor, me ajudar com a disponibilidade dos itens abaixo?\n\n`;
    
      // Monta a lista com quantidade formatada
      const listaProdutos = Object.entries(carrinhoQtde)
        .map(([nome, qtd]) => `• ${nome} (${qtd}x)`)
        .join('\n');
    
      const mensagem = encodeURIComponent(textoFixo + listaProdutos);
    
      window.open(`https://wa.me/${numeroWhats}?text=${mensagem}`, '_blank');
    };

    carrinho.onclick = () => {
      atualizarModal();
      modal.style.display = 'flex';
    };

    document.getElementById('modalCloseBtn').onclick = () => modal.style.display = 'none';
    modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
    document.onkeydown = e => { if (e.key === 'Escape' && modal.style.display === 'flex') modal.style.display = 'none'; };
  })
