type InputProps = {
  type: string;
  name: string;
  value?: string | number | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

export default function Input({
  type,
  name,
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="bg-gray-50 mt-4 border outline-gray-400 border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
    />
  );
}
