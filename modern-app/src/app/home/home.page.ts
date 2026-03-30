import { Component, OnInit, inject } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  InfiniteScrollCustomEvent, 
  IonList,
  IonItem,
  IonSkeletonText,
  IonAvatar,
  IonAlert,
  IonLabel,
  IonBadge,
  IonLoading,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie';
import { catchError, finalize } from 'rxjs';
import { MovieResult } from '../services/interfaces';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonList,
    IonItem,
    IonLoading,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText,
    IonAvatar,
    IonAlert,
    DatePipe,
    RouterModule,
    IonBadge
  ],
})
export class HomePage implements OnInit{
  private movieService = inject(MovieService);
  private currentPage = 1;
  public error = null;
  public isLoading = true;
  public movies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public dummyArray = new Array(5);

  ngOnInit() {
    this.loadMovies();
  }

  async loadMovies(event?: InfiniteScrollCustomEvent){
    this.error = null;
    
    if (!event) {
      this.isLoading = true;
    }

    // Get the next page of movies from the MovieService
    this.movieService.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }),
      catchError((err: any) => {
        console.log(err);
        this.error = err.error.status_message;
        return [];
      })
    )
    .subscribe({
      next: (res) => {
        console.log(res);
        // Append the results to our movies array
        this.movies.push(...res.results);

        // Resolve the infinite scroll promise to tell Ionic that we are done
        event?.target.complete();

        // Disable the infinite scroll when we reach the end of the list
        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
      },
    });
  }

  // This method is called by the infinite scroll event handler
  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }
}
