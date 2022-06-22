import { useTracker } from "meteor/react-meteor-data";
import * as React from 'react';
import { useEffect } from "react";
import { UserFiles } from "../../api/collections/files";
import { useRemarkMeta2 } from "../metaRemarkHook";
import ReactImageGallery, { ReactImageGalleryItem } from "react-image-gallery";


export const Preview = ({ md, className }: { md: string; className: string; }) => {
    const [reactMetaContent, setMetaRact] = useRemarkMeta2();
    useEffect(() => {
        setMetaRact(md);
    }, [md, setMetaRact]);
    const { ready, fileRefs } = useTracker(() => {
        const fhandle = Meteor.subscribe('files.all');
        const fileRefs = reactMetaContent?.meta?.files
            .map((fid: string) => UserFiles.findOne(fid));
        return { fileRefs, ready: fhandle.ready() };
    });
    console.log(ready);
    const items: ReactImageGalleryItem = fileRefs
        ?.map(fref => fref.link())
        ?.map(url => ({ original: url }));
    return <div className={className}>
        {reactMetaContent?.vdom}
        {ready && <ReactImageGallery items={items} />}
    </div>;
};
