import { Request, Response } from 'express';
import mongoose, { QueryOptions, ObjectId } from 'mongoose';

import {
  DictionaryModel
} from './../database';

export default class DictionaryController {
  public async index (req: Request, res: Response) {
    let { search, cursor, limit } = req.query as { search?: string, cursor?: string, limit?: number };

    let filter: QueryOptions = {};
    let previousFilter: QueryOptions = {};
    limit = !!limit ? limit : 5;
    
    // filter by word
    if (search) filter = {
      ...filter, 
      ...{ word: { $regex: `^${search}+`, $options: 'gmi' }}
    };
    
    if (search) previousFilter = {
      ...previousFilter, 
      ...{ word: { $regex: `^${search}+`, $options: 'gmi' }}
    };

    // filter by cursor
    if (cursor) filter = {
      ...filter,
      ...{ _id: { $gt: cursor } }
    };

    let totalOfDocuments: number = 0;
    let firstDocument: (mongoose.Document<unknown, any, {
      word: string;
    }> & {
        word: string;
    } & {
        _id: mongoose.Types.ObjectId;
    }) | null = null;
    let lastDocument: (mongoose.Document<unknown, any, {
      word: string;
    }> & {
        word: string;
    } & {
        _id: mongoose.Types.ObjectId;
    }) | null = null;
    let words: (mongoose.Document<unknown, any, {
      word: string;
    }> & {
        word: string;
    } & {
        _id: mongoose.Types.ObjectId;
    })[] = [];

    await Promise.all([
      totalOfDocuments = await DictionaryModel.countDocuments(filter),
      firstDocument = await DictionaryModel.findOne(filter),
      lastDocument = await DictionaryModel.findOne(filter).sort({ _id: -1 }),
      words = await DictionaryModel
        .find(filter)
        .limit(limit) // limit the number of documents
        .sort({ word: 'asc' }),
    ]);

    const haveDocumentsInSearch = words.length > 0;
    const isNotLastDocumentInFilteredSearch = words[words.length - 1]._id !== lastDocument?._id;
    const hasPrev = !!cursor && !!firstDocument && cursor !== String(firstDocument._id);
    const hasNext = haveDocumentsInSearch && isNotLastDocumentInFilteredSearch;
    const previous = hasPrev ?
      await DictionaryModel
        .findOne({
          ...previousFilter,
          ...{ _id: { $lt: cursor } }
        })
        .limit(limit)
        .sort({ _id: -1 }) :
      null;
      
    return res.status(200).json({
      results: words.map(word => word.word), // return only the word in Array<string>
      totalDocs: totalOfDocuments,
      next: haveDocumentsInSearch && isNotLastDocumentInFilteredSearch ? 
      words[words.length - 1]._id :
      null,
      previous: previous ? previous?._id : null,
      hasNext,
      hasPrev: hasPrev,
    });
  }
}