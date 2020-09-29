# Cliente SUAP Javascript

## Sobre

O **Cliente SUAP Javascript** implementa a integração com o SUAP, tendo 2 principais funcionalidades:

- Logar com SUAP via OAuth2

- Consumir API (via OAuth2) obtendo recursos em nome do usuário

## QuickStart

### Crie sua Aplicação no SUAP

Crie sua aplicação em https://suap.ifrn.edu.br/api/ com as seguintes informações:

- **Client Type:** Public

- **Authorization Grant Type:** Implicit

- **Redicert URIs**: http://localhost:5000/
  > Usaremos a URI com a porta padrão do serviço que irá rodar o projeto. Caso haja necessidade, troque-a de acordo com o serviço a ser devidamente usado.

## Começando...

Essas instruções fornecerão uma cópia do projeto em execução na sua máquina local para fins de desenvolvimento e teste.

### Pré-requisitos

O que você precisa para instalar o software:

```
npm
git
```

### Instalando o projeto

Clonando o projeto:

```bash
git clone https://github.com/ifrn-oficial/cliente_suap_javascript.git
```

Navegando até a pasta do projeto:

```bash
cd cliente_suap_javascript
```

Alterando o arquivo de exemplo de configurações para uso na aplicação:

```bash
cp settings.sample.js settings.js
```

Faça os ajustes necessários, definindo a variável **CLIENT_ID**.

```js
var CLIENT_ID = "SEU_CLIENT_ID_AQUI";
var REDIRECT_URI = "http://localhost:5000/";
var SUAP_URL = "https://suap.ifrn.edu.br";
```

É necessário rodar a aplicação cliente num servidor local (usamos o npx serve):

```bash
npx serve
```

Abra seu browser em http://localhost:5000/ para ver o resultado.

## Como contribuir

- Faça um fork desse repositório;

- Crie uma branch com a sua feature: `git checkout -b minha-feature`;

- Faça commit das suas alterações: `git commit -m 'feat: Minha nova feature'`;

- Faça push para a sua branch: `git push origin minha-feature`.

Depois que o merge da sua pull request for feito, você pode deletar a sua branch.
