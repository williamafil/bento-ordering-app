export default function clxs(...classes) {
  return classes.filter(Boolean).join(" ");
}
