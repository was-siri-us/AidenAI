import { LogOut, Timer } from "lucide-react";
import logo from "../../assets/CausalFunnel.png";
import { useUserContext } from "@/context/UserContext";

const Navbar = ({ time,exit }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Determine color based on time
  const timeColorClass = time < 120 ? "text-red-500" : "text-green-500";
  const { logout } = useUserContext();

  return (
    <div className="h-[60px] w-full bg-white border-b-2 border-grey p-3 flex items-center gap-3 fixed top-0 z-50">
      <img src={logo} alt="CausalFunnel" className="h-[25px]" />
      <div className="text-black text-2xl font-bold font-mono">
        Aiden.ai
      </div>
      {time && (
        
        <div
          className={`text-2xl font-bold font-mono absolute right-[2em] ${timeColorClass} flex gap-2`}
        > 
          <Timer size={27}  className="text-black"/>
          {formatTime(time)}
        </div>
      )}

      {
        exit && (<LogOut  className="absolute right-[2em]" size={20} onClick={logout}/>)
      }
    </div>
  );
};

export default Navbar;
