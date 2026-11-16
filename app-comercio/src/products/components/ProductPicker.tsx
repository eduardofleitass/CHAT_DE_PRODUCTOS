import type { Product } from '../interfaces/product.interface';

// <select> nativo a propósito: accesible con teclado y sin dependencias nuevas.
export default function ProductPicker({
  products,
  value,
  onChange,
  disabled,
}: {
  products: Product[];
  value: string;
  onChange: (id: string) => void;
  disabled: boolean;
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
