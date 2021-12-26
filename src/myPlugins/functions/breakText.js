export default function breakText(string) {
  return string.replace(/(\r?\n|\r|\n)/g, "<br/>");
}