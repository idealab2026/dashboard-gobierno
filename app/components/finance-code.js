/**
 * CSV typed:true turns COFOG 01.3 into 1.3 and COFOG 04 into 4.
 * Codes are identifiers, not quantities. Restore the official two-digit
 * division without modifying S.13/SEC, taxation or analytical branch IDs.
 */
export function canonicalFinanceCode(value) {
  const raw = value == null ? "" : String(value).trim();
  return /^[1-9](?:\.\d+)?$/.test(raw) ? "0" + raw : raw;
}
