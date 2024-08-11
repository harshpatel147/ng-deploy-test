import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, filter, first, interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-deploy-test';

  constructor(
    private appRef: ApplicationRef,
    private swUpdate: SwUpdate
  ) {

  }

  ngOnInit(): void {
    this.swUpdate.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({
        type: 'UPDATE_AVAILABLE',
        current: evt.currentVersion,
        available: evt.latestVersion,
      }))
    ).subscribe((evt) => {
      console.warn(evt);
      if (confirm("New Version is available, wish to apply new version?")) {
        window.location.reload();
      }
    });

    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const everyTenSeconds$ = interval(120 * 1000); // 2 minutes in miliseconds
    const everyTenSecondsOnceAppIsStable = concat(appIsStable$, everyTenSeconds$);

    everyTenSecondsOnceAppIsStable.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        console.log(updateFound ? "A new Version is available." : "Already on the latest version.")
      } catch (err){
        console.error('Failed to check for updates', err);
      }
    });
  }
}
