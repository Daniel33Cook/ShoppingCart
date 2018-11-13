

function ShoppingCart() {
  // TODO: fetch items from server.
  this.items = ko.observableArray([{
    name: 'Peas',
    price: '1'
  }, {
    name: 'Eggs',
    price: '2'
  }, {
    name: 'Milk',
    price: '3'
  }, {
    name: 'Beans',
    price: '4'
  }]);


  this.cartItems = ko.observableArray();

  this.addToBasket = function(item) {
    this.cartItems.push(item);
  }.bind(this);
};

ko.applyBindings(new ShoppingCart());
