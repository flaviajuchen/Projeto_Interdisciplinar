import React, { useState, useEffect } from "react";

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
  defaultValue?: string | null;
};

export default function SelectDefault({
  dados,
  tituloSelect,
  tipo,
  onChange,
  value,
  defaultValue,
}: SelectProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    value || defaultValue || null
  );

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedValue(selected);
    // Chame a função de retorno de chamada fornecida para notificar a alteração
    if (onChange) {
      onChange(selected);
    }
  };

  // Atualize o estado se o componente não é controlado pelo React
  useEffect(() => {
    if (value === undefined) {
      setSelectedValue(defaultValue || null);
    }
  }, [value, defaultValue]);

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
