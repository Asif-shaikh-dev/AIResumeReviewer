import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);

  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);




  const handleSubmit = async () => {
    if (!resume || !jobDesc) {
      toast.error("Please fill in both Resume and Job Description.");
      return;
    }
    setLoading(true);
    setAnalysis(null);
    //  
    //http://localhost:5000
    try {
      const res = await fetch(" https://airesumereviewer-6.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: resume, jobDescription: jobDesc }),
      });
      const data = await res.json();
      setAnalysis(data);
      toast.success("Analysis completed successfully!");
    } catch {
      toast.error("Failed to fetch analysis. Please try again.");
    } finally {

      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className="min-h-screen p-6 max-w-3xl mx-auto bg-transparent  transition-colors duration-500 relative"
      >
        {/* /* Dark Mode Toggle Button on top right */}
        <div className="sticky top-0 right-0 z-10  flex justify-end p-4 ">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-[2vw] py-[1vh] text-[3vw] md:text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>



        <h1 className="text-3xl font-bold mb-6 text-center ">
          AI Resume Reviewer
        </h1>

        <textarea
          placeholder="Paste Resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={10}
          className={`w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500  dark:border-gray-600 ${darkMode ? "text-white" : "text-black"}`}
        />

        <textarea
          placeholder="Paste Job Description"
          onChange={(e) => setJobDesc(e.target.value)}
          rows={6}
          className="w-full h-20 p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500  dark:border-gray-600 "
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 cursor-pointer ${darkMode ? 'text-white' : 'text-white'} rounded-lg font-semibold  transition ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-600"
            }`}
        >
          {loading ? (
            <div className="flex cursor-not-allowed justify-center items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>Analyzing...</span>
            </div>
          ) : (
            "Analyze"
          )}

        </button>
        {analysis && (
  <div className={`mt-6 space-y-4`}>
    {/* ATS Score */}
    <div className={`p-4 rounded shadow border-1 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">📊 ATS Score:</h3>
      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
        <span className={`${analysis.score >= 75 ? 'text-green-400' : 'text-red-400'}`}>{analysis.score || 0}</span>/100
      </p>
    </div>

    {/* Missing Skills */}
    <div className={`p-4 rounded shadow border-1 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">🚫 Missing Skills:</h3>
      <ul className="list-disc list-inside">
        {(analysis.missingSkills || []).map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>

    {/* Feedback */}
    <div className={`p-4 rounded shadow border-1 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">💡 Feedback:</h3>
      <p>{analysis.feedback}</p>
    </div>

    {/* Improved Resume */}
    <div className={`relative p-4 rounded shadow border-1 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      {/* ... your copy button code ... */}
      <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">✅ Improved Resume:</h3>
      <pre className="whitespace-pre-wrap">{analysis.improvedResume}</pre>
    </div>
  </div>
)}


        <ToastContainer position="top-right" autoClose={3000}
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"  />
      </div>
    </div>

  );
}

export default App;
