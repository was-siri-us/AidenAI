import { Button } from "./components/ui/button";
import Navbar from "./components/myUi/Navbar";
function App() {

  function handleClick() {
    console.log("Button clicked");
  }
  return (
    <>
      <Navbar />
      <div className="w-full h-screen">
        <h1 className="text-3xl font-bold">Hello world!</h1>
        <div className="w-full h-full bg-red-500"></div>
        <div className="w-full h-full bg-pink-500"></div>
        <div className="w-full h-full bg-red-500"></div>
        <div className="w-full h-full bg-pink-500"></div>
      </div>
    </>
  );
}

export default App;
