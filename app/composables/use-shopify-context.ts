import type { Money } from "~/types/product";

interface LocaleCtx {
	language: string;
	country: string;
	intlLocale: string;
}

const LOCALE_MAP: Record<string, LocaleCtx> = {
	it: { language: "IT", country: "IT", intlLocale: "it-IT" },
	en: { language: "EN", country: "GB", intlLocale: "en-GB" },
	es: { language: "ES", country: "ES", intlLocale: "es-ES" },
	fr: { language: "FR", country: "FR", intlLocale: "fr-FR" },
};

export function useShopifyContext() {
	const { locale } = useI18n();

	const ctx = computed<LocaleCtx>(
		() => LOCALE_MAP[locale.value] ?? LOCALE_MAP.it!,
	);

	const language = computed(() => ctx.value.language);
	const country = computed(() => ctx.value.country);

	/**
	 * Locale-aware money formatter. Reactive: re-evaluates when locale changes.
	 * Call directly in templates — Vue tracks the `ctx` computed dependency automatically.
	 */
	function $money(value: Money | number | string, currencyCode = "EUR") {
		return formatMoney(value, currencyCode, ctx.value.intlLocale);
	}

	return { language, country, $money };
}
