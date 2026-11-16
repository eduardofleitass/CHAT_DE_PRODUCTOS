import type { Product } from '../interfaces/product.interface';

// Selector del servicio que se va a ofrecer. Es un <select> nativo:
// accesible con teclado y sin agregar dependencias.
export default function ProductPicker({
  products,
  value,
  onChange,
  disabled,
}: {
  products: Product[]; // catálogo a mostrar
  value: string; // id del servicio seleccionado
  onChange: (id: string) => void; // avisa al padre qué se eligió
  disabled: boolean; // se bloquea mientras la oferta viaja
}) {
  return (
    <label className="picker">
      <span className="picker__label">Servicio</span>

      <select
        className="picker__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
    </label>
  );
}
