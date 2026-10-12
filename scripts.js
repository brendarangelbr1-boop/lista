//elementos do html
const form = document.getElementById("item-form");
const input = document.getElementById("item-input");
const list = document.getElementById("item-list");
const empty = document.getElementById("empty");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");
const toastClose = document.getElementById("toast-close");
const backLink = document.querySelector(".back");

//itens iniciais da lista (o botão voltar usa para trazer tudo de volta)
const initialItems = ["Pão de forma", "Café preto", "Suco de laranja", "Bolacha"];

//guarda o "despertador" que esconde o alerta sozinho
let toastTimer;

//receber só letras, números, espaço e os símbolos . , % / -
input.addEventListener("input", () => {
  const hasCharacters = /[^\p{L}\d\s.,%/-]+/gu;
  input.value = input.value.replace(hasCharacters, "");

  //tira a borda vermelha quando a pessoa volta a digitar
  input.classList.remove("invalid");
});

//submit do form
form.onsubmit = (event) => {
  event.preventDefault();

  addItem(input.value);
};

//adicionar item na lista
function addItem(value) {
  try {
    //texto digitado, sem espaços no começo e no fim
    const name = value.trim();

    //impede a adição de item vazio
    if (!name) {
      input.classList.add("invalid");
      input.focus();
      return;
    }

    //cria o item com o nome formatado
    createItem(formatItemName(name));

    //limpa o campo e deixa o cursor pronto para o próximo item
    input.value = "";
    input.focus();

    //esconde o alerta e a mensagem de lista vazia
    hideToast();
    updateEmptyState();
  } catch (error) {
    console.log(error);
    alert("Não foi possível adicionar o item. Por favor, tente novamente mais tarde.");
  }
}

//criar o item na tela
function createItem(name) {
  //cria o <li> do item
  const item = document.createElement("li");
  item.className = "item";

  //label: clicar em qualquer parte dele marca o checkbox
  const label = document.createElement("label");

  //checkbox de verdade (fica invisível, quem aparece é o .box)
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  //quadradinho que aparece no lugar do checkbox
  const box = document.createElement("span");
  box.className = "box";

  //nome do item (textContent coloca como texto puro, sem executar html)
  const text = document.createElement("span");
  text.className = "name";
  text.textContent = name;

  label.append(checkbox, box, text);

  //botão de remover com o ícone de lixeira
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove";
  remove.setAttribute("aria-label", `Remover ${name}`);
  remove.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5"/></svg>';

  //junta as peças e coloca o item na lista
  item.append(label, remove);
  list.append(item);
}

//formatar o nome do item (primeira letra maiúscula)
function formatItemName(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

//clique na lista: descobre se foi em uma lixeira
//(um só ouvinte na lista funciona também para os itens adicionados depois)
list.addEventListener("click", (event) => {
  const button = event.target.closest(".remove");

  if (!button) return;

  removeItem(button);
});

//remover item da lista
function removeItem(button) {
  //do botão sobe até o <li> e apaga o item inteiro
  button.closest(".item").remove();

  //exibe o alerta e a mensagem de lista vazia (se não sobrou nada)
  showToast("O item foi removido da lista");
  updateEmptyState();
}

//exibir o alerta vermelho
function showToast(message) {
  //exibe a mensagem dentro do alerta
  toastText.textContent = message;

  //remove e adiciona a classe para a animação tocar de novo
  toast.classList.remove("show-toast");
  toast.offsetHeight;

  //aplica a classe e exibe o alerta
  toast.classList.add("show-toast");

  //desliga o despertador antigo e liga um novo de 4 segundos
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 4000);
}

//esconder o alerta vermelho
function hideToast() {
  //remove a classe do alerta e desliga o despertador
  toast.classList.remove("show-toast");
  clearTimeout(toastTimer);
}

//fechar o alerta no X
toastClose.addEventListener("click", hideToast);

//exibe a mensagem "lista vazia" só quando não existe nenhum item
function updateEmptyState() {
  empty.classList.toggle("show-empty", list.children.length === 0);
}

//botão voltar: traz a lista de volta
backLink.addEventListener("click", (event) => {
  event.preventDefault();

  resetList();
});

//apaga tudo e coloca de novo os itens iniciais
function resetList() {
  list.innerHTML = "";
  initialItems.forEach(createItem);

  hideToast();
  updateEmptyState();
}

//confere a mensagem de vazio ao abrir a página
updateEmptyState();