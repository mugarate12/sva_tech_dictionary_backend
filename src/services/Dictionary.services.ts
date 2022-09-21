import axios from 'axios';

export default class DictionaryServices {
  public async getAllWords() {
    const url = 'https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/master/meta/wordList/english.txt';
  
    const response = await axios.get(url);
    const data: string = response.data;
    const words = data.split('\n');

    return words;
  }


}