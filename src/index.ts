//this is the main locic

import { Pixel as Pixel } from "./pixel";
import { PIXELSIZE, COLORS, Settings as Setting, Direction, HEIGHT, MAX_LEVEL, SCALE, SPEED, WIDTH, bricksSpecial} from "./constants";
import { Playground as Playground } from "./playground";
import { Snake } from "./snake";
import {Classic} from "./classic";
import { OnSpecial } from "./onSpecial";


window.focus();
//ls: Modus Classic
new Classic().start();
//ls: Modus ON20 Special
new OnSpecial().start();