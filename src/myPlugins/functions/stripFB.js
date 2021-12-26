export default function stripFB(string) {
  return string.replace(/Firebase: |\(.+\)\.$/g, "")
}