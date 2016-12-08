/**
 * Describes how Slider component works
 */
class Slider {
  /**
   * [constructor is initial method]
   * @param  {[object]} component          [parent node]
   * @param  {[object]} area               [items container]
   * @param  {[object]} buttons            [control buttons]
   * @param  {[string]} itemsSelector      [name of slider items selector]
   * @param  {[string]} slideRangeSelector [name of element selector which width is slide range]
   */
  constructor(component, area, buttons, itemsSelector, slideRangeSelector) {
    this.component = component;
    this.area      = area;
    this.buttons   = buttons;
    this.itemsSelector = itemsSelector;
    this.items;
    this.$area = $(this.area);
    this.slideRangeSelector = slideRangeSelector;
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].addEventListener('click', e => this.move(e.currentTarget) );
    }
  }
  /**
   * [insertAfter is a custom method]
   * @param  {[object]} insertNode [node that we insert]
   * @param  {[object]} afterNode  [node after we insert]
   */
  insertAfter(afterNode, insertNode) {
    insertNode.parentNode.insertBefore(afterNode, insertNode.nextSibling);
  }
  /**
   * [prev is a function that describes left slide logic]
   * @param  {[object]} prop [slide parameters]
   */
  prev(prop) {
    for (let i = 0; i < prop.quantity; i++) {
      this.items = this.component.querySelectorAll(this.itemsSelector);
      let $firstItem = $(this.items[0]);
      let $lastItem  = $(this.items[this.items.length - 1]);
      $firstItem.before($lastItem);
    }
    this.area.style.left =  `${-prop.width}px`;
    this.$area.animate({ left: '0px' }, 600, () => this.component.delay = false );
  }
  /**
   * [next is a function that describes right slide logic]
   * @param  {[object]} prop [slide parameters]
   */
  next(prop) {
    this.$area.animate({ left: -prop.width }, 600, () => {
      for (let i = 0; i < prop.quantity; i++) {
        this.items = this.component.querySelectorAll(this.itemsSelector);
        let $firstItem = $(this.items[0]);
        let $lastItem  = $(this.items[this.items.length - 1]);
        $lastItem.after($firstItem);
      }
      this.area.style.left = '0px';
      this.component.delay = false;
    });
  }
  /**
   * [setStepData is a function that calculate slide parameters]
   * @param {[function]} onComplete [callback method that call slide methods]
   */
  setStepData(onComplete) {
    let stepWidth = this.component.querySelectorAll(this.slideRangeSelector)[0].clientWidth;
    let itemWidth = this.component.querySelectorAll(this.itemsSelector)[0].clientWidth;
    onComplete({
      width: stepWidth,
      quantity: Math.ceil(stepWidth / itemWidth)
    });
  }
  /**
   * [move is a function that run after click event on controls]
   * @param  {[object]} btn [cliked button node]
   */
  move(btn) {
    if (this.component.delay) return;
    this.component.delay = true;
    this.setStepData(prop => {
      this[btn.getAttribute('data-direction')](prop);
    });
  }
}
/**
 * [COMPONENTS is an array of components data objects that needs to be initialized by Slider class]
 * @type {Array}
 */
const COMPONENTS =  [{
  component: '.js-series',
  area: '.js-series-items',
  items: '.js-series-item',
  buttons: '.js-series-button',
  slideRangeSelector: '.js-series-item'
}, {
  component: '.js-article-readon',
  area: '.js-article-readon-items',
  items: '.js-entry',
  buttons: '.js-article-readon-button',
  slideRangeSelector: '.js-article-readon-items'
}];
/**
 * [for initialize each component]
 */
for (let i = 0; i < COMPONENTS.length; i++) {
  let components = document.querySelectorAll(COMPONENTS[i].component);
  if (components.length > 0) {
    for (let j = 0; j < components.length; j++) {
      new Slider(
        components[j],
        components[j].querySelector(COMPONENTS[i].area),
        components[j].querySelectorAll(COMPONENTS[i].buttons),
        COMPONENTS[i].items,
        COMPONENTS[i].slideRangeSelector
      );
    }
  }
}
