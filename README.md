# Quinta do Cabeço · Alojamento Local em Tavira

Site de uma página, bilingue (PT/EN), com reserva direta. Feito pela BIANES com base no pacote **Reservas Diretas** da proposta «Website para Alojamento Local».

- **Ficheiros:** `index.html` (conteúdo), `styles.css` (aspeto e paleta, no topo), `script.js` (idioma, galeria, calendário, orçamento, formulário).
- **Fotografias:** `images/gallery/<categoria>/`. A lista de categorias e o número de fotografias está em `GALLERY`, no `script.js`.
- **Preços, estadia mínima, limpeza e sinal:** objeto `CONFIG` no topo do `script.js`.
- **Publicação:** GitHub Pages a partir de `main` / raiz → https://qtcabecoavocados.github.io/quintadocabeco/

## O que está incluído (pacote Reservas Diretas)
- Galeria por divisões, com ampliação
- Descrição, quartos e comodidades
- Localização, mapa e pontos de interesse
- Contacto por email e WhatsApp (incluindo botão fixo)
- Botões para o Booking e o Airbnb
- Português e inglês (escolhido automaticamente pelo idioma do browser)
- Calendário de disponibilidade e pedido de reserva com datas e hóspedes
- Orçamento automático e escolha do pagamento do sinal (MB WAY, Multibanco, cartão)
- Termos de reserva e cancelamento, política de privacidade, n.º de RNAL e Livro de Reclamações

## Sincronização com o Booking e o Airbnb
A tarefa automática `.github/workflows/sync-calendars.yml` corre a cada 30 minutos (o GitHub pode atrasar alguns minutos) e:
1. **Importa** os calendários iCal do Booking e do Airbnb e grava os dias ocupados em `data/availability.json`, que o site lê.
2. **Exporta** as reservas diretas para `calendar.ics`, para o Booking e o Airbnb bloquearem essas datas.

Só as datas são copiadas; nomes, telefones e notas das reservas nunca ficam no repositório. Se um calendário falhar, mantêm-se os últimos dados conhecidos.

### Ativar (uma vez)
1. **Booking** → Extranet → Tarifas e disponibilidade → Sincronizar calendários → *Exportar calendário* → copiar a ligação.
2. **Airbnb** → Calendário → Disponibilidade → Sincronizar calendários → *Exportar calendário* → copiar a ligação.
3. No GitHub, em **Settings → Secrets and variables → Actions → New repository secret**, criar:
   - `BOOKING_ICAL_URL` com a ligação do Booking
   - `AIRBNB_ICAL_URL` com a ligação do Airbnb
4. Em **Actions → Sincronizar calendários → Run workflow**, correr uma vez para confirmar.
5. No Booking e no Airbnb, em *Importar calendário*, colar `https://qtcabecoavocados.github.io/quintadocabeco/calendar.ics` (nome: «Site Quinta do Cabeço»).

### Reservas diretas
Enquanto os pagamentos não estão ligados, as reservas feitas pelo site são confirmadas à mão. Para bloquear as datas em todo o lado, acrescentar a reserva a `data/direct-bookings.json` (a data de saída não fica ocupada):

```json
[
  { "start": "2027-07-03", "end": "2027-07-10", "note": "reserva direta 2027-001" }
]
```

O repositório é público: na `note` usar só uma referência, nunca o nome ou os contactos do hóspede.

A sincronização corre sozinha quando este ficheiro muda.

## Dados do alojamento
No topo do `script.js`, no objeto `SITE`, preencher o n.º de RNAL, o email, o WhatsApp e as ligações do Booking e do Airbnb. **O que estiver vazio não aparece no site** e surge sozinho quando for preenchido:
- sem email → a secção de reserva mostra o calendário e o orçamento, com «Reservas diretas brevemente»;
- com email → o formulário aparece e o pedido segue por email, escrito pelo próprio hóspede (até haver pagamento online);
- sem email nem WhatsApp → a secção e o menu «Contacto» ficam escondidos;
- sem ligações do Booking e do Airbnb → os botões das plataformas ficam escondidos;
- sem calendários ligados → o calendário diz que a disponibilidade é indicativa.

## Por ligar / confirmar com o cliente
- **Pagamento online e email de confirmação automático:** por ligar (sugestão: easypay, que faz MB WAY, Multibanco e cartão). O ponto de ligação está assinalado no `script.js` (submissão do `#bookForm`); depois basta pôr `payments: true` em `SITE`.
- **Dados reais:** preencher `SITE` (ver acima), a localização exata no mapa e os preços por mês (`CONFIG.nightly`).
- **Factos a confirmar:** n.º de hóspedes (8), casas de banho (3), piscina, tempos de viagem, regras da casa e política de cancelamento.

## Logótipo e ícone de app
O símbolo junta o arco de uma porta algarvia, o cabeço (a pequena colina que dá nome à quinta) e meio abacate, com o caroço no amarelo das barras da fachada. Os ficheiros estão em `images/brand/`:
- `logo.png` (fundo transparente) e `logo-dark.png` (fundo verde): assinatura completa, para documentos, redes sociais e sinalética;
- `logo-mark.svg`, `logo-mark-light.svg`, `logo-mark-bold.svg`: só o símbolo (o «bold» é para tamanhos muito pequenos);
- `apple-touch-icon.png`, `icon-*.png`, `favicon.*`, `app-icon-1024.png`: ícones.

Para os gerar de novo depois de alterar o desenho: `python scripts/build-brand.py` (precisa do Chrome).

### Pôr no ecrã principal do telemóvel, como uma app
- **iPhone (Safari):** abrir o site → botão **Partilhar** → **Adicionar ao ecrã principal** → **Adicionar**. Abre em ecrã inteiro, sem a barra do Safari, com o nome «Q. do Cabeço».
- **Android (Chrome):** menu ⋮ → **Adicionar ao ecrã principal** (ou **Instalar app**).
