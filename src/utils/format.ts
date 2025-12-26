import type { Currency, Lang } from "../utils/settings";

export function formatMoney(
  value: number,
  lang: Lang,
  currency: Currency
) {
  const locale =
    lang === "ru" ? "ru-RU" :
    lang === "az" ? "az-AZ" :
    "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}
