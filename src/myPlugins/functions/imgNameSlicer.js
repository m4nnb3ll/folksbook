export default function imgNameSlicer(string, length=6) {
  return string.replace(/(.+)(\.\w+)$/, (pm, m1, m2) => m1.length > length ? `${m1.slice(0,length)}(...)${m2}` : pm);
}