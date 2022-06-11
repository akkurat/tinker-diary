
import {
    Fragment,
    ReactElement,
    createElement,
    useState,
    useCallback,
} from 'react';
import { unified } from 'unified';
import remarkToRehype from 'remark-rehype';


import remarkParse from 'remark-parse';
import rehypeReact from 'rehype-react';
import find from 'unist-util-find';
import { toString } from "mdast-util-to-string";


function getTitle(mdast) {
    let h1 = find(mdast, { type: "heading", depth: 1 });
    return toString(h1 || "(Ohne Titel)");
}

export const useRemarkMeta: () => [a: ReactElement | null, b: string, c: (t: string) => void] = () => {
    const [reactContent, setReactContent] = useState<ReactElement | null>(null);
    const [meta, setMeta] = useState('');

    const setMarkdownSource = useCallback(async (source: string) => {
        const vfile = await unified()
            .use(remarkParse)
            .use(() => tree => setMeta(getTitle(tree)))
            .use(remarkToRehype)
            .use(rehypeReact, { createElement, Fragment })
            .process(source)

        setReactContent(vfile.result as ReactElement)
    }, []);

    return [reactContent, meta, setMarkdownSource];
};

export const useRemarkMeta2: () => [a: ReactElement | null, b: string, c: (t: string) => void] = () => {
    const [reactContent, setReactContent] = useState<ReactElement | null>(null);
    const [meta, setMeta] = useState('');

    const setMarkdownSource = useCallback(async (source: string) => {
        const mdast = unified()
            .use(remarkParse)
            .parse(source)

        setMeta(getTitle(mdast))

        const parser = unified()
            .use(remarkToRehype)
            .use(rehypeReact, { createElement, Fragment })

        const out = parser.stringify(parser.runSync(mdast))

        setReactContent(out as ReactElement)
    }, []);

    return [reactContent, meta, setMarkdownSource];
};