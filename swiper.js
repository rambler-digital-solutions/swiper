class Swiper {
  constructor(node) {
    this.area    = node.querySelector('.js-series-items');
    this.items   = node.querySelectorAll('.js-series-item');
    this.control = node.querySelectorAll('.js-series-control');

    if (this.items.length > 0) {
      this.size = this.items[0].clientWidth;
      this.space;

      this.direction;

      this.prevX = 0;
      this.max = {};
      this.count = { startX: 0, startY: 0, x: 0, y: 0 };
      this.distance;
      this.diff;
    }
    this.winWidth = window.innerWidth;
    this.setEvents();
  }

  checkHorizontalResize() {
    if (window.innerWidth !== this.winWidth) {
      this.winWidth = window.innerWidth;
      return true;
    }
    return false;
  }


  setAnimate(state) {
    state
      ? this.area.classList.add('is-animate')
      : this.area.classList.remove('is-animate');
  }

  slide(node) {
    if (node.classList.contains('is-disabled')) return;

    this.setAnimate(true);
    this.direction = node.getAttribute('data-direction') === 'right'
      ? -1
      : 1;

    this.area.style.left = `${this.currentLeft() + (this.direction * this.size)}px`;
    this.setControls();
  }

  currentLeft() {
    let left = this.area.style.left !== ''
      ? parseFloat(this.area.style.left.replace('%', '').replace('px', ''), 10)
      : 0;

    return this.area.style.left.indexOf('%') >= 0
      ? left / 100 * window.innerWidth
      : left;
  }

  setControls() {
    let currLeft = this.currentLeft();
    for (let i = 0; i < this.control.length; i++) {
      this.control[i].classList.remove('is-disabled');
    }
    currLeft <= this.max.px && (this.control[1].classList.add('is-disabled'));
    currLeft >= this.space && (this.control[0].classList.add('is-disabled'));
  }

  touchStart(e) {
    this.setAnimate(false);
    this.prevX = e.touches[0].screenX;
    this.count.startX = e.touches[0].screenX;
    this.count.startY = e.touches[0].screenY;
  }

  touchMove(e) {
    let left;
    let currLeft = this.currentLeft();

    this.diff  = e.touches[0].screenX - this.prevX;
    this.prevX = e.touches[0].screenX;

    this.count.x = Math.abs(this.count.startX - e.touches[0].screenX);
    this.count.y = Math.abs(this.count.startY - e.touches[0].screenY);

    left = currLeft + this.diff;

    if (this.count.y > this.count.x
    ||  this.diff === 0) return;

    if ((currLeft >= this.space && this.diff > 0)
    ||  (currLeft <= this.max.px && this.diff < 0)) {
      this.area.style.left = this.diff > 0
        ? `${this.space}px`
        : `${this.max.px}px`;
      this.setControls();
      return;
    }

    e.preventDefault();
    this.area.style.left = `${left}px`;
  }

  touchEnd() {
    let left;
    let coefficient;
    let balance;
    let currLeft = this.currentLeft();

    this.direction = this.diff > 0 ? 1 : -1;
    this.distance  = Math.abs((currLeft - this.space) / this.size);
    this.setAnimate(true);

    if (this.distance === 0) return;

    balance = this.distance - Math.floor(this.distance);

    coefficient = ((this.diff < 0 && balance > 0.25)
    ||             (this.diff > 0 && balance > 0.75)) ? 1 : 0;

    left = ((Math.floor(this.distance) + coefficient) * -this.size) + this.space;

    left >= this.space  && (left = this.space);
    left <= this.max.px && (left = this.max.px);

    this.area.style.left = `${left}px`;
    this.setControls();
  }

  setInitial() {
    let middle = (this.area.clientWidth - window.innerWidth) / -2;
    this.space = (window.innerWidth - this.size) / 2;
    this.area.style.left = (this.items.length % 2 === 0)
      ? `${middle + (this.size / 2)}px`
      : `${middle}px`;
  }

  setMax() {
    this.max = {
      px: ((this.items.length - 1) * (this.size) - this.space) * (-1),
      perc: (this.items.length - 1) * (-100)
    };
  }

  setEvents() {
    for (let i = 0; i < this.control.length; i++) {
      this.control[i].addEventListener('click', e => {
        this.slide(e.currentTarget);
        e.stopPropagation();
      });
    }

    this.setInitial();
    this.setMax();
    this.setControls();

    this.area.addEventListener('touchstart', event => { this.touchStart(event); });
    this.area.addEventListener('touchmove', event => { this.touchMove(event); });
    this.area.addEventListener('touchend', event => { this.touchEnd(event); });

    window.addEventListener('resize', () => {
      if (this.checkHorizontalResize()) {
        this.setInitial();
        this.setMax();
      }
    });

    if (this.items.length <= 1) {
      for (let i = 0; i < this.control.length; i++) {
        this.control[i].remove();
      }
    }
  }
}

const swiper = document.querySelectorAll('.js-series');
if (swiper.length > 0) {
  for (let i = 0; i < swiper.length; i++) {
    new Swiper(swiper[i]);
  }
}
