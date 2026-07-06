# Callmewine — Pagina prodotto con Shopify Storefront API

Implementazione di una pagina prodotto (PDP) integrata con uno store Shopify di staging.
Il carrello è gestito interamente tramite la **Storefront API**; è inclusa la funzionalità di
**confezione regalo** con messaggio personalizzato.

**Stack tecnologico:** Nuxt 4, Nuxt UI 4 (Tailwind CSS v4), @nuxtjs/shopify per l'integrazione
con la Storefront API, Zod per la validazione del form regalo.

## Avvio del progetto

```bash
pnpm install
pnpm dev
```

La PDP è disponibile all'indirizzo: http://localhost:3000/

La configurazione dell'endpoint Shopify (URL, token di accesso, versione API) è definita in
[`nuxt.config.ts`](nuxt.config.ts) sotto la chiave `shopify`.

Scripts:

```bash
pnpm build      # build di produzione
pnpm preview    # anteprima della build
pnpm lint       # analisi statica del codice
```

## Confezione regalo: soluzione adottata

La confezione regalo viene rappresentata come **[attributi personalizzati di riga del carrello](https://shopify.dev/docs/api/storefront/latest/input-objects/CartLineInput)**
(`attributes` su `CartLineInput`) tramite le mutation Storefront `cartCreate` / `cartLinesAdd`.
Ogni riga regalo include gli attributi: `Confezione regalo: Sì`, `Destinatario`, `Mittente` e `Messaggio`.

Questa soluzione è stata scelta perché gli attributi di riga costituiscono il meccanismo nativo
della Storefront API per associare metadati a un singolo articolo: accompagnano la riga fino al
checkout e all'ordine, non richiedono un prodotto o una variante dedicata né l'Admin API, e
consentono di distinguere nel carrello la stessa bottiglia con e senza confezione regalo (Shopify
unisce le righe solo quando merchandise **e** attributi coincidono).

## Note:

- Tutte le operazioni di scrittura (creazione del carrello, aggiunta, aggiornamento e rimozione
  di righe, gestione dei dati regalo) utilizzano solo mutation della Storefront API gql,
  senza ricorso all'Admin API né a un backend personalizzato.
  Riferimenti: [`app/graphql/cart.ts`](app/graphql/cart.ts) e [`app/composables/use-cart.ts`](app/composables/use-cart.ts).
- Il `cartId` è persistito in un cookie, garantendo la sopravvivenza del carrello al ricaricamento
  della pagina; in caso di scadenza del carrello su Shopify, viene ricreato automaticamente.
- Le query relative al prodotto sono organizzate in [`app/graphql/product.ts`](app/graphql/product.ts).
- Le immagini sono ottimizzate tramite `@nuxt/image` con provider Shopify (`?width=&format=webp&quality=`).

## Localizzazione

I testi statici sono attualmente in italiano e la formattazione della valuta utilizza il locale
`it-IT`. Un'eventuale estensione multilingua e multi-valuta (IT/EN/ES/FR, EUR/GBP) potrebbe
essere realizzata tramite `@nuxtjs/i18n` in combinazione con `@nuxtjs/shopify`, che espone già
le preferenze di lingua e valuta al client Storefront.
