import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = environment.apiKey;


@Injectable({
  providedIn: 'root',
})

export class Movie {
  private http = inject(HttpClient);

  constructor() {}

  getTopRatedMovies(page = 1) {

  }
  
  getMovieDetails(id: string) {

  }

}
