const tabela = document.getElementById("table-body")
const botoesConcluir = document.querySelectorAll('.botoes')
const campo_descricao = document.getElementById("input_descricao")
const botaoCadastro = document.getElementById('button-addon2')
const campo_progresso = document.getElementById('field-progress')
var listaTarefas = []
var tarefasConcluidas = 0

function carregarTarefa(){
    var url = "http://localhost:5262/api/Tarefa"
    fetch(url)
    .then(response => response.json())
    .then(function(data){
        data.forEach(element => {
            listaTarefas.push(element)
            let res = ""
            let classColor = ""
            if(element['isConcluido'] == true){
                classColor = "success"
                res = "Concluido"
                tarefasConcluidas++
            }else{
                classColor = "warning"
                res = "Pendente"
            }
            let row = document.createElement('tr')
            row.innerHTML = `
                    <td>${element['id']}</td>
                    <td>${element['descricao']}</td>
                    <td id="space-btn">
                        <button id="bc-${element['id']}" type="button" class="btn btn-${classColor} botoes" data-bs-toggle="modal" data-bs-target="#concluido-modal" onclick="btnsSituacao(${element['id']})">
                            ${res}
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-dark" id="edit-${element['id']}" data-bs-toggle="modal" data-bs-target="#editModal" onclick="atualizarDescricao(${element.id})"><i class="bi bi-pencil-square"></i></button>
                        <button type="button" class="btn btn-danger" id="trash-${element['id']}" onclick="deletarTarefa(${element.id})"><i class="bi bi-trash"></i></button>
                    </td>
            `
            tabela.appendChild(row)
        });
        let calculo = (tarefasConcluidas / listaTarefas.length) * 100
        if(listaTarefas.length > 0){
            campo_progresso.style.width = `${calculo}%`
            campo_progresso.innerHTML = `${Math.trunc(calculo)}%`
        }
    })
    .catch(function(error){
        console.log("[ERROR] " + error)
    })
}

async function cadastrarTarefa(){
    if (campo_descricao.value.length == 0){
        alert("O campo de descrição está vazio! Informe a descrição da tarefa e cadastre-a...")
        return
    }else{
        const resposta = {
            Descricao: campo_descricao.value,
        }
        try{
            const envio = await fetch('http://localhost:5262/api/Tarefa', {
                method: 'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resposta)
            })
            if(envio.status == 201){
                campo_descricao.value = ""
            }else{
                console.log("[ERROR] Ocorreu um erro ao passar os dados à API...")
            }
        }catch(error){
            console.log(error)
        }
    }   
}

async function btnsSituacao(id){
    const divModal = document.getElementById('concluido-modal')
    word = ""
    if(listaTarefas[id - 1].isConcluido == true){ //True
        word = "Pender"
    }else{
        word = "Concluir"
    }
    divModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">${word} Tarefa</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body al">
                    Deseja realmente ${word.toLowerCase()} a tarefa "${listaTarefas[id - 1].descricao}" ?
                    <br>
                    Se sim clique em ${word.toLowerCase()}.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btn-modal-concluido">${word} Tarefa</button>
                </div>
            </div>
        </div>
    `
    const btn_modal_isConcluido = document.getElementById('btn-modal-concluido')
    btn_modal_isConcluido.addEventListener('click', () => {
        try{
            const envio = fetch(`http://localhost:5262/api/Tarefa/${id}`, {
                method: 'PUT',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({isConcluido: undefined})
            })
            if(envio.status == 201){
                console.log("Success")
            }else{
                console.log("[ERROR] Ocorreu um erro ao passar os dados à API...")
            }
        }catch(error){
            console.log(error)
        }
    })
}

async function atualizarDescricao(id){
    const input_mudanca_descricao = document.getElementById('recipient-descricao')
    const btn_modal_editar = document.getElementById('btn-editar')
    const texto_pergunta = document.getElementById('texto-pergunta')
    texto_pergunta.innerHTML = `Deseja alterar a descrição da tarefa "${listaTarefas[id - 1].descricao}"?`
    btn_modal_editar.addEventListener('click', () => {
        if(input_mudanca_descricao.value.length > 0){
            try{
                const envio = fetch(`http://localhost:5262/api/Tarefa/${id}/${input_mudanca_descricao.value}`, {
                    method: 'PUT',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({Descricao: input_mudanca_descricao.value})
                })
                if(envio.status == 201){
                    console.log("Success")
                }else{
                    console.log("[ERROR] Ocorreu um erro ao passar os dados à API...")
                }
            }catch(error){
                console.log(error)
            }
        }else{
            console.log("Input vazio, digite algo...")
        }
    })
}

async function deletarTarefa(id){
    try{
        const envio = fetch(`http://localhost:5262/api/Tarefa/${id}`, {
            method: 'DELETE',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        })
        if(envio.status == 201){
            console.log("DELETED with success")
        }else{
            console.log("[ERROR] Ocorreu um erro ao passar os dados à API...")
        }
    }catch(error){
        console.log(error)
    }
}
carregarTarefa()