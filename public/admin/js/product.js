// Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}`;
      formChangeStatus.action = action;

      const redirectUrl = window.location.pathname + window.location.search;
      formChangeStatus.action += `?_method=PATCH&redirect=${encodeURIComponent(redirectUrl)}`;
      
      formChangeStatus.submit();
    });
  });
}
// End Change status

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Ban co chac muon xoa san pham nay khong?");

      if(isConfirm) {
        const id = button.getAttribute("data-id");
        
        const action = `${path}/${id}`;

        formDeleteItem.action = action;

        const redirectUrl = window.location.pathname + window.location.search;
        formDeleteItem.action += `?_method=DELETE&redirect=${encodeURIComponent(redirectUrl)}`;

        formDeleteItem.submit();
      }
    });
  }); 
}
// End Delete Item

// Form Create Product
const formCreateProduct = document.querySelector("#form-create-product");

if(formCreateProduct) {
  formCreateProduct.addEventListener("submit", (e) => {
    e.preventDefault();

    const redirectUrl = window.location.pathname + window.location.search;
    formCreateProduct.action += `?redirect=${encodeURIComponent(redirectUrl)}`;

    formCreateProduct.submit();
  })
}
// End Form Create Product