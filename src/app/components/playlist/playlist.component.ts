import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {IState, PlayerService} from "../../services/player/player.service";
import {first} from "rxjs/operators";

const fs = window.nw.require('fs');

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, AfterViewInit {
  title = 'cmod4';

  state$: Observable<IState>;

  @ViewChild('inputLoad') inputLoad: ElementRef;

  loadFileChangeListenerFn;
  loadFileClickListenerFn;

  listOfColumns: any[] = [
    {
      name: 'File'
    },
    {
      name: 'Name',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: any) => list.some(name => item.name.indexOf(name) !== -1)
    },
    {
      name: 'Length'
    },
    {
      name: 'Format'
    }
  ];

  listOfData: any[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  columnDefs = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price'}
  ];

  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
  ];

  constructor(
    private ngZone: NgZone,
    public playerService: PlayerService
  ) {
    this.state$ = this.playerService.stateObs$;
    // this.playerService.stateObs$.subscribe(a => console.log(a));
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.prepareLoadFileListeners();
  }

  selectSong(event: MouseEvent, i) {
    console.log(i, event);
  }



  prepareLoadFileListeners() {
    this.loadFileClickListenerFn = this.loadFileClickListener.bind(this);
    this.inputLoad.nativeElement.addEventListener('click', this.loadFileClickListenerFn);
    this.loadFileChangeListenerFn = this.loadFileChangeListener.bind(this);
    this.inputLoad.nativeElement.addEventListener('change', this.loadFileChangeListenerFn);
  }

  loadFileClickListener(e) {
    this.inputLoad.nativeElement.value = '';
  }

  loadFileChangeListener(e) {
    const files = e.target.value.split(';').sort();
    this.loadFile(files[0]); // Load first file, testing...
  }

  //

  loadFile(filePath: string, andPlay?: boolean) {

    /*const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer'; // make response as ArrayBuffer
    xhr.open('GET', filePath,true);
    xhr.send();
    xhr.onload = (event) => {
      const loadedMod = new Int8Array(xhr.response);
      this.playerService.ready$.subscribe((ready) => {
        if (ready) {
          this.playerService.loadSong(loadedMod);
        }
      });
    }*/

    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      console.log(data);
      const loadedMod = new Int8Array(data);
      this.ngZone.run(() => {
        this.playerService.ready$.pipe(first()).subscribe((ready) => {
          if (ready) {
            this.playerService.loadSong(loadedMod);
            // Here we should wait for the loadSong to complete... we should queue player service requests with an id, etc.
            if (andPlay) {
              this.playerService.play();
            }
          } else {
            console.error('Player service not ready.');
          }
        })
      });
    });
  }

  // Listeners from template

  add(event: MouseEvent) {
    this.inputLoad.nativeElement.click();
  }

  loadAndPlay(event: MouseEvent) {
    this.loadFile('/Users/josep/Projects/cmod4/testing-area/src/radix_-_yuki_satellites.xm', true);
  }

  play(event: MouseEvent) {
    this.playerService.play();
  }

  stop(event: MouseEvent) {
    this.playerService.stop();
  }

}
