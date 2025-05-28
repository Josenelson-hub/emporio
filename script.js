fetch('json/produtos.json')
  .then(response => response.json())
  .then(produtos => {
    const container = document.querySelector('.produtos');

    produtos.forEach(produto => {
      const produtoDiv = document.createElement('div');
      produtoDiv.classList.add('produto');
      produtoDiv.dataset.id = produto.classe;

      const img = document.createElement('img');
      img.classList.add('produto-img');
      img.src = produto.img;
      img.alt = produto.nome;

      const nomeH2 = document.createElement('h2');
      nomeH2.classList.add('nome-produto');
      nomeH2.textContent = produto.nome;

      const btnsDiv = document.createElement('div');
      btnsDiv.classList.add('btns');

      const addBtn = document.createElement('button');
      addBtn.classList.add('add');
      addBtn.textContent = 'Adicionar';

      const removeBtn = document.createElement('button');
      removeBtn.classList.add('remove');

      const removeIcon = document.createElement('img');
      removeIcon.classList.add('remove-icon');
      removeIcon.src = 'img/remove.png';
      removeIcon.alt = 'Remover';

      removeBtn.appendChild(removeIcon);
      btnsDiv.appendChild(addBtn);
      btnsDiv.appendChild(removeBtn);

      produtoDiv.appendChild(img);
      produtoDiv.appendChild(nomeH2);
      produtoDiv.appendChild(btnsDiv);

      container.appendChild(produtoDiv);
    });

    // Após criar todos os produtos, pega os elementos necessários:
    const all = document.querySelectorAll('.produto');

    const buttons = {
      doceBtn: document.querySelector('.doceBtn'),
      artesanalBtn: document.querySelector('.artesanalBtn'),
      queijoBtn: document.querySelector('.queijoBtn'),
      allBtn: document.querySelector('.allBtn'),
    };

    const groups = {
      doces: document.querySelectorAll('[data-id="doces"]'),
      outros: document.querySelectorAll('[data-id="outros"]'),
      queijos: document.querySelectorAll('[data-id="queijos"]'),
    };

    function filtrarGrupo(grupo) {
      all.forEach(item => item.style.display = 'none');
      if (grupo) {
        grupo.forEach(item => item.style.display = 'block');
      } else {
        all.forEach(item => item.style.display = 'block');
      }
    }

    buttons.doceBtn.addEventListener('click', () => filtrarGrupo(groups.doces));
    buttons.artesanalBtn.addEventListener('click', () => filtrarGrupo(groups.outros));
    buttons.queijoBtn.addEventListener('click', () => filtrarGrupo(groups.queijos));
    buttons.allBtn.addEventListener('click', () => filtrarGrupo(null));

    // Variável que vai armazenar os nomes selecionados
    let nomeSelecionado = '';

    // Seleciona todos os botões adicionar
    const botoesAdd = document.querySelectorAll('.add');

    botoesAdd.forEach(botao => {
      botao.addEventListener('click', (event) => {
        const produto = event.target.closest('.produto');
        if (!produto) return;

        const nome = produto.querySelector('.nome-produto').textContent;
        nomeSelecionado += nome + '\n';

        console.log(nomeSelecionado);
      });
    });

    // Botão enviar Whatsapp
    const btnEnviarWhatsapp = document.getElementById('btnEnviarWhatsapp');
    const numeroWhats = '553597211199'; // substitua pelo seu número

    btnEnviarWhatsapp.addEventListener('click', () => {
      if (!nomeSelecionado.trim()) {
        alert('Nenhum produto selecionado ainda!');
        return;
      }

      const mensagem = encodeURIComponent(nomeSelecionado);
      const url = `https://wa.me/${numeroWhats}?text=${mensagem}`;
      window.open(url, '_blank');
    });

    // Botões remover
    const botoesRemover = document.querySelectorAll('.remove');

    function removerNome(nome) {
      let linhas = nomeSelecionado.split('\n');
      linhas = linhas.filter(linha => linha.trim() !== nome);
      nomeSelecionado = linhas.join('\n');
      console.log(nomeSelecionado);
    }

    botoesRemover.forEach(botao => {
      botao.addEventListener('click', event => {
        const produto = event.target.closest('.produto');
        if (!produto) return;

        const nome = produto.querySelector('.nome-produto').textContent;
        removerNome(nome);
      });
    });
  })
  .catch(err => console.error('Erro ao carregar JSON:', err));
