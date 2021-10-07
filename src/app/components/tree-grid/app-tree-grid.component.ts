import { Component, Inject, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ICountryTree } from '../../interfaces/sours-data-interfase';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import {
  EditSettingsModel,
  SelectionSettingsModel,
  TreeGridComponent
} from '@syncfusion/ej2-angular-treegrid';
import { DOCUMENT } from '@angular/common';
import { take } from 'rxjs/operators';

type PasteMode = 'copy' | 'cut' | null;

@Component({
  selector: 'app-tree-grid',
  templateUrl: './app-tree-grid.component.html',
  styleUrls: ['./app-tree-grid.component.css'],
})
export class AppTreeGridComponent {

  @ViewChild('treegrid')
  public treeGridObj: TreeGridComponent | undefined;
  public readonly editSettings: EditSettingsModel  = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Cell'
  };
  public readonly selectionSetting: SelectionSettingsModel = { type: 'Multiple', mode: 'Row' };
  public data: ICountryTree[] | null = [];
  public readonly contextMenuItems: Object[]  =  [
    'AddRow',
    'Edit',
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
    },
    { text: 'Copy',
      target: '.e-content',
      id: 'copy',
    },
    { text: 'Cut',
      target: '.e-content',
      id: 'cut',
    },
    { text: 'Paste',
      target: '.e-content',
      id: 'paste',
      items: [
        {
          text: 'Above',
          id: 'paste_above',
        },
        {
          text: 'Below',
          id: 'paste_below',
        }
      ]
    }
  ];
  public columns: Record<string, any>[] = [
    { field: 'country', text: 'Country' },
    { field: 'firstName', text: 'First Name' },
    { field: 'lastName', text: 'Last Name' },
    { field: 'gender', text: 'Gender' },
    { field: 'age', text: 'Age' },
    { field: 'email', text: 'Email' }
  ];
  public minWidths: Record<string, number> = {};
  public hiddenColumns: string[] = [];
  public frozenColumns: number = 0;

  private readonly CONFIGURABLE_PROPS: string[] = [
    'fontSize', 'color', 'backgroundColor', 'textAlign', 'overflowWrap', 'minWidth'
  ];
  private contextMenuColindex: number | null = null;
  private contextMenuRowIndex: number | null = null;
  private itemsToPast: any[] = []
  private pasteMode: PasteMode = null;

  constructor(
    private usersService: UsersService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.usersService.getAll().pipe(
      take(1),
    ).subscribe((data) => this.data = data);
  }

  get contextMenuCells(): NodeListOf<HTMLElement> {
    return this.document.querySelectorAll(`[aria-colindex="${this.contextMenuColindex}"]:not(th)`);
  }

  toggleColVisibility(col: string): void {
    if (this.isColHidden(col)) {
      this.treeGridObj?.showColumns(col);
      this.hiddenColumns = this.hiddenColumns.filter((item) => {
        return item !== col;
      });
    } else {
      this.treeGridObj?.hideColumns(col);
      this.hiddenColumns = [...this.hiddenColumns, col];
    }
  }

  isColHidden(col: string): boolean {
    return this.hiddenColumns.includes(col);
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

  private toggleRowToPasteCls(flag: boolean): void {
    if (flag) {
      this.toggleRowToPasteCls(false);
    }
    const cls = 'row-to-paste';
    const selectorPostfix = flag ? '[aria-selected="true"]' : `.${cls}`;
    const els = this.document.querySelectorAll(`tr${selectorPostfix}`);
    els.forEach((item) => {
      flag ? item.classList.add(cls) : item.classList.remove(cls)
    });
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

    if (['copy', 'cut'].includes(id)) {
      this.itemsToPast = this.treeGridObj.getSelectedRecords();
      this.toggleRowToPasteCls(true);
      this.pasteMode = id as PasteMode;
    }


    if (['paste_above', 'paste_below'].includes(id) && this.contextMenuRowIndex) {
      const [, position] = id.split('_');
      if (this.pasteMode === 'cut') {
        const fromIndexes = this.itemsToPast.map(({ index, _id }) => index);
        const itemIdToReplace = this.itemsToPast.map(({ _id }) => _id);
        this.toggleRowToPasteCls(false);
        this.treeGridObj.reorderRows(fromIndexes, this.contextMenuRowIndex, position);
        this.treeGridObj.getColumnFieldNames()
        this.usersService.movePosition(itemIdToReplace, this.contextMenuRowIndex, position as 'above' | 'below', 'Philippines').subscribe();
      };


      // if (this.data){
      //   this.usersService.resetAll(this.data).subscribe(res => {
      //     console.log("resetAll", this.data)
      //   });
      // };
      // this.data = null;
      // this.usersService.getAll().subscribe((data) => {
      //   console.log(data)
      //   this.data = data;
      // });

      // const toPos = { 'below': 'Below', 'above': 'Above' }[position] || 'Below';
      //
      // this.itemsToPast.forEach((item, idx) => {
      //   const toIndex = (this.contextMenuRowIndex || 0) + idx;
      //   this.toggleRowToPasteCls(false);
      //   this.treeGridObj?.addRecord(item, toIndex, toPos as RowPosition);
      // });
      // this.toggleRowToPasteCls(false);
      return;
    }
    const [type, value] = id.split('_');

    this.setPropsToContextMenuCells(type, value);
  }

  deleteRecords(data: any): void{
    const mapToRemove = data.reduce((resultMap: Record<string, string[]>, currentItem: any) => {
      const { _id } = currentItem;
      const { country } = currentItem.parentItem;
      return {
        ...resultMap,
        [country]: resultMap[country] ? [...resultMap[country], _id] : [_id]
      };
    }, {});

    this.usersService.delete(mapToRemove).subscribe();
  }

  contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void{
    if(arg){
      const elem: Element = arg.event.target as Element;
      const colindex = elem.closest('.e-headercell')?.getAttribute('aria-colindex')
      const rowindex = elem.closest('.e-row')?.getAttribute('aria-rowindex');

      if(colindex){
        this.contextMenuColindex = Number(colindex)
      }
      if(rowindex) {
        this.contextMenuRowIndex = Number(rowindex);
      }
    }
  }

  onActionComplete(event: any): void {
    const { type, requestType, data } = event;
    if (requestType === 'delete') {
      this.deleteRecords(data)
    } else if (type === 'save') {
      const { _id } = data;
      const { country } = data.parentItem;
      const { field } = event.column;
      this.usersService.update(_id, country, { [field]: data[field] }).subscribe();
    }
  }
}
