const Item = ({object, x, y, center, costumeIndex, opacity}) => {

  // Use costume 0 by default
  if (costumeIndex === undefined) {
    costumeIndex = 0;
  }

  return (
    <image
      href={object.images[costumeIndex]}
      height={object.height}
      x={center === false ? x : x - (object.width / 2)}
      y={y}
      opacity={opacity}
    />
  )
}

export default Item;