# Cenários de teste em BDD — pt-BR

Este documento descreve os 10 testes atuais usando **Dado** (contexto), **Quando** (ação) e **Então** (resultado esperado). É documentação em formato Gherkin, não uma suíte executável com Cucumber. A automação continua nos arquivos `.spec.js` do Playwright.

Cada cenário abaixo corresponde a um teste. Os títulos entre aspas preservam os nomes usados no código para facilitar a localização. Atualize este documento quando mudar o comportamento validado.

## Consultar reservas

Arquivo: [consultar-reservas.spec.js](../tests/consultar-reservas.spec.js)

### CT01 — Listar reservas e validar os IDs

Teste: `consultar todas as reservas cadastradas`

```gherkin
Cenário: Listar reservas com identificadores válidos
  Dado que a API Restful Booker está acessível
  Quando envio uma requisição GET para "/booking"
  Então a resposta deve ter status 200
  E o content-type deve conter "application/json"
  E o corpo deve ser uma lista
  E cada reserva da lista deve ter um bookingid inteiro positivo
  E os identificadores não devem se repetir
```

Uma lista vazia também passa neste teste; ele não exige reservas cadastradas.

### CT02 — Consultar a reserva criada pelo próprio teste

Teste: `consultar uma reserva cadastrada pelo id`

```gherkin
Cenário: Recuperar uma reserva recém-criada
  Dado que envio uma requisição POST para "/booking" com os dados abaixo
    | campo                 | valor      |
    | firstname             | Fernando   |
    | lastname              | Oliveira   |
    | totalprice            | 250        |
    | depositpaid           | true       |
    | bookingdates.checkin  | 2026-08-10 |
    | bookingdates.checkout | 2026-08-15 |
    | additionalneeds       | Breakfast  |
  E a criação retorna status 200 e content-type contendo "application/json"
  Quando consulto "/booking/{bookingid}" usando o ID retornado
  Então a resposta deve ter status 200
  E o content-type deve conter "application/json"
  E o corpo deve ser igual aos dados enviados na criação
```

### CT03 — Verificar a presença dos campos

Teste: `consultar uma reserva cadastrada pelo id validando apenas os campos`

```gherkin
Cenário: Consultar os campos da reserva 695
  Dado que existe uma reserva com ID 695 no Restful Booker
  Quando envio uma requisição GET para "/booking/695"
  Então a resposta deve ter status 200
  E o content-type deve conter "application/json"
  E o corpo deve conter firstname, lastname, totalprice e depositpaid
  E o corpo deve conter bookingdates e additionalneeds
  E bookingdates deve conter checkin e checkout
```

Este teste verifica a presença das propriedades, sem validar seus tipos ou valores.

## Criar reservas

Arquivo: [criar-reserva.spec.js](../tests/criar-reserva.spec.js)

### CT04 — Criar uma reserva para Fernando

Teste: `deve criar uma reserva com dados validos`

```gherkin
Cenário: Criar uma reserva com dados válidos
  Dado que tenho os seguintes dados de reserva
    | campo                 | valor      |
    | firstname             | Fernando   |
    | lastname              | Oliveira   |
    | totalprice            | 250        |
    | depositpaid           | true       |
    | bookingdates.checkin  | 2026-10-10 |
    | bookingdates.checkout | 2026-10-15 |
    | additionalneeds       | Breakfast  |
  Quando envio uma requisição POST para "/booking" com esses dados
  Então a resposta deve ter status 200
  E o content-type deve conter "application/json"
  E bookingid deve ser um número maior que zero
  E booking deve ser igual aos dados enviados
```

### CT05 — Criar uma reserva para Sally

Teste: `deve criar uma reserva para Sally Brown`

```gherkin
Cenário: Criar uma reserva para Sally Brown
  Dado que tenho os seguintes dados de reserva
    | campo                 | valor      |
    | firstname             | Sally      |
    | lastname              | Brown      |
    | totalprice            | 111        |
    | depositpaid           | true       |
    | bookingdates.checkin  | 2013-02-23 |
    | bookingdates.checkout | 2014-10-23 |
    | additionalneeds       | Breakfast  |
  Quando envio uma requisição POST para "/booking" com esses dados
  Então a resposta deve ter status 200
  E o content-type deve conter "application/json"
  E bookingid deve ser um número maior que zero
  E booking deve ser igual aos dados enviados
```

## Consultar produtos

Arquivo: [dummyjson.spec.js](../tests/dummyjson.spec.js)

### CT06 — Consultar o produto 1

Teste: `deve retornar um produto com status 200 e contrato basico`

```gherkin
Cenário: Consultar o contrato básico de um produto
  Dado que o produto de ID 1 está disponível na API DummyJSON
  Quando envio uma requisição GET para "/products/1"
  Então a resposta deve ter status 200
  E o content-type deve conter "application/json"
  E o campo id deve ser 1
  E title, description e category devem ser textos
  E price deve ser um número
```

## Exemplos de consulta de reservas

Arquivo: [example.spec.js](../tests/example.spec.js)

### CT07 — Validar status e formato da resposta

Teste: `deve retornar status 200 e content-type JSON`

```gherkin
Cenário: Verificar o status e o content-type da consulta
  Dado que existe uma reserva com ID 1 no Restful Booker
  Quando envio uma requisição GET para "/booking/1"
  Então a resposta deve ter status 200
  E o content-type deve conter "application/json"
```

Este teste não lê nem valida o corpo JSON.

### CT08 — Validar os tipos dos campos

Teste: `deve retornar uma reserva com o contrato esperado`

```gherkin
Cenário: Verificar o contrato básico da reserva 1
  Dado que existe uma reserva com ID 1 no Restful Booker
  Quando envio uma requisição GET para "/booking/1"
  Então a resposta deve ter status 200
  E o content-type deve conter "application/json"
  E firstname e lastname devem ser textos
  E totalprice deve ser um número
  E depositpaid deve ser um booleano
  E bookingdates deve conter checkin e checkout como textos
```

### CT09 — Validar nomes, preço e formato das datas

Teste: `deve retornar dados validos para nome, preco e datas da reserva`

```gherkin
Cenário: Verificar os dados da reserva 1
  Dado que existe uma reserva com ID 1 no Restful Booker
  Quando envio uma requisição GET para "/booking/1"
  Então a resposta deve ter status 200
  E o content-type deve conter "application/json"
  E firstname e lastname não devem estar vazios após remover espaços das extremidades
  E totalprice deve ser maior ou igual a zero
  E checkin e checkout devem seguir o padrão de quatro dígitos, hífen, dois dígitos, hífen e dois dígitos
```

A expressão regular verifica o formato `AAAA-MM-DD`, mas não garante uma data real nem a ordem entre entrada e saída.

### CT10 — Verificar que a consulta retorna uma lista

Teste: `consultando reservas cadastradas`

```gherkin
Cenário: Consultar a lista de reservas
  Dado que a API Restful Booker está acessível
  Quando envio uma requisição GET para "/booking"
  Então a resposta deve ter status 200
  E o content-type deve conter "application/json"
  E o corpo deve ser uma lista
```

Este cenário aceita uma lista vazia e não verifica os IDs, ao contrário do CT01.

## Limites da cobertura

- Os cenários com IDs fixos dependem de dados existentes na API pública.
- As reservas criadas ainda não são excluídas ao final dos testes.
- Autenticação, PUT, PATCH, DELETE e cenários negativos são próximos estudos, não cobertura implementada.
- Os 10 cenários são repetidos nos três projetos da configuração atual, totalizando 30 execuções no comando padrão.
- Logs e anexos são evidências de execução; não substituem as validações dos cenários.
