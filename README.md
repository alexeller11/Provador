# Google Ads Command Center Foundation

Ferramenta interna para agência focada em Google Ads, conectando o seu MCC, puxando contas vinculadas e gerando análises acionáveis com regra + IA.

## O que já vem nesta base

- Login Google OAuth 2.0
- Sessão com Express
- Conexão com Google Ads API via REST
- Listagem de contas acessíveis a partir do OAuth
- Consulta de campanhas
- Consulta de termos de pesquisa
- Análise inicial de desperdício, cobertura e risco
- Geração de payload estruturado para IA
- Interface simples para operar no Railway

## Stack

- Node.js
- Express
- PostgreSQL
- Axios
- Google OAuth 2.0
- Google Ads API REST
- Front-end estático simples

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

- `BASE_URL`
- `SESSION_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `DATABASE_URL`

## Fluxo de autenticação

1. Crie credenciais OAuth 2.0 no Google Cloud
2. Adicione o escopo `https://www.googleapis.com/auth/adwords`
3. Configure o redirect URI para `${BASE_URL}/auth/google/callback`
4. Faça login no app
5. O sistema salva refresh token e access token do usuário
6. A partir disso, lista contas acessíveis e consulta dados via Google Ads API

## Endpoints principais

- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /api/me`
- `GET /api/accounts`
- `GET /api/accounts/:customerId/campaigns`
- `GET /api/accounts/:customerId/search-terms`
- `POST /api/accounts/:customerId/analyze`

## Como subir no Railway

1. Suba o repositório
2. Crie um projeto no Railway
3. Adicione PostgreSQL
4. Configure as variáveis de ambiente
5. Deploy
6. Abra a URL pública
7. Faça login com o Google que tem acesso ao MCC

## Próximos passos recomendados

- sync diário em background
- histórico por conta
- score consolidado por cliente
- análise de anúncios RSA
- análise de assets
- relatório PDF
- camada de IA conectada ao Gemini/Perplexity

## Observação

Esta é uma fundação funcional, não a versão final da Ferrari. Ela foi pensada para te colocar em produção rápido e virar base do produto interno.
