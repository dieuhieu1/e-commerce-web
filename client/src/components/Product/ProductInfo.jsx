const ProductInfo = ({ productInfo }) => {
  const { title, icon, sub } = productInfo;
  return (
    <div className="flex items-center p-4 gap-4 mb-[10px] border mt-5">
      <span className="text-white p-2 bg-gray-800 items-center rounded-full justify-center flex">
        {icon}
      </span>
      <div className="flex flex-col text-sm text-gray-500">
        <span className="font-medium">{title}</span>
        <span className="text-xs">{sub}</span>
      </div>
    </div>
  );
};

export default ProductInfo;
