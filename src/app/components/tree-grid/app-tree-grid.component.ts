import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
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
export class AppTreeGridComponent {
  @ViewChild('treegrid')
  public treeGridObj: TreeGridComponent | undefined;
  public readonly editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Cell' };


  public readonly data$: Observable<ICountryTree[]> = this.usersService.getAll();
  public readonly contextMenuItems: Object[]  =  [
    'Delete',
    { text: 'Font size',
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
      id: 'backgroundColor',
      items: ['Lightblue', 'Red', 'Green', 'Black'].map((item) => ({ text: item, id: `backgroundColor_${item}` }))
    },
    {
      text: 'Alignment',
      target: '.e-gridheader',
      id: 'text-align',
      items: ['Left', 'Right', 'Center'].map((item) => ({ text: item, id: `text-align_${item}` }))
    },
    {
      text: 'Text wrap',
      target: '.e-gridheader',
      id: 'overflowWrap',
      items: ['normal', 'break-word', 'anywhere'].map((item) => ({ text: item, id: `overflowWrap_${item}` }))
    },
    {
      text: 'Min width',
      target: '.e-gridheader',
      id: 'minWidth',
      items: [50, 100, 150, 200].map((item) => ({ text: item, id: `minWidth_${item}` }))
    },
    {
      text: 'Default',
      target: '.e-gridheader',
      id: 'default',
    },
    { text: 'Freeze/unfreeze',
      target: '.e-gridheader',
      id: 'freezing',
    }
  ];

  public minWidths: Record<string, number> = {};
  private readonly CONFIGURABLE_PROPS: string[] = [
    'fontSize', 'color', 'backgroundColor', 'textAlign', 'overflowWrap', 'minWidth'
  ];
  private contextMenuColindex: number | null = null;

  frozenColumns: number = 0;

  constructor(
    private usersService: UsersService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  get contextMenuCells(): NodeListOf<HTMLElement> {
    return this.document.querySelectorAll(`[aria-colindex="${this.contextMenuColindex}"]:not(th)`);
  }

  private setPropsToContextMenuCells(prop: string, value: string | null): void {
    const idx = this.contextMenuColindex;

    if (prop === 'minWidth' && idx) {
      value
        ? this.minWidths = { ...this.minWidths, [idx]: value }
        : delete this.minWidths[idx];
    }
    // @ts-ignore
    this.contextMenuCells.forEach(item => (item as HTMLElement).style[prop] = value)
  }

  contextMenuClick(args?: MenuEventArgs): void {
    if (!this.treeGridObj || !args?.item?.id) {
      return;
    }


    const { id } = args.item;

    if (id === 'freezing') {
      const newFrozenColumns = (this.contextMenuColindex || 0) + 1;
      this.frozenColumns = newFrozenColumns === this.frozenColumns ? 0 : newFrozenColumns;
      return;
    }

    if (id === 'default') {
      this.CONFIGURABLE_PROPS.forEach((prop) => {
        this.setPropsToContextMenuCells(prop, null);
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

  onActionComplete(event: any) {
    const { type, requestType, data } = event;

    if (requestType === 'delete') {
      const { _id } = data[0];
      const { country } = data[0].parentItem;

      this.usersService.delete(_id, country).subscribe();
    } else if (type === 'save') {
      const { _id } = data;
      const { country } = data.parentItem;
      const { field } = event.column;

      this.usersService.update(_id, country, { [field]: data[field] }).subscribe();
    }
  }
}
