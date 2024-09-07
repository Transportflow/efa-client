export function formatDateToParams(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are zero-based
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const MM = String(date.getMinutes()).padStart(2, "0");

  return {
    itdDate: `${yyyy}${mm}${dd}`,
    itdTime: `${HH}${MM}`,
  };
}
