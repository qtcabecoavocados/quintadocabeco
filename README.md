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

## Por ligar / confirmar com o cliente
- **Sincronização iCal com o Booking e o Airbnb:** o calendário usa datas ocupadas de demonstração (`CONFIG.demoBusy`).
- **Pagamentos e email de confirmação:** o formulário mostra a confirmação mas ainda não envia nada; o ponto de ligação está assinalado no `script.js` (submissão do `#bookForm`). Precisa de um serviço de pagamentos (ex.: easypay, ifthenpay ou Stripe) e de um pequeno servidor ou função.
- **Dados reais:** n.º de RNAL (`000000/AL`), número de WhatsApp (`351900000000`), email (`hello@quintadocabeco.com`), ligações do Booking e do Airbnb (`href="#"`), localização exata no mapa, preços por mês.
- **Factos a confirmar:** n.º de hóspedes (8), casas de banho (3), piscina, tempos de viagem, regras da casa e política de cancelamento.
