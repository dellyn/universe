import { Collection } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '@database/connection';

import { PaginationParams, PaginatedResponse } from '@libraries/interfaces/pagination';
import { RepositoryDB } from './types';

enum SORT_ORDER {
  ASC = 1,
  DESC = -1
} 

function getRepositoryCollection(): Collection<RepositoryDB> {
  return getDB().collection<RepositoryDB>('repositories');
}

export const RepositoryModel = {
  findById: async (id: string): Promise<RepositoryDB | null> => {
    const collection = getRepositoryCollection();
    return await collection.findOne({ id });
  },

  findByUserIdAndRepoPath: async (userId: string, owner: string, name: string): Promise<RepositoryDB | null> => {
    const collection = getRepositoryCollection();
    return await collection.findOne({ userId, owner, name });
  },

  findByUserId: async (userId: string, pagination?: PaginationParams): Promise<RepositoryDB[]> => {
    const collection = getRepositoryCollection();
    
    if (!pagination) {
      return await collection.find({ userId }).toArray();
    }
    
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    
    return await collection
      .find({ userId })
      .sort({ createdAt: SORT_ORDER.DESC })
      .skip(skip)
      .limit(limit)
      .toArray();
  },
  
  countByUserId: async (userId: string): Promise<number> => {
    const collection = getRepositoryCollection();
    return await collection.countDocuments({ userId });
  },
  
  getPaginatedByUserId: async (userId: string, { page = 1, limit = 10 }: PaginationParams): Promise<PaginatedResponse<RepositoryDB>> => {
    const [repositories, totalItems] = await Promise.all([
      RepositoryModel.findByUserId(userId, { page, limit }),
      RepositoryModel.countByUserId(userId)
    ]);
    
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      data: repositories,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    };
  },

  create: async (data: Omit<RepositoryDB, 'id' | 'updatedAt' | 'addedAt'>): Promise<RepositoryDB> => {
    const collection = getRepositoryCollection();
    const now = Date.now();
    
    const repository: RepositoryDB = {
      ...data,
      id: uuidv4(),
      addedAt: now,
      updatedAt: undefined
    };
    
    await collection.insertOne(repository);
    return repository;
  },

  update: async (id: string, data: Partial<RepositoryDB>): Promise<RepositoryDB | null> => {
    const collection = getRepositoryCollection();
    const updateData = {
      ...data,
      updatedAt: Date.now()
    };
    
    await collection.updateOne(
      { id },
      { $set: updateData }
    );
    
    return await RepositoryModel.findById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    const collection = getRepositoryCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount === 1;
  }
}; 