import {API_KEY} from '../utils';
import {API} from './api';

export const searchMovie = (page, query) => {
  const url = '/search/movie';
  return API.get(url, {params: {page, api_key: API_KEY, query}});
};

export const getDetail = id => {
  const url = `movie/${id}`;
  return API.get(url, {params: {api_key: API_KEY}});
};

export const getMedia = id => {
  const url = `movie/${id}/images`;
  return API.get(url, {params: {api_key: API_KEY}});
};

export const getSimilarMovie = (id, page) => {
  const url = `movie/${id}/similar`;
  return API.get(url, {params: {api_key: API_KEY, page}});
};
