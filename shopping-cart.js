function ShoppingCart() {
  // TODO: fetch items from server.
  this.items = ko.observableArray([{
    id: 1,
    name: 'Peas',
    price: '1'
  }, {
    id: 2,
    name: 'Eggs',
    price: '2'
  }, {
    id: 3,
    name: 'Milk',
    price: '3'
  }, {
    id: 4,
    name: 'Beans',
    price: '4'
  }]);

  // A mapping of item ID -> key in observable array, to avoid unecessarry searchs.
  this.idToKeyMapping = {};

  this.cartItems = ko.observableArray();

  // Add an item to basket.
  this.addToBasket = function(item) {
    var index = this.getIndexIfItemExists(item.id);
    if (index !== false) {
      // update cart item
      var cartItem = this.cartItems()[index];
      cartItem.qty(cartItem.qty() + 1);
    } else {
      // add new cart item.
      item.qty = ko.observable(1);
      this.cartItems.push(item);
      this.idToKeyMapping[item.id] = this.cartItems().length - 1;
    }

  }.bind(this);

  // If item exists in the cart then return the index.
  this.getIndexIfItemExists = function(id) {
    if (typeof this.idToKeyMapping[id] !== "undefined") {
      return this.idToKeyMapping[id];
    }
    for (key in this.items) {
      if (key === id) {
        return this.items[key];
      }
    }
    return false;
  }

  this.removeFromBasket = function(item) {

  }
};

ko.applyBindings(new ShoppingCart());
