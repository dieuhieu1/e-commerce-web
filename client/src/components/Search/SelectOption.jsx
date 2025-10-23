const SelectOption = ({ icon }) => {
  return (
    <div className="w-10 h-10 rounded-full bg-white border border-stone-400 shadow-md  flex items-center justify-center hover:bg-gray-800 hover:text-white hover:border-gray-800">
      {icon}
    </div>
  );
};

export default SelectOption;
