let showData = document.getElementById("showData");

async function getImage() {
   const req = await fetch("https://dummyjson.com/products");
   const responce = await req.json();
   showData.setAttribute("src", responce.thumbnail);
   responce.forEach((element) => {
      console.log(element);
   });
   console.log(responce);
}
getImage();

console.log(showData);

// fetch("https://dummyjson.com/products/1")
//    .then((res) => res.json())
//    .then((json) => console.log(json.thumbnail));
// showData.innerHTML(json.thumbnail);
