function ShoppingCart() {
  // TODO: fetch items from server.

  // prices are in GBP.
  this.items = ko.observableArray([{
    id: 1,
    name: 'Peas',
    price: '0.95'
  }, {
    id: 2,
    name: 'Eggs',
    price: '2.10'
  }, {
    id: 3,
    name: 'Milk',
    price: '1.30'
  }, {
    id: 4,
    name: 'Beans',
    price: '0.73'
  }]);

  //TODO: fetch from server.
  this.currencyMapping = {
    'GBP': '&pound;',
    'USD': '$'
  }

  this.currencies = ko.observableArray(['GBP', 'USD']);
  this.currency = ko.observable(this.currencies()[0]);

  this.currency.subscribe(function(newValue) {
      this.currencySymbol(this.currencyMapping[newValue]);
  }.bind(this));

  this.currencySymbol = ko.observable(this.currencyMapping[this.currency()]);

  this.totalQuantity = ko.observable(0);
  this.totalPrice = ko.observable(0);
  this.cartItems = ko.observableArray();

  // General function for formatting of prices

  this.formatPrice = function(price) {
      return this.currencySymbol() + price;
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
  this.totalQuantity.subscribe(function() {
    var total = 0;

    var cartItems = this.cartItems();

    console.log(cartItems);

    for (key in cartItems) {
      var cartItem = cartItems[key];


      console.log(cartItem.price);

      console.log(cartItem.qty());

      total += (cartItem.price * cartItem.qty());
    }

    this.totalPrice(total);
  }.bind(this));

  // Currency conversion via api

  // Currency switching
  this.currencyChange = function(ev) {
    console.log(ev);

  }
};

ko.applyBindings(new ShoppingCart());
