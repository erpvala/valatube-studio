export const pageHead = (title: string, description: string) => () => ({
  meta: [
    { title: `${title} — ValaTube Studio` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — ValaTube Studio` },
    { property: "og:description", content: description },
  ],
});
