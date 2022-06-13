import { unified } from 'unified';
import remarkParse from 'remark-parse';
import find from 'unist-util-find';
import { toString } from "mdast-util-to-string";

export function getTitle(mdast) {
    let h1 = find(mdast, { type: "heading", depth: 1 });
    return toString(h1 || "(Ohne Titel)");
}
export function getHead(mdast) {
    let h1 = find(mdast, { type: "heading", depth: 2 });
    return toString(h1 || "(Ohne Thema)");
}

export function extractMdastAndMetaInfo(source: string) {
    const mdast = unified()
        .use(remarkParse)
        .parse(source);

    const meta = { title: getTitle(mdast), head: getHead(mdast) };
    return { mdast, meta };
}
