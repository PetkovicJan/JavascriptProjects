// IIFE
(function(global){

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){

  const itemInput = document.getElementById("item");
  const quantityInput = document.getElementById("quantity");

  const toGrabList = document.getElementById("toGrabList");
  const inCartList = document.getElementById("inCartList");

  document.getElementById("addItemButton").addEventListener("click", () => {
    const itemName = itemInput.value;
    const quantity = quantityInput.value;

    addNewItemToList(toGrabList, itemName, quantity);
  });

});

function addNewItemToList(list, name, quantity) {

  const newItem = document.createElement("li");
  const itemText = document.createTextNode(`${name} (${quantity})`);
  newItem.appendChild(itemText);

  const addButton = document.createElement("button");
  const addText = document.createTextNode("Add");
  addButton.appendChild(addText);

  const removeButton = document.createElement("button");
  const removeText = document.createTextNode("Remove");
  removeButton.appendChild(removeText);

  newItem.appendChild(addButton);
  newItem.appendChild(removeButton);

  list.appendChild(newItem);
}

})(window);