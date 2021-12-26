export default function cleanHtml(string) {
  return string.replace(/<(?!br\/>)[^>]*>/, "");
}