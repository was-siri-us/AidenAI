import * as he from "he";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Navbar from "@/components/myUi/Navbar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/UserContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [idx, setIdx] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [quiz, setQuiz] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const { logout } = useUserContext();
  const navigate = useNavigate();

  // fetch questions
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`${API_URL}/api/quiz/start-quiz`);
        const data = await res.json();
        const mcqs = data.map((q, idx) => {
          return {
            idx: idx,
            _id: q._id,
            question: q.question,
            options: q.options,
            answer: "",
            status: "unvisited",
          };
        });
        setQuiz(mcqs);
        console.log(mcqs);
        setIdx(0);
      } catch (err) {
        console.log(err);
      }
    }
    fetchQuiz();
  }, []);

  // mark visited questions
  useEffect(() => {
    if (!quiz) return;
    setQuiz((prevQuiz) =>
      prevQuiz.map((q) =>
        q.idx === idx && q.status === "unvisited"
          ? { ...q, status: "unanswered" }
          : q
      )
    );
  }, [idx]);

  //timer
  useEffect(() => {
    if (timeLeft <= 0 || quizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setQuizFinished(true); // Automatically finish the quiz when time runs out
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount or when timeLeft reaches 0
  }, [timeLeft, quizFinished]);

  // Logout on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      logout();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [logout]);

  const handleOptionClick = (selectedOption) => {
    setQuiz((prevQuiz) =>
      prevQuiz.map((q) =>
        q.idx === idx
          ? {
              ...q,
              answer: selectedOption,
              status: "answered",
            }
          : q
      )
    );
  };

  const handleOptionClear = () => {
    setQuiz((prevQuiz) =>
      prevQuiz.map((q) =>
        q.idx === idx
          ? {
              ...q,
              answer: "",
              status: "unanswered",
            }
          : q
      )
    );
  };

  const handleSubmit = () => {
    navigate("/results", { state: { quiz } }); // Navigate to the /results page and pass the quiz data
  };

  return (
    <div className="w-full h-[60%] lg:mt-[0px] mt-[60px] flex flex-col items-center justify-bottom">
      <Navbar time={timeLeft} />
      {quiz && (
        <>
          <div className="flex lg:w-[80%] w-full justify-center">
            <div className="mt-[10%]  lg:w-[100%]">
              <div className="font-bold p-3">
                {he.decode(quiz[idx].question)}
              </div>
              <div>
                {quiz[idx].options.map((opt, index) => (
                  <div
                    key={index}
                    className={`p-3 my-2 cursor-pointer m-2 rounded-md hover:bg-gray-200 ${
                      quiz[idx].answer === opt
                        ? "border-2 border-green-500"
                        : "border border-gray-300"
                    }`}
                    onClick={() => handleOptionClick(opt)}
                  >
                    {he.decode(opt)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between p-3 lg:w-[80%] w-full">
            <Button
              className="px-7 mt-10 border-2"
              variant="secondary"
              onClick={handleOptionClear}
            >
              Clear
            </Button>
            {idx === quiz?.length - 1 ? (
              <Dialog>
                <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-10 rounded-md text-sm">
                  Submit
                </DialogTrigger>
                <DialogContent className="lg:w-[60%] w-[80%] rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Are sure you want to submit?</DialogTitle>
                    <DialogDescription className="mb-10">
                      Once you submit, you cannot change your answers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex justify-center">
                    <DialogClose asChild onClick={handleSubmit}>
                      <Button className="px-7" onClick={handleSubmit}>
                        Confirm
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button className="px-7 mt-10" onClick={() => setIdx(idx + 1)}>
                Next
              </Button>
            )}
          </div>

          <div className="lg:w-[80%] w-full p-3 flex flex-wrap absolute bottom-[60px] gap-2 justify-center">
            {quiz.map((q, index) => (
              <div
                key={`nav-${index}`}
                className={clsx(
                  "border-2 w-[25px] text-center text-sm font-bold rounded-full cursor-pointer",
                  {
                    "bg-white border-gray-300": q.status === "unvisited",
                    "bg-yellow-400 border-yellow-500":
                      q.status === "unanswered",
                    "bg-green-400 border-green-500": q.status === "answered",
                  }
                )}
                onClick={() => setIdx(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
