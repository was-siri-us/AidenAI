import * as he from "he";
import clsx from "clsx";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/myUi/Navbar";
import { useLocation } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";
import CircularProgress from "@mui/joy/CircularProgress";
const Results = () => {
  const location = useLocation();
  const { quiz } = location.state;
  const { user } = useUserContext();
  const [quote, setQuote] = useState(null);
  const [report, setReport] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`${API_URL}/api/quiz/results`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quiz }),
        });
        const data = await res.json();
        setReport(data);
        setScore(data.score);

      } catch (err) {
        console.log(err);
      }
    }

    fetchResults();
  }, [quiz]);

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Navbar exit={'exit'}/>
      <div className="w-[90%] mt-[60px] ">
        {report && (
          <>
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-md p-5 m-2 md:w-[50%] flex justify-between w-[95%] flex ">
                <h1 className="flex items-center gap-2 text-slate-500 font-bold">
                  <User size={20} />
                  <p className="md:text-md text-sm">{user.email}</p>
                </h1>
                <h1 className="flex items-center gap-2 text-slate-500 font-bold">
                    <p className={` hidden md:block`}>score:</p>
                  <CircularProgress color="success" size="md" determinate value={100* score/report.report.length}>{score}/{report.report.length}</CircularProgress>
                </h1>
              </div>
              {report.report.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-md p-5 m-2 md:w-[50%] flex flex-col items-center w-[95%]"
                >
                  <h1 className="mb-2">{he.decode(q.question)}</h1>
                  <div
                    className={
                      "bg-green-200 rounded-md p-2 mb-2 lg:w-[80%] w-full"
                    }
                  >
                    <p className="text-xs text-slate-400">Correct Answer</p>
                    <p className="text-sm ">{he.decode(q.correctAnswer)}</p>
                  </div>
                  
                  <div
                    className={clsx(
                      "rounded-md p-2 mb-2 lg:w-[80%] w-full",
                      q.correctAnswer === q.selectedAnswer
                        ? "bg-green-200"
                        : "bg-red-200"
                    )}
                  >
                    <p className="text-xs text-slate-400">Your Answer</p>
                    <p className="text-sm ">
                      {he.decode(q.selectedAnswer ? q.selectedAnswer : "None")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
