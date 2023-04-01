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

    addNewItemToList(toGrabList, inCartList, itemName, quantity);
  });
});

const ItemStage = {
  ToGrab: 1,
  InCart: 2
};

function addNewItemToList(grabList, cartList, name, quantity) {

  const newItem = document.createElement("li");
  newItem.className = "list";
  newItem.itemStage = ItemStage.ToGrab;

  const itemText = document.createTextNode(`${name} (${quantity})`);
  newItem.appendChild(itemText);

  const addButton = createButtonWithImg("resources/check-solid.svg");
  addButton.addEventListener("click", () => {
    const itemStage = newItem.itemStage;
    if(itemStage === ItemStage.ToGrab) {
      newItem.itemStage = ItemStage.InCart;
      cartList.appendChild(newItem);
    } else if (itemStage === ItemStage.InCart) {

    } else {
      console.error("Unknown item stage!");      
    }
  });

  const removeButton = createButtonWithImg("resources/xmark-solid.svg");
  removeButton.addEventListener("click", () => {
    const itemStage = newItem.itemStage;
    if(itemStage === ItemStage.ToGrab) {
      newItem.remove();
    } else if (itemStage === ItemStage.InCart) {
      newItem.itemStage = ItemStage.ToGrab;
      grabList.appendChild(newItem);
    } else {
      console.error("Unknown item stage!");      
    }
  });

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "list";
  buttonsDiv.appendChild(addButton);
  buttonsDiv.appendChild(removeButton);
  newItem.appendChild(buttonsDiv);

  grabList.appendChild(newItem);
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