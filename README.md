# @guiibraun/inertia-lgpd

Composables, componentes Vue e tipos TypeScript para implementar consentimento de cookies em aplicações Inertia.js v3.

O pacote é privado no GitHub e foi desenhado para trabalhar com o backend [`guiibraun/laravel-filament-lgpd`](https://github.com/guiibraun/laravel-filament-lgpd), mas pode ser usado com qualquer backend que forneça os mesmos props e endpoint.

## Requisitos

- Vue 3.5 ou superior;
- `@inertiajs/vue3` 3 ou superior;
- uma aplicação Inertia.js v3 com Vite;
- acesso SSH de leitura ao GitHub para `git@github.com:guiibraun/inertia-lgpd.git`.

## Instalação

Este pacote é instalado diretamente do GitHub privado, não do npm registry:

```bash
ssh -T git@github.com
pnpm add "git+ssh://git@github.com/guiibraun/inertia-lgpd.git#v0.1.2"
```

Com npm, use:

```bash
npm install "git+ssh://git@github.com/guiibraun/inertia-lgpd.git#v0.1.2"
```

Em CI ou produção, configure uma chave SSH com permissão de leitura no repositório. O pacote já inclui o diretório compilado `dist`, então não é necessário executar o build para consumi-lo.

## Pré-requisito do backend

Com o backend [`guiibraun/laravel-filament-lgpd`](https://github.com/guiibraun/laravel-filament-lgpd), o provider Laravel compartilha estes props com cada página Inertia:

```ts
type CookiePageProps = {
  cookieBanner: CookieBanner | null;
  cookieConsent: CookieConsent | null;
};
```

O banner possui `id`, `headline`, `body`, `colors`, `categories` e, opcionalmente, `scripts`. Cada categoria possui `slug`, `name`, `description`, `is_required` e suas definições. O consentimento possui `bannerVersionId`, `action` e `choices`.

O endpoint padrão para salvar a preferência é `/cookies/consent`. Se o backend usar outro caminho, informe `consentUrl` no componente ou no composable.

## Uso básico

Monte o banner uma única vez em um layout persistente. O CSS precisa ser importado explicitamente:

```vue
<script setup lang="ts">
import {
  CookieConsentBanner,
  CookieScriptLoader,
  provideCookiePreferences,
} from "@guiibraun/inertia-lgpd";
import "@guiibraun/inertia-lgpd/style.css";

provideCookiePreferences();
</script>

<template>
  <div>
    <slot />

    <CookieConsentBanner
      consent-url="/cookies/consent"
      cookie-policy-url="/cookies"
      :labels="{
        acceptAll: 'Aceitar todos',
        rejectNonEssential: 'Recusar não essenciais',
        manage: 'Gerenciar preferências',
        saveChoices: 'Salvar escolhas',
      }"
    />
    <CookieScriptLoader />
  </div>
</template>
```

O componente lê `cookieBanner` e `cookieConsent` do `usePage()` do Inertia, mantém categorias necessárias sempre ativas e envia as escolhas ao endpoint informado.

O `provideCookiePreferences()` permite que o banner e outros componentes, como `CookiePolicyCatalog`, compartilhem o estado de abertura do painel de preferências.

O `CookieScriptLoader` deve ser montado uma vez em cada layout persistente que possa exibir o banner. Ele observa os props do Inertia e atualiza os scripts quando o consentimento muda.

## Catálogo de cookies

Em uma página que recebe o banner como prop `banner` do controller:

```vue
<script setup lang="ts">
import { CookiePolicyCatalog } from "@guiibraun/inertia-lgpd";
import type { CookieBanner } from "@guiibraun/inertia-lgpd";

defineProps<{
  banner: CookieBanner;
}>();
</script>

<template>
  <CookiePolicyCatalog :banner="banner" />
</template>
```

O controller padrão do pacote Laravel envia esse prop na rota `/cookies`.

## Interface customizada

Use `useCookieConsent()` quando a aplicação já possui seu próprio banner:

```vue
<script setup lang="ts">
import { useCookieConsent } from "@guiibraun/inertia-lgpd";

const {
  banner,
  consent,
  showBar,
  categoryChoices,
  processing,
  openPreferences,
  submit,
  saveCustom,
} = useCookieConsent({
  consentUrl: "/cookies/consent",
});
</script>
```

O composable expõe:

- `submit('accept_all', 'banner')` para aceitar todas as categorias;
- `submit('reject_non_essential', 'banner')` para recusar as categorias não essenciais;
- `saveCustom()` para salvar `categoryChoices`;

Além do composable, o pacote exporta `allowsCookieCategory(category, consent)` para consultar uma preferência e `resolveCookieBannerColors(colors)` para normalizar as cores do banner.

As atualizações são otimistas por padrão e fazem rollback automático quando a visita Inertia falha. Para aguardar a resposta do servidor, use `optimistic: false`.

## Slots e estilos

`CookieConsentBanner` aceita os slots `banner`, `category` e `preferencesFooter`, permitindo substituir partes da interface sem reimplementar a lógica de consentimento.

Os estilos incluídos usam classes com o prefixo `lgpd-cookie-`. Eles são intencionalmente simples para poderem ser sobrescritos pela aplicação. Se a aplicação cria todo o markup, ela pode importar apenas os composables e não usar os componentes prontos.

## Integração com scripts de terceiros

O backend Filament cadastra scripts por categoria e os inclui no snapshot da versão publicada. O `CookieScriptLoader` injeta esses scripts no navegador somente quando a categoria correspondente estiver autorizada:

```vue
<script setup lang="ts">
import {
  CookieConsentBanner,
  CookieScriptLoader,
  provideCookiePreferences,
} from "@guiibraun/inertia-lgpd";

provideCookiePreferences();
</script>

<template>
  <div>
    <slot />
    <CookieConsentBanner />
    <CookieScriptLoader />
  </div>
</template>
```

Cada script tem `category`, `is_required`, `position`, `source_type`, `src` ou `code`. As posições disponíveis são `head`, `body_start` e `body_end`. O loader usa elementos DOM criados via API, não injeta HTML arbitrário nem executa scripts durante o SSR.

Com uma interface própria, monte apenas o loader junto ao composable existente:

```vue
<script setup lang="ts">
import { CookieScriptLoader } from "@guiibraun/inertia-lgpd";
</script>

<template>
  <div>
    <!-- Seu banner usa useCookieConsent() -->
    <CookieScriptLoader />
  </div>
</template>
```

`allowsCookieCategory(category, consent)` permanece disponível para integrações que precisem de comportamento adicional. Ao revogar uma categoria, o loader remove os elementos que ele criou e impede novos carregamentos; ele não consegue desfazer cookies ou efeitos que um provedor já tenha produzido.

## LGPD

O pacote é uma biblioteca de interface e não substitui a definição de finalidade, base legal, retenção, transparência, controles de segurança ou canal do encarregado. Não carregue cookies ou scripts não essenciais antes da autorização aplicável e valide os textos e fluxos com a legislação vigente, orientações da ANPD e assessoria jurídica especializada.

## Desenvolvimento do pacote

```bash
pnpm install
pnpm build
pnpm typecheck
```

O build gera `dist/index.js`, declarações TypeScript e `dist/style.css`.

## Licença

MIT.
