# SpotLie - Backend

Backend do SpotLie.

## Executar o Backend

Para executar o projeto você precisa ter o [Git](https://git-scm.com) e o [Docker](https://www.docker.com/) instalados na sua maquina. Você também precisará de um editor de código, eu utilizei o [VSCode](https://code.visualstudio.com).

### 1. Clone esse repositório

```bash
git clone https://github.com/ShadowsS01/spotlie.git
```

### 2. Acesse a pasta do projeto

```bash
cd spotlie/backend
```

### 3. Variáveis de ambiente

Copie o arquivo `.env.example` neste diretório para `.env` *(que será ignorado pelo Git)*:

```bash
cp .env.example .env
```

Fazendo isso será necessário alterar, caso queira, somente a `SECRET_KEY`.

```env
SECRET_KEY=YOUR_SECRET_KEY
DEBUG=True
ALLOWED_HOSTS=localhost:8000,127.0.0.1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:8000,http://localhost:3000

# URLS
BASE_URL=http://127.0.0.1:8000

# DATABASE PG
DB_PG_NAME=postgres
DB_PG_USER=postgres
DB_PG_PASSWORD=postgresw
DB_PG_HOST=postgres
DB_PG_PORT=5432
```

### 4. Execute a Aplicação

```bash
docker compose up -d
```

*O container quando iniciado, inicia a aplicação Django!*

> ***Os passos abaixo serão necessário somente se você ainda não fez as migrações e a criação de um super user! Caso já tenha feito, a aplicação pode ser acessada em: <http://127.0.0.1:8000/>.***

Será necessário entrar no container via cli:

```bash
docker compose exec -it app zsh
```

Será necessário fazer as migrações:

```bash
python manage.py migrate
```

A criação de um super user:

```bash
python manage.py createsuperuser
```

- A aplicação será iniciada em: <http://127.0.0.1:8000/>.

- Na URL depois do `8000/` dígite `api/docs` ou para acessar a área administrativa `admin/`.

## Licença

Este projeto esta sob a licença [MIT](../LICENSE).

🔝[Voltar para o topo](#spotlie---backend)
