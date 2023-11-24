import { useState, useEffect } from "react";

type PedidoProps = {
  id: number;
  tipo: string;
  nome?: string;
};

type SelectProps = {
  nome?: string;
  dados: PedidoProps[];
  tituloSelect: string;
  tipo: string;
  onChange?: (value: string | null) => void;
  value?: string | null;
};

export default function Select({
  dados,
  tituloSelect,
  tipo,
  onChange,
  value,
}: SelectProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedValue(selected);
    if (onChange) {
      onChange(selected);
    }
  };

  useEffect(() => {
    setSelectedValue(value || null);
  }, [value]);

  return (
    <div className="flex w-full items-center gap-3">
      <select
        value={selectedValue || ""}
        onChange={handleSelectChange}
        className="bg-gray-50 mt-4 border outline-gray-400 border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
      >
        <option value="" disabled>
          {tituloSelect}
        </option>

        {dados.map((item) => (
          <option key={item.id} value={tipo === "nome" ? item.nome : item.tipo}>
            {tipo === "nome" ? item.nome : item.tipo}
          </option>
        ))}
      </select>
    </div>
  );
}
