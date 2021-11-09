class Pizza {
  /**
   * Constructor for class pizza. It sets the initial properties of the class.
   * @param {HTMLElement} element is the element where the class will be rendered
   */
  constructor(element) {
    // Object initial properties 1
    this.element = element;
    this.toppings = [];
    this.numOfToppings = 0;
    this.basePrice = 40;
    this.pizzasOrdered = [];
    this.currentPizza = { price: this.basePrice, toppings: {} };
    this._orderReceivedMsg = "Order Received!";
    this._thanksMsg = "Thanks for your purchase";
    this.toggleTopping = this.toggleTopping.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  // These methods will be used to change the messages in a safe way
  get orderReceivedMsg() {
    return this._orderReceivedMsg;
  }

  set orderReceivedMsg(newMsg) {
    if (typeof newMsg === "string" && newMsg != "") {
      this._orderReceivedMsg = newMsg;
    }
  }

  get thanksMsg() {
    return this._thanksMsg;
  }

  set thanksMsg(newMsg) {
    if (typeof newMsg === "string" && newMsg != "") {
      this._thanksMsg = newMsg;
    }
  }

  /**
   * This renders the class in the HTML element given from the constructor.
   * This creates all the elements needed and appends them to the main element.
   */
  render() {
    // create all the html elements 2
    this.toppingDiv = document.createElement("div");
    this.totalPrice = document.createElement("p");
    this.submit = document.createElement("button");
    this.legend = document.createElement("p");

    // add toppings div
    this.element.appendChild(this.toppingDiv);

    // add total price html element
    this.updateTotalPrice();
    this.element.appendChild(this.totalPrice);

    // add submit button
    this.submit.innerHTML = "Finish";
    this.submit.addEventListener("click", this.placeOrder);
    this.element.appendChild(this.submit);

    // add legend
    this.element.appendChild(this.legend);
  }

  /**
   * This adds a new topping to the class. And the UI elements to the page.
   * @param {string} type is the name of the topping
   * @param {number} price is the price of the topping
   */
  createTopping(type, price) {
    if (!this.toppingDiv) {
      throw Error("Cannot create topping, UI is not rendered");
    }

    // Add topping to list
    this.toppings.push({ type, price });

    // Create html elements for checkbox and label
    const label = document.createElement("label");
    const input = document.createElement("input");

    // Properties for input
    input.id = this.numOfToppings;
    input.type = "checkbox";
    input.value = price;
    input.addEventListener("click", this.toggleTopping);

    // Properties for label
    label.innerHTML = ` ${type} &#8362 ${price} `;
    label.htmlFor = this.numOfToppings;

    // Append both to the list of toppings
    this.toppingDiv.appendChild(input);
    this.toppingDiv.appendChild(label);

    // Increase numOfToppings
    this.numOfToppings++;
  }

  toggleTopping({ target }) {
    // If the box was checked then add the topping
    if (target.checked) {
      this.currentPizza.price += this.toppings[target.id].price;
      this.currentPizza.toppings[target.id] = this.toppings[target.id].type;

      // Else remove it
    } else {
      this.currentPizza.price -= this.toppings[target.id].price;
      delete this.currentPizza.toppings[target.id];
    }

    // Refresh the ui for total price
    this.updateTotalPrice();
  }

  placeOrder() {
    // Add pizza to the orders
    this.addPizza();

    // Disable submit
    this.submit.disabled = true;

    // Disable all checkboxes
    this.toppings.forEach((_, i) => {
      const checkbox = document.getElementById(i);
      checkbox.disabled = true;
    });

    // Display processing message
    this.legend.innerHTML = "<i>Processing order</i>";

    // Wait 3 seconds to show completed message
    setTimeout(() => {
      // Completed message
      this.legend.innerHTML = `${this.orderReceivedMsg} ${this.thanksMsg}`;

      // Restart everything after 5 seconds
      setTimeout(() => {
        // Legend set to empty, submit reenabled and total price updated
        this.legend.innerHTML = "";
        this.submit.disabled = false;
        this.updateTotalPrice();

        // Clear all checkboxes and reenable them
        this.toppings.forEach((_, i) => {
          const checkbox = document.getElementById(i);
          checkbox.disabled = false;
          checkbox.checked = false;
        });
      }, 5000);
    }, 3000);
  }

  addPizza() {
    // Add current pizza to the orders placed
    this.pizzasOrdered.push(this.currentPizza);

    // Restarted current pizza
    this.currentPizza = { price: this.basePrice, toppings: {} };
  }

  updateTotalPrice() {
    this.totalPrice.innerHTML = `Order Total: $${this.currentPizza.price}`;
  }
}
