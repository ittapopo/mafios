// import { useState, useEffect, useRef } from "react";

// export default function Game() {
//     const [particles, setParticles] = useState([]);
//     const [score, setScore] = useState(0);
//     const [gameOver, setGameOver] = useState(false);
//     const gameAreaRef = useRef(null);
//     const intervalRef = useRef(null);

//     useEffect(() => {
//         if (gameOver) return;

//         intervalRef.current = setInterval(() => {
//             setParticles((prevParticles) => {
//                 return prevParticles.map((p) => ({ ...p, y: p.y - p.speed }));
//             });

//             const newParticle = {
//                 id: Date.now(),
//                 y: 100,
//                 speed: 1 + Math.random(),
//             };

//             setParticles((prevParticles) => [...prevParticles, newParticle]);
//         }, 1000);

//         return () => clearInterval(intervalRef.current);
//     }, [gameOver]);

//     useEffect(() => {
//         const handleKeyPress = (e) => {
//             if (e.code === "Space" && !gameOver) {
//                 const topParticles = particles.filter((p) => p.y <= 5);
//                 if (topParticles.length > 0) {
//                     setParticles((prevParticles) => prevParticles.filter((p) => p.y > 5));
//                     setScore((prevScore) => prevScore + topParticles.length);
//                 } else {
//                     setGameOver(true);
//                 }
//             }
//         };

//         window.addEventListener("keydown", handleKeyPress);
//         return () => window.removeEventListener("keydown", handleKeyPress);
//     }, [particles, gameOver]);

//     useEffect(() => {
//         if (particles.some((p) => p.y <= 0)) {
//             setGameOver(true);
//         }
//     }, [particles]);

//     const resetGame = () => {
//         setParticles([]);
//         setScore(0);
//         setGameOver(false);
//     };

//     return (
//         <div
//             ref={gameAreaRef}
//             className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white"
//         >
//             <h1 className="text-3xl font-bold mb-4">Circle Particle Game</h1>
//             {gameOver ? (
//                 <div className="text-center">
//                     <p className="text-2xl mb-4">Game Over! Your Score: {score}</p>
//                     <button
//                         onClick={resetGame}
//                         className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
//                     >
//                         Restart
//                     </button>
//                 </div>
//             ) : (
//                 <div className="relative w-64 h-64 border-2 border-white rounded-full">
//                     {particles.map((particle) => (
//                         <div
//                             key={particle.id}
//                             className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full"
//                             style={{ bottom: `${particle.y}%` }}
//                         ></div>
//                     ))}
//                 </div>
//             )}
//             <p className="mt-4">Score: {score}</p>
//         </div>
//     );
// }
