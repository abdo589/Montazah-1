
import React from "react";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RegistrationForm } from "@/components/RegistrationForm";
import { LABELS } from "@/constants/labels";
import { type Entry, saveToDatabase } from "@/utils/storage";

const Index = () => {
  const handleSubmit = async (newEntry: Entry) => {
    if (await saveToDatabase(newEntry)) {
      toast.success("تم حفظ البيانات بنجاح!");
      // Reset form by forcing a re-render
      window.location.reload();
    } else {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/lovable-uploads/e86c45f7-76ea-4e52-9f70-07075333499f.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#f0f4f8",
        direction: "rtl"
      }}
    >
      <div className="w-full max-w-4xl px-4 mt-8 flex flex-col items-center">
        <div className="mb-8 text-center">
          <div className="bg-white/90 p-4 rounded-lg shadow-md inline-block mb-4">
            <img 
              src="/lovable-uploads/e86c45f7-76ea-4e52-9f70-07075333499f.png" 
              alt="حزب مستقبل وطن" 
              className="h-28 mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">{LABELS.partyTitle}</h1>
          <h2 className="text-xl text-white drop-shadow-md">{LABELS.subTitle} - {LABELS.year}</h2>
        </div>

        <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg px-6 py-8 mb-8">
          <div className="rounded-b-lg bg-blue-600 text-white px-6 py-2 text-lg font-bold flex items-center gap-2 shadow-lg mb-6 -mt-8 mx-auto w-fit">
            <FileText size={20} />
            {LABELS.registerTitle}
          </div>
          
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">{LABELS.title}</h2>
          
          <RegistrationForm onSubmit={handleSubmit} />
          
          <div className="mt-4 text-center">
            <Link to="/login">
              <Button variant="outline" className="w-full">
                عرض البيانات المسجلة
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-4 text-gray-100 text-sm font-medium drop-shadow-md bg-blue-600/50 w-full text-center py-2">
        {LABELS.footer}
      </div>
    </div>
  );
};

export default Index;
