function ShoppingCart() {
  // TODO: fetch items from server.

  // prices are in GBP.

  var itemData = [{
    id: 1,
    name: 'Peas',
    basePrice: ko.observable('0.95'),
    price: ko.observable('0.95')
  }, {
    id: 2,
    name: 'Eggs',
    basePrice: ko.observable('2.10'),
    price: ko.observable('2.10')
  }, {
    id: 3,
    name: 'Milk',
    basePrice: ko.observable('1.30'),
    price: ko.observable('1.30')
  }, {
    id: 4,
    name: 'Beans',
    basePrice: ko.observable('0.73'),
    price: ko.observable('0.73')
  }];

  this.items = ko.observableArray(itemData);

  //TODO: fetch from server.
  this.currencyMapping = {
    'GBP': '&pound;',
    'USD': '$'
  }

  this.currencies = ko.observableArray(['GBP', 'USD']);
  this.currency = ko.observable(this.currencies()[0]);

  this.currency.subscribe(function(newValue) {
      this.currencySymbol(this.currencyMapping[newValue]);

      $.ajax({
        url : 'http://apilayer.net/api/live?access_key=f4f8f80bf2bf594b04dfc41aa0b85ee4&currencies=' + newValue + '&source=GBP&format=1',
        success: function(response) {

          if (response.quotes) {
            var currencyRate = response.quotes['GBP' + newValue];
            if (typeof currencyRate !== 'undefined') {
              for (key in this.items()) {
                var item = this.items()[key];
                item['price'](item['basePrice']() * currencyRate);
              }
              this.calculateTotalPrice();
            }
          }
        }.bind(this)
      });
  }.bind(this));

  this.currencySymbol = ko.observable(this.currencyMapping[this.currency()]);

  this.totalQuantity = ko.observable(0);
  this.totalPrice = ko.observable(0);
  this.cartItems = ko.observableArray();

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

  this.totalQuantity.subscribe(this.calculateTotalPrice.bind(this));


  // Currency conversion via api

  // Currency switching
  this.currencyChange = function(ev) {
    console.log(ev);

  }
};

ko.applyBindings(new ShoppingCart());
