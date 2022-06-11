import { useTracker } from 'meteor/react-meteor-data'
import { PagesCollection } from '../api/collections/pages'
import * as React from 'react'
import { Hello } from './Hello'

export const Pages = () => {
    const { pages, user, isLoading } = useTracker(() => {
        const sub = Meteor.subscribe('pages')
        const pages = PagesCollection.find().fetch()
        const user = Meteor.user()
        const isLoading = !sub.ready()
        return { pages, user, isLoading }
    })
    return <div>
        <Hello />
        {isLoading ? <h1>Loading...</h1> : <>{user?.username} {pages.map(pa => <div key={pa._id} id={pa._id}>{pa.text}</div>)}</>}</div>
}


