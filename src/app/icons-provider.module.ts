import { NgModule } from '@angular/core';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline,
  DownloadOutline,
  FolderOpenOutline,
  PlayCircleOutline,
  PlaySquareOutline,
  PauseCircleOutline,
  CaretRightOutline,
  PauseOutline,
  BorderOutline
} from '@ant-design/icons-angular/icons';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  FormOutline,
  DownloadOutline, //
  FolderOpenOutline,
  PlayCircleOutline,
  PlaySquareOutline,
  PauseCircleOutline,
  CaretRightOutline,
  PauseOutline,
  BorderOutline
];

@NgModule({
  imports: [NzIconModule],
  exports: [NzIconModule],
  providers: [
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class IconsProviderModule {
}
