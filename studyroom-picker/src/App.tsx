import { useState } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";

const femaleSeats = Array.from({ length: 18 }, (_, i) => (i + 1).toString());
const maleSeatsPerClass = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

const usedSeats = {
  female: new Set(),
  male: {
    1: new Set(), 2: new Set(), 3: new Set(),
    4: new Set(), 5: new Set(), 6: new Set(),
  }
};

const saved = [];

export default function StudyRoomPicker() {
  const [gender, setGender] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [assignedSeat, setAssignedSeat] = useState("");
  const [error, setError] = useState("");

  const handleDraw = () => {
    const id = studentId.trim();
    if (!gender || !id || (gender === "male" && !studentClass)) {
      setError("성별, 학번" + (gender === "male" ? ", 반" : "") + "을 모두 입력하세요.");
      return;
    }

    const alreadyAssigned = saved.find(s => s.studentId === id);
    if (alreadyAssigned) {
      setError("이미 좌석을 배정받았습니다.");
      return;
    }

    if (gender === "female") {
      const available = femaleSeats.filter(s => !usedSeats.female.has(s));
      if (available.length === 0) {
        setError("남은 좌석이 없습니다.");
        return;
      }
      const seat = available[Math.floor(Math.random() * available.length)];
      usedSeats.female.add(seat);
      saved.push({ gender: "여", studentId: id, class: "-", seat });
      setAssignedSeat(seat);
    } else {
      const cls = parseInt(studentClass);
      const available = maleSeatsPerClass.filter(s => !usedSeats.male[cls].has(s));
      if (available.length === 0) {
        setError(`${cls}반에 남은 좌석이 없습니다.`);
        return;
      }
      const seat = available[Math.floor(Math.random() * available.length)];
      usedSeats.male[cls].add(seat);
      saved.push({ gender: "남", studentId: id, class: `${cls}반`, seat });
      setAssignedSeat(seat);
    }
    setError("");
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(saved);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "정독실좌석배정");
    XLSX.writeFile(workbook, "studyroom_seat_assignments.xlsx");
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">정독실 좌석 뽑기</h2>

      <div className="mb-2">
        <label className="mr-4">
          <input type="radio" name="gender" value="female" onChange={(e) => setGender(e.target.value)} /> 여학생
        </label>
        <label>
          <input type="radio" name="gender" value="male" onChange={(e) => setGender(e.target.value)} /> 남학생
        </label>
      </div>

      {gender === "male" && (
        <input
          type="number"
          placeholder="반 (1~6)"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
      )}

      <input
        type="text"
        placeholder="학번을 입력하세요"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />

      <button onClick={handleDraw} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        좌석 뽑기
      </button>

      {assignedSeat && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-green-600 font-semibold"
        >
          당신의 좌석은 <u>{assignedSeat}번</u>입니다.
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-red-500"
        >
          {error}
        </motion.div>
      )}

      <button onClick={handleDownload} className="mt-6 border px-4 py-2 rounded w-full">
        엑셀 다운로드
      </button>
    </div>
  );
}
import StudyRoomPicker from './StudyRoomPicker';

function App() {
  return (
    <div className="App">
      <StudyRoomPicker />
    </div>
  );
}

export default App;
