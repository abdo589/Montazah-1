
import { toast } from "sonner";

export type Entry = {
  fullName: string;
  idNumber: string;
  phone: string;
  gender: string;
};

const LOCAL_STORAGE_KEY = "registration-entries-v1";

export function saveToLocalStorage(entries: Entry[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
}

export function readFromLocalStorage(): Entry[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

export function exportToExcel(entries: Entry[]) {
  if (entries.length === 0) {
    toast.error("لا توجد بيانات للتصدير");
    return;
  }
  
  const XLSX = require('xlsx');
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
    toast.error("حدث خطأ أثناء تصدير البيانات");
  }
}

