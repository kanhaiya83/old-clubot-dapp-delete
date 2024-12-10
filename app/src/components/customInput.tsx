const CustomInput = ({
  placeholder,
  onChange,
  type,
  value,
}: {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: 'token' | 'address';
  value?: string | number
}) => {
  return (
    <button className="w-full h-[60px] text-base text-[#acacac] font-semibold bg-black border border-border flex items-center justify-start pl-[20px] rounded-[8px] cursor-pointer select-none ">
      {/* <QuestionMarkSVG className="mr-[10px]" />  */}
      {
        (type === 'address') 
        ? <svg className="mr-[10px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#888888" d="M5 19V5zm0 2q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v2.5h-2V5H5v14h14v-2.5h2V19q0 .825-.587 1.413T19 21zm8-4q-.825 0-1.412-.587T11 15V9q0-.825.588-1.412T13 7h7q.825 0 1.413.588T22 9v6q0 .825-.587 1.413T20 17zm7-2V9h-7v6zm-4-1.5q.625 0 1.063-.437T17.5 12t-.437-1.062T16 10.5t-1.062.438T14.5 12t.438 1.063T16 13.5"/></svg>
        : <svg className="mr-[10px]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="#888888" d="M184 89.57V84c0-25.08-37.83-44-88-44S8 58.92 8 84v40c0 20.89 26.25 37.49 64 42.46V172c0 25.08 37.83 44 88 44s88-18.92 88-44v-40c0-20.7-25.42-37.32-64-42.43M232 132c0 13.22-30.79 28-72 28c-3.73 0-7.43-.13-11.08-.37C170.49 151.77 184 139 184 124v-18.26c29.87 4.45 48 16.53 48 26.26M72 150.25v-23.79A183.74 183.74 0 0 0 96 128a183.74 183.74 0 0 0 24-1.54v23.79A163 163 0 0 1 96 152a163 163 0 0 1-24-1.75m96-40.32V124c0 8.39-12.41 17.4-32 22.87V123.5c12.91-3.13 23.84-7.79 32-13.57M96 56c41.21 0 72 14.78 72 28s-30.79 28-72 28s-72-14.78-72-28s30.79-28 72-28m-72 68v-14.07c8.16 5.78 19.09 10.44 32 13.57v23.37C36.41 141.4 24 132.39 24 124m64 48v-4.17c2.63.1 5.29.17 8 .17c3.88 0 7.67-.13 11.39-.35a121.92 121.92 0 0 0 12.61 3.76v23.46c-19.59-5.47-32-14.48-32-22.87m48 26.25V174.4a179.48 179.48 0 0 0 24 1.6a183.74 183.74 0 0 0 24-1.54v23.79a165.45 165.45 0 0 1-48 0m64-3.38V171.5c12.91-3.13 23.84-7.79 32-13.57V172c0 8.39-12.41 17.4-32 22.87"/></svg>
      }
      <input
      value={value}
        type={type === 'address' ? 'search' : 'number'}
        className="text-base pl-0 pr-4 outline-none block h-[39px] border-none w-full bg-transparent"
        placeholder={placeholder}
        onChange={onChange}
        />
    </button>
  );
};

export default CustomInput;
