import { Repository } from '@data/types';
import { ObjectId } from 'mongodb';

export interface RepositoryDB extends Repository {
  _id?: ObjectId;
}