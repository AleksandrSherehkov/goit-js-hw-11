import axios from 'axios';

export default class ImageApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHitsApi = '';
    this.receivedHitsApi = 0;
  }

  async getRequest(searchQuery) {
    const URL = 'https://pixabay.com/api/';
    const options = new URLSearchParams({
      key: '28592682-30ff71119c6d581761e4defab',
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: '40',
    });

    const response = await axios.get(`${URL}?${options}`);

    this.setTotalHits(response.data.totalHits);
    this.addHits(response.data.hits);
    this.addPage();

    return response.data.hits;
  }

  setTotalHits(newTotalHits) {
    this.totalHitsApi = newTotalHits;
  }

  addHits(arr) {
    this.receivedHitsApi += arr.length;
  }

  addPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
    this.receivedHitsApi = 0;
  }

  resetTotalHits() {
    this.totalHitsApi = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }
}
