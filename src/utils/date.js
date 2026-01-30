export const formatTimestamp = (ts) => {
  if (!ts) return "-";

  const time = Number(ts);

  const d = new Date(time);

  const pad = (n) => String(n).padStart(2, "0");

  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ` + `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
