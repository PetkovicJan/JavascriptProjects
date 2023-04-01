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
  newItem.className = "list";

  const itemText = document.createTextNode(`${name} (${quantity})`);
  newItem.appendChild(itemText);

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "list";
  const addButton = createButtonWithImg("resources/check-solid.svg");
  const removeButton = createButtonWithImg("resources/xmark-solid.svg");
  buttonsDiv.appendChild(addButton);
  buttonsDiv.appendChild(removeButton);
  newItem.appendChild(buttonsDiv);

  list.appendChild(newItem);
}

function createButtonWithImg(imgUrl) {

  const button = document.createElement("button");
  button.className = "list";

  const img = document.createElement("img");
  img.className = "buttonImg";
  img.src = imgUrl;

  button.insertBefore(img, button.firstChild);

  return button;
}

})(window);