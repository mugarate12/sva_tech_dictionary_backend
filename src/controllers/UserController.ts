import { Request, Response } from 'express';
import { QueryOptions, Document, Types } from 'mongoose';

import {
  UserModel,
  FavoriteModel,
  HistoryModel
} from './../database';
import {
  usersService
} from './../services';

export default class UserController {
  public async perfil (req: Request, res: Response) {
    const userID = String(usersService.getUserID(res));

    const user = await UserModel
      .findOne({ id: userID })
      .select({ id: 1, name: 1, email: 1});
    if (!user) {
      return res.status(400).json({ message: 'Usuário nâo encontrado!' });
    } else {
      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    }    
  }

  public async history (req: Request, res: Response) {
    const userID = String(usersService.getUserID(res));
    let { search, cursor, limit } = req.query as { search?: string, cursor?: string, limit?: number };

    let filter: QueryOptions = { userID: userID };
    let previousFilter: QueryOptions = { userID: userID };
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
    }

    let firstDocument: (Document<unknown, any, {
      word: string;
      userID: string;
      createdAt: Date;
    }> & {
      word: string;
      userID: string;
      createdAt: Date;
    } & {
      _id: Types.ObjectId;
    }) | null  = null;
    let lastDocument: (Document<unknown, any, {
      word: string;
      userID: string;
      createdAt: Date;
    }> & {
        word: string;
        userID: string;
        createdAt: Date;
    } & {
      _id: Types.ObjectId;
    }) | null = null;
    let totalOfDocuments: number = 0;
    let words: (Document<unknown, any, {
      word: string;
      userID: string;
      createdAt: Date;
    }> & {
      word: string;
      userID: string;
      createdAt: Date;
    } & {
      _id: Types.ObjectId;
    })[]

    await Promise.all([
      words = await HistoryModel
        .find(filter)
        .limit(limit) // limit the number of documents
        .sort({ word: 'asc' }),
      firstDocument = await HistoryModel
        .findOne(filter)
        .limit(limit)
        .sort({ word: 'asc' }),
      lastDocument = await HistoryModel
        .findOne(filter)
        .sort({ _id: -1, word: 'asc' }),
      totalOfDocuments = await HistoryModel
        .countDocuments(filter)
    ]);

    const haveDocumentsInSearch = words.length > 0;
    const isNotLastDocumentInFilteredSearch = words[words.length - 1]._id.toString() !== lastDocument?._id.toString();
    const hasPrev = !!cursor && !!firstDocument && cursor !== String(firstDocument._id);
    const hasNext = haveDocumentsInSearch && isNotLastDocumentInFilteredSearch;
    const previous = hasPrev ?
      await HistoryModel
        .findOne({
          ...previousFilter,
          ...{ _id: { $lt: cursor } }
        })
        .limit(limit)
        .sort({ _id: -1, word: 'asc' }) :
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