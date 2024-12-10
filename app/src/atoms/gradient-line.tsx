const GradientLine = ({ className }: { className?: string }) => {
  return (
    <div
      className={"w-[1.5px] h-[calc(100vh-124px)] " + className}
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #000 0%, #639 57%, #000 100%)",
      }}
    ></div>
  );
};

export default GradientLine;
