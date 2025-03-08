import "./App.css";
import { toast } from "sonner";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/myUi/Navbar";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/UserContext";

function App() {
  const [email, setEmail] = useState("");
  const { login } = useUserContext();
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleStart = () => {
    if (!email) {
      toast.error("Email is required!");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    login(email);
    navigate("/quiz");
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Navbar />
      <Card className="w-[350px] p-8">
        <h1 className="text-3xl font-bold px-1">Start Quiz</h1>
        <p className="text-slate-500 pt-2 px-1 text-sm">
          Enter your email address to begin the Quiz
        </p>
        <Input
          className="mt-2"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <Button className="mt-4 w-full" onClick={handleStart}>
          Start
        </Button>
      </Card>
    </div>
  );
}

export default App;
