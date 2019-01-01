import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {bufferCount, map, scan, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private subject: Subject<number>;
  $taps: Observable<number>;

  $bpm;

  ngOnInit() {
    this.reset();
  }

  tap() {
    this.subject.next(new Date().getTime());
  }

  reset() {
    this.subject = new Subject();
    this.$taps = this.subject.asObservable();

    this.$bpm = this.$taps.pipe(bufferCount(2, 1))
                    .pipe(map(val => (val[1] - val[0]) / 1000))
                    .pipe(scan((acc, curr) => acc + curr, 0))
                    .pipe(map((val, index) => {
                      return {
                        value: Math.floor(60 / (val / (index + 1))),
                        ms: Math.floor((val / (index + 1)) * 1000)
                      };
                    }));
  }
}
