using Microsoft.AspNetCore.Mvc;
using tarefas_api.Models;

namespace tarefas_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TarefaController : ControllerBase
    {
        private string BancoDados = "DadosTarefa.txt";
        private readonly ILogger<TarefaController> _logger;
        public TarefaController(ILogger<TarefaController> logger){   
            _logger = logger;
        }

        private List<Tarefa> carregarTarefa(){
            if (!System.IO.File.Exists(BancoDados)){
                return new List<Tarefa>();
            }
            string[] conteudo = System.IO.File.ReadAllLines(BancoDados);
            List<Tarefa> listaTarefas = new List<Tarefa>();
            foreach(string linha in conteudo){
                string[] campo = linha.Split('|');
                Tarefa tarefa = new Tarefa();
                tarefa.Id = Convert.ToInt32(campo[0]);
                tarefa.Descricao = campo[1];
                tarefa.IsConcluido = Convert.ToBoolean(campo[2]);
                listaTarefas.Add(tarefa);
            }
            return listaTarefas.ToList();
        }

        private void salvarTarefa(List<Tarefa> listaTarefa){
            var linha = listaTarefa.Select(t => $"{t.Id}|{t.Descricao}|{t.IsConcluido}");
            System.IO.File.WriteAllLines(BancoDados, linha);
        }

        [HttpGet]
        public IActionResult GetTarefas(){
            var tarefas = carregarTarefa();
            return Ok (tarefas);
        }

        [HttpPost]
        public IActionResult incluirTarefa(Tarefa tarefa){
            var tarefas = carregarTarefa();
            if (tarefas.Count() == 0){
                tarefa.Id = 1;
            }else{
                tarefa.Id = tarefas.Last().Id + 1;
            }
            tarefa.IsConcluido = false;
            tarefas.Add(tarefa);
            salvarTarefa(tarefas);
            return Ok (tarefa);
        }

        [HttpPut("{Id}")]
        public IActionResult atualizarSituacao(int Id){
            Tarefa? tarefa = new Tarefa();
            var listaTarefa = carregarTarefa();
            tarefa = listaTarefa.FirstOrDefault(x => x.Id == Id);
            if(tarefa == null){
                return NotFound();
            }
            tarefa.IsConcluido = !tarefa.IsConcluido;
            salvarTarefa(listaTarefa);
            return Ok (tarefa);
        }

        [HttpPut("{Id}/{Descricao}")]
        public IActionResult atualizarDescricao(int Id, string Descricao){
            Tarefa? tarefa = new Tarefa();
            var listaTarefa = carregarTarefa();
            tarefa = listaTarefa.FirstOrDefault(x => x.Id == Id);
            if(tarefa == null){
                return NotFound();
            }
            tarefa.Descricao = Descricao;
            tarefa.IsConcluido = false;
            salvarTarefa(listaTarefa);
            return Ok (tarefa);
        }

        [HttpDelete("{Id}")]
        public IActionResult deletarTarefa(int Id){
            Tarefa? tarefa = new Tarefa();
            var listaTarefa = carregarTarefa();
            tarefa = listaTarefa.FirstOrDefault(x => x.Id == Id);
            if(tarefa == null){
                return NotFound();
            }
            listaTarefa.Remove(tarefa);
            salvarTarefa(listaTarefa);
            return NoContent();
        }
    }
}