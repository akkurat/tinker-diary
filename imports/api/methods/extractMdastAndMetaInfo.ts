import { unified } from 'unified';
import remarkParse from 'remark-parse';
import find from 'unist-util-find';
import { toString } from "mdast-util-to-string";
import { findAllAfter } from 'unist-util-find-all-after';

export function getTitle(mdast) {
    let h1 = find(mdast, { type: "heading", depth: 1 });
    return toString(h1 || "(Ohne Titel)");
}
export function getHead(mdast) {
    let h1 = find(mdast, { type: "heading", depth: 2 });
    return toString(h1 || "(Ohne Thema)");
}

export function getFiles(mdast) {
    const result = []
    if(!mdast.children)
    {
        return []
    }
    for( const child of mdast.children)
    {
        if( child?.type == 'image')
        {
            result.push(child.url)
        }
        else {
            result.push(...getFiles(child))
        }

    }
    return result
}

export function extractMdastAndMetaInfo(source: string) {
    const mdast = unified()
        .use(remarkParse)
        .parse(source);

    const meta = { title: getTitle(mdast), head: getHead(mdast), files: getFiles(mdast) };
    return { mdast, meta };
}
