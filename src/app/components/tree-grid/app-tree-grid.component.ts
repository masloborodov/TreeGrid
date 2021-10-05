import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SoursDataService } from '../../services/sours-data.service';
import { ICountryTree } from '../../interfaces/sours-data-interfase';
import { Observable } from 'rxjs';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-tree-grid',
  templateUrl: './app-tree-grid.component.html',
  styleUrls: ['./app-tree-grid.component.css'],
})
export class AppTreeGridComponent implements OnInit {
  @ViewChild('treegrid')
  public treeGridObj: TreeGridComponent | undefined;
  public editSettings: Object = {allowEditing: true, allowAdding: true, allowDeleting: true, mode:"Row"};
  public data: Observable<ICountryTree[]> = this.soursData.getData().pipe();
  public contextMenuItems: Object[]  =  [
    {text: 'Font size',
      target: '.e-gridheader',
      id: 'fontSize',
      items: [10, 12, 14, 16].map((item) => ({ text: `${item}px`, id: `fontSize_${item}px` }))
    },
    {
      text: 'Font color',
      target: '.e-gridheader',
      id: 'color',
      items: ['Lightblue', 'Red', 'Green', 'Black'].map((item) => ({ text: item, id: `color_${item}` }))
    },
    {
      text: 'Background color',
      target: '.e-gridheader',
      id: 'backgroundColor_',
      items: ['Lightblue', 'Red', 'Green', 'Black'].map((item) => ({ text: item, id: `backgroundColor_${item}` }))
    },
    {
      text: 'Default',
      target: '.e-gridheader',
      id: 'default',
    }
  ]
  private readonly CONFIGURABLE_PROPS: Record<string, string> = {
    fontSize: '13px',
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'white'
  };
  private contextMenuColindex: number | null = null;

  constructor(
    private soursData: SoursDataService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  get contextMenuCells(): NodeListOf<HTMLElement> {
    return this.document.querySelectorAll(`[aria-colindex="${this.contextMenuColindex}"]:not(th)`);
  }

  private setPropsToContextMenuCells(prop: string, value: string): void {
    // @ts-ignore
    this.contextMenuCells.forEach(item => (item as HTMLElement).style[prop] = value)
  }

  contextMenuClick(args?: MenuEventArgs): void {
    if (!this.treeGridObj || !args?.item?.id) {
      return;
    }


    const { id } = args.item;

    if (id === 'default') {
      Object.entries(this.CONFIGURABLE_PROPS).forEach(([prop, value]) => {
        this.setPropsToContextMenuCells(prop, value);
      })
      return;
    }

    const [type, value] = id.split('_');

    this.setPropsToContextMenuCells(type, value);
  }

  contextMenuOpen(arg?: BeforeOpenCloseEventArgs){
    if(arg){
      const elem: Element = arg.event.target as Element;
      const colindex = elem.closest('.e-headercell')?.getAttribute('aria-colindex')
      if(colindex){
        this.contextMenuColindex = Number(colindex)
      }
    }
  }

  ngOnInit(): void {
  }
}
