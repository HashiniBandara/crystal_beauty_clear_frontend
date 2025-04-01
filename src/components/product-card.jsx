// import "./product-card.css";
export default function ProductCard(props) {

  // console.log(props);
  // console.log(props.description);
  return (
    <>
      <div className="product-card card shadow">
        <h1>{props.name}</h1>
        <p>{props.description}</p>
        <p>{props.price}</p>
        <button>Add to cart</button>
      </div>
    </>
  );
}
