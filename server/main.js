import { Meteor } from 'meteor/meteor';
import { PagesCollection } from '/imports/api/collections/pages';
import { LinksCollection } from '/imports/api/collections/links';
import { UserFiles } from '/imports/api/collections/files';
import '/imports/api/methods/pageMethods'
import '/imports/api/methods/blogMethods'
import { BlogCollection } from '../imports/api/collections/blog';
import {LoremIpsum } from 'lorem-ipsum';

const path = require('node:path');




function insertLink({ title, url }) {
  LinksCollection.insert({ title, url, createdAt: new Date() });
}

const SEED_USERNAME = 'boris';
const SEED_PASSWORD = 'lecoqestmort';

Meteor.startup(() => {
  Meteor.publish('files.all', () => 
  UserFiles.find().cursor)
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
    const l = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4
      },
      wordsPerSentence: {
        max: 16,
        min: 4
      }
    })
    const grids = [...Array(12).keys()].map(idx => ({ t: l.generateSentences(4), h: l.generateWords(2), p: l.generateParagraphs(40) }))
    grids.forEach(g => BlogCollection.insert(g))

  }
});

