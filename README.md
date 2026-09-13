# playwright-api-tests

Projeto de estudo em JavaScript para praticar requisições HTTP e validações de respostas com Playwright. Os testes verificam status, content-type e dados retornados pelas APIs.

## Instalação

Tenha Node.js e npm instalados. O projeto foi validado com Node.js 24.
Na pasta do projeto, instale as dependências:

```bash
npm ci
```

## Execução

```bash
# Executar todos os testes
npm test

# Listar os testes sem executar
npm run test:list

# Abrir o relatório HTML da última execução
npm run report
```

A configuração atual repete os cenários nos projetos chromium, firefox e webkit. Para executar cada cenário apenas uma vez:

```bash
npm test -- --project=chromium --workers=1
```

Os testes usam a fixture `request` para enviar requisições HTTP, sem abrir páginas no navegador.

## APIs e cobertura atual

| API | O que é testado |
| --- | --- |
| [Restful Booker](https://restful-booker.herokuapp.com) | Listagem, consulta por ID e criação de reservas; validações de campos, tipos e dados enviados. |
| [DummyJSON](https://dummyjson.com) | Consulta do produto 1 e validação dos principais campos e tipos. |

Os arquivos ficam em `tests/`. A configuração fica em `playwright.config.js` e o workflow do GitHub Actions em `.github/workflows/playwright.yml`.

As APIs são públicas e precisam de acesso à internet. Alguns testes consultam os IDs fixos 1 e 695 do Restful Booker e dependem de essas reservas existirem. Os testes de criação ainda não removem as reservas ao terminar.

## Logs e relatório

O terminal mostra resumos, como status, ID e quantidade de reservas. Os detalhes que antes eram impressos como corpos completos ficam em anexos JSON no relatório HTML.

Após executar os testes, use `npm run report`, abra um teste e procure seus anexos (Attachments). As pastas de resultados e relatórios são ignoradas pelo Git.

## Documentação do projeto

- [Fluxograma interativo](docs/fluxograma.html): explica o caminho da execução até o relatório. Para interagir, abra o arquivo `docs/fluxograma.html` no navegador e clique nas etapas. Funciona offline; no GitHub, o HTML é exibido como código, então baixe ou clone o projeto para abrir localmente.
- [Cenários em BDD — pt-BR](docs/cenarios-bdd.md): descreve os 10 testes atuais com Dado, Quando e Então, relacionando cada cenário ao teste automatizado. É documentação; não exige Cucumber nem muda a execução com Playwright.

## Próximos estudos

- Criar os próprios dados para evitar consultas com IDs fixos.
- Praticar autenticação.
- Atualizar reservas com PUT e PATCH.
- Excluir reservas e limpar os dados criados pelos testes.
- Adicionar cenários negativos, como consulta de reserva inexistente.
