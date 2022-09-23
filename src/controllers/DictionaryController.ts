import { Request, Response } from 'express';
import mongoose, { QueryOptions, ObjectId } from 'mongoose';
import axios from 'axios';

import {
  DictionaryModel,
  FavoriteModel,
  HistoryModel
} from './../database';
import {
  usersService
} from './../services';

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
    const isNotLastDocumentInFilteredSearch = haveDocumentsInSearch ? words[words.length - 1]._id.toString() !== lastDocument?._id.toString() : false;
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

  public async get (req: Request, res: Response) {
    const { word } = req.params;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    const userID = String(usersService.getUserID(res));

    return await axios.get<Array<{
      word: string;
      phonetic: string;
      phonetics: Array<{
        text: string,
        audio?: string
      }>;
      origin?: string;
      meanings: Array<{
        partOfSpeech: string,
        definitions: Array<{
          definition: string,
          synonyms: Array<string>,
          antonyms: Array<string>,
          example?: string
        }>,
        synonyms: Array<string>;
        antonyms: Array<string>;
      }>;
      license: {
        name: string,
        url: string
      };
      sourceUrls: Array<string>;
    }>>(url)
      .then(response => response.data)
      .then(async data => {
        // save word in history
        const getHistory = await HistoryModel.findOne({ word, userID });
        
        if (!getHistory) {
          const history = new HistoryModel({ word, userID });
          await history.save()
            .catch(error => {
              // console.log(error);
              throw new Error('Error saving word in history');
            });
        } else {
          await HistoryModel.updateOne({ word, userID }, { createdAt: Date.now() })
            .catch(error => {
              console.log(error);
              throw new Error('Error updating word in history');
            });
        }
        
        return data;
      })
      .then(data => {
        return res.status(200).json(data);
      })
      .catch(error => {
        return res.status(400).json({ message: 'Palavra não encontrada ou requisição não concluída com sucesso! Tente novamente ou verifique que palavra gostaria de pesquisar.' });
      });
  }

  public async favorite (req: Request, res: Response) {
    const { word } = req.params;
    const userID = String(usersService.getUserID(res));

    const getFavorite = await FavoriteModel.findOne({ word, userID });

    if (!getFavorite) {
      const favorite = new FavoriteModel({ word, userID });
      return await favorite.save()
        .then(() => {
          return res.status(200).json({ message: 'Palavra adicionada aos favoritos com sucesso!' });
        })
        .catch(error => {
          // console.log(error);
          return res.status(400).json({ message: 'Erro ao salvar palavra como favorita!' });
        });
    } else {
      return res.status(400).json({ message: 'Palavra já está salva como favorita!' });
    }
  }

  public async unfavorite (req: Request, res: Response) {
    const { word } = req.params;
    const userID = String(usersService.getUserID(res));

    return await FavoriteModel.deleteOne({ word, userID })
      .then(() => {
        return res.status(200).json({ message: 'Palavra removida dos favoritos!' });
      })
      .catch(error => {
        // console.log(error);
        return res.status(400).json({ message: 'Erro ao remover palavra dos favoritos!' });
      });
  }
}