import { Component, OnInit } from '@angular/core';
import { AQColumn } from 'projects/ngx-aq-table/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aqulity-controls';
  lookupValue: any;
  autocompleteValue: any;
  multiselectValue: any;
  inlineError: string;
  clickAction: any;
  toggle: any;
  toggleClickAction: any;

  options: any[] = [{
    id: 1,
    name: 'option 1'
  }, {
    id: 2,
    name: 'option 2'
  }, {
    id: 3,
    name: 'option 3'
  }, {
    id: 4,
    name: 'option 4'
  }];

  data = [{
    index: 1,
    index_start_at: 56,
    integer: 35,
    float: 16.4295,
    name: 'Mark',
    surname: 'Warren',
    fullname: 'Margaret Kaplan',
    email: 'donald@barrett.pe',
    bool: true,
    lookup: this.options[0],
    autocomplete: this.options[0],
    multiselect: [this.options[0]]
  },
  {
    index: 2,
    index_start_at: 57,
    integer: 0,
    float: 12.6388,
    name: 'Vivian',
    surname: 'Hewitt',
    fullname: 'Hannah Holmes',
    email: 'karen@palmer.lk',
    bool: false
  }, {
    index: 3,
    index_start_at: 58,
    integer: 33,
    float: 16.2039,
    name: 'Laurence',
    surname: 'Hodge',
    fullname: 'Denise Bailey',
    email: 'sherri@johnston.es',
    bool: true
  }, {
    index: 4,
    index_start_at: 59,
    integer: 17,
    float: 17.6083,
    name: 'Sheryl',
    surname: 'Clapp',
    fullname: 'Patrick Lassiter',
    email: 'jeanette@pitts.sc',
    bool: true
  }, {
    index: 5,
    index_start_at: 60,
    integer: 49,
    float: 10.6455,
    name: 'Doris',
    surname: 'James',
    fullname: 'Marguerite Jiang',
    email: 'douglas@mcnamara.lc',
    bool: false
  }, {
    index: 6,
    index_start_at: 61,
    integer: 48,
    float: 17.9333,
    name: 'Christopher',
    surname: 'Garrett',
    fullname: 'Lester Ferrell',
    email: 'bob@chan.dj',
    bool: true
  }, {
    index: 7,
    index_start_at: 62,
    integer: 46,
    float: 11.2627,
    name: 'Laura',
    surname: 'Haynes',
    fullname: 'Kimberly Solomon',
    email: 'glen@whitehead.cw',
    bool: false
  },
  {
    index: 8,
    index_start_at: 63,
    integer: 35,
    float: 13.9912,
    name: 'Russell',
    surname: 'Anderson',
    fullname: 'Grace Phillips',
    email: 'bradley@lopez.pg',
    bool: false
  }, {
    index: 9,
    index_start_at: 64,
    integer: 21,
    float: 13.2027,
    name: 'Glenda',
    surname: 'Coates',
    fullname: 'Wade Moran',
    email: 'sandra@richardson.hr',
    bool: false
  }, {
    index: 10,
    index_start_at: 65,
    integer: 8,
    float: 13.0059,
    name: 'Don',
    surname: 'Clapp',
    fullname: 'Gloria Rosenberg',
    email: 'leon@cline.nl',
    bool: false
  }];

  columnsToShow: AQColumn[];

  ngOnInit() {
    this.columnsToShow = [{
      name: 'Id',
      property: 'index',
      filter: true,
      sorting: true,
      type: 'string',
      editable: false,
      class: 'index'
    }, {
      name: 'Name',
      property: 'name',
      filter: true,
      sorting: true,
      type: 'string',
      editable: true,
      editTextOptions: {
        maxLenght: 100,
        minLenght: 3
      }
    }, {
      name: 'Surname',
      property: 'surname',
      filter: true,
      sorting: true,
      type: 'string',
      editable: true,
      editTextOptions: {
        maxLenght: 100,
        minLenght: 3
      }
    }, {
      name: 'Lookup',
      property: 'lookup',
      filter: true,
      sorting: true,
      type: 'lookup',
      editable: true,
      editTextOptions: {
        maxLenght: 100,
        minLenght: 3
      },
      lookup: {
        array: this.options,
        propertiesToShow: ['name'],
        required: false
      }
    }, {
      name: 'Autocomplete',
      property: 'autocomplete',
      filter: true,
      sorting: true,
      type: 'autocomplete',
      editable: true,
      editTextOptions: {
        maxLenght: 100,
        minLenght: 3
      },
      lookup: {
        array: this.options,
        propertiesToShow: ['name'],
        required: false
      }
    }, {
      name: 'Multiselect',
      property: 'multiselect',
      filter: true,
      sorting: true,
      type: 'multiselect',
      editable: true,
      editTextOptions: {
        maxLenght: 100,
        minLenght: 3
      },
      lookup: {
        array: this.options,
        propertiesToShow: ['name'],
        required: false
      }
    }];
  }

  toSting(obj: any) {
    return JSON.stringify(obj, null, 4);
  }

  setInlineerror($event) {
    this.inlineError = $event;
  }

  clicked() {
    this.clickAction = `Clicked ${new Date()}`;
  }

  toggled($event) {
    this.toggle = $event;
  }

  toggleClicked() {
    this.toggleClickAction = `Clicked ${new Date()}`;
  }
}
