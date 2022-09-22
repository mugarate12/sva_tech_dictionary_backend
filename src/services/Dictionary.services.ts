import axios from 'axios';

import {
  DictionaryModel
} from './../database';

export default class DictionaryServices {
  public async getAllWords() {
    const url = 'https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/master/meta/wordList/english.txt';
  
    const response = await axios.get(url);
    const data: string = response.data;
    const words = data.split('\n');

    return words;
  }

  public async getLikeAWord(word: string) {
    const words = await DictionaryModel
      .find({ word: { $regex: word, $options: 'i' } })
      .transform(docs => docs.map(doc => doc.word));

    return words;
  }
}