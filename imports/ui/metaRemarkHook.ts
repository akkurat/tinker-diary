import * as React from 'react'
import {
    Fragment,
    ReactElement,
    createElement,
    useState,
    useCallback,
    useRef,
} from 'react';
import { unified } from 'unified';
import remarkToRehype from 'remark-rehype';


import rehypeReact from 'rehype-react';
import { TImage, useOneImage } from './MediaManager';
import { extractMdastAndMetaInfo } from '../api/methods/extractMdastAndMetaInfo';


    type NewType = {
        title: string;
        head: string;
        vdom: ReactElement;
    };
export const useRemarkMeta2: (i?: string) => [a: NewType | null, c: (t: string) => void] = (initial) => {
    const first = useRef(true)

    const [reactContent, setReactContent] = useState<NewType | null>(null);

    const setMarkdownSource = useCallback(async (source: string) => {
        const { mdast, meta } = extractMdastAndMetaInfo(source);

        const parser = unified()
            .use(remarkToRehype)
            .use(rehypeReact, { createElement, Fragment, 
                components: { img: TImage } } )

        const out = parser.stringify(parser.runSync(mdast))

        // setMeta(meta )
        setReactContent({vdom: out as ReactElement, ...meta})
    }, []);
    if( first.current && initial )
    {
        first.current =false;
        setMarkdownSource(initial)
    }

    return [reactContent, setMarkdownSource];
};

