function ShoppingCart() {
  // TODO: fetch items from server.
  this.items = ko.observableArray([{
    id: 1,
    name: 'Peas',
    basePrice: ko.observable('0.95'),
    price: ko.observable('0.95'),
    img: 'images/peas.jpg'
  }, {
    id: 2,
    name: 'Eggs',
    basePrice: ko.observable('2.10'),
    price: ko.observable('2.10'),
    img: 'images/eggs.jpg'
  }, {
    id: 3,
    name: 'Milk',
    basePrice: ko.observable('1.30'),
    price: ko.observable('1.30'),
    img: 'images/milk.jpg'
  }, {
    id: 4,
    name: 'Beans',
    basePrice: ko.observable('0.73'),
    price: ko.observable('0.73'),
    img: 'images/beans.jpg'
  }]);

  this.cartItems = ko.observableArray();

  this.currencyMapping = {
    'GBP': '&pound;',
    'USD': '$'
  }

  this.currencies = ko.observableArray(['GBP', 'USD']);
  this.currency = ko.observable(this.currencies()[0]);

  this.currency.subscribe(function(newValue) {
      $.ajax({
        url : 'http://apilayer.net/api/live?access_key=f4f8f80bf2bf594b04dfc41aa0b85ee4&currencies=' + newValue + '&source=GBP&format=1',
        success: function(response) {
          if (response.quotes) {
            var currencyRate = response.quotes['GBP' + newValue];
            if (typeof currencyRate !== 'undefined') {
              this.currencySymbol(this.currencyMapping[newValue]);
              this.calculateItemPrices(this.items(), currencyRate);
              this.calculateItemPrices(this.cartItems(), currencyRate);
              this.calculateTotalPrice();
              return;
            }
          }

          alert('Sorry, something went wrong whilst tryng to change currency. Please reload the page and try again.');
        }.bind(this),
        error: function() {
          alert('Sorry, something went wrong whilst tryng to change currency. Please reload the page and try again.');
        }
      });
  }.bind(this));

  this.currencySymbol = ko.observable(this.currencyMapping[this.currency()]);

  this.totalQuantity = ko.observable(0);
  this.totalPrice = ko.observable(0);

  // General function for formatting of prices
  this.formatPrice = function(price) {
      return this.currencySymbol() + Math.round(price * 100) / 100;
  };

  // Add an item to basket.
  this.addToBasket = function(item) {
    var index = this.cartItems.indexOf(item);
    if (index !== -1) {
      // update cart item
      var cartItem = this.cartItems()[index];
      cartItem.qty(cartItem.qty() + 1);
    } else {
      // add new cart item.
      item.qty = ko.observable(1);
      this.cartItems.push(item);
    }

    this.totalQuantity(this.totalQuantity() + 1);
  }.bind(this);

  this.removeFromBasket = function(item) {
      this.cartItems.remove(item);
      this.totalQuantity(this.totalQuantity() - item.qty());
  }.bind(this);

  // Calculate total price
  this.calculateTotalPrice = function() {
    var total = 0;

    var cartItems = this.cartItems();

    for (key in cartItems) {
      var cartItem = cartItems[key];
      total += (cartItem.price() * cartItem.qty());
    }

    this.totalPrice(total);
  };

  this.calculateItemPrices = function(items, currencyRate) {
    for (key in items) {
      var item = items[key];
      item['price'](item['basePrice']() * currencyRate);
    }
  };

  this.totalQuantity.subscribe(this.calculateTotalPrice.bind(this));

  this.toggleMinicart = function() {
      $('.minicart .content').toggle();
      $('body').toggleClass('minicart-open');
  };
};

ko.applyBindings(new ShoppingCart());
