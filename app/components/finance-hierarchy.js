// COFOG codes are identifiers, not financial metrics. Compare segment by
// segment so 01.1 precedes 01.3 and 01.7, including combined-code cuts.
export function compareFinanceCodes(left, right) {
  const a = String(left?.code ?? left ?? "");
  const b = String(right?.code ?? right ?? "");
  const aParts = (a.match(/\d+/g) || []).map(Number);
  const bParts = (b.match(/\d+/g) || []).map(Number);
  const count = Math.max(aParts.length, bParts.length);
  for(let i=0;i<count;i++){
    if(i>=aParts.length)return -1;
    if(i>=bParts.length)return 1;
    if(aParts[i]!==bParts[i])return aParts[i]-bParts[i];
  }
  return a.localeCompare(b,"es",{numeric:true});
}
export function sortedFinanceChildren(rows, parentCode, {includeAnalytic=false} = {}) {
  return (rows||[]).filter(row=>row.parent_code===parentCode)
    .filter(row=>includeAnalytic||!row.is_analytic_cut)
    .sort(compareFinanceCodes);
}
