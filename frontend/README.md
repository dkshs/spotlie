# SpotLie - Frontend

Frontend do SpotLie.

## Executar o Frontend

Para executar o projeto você precisa ter o [Git](https://git-scm.com) e o [Node.Js](https://nodejs.org/) instalados na sua maquina. Você também precisará de um editor de código, eu utilizei o [VSCode](https://code.visualstudio.com).

### 1. Configurando o [Clerk](https://clerk.com/)

- Faça login e crie um projeto no [Clerk](https://dashboard.clerk.com/). Recomendo utilizar somente o *"Email address"* e o *"Username"* como algo inicial.

- Na página inicial de seu projeto, aparecerá o ícone do Next.Js, passe o mouse em cima e copie as variáveis, será necessário no [passo 5](#5-variáveis-de-ambiente).

### 2. Clone esse repositório

```bash
git clone https://github.com/ShadowsS01/spotlie.git
```

### 3. Acesse a pasta do projeto

```bash
cd spotlie/frontend
```

### 4. Instalando as dependências

```bash
npm install
```

### 5. Variáveis de ambiente

Copie o arquivo `.env.local.example` neste diretório para `.env.local` *(que será ignorado pelo Git)*:

```bash
cp .env.local.example .env.local
```

Altera as variáveis do [Clerk](https://dashboard.clerk.com/) de acordo com o seu projeto.

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_IMG_DOMAINS=127.0.0.1

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
```

### 6. Execute a Aplicação

```bash
npm run dev
```

- A aplicação será iniciada em: <http://localhost:3000/>.

## Licença

Este projeto esta sob a licença [MIT](../LICENSE).

🔝[Voltar para o topo](#spotlie---frontend)
