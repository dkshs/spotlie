# SpotLie - Frontend

Frontend do SpotLie

## Executar o Frontend

Para executar o projeto você precisa ter o [Git](https://git-scm.com) e o [Node.Js](https://nodejs.org/) instalados na sua maquina. Você também precisará de um editor de código, eu utilizei o [VSCode](https://code.visualstudio.com).

### 1. Clone esse repositório

```bash
git clone https://github.com/ShadowsS01/spotlie.git
```

### 2. Acesse a pasta do projeto

```bash
cd spotlie/frontend
```

### 3. Instalando as dependências

```bash
npm install
```

### 4. Variáveis de ambiente

Copie o arquivo `.env.local.example` neste diretório para `.env.local` *(que será ignorado pelo Git)*:

```bash
cp .env.local.example .env.local
```

Fazendo isso não será necessário a alteração das variáveis!

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_IMG_DOMAINS=127.0.0.1
```

### 5. Execute a Aplicação

```bash
npm run dev
```

- A aplicação será iniciada em: <http://localhost:3000/>.

## Licença

Este projeto esta sob a licença [MIT](../LICENSE).

🔝[Voltar para o topo](#spotlie---frontend)
