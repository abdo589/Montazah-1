import React, { useEffect, useState } from "react";
import { FileText, Download, Save, Eye } from "lucide-react";
import * as XLSX from "xlsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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
  footer: "© حزب مستقبل وطن 2025 - أمانة الشباب",
  dataTable: "البيانات المسجلة",
  tableNum: "#",
  noData: "لا توجد بيانات مسجلة بعد"
};

type Entry = {
  fullName: string;
  idNumber: string;
  phone: string;
  gender: string;
};

const LOCAL_STORAGE_KEY = "registration-entries-v1";

function saveToLocalStorage(entries: Entry[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
}

function readFromLocalStorage(): Entry[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

const Index = () => {
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(LABELS.male);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const loadedEntries = readFromLocalStorage();
    console.log("Loaded entries:", loadedEntries);
    setEntries(loadedEntries);
  }, []);

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
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    
    const existingEntries = readFromLocalStorage();
    const newEntry = { fullName, idNumber, phone, gender };
    const updated = [...existingEntries, newEntry];
    
    if (saveToLocalStorage(updated)) {
      setEntries(updated);
      setSuccess("تم حفظ البيانات بنجاح!");
      toast.success("تم حفظ البيانات بنجاح!");
      
      setFullName("");
      setIdNumber("");
      setPhone("");
      setGender(LABELS.male);
    } else {
      setError("حدث خطأ أثناء حفظ البيانات");
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const exportToExcel = () => {
    if (entries.length === 0) {
      setError("لا توجد بيانات للتصدير");
      toast.error("لا توجد بيانات للتصدير");
      return;
    }
    
    try {
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
      toast.success("تم تحميل ملف الإكسل بنجاح");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setError("حدث خطأ أثناء تصدير البيانات");
      toast.error("حدث خطأ أثناء تصدير البيانات");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center py-8"
      style={{
        backgroundImage: "url('/lovable-uploads/7c897df9-e478-4779-8ce6-b59b380bbe77.png')",
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f0f4f8",
        direction: "rtl"
      }}
    >
      <div className="w-full max-w-4xl px-4 mt-[220px] sm:mt-[250px] md:mt-[300px] lg:mt-[350px] flex flex-col items-center">
        <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg px-6 py-8 mb-8">
          <div className="rounded-b-lg bg-blue-600 text-white px-6 py-2 text-lg font-bold flex items-center gap-2 shadow-lg mb-6 -mt-8 mx-auto w-fit">
            <FileText size={20} />
            {LABELS.registerTitle}
          </div>
          
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">{LABELS.title}</h2>
          {error && <div className="bg-red-50 text-red-600 text-center p-2 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 text-center p-2 rounded mb-4">{success}</div>}
          
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
              className="w-full bg-green-600 text-white rounded py-3 mt-4 flex items-center justify-center gap-2 text-base hover:bg-green-700 transition"
              onClick={exportToExcel}
            >
              <Download size={18} />
              {LABELS.download}
            </button>
          )}
        </div>
        
        <div className="w-full max-w-4xl bg-white/95 rounded-xl shadow-lg px-6 py-6 mb-8">
          <h3 className="text-lg font-bold mb-4 text-center text-gray-800">{LABELS.dataTable}</h3>
          
          {entries.length > 0 ? (
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">{LABELS.tableNum}</TableHead>
                    <TableHead className="text-right">{LABELS.fullName}</TableHead>
                    <TableHead className="text-right">{LABELS.idNumber}</TableHead>
                    <TableHead className="text-right">{LABELS.phone}</TableHead>
                    <TableHead className="text-right">{LABELS.gender}</TableHead>
                    <TableHead className="text-right">عرض</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow key={`entry-${index}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{entry.fullName}</TableCell>
                      <TableCell>{entry.idNumber}</TableCell>
                      <TableCell>{entry.phone}</TableCell>
                      <TableCell>{entry.gender}</TableCell>
                      <TableCell>
                        <Link 
                          to={`/view/${index + 1}`}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <Eye size={18} />
                          عرض
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">{LABELS.noData}</div>
          )}
        </div>
      </div>
      
      <div className="mt-auto pt-4 text-gray-100 text-sm font-medium drop-shadow-md bg-blue-600/50 w-full text-center py-2">
        {LABELS.footer}
      </div>
    </div>
  );
};

export default Index;
