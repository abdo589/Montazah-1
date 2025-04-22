
import React, { useEffect, useState } from "react";
import { FileText, Save } from "lucide-react";
import * as XLSX from "xlsx";

// Arabic labels
const LABELS = {
  title: "نموذج تسجيل بيانات",
  fullName: "الاسم الكامل",
  idNumber: "رقم الهوية",
  phone: "رقم الهاتف",
  gender: "الجنس",
  male: "ذكر",
  female: "أنثى",
  placeholderName: "أدخل الاسم الكامل",
  placeholderID: "أدخل رقم الهوية المكون من 14 رقمًا",
  placeholderPhone: "أدخل رقم الهاتف المكون من 11 رقمًا",
  save: "حفظ البيانات",
  download: "تحميل ملف اكسل",
  registerTitle: "تسجيل بيانات جديدة",
  footer: "© حزب مستقبل وطن 2025 - أمانة الشباب"
};

type Entry = {
  fullName: string;
  idNumber: string;
  phone: string;
  gender: string;
};

const LOCAL_STORAGE_KEY = "registration-entries-v1";

function saveToLocalStorage(entries: Entry[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
}

function readFromLocalStorage(): Entry[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const Index = () => {
  // Form state
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(LABELS.male);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    setEntries(readFromLocalStorage());
  }, []);

  // Input validation for Egypt
  const validate = () => {
    if (!fullName.trim()) return "يرجى إدخال الاسم الكامل";
    if (!/^\d{14}$/.test(idNumber)) return "رقم الهوية يجب أن يكون 14 رقمًا";
    if (!/^\d{11}$/.test(phone)) return "رقم الهاتف يجب أن يكون 11 رقمًا";
    if (gender !== LABELS.male && gender !== LABELS.female)
      return "يرجى تحديد الجنس";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    const newEntry = { fullName, idNumber, phone, gender };
    const updated = [...entries, newEntry];
    setEntries(updated);
    saveToLocalStorage(updated);
    setSuccess("تم حفظ البيانات بنجاح!");
    setFullName("");
    setIdNumber("");
    setPhone("");
    setGender(LABELS.male);
  };

  // Excel export (using sheetjs)
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(entries.map((e, i) => ({
      "#": i + 1,
      "الاسم الكامل": e.fullName,
      "رقم الهوية": e.idNumber,
      "رقم الهاتف": e.phone,
      "الجنس": e.gender,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "بيانات");
    XLSX.writeFile(wb, "بيانات_التسجيل.xlsx");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/lovable-uploads/950a7c66-9720-4688-a448-206f98014933.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        direction: "rtl"
      }}
    >
      {/* Floating title */}
      <div className="relative w-full flex justify-center" style={{ top: "-40px" }}>
        <div className="rounded-b-lg bg-blue-600 text-white px-8 py-2 text-lg font-bold flex items-center gap-2 shadow-lg">
          <FileText size={24} />
          {LABELS.registerTitle}
        </div>
      </div>
      {/* Form Card */}
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-lg px-8 py-10 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">{LABELS.title}</h2>
        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">{LABELS.fullName}</label>
            <input
              className="bg-gray-100 px-4 py-3 rounded placeholder:text-gray-400 focus:outline-blue-400"
              type="text"
              placeholder={LABELS.placeholderName}
              value={fullName}
              dir="rtl"
              onChange={e => setFullName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">{LABELS.idNumber}</label>
            <input
              className="bg-gray-100 px-4 py-3 rounded placeholder:text-gray-400 focus:outline-blue-400"
              type="text"
              placeholder={LABELS.placeholderID}
              value={idNumber}
              inputMode="numeric"
              maxLength={14}
              dir="rtl"
              onChange={e => setIdNumber(e.target.value.replace(/\D/g, ""))}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">{LABELS.phone}</label>
            <input
              className="bg-gray-100 px-4 py-3 rounded placeholder:text-gray-400 focus:outline-blue-400"
              type="text"
              placeholder={LABELS.placeholderPhone}
              value={phone}
              inputMode="numeric"
              maxLength={11}
              dir="rtl"
              onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">{LABELS.gender}</label>
            <select
              className="bg-gray-100 px-4 py-3 rounded focus:outline-blue-400"
              value={gender}
              onChange={e => setGender(e.target.value)}
              dir="rtl"
            >
              <option>{LABELS.male}</option>
              <option>{LABELS.female}</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-3 mt-1 flex items-center justify-center gap-2 text-lg hover:bg-blue-700 transition"
          >
            <Save size={20} />
            {LABELS.save}
          </button>
        </form>
        {entries.length > 0 && (
          <button
            className="w-full bg-green-600 text-white rounded py-3 mt-2 flex items-center justify-center gap-2 text-base hover:bg-green-700 transition"
            onClick={exportToExcel}
          >
            <FileText size={18} />
            {LABELS.download}
          </button>
        )}
      </div>
      {/* Footer */}
      <div className="mt-8 text-gray-100 text-sm font-medium drop-shadow-md">{LABELS.footer}</div>
    </div>
  );
};

export default Index;
