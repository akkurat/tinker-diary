import { Meteor } from 'meteor/meteor';
import { PagesCollection } from '/imports/api/collections/pages';
import { LinksCollection } from '/imports/api/collections/links';
import '/imports/api/methods/pageMethods'
import '/imports/api/methods/blogMethods'
import '/imports/api/methods/fileMethods'

import { BlogCollection } from '../imports/api/collections/blog';

const path = require('node:path');




function insertLink({ title, url }) {
  LinksCollection.insert({ title, url, createdAt: new Date() });
}

const SEED_USERNAME = 'boris';
const SEED_PASSWORD = 'lecoqestmort';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
  // If the Links collection is empty, add some data.
  if (LinksCollection.find().count() === 0) {
    insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app'
    });

    insertLink({
      title: 'Follow the Guide',
      url: 'http://guide.meteor.com'
    });

    insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com'
    });

    insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com'
    });
  }

  const insertPage = taskText => PagesCollection.insert({ text: taskText });
  if (PagesCollection.find().count() === 0) {
    [
      'First Page',
      'Second Page',
      'Third Page',
      'Fourth Page',
      'Fifth Page',
      'Sixth Page',
      'Seventh Page'
    ].forEach(insertPage)
  }

  if (BlogCollection.find().count() === 0) {
    const grids = [...Array(12).keys()]
    .forEach(idx => Meteor.call('blog.add'))
  }

});

