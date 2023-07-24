declare module '*.html' {
  const content: string;
  export default content;
}
declare module '*?raw' {
  const s: string;
  export default s;
}
