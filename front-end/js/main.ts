﻿import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component.ts';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

bootstrap(AppComponent, [HTTP_PROVIDERS]);