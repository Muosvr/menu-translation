import * as PIXI from "pixi.js";
import { PixiComponent } from "@inlet/react-pixi";

export default PixiComponent("Rectangle", {
  create: props => {
    return new PIXI.Graphics();
  },
  didMount: (instance, parent) => {},
  willUnmount: (instance, parent) => {},
  applyProps: (instance, oldProps, newProps) => {
    const { fill, x1, y1, x3, y3, alpha } = newProps;
    instance.clear();
    instance.beginFill(fill);
    instance.drawRect(x1, y1, x3 - x1, y3 - y1);
    instance.alpha = alpha;
    instance.endFill();
  }
});
