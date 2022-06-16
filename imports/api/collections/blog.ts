import { LoremIpsum } from 'lorem-ipsum';
import { Mongo } from 'meteor/mongo';

export class Blog {
    _id: string
    markdown: string
    title: string
}

export const BlogCollection = new Mongo.Collection('blogs');

