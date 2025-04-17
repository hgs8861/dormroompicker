import { useState } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import "./App.css";

const maleCodes = [
  "XNEB", "FT3Q", "ZK0H", "C89F", "LLIH", "A9UQ", "S0E2", "97BK", "AOIJ", "97IH",
  // 총 70명용 코드 중 일부 예시, 2개는 1인실, 68개는 2인실(34쌍)으로 구성 필요
];

const femaleCodes = [
  "WXYZ", "LKJD", "MNOP", "QWER", "ASDF", "ZXCV", "TYUI", "BNML",
  // 총 17명용 코드 중 일부 예시, 1개는 1인실, 16개는 2인실(8쌍)으로 구성 필요
];

const usedCodes = new Set<string>();
const usedIds = new Set<string>();
const savedAssignments: { gender: string; studentId: string; code: string }[] = [];

function App() {
  const [studentId, setStudentId] = useState("");
  const [gender, setGender] = useState("");
  const [assignedCode, setAssignedCode] = useState("");
  const [error, setError] = useState("");

  const handleDraw = () => {
    const id = studentId.trim();
    if (!id || !gender) {
      setError("성별과 학번을 모두 입력하세요.");
      return;
    }
    if (usedIds.has(id)) {
      setError("이미 뽑은 학번입니다.");
      return;
    }
    const pool = gender === "male" ? maleCodes : femaleCodes;
    const available = pool.filter((code) => !usedCodes.has(code));
    if (available.length === 0) {
      setError("남은 코드가 없습니다.");
      return;
    }
    const code = available[Math.floor(Math.random() * available.length)];
    usedCodes.add(code);
    usedIds.add(id);
    savedAssignments.push({ gender, studentId: id, code });
    setAssignedCode(code);
    setError("");
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(savedAssignments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "배정결과");
    XLSX.writeFile(workbook, "room_assignments_by_gender.xlsx");
  };

  return (
    <div className="App" style={{ maxWidth: "400px", margin: "40px auto", textAlign: "center" }}>
      <h2>방 배정 코드 뽑기</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <input type="radio" name="gender" value="male" onChange={(e) => setGender(e.target.value)} /> 남자
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input type="radio" name="gender" value="female" onChange={(e) => setGender(e.target.value)} /> 여자
        </label>
      </div>

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