
const Header = ({ title }) => {
    return (
      <div className="w-full bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">{title}</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    );
  };
  
  export default Header;