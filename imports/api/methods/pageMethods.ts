import { check } from "meteor/check"
import { PagesCollection } from "../collections/pages";

Meteor.methods({
    'pages.insert'(text) {
        check(text, String)
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
          }
        PagesCollection.insert({text})
    }
})

Meteor.publish('pages', () => PagesCollection.find())
