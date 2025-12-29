export function formatMoney(
  value: number,
  currency: string = "AZN",
  lang: string = "ru"
) {
  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}
