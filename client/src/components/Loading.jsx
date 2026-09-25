const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="spinner mb-4"></div>
      <p className="text-gray-500">{text}</p>
    </div>
  );
};

export default Loading;
