import { useState } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import "./App.css"; // 기본 스타일 유지

const allCodes = [
  "XNEB", "FT3Q", "ZK0H", "C89F", "LLIH", "A9UQ", "S0E2", "97BK", "AOIJ", "97IH"
  // 필요한 코드 더 추가 가능
];

const usedCodes = new Set<string>();
const savedAssignments: { studentId: string; code: string }[] = [];

function App() {
  const [studentId, setStudentId] = useState("");
  const [assignedCode, setAssignedCode] = useState("");
  const [error, setError] = useState("");

  const handleDraw = () => {
    const id = studentId.trim();
    if (!id) {
      setError("학번을 입력해주세요.");
      return;
    }
    if (usedCodes.has(id)) {
      setError("이미 뽑은 학번입니다.");
      return;
    }
    const available = allCodes.filter((code) => !usedCodes.has(code));
    if (available.length === 0) {
      setError("모든 코드가 소진되었습니다.");
      return;
    }
    const code = available[Math.floor(Math.random() * available.length)];
    usedCodes.add(code);
    usedCodes.add(id);
    savedAssignments.push({ studentId: id, code });
    setAssignedCode(code);
    setError("");
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(savedAssignments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "배정결과");
    XLSX.writeFile(workbook, "room_assignments.xlsx");
  };

  return (
    <div className="App" style={{ maxWidth: "400px", margin: "40px auto", textAlign: "center" }}>
      <h2>방 배정 코드 뽑기</h2>
      <input
        type="text"
        placeholder="학번을 입력하세요"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleDraw} style={{ padding: "10px", width: "100%" }}>
        코드 뽑기
      </button>

      {assignedCode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: "20px", color: "green", fontWeight: "bold" }}
        >
          당신의 배정 코드는: <u>{assignedCode}</u>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: "20px", color: "red" }}
        >
          {error}
        </motion.div>
      )}

      <button onClick={handleDownload} style={{ marginTop: "30px", padding: "10px", width: "100%" }}>
        엑셀로 결과 다운로드
      </button>
    </div>
  );
}

export default App;