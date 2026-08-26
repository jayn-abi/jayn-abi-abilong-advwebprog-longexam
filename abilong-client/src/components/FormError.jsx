const FormError = ({ message }) => {
  if (!message) return null;
  return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{message}</p>;
};

export default FormError;
