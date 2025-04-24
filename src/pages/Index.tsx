
import React, { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { RegistrationForm } from "@/components/RegistrationForm";
import { EntriesTable } from "@/components/EntriesTable";
import { LABELS } from "@/constants/labels";
import { type Entry, saveToLocalStorage, readFromLocalStorage, exportToExcel } from "@/utils/storage";

const Index = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showData, setShowData] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const loadedEntries = readFromLocalStorage();
    console.log("Loaded entries:", loadedEntries);
    setEntries(loadedEntries);
  }, []);

  const handleSubmit = (newEntry: Entry) => {
    const updated = [...entries, newEntry];
    if (saveToLocalStorage(updated)) {
      setEntries(updated);
      toast.success("تم حفظ البيانات بنجاح!");
    } else {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === "admin123") {
      setIsAuthorized(true);
      toast.success("تم تسجيل الدخول بنجاح");
    } else {
      toast.error("كلمة المرور غير صحيحة");
    }
  };

  const handleToggleData = () => {
    if (!isAuthorized) {
      toast.error("يجب إدخال كلمة المرور أولاً");
      return;
    }
    setShowData(!showData);
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
          
          <RegistrationForm onSubmit={handleSubmit} />
          
          {entries.length > 0 && (
            <button
              className="w-full bg-green-600 text-white rounded py-3 mt-4 flex items-center justify-center gap-2 text-base hover:bg-green-700 transition"
              onClick={() => exportToExcel(entries)}
            >
              <Download size={18} />
              {LABELS.download}
            </button>
          )}
        </div>
        
        <EntriesTable
          entries={entries}
          isAuthorized={isAuthorized}
          showData={showData}
          onToggleData={handleToggleData}
          onPasswordSubmit={handlePasswordSubmit}
        />
      </div>
      
      <div className="mt-auto pt-4 text-gray-100 text-sm font-medium drop-shadow-md bg-blue-600/50 w-full text-center py-2">
        {LABELS.footer}
      </div>
    </div>
  );
};

export default Index;

