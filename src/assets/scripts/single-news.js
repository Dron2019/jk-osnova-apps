import menu from './modules/menu';
import { lenis } from './modules/scroll/leniscroll';
import Headroom from 'headroom.js';
import 'current-device';
import './modules/form';

menu();

new Headroom(document.querySelector('.header')).init();