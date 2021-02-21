export const Item = ({object, x, y, center}) => {
  return (
    <image
      href={object.image}
      height={object.height}
      x={center === false ? x : x - (object.width / 2)}
      y={y}
    />
  )
}