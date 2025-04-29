
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { supabase } from "@/integrations/supabase/client";

export type Entry = {
  fullName: string;
  idNumber: string;
  phone: string;
  gender: string;
};

export async function saveToDatabase(entry: Entry) {
  try {
    const { error } = await supabase
      .from('registrations')
      .insert({
        full_name: entry.fullName,
        id_number: entry.idNumber,
        phone: entry.phone,
        gender: entry.gender
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving to database:", error);
    return false;
  }
}

export async function readFromDatabase(): Promise<Entry[]> {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(record => ({
      fullName: record.full_name,
      idNumber: record.id_number,
      phone: record.phone,
      gender: record.gender
    }));
  } catch (error) {
    console.error("Error reading from database:", error);
    return [];
  }
}

export function exportToExcel(entries: Entry[]) {
  if (entries.length === 0) {
    toast.error("لا توجد بيانات للتصدير");
    return;
  }
  
  try {
    // Create worksheet with Arabic data
    const ws = XLSX.utils.json_to_sheet(entries.map((e, i) => ({
      "#": i + 1,
      "الاسم الكامل": e.fullName,
      "رقم الهوية": e.idNumber,
      "رقم الهاتف": e.phone,
      "الجنس": e.gender,
    })));
    
    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "بيانات");
    
    // Write file using the writeFile utility
    XLSX.writeFile(wb, "بيانات_التسجيل.xlsx");
    toast.success("تم تحميل ملف الإكسل بنجاح");
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    toast.error("حدث خطأ أثناء تصدير البيانات");
  }
}
