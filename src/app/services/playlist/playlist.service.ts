import { Injectable } from '@angular/core';
import { IMetadata } from '../player/player.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  playlist: IMetadata[];

  constructor() { }
}
